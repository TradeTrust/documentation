---
id: wrap
title: Wrap
sidebar_label: Wrap
---

## Open Attestation

> The following information is from the [open-attestation repository](https://github.com/Open-Attestation/Open-Attestation/), refer to the repository for the most recent changes.

The [Open Attestation](https://github.com/Open-Attestation/open-attestation) repository allows you to batch the documents to obtain the merkle root of the batch to be committed to the blockchain. It also allows you to verify the signature of the document wrapped using the OpenAttestation framework.

## Installation

```bash
npm i --save @govtechsg/open-attestation
```

---

## Usage

### Wrapping documents

`wrapDocuments` takes in an array of documents and returns the wrapped batch. Each document must be valid regarding the version of the schema used (see below). It computes the Merkle root of the batch and appends it to each document. This Merkle root can be published on the blockchain and queried against to prove the provenance of the document issued this way. Alternatively, the Merkle root may be signed by the document issuer's private key, which may be cryptographically verified using the issuer's public key or Ethereum account.

In the future, this function may accept a second optional parameter to specify the version of open-attestation you want to use. Currently, open-attestation will use schema 2.0. See [Additional Information](#additional-information) for information on using experimental v3.0 documents, which aim to be compatible with the W3C's data model for [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/).

The `wrapDocument` function is identical but accepts only one document.

```js
import { wrapDocuments } from "@govtechsg/open-attestation";
const document = {
  id: "SERIAL_NUMBER_123",
  $template: {
    name: "CUSTOM_TEMPLATE",
    type: "EMBEDDED_RENDERER",
    url: "https://localhost:3000/renderer",
  },
  issuers: [
    {
      name: "DEMO STORE",
      tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
      identityProof: {
        type: "DNS-TXT",
        location: "tradetrust.io",
      },
    },
  ],
  recipient: {
    name: "Recipient Name",
  },
  unknownKey: "unknownValue",
  attachments: [
    {
      filename: "sample.pdf",
      type: "application/pdf",
      data: "BASE64_ENCODED_FILE",
    },
  ],
} as any;

const wrappedDocuments: WrappedDocument<any>[] = wrapDocuments([document, { ...document, id: "different id" }]); // will ensure document is valid regarding open-attestation 2.0 schema
console.log(wrappedDocuments);
```

> Note:
> Though `wrapDocument` and `wrapDocuments` are both identical but there is a slight difference.
>
> wrapDocuments:
>
> - returns an array and not an object.
> - Each element in the array is a wrapped document corresponding to the one provided as input.
> - Each element will share the same unique `merkleRoot` value in every batch wrap instance.
> - Each element has an unique `targetHash` value.
> - Similar to wrapDocument, every time you run wrapDocuments, it will create unique hashes (in front of every fields in the data object).

In the above example that used wrapDocuments, the batched documents share the same merkleRoot value, that allows a single issuance for multiple verifiable document.

To extract the merkle root, refer to the example below

```ts
const merkleRoot: string = wrappedDocument[0].signature.merkleRoot;
```

You can now mint the merkle root to create valid verifiable document.
