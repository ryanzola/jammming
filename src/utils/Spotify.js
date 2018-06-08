let accessToken;
let expiresIn;
const clientId = '6da07d5a78bb41e7a9a4a4f2e23af3f2';
const base_url = 'https://accounts.spotify.com'
const redirect_uri = 'http://localhost:3000';
const scope = 'user-read-private%20user-read-email%20playlist-modify-private%20playlist-modify-public'

const Spotify = {};


Spotify.getAccessToken = () => {
  if(accessToken) {
    console.log('yes, access token')
    return accessToken;
  }

  if(/access_token/.test(window.location.href)) {
    accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
    expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

    return accessToken;
  }

  const endpoint = '/authorize'
  const queryParams = `?client_id=${clientId}&response_type=token&redirect_uri=${redirect_uri}&scope=${scope}`;
  window.location = `${base_url}${endpoint}${queryParams}`
  window.setTimeout(() => accessToken = '', expiresIn * 1000);
  window.history.pushState('Access Token', null, '/');
}

Spotify.search = (term) => {
  try {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {     /* initial response */
      return response.json();
    }).then(jsonResponse => {   /* json response */
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
      }
      return [];
    })
  } catch (error) {
    console.log(error)
  }
}

Spotify.savePlaylist = (playlistName, trackUris) => {

  if(!playlistName || !trackUris) {
    return;
  }

  let userId;
  let playlistId;
  let currentToken = accessToken;
  let headers = { 'Authorization': `Bearer ${currentToken}`, 'Content-Type': 'application/json'};

  return fetch('https://api.spotify.com/v1/me', {
    headers: {'Authorization': `Bearer ${currentToken}`}
  }).then(userResponse => {           // get the user
    if(userResponse.ok) {
      return userResponse.json();
    }
  }).then(userJson => {               // parse user json
    return userJson.id;
  }).then(id => {                     // get user id and attempt to create the playlist
    userId = id;
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({name: playlistName, public: true})
    });
  }).then(createPlaylistResponse => {  // playlist creation response
    if(createPlaylistResponse.ok) {
      return createPlaylistResponse.json();
    }
  }).then(createPlaylistJson => {     // parse new playlist json
    return createPlaylistJson.id;
  }).then(newPlaylistId => {          // get playlist id and attempt to add tracks
    playlistId = newPlaylistId;
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({uris: trackUris})
    });
  })
}

export default Spotify;