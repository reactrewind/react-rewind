document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#gitHub_btn');
  btn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
     chrome.tab.create({ url:'https://github.com/reactrewind/react-rewind' });
    });
    // chrome.runtime.getURL('https://github.com/reactrewind/react-rewind');
  // btn.addEventListener('click', () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  //     console.log(tabs);
  //      chrome.tabs.sendMessage(tabs[0].id, "change_color");
     
  //   });
  });
});