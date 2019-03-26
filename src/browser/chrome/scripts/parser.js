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
  if (Object.keys(funcStorage).length === 0) {
    funcStorage.commitDeletion = commitDeletionOriginal;
    funcStorage.commitPlacement = commitPlacementOriginal;
    funcStorage.commitWork = commitWorkOriginal;
    funcStorage.prepareUpdate = prepareUpdate;
  }

  timeTravelLList.append({
    primaryEffectTag: 'UPDATE',
    effect: _.cloneDeep(nextEffect),
    current: _.cloneDeep(current),
  });

  return commitWorkOriginal(current, nextEffect);
}

function commitDeletion(nextEffect) {
  if (Object.keys(funcStorage).length === 0) {
    funcStorage.commitDeletion = commitDeletionOriginal;
    funcStorage.commitPlacement = commitPlacementOriginal;
    funcStorage.commitWork = commitWorkOriginal;
    funcStorage.prepareUpdate = prepareUpdate;
  }

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

function commitAllHostEffectsReplacement() {
  if (Object.keys(funcStorage).length === 0) {
    funcStorage.commitDeletion = commitDeletion;
    funcStorage.commitPlacement = commitPlacement;
    funcStorage.commitWork = commitWork;
    funcStorage.prepareUpdate = prepareUpdate;
  }

  while (nextEffect !== null) {
    {
      setCurrentFiber(nextEffect);
    }
    recordEffect();

    const { effectTag } = nextEffect;

    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    if (effectTag & Ref) {
      const current$$1 = nextEffect.alternate;
      if (current$$1 !== null) {
        commitDetachRef(current$$1);
      }
    }

    const primaryEffectTag = effectTag & (Placement | Update | Deletion);
    switch (primaryEffectTag) {
      case Placement:
      {
        // editbyme
        timeTravelLList.append({
          primaryEffectTag: 'PLACEMENT',
          effect: _.cloneDeep(nextEffect),
        });

        commitPlacement(nextEffect);

        nextEffect.effectTag &= ~Placement;
        break;
      }
      case PlacementAndUpdate:
      {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        const _current = nextEffect.alternate;
        commitWork(_current, nextEffect);
        break;
      }
      case Update:
      {
        // editbyme
        timeTravelLList.append({
          primaryEffectTag: 'UPDATE',
          effect: _.cloneDeep(nextEffect),
          current: _.cloneDeep(nextEffect.alternate),
        });

        const _current2 = nextEffect.alternate;
        commitWork(_current2, nextEffect);
        break;
      }
      case Deletion:
      {
        // editbyme
        timeTravelLList.append({
          primaryEffectTag: 'DELETION',
          effect: _.cloneDeep(nextEffect),
        });

        commitDeletion(nextEffect);
        break;
      }
    }
    nextEffect = nextEffect.nextEffect;
  }

  {
    resetCurrentFiber();
  }
}

// method names
const USEREDUCER = 'useReducer';
const COMMITALLHOSTEFFECTS = 'commitAllHostEffects';

// library key inside of bundle
const reactLibraryPath = './node_modules/react/cjs/react.development.js';
const reactDOMLibraryPath = './node_modules/react-dom/cjs/react-dom.development.js';

// get replacer method 
let injectableUseReducer = esprima.parseScript(useReducer.toString());
let injectableCommitAllHostEffects = esprima.parseScript(
  commitAllHostEffectsReplacement.toString(),
);

// traverse ast to find method and replace body with our node's body
function traverseTree(replacementNode, functionName, ast) {
  estraverse.replace(ast, {
    enter(node, parent) {
      if (node.type === 'FunctionDeclaration' && node.id.name === functionName) {
        parent.body.push(replacementNode.body[0]);
        node.id.name += 'Original';
      }
    },
  });
}

function traverseBundledTree(replacementNode, functionName, ast, library) {
  estraverse.traverse(ast, {
    enter(node) {
      if (node.key && node.key.value === library) {
        if (node.value.body.body[1].type === 'ExpressionStatement') {
          if (node.value.body.body[1].expression.callee.name === 'eval') {
            // create new ast 
            const reactLib = esprima.parseScript(node.value.body.body[1].expression.arguments[0].value);
            estraverse.traverse(reactLib, {
              enter(libNode, parent) {
                if (libNode.type === 'FunctionDeclaration') {
                  if (libNode.id.name === functionName) {
                    parent.body.push(replacementNode.body[0]);
                    libNode.id.name += 'Original';
                  }
                }
              },
            });
            node.value.body.body[1].expression.arguments[0].value = escodegen.generate(reactLib);
            node.value.body.body[1].expression.arguments[0].raw = JSON.stringify(escodegen.generate(reactLib));
          }
        }
      }
    },
  });
}

const parseAndGenerate = (codeString) => {
  if (codeString.search('react') === -1) return codeString;

  const injectableCommitWork = esprima.parseScript(commitWork.toString());
  const injectableCommitDeletion = esprima.parseScript(commitDeletion.toString());
  const injectableCommitPlacement = esprima.parseScript(commitPlacement.toString());
  const ast = esprima.parseModule(codeString);

  // Webpack bundle is wrapped in function call
  if (ast.body[0].expression.type === 'CallExpression') {
    traverseBundledTree(injectableUseReducer, USEREDUCER, ast, reactLibraryPath);
    traverseBundledTree(injectableCommitWork, 'commitWork', ast, reactDOMLibraryPath);
    traverseBundledTree(injectableCommitDeletion, 'commitDeletion', ast, reactDOMLibraryPath);
    traverseBundledTree(injectableCommitPlacement, 'commitPlacement', ast, reactDOMLibraryPath);
  } else {
    // parse react-dom code   
    traverseTree(injectableCommitWork, 'commitWork', ast);
    traverseTree(injectableCommitDeletion, 'commitDeletion', ast);
    traverseTree(injectableCommitPlacement, 'commitPlacement', ast);

    // parse react code
    injectableUseReducer = esprima.parseScript(useReducer.toString());
    traverseTree(injectableUseReducer, 'useReducer', ast);
  }
  const code = escodegen.generate(ast);
  return code;
};
module.exports = parseAndGenerate;
