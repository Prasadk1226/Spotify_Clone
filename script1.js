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
        Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Error fetching token: ${response.status} ${response.statusText}`);
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
      throw new Error(`Error fetching tracks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items; // This contains the list of tracks
  } catch (error) {
    console.error("Error in getAlbumTracks:", error);
  }
}

async function logArtists() {
  const tracks = await getAlbumTracks('4aawyAB9vmqN3uQ7FjRGTy'); // Use the album ID
  const cardRow = document.getElementById('card-row1'); 

  tracks.forEach(item => {
    const artists = item.artists; // Get the 'artists' array from the item

    artists.forEach(artist => {
      console.log(`Artist Name: ${artist.name}`);
      console.log(`Artist Spotify URL: ${artist.external_urls.spotify}`);
      console.log(`Artist ID: ${artist.id}`);
      console.log('---');
    });
  });

  tracks.forEach((track) => {

    
    const card = document.createElement('div');
    card.classList.add('card');

    // Create and add the album image
    const img = document.createElement('img');
    img.classList.add('card-img');
    img.src = track.album && track.album.images && track.album.images.length > 0 
      ? track.album.images[1].url 
      : "https://cdn.vectorstock.com/i/1000v/29/27/note-music-colorful-rainbow-logo-icon-illus-vector-28932927.jpg"; // Fallback image if none exists
    card.appendChild(img);

    // Create and add the track name
    const trackName = document.createElement('p');
    trackName.classList.add('card-text');
    trackName.textContent = track.name || 'Unknown Track';
    card.appendChild(trackName);

    // Create and add the artist names
    const artistName = document.createElement('p');
    artistName.classList.add('card-text');
    artistName.textContent = track.artists && track.artists.length > 0 
      ? track.artists.map((artist) => artist.name).join(', ') 
      : 'Unknown Artist';
    card.appendChild(artistName);

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
  const albumId = "4yP0hdKOZPNshxUOjY0cZj"; // Example Album ID (After Hours)

  try {
    const artistData = await getArtistData(artistId);
    console.log("Artist Data:", artistData);

    const albumsData = await getAlbumTracks(albumId);
    console.log("Albums Data:", albumsData);
  } catch (error) {
    console.error("Error in fetching artist or album data:", error);
  }
})();


logArtists(); // Call the async function

