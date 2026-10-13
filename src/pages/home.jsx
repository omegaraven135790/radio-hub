import React from 'react'
import "../css/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useRadio } from '../context/radio-context.jsx'
library.add(fas, far, fab)

function Home(){
const {pausePlayStation,skip,isPlaying,setVolumeLevel,radioStations,newStationButton,vote,voting} = useRadio();

    return <div className = "home">
            <div className = "top">
            </div>
            <div className = "home-content flex justfiy-between gap-6">
                {/* <FontAwesomeIcon icon="plus" className="save-button" size = "2x" /> */}

                <div className = "player">
                    <div className="disc-container">
                         <div className="disc">
                            <div className="disc-label">
                                <div>
                                    <div className="record-line"></div>
                                </div>
                            </div>
                          </div>
                    </div>
                    <h3 className = "station-name">{radioStations[0]?.name || 'No Station'}</h3>
                </div>

                {/* <FontAwesomeIcon icon="fa-regular fa-heart" className="like-button" size = "2x" /> */}

            </div>
            <div className = "Buttons">
                {/* <button className = "btn btn-primary"><FontAwesomeIcon icon="fa-regular fa-circle-play" /> </button> */}
                <button className = "btn btn-secondary heart" onClick = {voting}>{ <FontAwesomeIcon icon={vote ? "fa-solid fa-heart" : "fa-regular fa-heart"} className="like-button" size = "1x" /> }</button>
                <button className = "btn btn-secondary" id = "pause-play" onClick = {pausePlayStation}><FontAwesomeIcon icon = {isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"} /></button>
                <button className = "btn btn-secondary" onClick = {skip}><FontAwesomeIcon icon="fa-solid fa-forward-step" /></button>
            </div>
            <div className = "lower">
                <input type= "range" min="0" max="100" defaultValue="50" className = "volume-slider" onChange={(e) => setVolumeLevel(e.target.value)}></input>
                <button onClick = {newStationButton}>New Station</button>
            </div>
        </div>
}

// import { useRadio } from '../context/radio-context.jsx';

// function Home() {
//     const radio = useRadio();
//     console.log('radio context value:', radio);
//     return <div>Test</div>;
// }


export default Home;