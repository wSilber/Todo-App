pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

  address public minter;

  event MinterChanged(address indexed from, address to);

  constructor() public payable ERC20("Harley Coin", "SNOUT") {
    minter = msg.sender;
  }

  //Add pass minter role function
  function passMinterRole(address _minter) public returns (bool) {
    require(msg.sender == minter, 'Error, only owner can change pass minter role');
    minter = _minter;
    emit MinterChanged(msg.sender, _minter);
    return true;
  }

  function mint(address account, uint256 amount) public {
    require(msg.sender == minter);
		_mint(account, amount);
	}
}