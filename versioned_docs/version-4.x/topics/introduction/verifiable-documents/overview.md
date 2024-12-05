---
id: overview
title: Verifiable Documents Overview
sidebar_label: Overview
---

![name](/docs/topics/introduction/verifiable-documents/issuance-flow.png)

There are 2 type of verifiable documents which uses different types of issuer method, a blockchain issuer method (DNS-TXT) and a DID issuer method (DNS-DID). For the blockchain issuer method (DNS-TXT), the fingerprint of the wrapped TradeTrust file is then committed to a [Document Store](https://github.com/Open-Attestation/document-store) smart contract on the Blockchain, which serves as an immutable ledger. For the DID issuer method (DNS-DID), the document is signed instead of being committed to the blockchain.

Both the signed and committed TradeTrust file can then be distributed to recipients, who will be able to verify the file on https://ref.tradetrust.io simply by dragging and dropping it into the Web interface.

### Types of Verifiable Documents

As of today, we have 2 different types of issuer methods, thus, we have 2 forms of verifiable documents:

- Blockchain (DNS-TXT)
- DID (DNS-DID)

### Commonalities

These 2 forms of Verifiable Documents rely on a common trust anchor, which is the use of DNS records. Since DNS records are often considered an authoritative source for a domain name, the DNS entry represents the entity.

For further explanation, refer to their respective sections [DNS-TXT](/docs/topics/introduction/issuer-method-dns-txt) AND [DNS-DID](/docs/topics/introduction/issuer-method-dns-did)

### Differences

- Tracking the issuance status of a Verifiable Document

  - Blockchain issued documents are issued directly on the document store
  - DID issued documents relies the integrity and signature of the document

- Tracking the revocation status of a Verifiable Document

  - Blockchain issued documents are revoked directly on the document store
  - DID issued document are revoked through alternative channels
    - A Document Store can be specified on the verifiable document, relying on the blockchain

### See Also

[Document Store](/docs/topics/introduction/verifiable-documents/document-store)
