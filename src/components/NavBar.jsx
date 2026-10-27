import {Link} from 'react-router-dom'
import React from 'react'
import "../css/nav.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab)
function NavBar(){
    return <nav className = "navbar flex gap-6 justify-between bg-[#003566] ">
        <div className = "navbar-brand ">
            <Link to = "/" className = "nav-link" id = "radio-icon"><FontAwesomeIcon icon="fa-solid fa-radio" size = "2x"  /></Link>
        </div>
        <div className = "navbar-links flex gap-3 justify-between p-3 bg-[#003566] pl-5 pr-5 ">
            {/* <Link to = "/top" className = "nav-link">Top Stations</Link> */}
            <Link to = "/recent" className = "nav-link">Recent Stations</Link>
            <Link to = "/favorite" className = "nav-link">Favorite Stations</Link>
            <Link to = "/search" className = "selected-nav-link" id = "search">Search &emsp;&nbsp;<FontAwesomeIcon icon="fa-solid fa-search" /></Link>
        </div>
    </nav>
}

export default NavBar;