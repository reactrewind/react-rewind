chrome.devtools.panels.create('React Rewind',
  null,
  'devtools.html',
  (extensionPanel) => {
    const port = chrome.runtime.connect({ name: 'devtools' });
    port.onMessage.addListener(() => {});
    extensionPanel.onShown.addListener((panelWindow) => {
      panelWindow.backgroundPort = port;
    });
  });
