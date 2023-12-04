---
id: document-store
title: Document Store
sidebar_label: Document Store
---

The document store is a smart contract on the blockchain that records the issuance and revocation status of TradeTrust verifiable documents, as represented as hashes.

![name](/docs/topics/introduction/verifiable-documents/document-store.png)

The primary functions of the smart contract, but not limited to, include:

- Issue (issue, bulkIssue)
- Revoke (revoke, bulkRevoke)
- Check (isIssued, isRevoked)

The document store holds 2 mappings, one for issuance and another for revocation.

The issuance mapping holds the hash and the corresponding block number of the transaction.

The revocation mapping holds the hash and the reason for the revocation.

The hash can exist independently of the two mappings.

### See also

[Github Repository](https://github.com/Open-Attestation/document-store/)
