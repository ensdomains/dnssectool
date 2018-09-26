import React, { Component } from 'react'
class Done extends Component {
  render() {
    return (
      <div>
        <h3>Congrats!</h3>
        <p>{this.props.domain} is owned by {this.props.ensAddress}</p>
      </div>
    )
  }
}

export default Done