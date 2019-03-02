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

// let shouldRedirect = true;
// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     if (details.type === 'script' && shouldRedirect) {
//       console.log('redirecting... ORIGINAL: ', details);
//       shouldRedirect = false;
//       return { redirectUrl: chrome.extension.getURL('hack.js') };
//     }
//   },
//   { urls: ["<all_urls>"] },
//   ["blocking"]
// );
