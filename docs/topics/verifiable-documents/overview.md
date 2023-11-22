---
id: overview
title: Verifiable Document Overview
sidebar_label: Overview
---

![name](/docs/topics/verifiable-documents/issuance-flow.png)

There are 2 type of verifiable documents, a DNS-TXT issuer method and a DNS-DID/DID issuer method. For the DNS-TXT issuer method, the fingerprint of the wrapped TradeTrust file is then committed to a [Document Store](https://github.com/TradeTrust/document-store) smart contract on the Ethereum Blockchain, which serves as an immutable ledger. For the DNS-DID/DID issuer method, the document is signed instead of being committed to the blockchain.

Both the signed and committed TradeTrust file can then be distributed to recipients, who will be able to verify the file on https://tradetrust.io simply by dragging and dropping it into the Web interface.

### Supported types of Verifiable Document

Because of the different types of issuer methods, we have two forms of verifiable documents:

- Document Store (DNS-TXT)
- DNS-DID/DID

### Commonalities

Both forms of Verifiable Documents rely on a common trust anchor, which is the use of DNS-TXT. Since DNS records are often considered an authoritative source for a domain name, the DNS-TXT entry represents the entity.

For further explanation, refer to their respective sections [DNS-TXT](/docs/topics/introduction/issuer-method-dns-txt) AND [DNS-DID](/docs/topics/introduction/issuer-method-dns-did)

### Differences

- Tracking the issuance status of a Verifiable Document

  - Ethereum issued document are issued directly on the document store
  - DID issued document relies the integrity and signature of the document

- Tracking the revocation status of a Verifiable Document

  - Ethereum issued document are revoked directly on the document store
  - DID issued document are revoked through alternative channels
    - A Document Store can be specified on the verifiable document, relying on the blockchain

### See Alse

[Document Store](/docs/topics/verifiable-documents/document-store)
