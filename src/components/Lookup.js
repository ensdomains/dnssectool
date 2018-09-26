import React, { Component } from 'react'
class Lookup extends Component {
  render() {
    return (
      <form onSubmit={this.props.handleLookup.bind(this)}>
        <input type="submit" value="Check" />
      </form>
    )
  }
}

export default Lookup
