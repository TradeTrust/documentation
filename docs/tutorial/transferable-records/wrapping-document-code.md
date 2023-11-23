---
id: wrapping-document-code
title: Wrapping Documents (Code)
sidebar_label: Wrapping Documents (Code)
---

> For the current step, you can either opt to use the [CLI](/docs/tutorial/transferable-records/wrapping-document-cli) or [Code](/docs/tutorial/transferable-records/wrapping-document-cli).

Every OA document has a checksum that provides it a tamper-proof property. At the same time, because the checksum can be used to uniquely identify a document, the checksum (or its derived value) is stored onto the document store as evidence of issuance. To compute the checksum, a `raw document` goes through a process known as `wrapping` to become a `wrapped document`. Only then, the document is ready to be issued onto the blockchain.

In this guide, we will learn how to generate the checksum by running the `wrapping` process.

A `targetHash`, a 64 character long string prepended with `0x` will be generated. The `targetHash` is the only information that will be stored onto the Blockchain to verify the issuance status of an OA document.

## Installation

```bash
npm i --save @govtechsg/open-attestation
```

---

## Usage

### Wrapping documents

`wrapDocument` takes in a documents and returns the wrapped document. Upon validating the document against it's schema, the document hash will be computed, to be placed onto the `signature` section of the wrapped document. The `signature` is to be used for integrity verification on the later stage of the tutorial.

```js
import { wrapDocument } from "@govtechsg/open-attestation";
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

const wrappedDocument = wrapDocument(document);
console.log(wrappedDocument);
```

wrappedDocument

```json
{
  version: 'https://schema.openattestation.com/2.0/schema.json',
  data: {
    id: '1535e123-172b-477d-be3a-d066ed0066ac:string:SERIAL_NUMBER_123',
    '$template': {
      name: 'da731bd8-455d-4bb7-be2d-52b86e295e14:string:CUSTOM_TEMPLATE',
      type: 'c168dc65-afa4-4051-8c07-3c155c3b37bc:string:EMBEDDED_RENDERER',
      url: '1a4fd76f-a2aa-4ee9-abb1-3b046aa41b3d:string:https://localhost:3000/renderer'
    },
    issuers: [ [Object] ],
    recipient: {
      name: 'c2bab1ae-37d2-4b7a-86c1-f300edc4e6d2:string:Recipient Name'
    },
    unknownKey: 'af4cad23-f277-4d31-a947-51870bf1739a:string:unknownValue',
    attachments: [ [Object] ]
  },
  signature: {
    type: 'SHA3MerkleProof',
    targetHash: '8dcf358a9436bca6654f565e3c5843d91c0052d3a2eff37bbd380038e8a1fa39',
    proof: [],
    merkleRoot: '8dcf358a9436bca6654f565e3c5843d91c0052d3a2eff37bbd380038e8a1fa39'
  }
}
```

The `signature` section includes the fields of `targetHash` and `merkleRoot`.
`signature.targetHash` is the generated hash of the document, computed on the algorithm stated on the `signature.type`.
In the scenerio of `wrapDocument`, `signature.merkleRoot` will be the same as `signature.targetHash`.

> Note:
> Transferable Records are limited to the `wrapDocument` method.
> Merkle Root cannot be used to uniquely identified seperate transferable records.
>
> wrapDocument:
>
> - returns an object.
> - The object is a wrapped document corresponding to the one provided as input.
> - The object has an unique `targetHash` value based on the input.
> - The object has an unique `merkleRoot` value which correspond to the `targetHash`.

To extract the merkle root, refer to the example below

> Save this value for future reference.

```ts
const merkleRoot: string = wrappedDocument.signature.targetHash;
```

You can now issue the merkle root (`signature.merkleRoot`) to create valid transferable document.
