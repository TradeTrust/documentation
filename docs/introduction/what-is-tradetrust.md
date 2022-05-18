---
id: what-is-tradetrust
title: What is TradeTrust?
sidebar_label: What is TradeTrust
---

TradeTrust is a set of Governance & Legal Frameworks, Standards and future-ready Digital Infrastructure, all of which facilitates the interoperability of electronic trade documents exchanged between different digital ecosystems.

The foundation required to accomplish this is the ability to trace the provenance of digitally issued documents as well as verify their integrity.

This document endorsement and verification foundation is provided by another project, the [OpenAttestation framework](https://github.com/Open-Attestation/open-attestation). The OpenAttestation framework provides a method to format data so that it can be fingerprinted, and then verified on a trusted platform, such as the Ethereum blockchain.

### Verification Documents

<p align="center" width="100%">
  <figure>
      <img src='/docs/introduction/what-is-tradetrust/simple-signing.svg' />
  </figure>
</p>

The fingerprint of the signed TradeTrust file is then committed to a `Document Store` smart contract on the Ethereum Blockchain, which serves as an immutable ledger.

This signed TradeTrust file is then distributed to recipients, who will be able to verify the file on https://tradetrust.io simply by dragging and dropping it into the Web interface.

### Transferable Records

The data flow is similar to in the `Verification Documents`, but instead of pointing to a `Document Store` smart contract, the OpenAttestation formatted JSON will point to a `Token Registry` smart contract. This smart contract will follow the interface set forth by ERC721, which allows for the document ownership to be part of the immutable ledger.

Since the fingerprint of the signed TradeTrust file is globally uniquely identifying, the `Token Registry` provides a mapping of these fingerprints to their owners(Ethereum addresses). Each fingerprint can only be registered exactly once, and can have only one Ethereum address as their owner. As such, a pair of (Token Registry, Fingerprint) serves as a universally unique (singularity) registry of ownership for that TradeTrust deed.

Both of these values are mandatory in a valid, signed TradeTrust file and its' integrity is also guaranteed by the OpenAttestation framework.
