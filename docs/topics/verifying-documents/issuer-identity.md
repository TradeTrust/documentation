---
id: issuer-identity
title: Issuer's Identity
sidebar_label: Issuer's Identity
---

TradeTrust uses 2 methods to verify the issuer's ideneity, the [DNS-TXT](/docs/topics/introduction/issuer-method-dns-txt) method and the [DNS-DID](/docs/topics/introduction/issuer-method-dns-did) method. Both methods uses the Domain Name System (DNS). A one-liner introduction to the DNS system can be summarised as: "Phonebook for the Internet". It's primary purpose is to resolve human readable names such as "google.com", or "tradetrust.com", etc. to a set of records. The most common records are 'A records', which resolve to IP addresses - this allows network routing to operate over the Internet.

For TradeTrust, we are using the TXT type of record, which simply allows us to store textual data. The textual data we store indicates the Token Registry / Document Store that the domain administrator trusts.

By allowing the DNS system to be used as an identity registry, we let domain name owners claim ownership of an TradeTrust Token Registry / Document Store smart contract on the Ethereum Blockchain.

## Rationale

The DNS system is a key part of Internet infrastructure, and is a decentralised system - this means that there is a low barrier to entry and does not have a single point of failure. It allows issuers to simply tie their issuance to their domain name, (e.g example.tradetrust.com). When a user views a document issued under this model, they will see "Document issued by example.tradetrust.com".

## How it works

Under [IETF RFC 1464](https://tools.ietf.org/html/rfc1464), it is possible to store arbitrary string attributes as part of a domain's record set. This method is currently widely used for email server authentication (SPF, DMARC, DKIM). Our DNS identity proof technique was largely inspired by [Keybase DNS proofs](https://github.com/keybase/keybase-issues/issues/367).

Only domain name owners (and the registrar that they trust) have the authority to make changes to the records associated with that domain name. Thus when a DNS record endorses a certain fact, it transitively asserts that this fact is believed to be true by the domain name owner.

In an TradeTrust DNS-TXT identity proof, we record a Token Registry / Document Store address and the network (e.g Ethereum, Main Net) it is on. In the TradeTrust document itself, we declare the domain name to search for the record as well as the Token Registry / Document Store Ethereum address. This forms a bi-directional trust assertion, and if the Document's cryptographic proof is issued on that Token Registry / Document Store - we can say that the domain name owner has endorsed the issuance of this document.

A deeper technical discussion of this topic can be found at [TradeTrust's Decentralised Identity Proof using DNS-TXT Architecture Decision Record](https://github.com/Open-Attestation/adr/blob/master/decentralized_identity_proof_DNS-TXT.md).
