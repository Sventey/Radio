document.addEventListener('DOMContentLoaded', () => {
    const playPauseButton = document.getElementById('play-pause');
    const volumeSlider = document.getElementById('volume');
    const audioPlayer = document.getElementById('audio-player');
    const coverImage = document.getElementById('current-song-cover');

    // Play/Pause functionality
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = '⏸'; // Change button to pause icon
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = '▶'; // Change button to play icon
        }
    });

    // Volume control
    volumeSlider.addEventListener('input', (event) => {
        audioPlayer.volume = event.target.value;
    });

    // Function to fetch current song metadata
    async function fetchCurrentSong() {
        try {
            // Replace with the actual API endpoint for KINK's current song metadata
            const response = await fetch('https://api.kink.nl/current-song');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Update the cover image source
            if (data && data.coverImageUrl) {
                coverImage.src = data.coverImageUrl;
            } else {
                console.warn('No cover image URL found in the response.');
            }
        } catch (error) {
            console.error('Error fetching current song metadata:', error);
            // Optionally, set a fallback image
            coverImage.src = 'fallback-image.jpg'; // Replace with your fallback image URL
        }
    }

    // Fetch the current song metadata every 10 seconds
    setInterval(fetchCurrentSong, 10000);

    // Initial fetch
    fetchCurrentSong();
});