---
id: issuer-identity
title: Issuer's Identity
sidebar_label: Issuer's Identity
---

TradeTrust uses W3C Decentralized Identifiers ([DIDs](https://www.w3.org/TR/did-core/)) v1.0 method to verify the issuer's identity, the [`did:web`](https://w3c-ccg.github.io/did-method-web/) method. It leverages existing decentralized infrastructure to enable identity verification.

A one-liner introduction to did:web can be summarized as: "A decentralized identifier anchored to a web domain." Its primary purpose is to enable a web domain to host and serve as a cryptographically verifiable identifier. This identifier can represent an entity, such as an organization or individual.

For TradeTrust, we use the did:web method to establish identity. The did:web identifier, based on the W3C Decentralized Identifiers (DIDs) standard, allows domain administrators to associate their domain with a DIDs document. This document can contain cryptographic keys and service endpoints that serve as proof of identity and trust.

By allowing the did:web system to function as an identity registry, we enable domain name owners to claim ownership of a TradeTrust Token Registry or Document Store smart contract on the Ethereum Blockchain.

## Rationale

The did:web method builds on the familiar infrastructure of the web while adopting decentralized principles. It allows issuers to tie their issuance directly to their domain name, such as example.tradetrust.com, but in a verifiable and cryptographic way.

When a user views a document issued under this model, they will see “Document issued by example.tradetrust.com,” backed by cryptographic proofs in the did:web identifier. This ensures trust and accountability while leveraging the decentralized nature of DIDs.

## How it Works

The did:web method works by hosting a DID document at a well-known URL on the domain. For example, the DID document for `did:web:example.tradetrust.com` would be located at `https://example.tradetrust.com/.well-known/did.json`. This document contains cryptographic public keys, service endpoints, and metadata that represent the entity's identity.

Domain name owners have exclusive authority to host or update the DID document at their domain. This means that when the did:web identifier endorses a certain fact (such as the association with a Token Registry or Document Store address), it transitively asserts that the domain owner endorses that fact.

In a TradeTrust did:web identity proof, we record the Token Registry address and the blockchain network (e.g., Ethereum Mainnet) within the DID document. In the TradeTrust document itself, we declare the did:web identifier as the issuer. When the document's cryptographic proof is validated against the DID document, we can assert that the domain owner has endorsed the issuance of this document.
