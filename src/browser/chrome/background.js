const parseAndGenerate = require('./scripts/parser');
const injectBundleStr = require('./scripts/inject_bundle');

let ports = [];
let interceptedUrl = '';
let reqIndex = 0;

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (tab.status !== 'complete' || tab.url.startsWith('chrome')) return;

  // active page action button and inject extension.js
  chrome.pageAction.show(tab.id);
  chrome.tabs.executeScript(null, {
    file: 'extension.js',
    runAt: 'document_end',
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    interceptedUrl = '';
    reqIndex = 0;
    notifyPorts(
      { action: 'refresh_devtool', tabId: tabs[0].id },
      'devtools',
    );
  });
});

function handleRequest(request) {
  // TODO: filter the request from the webRequest call.
  if (!interceptedUrl.startsWith(request.initiator)) return { cancel: false };

  if (request.type === 'script' && !request.url.startsWith('chrome')
    && request.frameId === 0 && ((request.url.slice(-3) === '.js')
    || (request.url.slice(-4) === '.jsx'))) {
    // If we just started intercepting requests, we want to add our injected
    // bundle into the page.
    if (reqIndex === 0) sendMessageToContent(injectBundleStr);

    // To guarantee that the scripts are gonna be executed in order, we are
    // gonna intercept EVERY request that is made. Then we have to download the
    // script SYNC'ly since the webRequest API doesn't handle async. Last we
    // send it to our content script to inject it back into the page. Either
    // the React library with the extended functionality or the untouched script.
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
  if (ports) ports.push(port);

  port.onMessage.addListener((msg) => {
    if (msg.turnOnDevtool) {
      interceptedUrl = msg.url;
      addScriptInterception();

      // after activating our interception script, we refresh the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
      });

    } else {
      console.log('Got a msg not turnOnDevtool: ', msg);
    }
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

function sendMessageToContent(codeString) {
  const index = reqIndex++;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { codeString, index });
  });
}

function notifyPorts(msg, portName) {
  let index = 0;
  while (index < ports.length) {
    if (portName && (ports[index].name !== portName)) index++;
    else {
      try {
        ports[index].postMessage(msg);
        index++;
      } catch {
        // remove closed port from array
        ports = [...ports.slice(0, index), ...ports.slice(index + 1)];
      }
    }
  }
}
