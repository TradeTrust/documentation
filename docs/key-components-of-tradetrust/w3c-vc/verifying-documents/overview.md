---
id: overview
title: Overview
sidebar_label: Overview
---

The TradeTrust framework is designed to combat fraud by ensuring the integrity and authenticity of digital documents. There are three key verifications that make this possible:

![3 ticks](/docs/verifying-documents/3-ticks.png)

- [Document Integrity](/docs/key-components-of-tradetrust/w3c-vc/verifying-documents/document-integrity): TradeTrust ensures that the content of the document has not been modified since the document has been created, with exception of data removed using the built-in obfuscation mechanism.
- [Document Status](/docs/key-components-of-tradetrust/w3c-vc/verifying-documents/document-status): TradeTrust checks that the document has been issued and that its issuance status is in good standing (for instance, that it hasn't been revoked). As of today, TradeTrust supports two ways to issue documents: DID Signing and Ethereum Smart Contracts.
- [Issuer's Identity](/docs/key-components-of-tradetrust/w3c-vc/verifying-documents/issuer-identity): TradeTrust checks and returns the identity of the issuer. By default, TradeTrust uses DID:Web to verify the identity but DID can be used optionally. It's important to note that TradeTrust does not endorse any issuers. It only verifies that the issuing party in the document has provided some sort of proof that it is the same party as claimed - for example, proving ownership over a domain by the ability to create a DID:Web record.

It's important to note that the 3 verifications are complementary but not compulsory.

For example, even though we can prove that the document has been issued and the issuer is valid it does not make business sense to show the data when we know that the document has been tampered with.

Another example, is that if we can prove that the document has been issued and has not ben tampered with but the issuer is invalid due to did:web not being updated yet, in this case we may want to show the data of the document but there will be a warning regarding the invalid issuer.

If we have these 3 verifications compulsory, there won't be any difference if we just have 1 verification. This are the lines of thought we have when we choose to split the verifications.
