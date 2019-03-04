// We add a <script> tag to the DOM with our script files as the src attribute.
// We need this because our content-injected scripts are executed in an "isolated
// world" environment. BUT for the scripts below, we want the edited-React libraries
// to have access to the their functionalities.
const linkedListScript = document.createElement('script');
linkedListScript.src = chrome.runtime.getURL('scripts/linked_list.js');
(document.head || document.documentElement).appendChild(linkedListScript);

const timeTravelScript = document.createElement('script');
timeTravelScript.src = chrome.runtime.getURL('scripts/time_travel.js');
(document.head || document.documentElement).appendChild(timeTravelScript);

linkedListScript.onload = timeTravelScript.onload = function removeScriptTag() {
  this.remove();
};

chrome.runtime.onMessage.addListener((msg) => {
  if (!msg.hasOwnProperty('codeString')) return;

  console.log('Content got some code to inject into the page.');
  const script = document.createElement('script');
  script.innerHTML = msg.codeString;
  (document.head || document.documentElement).appendChild(script);
  script.onload = function removeScriptTag() {
    this.remove();
  };
});
