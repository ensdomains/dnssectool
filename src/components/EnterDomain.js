import React, { Component } from 'react'
class EnterDomain extends Component {
  render() {
    return (
      <div>
      <form onSubmit={this.props.handleLookup.bind(this)}>
        <input type="text" value={this.props.domain} onChange={this.props.handleChange.bind(this)} required />
        <input type="submit" value="Lookup" />
      </form>
      </div>
    )
  }
}

export default EnterDomain
