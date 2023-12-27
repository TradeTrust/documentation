---
id: alternative-ledgers
title: Using TradeTrust with non-Ethereum ledgers
sidebar_label: Alternative Ledgers
---

In this article we will discuss how TradeTrust can be modified to be used for ledgers aside from the public Ethereum network.

## Quorum

[Quorum](https://consensys.net/quorum/) is a fork of Ethereum, with enterprise functionality and permissioning added on top of it. It also differs from Ethereum by using non-proof of work consensus algorithms - between a choice of [IBFT](https://docs.goquorum.consensys.io/configure-and-manage/configure/consensus-protocols/ibft#docusaurus_skipToContent_fallback) or [Raft](https://docs.goquorum.consensys.io/configure-and-manage/configure/consensus-protocols/raft). It thus follows that it is not a public, permissionless network like Ethereum, but a permissioned network.

Nevertheless, Quorum has taken care to maintain compatibility with Ethereum smart contracts and this means that we can use not only the TradeTrust file format, we can also use the Document Store and Token Registry smart contracts without any modification.

In our brief experiments, we set up a private Quorum network using [Chainstack](https://chainstack.com/) as a platform, and found no problems deploying and issuing using the Document Store smart contract.

This was facilitated using the [tradetrust-cli](https://github.com/TradeTrust/tradetrust-cli) with a [simplistic proxy](https://gist.github.com/rjchow/5b95f9ce9ad15c9e1f71640dafe72c83) for handling authentication. Simply run the proxy locally on port 8545, and then use tradetrust-cli with the flag --local.

For verifying of the issued documents, you can simply use [tt-verify](https://github.com/TradeTrust/tt-verify) with a custom provider that points to the Quorum node if it is accessible publicly or using the same local proxy method as above. Augmenting tt-verify with your custom provider is documented [here](https://github.com/TradeTrust/tt-verify#switching-network).
