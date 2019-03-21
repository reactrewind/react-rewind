(function openConnectionToApp() {
  const port = chrome.runtime.connect({
    name: 'injected-app',
  });

  port.onMessage.addListener((msg) => {
    // This is where we get messages from the App component.
    // We get an object { type: 'TIMETRAVEL', direction: 'forward' }
    window.postMessage(msg);
  });
  console.log('inject library');
  window.addEventListener('message', (msg) => {
    // When our injected scripts post messages (from useReducer in 'react'),
    // we receive it here and send it to our app loaded on the DevTool.
    if (msg.data.type === 'DISPATCH') console.log('Got msg from useReducer: ', msg.data.data);
    if (msg.data.type === 'DISPATCH') port.postMessage(msg.data.data);
  });
}());
