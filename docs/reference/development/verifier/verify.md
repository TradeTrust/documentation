---
id: verify
title: Verify
sidebar_label: Verify
---

# Open Attestation (Verify)

The [Open Attestation (Verify)](https://github.com/Open-Attestation/oa-verify) repository is the codebase for the npm module that allows you to verify [wrapped document](https://www.openattestation.com/docs/developer-section/libraries/remote-files/open-attestation#wrapping-documents) programmatically. This is useful if you are building your own API or web components. Some common use cases where you will need this module:

This module does not provide the following functionality:

- Programmatic wrapping of OA documents (refer to [Open Attestation](https://www.openattestation.com/docs/developer-section/libraries/remote-files/open-attestation#wrapping-documents))
- Encryption or decryption of OA documents (refer to [Open Attestation (Encryption)](https://www.openattestation.com/docs/developer-section/libraries/remote-files/open-attestation-encryption))
- Programmatic issuance/revocation of document on the Ethereum blockchain

## Installation

```bash
npm i @govtechsg/oa-verify
```

---

## Usage

### Verifying a document

A verification happens on a wrapped document, and it consists of answering to some questions:

- Has the document been tampered with ?
- Is the issuance state of the document valid ?
- Is the document issuer identity valid ? (see [identity proof](https://www.openattestation.com/docs/docs-section/how-does-it-work/issuance-identity))

A wrapped document (shown below) created using [Open Attestation](https://www.openattestation.com/docs/developer-section/libraries/remote-files/open-attestation) would be required.

> **NOTE:** The document shown below is valid and has been issued on the goerli network

```json
{
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    "billFrom": {},
    "billTo": { "company": {} },
    "$template": {
      "type": "f76f4d39-8d23-455b-96ba-5889e0233641:string:EMBEDDED_RENDERER",
      "name": "575f0624-7f43-484c-9285-edd1ae96ebc6:string:INVOICE",
      "url": "fb61f072-64e9-4c2f-83bf-ae68fd911414:string:https://generic-templates.tradetrust.io"
    },
    "issuers": [
      {
        "name": "ed121e9e-8f70-4a01-a422-4509d837c13f:string:Demo Issuer",
        "documentStore": "08948d61-9392-459f-b476-e3c51961f04b:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        "identityProof": {
          "type": "61c13b84-181a-43aa-85f5-dfe89e4b6963:string:DNS-TXT",
          "location": "d7ba5e33-cf5f-4fcc-a4b7-3e6e17324966:string:demo-tradetrust.openattestation.com"
        },
        "revocation": {
          "type": "23d47c6b-4384-4c31-90ca-8284602f6b3e:string:NONE"
        }
      }
    ],
    "links": {
      "self": {
        "href": "121c55c0-864d-4e54-a1f0-86bec4b9a050:string:https://action.openattestation.com?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftradetrust-functions.netlify.app%2F.netlify%2Ffunctions%2Fstorage%2Faea9cb1a-816a-4fd7-b3a9-84924dc9a9e9%22%2C%22key%22%3A%22d80b453e53bb26d3b36efe65f18f0482f52d97cffad6f6c9c195d10e165b9a83%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.tradetrust.io%2F%22%2C%22chainId%22%3A%225%22%7D%7D"
      }
    },
    "network": {
      "chain": "05eb1707-5426-41d8-8fde-bc48ff0f2182:string:ETH",
      "chainId": "ae505425-2df7-4597-87d2-037418d7bcbf:string:5"
    }
  },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "f292056ed5e5535400cec63b78a84ec384d2d77117e1606a17644e7b97a03cac",
    "proof": [],
    "merkleRoot": "f292056ed5e5535400cec63b78a84ec384d2d77117e1606a17644e7b97a03cac"
  }
}
```

To perform verification check on the a document:

```ts
// index.ts
import { isValid, verify } from "@govtechsg/oa-verify";
import * as document from "./document.json";

const fragments = await verify(document as any);

console.log(isValid(fragments)); // output true
```

To perform verification check on a document that requires ethereum network access on V2 Schema:

```ts
// index.ts
import { isValid, verify } from "@govtechsg/oa-verify";
import * as document from "./document.json";

const verify = verificationBuilder(openAttestationVerifiers, {
  network: "goerli",
});

const fragments = await verify(document as any);
console.log(isValid(fragments)); // output true
```

Results of verify on verifiable document

```ts
[
  { type: "DOCUMENT_INTEGRITY", name: "OpenAttestationHash", data: true, status: "VALID" },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationEthereumTokenRegistryStatus",
    reason: {
      code: 4,
      codeString: "SKIPPED",
      message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
    },
  },
  {
    name: "OpenAttestationEthereumDocumentStoreStatus",
    type: "DOCUMENT_STATUS",
    data: {
      issuedOnAll: true,
      revokedOnAny: false,
      details: {
        issuance: [{ issued: true, address: "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD" }],
        revocation: [{ revoked: false, address: "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD" }],
      },
    },
    status: "VALID",
  },
  {
    status: "SKIPPED",
    type: "DOCUMENT_STATUS",
    name: "OpenAttestationDidSignedDocumentStatus",
    reason: { code: 0, codeString: "SKIPPED", message: "Document was not signed by DID directly" },
  },
  {
    name: "OpenAttestationDnsTxtIdentityProof",
    type: "ISSUER_IDENTITY",
    data: [
      {
        status: "VALID",
        location: "demo-tradetrust.openattestation.com",
        value: "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
      },
    ],
    status: "VALID",
  },
  {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "OpenAttestationDnsDidIdentityProof",
    reason: { code: 0, codeString: "SKIPPED", message: "Document was not issued using DNS-DID" },
  },
];
```

## Verification Fragments

### Overview

Various utilities and types are available to assert the correctness of fragments. Each verification method exports types for the fragment, and the data associated with the fragment.

- fragment types are available in 4 flavors: `VALID`, `INVALID`, `SKIPPED`, and `ERROR`.
- `VALID` and `INVALID` fragment data are available in 2 flavors most of the time, one for each version of `OpenAttestation`.

This library provides types and utilities to:

- get a specific fragment from all the fragments returned by the `verify` method
- narrow down to a specific type of fragment
- narrow down to a specific fragment data

Let's see how to use it

### Example

```ts
import { utils } from "@govtechsg/oa-verify";
const fragments = verify(documentValidWithCertificateStore, { network: "goerli" });
// return the correct fragment, correctly typed
const fragment = utils.getOpenAttestationEthereumTokenRegistryStatusFragment(fragments);

if (utils.isValidFragment(fragment)) {
  // guard to narrow to the valid fragment type
  const { data } = fragment;
  if (ValidTokenRegistryDataV2.guard(data)) {
    // data is correctly typed here
  }
}
```

Note that in the example above, using `utils.isValidFragment` might be unnecessary. It's possible to use directly `ValidTokenRegistryDataV2.guard` over the data.

### Custom verification

By default the provided `verify` method performs multiple checks on a document

- for the type `DOCUMENT_STATUS`: it runs `OpenAttestationEthereumDocumentStoreStatus`, `OpenAttestationEthereumTokenRegistryStatus` and `DidSignedDocumentStatus` verifiers
- for the type `DOCUMENT_INTEGRITY`: it runs `OpenAttestationHash` verifier
- for the type `ISSUER_IDENTITY`: it runs `OpenAttestationDnsTxt` and `DnsDidProof` verifiers

All those verifiers are exported as `openAttestationVerifiers`

## Available Verification methods

| Name                                       | Type               | Description                                                                  | Present in default verifier? |
| ------------------------------------------ | ------------------ | ---------------------------------------------------------------------------- | ---------------------------- |
| OpenAttestationHash                        | DOCUMENT_INTEGRITY | Verify that merkle root and target hash matches the certificate              | Yes                          |
| OpenAttestationDidSignedDocumentStatus     | DOCUMENT_STATUS    | Verify the validity of the signature of a DID signed certificate             | Yes                          |
| OpenAttestationEthereumDocumentStoreStatus | DOCUMENT_STATUS    | Verify the certificate has been issued to the document store and not revoked | Yes                          |
| OpenAttestationEthereumTokenRegistryStatus | DOCUMENT_STATUS    | Verify the certificate has been issued to the token registry and not revoked | Yes                          |
| OpenAttestationDidIdentityProof            | ISSUER_IDENTITY    | Verify identity of DID (similar to OpenAttestationDidSignedDocumentStatus)   | No                           |
| OpenAttestationDnsDidIdentityProof         | ISSUER_IDENTITY    | Verify identify of DID certificate using DNS-TXT                             | Yes                          |
| OpenAttestationDnsTxtIdentityProof         | ISSUER_IDENTITY    | Verify identify of document store certificate using DNS-TXT                  | Yes                          |

---
