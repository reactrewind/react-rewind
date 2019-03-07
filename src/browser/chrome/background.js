const parseAndGenerate = require('./scripts/parser');

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (tab.status !== 'complete' || tab.url.startsWith('chrome')) return;

  chrome.pageAction.show(tab.id);
  chrome.tabs.executeScript(null, {
    file: 'extension.js',
    runAt: 'document_end',
  });
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
    console.log(`Status: ${syncRequest.status} - Size of response: ${syncRequest.responseText.length}`);

    sendMessageToContent(parseAndGenerate(syncRequest.responseText));

    return { redirectUrl: 'javascript:' };
  }
}

// The App on the devtools panel start a connection so that it can
// tell us when to start intercepting the script requests.
chrome.runtime.onConnect.addListener((port) => {
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
  console.log(`Sending request ${index}.`);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { codeString, index });
  });
}
