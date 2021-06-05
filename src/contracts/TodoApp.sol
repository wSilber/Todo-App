pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";

contract TodoApp {

  struct Todo {
      uint id;
      string content;
      uint deposit;
      uint timeCreated;
      uint timeToComplete;
      bool completed;
  }

  mapping (address => Todo[]) public todos;
  mapping (address => uint) public completedTodos;
  mapping (address => uint) public failedTodos;

  event TodoCreated(address indexed user, string content, uint deposit, uint timeCreated, uint timeToComplete);
  event TodoCompleted(address indexed user, string content, uint deposit, uint timeCreated, uint timeToComplete);
  event TodoFailed(address indexed user, string content, uint deposit, uint timeCreated, uint timeToComplete);

  Token token;

  constructor(Token _token) public {
    token = _token;
  }

  function getAmountOfTodos(address _user) public view returns (uint) {
    return todos[_user].length;
  }

  function getAmountOfCompletedTodos(address _user) public view returns (uint) {
    return completedTodos[_user];
  }

  function getAmountOfFailedTodos(address _user) public view returns (uint) {
    return failedTodos[_user];
  }

  function createTodo(string memory _content, uint _timeToComplete) payable public {
    require(_timeToComplete > block.timestamp, "ERROR, Invalid time");
    uint id = getAmountOfTodos(msg.sender);
    todos[msg.sender].push(Todo(id, _content, msg.value, block.timestamp, _timeToComplete, false));


    emit TodoCreated(msg.sender, _content, msg.value, block.timestamp, _timeToComplete);
  }

  function completeTodo(uint _id) public {
    require(!todos[msg.sender][_id].completed, "ERROR, todo is already complete");
    require(getAmountOfTodos(msg.sender) > _id, "ERROR, invalid todo");
    require(todos[msg.sender][_id].timeToComplete > block.timestamp, "ERROR, Todo failed :(");
    Todo memory todo = todos[msg.sender][_id];
    if(todo.deposit > 0) {
      msg.sender.transfer(todo.deposit);
      token.mint(msg.sender, todo.deposit*100);
    }

    todos[msg.sender][_id].completed = true;
    completedTodos[msg.sender]++;
    emit TodoCompleted(msg.sender, todo.content, todo.deposit, todo.timeCreated, todo.timeToComplete);
  }

  function failTodo(uint _id) public {
    require(!todos[msg.sender][_id].completed, "ERROR, todo is already complete");
    require(todos[msg.sender][_id].timeToComplete > block.timestamp, "ERROR, Time not over");
    Todo memory todo = todos[msg.sender][_id];
    removeTodo(_id);
    failedTodos[msg.sender]++;
    emit TodoFailed(msg.sender, todo.content, todo.deposit, todo.timeCreated, todo.timeToComplete);
  }

  function removeTodo(uint _id) public {
    uint lengthOfTodos = getAmountOfTodos(msg.sender);
    require(_id < lengthOfTodos, "ERROR, invalid todo");

    todos[msg.sender][_id] = todos[msg.sender][lengthOfTodos-1];
    todos[msg.sender][_id].id = _id;

    todos[msg.sender].pop();
  }


}