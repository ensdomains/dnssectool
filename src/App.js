import React, { Component } from 'react'
import ENS from 'ethereum-ens';
import Promise from 'promise';
import getWeb3 from './utils/getWeb3';
const DNSRegistrarJS = require('@ensdomains/dnsregistrar');
import EnterDomain from './components/EnterDomain';
import EnableDNSSEC from './components/EnableDNSSEC';
import AddText from './components/AddText';
import Submit from './components/Submit';
import Done from './components/Done';
import Navigation from './components/Navigation';
import Advanced from './components/Advanced';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

function findType(proofs, type){
  return proofs.find((p)=>{return p.type == type});
}

const WizardComponents = [
  EnterDomain,
  EnableDNSSEC,
  AddText,
  Submit,
  Done
]

// step1 : there are no proofs => "Enter domain"
// step2 : proofs have no TXT entry nor NSEC entry => "Enable DNSSEC"
// step3 : proofs have no TXT entry with valid ethereum address => "Add TXT record"
// step4 : proofs have valid TXT entry but the entry does not match on DNSSEC Oracle => "Submit proof"
// step5 : proofs have valid TXT entry but the entry does exist on DNSSEC Oracle => "All set"

function getStage(state){
  let txt = findType(state.proofs, 'TXT');
  console.log('state', state);
  // debugger;
  if(state.error){
    return 2;
  }else if(state.proofs.length == 0){
    return 1;
  } else if (!txt){
    return 3;
  } else if (txt.matched != "✅"){
    return 4;
  } else if (txt.matched == "✅"){
    return 5;
  }else{
    // anything else;
    return 6;
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleLookup = this.handleLookup.bind(this);
    this.handleSubmitProof = this.handleSubmitProof.bind(this);

    this.state = {
      domain: null,
      network: null,
      owner:null,
      web3: null,
      accounts:[],
      proofs:[],
      claim: null,
      dnsFound:false,
      nsecFound:false,
      provenAddress:false,
      error:null,
      handleLookup:this.handleLookup,
      handleSubmitProof:this.handleSubmitProof,
      handleChange:this.handleChange
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateNetwork();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  handleChange(event) {
    this.setState({
      domain: event.target.value,
      dnsFound:false,
      nsecFound:false,
      proofs:[],
      ensAddress:'0x0',
      owner:null,
      error:null
    });
  }

  handleLookup(event) {
    this.instantiateContract();
    event.preventDefault();
  }

  handleSubmitProof(event) {
    var self = this;
    if(!this.state.accounts[0]){
      throw('Account not set')
    }
    this.state.claim.submit({ from: this.state.accounts[0], gas:3000000 }).then((trx)=>{
      self.instantiateContract();
    })
    event.preventDefault();
  }

  instantiateContract(){
    var registrarjs;
    var ens;
    var claim;

    var provider = this.state.web3.currentProvider;
    ens = new ENS(provider);
    let tld = this.state.domain.split('.').reverse()[0];
    return ens.owner(tld).then((owner)=>{
      registrarjs = new DNSRegistrarJS(provider, owner);
      console.log(0)
      return registrarjs.claim(this.state.domain);
    }).then((_claim)=>{
      console.log(1)
      claim = _claim;
      this.setState({claim:claim, dnsFound:claim.found, nsecFound:claim.nsec});
      let text ='has no ETH address set';
      if(claim.found){
        text = `has TXT record with a=` + claim.getOwner();
      }
      this.setState({ proofs: [], owner: text });
      return Promise.all(claim.result.proofs.map((proof) => claim.oracle.knownProof(proof))).then((provens)=>{
         return claim.result.proofs.map((proof, i) => {
          var toProve = this.state.web3.sha3(proof.rrdata.toString('hex'), {encoding:"hex"}).slice(0,42)
          let matched;
          if(toProve === provens[i]){
            matched = "✅";
          }else{
            matched = "❎";
          }
          return {
            index: i+1,
            name: proof.name,
            type: proof.type,
            proof: provens[i],
            toProve:toProve,
            matched:matched
          };
         })
      });
    }).then((proofs) =>{
      this.setState({
          proofs: proofs
      });
      console.log('ens owner of ', this.state.domain)
      return ens.owner(this.state.domain);
    }).then((ensResult)=>{
      this.setState({ensAddress:ensResult});
    }).catch((e)=>{
      this.setState({error:e.message})
      console.log('error', e)
    })
  }

  instantiateNetwork() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    var network = 'network not supported';

    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({accounts:accounts});
      this.state.web3.version.getNetwork((err, netId) =>{
        console.log('getNetwork', err, netId)
        if(err){
          console.log('error', err)
        }else{
          switch (netId) {
            case "1":
              network = 'mainnet';
              break
            case "3":
              network = 'ropsten';
              break
            default:
              console.log('This is an unknown network.')
          }
          console.log('network', network)
          this.setState({ network:network})
        }
      })
    })
  }

  render() {
    let WizardComponent = WizardComponents[getStage(this.state) - 1];
    console.log('stage', getStage(this.state));

    var navStyle = {
      background:'#009DFF'
    }
    
    return (
      <div className="App">
        <nav style={navStyle} className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">DNS name claim tool</a>
            <label>{this.state.network}</label>
        </nav>

        <main className="container">

          <div className="pure-g">
            <div className="pure-u-1-1">
              <h3>Stage</h3>
              <Navigation step={getStage(this.state)} />
              <WizardComponent {...this.state } />
              {getStage(this.state)}
              <Advanced {...this.state} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
