import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    this.setState({
      term: event.target.value
    })
    event.preventDefault();
  } 

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <a onClick={this.search}>SEARCH</a>
      </div>
    )
  }
}

export default SearchBar;