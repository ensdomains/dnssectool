
  import React, { Component } from 'react'

  class List extends Component {
    render() {
      let style = {};
      let list;
      if(!this.props.active){
        list = (
          <li>
            <a href="#" onClick={this.props.handleToggleWizard.bind(this)} >
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
  
  class Mode extends Component {
    render() {
      return (
        <span style={{padding:'10px', float:'right'}}>
          (
            <ul className="mode">
              <List title="wizard" active={this.props.wizard} handleToggleWizard={this.props.handleToggleWizard} />
              <List title="advanced" active={!this.props.wizard} handleToggleWizard={this.props.handleToggleWizard} />
            </ul>
          )
        </span>
      )
    }
  }
  
  export default Mode