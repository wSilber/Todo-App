import TodoApp from '../abis/TodoApp.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import Web3 from 'web3';
import Todo from './Todo';
import Alert from './Alert';
import Profile from './Profile';
import 'bootstrap';
import $ from 'jquery';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentDidMount() {
    await this.loadBlockchainData();

    await this.getAllTodos(this);
    await this.loadProfile();
    
  }

  async getAllTodos(app) {

    if(app.state.account === '') {
      return;
    }
    let amountOfTodos = await app.state.todoApp.methods.getAmountOfTodos(app.state.account).call();
    //console.log(amountOfTodos)
    let todos = [];
    for(let i = 0; i < amountOfTodos; i++) {
      todos.push(await app.state.todoApp.methods.todos(app.state.account, i).call());
    }
    //console.log(todos)
    app.setState({todos: todos})
  }

  async loadBlockchainData() {
    let self = this;
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      const netId = await web3.eth.net.getId();
     // console.log(netId)
      const accounts = await web3.eth.requestAccounts()
      //console.log(accounts)
      if(typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
        //console.log(accounts)

        try {
          const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address);
          const todoApp = new web3.eth.Contract(TodoApp.abi, TodoApp.networks[netId].address);
          const todoAppAddress = TodoApp.networks[netId].address;
          this.setState({token: token, todoApp: todoApp, todoAppAddress: todoAppAddress})
          this.getAllTodos(this);
          //console.log(this.state)
        } catch (e) {
          console.log('Error', e);
            window.alert('Contracts not deployed to the current network');
        }
      } else {
        //console.log("Invalid account")
      }

      
      
    } else {
     window.alert("Please login with MetaMask")
    }
  }

  async addTodo() {
    //console.log(this)
    let content = $('#at-content-input').val();
    let deposit = $('#at-deposit-input').val();
    let completeTime = (new Date($('#at-completeTime-input').val())).getTime();
    if(content === ''  && content.length < 100) {
      // Notify content needed
    }
    if(deposit < 0) {
      // Notify negative number
    }
    if(completeTime <= Date.now()) {
      // Invalid date
    }
    try {
      //console.log(content)
      this.closeAddTodoModal();
      this.resetModal();
      this.changeMainAlert("Todo is being created. This can take up to 2 minutes while blocks are confirming.")
      const res = await this.state.todoApp.methods.createTodo(content, completeTime).send({value: Web3.utils.toWei(deposit.toString()), from: this.state.account})
     // console.log(res)
      //console.log(this)
      await this.getAllTodos(this);
      
      this.changeMainAlert("SUCCESS: Todo has been created!")
    } catch (e) {
      // Alert the user declined transaction
      this.changeMainAlert("ERROR: transaction declined. If you did not decline this transaction then please report this bug.")
      //console.log(e)
    }
    
  }

  changeMainAlert(text) {
   // console.log(text)
    this.setState({mainAlert: null})
    this.setState({mainAlert: <Alert content={text} display={true} />})
  }

  reload() {
    this.forceUpdate();
  }

  async loadProfile() {
    let completed = await this.state.todoApp.methods.getAmountOfCompletedTodos(this.state.account).call();
    let failed = await this.state.todoApp.methods.getAmountOfFailedTodos(this.state.account).call();
    let snout = Web3.utils.fromWei(String(await this.state.token.methods.balanceOf(this.state.account).call()));
    let profile = {
      completed: completed,
      failed: failed,
      snout: snout
    }
    this.setState({profile: null});
    this.setState({profile: profile})
  }

  renderTodos() {
   // console.log("Rendering todos")
    let todos = [];
    for(let todo in this.state.todos) {
      todos.push(this.state.todos[todo])
      //console.log(this.state.todos[todo]);
    }

   // console.log(todos.map((todo) => <Todo key={todo.id} id={todo.id} completed={todo.completed} content={todo.content} deposit={todo.deposit} timeCreated={todo.timeCreated} completeTime={todo.timeToComplete} callback={this.getAllTodos} todoState={this.state} app={this} profile={this.state.profile}/>))
    return (
      todos.map((todo) => {
       // console.log(todo)
        return <Todo key={todo.id} id={todo.id} completed={todo.completed} content={todo.content} deposit={todo.deposit} timeCreated={todo.timeCreated} completeTime={todo.timeToComplete} callback={this.getAllTodos} todoState={this.state} app={this}/>
        
      })
      )
  }

  openAddTodoModal() {
    $('#addTodoModal').modal('show')
  }

  closeAddTodoModal() {
    $('#addTodoModal').modal('hide')
  }

  resetModal() {
    $('#at-deposit').val('');
    $('#at-cdate').val('');
    $('#at-content').val('')
  }

  renderAddTodoModal() {
   // console.log(this.state.mainAlert)
    return (
      <div className="modal" id="addTodoModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content background-dark">
            <div className="modal-header box-shadow" style={{"borderBottom": "1px solid #000000"}}>
              <h5 className="modal-title text-light">Add Todo</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text text-light">Account</span>
                </div>
                <input type="text" className="form-control" id="at-account-input" value={this.state.account} readOnly />
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text text-light" id="at-deposit">Deposit</span>
                </div>
                <input type="number" step=".01" className="form-control" id="at-deposit-input" defaultValue="0" />
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text text-light" id="at-cdate">Completion Date</span>
                </div>
                <input type="datetime-local" className="form-control" id="at-completeTime-input" />
              </div>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text text-light" id="at-content">Content</span>
                </div>
                <textarea className="form-control" id="at-content-input"></textarea>
              </div>
            </div>
            <div className="modal-footer"  style={{"borderTop": "1px solid #121212"}}>
              <button type="button" className="btn btn-primary w-100" onClick={this.addTodo}>Create</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async connect() {

  }
  
  async removeTodo(id) {
    let todos = [];
    this.state.todos.forEach((todo) => {
      if(todo.id !== id) {
        todos.push(todo)
      }
    })

    this.setState({todos: todos})
  }

  renderConnection() {
    //console.log(this.state)
    if(this.state.account === '') {
      return (
        <div className="container text-center d-flex flex-column align-items-center">
          <h2 className="text-light">Please connect to metamask to start creating todos!</h2>
          <button className="btn btn-primary w-50" onClick={this.loadBlockchainData}>Connect</button>
        </div>

      )
    }


    if(this.state.todos.length === 0)
    return (
      <div className="container text-center d-flex flex-column align-items-center">
        <br></br>
        <h2 className="text-light">Looks like you haven't created any todos yet. Lets change that!</h2>
        
      </div>

    )
  }

  renderProfile() {
    if(this.state.profile != null) {
      console.log(this.state.profile)
      return (
        <Profile completed={this.state.profile.completed} failed={this.state.profile.failed} snout={this.state.profile.snout} />
      )
    }

    return (
      <div></div>
    )
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      todoApp: null,
      balance: 0,
      todoAppAddress: null,
      todos: [],
      mainAlert: null,
      profile: null
    }


    this.addTodo = this.addTodo.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    //this.renderProfile = this.renderProfile.bind(this);
  }

  render() {
    console.log(this.state.profile)
    return (
      <div className='text-monospace'>
        <nav id="navbar-container" className="navbar navbar-expand-md background-light box-shadow" style={{backgroundColor: '#2d232e'}}>
            <div className="container">
              <div className="row w-100">
                <div className="col-md-4"></div>
                <div className="col-md-4 center-contents">
                  <h1 className="text-light display-5">ToDo App</h1>
                </div>
                <div className="col-md-4 center-contents">
        
                  <button className="btn blue-background text-light" id="add-todo-btn" onClick={this.openAddTodoModal}>Add</button>
                </div>
              </div>
            </div>
          </nav>
          <br></br>
          
          <div className="container">
            {this.state.mainAlert}
          </div>

          <ul className="container-fluid d-flex flex-column">
            {this.renderProfile()}
            {this.renderConnection()}
            {this.renderTodos()}
          </ul>
          {this.renderAddTodoModal()}
          
      </div>
    )}
}

export default App;