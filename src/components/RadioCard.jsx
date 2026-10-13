import React from 'react'
import "../css/radioCard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useRadio } from '../context/radio-context.jsx'
library.add(fas, far, fab)

function Radiocard({data}){
    const {playStation,radioStations,setRadioStations} = useRadio();
    return <div className = "radio-card ">
        <div>
            <h3 className = "station-name">{data?.name || 'No Station'}</h3>
            <div className = "radio-card-content">
            <div>
                 {/* <p className = "station-url">url:{data?.url_resolved || 'No URL'}</p> */}
                 
            </div>


           <div>
                <p className = "station-country">country:{data?.country || 'unknown country'}</p>
                 <p className = "station-votes">votes:{data?.votes || 'unknown votes'}</p>
           </div>
           <div>
                <p className = "station-tags">tags:{data?.tags || 'unknown tags'}</p>
           </div>


        </div>
        </div>


        <div>
            <button className = "station-button" onClick={
                () => {setRadioStations([data])
                        console.log(radioStations)
                        playStation(data)
                } }><FontAwesomeIcon icon="play" size="3x" />
            
            </button>
        </div>
           
        
    </div>

}

export default Radiocard;