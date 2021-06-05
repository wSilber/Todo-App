import React, { Component } from 'react';
import {bounceOutRight, bounceInUp} from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import './App.css';
import Web3 from 'web3';
import $ from 'jquery';

const styles = {
  bounceOutRight: {
    animationDuration: '1s',
    animationName: Radium.keyframes(bounceOutRight, "bounceOutRight")
  },
  bounceInUp: {
    animationDuration: '.5s',
    animationName: Radium.keyframes(bounceInUp, "bounceInUp")
  }
}

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      todoState: props.todoState,
      app: props.app,
      completed: props.completed,
      failed: props.failed,
      snout: props.snout
    }

    console.log(this.state)

    
  }

  renderCompletedValues() {
    return (
      <div>
        <h5 className="card-text text-light">Todos Completed</h5>
        <p className="text-light">{this.state.completed}</p>
      </div>
    )
  }

  renderFailedValues() {
    return (
      <div>
        <h5 className="card-text text-light">Todos Failed</h5>
        <p className="text-light">{this.state.failed}</p>
      </div>
    )
  }

  renderGains() {
    return (
      <div>
        <h5 className="card-text text-light">SNOUT earned</h5>
        <p className="text-light">{this.state.snout}</p>
      </div>
    )
  }

  render() {

    console.log(this.state)
    return (
      <li className="background-dark">
        <div className="container profile-center">
          <div className="card background-light w-50 mr-4 box-shadow">
            <div className="card-body text-center">              
              {this.renderCompletedValues()}
            </div>
          </div>
          <div className="card background-light w-50 mr-4 box-shadow">
            <div className="card-body text-center">
              {this.renderFailedValues()}
            </div>
          </div>

          <div className="card background-light w-50 box-shadow">
            <div className="card-body text-center">
              {this.renderGains()}
            </div>
          </div>
        </div>
      </li>

    );
  }
}
  
export default Profile;