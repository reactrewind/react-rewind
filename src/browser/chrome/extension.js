const port = chrome.runtime.connect({
  name: 'Injected-Background Connection',
});

port.onMessage.addListener((msg) => {
  console.log('Extension got something: ', msg);
  window.postMessage(msg);
});

port.onDisconnect.addListener(() => console.log('Disconecting...'));

window.addEventListener('message', (msg) => {
  // When our injected scripts post messages (both from the 'react'
  // and 'react-dom'), we receive it here and send it to our app loaded
  // on the DevTool. If storage.isAppTurnedOff is false, it means that
  // the user started the application, but stopped recording. So even
  // though our injected scripts keep posting messages, we don't want to
  // send them over to the App anymore.
  chrome.storage.sync.get(['isAppTurnedOn'], (status) => {
    // if (!status.isAppTurnedOn) return;
    console.log('Extension got msg: ', msg);
    if (msg.data.type === 'DISPATCH') port.postMessage(msg.data.data);
  });
});
