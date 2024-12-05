---
id: issuing-v4-idvc-document
title: Issuing a TradeTrust V4 Document (IDVC method)
sidebar_label: Issuing a TradeTrust V4 Document (IDVC method)
---

![TradeTrust V4 document Flowchart](/docs/tradetrust-v4/v4-document-flow.png)

Issuing a TradeTrust V4 document using the IDVC issuer's identity method involves creating documents that adhere to the TradeTrust V4 schema and embedding an IDVC from an established identity provider. This method ensures the authenticity and verifiability of the issuer's identity.

There are two types of documents that can be created using this method: Verifiable Documents and Transferable Records.

For information on other issuer's identity methods like DNS-TXT and DNS-DID for both [Verifiable Documents](/docs/topics/introduction/verifiable-documents/overview) and [Transferable Records](/docs/topics/introduction/transferable-records/overview), please visit their respective pages.

### Verifiable Documents (IDVC method)

Verifiable Documents are TradeTrust documents that require wrapping and signing to ensure their integrity and authenticity.

Steps for Issuing Verifiable Documents

1. Wrap the Document: Wrapping the document involves encapsulating the document data within a specific structure that adheres to the TradeTrust V4 schema. This process ensures that the document format is consistent and includes all necessary metadata.

2. Sign the Document: Signing the wrapped document is crucial for providing cryptographic proof of the document's integrity and authenticity. This step ensures that any tampering with the document after signing can be detected. The signature also verifies that the document was issued by a recognized and trusted identity.

### Transferable Records (IDVC method)

Transferable Records are a specific type of TradeTrust document that, in addition to wrapping and signing, require minting to facilitate the transfer of ownership.

Steps for Issuing Transferable Records

1. Wrap the Document: As with Verifiable Documents, wrapping the document ensures that it adheres to the TradeTrust V4 schema and includes all necessary metadata.

2. Sign the Document: Signing the wrapped document provides cryptographic proof of its integrity and authenticity, ensuring that the document has not been tampered with and that it was issued by a recognized identity.

3. Mint the Document: Minting the document involves creating a unique digital token on the blockchain that represents the ownership of the document. This tokenization process allows the document to be transferred between parties securely and transparently on the blockchain.

### Why Wrapping and Signing are Necessary

For both Verifiable Documents and Transferable Records, wrapping and signing are essential steps. Wrapping ensures that the document adheres to the required schema, while signing provides cryptographic proof of authenticity and integrity. These steps collectively ensure that the document is secure, verifiable, and trustworthy.

### Why Minting is Necessary for Transferable Records

In the case of Transferable Records, minting is an additional step required to facilitate the secure transfer of ownership. By creating a unique digital token on the blockchain, the document can be tracked and transferred transparently and securely, ensuring that ownership records are immutable and verifiable.

### Disclaimer

Please note that the TradeTrust V4 is currently in its beta phase, and the process for creating TradeTrust V4 documents may be subject to changes based on feedback and further development.
