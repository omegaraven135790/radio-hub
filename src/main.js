import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { ipcMain } from 'electron';
import RadioBrowser from 'radio-browser';
import { DatabaseSync } from 'node:sqlite';


const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'radiohub.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stationuuid TEXT UNIQUE NOT NULL,
    votes INTEGER DEFAULT 0,
    country TEXT,
    tags TEXT,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stationuuid TEXT UNIQUE NOT NULL,
    votes INTEGER DEFAULT 0,
    country TEXT,
    tags TEXT,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  );
`);


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

ipcMain.handle('get-favorites', (event) => {
    try {
        const stmt = db.prepare('SELECT * FROM favorites');
        const favorites = stmt.all();
        console.log('Retrieved favorites from database:', JSON.stringify(favorites));
        return { success: true, data: favorites };
    } catch (err) {
        return { success: false, error: err.message };
    }

  });

ipcMain.handle('add-favorite', (event, stations) => {
  const station = stations[0];
  // console.log('Adding favorite in main process:', station);
  // console.log(typeof station, JSON.stringify(station));
    try {
        const stmt = db.prepare('INSERT INTO favorites (stationuuid, name, url, votes, country, tags) VALUES (?, ?, ?,?,?,?)');
        stmt.run(station.stationuuid, station.name, station.url, station.votes, station.country, station.tags);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('remove-favorite', (event, stationuuid) => {
    // console.log('remove-favorite got:', typeof stationuuid, JSON.stringify(stationuuid));
    try {
        const stmt = db.prepare('DELETE FROM favorites WHERE stationuuid = ?');
        stmt.run(stationuuid);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('get-recents', (event) => {
    try {
        const stmt = db.prepare('SELECT * FROM recent ORDER BY id DESC LIMIT 50');
        const recent = stmt.all();
        const remove = db.prepare('DELETE FROM recent WHERE id NOT IN (SELECT id FROM recent ORDER BY id DESC LIMIT 50)');
        remove.run();
        return { success: true, data: recent };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('add-recent', (event, station) => {
    try {
        // console.log('Adding recent in main process:', station);
        const stmt = db.prepare('INSERT INTO recent (stationuuid, name, url, votes, country, tags) VALUES (?, ?, ?,?,?,?)');
        stmt.run(station.stationuuid, station.name, station.url, station.votes, station.country, station.tags);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }

});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
let Cleanup = false;
app.on('before-quit', (event) => {
  if(!Cleanup) {
    event.preventDefault();
    try {
      const remove = db.prepare('DELETE FROM recent WHERE id NOT IN (SELECT id FROM recent ORDER BY id DESC LIMIT 50)');
      remove.run();
      db.close();
      Cleanup = true;
      app.quit();
    }
    catch (err) {
      console.error('Error closing database:', err);
    }
  
  }
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
