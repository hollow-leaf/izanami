// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Reputation712 {
    // Mapping to store the reputation score of each address
    mapping(address => int) public reputationAdd;
    mapping(address => int) public reputationSub;

    // Mapping to track whether an address has been rated by another address
    mapping(address => mapping(address => bool)) public hasRated;

    // Domain separator for EIP-712
    bytes32 public DOMAIN_SEPARATOR= keccak256(
        abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("Reputation")),
            keccak256(bytes("1.0.0")),
            block.chainid,
            address(this)
        )
    );
    
    // Struct hash for EIP-712
    bytes32 public constant RATING_TYPEHASH = keccak256("Rating(address user,address target,int score)");

    // Event for reputation updates
    event ReputationUpdated(address indexed user, address indexed target, int scoreAdd, int scoreSub);

    // Function to submit a rating
    function submitRating(
        address target,
        int score,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(score == 1 || score == -1, "Invalid score. Must be +1 or -1");
        require(!hasRated[msg.sender][target], "You have already rated this address");

        // Create the hash of the rating data according to EIP-712
        bytes32 structHash = keccak256(abi.encode(RATING_TYPEHASH, msg.sender, target, score));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));

        // Recover the signer's address from the signature
        address signer = ecrecover(digest, v, r, s);
        require(signer == msg.sender, "Invalid signature");

        // Update reputation
        if (score == 1) {
            reputationAdd[target]++;
        } else {
            reputationSub[target]++;
        }
        hasRated[msg.sender][target] = true;

        emit ReputationUpdated(msg.sender, target, reputationAdd[target], reputationSub[target]);
    }

    function testSubmitRating(
        address target,
        int score
    ) external {
        require(score == 1 || score == -1, "Invalid score. Must be +1 or -1");
        if (score == 1) {
            reputationAdd[target]++;
        } else {
            reputationSub[target]++;
        }
        hasRated[msg.sender][target] = true;

        emit ReputationUpdated(msg.sender, target, reputationAdd[target], reputationSub[target]);
    }

    function getReputation(address target) external view returns (int, int) {
        return (reputationAdd[target], reputationSub[target]);
    }
}
