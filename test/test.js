const { assert, expect } = require("chai");

const TodoApp = artifacts.require("TodoApp");
const Token = artifacts.require("Token");

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract("TodoApp", accounts => {
    let todoApp;
    let token;
    let res;
    let originalBalance
    let oldBalance;
    beforeEach(async () => {
        originalBalance = Number(await web3.eth.getBalance(accounts[0]))
        token = await Token.new();
        todoApp = await TodoApp.new(token.address);
        await token.passMinterRole(todoApp.address, {from: accounts[0]})
        await todoApp.createTodo("TEST", Date.now(), {from: accounts[0], value: web3.utils.toWei('2', 'ether')});
        res = await todoApp.todos(accounts[0], 0)
        oldBalance = Number(await web3.eth.getBalance(accounts[0]))
    })
    describe("Testing TodoApp", async () => {
        describe("Add todo", async () => {
            it("Check length increase", async () => {
                assert.equal(Number(await todoApp.amountOfTodos(accounts[0])), 1)
            })
            it("Check content", async () => {
                assert.equal(res.content, "TEST")
            })
            it("Check deposit", async () => {
                assert.equal(web3.utils.fromWei(res.deposit, 'ether'), 2);
                expect(Number(await web3.eth.getBalance(accounts[0]))).to.be.below(originalBalance)
            })
            it("Check time", async () => {
                expect(Number(await res.timeToComplete)).to.be.greaterThan(0);
            })
        })

    })

    describe("Testing TodoApp", async () => {
        describe("Completing Todo", async () => {
            it("Check if todo exists", async () => {
                await todoApp.completeTodo(0, {from: accounts[0]});
                expect(Number(await web3.eth.getBalance(accounts[0]))).to.be.above(oldBalance)
            })

            it("Check fail Todo", async () => {
                let todoNum = Number(await todoApp.amountOfTodos(accounts[0]))
                await todoApp.failTodo(0, {from: accounts[0]});
                expect(Number(await todoApp.amountOfTodos(accounts[0]))).to.be.below(todoNum)
                
            })
        })
    })
})