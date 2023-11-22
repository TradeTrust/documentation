---
id: wrapping-document-code
title: Wrapping Documents (Code)
sidebar_label: Wrapping Documents (Code)
---

> For the current step, you can either opt to use the [CLI](/docs/tutorial/verifiable-documents/did/wrapping-document-cli) or [Code](/docs/tutorial/verifiable-documents/did/wrapping-document-code).

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
  "recipient": {
    "name": "John Doe"
  },
  "$template": {
    "name": "main",
    "type": "EMBEDDED_RENDERER",
    "url": "https://tutorial-renderer.openattestation.com"
  },
  "issuers": [
    {
      "id": "did:ethr:0xaCc51f664D647C9928196c4e33D46fd98FDaA91D",
      "name": "Demo Issuer",
      "revocation": {
        "type": "NONE"
      },
      "identityProof": {
        "type": "DNS-DID",
        "location": "intermediate-sapphire-catfish.sandbox.openattestation.com",
        "key": "did:ethr:0xaCc51f664D647C9928196c4e33D46fd98FDaA91D#controller"
      }
    }
  ]
} as any;



const wrappedDocument = wrapDocument(document);
console.log(wrappedDocument);
```

wrappedDocument

```json
{
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    "recipient": { "name": "2ddbe317-a9d1-4af7-9ff1-085036d83cc8:string:John Doe" },
    "$template": {
      "name": "338403ee-cbfa-4fdd-9f8f-4535803ca1d2:string:main",
      "type": "172389bf-ef30-448f-9153-79475c4a0236:string:EMBEDDED_RENDERER",
      "url": "8aaf3835-f1d5-444d-9855-0ec230c271ec:string:https://tutorial-renderer.openattestation.com"
    },
    "issuers": [
      {
        "id": "592202e4-bf4b-4826-9639-a9a3fad38314:string:did:ethr:0xaCc51f664D647C9928196c4e33D46fd98FDaA91D",
        "name": "2fb102d4-00b2-4c42-87b9-ab545829a4ab:string:Demo Issuer",
        "revocation": { "type": "f86d77af-296a-46d1-8a5e-3af549d03773:string:NONE" },
        "identityProof": {
          "type": "f8bf7139-6ca5-4678-b2c7-49aa81ac3ccc:string:DNS-DID",
          "location": "a84e9b5b-a99f-4248-ac4d-087b66eec523:string:intermediate-sapphire-catfish.sandbox.openattestation.com",
          "key": "5bc9f48f-5f85-4a8f-a3c4-2e99ee94b509:string:did:ethr:0xaCc51f664D647C9928196c4e33D46fd98FDaA91D#controller"
        }
      }
    ]
  },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "d83534d672d96753ea3cb50ac63129782a1c345d98b1141f9fe5449f1c225601",
    "proof": [],
    "merkleRoot": "d83534d672d96753ea3cb50ac63129782a1c345d98b1141f9fe5449f1c225601"
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
