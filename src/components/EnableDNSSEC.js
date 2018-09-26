import Lookup from './Lookup';
import React, { Component } from 'react'

class EnableDNSSEC extends Component {
  render() {
    return (
      <div>
        <h3>Enable DNSSEC</h3>
        <p>
          The donmain "{this.props.domain}" does not seem to have DNSSEC enabled.
        </p>
        <h5>Example</h5>
        <img className="example-image" alt="Example" src={require('../images/enable_dnssec.png')}></img>
        <p>Once enabled, check if it has propagated properly</p>
        <Lookup {...this.props}/>
      </div>
    )
  }
}
export default EnableDNSSEC
