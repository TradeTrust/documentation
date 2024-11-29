---
id: trustvc
title: "Introduction: TrustVC"
sidebar_label: "Introduction: TrustVC"
---

[**TrustVC**](https://github.com/TrustVC/trustvc) is a comprehensive library designed to simplify the signing and verification processes for [TrustVC W3C Verifiable Credentials (VC)](https://github.com/TrustVC/w3c) and [OpenAttestation Verifiable Documents (VD)](https://github.com/Open-Attestation/open-attestation/). It adheres to the **W3C VC Data Model v1.1** ([W3C Standard](https://www.w3.org/TR/vc-data-model/)), ensuring compatibility and interoperability for Verifiable Credentials.

With **TrustVC**, developers can seamlessly handle both W3C Verifiable Credentials and OpenAttestation Verifiable Documents through an integrated set of functionalities. The library not only simplifies signing and verification but also imports and integrates existing TradeTrust libraries and smart contracts for token registry (V4 and V5), making it a versatile tool for decentralized identity and trust solutions.

## Key Features

### 1. Independent Signing Functions

**TrustVC** provides dedicated signing functions tailored for both TrustVC W3C VCs and OpenAttestation VDs.

- **OpenAttestation Signing (signOA)**: Enables the signing of OpenAttestation-compliant wrapped documents.
```ts
import { wrapOADocument, signOA } from '@trustvc/trustvc';

const rawDocument = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://schemata.openattestation.com/com/openattestation/4.0/context.json',
  ],
  type: ['VerifiableCredential', 'OpenAttestationCredential'],
  credentialSubject: {
    id: '0x1234567890123456789012345678901234567890',
    name: 'John Doe',
    country: 'SG',
  },
  issuer: {
    id: 'did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90',
    type: 'OpenAttestationIssuer',
    name: 'Government Technology Agency of Singapore (GovTech)',
    identityProof: { identityProofType: 'DNS-DID', identifier: 'example.openattestation.com' },
  },
};

// Wrap the document
const wrappedDocument = await wrapOADocument(rawDocument);

// Sign the wrapped document
const signedWrappedDocument = await signOA(wrappedDocument, {
  public: 'did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller',
  private: '<privateKey>',
});
```

- **TrustVC W3C Signing (signW3C)**: Simplifies the signing process for W3C-compliant verifiable credentials using BBS+ signatures.
```ts
import { signW3C, VerificationType } from '@trustvc/trustvc';

const rawDocument = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3c-ccg.github.io/citizenship-vocab/contexts/citizenship-v1.jsonld',
    'https://w3id.org/security/bbs/v1',
    'https://w3id.org/vc/status-list/2021/v1',
  ],
  credentialStatus: {
    id: 'https://trustvc.github.io/did/credentials/statuslist/1#1',
    type: 'StatusList2021Entry',
    statusPurpose: 'revocation',
    statusListIndex: '10',
    statusListCredential: 'https://trustvc.github.io/did/credentials/statuslist/1',
  },
  credentialSubject: {
    name: 'TrustVC',
    birthDate: '2024-04-01T12:19:52Z',
    type: ['PermanentResident', 'Person'],
  },
  expirationDate: '2029-12-03T12:19:52Z',
  issuer: 'did:web:trustvc.github.io:did:1',
  type: ['VerifiableCredential'],
  issuanceDate: '2024-04-01T12:19:52Z',
};

// Sign the credential
const signingResult = await signW3C(rawDocument, {
  id: 'did:web:trustvc.github.io:did:1#keys-1',
  controller: 'did:web:trustvc.github.io:did:1',
  type: VerificationType.Bls12381G2Key2020,
  publicKeyBase58: '<publicKeyBase58>',
  privateKeyBase58: '<privateKeyBase58>',
});
```

### 2. Unified Verification Function

**TrustVC** simplifies verification with a single function that supports both TrustVC W3C VCs and OpenAttestation VDs.

```ts
import { verifyDocument } from '@trustvc/trustvc';

const signedDocument = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3c-ccg.github.io/citizenship-vocab/contexts/citizenship-v1.jsonld',
    'https://w3id.org/security/bbs/v1',
    'https://w3id.org/vc/status-list/2021/v1',
  ],
  credentialStatus: {
    id: 'https://trustvc.github.io/did/credentials/statuslist/1#1',
    type: 'StatusList2021Entry',
    statusPurpose: 'revocation',
    statusListIndex: '10',
    statusListCredential: 'https://trustvc.github.io/did/credentials/statuslist/1',
  },
  credentialSubject: {
    name: 'TrustVC',
    birthDate: '2024-04-01T12:19:52Z',
    type: ['PermanentResident', 'Person'],
  },
  expirationDate: '2029-12-03T12:19:52Z',
  issuer: 'did:web:trustvc.github.io:did:1',
  type: ['VerifiableCredential'],
  issuanceDate: '2024-04-01T12:19:52Z',
  proof: {
    type: 'BbsBlsSignature2020',
    created: '2024-10-14T04:11:49Z',
    proofPurpose: 'assertionMethod',
    proofValue: '<proofValue>',
    verificationMethod: 'did:web:trustvc.github.io:did:1#keys-1',
  },
};

// Verify the signed document
const resultFragments = await verifyDocument(signedDocument);
```

### 3. Integration with Other TradeTrust Libraries

**TrustVC** is designed to work seamlessly with other TradeTrust libraries, extending their functionality and making it easier to integrate decentralized identity solutions. By leveraging existing TradeTrust tools, **TrustVC** enhances its capabilities for signing, verifying, and managing credentials and documents.

- **@trustvc/w3c**:
  - Provides advanced features for signing **W3C Verifiable Credentials (VCs)**.
  - Simplifies the management of credential statuses, and ensures smooth integration with the **W3C VC Data Model**.

- **@tradetrust/tradetrust & @tradetrust-tt/tt-verify**:
  - Handles **OpenAttestation** document wrapping, signing, and verification.
  - Ensures compatibility with OpenAttestation-based systems, enabling a smooth transition to verifiable document formats for organizations using legacy solutions. 

- **Token Registry v4 and v5**:
  - Supports the use of token-based credential statuses, ensuring compliance with **IG P&I** standards.
  - Ensures backward compatibility with previous versions, while still taking advantage of the latest features available in Token Registry V5.

By integrating these libraries, **TrustVC** brings together a robust set of tools that are easy to adopt and provide real value to users in managing digital credentials and documents.

## Migrating to TrustVC

For detailed instructions on migrating to **TrustVC**, refer to the [Migration Guide](migration-trustvc).
