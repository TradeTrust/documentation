---
id: overview
title: Transferable Records Overview
sidebar_label: Overview
---

Transferable Records are documents which extends on Verifiable Documents' blockchain issuer method (DNS-TXT) to allow a document to have an owner and a holder. These records references properties laid out in the [UNCITRAL Model Law on Electronic Transferable Records](https://uncitral.un.org/sites/uncitral.un.org/files/media-documents/uncitral/en/mletr_ebook_e.pdf). You can read more about TradeTrust's MLETR compliance over at our [legality page](https://www.tradetrust.io/legality).

This allowed Transferable Records to be used for documents like:

- Title Deeds
- Bill of Ladings

Transferable Records consist of 2 smart contracts, a Token Registry and a Title Escrow.

![Overview of Transferable Records](/docs/topics/introduction/transferable-records/overview.png)

### Token Registry Smart Contract

The token registry smart contract is deployed by individual transferable records issuers such as the land title registry (for title deed) or shipping lines (for bill of lading). This smart contract replaces the document store smart contract in the previous section. Similarly to the document store contract, it also has it's identity bound to the issuer using DNS.

The Token Registry stores the ownership state of the transferable records using a mapping from `document ID` to `smart contract address`, where the `document ID` (also known as the token ID) is the target hash (and merkle root) of the individual TradeTrust document and the `smart contract address` will be a title escrow smart contract address.

In the overview diagram above, we can see 3 different states of documents:

1. An unissued document (`0xaaaa...aaaa`) will have a smart contract address `0x0000...0000`
2. An issued document (`0xbbbb...bbbb`) will have a title escrow smart contract (ie `0x8888...8888`)
3. A returned document (`0xcccc...cccc`) will have a smart contract address which is the token registry's address (ie `0x5555...5555`)

### Title Escrow Smart Contract

There are instances where a single document will have multiple owners, with clearly defined roles to protect one from another. In the case of trade finance, we observe that there are usually an `owner` and a `holder` to a given document. The two role corresponds to the legally owner of the Bill of Lading document and the entity holding the physical Bill of Lading document respectively.

In this case, we have created the Title Escrow Smart Contract to reflect the rules of engagement between these two parties on-chain.
