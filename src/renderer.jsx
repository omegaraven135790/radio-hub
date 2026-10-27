/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { createRoot } from 'react-dom/client';
import NavBar from './components/NavBar.jsx';
import { StrictMode } from 'react';
import {Routes,Route} from 'react-router-dom';
import { HashRouter } from 'react-router-dom'; 
import './index.css';
import Home from './pages/home.jsx';
import Recent from './pages/recent.jsx';
import { useRef } from 'react';
import { RadioProvider } from './context/radio-context.jsx';
import Top from './pages/topStation.jsx';
import Search from './pages/searchPage.jsx';
import React from 'react';
import Favorite from './pages/favorite.jsx';

const App = () => {
   const audioRef = useRef(null);
   
  return (
    <>
      <RadioProvider  audioRef={audioRef}> 
        <audio ref={audioRef} />

      <NavBar />
      <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/favorite" element={<Favorite />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/search" element={<Search />} />
      </Routes>
      </RadioProvider>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);




console.log(
  '👋 This message is being logged by "renderer.jsx", included via Vite and uses react',
);


