import React, { Component } from 'react';
import './Track.css';

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.track.id,
      name: this.props.track.name,
      artist: this.props.track.artist,
      album: this.props.track.album,
      uri: this.props.track.uri
    }
  }

  addTrack = (event) => {
    this.props.onAdd(this.state);
  }

  removeTrack = (event) => {
    this.props.onRemove(this.state)
  }

  renderAction = (isRemoval) => {
    if(isRemoval) {
      return <a className="Track-action" onClick={this.removeTrack}>-</a>
    } else {
      return <a className="Track-action" onClick={this.addTrack}>+</a>
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.state.name}</h3>
          <p>{this.state.artist} | {this.state.album}</p>
        </div>
        {
          this.renderAction(this.props.isRemoval)
        }
      </div>
    )
  }
}

export default Track;