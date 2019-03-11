chrome.devtools.panels.create('React Rewind',
  null,
  'devtools.html',
  (extensionPanel) => {
    const port = chrome.runtime.connect({ name: 'devtools' });
    port.onMessage.addListener((msg) => {
      // console.log('got msg: ', msg);
      if (msg.action === 'refresh_devtool') extensionPanel.setPage('devtools.html');
    });

    extensionPanel.onShown.addListener((panelWindow) => {
      panelWindow.backgroundPort = port;
    });
  });
