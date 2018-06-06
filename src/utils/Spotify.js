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
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
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
  let headers = { 'Authorization': `Bearer ${currentToken}`}

  return fetch('https://api.spotify.com/v1/me', {
    headers: headers
  }).then(response => {
    return response.json();
  }).then(jsonResponse => {
    return jsonResponse.id;
  }).then(id => {
    fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }, 
      body: {
        name: playlistName,
        public: true
      }
    }).then(response => {
      console.log(response)
    }, error => console.log(error.message)
    )
  })


}

export default Spotify;