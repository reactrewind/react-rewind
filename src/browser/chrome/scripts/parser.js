const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const _ = require('lodash');

// declare functions to insert
function useReducerReplacement() {
  const dispatcher = resolveDispatcher();
  function reducerWithTracker(state, action) {
    const newState = reducer(state, action);
    timeTravelTracker[timeTravelTracker.length - 1].actionDispatched = true;
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

    let {effectTag} = nextEffect;

    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    if (effectTag & Ref) {
      let current$$1 = nextEffect.alternate;
      if (current$$1 !== null) {
        commitDetachRef(current$$1);
      }
    }

    // The following switch statement is only concerned about placement,
    // updates, and deletions. To avoid needing to add a case for every
    // possible bitmap value, we remove the secondary effects from the
    // effect tag and switch on that value.
    let primaryEffectTag = effectTag & (Placement | Update | Deletion);
    switch (primaryEffectTag) {
      case Placement:
      {
        // editbyme
        timeTravelTracker.push({
            primaryEffectTag: 'PLACEMENT',
            effect: _.cloneDeep(nextEffect),
        });

        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted
        // does and isMounted is deprecated anyway so we should be able
        // to kill this.
        nextEffect.effectTag &= ~Placement;
        break;
      }
      case PlacementAndUpdate:
      {
        // Placement
        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        nextEffect.effectTag &= ~Placement;

        // Update
        let _current = nextEffect.alternate;
        commitWork(_current, nextEffect);
        break;
      }
      case Update:
      {
        // editbyme
        timeTravelTracker.push({
          primaryEffectTag: 'UPDATE',
          effect: _.cloneDeep(nextEffect),
          current: _.cloneDeep(nextEffect.alternate),
        });

        let _current2 = nextEffect.alternate;
        commitWork(_current2, nextEffect);
        break;
      }
      case Deletion:
      {
        // editbyme
        timeTravelTracker.push({
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
// get replacer method bodies
const injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());
// const injectableCommitAllHostEffects = injectableCommitAllHostEffects.body[0].body;
const injectableCommitAllHostEffectsString = escodegen.generate(injectableCommitAllHostEffects.body[0].body);

const injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
const injectableUseReducerString = escodegen.generate(injectableUseReducer.body[0].body);

// traverse ast to find method and replace body with our node's body
function traverseTree(replacementNode, functionName, ast) {
  console.log('traverse called');
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

const parseAndGenerate = (codeString) => {
  if (codeString.search('react') !== -1) {
    const ast = esprima.parseModule(codeString);
    
    // parse react-dom code
    const injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());
    traverseTree(injectableCommitAllHostEffects, 'commitAllHostEffects', ast);

    // parse react code
    const injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
    traverseTree(injectableUseReducer, 'useReducer', ast);
    
    const code = escodegen.generate(ast);
    console.log('returning code.');
    return code;
  }
  console.log('returning string.');
  return codeString;
};

module.exports = parseAndGenerate;
