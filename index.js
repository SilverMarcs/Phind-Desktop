const { app, BrowserWindow } = require("electron");
const { remote } = require("electron");
const path = require("path");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 21, y: 20 },
    icon: __dirname + "/build/icon.icns",
  });

  mainWindow.loadURL("http://www.phind.com");

  const applyStylesAndScripts = () => {
    const css = `
    .input-group.d-flex.flex-row-reverse { position: sticky !important; z-index: 99 !important; -webkit-app-region: drag !important }
      .btn.btn-circle.dropdown.dropdown-toggle.fs-3,
      .btn.btn-sm.text-dark.bg-white.dropdown.dropdown-toggle,
      .btn.btn-sm.text-dark.bg-white,
      .tooltip-wrap.btn.btn-circle {
        -webkit-app-region: no-drag;
      }
    [data-theme="dark"] .input-group.d-flex.flex-row-reverse {
      background-color: rgba(34, 34, 34, 1) !important;
    }
    [data-theme="light"] .input-group.d-flex.flex-row-reverse {
      background-color: rgba(255, 255, 255, 1) !important;
    }
    `;

    mainWindow.webContents.insertCSS(css);

    mainWindow.webContents.executeJavaScript(`
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
    `);
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
  if (process.platform !== "darwin") app.quit();
});
