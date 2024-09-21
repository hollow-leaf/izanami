// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Reputation {
    // Mapping to store the reputation score of each address
    mapping(address => int) public reputationAdd;
    mapping(address => int) public reputationSub;

    // Mapping to track whether an address has been rated by another address
    mapping(address => mapping(address => bool)) public hasRated;

    // Address of the trusted mediator
    address public mediator;

    // Event for reputation updates
    event ReputationUpdated(address indexed user, address indexed target, int scoreAdd, int scoreSub);

    // Event for rating verification
    event RatingVerified(address indexed user, address indexed target, int score, bytes32 messageHash);

    // Constructor to set the trusted mediator
    constructor(address _mediator) {
        mediator = _mediator;
    }

    // Step 1: Mediator verifies the rating, emits an event with the signed data
    function verifyRating(address user, address target, int score) external {
        require(msg.sender == mediator, "Only mediator can verify ratings");
        require(score == 1 || score == -1, "Invalid score. Must be +1 or -1");

        // Create a hash of the rating data
        bytes32 messageHash = keccak256(abi.encodePacked(user, target, score));

        // Emit an event that this rating has been verified
        emit RatingVerified(user, target, score, messageHash);
    }

    // Step 2: User submits the rating with the mediator's signature for recording
    function submitRating(
        address target, 
        int score, 
        bytes32 messageHash, 
        uint8 v, 
        bytes32 r, 
        bytes32 s
    ) external {
        require(score == 1 || score == -1, "Invalid score. Must be +1 or -1");
        require(!hasRated[msg.sender][target], "You have already rated this address");

        // Hash the original data
        bytes32 computedHash = keccak256(abi.encodePacked(msg.sender, target, score));
        require(computedHash == messageHash, "Invalid message hash");

        // Recover the signer's address from the signature
        bytes32 ethSignedMessageHash = _getEthSignedMessageHash(messageHash);
        address signer = ecrecover(ethSignedMessageHash, v, r, s);
        require(signer == mediator, "Invalid signature, not signed by mediator");

        // Update reputation
        if (score == 1) {
            reputationAdd[target]++;
        } else {
            reputationSub[target]++;
        }
        hasRated[msg.sender][target] = true;

        emit ReputationUpdated(msg.sender, target, reputationAdd[target], reputationSub[target]);
    }

    // Helper function to get the Ethereum signed message hash
    function _getEthSignedMessageHash(bytes32 messageHash) private pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }

    // Optional: function to update the mediator if needed
    function updateMediator(address newMediator) external {
        require(msg.sender == mediator, "Only the mediator can update the mediator address");
        mediator = newMediator;
    }
}
