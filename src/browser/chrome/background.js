const parseAndGenerate = require('./parser');

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (tab.status !== 'complete' || tab.url.startsWith('chrome')) return;

  chrome.pageAction.show(tab.id);
  chrome.tabs.executeScript(null, {
    file: 'extension.js',
    runAt: 'document_end',
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.react_check) {
    console.log('Background got the react_check! Resending...');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (request) => {
    if (request.type === 'script' && !request.url.startsWith('chrome')) {
      console.log('intercepting one request...');
      fetch(request.url)
        .then(r => r.text())
        .then((codeString) => {
          const editedCode = parseAndGenerate(codeString);
          if (editedCode === -1) return { redirectUrl: request.url };

          console.log('found 1;');
          sendMessageToContent(codeString);
          return { redirectUrl: 'javascript:' };
        });
      return { redirectUrl: 'javascript:' };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking'],
);

function sendMessageToContent(codeString) {
  console.log('sending the info to content...');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { codeString });
  });
}