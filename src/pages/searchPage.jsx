import React from 'react'
import "../css/search.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { useRadio } from '../context/radio-context.jsx'
import Radiocard from '../components/RadioCard.jsx'
import { useState } from 'react'
library.add(fas, far, fab)

function Search(){
    const[inputs,setInputs] = useState({
        search: "",
        tagList: "",
        limit: 10,
        offset: 0,
        hidebroken: true,
        order: "votes",
        country: "",
        language: "",
        reverse: true

    })
    const[searchResult,setSearchResult] = useState([]);

const {radioStations,searchStation} = useRadio();

const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

return (
    <div className="search-page">
        <h1>Radio Search</h1>
        {/* {searchResults.map((station) => (
            <Radiocard key={station.id} station={station} />
        ))} */}
        <form onSubmit={async (e) => {
            e.preventDefault();
            setSearchResult(await searchStation(inputs))
            console.log("search result:", searchResult)
            console.log("inputs:", inputs)
        }}>
            <label> Station Name:(case sensitive)
            <input type="text" name="search" value = {inputs.search} onChange={handleChange} />
            </label>
            <label> tags:(comma seprated)
            <input type="text" name="tagList" value = {inputs.tagList} onChange={handleChange} />
            </label>
            <div className = "row flex gap-3">
            <label> Limit:
            <input type="number" name="limit" value = {inputs.limit} onChange={handleChange} />
            </label>
            <label> Offset:
            <input type="number" name="offset" value = {inputs.offset} onChange={handleChange} />
            </label>
            </div>

            <div className = "row flex gap-3">
            <label> Country:
            <input type="text" name="country" value = {inputs.country} onChange={handleChange} />
            </label>
            <label> Language:
            <input type="text" name="language" value = {inputs.language} onChange={handleChange} />
            </label>
            </div>
            
            <label>sort by:
                <select value={inputs.order} name="order" onChange={handleChange}>
                    <option value="votes">Votes</option>
                    <option value="name">Name</option>
                    <option value="country">Country</option>
                    <option value="language">Language</option>
                    <option value="clickcount">clicks</option>
                    <option value = "random">Random</option>
                </select>
            </label>
            <button type = "submit">Search</button>

        </form>

        <div>
        {searchResult && searchResult.length > 0 && searchResult.map((station, index) => (
            <Radiocard key={station.stationuuid} data={station} />
        ))}
        </div>
    </div>
)}

export default Search;