# Radio-hub
#### Video Demo:  <URL HERE>
#### Description: this is a simple app that that allows the user to play radio stations
 via the functions exposed by the radio-browser api on their desktop and has been made to be visually compact to not occupy large portions of the user's window as it is meant to play in the background. it is made using some tailwind css,electron js and react js along with the radio-browser for node js library on github at this link:(https://github.com/nepodev/radio-browser) which uses the radio-browser api and directly fetches results from the radio-browser api for the search page. the submitted app is a simplified version of the original app as some additional pages and features were built around using the electron-store library but towards the end of development electron-store was not functioning properly with the development enviroment and so after debugging has been excluded. to start the app use npm start in the terminal after opening the radio-hub folder and it can be packaged using electron packager/builder.

##home page 
The key components of the project are the renderer.jsx file which contains the key react elements for global elements which need to be accessed by a variety of functions that are not always in the same page and define
the core way that the app is displayed to the user. The bulk of the app is contained within the home.jsx page which contains the UI components that the user will spend most of their time interacting with including a spinning disk animation which is done entirely in css and took quite a bit of time to make as im not very familiar with css animations. This page allows the user to pause,play,skip,like and fetch a new **random** radio station. due to the very large number of radio stations in the API some stations wont have a valid URL or may throw an error when attempted to play. In this case the user can just press skip or the new station button to continue. Generally any station in English has no problem with its URL.

##top 10 stations:

this page is relitively simple and exposes a simple way for the user to quickly browse and play the top 10 stations. originally this was supposed to be a differant page but was switched to this due to the above mentioned issues with electron-store and my personal in-experience with node js. One issue with electron I found when checking online is that when attempting to work with a backend like python it requires extra configuration and setup to work properly so I opted to remove the features
relating to file management.

##search page:

This page directly queries the radio-browser api as the library used for other pages simplifies things but does not allow for more complex searching with multiple search fields where as the original api does. The user can enter the relevant search
details they want to use in the fields provided and the backend handles any empty fields and excludes them to avoid anomolous behaviour.

##recent page:

this page stores all the stations recently visited by the user **in the current session** and allows the user to go back to them if they choose. it utelises some shared functions and variables from the radio-context file and the radioCard component. A future improvement would be to save these recent stations to a file and limit it to maybe 100 stations as the max number of recent stations so that it can persist across sessions but this would require the same file management as mentioned above.

##components:

the components are any element that needs to be used across the app's pages. these components are the navbar and the radioCard which contains details about each station and allows for them to be played. The radioCard component is used in both the 
search page and the top 10 stations page. The play button on the radioCard element does not change even if the user clicks it as if the user decides to switch stations while on this page it would require extra variables to track which radioCard is 
being played which I believe would require changes to other components of the app and how they were made and does not offer much benefit in exchange other than a more visually responsive UI element. 

##radio context

The radio-context.jsx file contains the bulk of the logic in the app and handles the majority of functions used in all other pages. this uncludes fetching,filtering,pausing,playing and tracking shared variables across all pages and components and a few other functions.

##main.js and preload.js:

main.js  creates the window the user can view and manages 3 functions that react cannot natively handle as they require features of node js instead of a front-end framework like react. main.js routes the calls to these functions between radio-context.jsx and preload.js which stores the actual function calls and api communication. this is done using an ipc handler/renderer and a context bridge.

###other files:

most other files contain the configurations and libraries used in the app so that electron can correctly manage them and succesfully package the app without including unnecessary libraries that were only required during development.

###use of AI:

AI was used for debugging and to assist with implementing features which would have either been very time consuming or to improve the ease or quality of the feature implemented.

###future improvements:

for future versions it would be ideal to include proper file management to allow for user data to persist between sessions and to include more rigorous testing of features to ensure there are no major bugs.
