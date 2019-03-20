const parseAndGenerate = require('./scripts/parser2');

let ports = [];

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
    notifyPorts(
      { action: 'refresh_devtool', tabId: tabs[0].id },
      'devtools',
    );
  });
});


let interceptedUrl = '';
function handleRequest(request) {
  // TODO: filter the request from the webRequest call.
  if (!interceptedUrl.startsWith(request.initiator)) return { cancel: false };

  if (request.type === 'script' && !request.url.startsWith('chrome')
    && request.frameId === 0 && ((request.url.slice(-3) === '.js')
    || (request.url.slice(-4) === '.jsx'))) {
    console.log('Got one: ', request.url, request);
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

    // const code = encodeURIComponent(parseAndGenerate(syncRequest.responseText));
    // console.log('CODE - LENGTH: ', code.length);
    // return { redirectUrl: 'data:application/javascript; charset=utf-8,'.concat(code) };
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

  // chrome.webRequest.onBeforeSendHeaders.addListener(
  //   (request) => {
  //     if (!interceptedUrl.startsWith(request.initiator)) return { cancel: false };

  //     if (request.type !== 'script' || request.url.startsWith('chrome')
  //       || request.frameId !== 0) return;
  //     console.log('onBeforeHeaders = ', request.url);
  //     // request.requestHeaders.push({
  //     //   name: 'Access-Control-Allow-Credentials',
  //     //   value: '*',
  //     // });

  //     // request.requestHeaders.push({
  //     //   name: 'Accept',
  //     //   value: 'application/javascript',
  //     // });

  //     // request.requestHeaders.push({
  //     //   name: 'ABC',
  //     //   value: 'abc',
  //     // });
  //     const filteredHeaders = [{name: 'TTT', value: 'OK'}];
  //     for (let i = 0; i < request.requestHeaders.length; i++) {
  //       const header = request.requestHeaders[i];
  //       if (header.name !== 'Origin') {
  //         filteredHeaders.push({
  //           name: header.name,
  //           value: header.value,
  //         });
  //       }
  //     }
  //     return { requestHeaders: filteredHeaders };
  //   },
  //   { urls: ['<all_urls>'] },
  //   ['blocking', 'requestHeaders'],
  // );

  // chrome.webRequest.onSendHeaders.addListener(
  //   (request) => {
  //     console.log('onSendHeaders: ', request);
  //   },
  //   { urls: ['<all_urls>'] },
  //   ['requestHeaders'],
  // );

  // chrome.webRequest.onHeadersReceived.addListener(
  //   handleRequest,
  //   { urls: ['<all_urls>'] },
  //   ['blocking', 'responseHeaders'],
  // );
}

let reqIndex = 0;
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
