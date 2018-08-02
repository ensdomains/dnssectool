import React, { Component } from 'react'
import DNSRegistrarContract from '@ensdomains/dnsregistrar/build/contracts/DNSRegistrar.json'
import namehash from 'eth-ens-namehash';
const DNSRegistrarJS = require('@ensdomains/dnsregistrar');
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      domain: 'matoken.xyz',
      owner:null,
      web3: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  handleChange(event) {
    this.setState({domain: event.target.value});
  }

  handleSubmit(event) {
    this.instantiateContract();
    event.preventDefault();
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const DNSRegistrar = contract(DNSRegistrarContract);
    DNSRegistrar.setProvider(this.state.web3.currentProvider)

    var registrarjs

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      DNSRegistrar.deployed().then((registrar)=>{
        registrarjs = new DNSRegistrarJS(this.state.web3.currentProvider, registrar.address);
      }).then(()=>{
        return registrarjs.claim(this.state.domain);
      }).then((claim)=>{
        let text ='Not found';
        if(claim.found){
          text = claim.getOwner();
        } 
        return this.setState({ owner: text })
      })  
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your ENS is installed and ready.</p>
              <h2>DNS Integration Example</h2>
              <form onSubmit={this.handleSubmit}>
              <input type="text" value={this.state.domain} onChange={this.handleChange} />
              <input type="submit" value="Submit" />
              <p>The {this.state.domain} is owned by : {this.state.owner}</p>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
