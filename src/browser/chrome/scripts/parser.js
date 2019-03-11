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

    let primaryEffectTag = effectTag & (Placement | Update | Deletion);
    switch (primaryEffectTag) {
      case Placement:
      {
        timeTravelTracker.push({
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
        let _current = nextEffect.alternate;
        commitWork(_current, nextEffect);
        break;
      }
      case Update:
      {
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
let injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
let injectableUseReducerString = escodegen.generate(injectableUseReducer.body[0].body);

let injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());
let injectableCommitAllHostEffectsString = escodegen.generate(injectableCommitAllHostEffects.body[0].body);

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
function stringParser(string, newBody, methodSig) {
  let stack = [];
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
const parseAndGenerate = (codeString) => {
  if (codeString.search('react') !== -1) {
    let ast;
    try {
      ast = esprima.parseModule(codeString);
    } catch (error) {
      // esprima throws parsing error webpack devtool setting generates code
      console.log('unable to use esprima parser');
      codeString = stringParser(codeString, injectableUseReducerString, uRsig);
      codeString = stringParser(codeString, injectableCommitAllHostEffectsString, cAHEsig);
      return codeString;
    }
    // parse react-dom code
    injectableCommitAllHostEffects = esprima.parseScript(commitAllHostEffectsReplacement.toString());
    traverseTree(injectableCommitAllHostEffects, 'commitAllHostEffects', ast);

    // parse react code
    injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
    traverseTree(injectableUseReducer, 'useReducer', ast);
    
    const code = escodegen.generate(ast);
    console.log('returning code.');
    return code;
  }
  console.log('returning string.');
  return codeString;
};

module.exports = parseAndGenerate;
