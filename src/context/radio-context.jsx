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
    const [curfavorite, setCurFavorite] = useState(false)


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
        setRadioStations([]);
    },[]);
    useEffect(() => {
        async function loadFavorites() {
            const result = await window.electronAPI.getFavorites();
            if(result.success) {
                setFavorites(result.data);
            }
        }
        loadFavorites();
    }, []);

    useEffect(() => {
        async function loadRecents() {
            const result = await window.electronAPI.getRecents();
            if(result.success) {
                setRecent(result.data);
            }
        }
        loadRecents();
    }, []);


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
        setCurFavorite(false)
        
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
    setIsPlaying(true);
    audioRef.current.play();
    addRecent(station);
    console.log("recent stations:", recent);
    setCurFavorite(false)
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
                let updated = [radioStation,...recent]
                setRecent(updated)
                await window.electronAPI.addRecent(radioStation)
            }            
        
    async function addFavorites(radioStation) {
        if(radioStation) {
            console.log('Adding favorite:', radioStation);
            let updated = [...favorites, radioStation]
            setFavorites(updated)
            let res = await window.electronAPI.addFavorite(radioStations)
            console.log('addFavorite result:', res);
            setCurFavorite(true)

        }

        }
    async function removeFavorites(station) {
        if(station) {
            let updated = favorites.filter(s => s.stationuuid !== station.stationuuid)
            setFavorites(updated)
            await window.electronAPI.removeFavorite(station.stationuuid)            
            setCurFavorite(false)

        }
    }

    async function newStationButton(){
       await getStation()
        playStation(radioStations[0])
        setVote(false)
        setIsPlaying(true)
        setCurFavorite(false)
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
        curfavorite,
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
