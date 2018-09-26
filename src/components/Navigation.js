import React, { Component } from 'react'

class List extends Component {
  render() {
    let style = {};
    if(this.props.active){
      style.backgroundColor = 'red';
    }
    return (
      <li style={style}>{this.props.title}</li>
    )
  }
}

// step1 : there are no proofs => "Enter domain"
// step2 : proofs have no TXT entry nor NSEC entry => "Enable DNSSEC"
// step3 : proofs have no TXT entry with valid ethereum address => "Add TXT record"
// step4 : proofs have valid TXT entry but the entry does not match on DNSSEC Oracle => "Submit proof"
// step5 : proofs have valid TXT entry but the entry does exist on DNSSEC Oracle => "All set"
class Navigation extends Component {
  render() {
    return (
        <ul className="breadcrumb">
          <List title="Enter Domain" active={this.props.step == 1} />
          <List title="Enable DNSSEC" active={this.props.step == 2} />
          <List title="Add Text" active={this.props.step == 3} />
          <List title="Submit Proof" active={this.props.step == 4} />
          <List title="Done" active={this.props.step == 5} />
        </ul>
    )
  }
}

export default Navigation