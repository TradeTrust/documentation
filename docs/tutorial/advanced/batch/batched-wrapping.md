---
id: batched-wrapping
title: Batched Wrapping (Code)
sidebar_label: Batched Wrapping (Code)
---

## Installation

```bash
npm i --save @govtechsg/open-attestation
```

---

## Usage

### Wrapping documents

`wrapDocuments` takes in an array of documents and returns the wrapped batch. Each document must be valid regarding the version of the schema used (see below) It computes the Merkle root of the batch and appends it to each document. This Merkle root can be published on the blockchain and queried against to prove the provenance of the document issued this way. Alternatively, the Merkle root may be signed by the document issuer's private key, which may be cryptographically verified using the issuer's public key or Ethereum account.

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

  const inputDocument = [document, { ...document, id: "SERIAL_NUMBER_321" }];

  const wrappedDocuments: WrappedDocument<any>[] = wrapDocuments(inputDocument);
  console.log(
    `Same merkleRoot: ${
      wrappedDocuments[0].signature.merkleRoot ===
      wrappedDocuments[1].signature.merkleRoot
    }`
  );
  console.log(`Merkle Root: ${wrappedDocuments[0].signature.merkleRoot}`);
  console.log(`${JSON.stringify(wrappedDocuments)}`);
```

wrappedDocument

```
Same merkleRoot: true
```

```
Merkle Root: ab6504f9c8975157fd05e503116e9b706fff758705027d6895599efe7b3fe1b7
```

```json
[
  {
    "version": "https://schema.openattestation.com/2.0/schema.json",
    "data": {
      "id": "53935549-870e-461e-9e1e-db55e91800b8:string:SERIAL_NUMBER_123",
      "$template": {
        "name": "b63c2fd2-10e6-4fc3-9686-f8ca621939f7:string:CUSTOM_TEMPLATE",
        "type": "81a4053c-4551-4ec7-9721-88c28dfb29d5:string:EMBEDDED_RENDERER",
        "url": "be991ec2-5e24-42cd-9d6b-0ec907f9a2eb:string:https://localhost:3000/renderer"
      },
      "issuers": [
        {
          "name": "a6870ea7-41d5-4a5d-a8c2-ea2817e88404:string:DEMO STORE",
          "tokenRegistry": "dedef303-7781-4beb-a75e-f5ea184e206e:string:0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
          "identityProof": {
            "type": "f45a2723-e038-4845-891e-0307c0046f8a:string:DNS-TXT",
            "location": "af42474d-0e24-4053-b09e-f37fd5d350eb:string:tradetrust.io"
          }
        }
      ],
      "recipient": { "name": "91ece9a1-be66-4699-8545-f44fecdbba08:string:Recipient Name" },
      "unknownKey": "d9dcc93b-6a9a-49f5-9e74-f52edeba4d75:string:unknownValue",
      "attachments": [
        {
          "filename": "d498168b-e73a-4485-8a9a-b894b1973a08:string:sample.pdf",
          "type": "ae5a0dc2-4139-4306-982a-f8b9e6e82835:string:application/pdf",
          "data": "1b2ce6a2-4275-4de8-949e-16e75870effb:string:BASE64_ENCODED_FILE"
        }
      ]
    },
    "signature": {
      "type": "SHA3MerkleProof",
      "targetHash": "2d4e16ac99f90aa4e95afd173173a438f054060140b0664c3afd568074557c60",
      "proof": ["5d340efd7e1d5693c4baa423499684c9be5aafbe3882d482316b444b661d969f"],
      "merkleRoot": "ab6504f9c8975157fd05e503116e9b706fff758705027d6895599efe7b3fe1b7"
    }
  },
  {
    "version": "https://schema.openattestation.com/2.0/schema.json",
    "data": {
      "id": "c60a6b5a-49b6-4b85-b9ec-976b6719b892:string:SERIAL_NUMBER_321",
      "$template": {
        "name": "499c472d-2c2e-4187-882e-04d3bf1e940d:string:CUSTOM_TEMPLATE",
        "type": "c0634401-b4e4-4c63-8732-f62d854a0d74:string:EMBEDDED_RENDERER",
        "url": "468a6e8e-a748-4335-8fd7-dcf173ab0385:string:https://localhost:3000/renderer"
      },
      "issuers": [
        {
          "name": "051b6d16-e29e-4ada-90f4-c8758148a84b:string:DEMO STORE",
          "tokenRegistry": "8767bed1-db53-43cc-b4a3-ba0b3e8ae683:string:0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
          "identityProof": {
            "type": "01b783ef-712f-470c-9603-0a3b9e9706c0:string:DNS-TXT",
            "location": "1da609ef-86e1-4d1c-a50b-ae0a542e4489:string:tradetrust.io"
          }
        }
      ],
      "recipient": { "name": "49357695-a00b-4927-90db-deb8b9f52b6f:string:Recipient Name" },
      "unknownKey": "6b711869-14e1-4597-b67d-ef26fb274e37:string:unknownValue",
      "attachments": [
        {
          "filename": "ca004b8b-daa8-4573-b5d3-507230ebb244:string:sample.pdf",
          "type": "a3692e31-4010-4ba7-a772-34829f88f04b:string:application/pdf",
          "data": "658c6f26-65af-446e-bd94-10667eff0223:string:BASE64_ENCODED_FILE"
        }
      ]
    },
    "signature": {
      "type": "SHA3MerkleProof",
      "targetHash": "5d340efd7e1d5693c4baa423499684c9be5aafbe3882d482316b444b661d969f",
      "proof": ["2d4e16ac99f90aa4e95afd173173a438f054060140b0664c3afd568074557c60"],
      "merkleRoot": "ab6504f9c8975157fd05e503116e9b706fff758705027d6895599efe7b3fe1b7"
    }
  }
]
```

The `signature` section includes the fields of `targetHash` and `merkleRoot`.
`signature.targetHash` is the generated hash of the document, computed on the algorithm stated on the `signature.type`.
`signature.merkleRoot` uses the [merkle tree](/docs/topics/appendix/glossary), which combines the `signature.targetHash` and the `signature.proofs` to generate a unique hash for the batch.
`signature.proofs` consists of other `signature.targetHash` and branch (merkle root) that is required for the verification of `signature.merkleRoot`

For a single document, the function `wrapDocument` can be used.

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

In the above example that used wrapDocuments, the batched documents share the same merkleRoot value, that allows a single issuance for multiple verifiable document.

To extract the merkle root, refer to the example below

```ts
const merkleRoot: string = wrappedDocument.signature.merkleRoot;
```

You can now issue the merkle root to create valid verifiable document.
