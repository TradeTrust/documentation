---
id: sign
title: Sign
sidebar_label: Sign
---

# Open Attestation

> The following information is from the [open-attestation repository](https://github.com/Open-Attestation/Open-Attestation/), refer to the repository for the most recent changes.

The [Open Attestation](https://github.com/Open-Attestation/open-attestation) repository allows you to batch the documents to obtain the merkle root of the batch to be committed to the blockchain. It also allows you to verify the signature of the document wrapped using the OpenAttestation framework.

## Installation

```bash
npm i @govtechsg/open-attestation
```

---

## Usage

### Sign a document

`signDocument` takes a wrapped document, as well as a public/private key pair or an [Ethers.js Signer](https://docs.ethers.io/v5/api/signer/). The method will sign the merkle root from the wrapped document, append the signature to the document and return it. Currently, it supports the following sign algorithm:

- `Secp256k1VerificationKey2018`

#### Example with public/private key pair

```js
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from "@govtechsg/open-attestation";
await signDocument(wrappedV2Document, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
  public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
  private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
});
```

#### Example with signer

```js
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from "@govtechsg/open-attestation";
import { Wallet } from "ethers";

const wallet = Wallet.fromMnemonic("tourist quality multiply denial diary height funny calm disease buddy speed gold");
const { proof } = await signDocument(
  wrappedDocumentV2,
  SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
  wallet
);
```
