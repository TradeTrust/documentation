---
id: verifying-v4-idvc-document
title: Verifying a TradeTrust V4 Document (IDVC)
sidebar_label: Verifying a TradeTrust V4 Document (IDVC)
---

Verifying a TradeTrust V4 document involves several critical checks to ensure the document's integrity, validate its issuance status, and confirm the issuer's identity. These steps are essential for maintaining the trustworthiness and reliability of TradeTrust documents.

The table below outlines the possible scenarios for a TradeTrust V4 document (IDVC) and indicates whether the data should be displayed on our [verification page](https://beta.tradetrust.io).

| Scenarios                         | Document integrity | Issuance Status    | Issuer's Identity  | Displayed Data     |
| --------------------------------- | ------------------ | ------------------ | ------------------ | ------------------ |
| Valid Tradetrust V4 document      | &check;            | &check;            | &check;            | &check;            |
| Identity VC is revoked            | &check;            | &check;            | &cross;            | &check;            |
| Identity VC has expired           | &check;            | &check;            | &cross;            | &check;            |
| Identity VC is missing            | &check;            | &check;            | &cross;            | &cross;            |
| Identity VC is tampered           | &check;            | &check;            | &cross;            | &cross;            |
| Identity VC issuer is invalid     | &check;            | &check;            | &cross;            | &cross;            |

This documentation explains each verification step and its significance.

### Verification Steps
![3 ticks](/docs/verifying-documents/3-ticks.png)

- [Document integrity](/docs/topics/verifying-documents/document-integrity): TradeTrust ensures that the content of the document has not been modified since the document has been created, with exception of data removed using the built-in obfuscation mechanism.
- [Issuance Status](/docs/topics/verifying-documents/issuance-status): TradeTrust checks that the document has been issued and that its issuance status is in good standing (for instance, that it hasn't been revoked). As of today, TradeTrust supports two ways to issue documents: DID Signing and Ethereum Smart Contracts.
- [Issuer's Identity](/docs/topics/verifying-documents/issuer-identity): TradeTrust checks and returns the identity of the issuer. By default, TradeTrust uses DID to verify the identity. It's important to note that TradeTrust does not endorse any issuers. It only verifies that the issuing party in the document has provided some sort of proof that it is the same party as claimed.

### Complementary but Non-Compulsory Verifications
It's important to understand that the 3 verifications are complementary but not compulsory.

For example, even though we can prove that the document has been issued and the issuer is valid it does not make business sense to show the data when we know that the document has been tampered with.

Another example, is that if we can prove that the document has been issued and has not ben tampered with but the issuer's identity is invalid due to the identity VC being revoked or expired, in this case we may want to show the data of the document but there will be a warning regarding the invalid issuer.

### Scenarios Where Data is Shown Despite Invalid Issuer
![2 ticks](/docs/verifying-documents/2-ticks.png)

TradeTrust may still display document data in specific scenarios where the issuer is invalid:

- Identity VC is Revoked: The Identity Verifiable Credential within the document has been revoked.
- Identity VC has Expired: The Identity Verifiable Credential within the document has expired.

These scenarios emphasize the importance of understanding the context and reasons for issuer invalidity.

### Disclaimer
Please note that TradeTrust V4 is currently in its beta phase, and the process may be subject to changes based on feedback and further development.

