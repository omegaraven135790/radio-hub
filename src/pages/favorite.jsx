import React from 'react'
import "../css/favorite.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useRadio } from '../context/radio-context.jsx'
import Favcard from '../components/favCard.jsx'
library.add(fas, far, fab)

function Favorite(){
const {radioStations,favorites} = useRadio();

    return <div className = "favorite">
           {favorites && favorites.length > 0 && favorites.map((station, index) => (
                <Favcard key={index} data={station} />
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



export default Favorite;