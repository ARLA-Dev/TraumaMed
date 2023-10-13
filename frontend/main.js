const { app, BrowserWindow } = require('electron');
const path = require('path'); // Importa el módulo path

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366, 
    height: 1024, 
    autoHideMenuBar: true,
    icon: path.join(__dirname, './assets/images/favicon.ico'),
    webPreferences: {
      nodeIntegration: false, // Requerido para la seguridad
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Usa path.join para generar la ruta completa
    }
  });

  mainWindow.loadFile('index.html'); // Carga tu archivo HTML principal
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

