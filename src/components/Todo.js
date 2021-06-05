import React, { Component } from 'react';
import {bounceOutRight, bounceInUp} from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import './App.css';
import Web3 from 'web3';
import $ from 'jquery';

const styles = {
  bounceOutRight: {
    animationDuration: '1s',
    animationName: Radium.keyframes(bounceOutRight, "bounceOutRight"),
    borderRadius: '.25rem'
  },
  bounceInUp: {
    animationDuration: '.5s',
    animationName: Radium.keyframes(bounceInUp, "bounceInUp"),
    borderRadius: '.25rem'
  }
}

const bounceIn = {
  
}

class Todo extends Component {

  async complete() {
    const res = await this.state.todoState.todoApp.methods.completeTodo(this.state.key).send({from: this.state.todoState.account})
    //console.log(res);
    //this.state.callback();
  }



  constructor(props) {
    super(props);

    this.complete = this.complete.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.delete = this.delete.bind(this);
    this.extend = this.extend.bind(this);

    this.state = {
      todoState: props.todoState,
      completed: props.completed,
      key: props.id,
      content: props.content,
      deposit: props.deposit,
      timeCreated: props.timeCreated,
      completeTime: props.completeTime,
      callback: props.callback,
      app: props.app,
      style: styles.bounceInUp,
      collapsed: false,
      profile: props.profile
    }

    console.log(this.state.profile)
  }

  handleCheckboxChange(event) {
    if(this.state.completed === false) {
      this.setState({completed: true})
      //console.log(event.target.checked)
      this.completeTodo(this.state.key)
    }

  }


  async completeTodo(id) {
    if((new Date()).getTime() > this.state.completeTime) {
      setTimeout(() => {
        this.state.app.changeMainAlert("Sorry you have failed that todo :(")
        this.setState({completed: false})
      }, 1000);
      
      return;
    }
    try {
      console.log("Completing todo")
      this.state.app.changeMainAlert("Completing Todo! This may take up to 2 minutes while confirming blocks.")
      const res = await this.state.todoState.todoApp.methods.completeTodo(id).send({from: this.state.todoState.account});
      console.log(res)
      this.state.app.changeMainAlert("Congradulations! Your hard work is paying off!")
      this.state.callback(this.state.app);
      this.state.app.loadProfile();
    } catch (e) {
      this.state.app.changeMainAlert("ERROR: transaction declined. If you did not decline this transaction then please report this bug.")
      this.setState({completed: false})
    }
    
  }

  async delete() {
    try {
      let res;
      if(this.state.completed) {
        this.state.app.changeMainAlert("Removing Todo! This may take up to 2 minutes while confirming blocks.")
        res = await this.state.todoState.todoApp.methods.removeTodo(this.state.key).send({from: this.state.todoState.account}) 
      } else {
        this.state.app.changeMainAlert("Failing Todo! This may take up to 2 minutes while confirming blocks.")
        res = await this.state.todoState.todoApp.methods.failTodo(this.state.key).send({from: this.state.todoState.account}) 
      }
      
      this.animateDelete();
      this.setState({style: styles.bounceOutRight})
      this.state.app.changeMainAlert("Todo Failed! Todos may take up to 2 minutes to confirm.")
      setTimeout(() => {
        this.state.app.removeTodo(this.state.key)
        this.state.app.changeMainAlert("Todo has been removed. This may take up to 2 minutes to confirm.")
        this.state.app.loadProfile();
      }, 700)
    } catch (e) {
      this.state.app.changeMainAlert("ERROR: transaction declined. If you did not decline this transaction then please report this bug.")
    }
  }

  extend(event) {
    if(event.target.nodeName === 'LI' ||  event.target.nodeName === 'SPAN') {
      if($(event.target).hasClass('slider')) {
        return;
      }
      if(this.state.collapsed) {
        $('#content-text-'+this.state.key).addClass('one-line')
        $('#collapse-todo-'+this.state.key).collapse({toggle: true})
      } else {
        $('#content-text-'+this.state.key).removeClass('one-line')
        $('#collapse-todo-'+this.state.key).collapse({toggle: false})
      }

      this.setState({collapsed: !this.state.collapsed})
    }
  }

  determineTime() {

    if(this.state.completed) {
      return (
        <div className='text-light'>Todo has already been completed!</div>
      )
    }

    let timeLeft = (this.state.completeTime - (new Date()).getTime()) / 1000

    if(timeLeft < 60) {
      return (
        <div className='text-light'>Time Left: {Math.floor(timeLeft)} seconds</div>
      )
    }

    if(timeLeft < 3600) {
      return (
        <div className='text-light'>Time Left: {Math.floor(timeLeft/60)} Minutes</div>
      )
    }

    if(timeLeft < 86400) {
      return (
        <div className='text-light'>Time Left: {Math.floor(timeLeft/3600)} Hours</div>
      )
    }

    return (
      <div className='text-light'>Time Left: {Math.floor(timeLeft/86400)} Days</div>
    )
    
  }

  renderExtend() {
    let deposit = Web3.utils.fromWei(this.state.deposit.toString())
    //console.log(this.state.completeTime)
    //console.log((new Date()).getTime())
    if(this.state.completeTime <= (new Date()).getTime()) {
     if(!this.state.completed) {
       return (
        <div className="container">
          <div className="extend-container">
            <div className='text-light'>Todo Failed!</div>
          </div>  
        </div>
       )
     }
      return (
        <div className="container">
          <div className="extend-container">
            <div className='text-light'>Congradulations on completing your todo!</div>
          </div>  
        </div>
      )
    }
    return (
      <div className="container">
        <div className="extend-container">
          {this.determineTime()}
          <div className='text-light'>Deposit: {deposit} eth</div>
        </div>  
      </div>
    )
  }

  render() {


    return (
      <StyleRoot className="container">
        <li className='container list-group-item background-light box-shadow' id={'todo-'+this.state.key} style={this.state.style} onClick={this.extend}>        
          <div className="w-100">
            <button type="button" className="btn btn-primary w-100 todo-btn" style={{backgroundColor: '#1e1e1e', border: 'none'}} data-toggle="collapse" data-target={`#collapse-todo-${this.state.key}`} aria-expanded="false" aria-controls={`collapse-todo-${this.state.key}`}>
            <div className="todo-item form-switch" id={`header-todo-${this.state.key}`}>
              <label className="switch d-flex m-0">
                <input type="checkbox" checked={this.state.completed} onChange={this.handleCheckboxChange}/>
                <span className="slider round"></span>
              </label>
              <span className="ml-3 text-dark todo-text one-line" id={'content-text-'+this.state.key} data-toggle="collapse">{this.state.content}</span>            
              <div className="todo-item-delete float-right">
                <div className="delete-todo-outer">
                  <div className="delete-todo-inner">
                    <label className="delete-todo-text text-dark" onClick={this.delete}>Delete</label>
                  </div>
                </div>
              </div>
            </div>
            </button>
            <div className="collapse" id={`collapse-todo-${this.state.key}`}>
              {this.renderExtend()}
            </div>
          </div>
          
        </li>
      </StyleRoot>
    );
  }
}
  
export default Todo;