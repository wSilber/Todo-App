import React, { Component } from 'react';
import {bounceInLeft, bounceOutRight} from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import './App.css';
import Web3 from 'web3';
import $ from 'jquery';

const styles = {
    bounceInLeft: {
      animationDuration: '1s',
      animationName: Radium.keyframes(bounceInLeft, "bounceInLeft")
    },
    bounceOutRight: {
        animationDuration: '1s',
        animationName: Radium.keyframes(bounceOutRight, "bounceOutRight")
    }
  }

class Alert extends Component {

    constructor(props) {
        super(props)
        this.state = {
            content: props.content,
            display: props.content,
            style: styles.bounceInLeft
        }

        this.hide = this.hide.bind(this);
    }

    show() {
        this.setState({display: true})
    }

    hide(event) {
        //this.setState({display: false})
        this.setState({style: styles.bounceOutRight})
        setInterval(() => {
            this.setState({display: false})
        }, 500);
    }

    changeContent(content) {
        this.setState({content: content})
    }

    render() {
        if(this.state.display)
            return (
                <StyleRoot>
                    <div className="alert alert-primary alert-dismissible background-light text-light no-border box-shadow" style={this.state.style} role="alert">
                        {this.state.content}
                        <button type="button" className="close" onClick={this.hide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </StyleRoot>

            )
        
        return null;
    }

}

export default Alert;