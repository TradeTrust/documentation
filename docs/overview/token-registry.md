---
id: token-registry
title: Token Registry
sidebar_label: Token Registry
---

TradeTrust supports the construct of assets which can have ownership assigned to them. This is supported using Ethereum smart contracts to keep track of the owner of a particular asset.

An asset is simply defined as the contents of an Electronic Bill of Lading (EBL). It is important to note the distinction between the data contained within a Document describing an asset, and the actual ownership of the asset.

![singularity](/docs/overview/token-registry/token-registry-singularity.svg)

## ERC721 Implementation

ERC721 is a only an interface that is widely used for assets registered on the Ethereum blockchain, it does not indicate how the smart contract should be implemented.

TradeTrust is using the implementation written by the OpenZeppelin team. We have taken the approach of using a generic ERC721 implementation and composing functionality against that, instead of modifying the implementation directly. This ensures that the originally audited code will not be modified and preserves its status.

ERC721 specifies that every asset on a registry should have a unique 256 bit ID. For TradeTrust, we will use the keccak256 hash which is the Merkle root of the corresponding OpenAttestation document that contains the data representing the EBL.

## Singularity Principle

The following conditions apply if our reference implementation is followed:

1. Ethereum design guarantees only one copy of a smart contract referenced by a given registry address
1. ERC721 smart contract guarantees that each ID can only be registered once with each registry
1. Duplicate hash's existence is [practically impossible](https://preshing.com/20110504/hash-collision-probabilities/)

Hence if we represent an asset by a pair of (RegistryAddress, TokenId), it is universally unique.

## What happens to spent or destroyed tokens?

Tokens that have been spent or destroyed will be sent to this address: `0x000000000000000000000000000000000000dEaD`. This address is also known as the burnt address.

## Further Reading

1. http://erc721.org/
1. https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
1. https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
1. [Hash Collision probabilities for 160bit hash](https://preshing.com/20110504/hash-collision-probabilities/)
