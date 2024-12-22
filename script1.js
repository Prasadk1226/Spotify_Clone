const clientId = "b2caf825b40a43e1842960054b1e0768"; // Replace with your Client ID
const clientSecret = "f3dbf3397d3047418ff300b88e6516fd"; // Replace with your Client Secret
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

// Function to append tracks to the HTML
async function appendTracksToHTML(albumId) {
  const tracks = await getAlbumTracks(albumId); // Fetch the tracks from Spotify

  const cardRow = document.querySelector('.card-row'); // Select the card row container

  tracks.forEach(track => {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.classList.add('card-img');
    img.src = track.album && track.album.images.length > 0 ? track.album.images[0].url : 'default-image.jpg';
    
    const trackName = document.createElement('p');
    trackName.classList.add('card-text');
    trackName.textContent = track.name; 

    const artistName = document.createElement('p');
    artistName.classList.add('card-text');
    artistName.textContent = track.artists.map(artist => artist.name).join(', ');

    card.appendChild(img);
    card.appendChild(trackName);
    card.appendChild(artistName);

    cardRow.appendChild(card);
  });
}

async function logArtists() {
  const tracks = await getAlbumTracks('4aawyAB9vmqN3uQ7FjRGTy'); // Use the album ID

  tracks.forEach(item => {
    const artists = item.artists; // Get the 'artists' array from the item

    artists.forEach(artist => {
      console.log(`Artist Name: ${artist.name}`);
      console.log(`Artist Spotify URL: ${artist.external_urls.spotify}`);
      console.log(`Artist ID: ${artist.id}`);
      console.log('---');
    });
  });
}

logArtists(); // Call the async function


