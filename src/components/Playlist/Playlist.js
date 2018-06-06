import React, { Component } from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends Component {
  handleNameChange = (event) => {
    this.props.onNameChange(event.target.value);
    event.preventDefault();
  }

  handleOnSubmit = (event) => {
    this.props.onSave(event.target.value)
    this.refs.playlistTitle.value = 'New Playlist';
    event.preventDefault();
  }

  render() {
    return (
      <div className="Playlist">
        <input ref="playlistTitle" defaultValue={'New Playlist'} onChange={this.handleNameChange}/>
        <TrackList 
          tracks={this.props.playlistTracks} 
          isRemoval={true} 
          onRemove={this.props.onRemove}/>
        <a className="Playlist-save" onClick={this.handleOnSubmit}>SAVE TO SPOTIFY</a>
      </div>
    )
  }
}

export default Playlist;