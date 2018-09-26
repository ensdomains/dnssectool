import SubmitProofForm from './SubmitProofForm';
import React, { Component } from 'react'
class Submit extends Component {
  render() {
    return (
      <div>
        <h3>Submit Proof</h3>
        <p>
          "_ens.{this.props.domain}" {this.props.owner}
        </p>
        <p>Anyone can submit the proof into DNSSEC smart contract.</p>
        <SubmitProofForm {...this.props}/>
      </div>
    )
  }
}

export default Submit
