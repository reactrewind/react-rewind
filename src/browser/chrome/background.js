const parseAndGenerate = require('./scripts/parser');

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (tab.status !== 'complete' || tab.url.startsWith('chrome')) return;

  chrome.pageAction.show(tab.id);
  chrome.tabs.executeScript(null, {
    file: 'extension.js',
    runAt: 'document_end',
  });
});

let reqIndex = 0;
const urlCache = {};
chrome.webRequest.onBeforeRequest.addListener(
  (request) => {
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
  },
  { urls: ['<all_urls>'] },
  ['blocking'],
);

function sendMessageToContent(codeString) {
  const index = reqIndex++;
  console.log(`Sending request ${index}.`);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { codeString, index });
  });
}
