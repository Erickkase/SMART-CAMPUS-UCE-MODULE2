import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { createServer } from './server';

const EXPRESS_PORT = Number(process.env.EXPRESS_PORT) || 3099;
const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

async function bootstrap(): Promise<void> {
  await createServer(EXPRESS_PORT);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Welfare Desktop',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'bottom' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(bootstrap).catch(console.error);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    bootstrap().catch(console.error);
  }
});
