---
id: migration-trustvc
title: Migration to TrustVC
sidebar_label: Migration to TrustVC
---

This migration guide will help you transition from using the **TradeTrust** libraries (@tradetrust-tt/tt-verify, @tradetrust-tt/tradetrust) to **TrustVC**. In addition, it introduces the new W3C Verifiable Credentials (VC) integration for managing verifiable credentials. This version of **TrustVC** integrates both token-based credentials and W3C VC to provide a unified credential management solution.

## 1. What’s New?
**TrustVC Integration**
- **TrustVC** is a comprehensive library that combines several TradeTrust libraries, including Token Registry v5, W3C Verifiable Credentials, and OpenAttestation Verifiable Documents. By using **TrustVC**, you can manage both credential documents and token-based credentials seamlessly in a unified solution.

**Token Registry v5**
- Token Registry v5 is the newest version. It allows you to manage token-based credentials and ownership transfers through smart contracts. For more information refer to [here](igp-i).

## 2. How to Migrate to TrustVC
**To install the TrustVC library**:

Run the following command in your project directory:
```bash
npm install @trustvc/trustvc
```

## 3. Code Migration
### Wrapping OpenAttestation Document
**Before Migration (using @tradetrust-tt/tradetrust)**:
```ts
import { wrapDocument } from '@tradetrust-tt/tradetrust';

const rawDocument = { /* document content */ };
const wrappedDocument = wrapDocument(rawDocument);
```
**After Migration (using @trustvc/trustvc)**:
```ts
import { wrapOADocument } from '@trustvc/trustvc';

const rawDocument = { /* document content */ };
const wrappedDocument = await wrapOADocument(rawDocument);
```

### Signing OpenAttestation Document
**Before Migration (using @tradetrust-tt/tradetrust)**:
```ts
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from '@tradetrust-tt/tradetrust';

const wrappedDocument = { /* document content */ };
const signedWrappedDocument = await signDocument(wrappedDocument, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
  public: 'did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller',
  private: '<privateKey>',
});
```
**After Migration (using @trustvc/trustvc)**:
```ts
import { signOA } from '@trustvc/trustvc';

const wrappedDocument = { /* document content */ };
const signedWrappedDocument = await signOA(wrappedDocument, {
  public: 'did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller',
  private: '<privateKey>',
});
```

### Signing W3C Document
The TrustVC W3C Signing feature simplifies the signing process for W3C-compliant verifiable credentials using ECDSA-SD-2023 signatures with selective disclosure. This feature allows you to easily sign W3C Verifiable Credentials (VCs) and ensure they comply with the latest W3C VC v2.0 standards.

**Signing W3C Document (using @trustvc/trustvc)**:
```ts
import { issuer, signW3C } from '@trustvc/trustvc';

const { CryptoSuite } = issuer;

const rawDocument = { /* document content */ };
const signingResult = await signW3C(rawDocument, {
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'did:web:trustvc.github.io:did:1#keys-1',
  controller: 'did:web:trustvc.github.io:did:1',
  type: 'Multikey',
  secretKeyMultibase: '<secretKeyMultibase>',
  publicKeyMultibase: '<publicKeyMultibase>',
}, CryptoSuite.EcdsaSd2023);
```

### Verifying Document
**TrustVC** simplifies the verification process with a single function that supports both W3C Verifiable Credentials (VCs) and OpenAttestation Verifiable Documents (VDs). Whether you're working with W3C standards or OpenAttestation standards, **TrustVC** handles the verification seamlessly.

**Before Migration (using @tradetrust-tt/tt-verify)**:
```ts
import { verify } from "@tradetrust-tt/tt-verify";

const signedDocument = { /* document content */ };
const resultFragments = await verify(signedDocument);
```
**After Migration (using @trustvc/trustvc)**:
```ts
import { verifyDocument } from '@trustvc/trustvc';

const signedDocument = { /* document content */ };
const resultFragments = await verifyDocument(signedDocument);
```

### Token Registry V5
To dive deeper into the new features of Token Registry v5, refer to the following pages:
- [Token Registry v5 Overview](igp-i) – Detailed documentation on the new methods and enhancements.
- [Token Registry v5 Migration Guide](migration-tr-v5) – Step-by-step guide for migrating your codebase to Token Registry v5.