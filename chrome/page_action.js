document.addEventListener('DOMContentLoaded', () => {
  const links = document.getElementsByTagName('a');
  const createTab = url => () => chrome.tabs.create({ active: true, url });

  for (let i = 0; i < links.length; i++) {
    const ln = links[i];
    const location = ln.href;
    ln.onclick = createTab(location);
  }
});
