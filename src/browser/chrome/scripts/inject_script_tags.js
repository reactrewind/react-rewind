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

const scriptsToParse = [];
let lastReceivedMsgTime = null;

chrome.runtime.onMessage.addListener(scheduleWork);

function scheduleWork(work) {
  // We want to add the scripts to a work array. When its been 100s
  // without receiving any new scripts, then we sort the array and
  // add all scripts to the page.
  if (work) scriptsToParse.push(work);

  if (Date.now() - lastReceivedMsgTime > 100 && lastReceivedMsgTime !== null) {
    lastReceivedMsgTime = null;
    addScriptToPage();
  } else {
    if (work) lastReceivedMsgTime = Date.now();
    setTimeout(scheduleWork, 50);
  }
}

function addScriptToPage() {
  // First we sort the array by index, then we add everything to page
  scriptsToParse.sort((a, b) => a.index - b.index);
  while (scriptsToParse.length > 0) {
    const { codeString } = scriptsToParse.shift();

    const script = document.createElement('script');
    script.innerHTML = codeString;
    (document.head || document.documentElement).appendChild(script);
    script.onload = function removeScriptTag() {
      this.remove();
    };
  }
}
