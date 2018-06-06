import React, { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './utils/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    }
  }

  addTrack = (newTrack) => {
    let playlistTracks = this.state.playlistTracks;
    if (playlistTracks.find(savedTrack => savedTrack.id === newTrack.id)) {
      return;
    }

    this.setState({
      playlistTracks: [...playlistTracks, newTrack]
    })
  }

  removeTrack = (track) => {
    const filteredPlaylist = this.state.playlistTracks.filter(playlistTrack => {
      return playlistTrack.id !== track.id;
    })

    this.setState({
      playlistTracks: filteredPlaylist
    })
  }

  savePlaylist = () => {
    const trackUris = this.state.playlistTracks.map(playlistTrack => {
      return playlistTrack.uri
    })

    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
        this.setState({
          playlistTracks: [],
          playlistName: ''
        })
    })
  }

  search = (term) => {
    Spotify.getAccessToken();
    Spotify.search(term).then(track => {
      this.setState({
        searchResults: [...track]
      })
    })
  }

  updatePlaylistName = (newName) => {
    this.setState(prevState => ({
      playlistName: newName
    }))
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist 
              playlistTracks={this.state.playlistTracks} 
              onNameChange={this.updatePlaylistName}
              onRemove={this.removeTrack}
              onSave={this.savePlaylist}  
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
