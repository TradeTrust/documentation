---
id: tradetrust-layer-boundaries
title: TradeTrust Layer Boundaries
sidebar_label: TradeTrust Layer Boundaries
---

This document serves to document the layer boundaries of TradeTrust, helping to illustrate clearly the points at which a 3rd party TradeTrust development effort might span.

### L(-1): Document Format

The basic primitive in TradeTrust is the OpenAttestation document format. This format serves to provide a basis for all documents in TradeTrust to have both verifiable integrity and provenance.

Each document is identified uniquely by a Document Hash, and comes into existence by the explicit action of an Issuer.

This layer is not up for alteration or alternatives as it is the foundational layer which allows us to interact with TradeTrust documents. In particular, while the specification for how an OpenAttestation document is generated from a `.json` file is fixed - the method with which this specification is achieved is open for modification at L2 discussed below.

### L0: Interop Integration

The layer here provides for alternative blockchain interoperation with the TradeTrust ecosystem. This layer has no current active work or reference implementation, and provides the basis for future interoperation with networks such as Hyperledger etc.

### L1: Protocol Integration

Reference Implementation: [OpenAttestation/TradeTrust Solidity (Ethereum) Contracts](https://github.com/Open-Attestation/oa-token/tree/master/contracts)

L1 provides for an implementation of the TradeTrust protocol on Ethereum, based on the combination of a ERC721-compliant non-fungible token registry smart contract and our own Title Escrow smart contract. This layer provides the assurance that the MLETR requires for compliance.

An example of an alternative implementation here could be a Viper port of the smart contracts above, or even a whole separate design that uses the OpenAttestation format to represent transferable records. This alternative implementation will be independently required to fulfil the MLETR requirements.

### L2: Library Level Integration

Reference Implementation: [GitHub - Open-Attestation/oa-verify](https://github.com/Open-Attestation/oa-verify), [OpenAttestation/TradeTrust oa-token library](https://github.com/Open-Attestation/oa-token) and React hooks (work in progress) that interact with oa-token.

L2 provides for implementations of userland libraries that interact with the Ethereum smart contracts in L1 as well as OpenAttestation documents in L(-1). These libraries are for ease of interaction, abstracting out the state and wallet management functionalities that require a lot of integration work.

Example of alternative implementation: Java port of oa-token library, open-attestation-cli, or any other such libraries.

### L3: System Level Integration

Reference Implementation: [GitHub - TradeTrust/tradetrust-website](https://github.com/TradeTrust/tradetrust-website) , [GitHub - TradeTrust/configurable-dapp](https://github.com/TradeTrust/configurable-dapp)

L3 is the composition of libraries from L2, in order to develop a user-friendly application that is tailored for specific workflows.

Examples:

- tradetrust-website composes libraries to achieve a document verification workflow.
- configurable-dapp composes libraries to achieve a document issuance workflow.

### L4: Rebranded Platform

L4 allows a firm to be able to integrate TradeTrust without needing to do any development work - they can simply embed our existing websites into their application with their own branding.