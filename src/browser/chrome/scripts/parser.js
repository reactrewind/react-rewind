const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const _ = require('lodash');

// declare functions to insert
function useReducerReplacement() {
  const dispatcher = resolveDispatcher();
  function reducerWithTracker(state, action) {
    const newState = reducer(state, action);
    timeTravelLList.tail.value.actionDispatched = true;
    window.postMessage({
      type: 'DISPATCH',
      data: {
        state: newState,
        action,
      },
    });
    return newState;
  }
  return dispatcher.useReducer(reducerWithTracker, initialArg, init);
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
// regex method signatures
const uRsig = new RegExp(/\b(useReducer)\b\(reducer, initialArg, init\)/);
const cAHEsig = new RegExp(/\b(function)\b\s\b(commitAllHostEffects)\b\(\)/, 'g');
// method names
const USEREDUCER = 'useReducer';
const COMMITALLHOSTEFFECTS = 'commitAllHostEffects';
// library key inside of bundle
const reactLibraryPath = './node_modules/react/cjs/react.development.js';
const reactDOMLibraryPath = './node_modules/react-dom/cjs/react-dom.development.js';
// get replacer method 
let injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
const injectableUseReducerString = escodegen.generate(injectableUseReducer.body[0].body);

let injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());
const injectableCommitAllHostEffectsString = escodegen.generate(injectableCommitAllHostEffects.body[0].body);

// traverse ast to find method and replace body with our node's body
function traverseTree(replacementNode, functionName, ast) {
  console.log('unbundled traverse called');
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'FunctionDeclaration') {
        if (node.id.name === functionName) {
          node.body = replacementNode.body[0].body;
          console.log('From parser. REPLACING!', node.id.name);
        }
      }
    },
  });
}
function stringParser(string, newBody, methodSig) {
  const stack = [];
  const foundMethod = methodSig.test(string);
  let oldBody = '';
  let output;
  for (let i = methodSig.lastIndex; i < string.length; i++) {
    if (foundMethod) {
      if (string[i] === '{') {
        stack.push(string[i]);
      }
      if (stack.length > 0 && stack[stack.length - 1] === '{' && string[i] === '}') {
        stack.pop();
        oldBody += string[i];
        output = string.replace(oldBody, newBody);
        break;
      }
      if (stack.length > 0) {
        oldBody += string[i];
      }
    }
  }
  return output;
}
function traverseBundledTree(replacementNode, functionName, ast, library) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.key && node.key.value === library) {
        if (node.value.body.body[1].type === 'ExpressionStatement') {
          if (node.value.body.body[1].expression.callee.name === 'eval') {
           // create new ast 
            // const reactLib = esprima.parseScript(node.value.body.body[1].expression.arguments[0].value, { range: true, tokens: true, comment: true });
            const reactLib = esprima.parseScript(node.value.body.body[1].expression.arguments[0].value);
             estraverse.replace(reactLib, {
              enter(libNode) {
                if (libNode.type === 'FunctionDeclaration') {
                  if (libNode.id.name === functionName) {
                    libNode.body = replacementNode.body[0].body;
                    console.log('From parser. REPLACING!', libNode.id.name);
                    // return libNode;
                  }
                }
              },
            });
            // reactLib = escodegen.attachComments(reactLib, reactLib.comments, reactLib.tokens);
            node.value.body.body[1].expression.arguments = escodegen.generate(reactLib);
            console.log('generated');
            // node.value.body.body[1].expression.arguments[0].value = escodegen.generate(reactLib, { comment: true });
          // node.value.body.body[1].expression.arguments[0].value = stringParser(node.value.body.body[1].expression.arguments[0].value, replacementNode, functionName);
          }
        }
      }
    },
  });
}

const parseAndGenerate = (codeString) => {
  if (codeString.search('react') !== -1) {
    const ast = esprima.parseModule(codeString);
    // Webpack bundle is wrapped in function call
    if (ast.body[0].expression.type === 'CallExpression') {
      //  if (ast.body[0].expression.arguments[0].properties[6].key.value ==='./node_modules/react/cjs/react.development.js'){
      //   const reactLib = esprima.parseModule(ast.body[0].expression.arguments[0].properties[6].value.body.body[1].expression.arguments[0].value);
      // .value at end is a string
      traverseBundledTree(injectableUseReducer, USEREDUCER, ast, reactLibraryPath);
      traverseBundledTree(injectableCommitAllHostEffects, COMMITALLHOSTEFFECTS, ast, reactDOMLibraryPath);
      //  traverseBundledTree(injectableUseReducerString, uRsig, ast, reactLibraryPath);
      //  traverseBundledTree(injectableCommitAllHostEffectsString, cAHEsig, ast, reactDOMLibraryPath);
    } else {
      // parse react-dom code
      injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());
      traverseTree(injectableCommitAllHostEffects, 'commitAllHostEffects', ast);

      // parse react code
      injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
      traverseTree(injectableUseReducer, 'useReducer', ast);
    }
    const code = escodegen.generate(ast);
    console.log('returning code.');
    return code;
  }
};
module.exports = parseAndGenerate;
