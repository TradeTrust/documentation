---
id: overview
title: Verifiable Document Overview
sidebar_label: Overview
---

<p align="center" width="100%">
  <figure>
      <img src='/docs/topics/introduction/what-is-tradetrust/simple-signing.svg' />
  </figure>
</p>

The fingerprint of the signed TradeTrust file is then committed to a [Document Store](https://github.com/Open-Attestation/document-store) smart contract on the Ethereum Blockchain, which serves as an immutable ledger.

This signed TradeTrust file is then distributed to recipients, who will be able to verify the file on https://tradetrust.io simply by dragging and dropping it into the Web interface.

### Supported types of Verifiable Document

TradeTrust supports Verifiable Documents in two forms:

- Ethereum
- DNS-DID

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
