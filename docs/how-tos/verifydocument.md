---
id: verifydocument
title: Verify Document
sidebar_label: Verify Document
---

## Overview

TrustVC simplifies the verification process with a single function that supports both W3C Verifiable Credentials (VCs) and OpenAttestation Verifiable Documents (VDs). Whether you're working with W3C standards or OpenAttestation standards, TrustVC handles the verification seamlessly.It ensures document authenticity, integrity, and issuer identity using Ethereum-compatible JSON-RPC provider services.

### Parameters

#### 1) document (DocumentsToVerify | SignedVerifiableCredential)

The document to be verified, which can be either:

- An OpenAttestation document (V2/V3)
- A W3C Verifiable Credential

#### 2) rpcProviderUrl (string)

- A URL pointing to an Ethereum-compatible JSON-RPC provider (e.g., Infura, Alchemy, or a custom node).
- This provider is essential for resolving Decentralized Identifiers (DIDs) and validating cryptographic proofs.

### Return Value

- Returns a Promise that resolves to an array of verification fragments (VerificationFragment[]).
- Each fragment represents a specific verification step, such as:
  - Signature integrity verification
  - Credential status check (e.g., revocation)
  - Issuer identity validation

### Function Logic

#### 1) Check Document Type

- If the document is an OpenAttestation document (V2 or V3), it uses OpenAttestation verifiers.
- Otherwise, it is treated as a W3C Verifiable Credential, and W3C verification fragments are used.

#### 2) Build the Verification Process

- The function uses verificationBuilder with the appropriate verifiers:
  - openAttestationVerifiers for OpenAttestation documents
  - w3cVerifiers for W3C Verifiable Credentials
- It passes a JSON-RPC provider created using the provided rpcProviderUrl to interact with the blockchain network.

#### 3) Execute Verification

- The verification process is executed asynchronously, and the results are returned as an array of verification fragments.

### Usage Example

```ts
import { verifyDocument } from "@trustvc/trustvc";

const signedDocument = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3c-ccg.github.io/citizenship-vocab/contexts/citizenship-v1.jsonld",
    "https://w3id.org/security/bbs/v1",
    "https://w3id.org/vc/status-list/2021/v1",
  ],
  credentialStatus: {
    id: "https://trustvc.github.io/did/credentials/statuslist/1#1",
    type: "StatusList2021Entry",
    statusPurpose: "revocation",
    statusListIndex: "10",
    statusListCredential: "https://trustvc.github.io/did/credentials/statuslist/1",
  },
  credentialSubject: {
    name: "TrustVC",
    birthDate: "2024-04-01T12:19:52Z",
    type: ["PermanentResident", "Person"],
  },
  expirationDate: "2029-12-03T12:19:52Z",
  issuer: "did:web:trustvc.github.io:did:1",
  type: ["VerifiableCredential"],
  issuanceDate: "2024-04-01T12:19:52Z",
  proof: {
    type: "BbsBlsSignature2020",
    created: "2024-10-14T04:11:49Z",
    proofPurpose: "assertionMethod",
    proofValue:
      "l79dlFQMowalep+WCFqgCvpVBcCAr0GDEFUV6S7gRVY/TQ+sp/wcwaT61PaD19rJYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i+CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx/IAvLVniyeMQ==",
    verificationMethod: "did:web:trustvc.github.io:did:1#keys-1",
  },
};

const resultFragments = await verifyDocument(signedDocument);
```

A verification happens on a wrapped OA document or signed w3c VC , and it consists of answering to some questions:

- Has the document been tampered with ?
- Is the issuance state of the document valid ?
- Is the document issuer identity valid ?

For more information you can refer to [Key Components - Verifying](/docs/key-components-of-tradetrust/w3c-vc/verifying-documents/overview)
