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
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    // The Transfer event helps off-chain aplications understand
    // what happens within your contract.
    // event Transfer(address indexed _from, address indexed _to, uint256 _value);


    /**
     * Contract initialization.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        // function _mint(address account, uint256 value)
        // balances[msg.sender] = totalSupply;
        // owner = msg.sender;
        _mint(msg.sender, 100 * 10**uint(decimals()));
        console.log("decimal", decimals());
    }
    
    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    // function transfer(address to, uint256 amount) external override  {
    //     // Check if the transaction sender has enough tokens.
    //     // If `require`'s first argument evaluates to `false` then the
    //     // transaction will revert.
    //     require(balances[msg.sender] >= amount, "Not enough tokens");

    //     // We can print messages and values using console.log, a feature of
    //     // Hardhat Network:
    //     console.log(
    //         "Transferring from %s to %s %s tokens",
    //         msg.sender,
    //         to,
    //         amount
    //     );

    //     // Transfer the amount.
    //     balances[msg.sender] -= amount;
    //     balances[to] += amount;

    //     // Notify off-chain applications of the transfer.
    //     emit Transfer(msg.sender, to, amount);
    // }

    // /**
    //  * Read only function to retrieve the token balance of a given account.
    //  *
    //  * The `view` modifier indicates that it doesn't modify the contract's
    //  * state, which allows us to call it without executing a transaction.
    //  */
    // function balanceOf(address account) external view returns (uint256) {
    //     return balances[account];
    // }
}
