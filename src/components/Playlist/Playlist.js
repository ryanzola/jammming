import React, { Component } from 'react';
import './Playlist.css';

class Playlist extends Component {
  render() {
    return (
      <div className="Playlist">
        <input value="New Playlist"/>
        {/* Add a TrackList component */}
        <a class="Playlist-save">SAVE TO SPOTIFY</a>
      </div>
    )
  }
}