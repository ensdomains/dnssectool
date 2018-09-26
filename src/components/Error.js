import React, { Component } from 'react'
class Error extends Component {
  render() {
    return (
      <div>
        <h3>Oops!</h3>
        <p>
          Looks like you encountered some error.
          Please report at <a href="https://gitter.im/ethereum/go-ethereum/name-registry">ENS support gitter page</a>.
        </p>
      </div>
    )
  }
}

export default Error
