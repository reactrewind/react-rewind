chrome.devtools.panels.create('React Rewind',
  null,
  'devtools.html',
  (devtoolsPanel) => {
    const backgroundPageConnection = chrome.runtime.connect({
      name: 'devtools',
    });

    devtoolsPanel.onShown.addListener(function tmp(panelWindow) {
      // Run once only
      devtoolsPanel.onShown.removeListener(tmp);

      const windowP = panelWindow;
      windowP.backgroundPort = backgroundPageConnection;

      backgroundPageConnection.onMessage.addListener((message) => {
        // When we get a msg from background telling us that we need
        // to refresh the App, we send it to App via window.PostMessage()
        if (message.action === 'refresh_devtool') windowP.postMessage(message);
      });
    });
  });
