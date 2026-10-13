import React from 'react'
import "../css/topStation.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useRadio } from '../context/radio-context.jsx'
import Radiocard from '../components/RadioCard.jsx'
library.add(fas, far, fab)

function Top(){
const {topStations} = useRadio();

    return <div className = "top-station">
           {topStations && topStations.length > 0 && topStations.map((station, index) => (
                <Radiocard key={index} data={station} />
            ))}
            {/* <Radiocard data={recent[0]} /> */}
        
            
        </div>
}

// import { useRadio } from '../context/radio-context.jsx';

// function Home() {
//     const radio = useRadio();
//     console.log('radio context value:', radio);
//     return <div>Test</div>;
// }

export default Top;