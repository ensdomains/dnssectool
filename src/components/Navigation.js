import React, { Component } from 'react'

class List extends Component {
  render() {
    let style = {};
    let list;
    if(this.props.active){
      style.border = '3px solid grey';
      style.padding = '3px 6px';
    }
    if(this.props.home){
      list = (
        <li>
          <a href="#" onClick={this.props.handleReset.bind(this)} >
            <span style={style} >{this.props.title}</span>
          </a>
        </li>
      )
    }else{
      list = (<li><span style={style} >{this.props.title}</span></li>)
    }
    return list;
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
            <List title="Enter Domain" active={this.props.step == 1} home={true} handleReset={this.props.handleReset} />
            <List title="Enable DNSSEC" active={this.props.step == 2} />
            <List title="Add Text" active={this.props.step == 3} />
            <List title="Submit Proof" active={this.props.step == 4} />
            <List title="Complete" active={this.props.step == 5} />
          </ul>        
    )
  }
}

export default Navigation