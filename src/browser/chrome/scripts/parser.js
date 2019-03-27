const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

// declare functions to insert
function useReducer(reducer, initialArg, init) {
  function reducerWithTracker(state, action) {
    const newState = reducer(state, action);
    timeTravelLList.tail.value.actionDispatched = true;
    window.postMessage({
      type: 'DISPATCH',
      data: {
        state: newState,
        prevState: state,
        action,
      },
    });
    return newState;
  }

  return useReducerOriginal(reducerWithTracker, initialArg, init);
}

function commitWork(current, nextEffect) {
  timeTravelLList.append({
    primaryEffectTag: 'UPDATE',
    effect: _.cloneDeep(nextEffect),
    current: _.cloneDeep(current),
  });

  return commitWorkOriginal(current, nextEffect);
}

function commitDeletion(nextEffect) {
  timeTravelLList.append({
    primaryEffectTag: 'DELETION',
    effect: _.cloneDeep(nextEffect),
  });

  return commitDeletionOriginal(nextEffect);
}

function commitPlacement(nextEffect) {
  if (Object.keys(funcStorage).length === 0) {
    funcStorage.commitDeletion = commitDeletionOriginal;
    funcStorage.commitPlacement = commitPlacementOriginal;
    funcStorage.commitWork = commitWorkOriginal;
    funcStorage.prepareUpdate = prepareUpdate;
  }

  timeTravelLList.append({
    primaryEffectTag: 'PLACEMENT',
    effect: _.cloneDeep(nextEffect),
  });

  return commitPlacementOriginal(nextEffect);
}

// library key inside of bundle
const reactLibraryPath = './node_modules/react/cjs/react.development.js';
const reactDOMLibraryPath = './node_modules/react-dom/cjs/react-dom.development.js';

function traverseTree(funcReplacements, ast) {
  // traverse ast to find method, change name and insert funtion replacement
  // funcReplacements is an object of {functionName: function} pairs that must
  // be updated on the AST.
  const funcReplacementNames = Object.keys(funcReplacements);

  estraverse.replace(ast, {
    enter(node, parent) {
      if (node.type === 'FunctionDeclaration' && funcReplacementNames.includes(node.id.name)) {
        parent.body.push(funcReplacements[node.id.name].body[0]);
        node.id.name += 'Original';
      }
    },
  });
}

function traverseBundledTree(funcReplacements, ast, library) {
  estraverse.traverse(ast, {
    enter(node) {
      if (node.key && node.key.value === library && node.value.body.body[1].type === 'ExpressionStatement'
        && node.value.body.body[1].expression.callee.name === 'eval') {
        const funcReplacementNames = Object.keys(funcReplacements);

        // create new ast 
        const reactLib = esprima
          .parseScript(node.value.body.body[1].expression.arguments[0].value);

        estraverse.traverse(reactLib, {
          enter(libNode, parent) {
            if (libNode.type === 'FunctionDeclaration' && funcReplacementNames.includes(libNode.id.name)) {
              parent.body.push(funcReplacements[libNode.id.name].body[0]);
              libNode.id.name += 'Original';
            }
          },
        });

        node.value.body.body[1].expression.arguments[0].value = escodegen.generate(reactLib);
        node.value.body.body[1].expression.arguments[0].raw = JSON
          .stringify(escodegen.generate(reactLib));
      }
    },
  });
}

const parseAndGenerate = (codeString) => {
  if (codeString.search('react') === -1) return codeString;

  const ast = esprima.parseModule(codeString);

  const injectableCommitWork = esprima.parseScript(commitWork.toString());
  const injectableCommitDeletion = esprima.parseScript(commitDeletion.toString());
  const injectableCommitPlacement = esprima.parseScript(commitPlacement.toString());
  const injectableUseReducer = esprima.parseScript(useReducer.toString());

  const funcReplacements = {
    useReducer: injectableUseReducer,
    commitWork: injectableCommitWork,
    commitPlacement: injectableCommitPlacement,
    commitDeletion: injectableCommitDeletion,
  };

  // Webpack bundle is wrapped in function call
  if (ast.body[0].expression.type === 'CallExpression') {
    // TODO: better way to identify react or react-dom library. No need to
    // traverse the AST twice.
    traverseBundledTree({ useReducer: injectableUseReducer }, ast, reactLibraryPath);
    traverseBundledTree(funcReplacements, ast, reactDOMLibraryPath);
  } else {
    traverseTree(funcReplacements, ast);
  }

  return escodegen.generate(ast);
};
module.exports = parseAndGenerate;
