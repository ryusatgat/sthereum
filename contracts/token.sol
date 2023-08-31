//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.1;

// We import this library to be able to use console.lognpm install @openzeppelin/contracts
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// This is the main building block for smart contracts.
contract Token is ERC20 {
    event foo(uint256 time);
    address public owner;
    uint256 public issue_date = block.timestamp;
    
    function callFoo(uint256 time) public {
        emit foo(time); 
    } 

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    /**
     * Contract initialization.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.

        _mint(msg.sender, 100 * 10**uint(decimals()));
        emit foo(issue_date);
       
    }
}