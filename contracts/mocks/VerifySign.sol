pragma solidity ^0.5.0;

contract Signature {

  function verifySignature(bytes32 hash, bytes32 r, bytes32 s, uint8 v, address signer) public pure returns(bool) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));
    return ecrecover(prefixedHash, v, r, s) == signer;
  }

}
