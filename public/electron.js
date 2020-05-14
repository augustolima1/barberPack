const electron = require('electron');
const path     = require('path');
const isDev    = require('electron-is-dev');
const log      = require('electron-log');
require('./notification');
//let server = require('./api/express');
let server = require('./apiV1/src');


log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';
log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.file.level = 'info';

const { app } = electron;
const { BrowserWindow } = electron;


 
let mainWindow;

const sendStatusToWindow = (text) => {
  log.info(text);
  mainWindow.webContents.send('message', text);
};




function createWindow() {
  

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.setMenuBarVisibility(false)

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.resolve(__dirname, '..', 'build', 'index.html')}`,
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
 
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});