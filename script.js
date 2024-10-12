// async function fetchData() {
//   const url = `https://spotify23.p.rapidapi.com/search/?q='7ca78732c5mshedc27e79839268dp1c94ccjsn7e215259be16'&type=multi&offset=0&limit=10&numberOfTopResults=5`;
//   const options = {
//     method: "GET",
//     headers: {
//       "x-rapidapi-key": "7ca78732c5mshedc27e79839268dp1c94ccjsn7e215259be16",
//       "x-rapidapi-host": "spotify23.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await fetch(url, options);
//     const result = await response.json(); // Parse the response

//     // Check if albums exist
//     if (result.albums && result.albums.items) {
//       const albums = result.albums.items;

//       // Loop over each album
//       albums.forEach((album) => {
//         const albumName = album.data.name;
//         const artistName =
//           album.data.artists.items[0]?.profile.name || "Unknown Artist";
//         const releaseYear = album.data.date?.year || "Unknown Year";

//         console.log(`\nAlbum: ${albumName}`);
//         console.log(`Artist: ${artistName}`);
//         console.log(`Release Year: ${releaseYear}`);
//         console.log("Images:");

//         // Loop over coverArt sources (images)
//         if (album.data.coverArt && album.data.coverArt.sources.length > 0) {
//           album.data.coverArt.sources.forEach((source, index) => {
//             console.log(`Image ${index + 1}: ${source.url}`);
//           });
//         } else {
//           console.log("No images available");
//         }

//         console.log("--------------------");
//       });
//     } else {
//       console.log("No albums data available.");
//     }

//     // Now loop through the tracks as well (if they exist)
//     if (result.tracks && result.tracks.items) {
//       const tracks = result.tracks.items;

//       console.log("\nTracks:");
//       tracks.forEach((track) => {
//         const trackName = track.data.name || "Unknown Track";
//         const trackArtist =
//           track.data.artists.items[0]?.profile.name || "Unknown Artist";
//         const trackUri = track.data.uri || "No URI";

//         console.log(
//           `Track: ${trackName}, Artist: ${trackArtist}, URI: ${trackUri}`
//         );
//       });
//     } else {
//       console.log("No tracks data available.");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// fetchData();

// Rapid API not working

const clientId = 'b2caf825b40a43e1842960054b1e0768';  // Replace with your Client ID
const clientSecret = '6786041f6a15496eb36b294ba436c9d5';  // Replace with your Client Secret
const authUrl = 'https://accounts.spotify.com/api/token';

async function getToken() {
    try {
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            },
            body: 'grant_type=client_credentials',
        });

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error(`Error fetching token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error in getToken:', error);
    }
}

async function fetchAlbumData() {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error('Failed to retrieve access token');
        }
        
        const albumUrl = 'https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy';

        const response = await fetch(albumUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`Error fetching album data: ${response.status} ${response.statusText}`);
        }

        const albumData = await response.json();
        console.log(albumData);
    } catch (error) {
        console.error('Error in fetchAlbumData:', error);
    }
}

fetchAlbumData();

