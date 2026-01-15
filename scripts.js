document.addEventListener('DOMContentLoaded', () => {
    const liveSongElement = document.querySelector('.live-song');
    const liveArtistElement = document.querySelector('.live-artist');
    const coverElement = document.querySelector('.cover');
    const audioPlayer = document.getElementById('html5player');
    const stationInfoElements = document.querySelectorAll('.station-info');
    const radioPlayer = document.querySelector('.radio-player');
    
    // Make font thicker
    liveSongElement.style.fontWeight = '900';
    liveArtistElement.style.fontWeight = '100';
    
    // Station data with stream URLs and images
    const stations = [
        {
            name: 'NPO Radio 1',
            streamUrl: 'https://icecast.omroep.nl/radio1-bb-mp3',
            apiMount: null,
            image: 'https://yt3.googleusercontent.com/_cjlKxDdxo0xtEaScNyQ9YC6DK6MAmA_xHi_iNYBr6WfF16mAfEyOMTWJtPjM71rf28ed32rVuo=s900-c-k-c0x00ffffff-no-rj'
        },
        {
            name: 'NPO Radio 2',
            streamUrl: 'https://icecast.omroep.nl/radio2-bb-mp3',
            apiMount: null,
            image: 'https://myonlineradio.nl/public/uploads/radio_img/npo-radio-2/play_250_250.webp'
        },
        {
            name: 'Radio 10',
            streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO10.mp3',
            apiMount: 'RADIO10',
            image: 'https://play-lh.googleusercontent.com/TLtI8n1lvkpnTP3tVUp7uN_mYs116ua7k9SnSRHOv5wYS71US9mzaMtPbgB9DDClG8dN'
        },
        {
            name: 'Radio 538',
            streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538.mp3',
            apiMount: 'RADIO538',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Logo_538_Nederland.jpg/250px-Logo_538_Nederland.jpg'
        },
        {
            name: 'KINK',
            streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/KINKAAC.aac',
            apiMount: 'KINKAAC',
            image: 'https://static.mytuner.mobi/media/tvos_radios/yTMB8WVAUb.png'
        },
        {
            name: 'Veronica',
            streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VERONICA.mp3',
            apiMount: 'VERONICA',
            image: 'https://play-lh.googleusercontent.com/ye_WAoLDWRncZlMjJLOrI32iXr-9BrBnXBy373J3M3VZQPUbD1jplnZ_Mb1183dyxUE'
        }
    ];
    
    let currentStationIndex = 0;
    
    // Add click event listeners to station info elements
    stationInfoElements.forEach((element, index) => {
        element.addEventListener('click', () => {
            currentStationIndex = index;
            changeStation(index);
        });
    });
    
    function changeStation(index) {
        const station = stations[index];
        
        // Update cover image to match the station
        coverElement.style.backgroundImage = `url('${station.image}')`;
        coverElement.style.backgroundSize = 'cover';
        coverElement.style.backgroundPosition = 'center';
        
        // Update audio source
        audioPlayer.src = station.streamUrl;
        audioPlayer.load();
        audioPlayer.play();
        
        // Update song info
        liveSongElement.textContent = `${station.name}`;
        liveArtistElement.textContent = 'Loading song info...';
        
        // Fetch current song info if API is available
        if (station.apiMount) {
            getCurrentSongInfo(station.apiMount);
        }
    }
    
    async function getCurrentSongInfo(mountName) {
        try {
            // Try direct API call first
            const apiUrl = `https://np.tritondigital.com/public/nowplaying?mountName=${mountName}&numberToFetch=1&eventType=track`;
            
            console.log('Attempting to fetch song info from:', apiUrl); // Debug log
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/xml',
                }
            });
            
            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('Raw response text:', text); // Debug log
            
            // Parse XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            
            // Extract song information from XML
            const properties = xmlDoc.querySelectorAll('property');
            let title = 'Unknown Title';
            let artist = 'Unknown Artist';
            
            properties.forEach(prop => {
                const name = prop.getAttribute('name');
                const value = prop.textContent;
                
                console.log(`Property: ${name} = ${value}`); // Debug log
                
                if (name === 'cue_title' || name === 'track_title') {
                    title = value;
                } else if (name === 'track_artist_name' || name === 'cue_artist') {
                    artist = value;
                }
            });
            
            console.log('Extracted - Title:', title, 'Artist:', artist); // Debug log
            
            liveSongElement.textContent = title;
            liveArtistElement.textContent = artist;
            
        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                type: error.name
            });
            
            liveArtistElement.textContent = 'Song info unavailable';
        }
    }

    // Update song info every 30 seconds for current station
    setInterval(() => {
        const station = stations[currentStationIndex];
        if (station.apiMount) {
            getCurrentSongInfo(station.apiMount);
        }
    }, 30000);
    
    // Initial setup - load first station
    changeStation(0);
});