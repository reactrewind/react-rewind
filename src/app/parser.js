const esprima = require('esprima');
const fs = require('fs');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const path = require('path');
// contains useReducer
const file = '/node_modules/react/cjs/react.development.js';
// 20k lines
// const file = '/node_modules/react-dom/cjs/react-dom.development.js';

// convert file to string and parse
const dir = path.join(__dirname, file);
const fileString = fs.readFileSync(dir, { encoding: 'utf-8' });
const ast = esprima.parseModule(fileString);


// declare function to insert
// TODO: Un-comment timeTravelTracker
function replacer() {
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

const replacerNode = esprima.parseScript(replacer.toString());

// traverse ast to find method and replace body with our node's body
estraverse.replace(ast, {
  enter(node) {
    if (node.type === 'FunctionDeclaration') {
      if (node.id.name === 'useReducer') {
        node.body = replacerNode.body[0].body;
      }
    }
  },
});
const code = escodegen.generate(ast);
fs.writeFileSync('genCode.js', code, (err) => {
  if (err) throw new Error(err.message);
});
