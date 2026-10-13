import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { ipcMain } from 'electron';
import RadioBrowser from 'radio-browser';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    alwaysOnTop: true,
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

ipcMain.handle('vote-station', async (event, stationuuid) => {
    try {
        const result = await RadioBrowser.voteStation(stationuuid);
        return { success: true, result };
    } catch (err) {
        return { success: false, error: err.message };
    }
});
ipcMain.handle('get-stations', async (event, filters) => {
    try {
        const data = await RadioBrowser.getStations(filters);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('search-stations', async (event, filters) => {
    try {
        const params = new URLSearchParams();
        if (filters.search) params.append('name', filters.search);
        if (filters.tagList) params.append('tagList', filters.tagList);
        if (filters.country) params.append('country', filters.country);
        if (filters.language) params.append('language', filters.language);
        params.append('limit', filters.limit || 10);
        params.append('offset', filters.offset || 0);
        params.append('order', filters.order || 'votes');
        params.append('reverse', filters.reverse ?? true);
        params.append('hidebroken', 'true');

        const response = await fetch(`https://de1.api.radio-browser.info/json/stations/search?${params.toString()}`);
        const data = await response.json();
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
});


app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
