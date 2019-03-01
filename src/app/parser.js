const esprima = require('esprima');
const fs = require('fs');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const path = require('path');

// react files
const useReducerfile = '/node_modules/react/cjs/react.development.js';
const commitAllHostEffectsfile = '/node_modules/react-dom/cjs/react-dom.development.js';

// generated file names
const genReactDev = 'generatedReact.development.js';
const genReactDom = 'generatedReact-dom.development.js';

// convert file to string and parse
function parseFile(file) {
  const dir = path.join(__dirname, file);
  const fileString = fs.readFileSync(dir, { encoding: 'utf-8' });
  const ast = esprima.parseModule(fileString);
  return ast;
}
// declare functions to insert
// TODO: Un-comment timeTravelTracker
function useReducerReplacement() {
  let dispatcher = resolveDispatcher();
  function reducerWithTracker(state, action) {
    const newState = reducer(state, action);
    //  timeTravelTracker[timeTravelTracker.length - 1].actionDispatched = true;
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
  console.log('You just got swapped!');
}

// traverse ast to find method and replace body with our node's body
function traverseTree(replacementNode, functionName, ast) {
  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'FunctionDeclaration') {
        if (node.id.name === functionName) {
          node.body = replacementNode.body[0].body;
        }
      }
    },
  });
}

function generateFile(filename, ast) {
  const code = escodegen.generate(ast);
  fs.writeFileSync(filename, code, (err) => {
    if (err) throw new Error(err.message);
  });
}

const parseAndGenerate = () => {
  const ast = parseFile(useReducerfile);
  // const ast = parseFile(commitAllHostEffectsfile);

  const injectableUseReducer = esprima.parseScript(useReducerReplacement.toString());
  // const injectablecommitAllHostEffects = esprima.parseScript(useReducerReplacement.toString());

  traverseTree(injectableUseReducer, 'useReducer', ast);
  // traverseTree(injectablecommitAllHostEffects, 'commitAllHostEffects');

  generateFile(genReactDev, ast);
  // generateFile(genReactDom);
};
// parseAndGenerate();
module.exports = parseAndGenerate;
