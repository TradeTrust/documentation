---
id: what-is-tradetrust
title: What is TradeTrust?
sidebar_label: What is TradeTrust
---

TradeTrust is a framework that comprises globally-accepted standards that connect governments and businesses to a public blockchain to enable trusted interoperability of electronic trade documents across digital platforms and it is offered as a digital utility.

<figure style={{ maxWidth: "960px", margin: "0 auto" }}>
  <img src='/docs/topics/introduction/what-is-tradetrust/key-components-tradetrust.jpeg' />
</figure>

### TradeTrust's 3 Key Functionalities: Authenticity, Source & Title Ownership for Trade Documents

TradeTrust is designed to provide industry the means to verify the authenticity and source of a document, as well as to create Electronic Transferable Records (ETRs) that are functionally equivalent to their paper versions (e.g. able to effect title transfers)

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
  <img src='/docs/topics/introduction/what-is-tradetrust/3-functionalities.png' />
</figure>

### TradeTrust Design Principles

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
  <img src='/docs/topics/introduction/what-is-tradetrust/tradetrust-design-principles.png' />
</figure>

### Verifiable Documents

<p align="center" width="100%">
  <figure>
      <img src='/docs/topics/introduction/what-is-tradetrust/simple-signing.svg' />
  </figure>
</p>

The fingerprint of the signed TradeTrust file is then committed to a [Document Store](https://github.com/Open-Attestation/document-store) smart contract on the Ethereum Blockchain, which serves as an immutable ledger.

This signed TradeTrust file is then distributed to recipients, who will be able to verify the file on https://tradetrust.io simply by dragging and dropping it into the Web interface.

### Transferable Records

The data flow is similar to in the `Verifiable Documents`, but instead of pointing to a [Document Store](https://github.com/Open-Attestation/document-store) smart contract, the OpenAttestation formatted JSON will point to a [Token Registry](https://github.com/Open-Attestation/token-registry) smart contract. This smart contract will follow the interface set forth by ERC721, which allows for the document ownership to be part of the immutable ledger.

Since the fingerprint of the signed TradeTrust file is globally uniquely identifying, the [Token Registry](https://github.com/Open-Attestation/token-registry) provides a mapping of these fingerprints to their owners(Ethereum addresses). Each fingerprint can only be registered exactly once, and can have only one Ethereum address as their owner. As such, a pair of (Token Registry, Fingerprint) serves as a universally unique (singularity) registry of ownership for that TradeTrust deed.

Both of these values are mandatory in a valid, signed TradeTrust file and its' integrity is also guaranteed by the OpenAttestation framework.
