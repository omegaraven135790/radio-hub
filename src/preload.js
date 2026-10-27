// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getStations: (filters) => ipcRenderer.invoke('get-stations', filters),
    voteStation : (stationuuid) => ipcRenderer.invoke('vote-station', stationuuid),
    searchStations: (filters) => ipcRenderer.invoke('search-stations', filters),
    getFavorites: () => ipcRenderer.invoke('get-favorites'),
    addFavorite: (station) => ipcRenderer.invoke('add-favorite', station),
    removeFavorite: (stationuuid) => ipcRenderer.invoke('remove-favorite', stationuuid),
    getRecents: () => ipcRenderer.invoke('get-recents'),
    addRecent: (station) => ipcRenderer.invoke('add-recent', station),
});

// contextBridge.exposeInMainWorld('electronStore', {
//     get: (key) => ipcRenderer.invoke('store-get', key),
//     set: (key, value) => ipcRenderer.invoke('store-set', key, value),
// });