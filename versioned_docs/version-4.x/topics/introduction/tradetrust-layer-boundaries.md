---
id: tradetrust-layer-boundaries
title: TradeTrust Layer Boundaries
sidebar_label: TradeTrust Layer Boundaries
---

This document serves to document the layer boundaries of TradeTrust, helping to illustrate the points at which to be TradeTrust enabled. This section serves to showcase the layer boundaries of TradeTrust. Each of the layers has different output and effort required. For the most balance implementation, we recommend businesses to use L2 (Library Level Integration).

## Summary Table

&nbsp;

|                      What you get for using each level                      | L-0 | L-1 | L-2 | L-3 | L-4 |
| :-------------------------------------------------------------------------: | :-: | :-: | :-: | :-: | :-: |
|  .tt file structure for<br />building your own ledger infrastructure with   |  Y  |  Y  |  Y  |  Y  |  Y  |
|              Documents that can be verified on TradeTrust.io\*              |  N  |  Y  |  Y  |  Y  |  Y  |
|               MLTER compliant smart contracts out of the box                |  N  |  N  |  Y  |  Y  |  Y  |
| Libraries and tooling for ease of interactions <br />with Ethereum network  |  N  |  N  |  N  |  Y  |  Y  |
| Browser applications for document verification <br />and issuance workflows |  N  |  N  |  N  |  N  |  Y  |

&nbsp;

### L(-1): Document Format

The basic primitive in TradeTrust is the document format. This format serves to provide a basis for all documents in TradeTrust to have both verifiable integrity and provenance.

Each document is identified uniquely by a Document Hash, and comes into existence by the explicit action of an Issuer.

This layer is not up for alteration or alternatives as it is the foundational layer which allows us to interact with TradeTrust documents. In particular, while the specification for how a TradeTrust document is generated from a `.json` file is fixed - the method with which this specification is achieved is open for modification at L2 discussed below.

Some examples of various TradeTrust document schemas can be found at our the [Schemata Page](https://schemata.tradetrust.io/)

### L0: Alternative Ledger Integration

The layer here provides for alternative ledger interoperation with the TradeTrust ecosystem, and allows for future interoperation with networks such as Hyperledger etc.

There are two different categories of integration at this level:

- Shared universe integration, in which atomic swaps are required - in the sense that it must not be possible to create the same asset on both ledgers.
- Parallel universe integration, in which the alternative implementation exists on its own with no dependence on TradeTrust(Ethereum). This means that any issuer that wishes to transfer an asset between the two ledgers should ensure that the asset document on the originating ledger is completely destroyed or invalidated before issuance occurs on the destination ledger.

In the event that a shared universe integration is proposed, it has to be a public, permissionless network similar to TradeTrust (Ethereum). This means that no entity should be able to exclude another entity from participating on the network. The network has to also be trustlessly verifiable by both participants, and the ledger state should be accessible publicly.

For a parallel universe integration, documents and assets issued on the alternative ledger will not be verifiable on [TradeTrust.io](https://tradetrust.io), but implementers are welcome to create their own stack spanning L0 to L4. They may wish to rely on some of the work already done by TradeTrust to reduce the amount of bespoke work required. For example, [tt-verify](https://github.com/TradeTrust/tt-verify) is very [easily modified](/docs/4.x/reference/libraries/tt-verify) to support [alternative verification methods](/docs/4.x/topics/advanced/alternative-ledgers).

### L1: Protocol Integration

Libraries: [Document Store library](https://github.com/Open-Attestation/document-store) and [Token Registry Library](https://github.com/Open-Attestation/token-registry)

L1 provides for an implementation of the TradeTrust protocol on Ethereum, based on the combination of a ERC721-compliant non-fungible token registry smart contract and our own Title Escrow smart contract. This layer provides the assurance that the MLETR requires for compliance.

An example of an alternative implementation here could be a Viper port of the smart contracts above, or even a whole separate design that uses the TradeTrust format to represent transferable records. This alternative implementation will be independently required to fulfil the MLETR requirements.

### L2: Library Level Integration

Library: [GitHub - tt-verify](https://github.com/TradeTrust/tt-verify).

L2 provides for implementations of userland libraries that interact with the Ethereum smart contracts in L1 as well as TradeTrust documents in L(-1). These libraries are for ease of interaction, abstracting out the state and wallet management functionalities that require a lot of integration work.

Example of alternative implementation: open-attestation, oa-verify, open-attestation-cli, or any other such libraries.

### L3: System Level Integration

Reference Implementation: [GitHub - TradeTrust/tradetrust-website](https://github.com/TradeTrust/tradetrust-website) , [GitHub - TradeTrust/document-creator-website](https://github.com/tradetrust/document-creator-website)

L3 is the composition of libraries from L2, in order to develop a user-friendly application that is tailored for specific workflows.

Examples:

- tradetrust-website composes libraries to achieve a document verification workflow.
- document-creator composes libraries to achieve a document issuance workflow.

### L4: Rebranded Platform

L4 allows a firm to be able to integrate TradeTrust without needing to do any development work - they can simply embed our existing websites into their application with their own branding.

They may also rely on [GitHub - TradeTrust/document-creator-website](https://github.com/tradetrust/document-creator-website) to issue documents and assets without maintaining any infrastructure.
