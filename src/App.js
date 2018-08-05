import React, { Component } from 'react'
import DNSRegistrarContract from '../build/contracts/DNSRegistrar.json'
import ENSRegistryContract from '../build/contracts/ENSRegistry.json'
import namehash from 'eth-ens-namehash';
// import ENS from 'ethereum-ens';
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
      web3: null,
      accounts:[],
      proofs:[],
      claim: null,
      dnsFound:false,
      provenAddress:false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleLookup = this.handleLookup.bind(this);
    this.handleSubmitProof = this.handleSubmitProof.bind(this);
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
    this.setState({
      domain: event.target.value,
      dnsFound:false,
      proofs:[],
      ensAddress:'0x0',
      owner:null
    });
  }

  handleLookup(event) {
    this.instantiateContract();
    event.preventDefault();
  }

  handleSubmitProof(event) {
    var self = this;
    this.state.claim.submit({ from: this.state.accounts[0], gas:6000000 }).then((trx)=>{
      self.instantiateContract();
    })
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
    const ENSRegistry = contract(ENSRegistryContract);
    DNSRegistrar.setProvider(this.state.web3.currentProvider)
    ENSRegistry.setProvider(this.state.web3.currentProvider)
    var registrarjs;
    var registrar;
    var ensContract;
    // var ens;
    var claim;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({accounts:accounts});
      DNSRegistrar.deployed().then((_registrar)=>{
        registrar = _registrar;
        registrarjs = new DNSRegistrarJS(this.state.web3.currentProvider, registrar.address);
      }).then(()=>{
        return ENSRegistry.deployed()
      }).then((_ensContract)=>{
        ensContract = _ensContract;
        // ens = new ENS(this.state.web3.currentProvider, ensContract.address);
      // }).then(()=>{
        return registrarjs.claim(this.state.domain);
      }).then((_claim)=>{
        claim = _claim;
        this.setState({claim:claim, dnsFound:claim.found});
        let text ='has no ETH address set';
        if(claim.found){
          text = `has TXT record with a=` + claim.getOwner();
        } 
        this.setState({ owner: text })
        // return claim.getProven();
        // This should also work
        this.setState({ proofs: [] })

        claim.result.proofs.map((proof, index)=>{
          claim.oracle.knownProof(proof).then((proven)=>{
            console.log('i', index, this.state.proofs.length,  proven);
            this.setState({
              proofs: this.state.proofs.concat([{name:proof.name, type:proof.type, proof:proven}])
            })
          })
        })
        // return claim.oracle.knownProof(claim.result.proofs[claim.result.proofs.length -1])
      // }).then((proven)=>{
        // this.setState({provenAddress:proven});
        // This should also work (but not working for some reason now.
        // return ens.resolver(this.state.domain).addr();
        return ensContract.owner.call(namehash.hash(this.state.domain));
      }).then((ensResult)=>{
        this.setState({ensAddress:ensResult});
      }).catch((e)=>{
        // Do now show error when ENS name is not found
        // console.log('state', this.state)        
        // console.log('error', e)
      })
    })
  }

  render() {
    var noteStyle ={
      margin: '5px',
      fontSize:'small'
    }

    var codeStyle={
      display:'inline',
      padding:0
    }

    if(this.state.domain){
      var dnsEntry = ('_ens.' + this.state.domain)
    }
    console.log('parseInt(this.state.ensAddress, 1', parseInt(this.state.ensAddress, 0))
    if(this.state.dnsFound && parseInt(this.state.ensAddress, 0) === parseInt(0, 0)){
      var submitProofForm = (
        <form onSubmit={this.handleSubmitProof}>
          <input type="submit" value="Submit the proof" />
          <span style={noteStyle}>(This will send transactions twice)</span>
        </form>
      )
    }

    var navStyle = {
      background:'#009DFF'
    }

    return (
      <div className="App">
        <nav style={navStyle} className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Claim DNS on ENS Integration Example</a>
        </nav>

        <main className="container">

          <div className="pure-g">
            <div className="pure-u-1-1">
              <h3>Domain</h3>
              <form onSubmit={this.handleLookup}>
              <input type="text" value={this.state.domain} onChange={this.handleChange} required />
              <input type="submit" value="Lookup" />
              <h3>On DNS</h3>
              <p>
                <a href={`http://dnsviz.net/d/_ens.${this.state.domain}/dnssec`} target="_blank" >
                  {dnsEntry}
                </a> {this.state.owner}</p>
              </form>
              <h3>On DNSSEC Oracle</h3>
              <ul>
                {
                  this.state.proofs.map((proof, i) => {
                    return (
                      <li>
                        <code style={codeStyle}>{proof.name}:{proof.type}</code> proof is {proof.proof}
                      </li>
                    )
                  })
                }
              </ul>
              <h3>On ENS</h3>
              <p>
                The ENS Ethereum Address for this name is {this.state.ensAddress}
              </p>              
              {submitProofForm}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
