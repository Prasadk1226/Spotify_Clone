const clientId = "b2caf825b40a43e1842960054b1e0768"; // Replace with your Client ID
const clientSecret = "6786041f6a15496eb36b294ba436c9d5"; // Replace with your Client Secret
const authUrl = "https://accounts.spotify.com/api/token";

// Function to get the access token
async function getToken() {
  try {
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error in getToken:", error);
  }
}

// Function to fetch album tracks
async function getAlbumTracks(albumId) {
  const token = await getToken();
  const albumTracksUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks`;

  try {
    const response = await fetch(albumTracksUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching tracks: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.items; // Return the tracks array
  } catch (error) {
    console.error("Error in getAlbumTracks:", error);
  }
}

async function getAlbumTracks(albumId) {
  const token = await getToken();
  const albumTracksUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks`;

  try {
    const response = await fetch(albumTracksUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching tracks: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Log the API response object
    console.log("API Response:", data); // This logs the response object from the API.

    return data.items; // Return the tracks array
  } catch (error) {
    console.error("Error in getAlbumTracks:", error);
  }
}


// Logging track data in the console
async function logTrackData(albumId) {
  const tracks = await getAlbumTracks(albumId); // Await the tracks

  if (!tracks || tracks.length === 0) {
    console.error("No tracks found for this album.");
    return;
  }
  // Call logTrackData to log album details
logTrackData("4aawyAB9vmqN3uQ7FjRGTy");

  // Log each track's details
  tracks.forEach((track) => {
    console.log(`Song Name: ${track.name}`);
    console.log(`Artists: ${track.artists.map((artist) => artist.name).join(", ")}`);
    console.log(`Duration: ${track.duration_ms} ms`);
    console.log(`Preview URL: ${track.preview_url}`);
    console.log(`Spotify URL: ${track.external_urls.spotify}`);
  });

  // Create a simplified array of song data
  const songsData = tracks.map((track) => ({
    name: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
    duration: track.duration_ms,
    preview: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
  }));

  console.log(songsData);
}




// Function to append tracks to HTML
async function appendTracksToHTML(albumId) {
  const tracks = await getAlbumTracks(albumId); // Fetch the tracks

  if (!tracks || tracks.length === 0) {
    console.error("No tracks found for this album.");
    return;
  }

  const cardRow = document.querySelector(".card-row");

  let currentAudio = null; // Tracks the currently playing audio

  tracks.forEach((track) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // const img = document.createElement("img");
    // img.classList.add("card-img");
    // // Uncomment the line below if you have the track image
    // // img.src = track.preview.url;
    // //  "placeholder_image_url";

    // Check if album images exist
    const albumImageUrl = track.album && track.album.images ? track.album.images[1].url : "default_image_url"; // Fallback to default if no image

    const img = document.createElement("img");
    img.classList.add("card-img");
    img.src = albumImageUrl; //   Set the image source to the album artwork URL

    const trackName = document.createElement("p");
    trackName.classList.add("card-text");
    trackName.textContent = track.name;

    const artistName = document.createElement("p");
    artistName.classList.add("card-text");
    artistName.textContent = track.artists.map((artist) => artist.name).join(", ");

    const playDiv = document.createElement("div");
    playDiv.classList.add("play_div");

    const playButton = document.createElement("div");
    playButton.classList.add("play_button");
    const playIcon = document.createElement("i");
    playIcon.classList.add("fa-solid", "fa-circle-play");
    playIcon.style.color = "#32ec73";
    playButton.appendChild(playIcon);

    const pauseButton = document.createElement("div");
    pauseButton.classList.add("pause_button");
    const pauseIcon = document.createElement("i");
    pauseIcon.classList.add("fa-solid", "fa-circle-pause");
    pauseIcon.style.color = "#32ec73";
    pauseButton.appendChild(pauseIcon);

    pauseButton.style.display = "none";

    let audio = null;

    // // Play button event
    // playButton.addEventListener("click", () => {
    //   if (track.preview_url) {
    //     // Stop the currently playing track
    //     if (currentAudio && currentAudio !== audio) {
    //       currentAudio.pause();
    //       currentAudio.parentPauseButton.style.display = "none";
    //       currentAudio.parentPlayButton.style.display = "block";
    //     }

    //     // If audio is not yet created, create it
    //     if (!audio) {
    //       audio = new Audio(track.preview_url);
    //     }

    //     // Play the current track
    //     audio.play();
    //     currentAudio = audio;

    //     // Associate buttons with the current audio
    //     currentAudio.parentPlayButton = playButton;
    //     currentAudio.parentPauseButton = pauseButton;

    //     playButton.style.display = "none";
    //     pauseButton.style.display = "block";
    //   } else {
    //     console.log("No preview URL available.");
    //   }
    // });

    // // Pause button event
    // pauseButton.addEventListener("click", () => {
    //   if (audio) {
    //     audio.pause();
    //     pauseButton.style.display = "none";
    //     playButton.style.display = "block";
    //   }
    // });

    playButton.addEventListener("click", () => {
      if (track.preview_url) {
        // Stop the currently playing track
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.parentPauseButton.style.display = "none";
          currentAudio.parentPlayButton.style.display = "block";
    
          // Remove the 'playing' class from the previous card
          currentAudio.parentPlayButton.closest(".card").classList.remove("playing");
        }
    
        // If audio is not yet created, create it
        if (!audio) {
          audio = new Audio(track.preview_url);
        }
    
        // Play the current track
        audio.play();
        currentAudio = audio;
    
        // Associate buttons with the current audio
        currentAudio.parentPlayButton = playButton;
        currentAudio.parentPauseButton = pauseButton;
    
        // Add the 'playing' class to the current card
        // playButton.closest(".card").classList.add("playing");
    
        playButton.style.display = "none";
        pauseButton.style.display = "block";
      } else {
        console.log("No preview URL available.");
      }
    });
    
    pauseButton.addEventListener("click", () => {
      if (audio) {
        audio.pause();
        pauseButton.style.display = "block";
        playButton.style.display = "block";
    
        // Remove the 'playing' class when the track is paused
        pauseButton.closest(".card").classList.remove("playing");
      }
    });
    



    playDiv.appendChild(pauseButton);
    playDiv.appendChild(playButton);

    card.appendChild(img);
    card.appendChild(trackName);
    card.appendChild(artistName);
    card.appendChild(playDiv);

    cardRow.appendChild(card);
  });
}

// Call the function with a specific album ID
appendTracksToHTML("4aawyAB9vmqN3uQ7FjRGTy");




// /* Show play button on card hover */
// .card:hover .play_div {
//   display: block; /* Show the play_div when hovering over the card */
// }

// .card.no-hover:hover .play_div {
//   display: none; /* Disable hover effect */
// }