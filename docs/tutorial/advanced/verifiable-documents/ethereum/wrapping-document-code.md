---
id: wrapping-document-code
title: Wrapping Documents (Code)
sidebar_label: Wrapping Documents (Code)
---

> For the current step, you can either opt to use the [CLI](/docs/tutorial/advanced/verifiable-documents/ethereum/wrapping-document) or [Code](/docs/tutorial/advanced/verifiable-documents/ethereum/wrapping-document-code).

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

To batch the documents into a single hash, the function `wrapDocuments` can be used.

> Note:
> Though `wrapDocument` and `wrapDocuments` are both identical but there is a slight difference.
>
> wrapDocument:
>
> - returns an object.
> - The object is a wrapped document corresponding to the one provided as input.
> - The object has an unique `targetHash` value based on the input.
> - The object has an unique `merkleRoot` value which correspond to the `targetHash`.
>
> wrapDocuments:
>
> - returns an array.
> - Each element in the array is a wrapped document corresponding to the one provided as input.
> - Each element has an unique `targetHash` value.
> - Each element will share the same unique `merkleRoot` value in every batch wrap instance.
> - Similar to wrapDocument, every time you run wrapDocuments, it will create unique hashes (in front of every fields in the data object).

For details and sample code on `wrapDocuments`, refer to the [batched-wrapping](/docs/tutorial/advanced/wrapping/batch-wrapping) section of the tutorial.

To extract the merkle root, refer to the example below

```ts
const merkleRoot: string = wrappedDocument.signature.merkleRoot;
```

You can now issue the merkle root (`signature.merkleRoot`) to create valid verifiable document.
