import React, { Component } from 'react'
class SubmitProofForm extends Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmitProof.bind(this)}>
        <input type="submit" value="Submit the proof" />
      </form>
    )
  }
}

export default SubmitProofForm
