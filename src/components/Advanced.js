import React, { Component } from 'react'
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
          <h3>On DNS</h3>
          <p>
          <a href={`http://dnsviz.net/d/_ens.${this.props.domain}/dnssec`} target="_blank" >
              {dnsEntry}
          </a> {this.props.owner}</p>
        </form>
        <h3>On DNSSEC Oracle</h3>
        <table>
        <tr>
            <th>#</th>
            <th>name</th>
            <th>type</th> 
            <th>matched?</th>
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
