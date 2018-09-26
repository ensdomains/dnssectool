import React, { Component } from 'react'
class EnterDomain extends Component {
  render() {
    let message;
    if(this.props.message){
      message = (
        <div className="error">{this.props.message}</div>
      )
    }  
    return (
      <div>
      <h3>Enter domain name</h3>
      <form onSubmit={this.props.handleLookup.bind(this)}>
        <input type="text" value={this.props.domain} onChange={this.props.handleChange.bind(this)} required />
        <input type="submit" value="Lookup" />
      </form>
      {message}
      </div>
    )
  }
}

export default EnterDomain
