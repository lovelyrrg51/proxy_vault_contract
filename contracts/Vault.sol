// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";

contract Vault is Ownable {
    mapping(address => uint256) public userBalance;

    // Deposit Event
    event DepositEvent(address indexed userAddress, uint256 depositAmount);
    // Withdraw Event
    event WithdrawEvent(address indexed userAddress, uint256 withdrawAmount);

    constructor() {}
    
    /**
     * Deposit the ETH
     */
    function depositETH() external payable {
        uint256 amount = msg.value;
        address userAddress = _msgSender();

        // Check amount of User
        require(amount > 0, "The amount should be more than zero");

        // Update User Balance
        userBalance[userAddress] += amount;

        // Emit the event
        emit DepositEvent(userAddress, amount);
    }

    /**
     * Withdraw the ETH
     */
    function withdrawETH(address payable _to, uint256 withdrawAmount) external {
        address userAddress = _msgSender();

        // Check User Balance
        require(withdrawAmount > 0, "The withdraw amount should be more than zero");
        require(userBalance[userAddress] >= withdrawAmount, "The user balance should be more than withdraw amount");

        // Update User Balance
        userBalance[userAddress] -= withdrawAmount;

        // Send ETH to User
        bool sent = _to.send(withdrawAmount);
        // (bool sent1, bytes memory data) = _to.call{value: withdrawAmount}("");
        require(sent, "Failed to withdraw Ether");

        // Emit the event
        emit WithdrawEvent(userAddress, withdrawAmount);
    }
}