chrome.runtime.onMessage.addListener(msg => {
  if (msg['react_check']) {
    console.log('Extension got the react_check!');
  }
})
console.log('Now listening for messages...');

let port = chrome.runtime.connect({
  name: "Injected-Background Connection" 
});

port.onDisconnect.addListener(() => console.log('Disconecting...'));

window.addEventListener("message", msg => {
  console.log(msg);
  if (msg.data.type === 'DISPATCH') {
    // sends message to devtools
    console.log('Posting msg: ', msg);
    port.postMessage(msg.data.data);
  }
});
