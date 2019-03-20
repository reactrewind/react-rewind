(function openConnectionToApp() {
  const port = chrome.runtime.connect({
    name: 'injected-app',
  });

  port.onMessage.addListener((msg) => {
    // This is where we get messages from the App component.
    // We get an object { type: 'TIMETRAVEL', direction: 'forward' }
    console.log('Got msg to timetravel: ', msg);
    window.postMessage(msg);
  });

  window.addEventListener('message', (msg) => {
    // When our injected scripts post messages (from useRedute in 'react'),
    // we receive it here and send it to our app loaded on the DevTool.
    if (msg.data.type === 'DISPATCH') port.postMessage(msg.data.data);
  });
}());
