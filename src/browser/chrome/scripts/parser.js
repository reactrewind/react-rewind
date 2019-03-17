const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

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

// method names
const USEREDUCER = 'useReducer';
const COMMITALLHOSTEFFECTS = 'commitAllHostEffects';
// library key inside of bundle
const reactLibraryPath = './node_modules/react/cjs/react.development.js';
const reactDOMLibraryPath = './node_modules/react-dom/cjs/react-dom.development.js';
// get replacer method 
let injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());

let injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());

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

function traverseBundledTree(replacementNode, functionName, ast, library) {
  estraverse.traverse(ast, {
    enter(node) {
      if (node.key && node.key.value === library) {
        if (node.value.body.body[1].type === 'ExpressionStatement') {
          if (node.value.body.body[1].expression.callee.name === 'eval') {
           // create new ast 
            const reactLib = esprima.parseScript(node.value.body.body[1].expression.arguments[0].value);
             estraverse.traverse(reactLib, {
              enter(libNode) {
                if (libNode.type === 'FunctionDeclaration') {
                  if (libNode.id.name === functionName) {
                    libNode.body = replacementNode.body[0].body;
                    console.log('From parser. REPLACING body!', libNode.id.name);
                  }
                }
              },
            });
            node.value.body.body[1].expression.arguments[0].value = escodegen.generate(reactLib);
            node.value.body.body[1].expression.arguments[0].raw = JSON.stringify(escodegen.generate(reactLib));
            console.log('arguments replaced');
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
      traverseBundledTree(injectableUseReducer, USEREDUCER, ast, reactLibraryPath);
      traverseBundledTree(injectableCommitAllHostEffects, COMMITALLHOSTEFFECTS, ast, reactDOMLibraryPath);
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
