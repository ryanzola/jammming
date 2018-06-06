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
  let currentToken = accessToken;
  let headers = { 'Authorization': `Bearer ${currentToken}`}

  return fetch('https://api.spotify.com/v1/me', { /* fetch user information */
    headers: headers
  }).then(response => {     /* user infomation response */
    return response.json();
  }, responseError => console.log(responseError.message)
  ).then(jsonResponse => {  /* user infomation json */
      userId = jsonResponse.id
      return jsonResponse.id;
    }, jsonResponseError => console.log(jsonResponseError.messsage)
  ).then(id => {            /* user id */
      fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {   /* fetch user playlists */
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({name: playlistName, public: true})
      }).then(response => {   /* create playlist response */
        if(response.ok) {
          return response.json();
        }
      }, createPlaylistError => console.log(createPlaylistError.message)
      ).then(jsonResponse => {    /* create playlist json */
        return jsonResponse.id;
      }, createPlaylistJsonError => console.log(createPlaylistJsonError.message)
    ).then(newPlaylistId => {     /* new playlist id */
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${newPlaylistId}/tracks`, { /* post tracks to the new playlist */
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({uris: trackUris})
      })
    })
    }, idResponseError => console.log(idResponseError.message)
  )
}

export default Spotify;