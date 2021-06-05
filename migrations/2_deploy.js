var Token = artifacts.require("Token")
var TodoApp = artifacts.require("TodoApp")

module.exports = async function(deployer) {
    await deployer.deploy(Token);
    const token = await Token.deployed();
    await deployer.deploy(TodoApp, token.address)
    const todoApp = await TodoApp.deployed();
    token.passMinterRole(todoApp.address);
}