import React, { Component } from 'react'
import rrToString from '../utils/rrToString';

class Advanced extends Component {
  render() {
    if(this.props.domain){
      var dnsEntry = ('_ens.' + this.props.domain)
    }
    if(this.props.dnsFound || this.props.nsecFound){
      var submitProofForm = (
        <form onSubmit={this.props.handleSubmitProof.bind(this)}>
          <input type="submit" value="Submit the proof" />
        </form>
      )
    }

    return (
      <div>
        <h3>Domain</h3>
        <form onSubmit={this.props.handleLookup.bind(this)}>
          <input type="text" value={this.props.domain} onChange={this.props.handleChange.bind(this)} required />
          <input type="submit" value="Lookup" />
          </form>
        <h3>On DNS</h3>
        <pre>
        {
            this.props.claim.result.results.map((result, i) => {
                var rrs = result.rrs.map(rrToString);
                rrs.push(rrToString(result.sig));
                return rrs.join("\n");
            }).join("\n\n")
        }
        </pre>
        <h3>On DNSSEC Oracle</h3>
        <table>
        <tr>
            <th>#</th>
            <th>name</th>
            <th>type</th>
            <th>matched?</th>
            <th>inception(oracle)</th>
            <th>inception(dns)</th>
            <th>hash(oracle)</th>
            <th>hash(dns)</th>
        </tr>
        {
            this.props.proofs.sort((a,b)=>{return a.index - b.index}).map((proof, i) => {
            return (
                <tr>
                <td>{proof.index}</td>
                <td>{proof.name}</td>
                <td>{proof.type}</td>
                <td style={{textAlign:'center'}}>
                <div className="tooltip">{proof.matched}
                    <span className="tooltiptext">
                    DNS proof is {proof.toProve} while DNSSEC Oracle has {proof.proof}
                    </span>
                </div>
                </td>
                <td>{proof.inception}</td>
                <td>{proof.inceptionToProve}</td>
                <td>{proof.proof}</td>
                <td>{proof.toProve}</td>
                </tr>
            )
            })
        }
        </table>
        <h3>On ENS</h3>
        <p>
        The ENS Ethereum Address for this name is {this.props.ensAddress}
        </p>
        {submitProofForm}
      </div>
    )
  }
}

export default Advanced
