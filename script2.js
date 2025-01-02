const clientId = "b2caf825b40a43e1842960054b1e0768"; // Replace with your Client ID
const clientSecret = "1927ee7b09cd4f63a91a8fb24fa4e26c"; // Replace with your Client Secret
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


// Function to fetch artist data
async function getArtistData(artistId) {
  const token = await getToken(); // Get the access token
  const apiUrl = `https://api.spotify.com/v1/artists/${artistId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching artist data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getArtistData:", error);
  }
}

// Example usage
(async () => {
  const artistId = "1Xyo4u8uXC1ZmMpatF05PJ"; // Example Artist ID (The Weeknd)
  const artistData = await getArtistData(artistId);

  console.log("Artist Data:", artistData);
})();

// Function to fetch albums for the artist
async function getArtistAlbums(artistId) {
  const token = await getToken(); // Get the access token
  const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching albums: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items; // Return the albums array
  } catch (error) {
    console.error("Error in getArtistAlbums:", error);
  }
}

// Example usage

(async () => {
  const artistId = "1Xyo4u8uXC1ZmMpatF05PJ"; // Example Artist ID (The Weeknd)
  
  try {
    const artistData = await getArtistData(artistId);
    console.log("Artist Data:", artistData);

    const albumsData = await getArtistAlbums(artistId);
    console.log("Albums Data:", albumsData);
  } catch (error) {
    console.error("Error in fetching artist or album data:", error);
  }
})();

// Function to display albums dynamically in the HTML
async function displayAlbums() {
  const artistId = "1Xyo4u8uXC1ZmMpatF05PJ"; // Example Artist ID (The Weeknd)
  const albums = await getArtistAlbums(artistId); // Fetch albums for the artist

  const albumContainer = document.getElementById("album-container");
  albumContainer.innerHTML = ""; // Clear any existing content

  let currentAudio = null;
  albums.forEach((album) => {
    // Create a card container for each album with play and pause buttons included in the HTML
    const albumCard = document.createElement("div");
    albumCard.classList.add("card2");
  
    // Add dynamic content for each album
    albumCard.innerHTML = `
      <img
        class="card-img2"
        src="${album.images[0]?.url || 'https://via.placeholder.com/150'}"
        alt="${album.name}"
      />
      <p class="card-text2">${album.name}</p>
      <p class="card-text2">${album.album_type}</p>
      <div class="play-controls">
        <div class="play_button">
          <i class="fa-solid fa-circle-play" style="color: #32ec73;"></i>
        </div>
        <div class="pause_button" style="display: none;">
          <i class="fa-solid fa-circle-pause" style="color: #32ec73;"></i>
        </div>
      </div>
    `;
  
    // Append the album card to the container
    albumContainer.appendChild(albumCard);
  
    // Get the play and pause buttons for the current card
    const playButton = albumCard.querySelector(".play_button");
    const pauseButton = albumCard.querySelector(".pause_button");
  
    // Add event listeners for play and pause buttons
    let audio = null;
    playButton.addEventListener("click", () => {
      const track = album.uri; // Assuming `href` contains the audio link
      if (track) {
        // Stop the currently playing track
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.parentPauseButton.style.display = "none";
          currentAudio.parentPlayButton.style.display = "block";
  
          // Remove the 'playing' class from the previous card
          currentAudio.parentPlayButton
            .closest(".card2")
            .classList.remove("playing");
        }
  
        // If audio is not yet created, create it
        if (!audio) {
          audio = new Audio(track);
        }
  
        // Play the current track
        audio.play();
        currentAudio = audio;
  
        // Associate buttons with the current audio
        currentAudio.parentPlayButton = playButton;
        currentAudio.parentPauseButton = pauseButton;
  
        // Add the 'playing' class to the current card
        playButton.closest(".card2").classList.add("playing");
  
        playButton.style.display = "none";
        pauseButton.style.display = "block";
      } else {
        console.log("No preview URL available.");
      }
    });

  
    pauseButton.addEventListener("click", () => {
      if (audio) {
        audio.pause();
        pauseButton.style.display = "none";
        playButton.style.display = "block";
  
        // Remove the 'playing' class when the track is paused
        pauseButton.closest(".card2").classList.remove("playing");
      }
    });
  });
  
}

// Call displayAlbums to fetch and add albums dynamically
displayAlbums();


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
    console.log(
      `Artists: ${track.artists.map((artist) => artist.name).join(", ")}`
    );
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
    const albumImageUrl =
      track.album && track.album.images
        ? track.album.images[0].url
        : "default_image_url"; // Fallback to default if no image

    const img = document.createElement("img");
    img.classList.add("card-img");
    img.src = albumImageUrl; //   Set the image source to the album artwork URL

    const trackName = document.createElement("p");
    trackName.classList.add("card-text");
    trackName.textContent = track.name;

    const artistName = document.createElement("p");
    artistName.classList.add("card-text");
    artistName.textContent = track.artists
      .map((artist) => artist.name)
      .join(", ");

    const playDiv = document.createElement("div");
    playDiv.classList.add("play_div");

    const playButton = document.createElement("div");
    playButton.classList.add("play_button");
    const playIcon = document.createElement("i");
    playIcon.classList.add("fa-solid", "fa-circle-play");
    playIcon.style.color = "#32ec73";
    playButton.style.zIndex = "99999"
    playButton.appendChild(playIcon);

    const pauseButton = document.createElement("div");
    pauseButton.classList.add("pause_button");
    const pauseIcon = document.createElement("i");
    pauseIcon.classList.add("fa-solid", "fa-circle-pause");
    pauseIcon.style.color = "#32ec73";
    pauseButton.appendChild(pauseIcon);

    pauseButton.style.display = "none";

    let audio = null;

    playButton.addEventListener("click", () => {
      if (track) {
        // Stop the currently playing track
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.parentPauseButton.style.display = "none";
          currentAudio.parentPlayButton.style.display = "block";

          // Remove the 'playing' class from the previous card
          currentAudio.parentPlayButton
            .closest(".card")
            .classList.remove("playing");
        }

        // If audio is not yet created, create it
        if (!audio) {
          audio = new Audio(track.href.preview_url,"Audio playing");
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

// Loader part for redirecting the page.
let container = document.getElementsByClassName("main-container")[0];
let loader = document.getElementsByClassName("loaderDiv")[0];
let buttons = document.querySelectorAll(".signUp1");

loader.style.display = "none";

buttons[0].onclick = () => {
  container.style.display = "none";
  loader.style.display = "flex";

  setTimeout(() => {
    window.location.href = "./pages/signup.html";
  }, 2500);
};

buttons[1].onclick = () => {
  container.style.display = "none";
  loader.style.display = "flex";

  setTimeout(() => {
    window.location.href = "./pages/login.html";
  }, 2500);
};


// modal when clicked
// let container = document.getElementsByClassName("main-container")[0];
let MessageModal = document.getElementById("MessageModal");
let ModalMessage = document.getElementById("ModalMessage");
let closeLoginModal = document.getElementsByClassName("close")[0];
container.style.zIndex="999999"

// Show the modal when the container is clicked
container.addEventListener("click", (event) => {
  event.preventDefault();

  ModalMessage.innerHTML = "Please login to listen to music";
  MessageModal.style.display = "block";
});

// Close the modal when the 'x' is clicked
closeLoginModal.onclick = function () {
  MessageModal.style.display = "none";
};

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  if (event.target === MessageModal) { // Fixed: Corrected the variable name
    MessageModal.style.display = "none";
  }
};

