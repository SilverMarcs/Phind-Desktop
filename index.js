const { app, BrowserWindow, globalShortcut } = require("electron");

const createWindow = () => {
  globalShortcut.register("Control+Space", () => {
    if (mainWindow.isVisible() && mainWindow.isFocused()) mainWindow.hide();
    else {
      mainWindow.show();
    }
  });
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 21, y: 21 },
    minWidth: 430,
    minHeight: 700,
    icon: __dirname + "/build/icon.icns",
  });

  mainWindow.loadURL("http://www.phind.com");

  const applyStylesAndScripts = () => {
    mainWindow.webContents.insertCSS(css);

    mainWindow.webContents.executeJavaScript(forwardBack + detectTheme);
  };

  mainWindow.webContents.on("did-finish-load", applyStylesAndScripts);
  mainWindow.webContents.on("did-navigate-in-page", applyStylesAndScripts);
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll();
  if (process.platform !== "darwin") app.quit();
});

const forwardBack = `
  const backwardButton = document.createElement('button');
  backwardButton.textContent = '<';
  backwardButton.style.position = 'fixed';
  backwardButton.style.top = '0.5px'; // Add padding on top
  backwardButton.style.left = '110px';
  backwardButton.style.padding = '10px 20px'; // Increase button size
  backwardButton.style.fontSize = '24px'; // Increase font size
  backwardButton.style.backgroundColor = 'transparent';
  backwardButton.style.color = 'inherit';
  backwardButton.style.border = 'none';
  backwardButton.style.zIndex = '100';
  backwardButton.style.webkitAppRegion = 'no-drag';
  backwardButton.onclick = () => window.history.back();

  const forwardButton = document.createElement('button');
  forwardButton.textContent = '>';
  forwardButton.style.position = 'fixed';
  forwardButton.style.top = '0.5px'; // Add padding on top
  forwardButton.style.left = '160px';
  forwardButton.style.padding = '10px 20px'; // Increase button size
  forwardButton.style.fontSize = '24px'; // Increase font size
  forwardButton.style.zIndex = '100';
  forwardButton.style.backgroundColor = 'transparent';
  forwardButton.style.color = 'inherit';
  forwardButton.style.border = 'none';
  forwardButton.style.webkitAppRegion = 'no-drag';
  forwardButton.onclick = () => window.history.forward();


  document.body.appendChild(backwardButton);
  document.body.appendChild(forwardButton);
  `;

const detectTheme = `
  const targetNode = document.documentElement;
  const config = { attributes: true, childList: false, subtree: false };
  const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const theme = targetNode.getAttribute('data-theme');
        if (theme === 'dark') {
          document.body.classList.remove('light-theme');
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
          document.body.classList.add('light-theme');
        }
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  `;

const css = `
  .input-group.d-flex.flex-row-reverse { position: sticky !important; z-index: 99 !important; -webkit-app-region: drag !important }
    .btn.btn-circle.dropdown.dropdown-toggle.fs-3,
    .btn.btn-sm.text-dark.bg-white.dropdown.dropdown-toggle,
    .btn.btn-sm.text-dark.bg-white,
    .tooltip-wrap.btn.btn-circle {
      -webkit-app-region: no-drag;
    }
  [data-theme="dark"] .input-group.d-flex.flex-row-reverse {
    background-color: #171719 !important;
  }
  [data-theme="light"] .input-group.d-flex.flex-row-reverse {
    background-color: rgba(255, 255, 255, 1) !important;
  }
  `;
