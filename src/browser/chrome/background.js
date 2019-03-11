const parseAndGenerate = require('./scripts/parser');

let portToDevtools;
const msgsToPanel = [];

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (tab.status !== 'complete' || tab.url.startsWith('chrome')) return;

  // active page action button and inject extension.js
  chrome.pageAction.show(tab.id);
  chrome.tabs.executeScript(null, {
    file: 'extension.js',
    runAt: 'document_end',
  });

  // refresh devtool panel everytime we refresh webpage
  // console.log('port: ', portToDevtools);
  // if (portToDevtools) portToDevtools.postMessage({ action: 'refresh_devtool' });
  // else msgsToPanel.push({ action: 'refresh_devtool' });
});


let interceptedUrl = '';
function handleRequest(request) {
  // TODO: filter the request from the webRequest call. 
  if (!interceptedUrl.startsWith(request.initiator)) return { cancel: false };

  console.log('intercepting... ', request);
  if (request.type === 'script' && !request.url.startsWith('chrome')
  && request.frameId === 0) {
    // TODO: adjust comment
    // Else we need to check wether or not this contains the react
    // library. If it does, we need to send the edit javascript to
    // out content script, so it can inject into the page. If it doesnt,
    // we need to send the url to our content script so that it can
    // add it to the page <script src=URL> AND add it to our cache, so
    // that when we intercept it, we dont block it.
    const syncRequest = new XMLHttpRequest();
    syncRequest.open('GET', request.url, false);
    syncRequest.send(null);

    sendMessageToContent(parseAndGenerate(syncRequest.responseText));

    return { redirectUrl: 'javascript:' };
  }
}

// The App on the devtools panel start a connection so that it can
// tell us when to start intercepting the script requests.
chrome.runtime.onConnect.addListener((port) => {
  portToDevtools = port;

  // if (msgsToPanel.length > 0) {
  //   for (let msg of msgsToPanel) port.postMessage(msg);
  // }
  // we change the port to null when we disconnect, so that when we refresh
  // the page by start recording, we can check if (!port) and not refresh
  // the devtools page.
  port.onDisconnect.addListener(() => {
    portToDevtools = null;
  });

  port.onMessage.addListener((msg) => {
    if (!msg.turnOnDevtool) return;
    interceptedUrl = msg.url;
    addScriptInterception();

    // after activating our interception script, we refresh the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
  });
});

function addScriptInterception() {
  chrome.webRequest.onBeforeRequest.removeListener(handleRequest);
  chrome.webRequest.onBeforeRequest.addListener(
    handleRequest,
    { urls: ['<all_urls>'] },
    ['blocking'],
  );
}

let reqIndex = 0;
function sendMessageToContent(codeString) {
  const index = reqIndex++;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { codeString, index });
  });
}
