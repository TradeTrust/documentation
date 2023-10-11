---
id: overview
title: Verifiable Document Overview
sidebar_label: Overview
---

## Supported types of Verifiable Document

TradeTrust supports Verifiable Documents in two forms:

- Ethereum
- DNS-DID and;

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
    - A document store can be specified on the verifiable document, relying on the blockchain
    - A OCSP Responder can be specified on the verifiable document, relying on the web

### See Alse

[Document Store](/docs/topics/verifiable-documents/document-store)
[OCSP Responder](/docs/topics/verifiable-documents/ocsp-responder)
