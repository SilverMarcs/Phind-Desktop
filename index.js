// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const { remote } = require('electron');
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 21, y: 19 },
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  // and load the index.html of the app.
  //   mainWindow.loadFile('index.html')
  mainWindow.loadURL('http://www.phind.com')

  mainWindow.webContents.on('did-finish-load', applyStylesAndScripts(mainWindow));
  // mainWindow.webContents.on('did-navigate-in-page', applyStylesAndScripts(mainWindow));

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function addScrollListener(className) {
  return `
    (function() {
      const element = document.querySelector('${className}');
      if (!element) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
          element.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          element.style.borderBottom = '1px solid rgba(0, 0, 0, 0.5)';
        } else {
          element.style.boxShadow = 'none';
          element.style.borderBottom = 'none';
        }
      });
    })();
  `;
}

function applyStylesAndScripts(mainWindow) {
  const css = `
    .input-group.d-flex.flex-row-reverse { position: sticky !important; z-index: 99 !important; background-color: rgba(34, 34, 34, 1) !important; -webkit-app-region: drag !important }
      .btn.btn-circle.dropdown.dropdown-toggle.fs-3,
      .btn.btn-sm.text-dark.bg-white.dropdown.dropdown-toggle,
      .tooltip-wrap.btn.btn-circle {
        -webkit-app-region: no-drag;
      }
    `;
  
  mainWindow.webContents.insertCSS(css)
    .then(() => console.log('CSS injected'))
    .catch(err => console.error('Error injecting CSS:', err));

  // const scrollScript = addScrollListener('.input-group.d-flex.flex-row-reverse');
  // mainWindow.webContents.executeJavaScript(scrollScript)
  //   .then(() => console.log('Scroll listener added'))
  //   .catch(err => console.error('Error adding scroll listener:', err));
}
