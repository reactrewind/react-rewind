const port = chrome.runtime.connect({
  name: 'Injected-Background Connection',
});

port.onMessage.addListener((msg) => {
<<<<<<< HEAD
  // This is where we get messages from the App component.
  // We get an object { type: 'TIMETRAVEL', direction: 'forward' }
=======
>>>>>>> e4fea21ec8444346b507bf71673dc8066c6de725
  window.postMessage(msg);
});

port.onDisconnect.addListener(() => console.log('Disconecting...'));

window.addEventListener('message', (msg) => {
  // TODO: fix comments. Are we gonna receive msgs from reactDOM here??
  // When our injected scripts post messages (both from the 'react'
  // and 'react-dom'), we receive it here and send it to our app loaded
  // on the DevTool. If storage.isAppTurnedOff is false, it means that
  // the user started the application, but stopped recording. So even
  // though our injected scripts keep posting messages, we don't want to
  // send them over to the App anymore.
  chrome.storage.sync.get(['isAppTurnedOn'], (status) => {
    // if (!status.isAppTurnedOn) return;
    if (msg.data.type === 'DISPATCH') port.postMessage(msg.data.data);
  });
});
