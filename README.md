# Todo-App

This todo app allows users to create and maintain their own tasks in exchange for tokens. All tasks are publicly stored on the ethereum blockchain (ropsten testnet). Users have the option to lock in ethereum with each task. This ethereum is then returned to the user with extra tokens when the task is completed. Users who do not complete their tasks in time lose their deposit and do not receive tokens. This helps to motivate users who struggle with procrastinating with getting their tasks done.

### How does it work?
1. User logs into their Metamask account (Must have testnet ethereum for ropsten network)
2. Users can then create a todo by clicking the add button. A completion date as well as content for the todo are required.
3. (optional) Users can lock a certain amount of ethereum with each task
4. Users can then click the switch on each todo to mark them as complete. The deposit as well as tokens are returned to the user if a deposit was given

![Example GIF](https://github.com/wSilber/Todo-App/blob/main/example.gif)

### How can I use it?
This app can be accessed through [https://williamsilberste.in/portfolio/todo-app](https://williamsilberste.in/portfolio/todo-app). METAMASK IS REQUIRED. The contract methods for creating and completing todos are also accessible publically meaning that anyone can create their own todo app using these contract as a framework.

### Contracts
Todo app: [0x6df098e5CF10D494fBF0EFAE1511d0D354b12263](https://ropsten.etherscan.io/address/0x6df098e5cf10d494fbf0efae1511d0d354b12263) \
Harley coin: [0x796ac2b3813d5867f86ED263b8b2e6FD356365f7](https://ropsten.etherscan.io/address/0x796ac2b3813d5867f86ed263b8b2e6fd356365f7)
