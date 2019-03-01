document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#color_btn');
  btn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      console.log(tabs);
      chrome.tabs.sendMessage(tabs[0].id, "change_color");  
    });
  });
});