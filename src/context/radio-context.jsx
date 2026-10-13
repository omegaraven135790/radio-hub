import React,{createContext, useState, useContext, useEffect,useRef} from "react"
import RadioBrowser from 'radio-browser';

const RadioContext = createContext()

export const useRadio = () => { 
    return useContext(RadioContext)
}

export const RadioProvider = ({children,audioRef}) => {
    
    const [radioStations, setRadioStations] = useState([])
    const [favorites, setFavorites] = useState([])
    const [recent, setRecent] = useState([])
    const [error, setError] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [vote, setVote] = useState(false);
    const [topStations, setTopStations] = useState([])


    // useEffect(() => {
    // async function loadPersisted() {
    //     const storedFavorites = await window.electronStore.get('favorites');
    //     const storedRecent = await window.electronStore.get('recent');
    //     setFavorites(storedFavorites || []);
    //     setRecent(storedRecent || []);
    // }
    // loadPersisted();
    // }, []);

    // useEffect(() => {
    // // setFavorites(store.get('favorites') || []);
    // // setRecent(store.get('recent') || []);
    // }, []);

    // useEffect(() => {
    //     addRecent(radioStations)
    // }, [radioStations])
    useEffect(() => {
        getTopStation();
    },[]);


    function setVolumeLevel(value) {
        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.volume = value / 100;
            setVolume(value);
        }
    }
    function pausePlayStation() {
        const audioElement = audioRef.current;
        if(!audioElement)
            {
                playStation(radioStations[0])
            };
        if (audioElement.paused) {
            audioElement.play()
            setIsPlaying(true)
        } else {
            audioElement.pause()
            setIsPlaying(false)
        }
    }
    async function skip() {
        const audioElement = audioRef.current;
        const data = await getStation()
        if(!data || data.length === 0) {
            console.log(error)
            return;
        }
        playStation(data[0])
        setVote(false)
        
    }

    async function getStation(customFilters) {
    const filter = customFilters || { 
        limit: 1, 
        order: 'random',
        offset: Math.floor(Math.random() * 30000) 
        };
    try {
        const result = await window.electronAPI.getStations(filter);
        console.log('getStation result:', result);
        if (!result.success || !result.data || result.data.length === 0) {
            setError('No radio stations found');
            return [];
        }
        if (result.data[0].url_resolved === null) {
            // return await getStation(filter);
        }
        else{
            setRadioStations(result.data);
            return result.data;
        }
        
    } catch (err) {
        console.error(err);
        setError('Error occurred while fetching radio stations');
        return [];
    }
}

        function playStation(station) {
    const url = station.url_resolved || station.url;
    if (!url) {
        setError('No playable URL for this station');
        return;
    }
    audioRef.current.src = url;
    audioRef.current.load();
    audioRef.current.play();
    addRecent(station);
    console.log("recent stations:", recent);
    }

    async function searchStation(filters) {
    let filteredData = {};
    for (const [key, value] of Object.entries(filters)) {
        if (value !== "" && value !== null && value !== undefined) {
            filteredData[key] = value;
        }
    }
    const result = await window.electronAPI.searchStations(filteredData);
    if (!result.success) {
        setError(result.error);
        return [];
    }
    return result.data;
}

    async function voting() {
        let stationuuid = radioStations[0]?.stationuuid;
        if (!stationuuid) {
            console.error('No station UUID available to vote for');
            return;
        }
        else if (!vote) {
            try {
                const result = await window.electronAPI.voteStation(stationuuid);
                console.log('vote result:', result);
                setVote(true);
            } catch (err) {
                console.error(err);
            }
        }
    }


    async function   addRecent(radioStation){
                let updated = [...recent, radioStation]
                setRecent(updated)
            }            
        
    async function addFavorites(radioStations) {
        // if(radioStations) {
        //     let updated = [...favorites, radioStations]
        //     setFavorites(updated)
        //     await window.electronStore.set('favorites', updated)
        //     // electron-store.set('favorites', updated)
        // }

        }
    async function removeFavorites(station) {
        // if(station) {
        //     let updated = favorites.filter(s => s.stationuuid !== station.stationuuid)
        //     setFavorites(updated)
        //     await window.electronStore.set('favorites', updated)
        //     // electron-store.set('favorites', updated)
            
        // }
    }

    async function newStationButton(){
       await getStation()
        playStation(radioStations[0])
        setVote(false)
        setIsPlaying(true)
    }

    async function getTopStation(){
        setTopStations(await getStation({limit: 10, order: 'votes', reverse: true}))
    }
    const value = {
        radioStations,
        favorites,
        recent,
        error,
        isPlaying,
        volume,
        vote,
        topStations,
        pausePlayStation,
        skip,
        addFavorites,
        addRecent,
        getStation,
        playStation,
        setVolumeLevel,
        removeFavorites,
        newStationButton,
        voting,
        setRadioStations,
        searchStation,
        getTopStation
    }
    return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>
}
