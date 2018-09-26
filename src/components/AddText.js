import Lookup from './Lookup';
import React, { Component } from 'react'
class AddText extends Component {
  render() {
    return (
      <div>
        <h3>Add Text record with your Ethereum address</h3>
        <p>
          On your DNS management console, please add a TXT type DNS entry "<bold style={{color:'red'}}>_ens.</bold>{this.props.domain}" with a value containing your Ethereum address in the format of "a=YOURETHREUMADDRESS"
        </p>
        <h5>Example</h5>
        <img className="example-image" src={require('../images/add_text.png')}></img>
        <p>Once added, check if it has propagated properly</p>
        <Lookup {...this.props}/>
      </div>
    )
  }
}

export default AddText