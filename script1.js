// const { wrap } = require("module");

const clientId = "5bdc01d6dfd84ba797a0f13b0a26b266"; // Replace with your Client ID
const clientSecret = "b2bc92dc7e2647feab094a6ccbcb1105"; // Replace with your Client Secret
const authUrl = "https://accounts.spotify.com/api/token";

// Function to get the access token
async function getToken() {
  try {
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
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
    return data.items; // This contains the list of tracks
  } catch (error) {
    console.error("Error in getAlbumTracks:", error);
  }
}

const showAllButtons = document.querySelectorAll(".showAll"); // Select all "Show all" buttons

showAllButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get the closest parent card-rows to the clicked button
    const cardRow = button.closest(".card-rows");

    // Select the .box within that specific card-row
    const box = cardRow.querySelector(".box");

    // Apply flex-wrap: wrap to that specific .box element
    box.style.flexWrap = box.style.flexWrap === "wrap" ? "nowrap" : "wrap";
    // box.style.flexWrap = "nowrap"?"wrap":"nowrap";
  });
});

let currentAudio = "null"; // Tracks the currently playing audio

async function logArtists() {
  const tracks = await getAlbumTracks("7zCODUHkfuRxsUjtuzNqbd"); // Use the album ID
  const cardRow = document.getElementById("card-row1");

  // tracks.forEach((item) => {
  //   const artists = item.artists; // Get the 'artists' array from the item

  //   artists.forEach((artist) => {
  //     console.log(`Artist Name: ${artist.name}`);
  //     console.log(`Artist Spotify URL: ${artist.external_urls.spotify}`);
  //     console.log(`Artist ID: ${artist.id}`);
  //     console.log("---");
  //   });
  // });

  tracks.forEach((track) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Create and add the album image
    const img = document.createElement("img");
    img.classList.add("card-img");
    img.src =
      track.album && track.album.images && track.album.images.length > 0
        ? track.album.images[1].url
        : "https://cdn.vectorstock.com/i/1000v/29/27/note-music-colorful-rainbow-logo-icon-illus-vector-28932927.jpg"; // Fallback image if none exists
    card.appendChild(img);

    // Create and add the track name
    const trackName = document.createElement("p");
    trackName.classList.add("card-text");
    trackName.textContent = track.name || "Unknown Track";
    card.appendChild(trackName);

    // Create and add the artist names
    const artistName = document.createElement("p");
    artistName.classList.add("card-text");
    artistName.textContent =
      track.artists && track.artists.length > 0
        ? track.artists.map((artist) => artist.name).join(", ")
        : "Unknown Artist";
    card.appendChild(artistName);

    const playDiv = document.createElement("div");
    playDiv.classList.add("play_div");

    const playButton = document.createElement("div");
    playButton.classList.add("play_button");
    const playIcon = document.createElement("i");
    playIcon.classList.add("fa-solid", "fa-circle-play");
    playIcon.style.color = "#32ec73";
    playButton.style.zIndex = "99999";
    playButton.appendChild(playIcon);

    const pauseButton = document.createElement("div");
    pauseButton.classList.add("pause_button");
    const pauseIcon = document.createElement("i");
    pauseIcon.classList.add("fa-solid", "fa-circle-pause");
    pauseIcon.style.color = "#32ec73";
    pauseButton.appendChild(pauseIcon);

    pauseButton.style.display = "none";

    let audio = "";

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
          audio = new Audio(tracks.href);
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
        pauseButton.style.display = "none";
        playButton.style.display = "block";

        // Remove the 'playing' class when the track is paused
        pauseButton.closest(".card").classList.remove("playing");
      }
    });
    card.appendChild(playDiv);

    playDiv.appendChild(pauseButton);
    playDiv.appendChild(playButton);

    // Append the card to the card row
    cardRow.appendChild(card);
  });
}

// Function to fetch albums for the artist
async function getArtistData(artistId) {
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
      throw new Error(
        `Error fetching albums: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    //   // Extract and return all IDs
    // const albumIds = data.items.map(album => album.id);
    // console.log("Album IDs:", albumIds);

    return data.items; // Return the albums array
  } catch (error) {
    console.error("Error in getArtistAlbums:", error);
  }
}

// Example usage

(async () => {
  const artistId = "6tbjWDEIzxoDsBA1FuhfPW"; // Example Artist ID (The Weeknd)
  const albumId = "12INlMsFtBjyehNnawBv36"; // Example Album ID (After Hours)

  try {
    const artistData = await getArtistData(artistId);
    console.log("Artist Data:", artistData);

    // // const searchDiv = document.getElementById("searchDiv")
    // // searchDiv.value.toLowerCase().includes(artist.name)
    
    // const searchDiv = document.getElementById("searchDiv");
    // const resultDiv = document.getElementById("resultDiv");
    
    // // Function to display cards in the resultDiv
    // function displayCards(data) {
    //   resultDiv.innerHTML = ""; // Clear all elements in resultDiv
    
    //   // Create a container to hold the cards
    //   const cardContainer = document.createElement("div");
    //   cardContainer.classList.add("box"); // Optional class for styling
    
    //   data.forEach((track) => {
    //     const card = document.createElement("div");
    //     card.classList.add("card");
    
    //     // Create and add the album image
    //     const img = document.createElement("img");
    //     img.classList.add("card-img");
    //     img.src = track.images[1].url;
    //     card.appendChild(img);
    
    //     // Create and add the track name
    //     const trackName = document.createElement("p");
    //     trackName.classList.add("card-text");
    //     trackName.textContent = track.name || "Unknown Track";
    //     card.appendChild(trackName);
    
    //     // Create and add the track duration
    //     const trackDuration = document.createElement("p");
    //     trackDuration.classList.add("card-text");
    //     const duration = track.duration_ms
    //       ? `Duration: ${(track.duration_ms / 1000 / 60).toFixed(2)} minutes`
    //       : "Unknown Duration";
    //     trackDuration.textContent = duration;
    //     card.appendChild(trackDuration);
    
    //     // Create and add the artist names
    //     const artistName = document.createElement("p");
    //     artistName.classList.add("card-text");
    //     artistName.textContent =
    //       track.artists && track.artists.length > 0
    //         ? `Artist: ${track.artists.map((artist) => artist.name).join(", ")}`
    //         : "Unknown Artist";
    //     card.appendChild(artistName);
    
    //     // Append the card to the container
    //     cardContainer.appendChild(card);
    //   });
    
    //   // Append the card container to the resultDiv
    //   resultDiv.appendChild(cardContainer);
    // }
    
    // // Add event listener for search input
    // searchDiv.addEventListener("input", () => {
    //   const query = searchDiv.value.toLowerCase();
    //   const filteredData = artistData.filter(
    //     (track) =>
    //       track.name.toLowerCase().includes(query) ||
    //       track.artists.some((artist) =>
    //         artist.name.toLowerCase().includes(query)
    //       )
    //   );
    //   displayCards(filteredData);
    // });
    
    // // Initial display of all cards
    // displayCards(artistData);
    
    
    
    

    const albumsData = await getAlbumTracks(albumId);
    console.log("Albums Data:", albumsData);

    artistData.forEach((track, index) => {
      let cardRow = document.getElementById("card-row");

      const card = document.createElement("div");
      card.classList.add("card");

      // Create and add the album image
      const img = document.createElement("img");
      img.classList.add("card-img");
      img.src = track.images[1].url;
      card.appendChild(img);

      // Create and add the track name
      const trackName = document.createElement("p");
      trackName.classList.add("card-text");
      trackName.textContent = track.name || "Unknown Track";
      card.appendChild(trackName);

      // Create and add the track duration
      // const trackDuration = document.createElement("p");
      // trackDuration.classList.add("card-text");
      // const duration = track.duration_ms
      //   ? `Track ${index + 1}: ${(track.duration_ms / 1000 / 60).toFixed(
      //       2
      //     )} minutes`
      //   : "Unknown Duration";
      // trackDuration.textContent = duration;
      // card.appendChild(trackDuration);

      // Create and add the artist names
      const artistName = document.createElement("p");
      artistName.classList.add("card-text");
      artistName.textContent =
        track.artists && track.artists.length > 0
          ? track.artists.map((artist) => artist.name).join(", ")
          : "Unknown Artist";
      card.appendChild(artistName);

      // Append the card to the card row
      cardRow.appendChild(card);

      const playDiv = document.createElement("div");
      playDiv.classList.add("play_div");

      const playButton = document.createElement("div");
      playButton.classList.add("play_button");
      const playIcon = document.createElement("i");
      playIcon.classList.add("fa-solid", "fa-circle-play");
      playIcon.style.color = "#32ec73";
      playButton.style.zIndex = "99999";
      playButton.appendChild(playIcon);

      const pauseButton = document.createElement("div");
      pauseButton.classList.add("pause_button");
      const pauseIcon = document.createElement("i");
      pauseIcon.classList.add("fa-solid", "fa-circle-pause");
      pauseIcon.style.color = "#32ec73";
      pauseButton.appendChild(pauseIcon);

      pauseButton.style.display = "none";

      let audio = "";

      playButton.addEventListener("click", () => {
        if (track.preview_url) {
          console.log(track);
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
          pauseButton.style.display = "none";
          playButton.style.display = "block";

          // Remove the 'playing' class when the track is paused
          pauseButton.closest(".card").classList.remove("playing");
        }
      });
      card.appendChild(playDiv);

      playDiv.appendChild(pauseButton);
      playDiv.appendChild(playButton);

      // Append the card to the card row
      cardRow.appendChild(card);

      // Log track details
      // if (track.artists && track.artists.length > 0) {
      //   console.log(`Track ${index + 1}: ${track.artists[0].uri}`);
      //   console.log(`Track ${index + 1}: ${track.artists[0].href}`);
      // } else {
      //   console.log(`Track ${index + 1}: Unknown Artist URI or HREF`);
      // }
      // console.log(`Track ${index + 1}: ${track.type}`);
      // console.log(`Track ${index + 1}: ${track.name}`);
    });
  } catch (error) {
    console.error("Error in fetching artist or album data:", error);
  }
})();

logArtists(); // Call the async function
logArtists(); // Call the async function
logArtists(); // Call the async function

(async () => {
  const artistId = "62k5LKMhymqlDNo2DWOvvv"; // Example Artist ID (The Weeknd)
  // const albumId = "12INlMsFtBjyehNnawBv36"; // Example Album ID (After Hours)

  try {
    const artistData = await getArtistData(artistId);
    console.log("Artist Data:", artistData);

    // const albumsData = await getAlbumTracks(albumId);
    // console.log("Albums Data:", albumsData);

    artistData.forEach((track, index) => {
      let cardRow0 = document.getElementById("card-row0");

      const card = document.createElement("div");
      card.classList.add("card");

      // Create and add the album image
      const img = document.createElement("img");
      img.classList.add("card-img");
      img.src = track.images[1].url;
      card.appendChild(img);

      // Create and add the track name
      const trackName = document.createElement("p");
      trackName.classList.add("card-text");
      trackName.textContent = track.name || "Unknown Track";
      card.appendChild(trackName);

      // // Create and add the track duration
      // const trackDuration = document.createElement("p");
      // trackDuration.classList.add("card-text");
      // const duration = track.duration_ms
      //   ? `Track ${index + 1}: ${(track.duration_ms / 1000 / 60).toFixed(
      //       2
      //     )} minutes`
      //   : "Unknown Duration";
      // trackDuration.textContent = duration;
      // card.appendChild(trackDuration);

      // Create and add the artist names
      const artistName = document.createElement("p");
      artistName.classList.add("card-text");
      artistName.textContent =
        track.artists && track.artists.length > 0
          ? track.artists.map((artist) => artist.name).join(", ")
          : "Unknown Artist";
      card.appendChild(artistName);

      // Append the card to the card row
      cardRow0.appendChild(card);

      const playDiv = document.createElement("div");
      playDiv.classList.add("play_div");

      const playButton = document.createElement("div");
      playButton.classList.add("play_button");
      const playIcon = document.createElement("i");
      playIcon.classList.add("fa-solid", "fa-circle-play");
      playIcon.style.color = "#32ec73";
      playButton.style.zIndex = "99999";
      playButton.appendChild(playIcon);

      const pauseButton = document.createElement("div");
      pauseButton.classList.add("pause_button");
      const pauseIcon = document.createElement("i");
      pauseIcon.classList.add("fa-solid", "fa-circle-pause");
      pauseIcon.style.color = "#32ec73";
      pauseButton.appendChild(pauseIcon);

      pauseButton.style.display = "none";

      let audio = "";

      playButton.addEventListener("click", () => {
        if (track.preview_url) {
          console.log(track);
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
            audio = new Audio(track.href);
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
          pauseButton.style.display = "none";
          playButton.style.display = "block";

          // Remove the 'playing' class when the track is paused
          pauseButton.closest(".card").classList.remove("playing");
        }
      });
      card.appendChild(playDiv);

      playDiv.appendChild(pauseButton);
      playDiv.appendChild(playButton);

      // Append the card to the card row
      cardRow0.appendChild(card);

      // Log track details
      // if (track.artists && track.artists.length > 0) {
      //   console.log(`Track ${index + 1}: ${track.artists[0].uri}`);
      //   console.log(`Track ${index + 1}: ${track.artists[0].href}`);
      // } else {
      //   console.log(`Track ${index + 1}: Unknown Artist URI or HREF`);
      // }
      // console.log(`Track ${index + 1}: ${track.type}`);
      // console.log(`Track ${index + 1}: ${track.name}`);
    });
  } catch (error) {
    console.error("Error in fetching artist or album data:", error);
  }
})();

// Example usage

(async () => {
  const artistId = "6tbjWDEIzxoDsBA1FuhfPW"; // Example Artist ID (The Weeknd)
  const albumId = "12INlMsFtBjyehNnawBv36"; // Example Album ID (After Hours)

  try {
    const artistData = await getArtistData(artistId);
    console.log("Artist Data:", artistData);

    const albumsData = await getAlbumTracks(albumId);
    console.log("Albums Data:", albumsData);

    artistData.forEach((track, index) => {
      let cardRow1 = document.getElementById("card-row1");

      const card = document.createElement("div");
      card.classList.add("card");

      // Create and add the album image
      const img = document.createElement("img");
      img.classList.add("card-img");
      img.src = track.images[1].url;
      card.appendChild(img);

      // Create and add the track name
      const trackName = document.createElement("p");
      trackName.classList.add("card-text");
      trackName.textContent = track.name || "Unknown Track";
      card.appendChild(trackName);

      // // Create and add the track duration
      // const trackDuration = document.createElement("p");
      // trackDuration.classList.add("card-text");
      // const duration = track.duration_ms
      //   ? `Track ${index + 1}: ${(track.duration_ms / 1000 / 60).toFixed(
      //       2
      //     )} minutes`
      //   : "Unknown Duration";
      // trackDuration.textContent = duration;
      // card.appendChild(trackDuration);

      // Create and add the artist names
      const artistName = document.createElement("p");
      artistName.classList.add("card-text");
      artistName.textContent =
        track.artists && track.artists.length > 0
          ? track.artists.map((artist) => artist.name).join(", ")
          : "Unknown Artist";
      card.appendChild(artistName);

      // Append the card to the card row
      cardRow1.appendChild(card);

      const playDiv = document.createElement("div");
      playDiv.classList.add("play_div");

      const playButton = document.createElement("div");
      playButton.classList.add("play_button");
      const playIcon = document.createElement("i");
      playIcon.classList.add("fa-solid", "fa-circle-play");
      playIcon.style.color = "#32ec73";
      playButton.style.zIndex = "99999";
      playButton.appendChild(playIcon);

      const pauseButton = document.createElement("div");
      pauseButton.classList.add("pause_button");
      const pauseIcon = document.createElement("i");
      pauseIcon.classList.add("fa-solid", "fa-circle-pause");
      pauseIcon.style.color = "#32ec73";
      pauseButton.appendChild(pauseIcon);

      pauseButton.style.display = "none";

      let audio = "";

      playButton.addEventListener("click", () => {
        if (track.preview_url) {
          console.log(track);
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
            audio = new Audio(track.href);
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
          pauseButton.style.display = "none";
          playButton.style.display = "block";

          // Remove the 'playing' class when the track is paused
          pauseButton.closest(".card").classList.remove("playing");
        }
      });
      card.appendChild(playDiv);

      playDiv.appendChild(pauseButton);
      playDiv.appendChild(playButton);

      // Append the card to the card row
      cardRow1.appendChild(card);

      // Log track details
      // if (track.artists && track.artists.length > 0) {
      //   console.log(`Track ${index + 1}: ${track.artists[0].uri}`);
      //   console.log(`Track ${index + 1}: ${track.artists[0].href}`);
      // } else {
      //   console.log(`Track ${index + 1}: Unknown Artist URI or HREF`);
      // }
      // console.log(`Track ${index + 1}: ${track.type}`);
      // console.log(`Track ${index + 1}: ${track.name}`);
    });
  } catch (error) {
    console.error("Error in fetching artist or album data:", error);
  }
})();

// Example usage

(async () => {
  const artistId = "699OTQXzgjhIYAHMy9RyPD"; // Example Artist ID (The Weeknd)
  // const albumId = "12INlMsFtBjyehNnawBv36"; // Example Album ID (After Hours)

  try {
    const artistData = await getArtistData(artistId);
    console.log("Artist Data:", artistData);

    // const albumsData = await getAlbumTracks(albumId);
    // console.log("Albums Data:", albumsData);

    artistData.forEach((track, index) => {
      let cardRow2 = document.getElementById("card-row2");

      const card = document.createElement("div");
      card.classList.add("card");

      // Create and add the album image
      const img = document.createElement("img");
      img.classList.add("card-img");
      img.src = track.images[1].url;
      card.appendChild(img);

      // Create and add the track name
      const trackName = document.createElement("p");
      trackName.classList.add("card-text");
      trackName.textContent = track.name || "Unknown Track";
      card.appendChild(trackName);

      // // Create and add the track duration
      // const trackDuration = document.createElement("p");
      // trackDuration.classList.add("card-text");
      // const duration = track.duration_ms
      //   ? `Track ${index + 1}: ${(track.duration_ms / 1000 / 60).toFixed(
      //       2
      //     )} minutes`
      //   : "Unknown Duration";
      // trackDuration.textContent = duration;
      // card.appendChild(trackDuration);

      // Create and add the artist names
      const artistName = document.createElement("p");
      artistName.classList.add("card-text");
      artistName.textContent =
        track.artists && track.artists.length > 0
          ? track.artists.map((artist) => artist.name).join(", ")
          : "Unknown Artist";
      card.appendChild(artistName);

      // Append the card to the card row
      cardRow2.appendChild(card);

      const playDiv = document.createElement("div");
      playDiv.classList.add("play_div");

      const playButton = document.createElement("div");
      playButton.classList.add("play_button");
      const playIcon = document.createElement("i");
      playIcon.classList.add("fa-solid", "fa-circle-play");
      playIcon.style.color = "#32ec73";
      playButton.style.zIndex = "99999";
      playButton.appendChild(playIcon);

      const pauseButton = document.createElement("div");
      pauseButton.classList.add("pause_button");
      const pauseIcon = document.createElement("i");
      pauseIcon.classList.add("fa-solid", "fa-circle-pause");
      pauseIcon.style.color = "#32ec73";
      pauseButton.appendChild(pauseIcon);

      pauseButton.style.display = "none";

      let audio = "";

      playButton.addEventListener("click", () => {
        if (track.preview_url) {
          console.log(track);
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
            audio = new Audio(track.href);
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
          pauseButton.style.display = "none";
          playButton.style.display = "block";

          // Remove the 'playing' class when the track is paused
          pauseButton.closest(".card").classList.remove("playing");
        }
      });
      card.appendChild(playDiv);

      playDiv.appendChild(pauseButton);
      playDiv.appendChild(playButton);

      // Append the card to the card row
      cardRow2.appendChild(card);

      // Log track details
      // if (track.artists && track.artists.length > 0) {
      //   console.log(`Track ${index + 1}: ${track.artists[0].uri}`);
      //   console.log(`Track ${index + 1}: ${track.artists[0].href}`);
      // } else {
      //   console.log(`Track ${index + 1}: Unknown Artist URI or HREF`);
      // }
      // console.log(`Track ${index + 1}: ${track.type}`);
      // console.log(`Track ${index + 1}: ${track.name}`);
    });
  } catch (error) {
    console.error("Error in fetching artist or album data:", error);
  }
})();

async function fetchTopTracks(artistId) {
  const token = await getToken();
  const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
  console.log(artistId);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching top tracks: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.tracks; // Return the tracks array
  } catch (error) {
    console.error("Error in fetchTopTracks:", error);
  }
}

async function logArtists() {
  const artistId = "0TnOYISbd1XYRBk9myaseg"; // Replace with the artist ID you want
  const tracks = await fetchTopTracks(artistId);
  const cardRow = document.getElementById("card-row1");

  tracks.forEach((track) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Create and add the album image
    const img = document.createElement("img");
    img.classList.add("card-img");
    img.src =
      track.album && track.album.images && track.album.images.length > 0
        ? track.album.images[1].url
        : "https://cdn.vectorstock.com/i/1000v/29/27/note-music-colorful-rainbow-logo-icon-illus-vector-28932927.jpg"; // Fallback image
    card.appendChild(img);

    // Create and add the track name
    const trackName = document.createElement("p");
    trackName.classList.add("card-text");
    trackName.textContent = track.name || "Unknown Track";
    card.appendChild(trackName);

    // Create and add the artist names
    const artistName = document.createElement("p");
    artistName.classList.add("card-text");
    artistName.textContent =
      track.artists && track.artists.length > 0
        ? track.artists.map((artist) => artist.name).join(", ")
        : "Unknown Artist";
    card.appendChild(artistName);

    // Create play/pause button functionality
    const playDiv = document.createElement("div");
    playDiv.classList.add("play_div");

    const playButton = document.createElement("div");
    playButton.classList.add("play_button");
    const playIcon = document.createElement("i");
    playIcon.classList.add("fa-solid", "fa-circle-play");
    playIcon.style.color = "#32ec73";
    playButton.style.zIndex = "99999";
    playButton.appendChild(playIcon);

    const pauseButton = document.createElement("div");
    pauseButton.classList.add("pause_button");
    const pauseIcon = document.createElement("i");
    pauseIcon.classList.add("fa-solid", "fa-circle-pause");
    pauseIcon.style.color = "#32ec73";
    pauseButton.appendChild(pauseIcon);

    pauseButton.style.display = "none";

    let audio = "";

    playButton.addEventListener("click", () => {
      if (track.preview_url) {
        console.log(track);
        // Stop the currently playing track
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.parentPauseButton.style.display = "none";
          currentAudio.parentPlayButton.style.display = "block";

          currentAudio.parentPlayButton
            .closest(".card")
            .classList.remove("playing");
        }

        if (!audio) {
          audio = new Audio(track.preview_url);
        }

        audio.play();
        currentAudio = audio;

        currentAudio.parentPlayButton = playButton;
        currentAudio.parentPauseButton = pauseButton;

        playButton.style.display = "none";
        pauseButton.style.display = "block";
      } else {
        console.log("No preview URL available for this track.");
      }
    });

    pauseButton.addEventListener("click", () => {
      if (audio) {
        audio.pause();
        pauseButton.style.display = "none";
        playButton.style.display = "block";
      }
    });

    playDiv.appendChild(pauseButton);
    playDiv.appendChild(playButton);
    card.appendChild(playDiv);

    // Append the card to the card row
    cardRow.appendChild(card);
  });
}

logArtists(); // Call the async function
logArtists();
logArtists();

// Add search functionality
document.getElementById("searchDiv").addEventListener("input", (event) => {
  const searchQuery = event.target.value.toLowerCase(); // Get the search query in lowercase
  const cards = document.querySelectorAll(".card"); // Select all the cards
  const result = document.querySelector(".card-rows"); // Container for all cards

  let hasResults = false; // Flag to check if any card matches the search query

  cards.forEach((card) => {
    // Get the track or album name text
    const trackName = card.querySelector(".card-text").textContent.toLowerCase();
    const artistName = card.querySelector(".card-text:last-of-type").textContent.toLowerCase();

    // Check if the track/album name or artist name includes the search query
    if (trackName.includes(searchQuery) || artistName.includes(searchQuery)) {
      card.style.display = "block"; // Show the card if it matches
      hasResults = true; // Set the flag to true if there is a match
    } else {
      card.style.display = "none"; // Hide the card if it doesn't match
    }
  });

  // Check if a "No Songs Found" message already exists
  let noResultMessage = document.querySelector(".no-results-message");
  
  if (!hasResults) {
    // Display the message if no results are found
    if (!noResultMessage) {
      noResultMessage = document.createElement("h1");
      noResultMessage.className = "no-results-message";
      noResultMessage.textContent = "No Songs Found";
      result.appendChild(noResultMessage);
    }
  } else {
    // Remove the message if there are matches
    if (noResultMessage) {
      noResultMessage.remove();
    }
  }
});

// footer in html
document.querySelectorAll(".right-container-footer details").forEach((details) => {
  details.addEventListener("click", () => {
    document.querySelectorAll(".right-container-footer details").forEach((other) => {
      if (other !== details) {
        other.removeAttribute("open");
      }
    });
  });
});


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

buttons[2].onclick = () => {
  container.style.display = "none";
  loader.style.display = "flex";

  setTimeout(() => {
    window.location.href = "./pages/signup.html";
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





// AlbumIds
// 0: "35dut3ICqF3NEDkjxfzJJ1"
// 1: "1OARrXe5sB0gyy3MhQ8h92"
// 2: "12INlMsFtBjyehNnawBv36"
// 3: "2nLOHgzXzwFEpl62zAgCEC"
// 4: "742eAldb4AJKLoPgJhGRE7"
// 5: "4yP0hdKOZPNshxUOjY0cZj"
// 6: "4qZBW3f2Q8y0k1A84d4iAO"
// 7: "2ODvWsOgouMbaA5xf0RkJe"
// 8: "0P3oVJBFOv3TDXlYRhGL7s"
// 9: "6wRev1uYL0JsMsWqktJuVi"
// 10: "3hhDpPtCFuQbppwYgsVhMO"
// 11: "2XGEyGU76kj55OdHWynX0S"
// 12: "04hy4jb1GDD00otiwzsFUB"
// 13: "6F87lH0I09qlrzvCCKc7lz"
// 14: "7zCODUHkfuRxsUjtuzNqbd"
// 15: "44MHvpU3h9Wp6SxhsC9GOK"
// 16: "2IRxVVqbSbqHJo8Zx50LYn"
// 17: "7GHiMUbLhh67dWSN1xGUcP"
// 18: "0MwPArEeQJx5GMc5Sz7kRV"
// 19: "0p0FGxiCrl3afABenvtWbQ"

// Artists Id
// 1: "699OTQXzgjhIYAHMy9RyPD"
// 2: '1Xyo4u8uXC1ZmMpatF05PJ'
// 3: '7FNnA9vBm6EKceENgCGRMb'
// 4: '6tbjWDEIzxoDsBA1FuhfPW'
// 5: "3ZJxEmjYZd5VOqZ8o3aXiL"
// 6: "4xPQFgDA5M2xa0ZGo5iIsv"
// 7: "4Gso3d4CscCijv0lmajZWs"
// 8: "4nDoRrQiYLoBzwC5BhVJzF"
// 9: "62k5LKMhymqlDNo2DWOvvv"
// 10: "6Xgp2XMz1fhVYe7i6yNAax"
// 11: "3bnpcWBcvlfq4hPFJjNPbz"
