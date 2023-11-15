---
id: overview
title: Overview
sidebar_label: Overview
---

Our product, TradeTrust, is designed to combat fraud by ensuring the integrity and authenticity of digital documents. There are three key verifications that make this possible:

- [Document integrity](/docs/docs-section/how-does-it-work/document-integrity): TradeTrust ensures that the content of the document has not been modified since the document has been created, with exception of data removed using the built-in obfuscation mechanism.
- [Issuance Status](/docs/docs-section/how-does-it-work/issuance-status): TradeTrust checks that the document has been issued and that its issuance status is in good standing (for instance, that it hasn't been revoked). As of today, TradeTrust supports two ways to issue documents: DID Signing and Ethereum Smart Contracts.
- [Issuance Identity](/docs/docs-section/how-does-it-work/issuance-identity): TradeTrust checks and returns the identity of the issuer. By default, TradeTrust uses DNS to verify the identity but DID can be used optionally. It's important to note that TradeTrust does not endorse any issuers. It only verifies that the issuing party in the document has provided some sort of proof that it is the same party as claimed - for example, proving ownership over a domain by the ability to create a DNS record.

It's important to note the 3 verifications are complementary. For example, even though we can prove that the document has been issued and the issuer is valid it does not make business sense to show the data when we know that the document has been tampered with. This is the line of thinking we have when we choose to split the verifications.

![3 ticks](/docs/verifying-documents/3-ticks.png)
