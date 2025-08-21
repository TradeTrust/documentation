---
id: w3c-vc-v2
title: "Migration Guide: TrustVC W3C VC Data Model v1.1 to v2.0"
sidebar_label: "TrustVC W3C VC v1.1 to v2.0"
---

# Migration Guide: TrustVC W3C VC Data Model v1.1 to v2.0

This guide provides comprehensive instructions for migrating **TrustVC library** implementations from **W3C VC Data Model v1.1** to **v2.0**, covering both technical implementation details for developers and practical usage examples for users.

> **Note**: This migration guide is specifically designed for users of the **TrustVC library** (`@trustvc/trustvc` packages). If you're using other W3C VC implementations, please refer to their respective documentation.

## Overview

The TrustVC library's support for W3C VC Data Model v2.0 introduces significant improvements over v1.1, including:

- **Modern Cryptographic Suites**: ECDSA-SD-2023 with selective disclosure capabilities
- **Updated Context URLs**: New v2.0 contexts for enhanced interoperability
- **Improved Date Fields**: `validFrom`/`validUntil` replacing `issuanceDate`/`expirationDate`
- **Enhanced Status Lists**: BitstringStatusList replacing StatusList2021
- **Multikey Format**: Modern key representation for better DID document compatibility

## Key Differences Summary

| Aspect | v1.1 (Legacy) | v2.0 (Modern) |
|--------|---------------|---------------|
| **Context** | `https://www.w3.org/2018/credentials/v1` | `https://www.w3.org/ns/credentials/v2` |
| **Date Fields** | `issuanceDate`, `expirationDate` | `validFrom`, `validUntil` |
| **Cryptosuite** | BBS+ (`BbsBlsSignature2020`) | ECDSA-SD-2023 (`ecdsa-sd-2023`) |
| **Proof Type** | `BbsBlsSignature2020` | `DataIntegrityProof` |
| **Key Format** | BLS12-381 G2 (`privateKeyBase58`) | Multikey (`secretKeyMultibase`) |
| **Status List** | `StatusList2021Credential` | `BitstringStatusListCredential` |
| **Status Entry** | `StatusList2021Entry` | `BitstringStatusListEntry` |
| **Status Subject** | `StatusList2021` | `BitstringStatusList` |

## Migration Steps

### 1. Update Dependencies

First, ensure you're using the latest versions of TrustVC packages that support v2.0:

```bash
npm install @trustvc/trustvc@latest
```

### 2. Key Pair Migration

#### v1.1 Key Generation (Legacy)
```typescript
import { generateKeyPair, VerificationType } from '@trustvc/w3c-issuer';

// v1.1 - BLS12-381 G2 Key
const legacyKeyPair = await generateKeyPair({
  type: VerificationType.Bls12381G2Key2020,
  seedBase58: 'your-seed-here' // optional
});

console.log(legacyKeyPair);
// Output:
// {
//   type: "Bls12381G2Key2020",
//   privateKeyBase58: "...",
//   publicKeyBase58: "...",
//   seedBase58: "..."
// }
```

#### v2.0 Key Generation (Modern)
```typescript
import { generateKeyPair, CryptoSuite } from '@trustvc/w3c-issuer';

// v2.0 - ECDSA-SD-2023 with Multikey
const modernKeyPair = await generateKeyPair({
  type: CryptoSuite.EcdsaSd2023 // 'ecdsa-sd-2023'
});

console.log(modernKeyPair);
// Output:
// {
//   type: "Multikey",
//   secretKeyMultibase: "z...",
//   publicKeyMultibase: "z..."
// }
```

### 3. Credential Issuance Migration

#### v1.1 Credential Issuance
```typescript
import { signW3C } from '@trustvc/trustvc';

const credentialV1 = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/security/bbs/v1'
  ],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  issuanceDate: '2024-01-01T00:00:00Z',
  expirationDate: '2025-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:example:subject',
    name: 'John Doe',
    degree: 'Bachelor of Science'
  }
};

const legacyKeyPair = {
  id: 'did:web:example.com#key-1',
  controller: 'did:web:example.com',
  type: 'Bls12381G2Key2020',
  privateKeyBase58: '...',
  publicKeyBase58: '...'
};

const { signed: signedV1 } = await signW3C(credentialV1, legacyKeyPair, 'BbsBlsSignature2020');
```

#### v2.0 Credential Issuance
```typescript
import { signW3C } from '@trustvc/trustvc';

const credentialV2 = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://w3id.org/security/data-integrity/v2'
  ],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  validFrom: '2024-01-01T00:00:00Z',
  validUntil: '2025-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:example:subject',
    name: 'John Doe',
    degree: 'Bachelor of Science'
  }
};

const modernKeyPair = {
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'did:web:example.com#multikey-1',
  controller: 'did:web:example.com',
  type: 'Multikey',
  secretKeyMultibase: 'z...',
  publicKeyMultibase: 'z...'
};

const { signed: signedV2 } = await signW3C(credentialV2, modernKeyPair, 'ecdsa-sd-2023', {
  mandatoryPointers: [
    '/credentialSubject/id',
    '/credentialSubject/name'
  ]
});
```

> **Mandatory Pointers**: In ECDSA-SD-2023, mandatory pointers specify which fields must always be disclosed and cannot be selectively hidden. This is useful for ensuring critical information like the credential subject's ID and name are always visible, while other fields like age or GPA can be selectively disclosed. The pointers use JSON Pointer syntax (RFC 6901) to reference specific fields in the credential.
> 
> **Default Behavior**: If no mandatory pointers are provided, all fields in the credential become selectively disclosable, meaning the holder can choose to hide any field during presentation. However, certain fields like the credential's `@context`, `type`, `issuer`, and `validFrom`/`validUntil` are typically always disclosed by default as they are essential for credential verification.

### 4. Selective Disclosure (Derive) Migration

One of the most powerful features of v2.0 is enhanced selective disclosure using ECDSA-SD-2023. Here's how it works and differs from v1.1:

#### Key Differences: BBS+ vs ECDSA-SD-2023

| Aspect | v1.1 (BBS+) | v2.0 (ECDSA-SD-2023) |
|--------|-------------|----------------------|
| **Verification** | Can verify original credential directly | **Must derive before verification** |
| **Performance** | Slower derivation and verification | Faster derivation and verification |
| **Mandatory Fields** | Limited control over always-visible fields | Precise control via mandatory pointers |
| **Ecosystem Support** | Mature but limited adoption | Growing W3C standard support |

#### Creating and Verifying Derived Credential

##### Step 1: Sign Credential with Selective Disclosure Support

```typescript
import { signW3C } from '@trustvc/trustvc';

const credential = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://w3id.org/security/data-integrity/v2'
  ],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  validFrom: '2024-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:example:student123',
    name: 'Alice Johnson',
    studentId: 'STU-2024-001',
    degree: 'Bachelor of Computer Science',
    gpa: 3.9,
    graduationYear: 2024,
    dateOfBirth: '1999-05-15'
  }
};

// Sign with mandatory pointers (always visible fields)
const { signed: fullCredential } = await signW3C(credential, modernKeyPair, 'ecdsa-sd-2023', {
  mandatoryPointers: [
    '/credentialSubject/id',
    '/credentialSubject/name',
    '/credentialSubject/degree'
  ]
});
```

##### Step 2: Derive Selective Disclosure Credential

```typescript
import { deriveW3C } from '@trustvc/trustvc';

// Create job application VC (hide sensitive info)
const jobApplicationVC = await deriveW3C(signedCredential, [
  '/credentialSubject/graduationYear'
  // Reveals: id, name, degree (mandatory) + graduationYear
  // Hides: studentId, gpa, dateOfBirth
]);

// Create scholarship application VC (show academic performance)
const scholarshipVC = await deriveW3C(signedCredential, [
  '/credentialSubject/gpa',
  '/credentialSubject/graduationYear'
  // Reveals: id, name, degree (mandatory) + gpa + graduationYear
  // Hides: studentId, dateOfBirth
]);
```

##### Step 3: Verify the Derived Credential

> **⚠️ Important**: Unlike BBS+ credentials, ECDSA-SD-2023 credentials **must be derived before verification**. You cannot verify the original full credential directly if you want selective disclosure.

```typescript
import { verifyW3CSignature } from '@trustvc/trustvc';

// ❌ WRONG: Cannot verify original credential with ECDSA-SD-2023
// const result = await verifyW3CSignature(fullCredential); // This will fail

// ✅ CORRECT: Verify the derived credential
const jobVerification = await verifyW3CSignature(jobApplicationVC);
const scholarshipVerification = await verifyW3CSignature(scholarshipVC);

console.log('Job Application Valid:', jobVerification.verified);
console.log('Scholarship Application Valid:', scholarshipVerification.verified);
```

#### Best Practices for Selective Disclosure

1. **Plan Mandatory Pointers Carefully**: Include fields that should always be visible (e.g., subject ID, credential type)
2. **Use Meaningful Field Selection**: Only reveal fields necessary for the specific use case
3. **Always Derive Before Verification**: Remember that ECDSA-SD-2023 requires derivation before verification
4. **Test Different Disclosure Scenarios**: Ensure your selective disclosure works for various use cases
5. **Document Your Disclosure Policies**: Clearly communicate what fields are mandatory vs. selectable

### 5. Verification Migration

The TrustVC library provides seamless verification through the `verifyDocument` function, which offers **backward compatibility** and works with both v1.1 and v2.0 credentials automatically.

#### Unified Verification with verifyW3C

```typescript
import { verifyDocument } from '@trustvc/trustvc';

// ✅ Works with v1.1 BBS+ credentials
const v1Result = await verifyDocument(signedV1Credential);

// ✅ Works with derived v2.0 ECDSA-SD-2023 credentials
const derivedResult = await verifyDocument(derivedCredential);

console.log('v1.1 Verification:', v1Result.verified);
console.log('Derived Verification:', derivedResult.verified);
```

### 6. Credential Status Migration

#### v1.1 Status List Creation
```typescript
import { 
  createCredentialStatusPayload, 
  StatusList 
} from '@trustvc/w3c-credential-status';

// Create status list
const statusList = new StatusList({ length: 100000 });
statusList.setStatus(42, true); // Revoke credential at index 42
const encodedList = await statusList.encode();

// Create v1.1 status credential
const statusCredentialV1 = await createCredentialStatusPayload(
  {
    id: 'https://example.com/status/1',
    credentialSubject: {
      id: 'https://example.com/status/1#list',
      type: 'StatusList2021', // v1.1 subject type
      statusPurpose: 'revocation',
      encodedList
    }
  },
  legacyKeyPair,
  'StatusList2021Credential', // v1.1 credential type
  'BbsBlsSignature2020' // legacy cryptosuite
);
```


#### v1.1 Credential with Status List
```typescript
const credentialWithStatusV1 = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/security/bbs/v1',
    'https://w3id.org/vc/status-list/2021/v1'
  ],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  issuanceDate: '2024-01-01T00:00:00Z',
  credentialStatus: {
    id: 'https://example.com/status/1#42',
    type: 'StatusList2021Entry', // v1.1 status type
    statusPurpose: 'revocation',
    statusListIndex: '42',
    statusListCredential: 'https://example.com/status/1'
  },
  credentialSubject: {
    id: 'did:example:subject',
    name: 'John Doe'
  }
};
```

#### v2.0 Status List Creation
```typescript
import { 
  createCredentialStatusPayload, 
  StatusList 
} from '@trustvc/w3c-credential-status';

// Same StatusList class works for both versions
const statusList = new StatusList({ length: 100000 });
statusList.setStatus(42, true); // Revoke credential at index 42
const encodedList = await statusList.encode();

// Create v2.0 status credential
const statusCredentialV2 = await createCredentialStatusPayload(
  {
    id: 'https://example.com/status/1',
    credentialSubject: {
      id: 'https://example.com/status/1#list',
      type: 'BitstringStatusList', // v2.0 subject type
      statusPurpose: 'revocation',
      encodedList
    }
  },
  modernKeyPair,
  'BitstringStatusListCredential', // v2.0 credential type
  'ecdsa-sd-2023' // modern cryptosuite
);
```

#### v2.0 Credential with Status List
```typescript
const credentialWithStatusV2 = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://w3id.org/security/data-integrity/v2'
  ],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  validFrom: '2024-01-01T00:00:00Z',
  credentialStatus: {
    id: 'https://example.com/status/1#42',
    type: 'BitstringStatusListEntry', // v2.0 status type
    statusPurpose: 'revocation',
    statusListIndex: '42',
    statusListCredential: 'https://example.com/status/1'
  },
  credentialSubject: {
    id: 'did:example:subject',
    name: 'John Doe'
  }
};
```



### 7. Document Builder Migration

The `DocumentBuilder` class helps build and manage W3C v2.0 credentials with credential status features.
**Note**: The new DocumentBuilder only supports v2.0 credentials with ECDSA-SD-2023 cryptosuite by default.

### Basic Document Builder Usage

```typescript
import { DocumentBuilder } from '@trustvc/trustvc';

// DocumentBuilder automatically uses v2.0 context and ECDSA-SD-2023
const document = new DocumentBuilder({
  // Adds a custom vocabulary used to define terms in the `credentialSubject`.
  // Users can define their own context if they have domain-specific fields or custom data structures.
});

// Add credential subject
document.credentialSubject({
  id: 'did:example:student123',
  name: 'Alice Johnson',
  studentId: 'STU-2024-001',
  degree: 'Bachelor of Computer Science',
  gpa: 3.9,
  graduationYear: 2024,
  dateOfBirth: '1999-05-15'
});

// Set validUntil (v2.0 date fields)
document.expirationDate('2029-01-01T00:00:00Z');

// Add credential status for revocation (v2.0 format) - Verifiable Document
document.credentialStatus({
  id: 'https://example.com/status/1#42',
  type: 'BitstringStatusListEntry',
  statusPurpose: 'revocation',
  statusListIndex: '42',
  statusListCredential: 'https://example.com/status/1'
});

// Or add credential status for Transferable Records
document.credentialStatus({
  chain: 'Ethereum',
  chainId: 1,
  tokenRegistry: '0x1234567890abcdef...',
  rpcProviderUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
});
```

### Document Builder with Signing and Selective Disclosure

```typescript
// ECDSA-SD-2023 key pair
const modernKeyPair = {
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'did:web:example.com#multikey-1',
  controller: 'did:web:example.com',
  type: 'Multikey',
  secretKeyMultibase: 'z...',
  publicKeyMultibase: 'z...'
};

// Sign with mandatory pointers (always visible fields)
const signedDocument = await document.sign(modernKeyPair, 'ecdsa-sd-2023', {
  mandatoryPointers: [
    '/credentialSubject/id',
    '/credentialSubject/name',
    '/credentialSubject/degree'
  ]
});
console.log(signedDocument);
```

### Built-in Derive Function

The new DocumentBuilder includes a built-in derive function for selective disclosure:

```typescript
// Use DocumentBuilder's derive function for selective disclosure
const derivedDocument = await document.derive([
  '/credentialSubject/graduationYear'
  // Reveals: id, name, degree (mandatory) + graduationYear
  // Hides: studentId, gpa, dateOfBirth
]);
console.log(derivedDocument);

// Verify the derived credential
// ECDSA-SD-2023 credentials must be derived before verification
const isVerified = await document.verify();
console.log(isVerified); // true or false
```

### Advanced Document Builder Features

```typescript
// Add render method for display templates
document.renderMethod({
  id: 'https://university.edu/templates',
  type: 'EMBEDDED_RENDERER',
  templateName: 'ACADEMIC_TRANSCRIPT'
});

// Set the qrcode method to be used for the document
document.qrCode({
  uri: 'https://example.com/qrcode',
  type: 'TrustVCQRCode',
});
```

## Migration Checklist

### For Developers

- [ ] Update package dependencies to latest versions
- [ ] Replace BLS12-381 key generation with ECDSA-SD-2023
- [ ] Update context URLs from v1 to v2
- [ ] Change date fields: `issuanceDate` → `validFrom`, `expirationDate` → `validUntil`
- [ ] Update status list types: `StatusList2021*` → `BitstringStatusList*`
- [ ] Replace `BbsBlsSignature2020` with `ecdsa-sd-2023` cryptosuite
- [ ] Update key format from `privateKeyBase58` to `secretKeyMultibase`
- [ ] Test selective disclosure functionality
- [ ] Update verification logic (remove explicit suite specification)
- [ ] Update DID documents to use `Multikey` type for modern keys

### For Users

- [ ] Ensure your issuer supports v2.0 credentials
- [ ] Update any hardcoded context URLs in your applications
- [ ] Verify that your verification systems support both v1.1 and v2.0
- [ ] Test credential status checking with new BitstringStatusList format
- [ ] Update any date field parsing logic
- [ ] Consider implementing selective disclosure features

## Backward Compatibility

The TrustVC libraries maintain backward compatibility, allowing you to:

- Verify v1.1 credentials using v2.0 libraries
- Run both v1.1 and v2.0 credentials in the same application
- Gradually migrate your credential issuance to v2.0

## Common Issues and Solutions

### Issue 1: Context Resolution Errors
**Problem**: Old context URLs not resolving
**Solution**: Update to v2.0 contexts and ensure your document loader supports them

### Issue 2: Date Field Validation
**Problem**: Verification fails due to date field mismatches
**Solution**: Use appropriate date fields for each version (`issuanceDate` for v1.1, `validFrom` for v2.0)

### Issue 3: Key Format Compatibility
**Problem**: Legacy keys not working with v2.0
**Solution**: Generate new ECDSA-SD-2023 keys for v2.0 credentials while maintaining legacy keys for v1.1 support

### Issue 4: Status List Type Errors
**Problem**: Status list verification fails
**Solution**: Ensure status credential type matches the credential version (StatusList2021 for v1.1, BitstringStatusList for v2.0)

## Resources

- [W3C VC Data Model v2.0 Specification](https://www.w3.org/TR/vc-data-model-2.0/)
- [Bitstring Status List Specification](https://www.w3.org/TR/vc-bitstring-status-list/)
- [Data Integrity Specification](https://www.w3.org/TR/vc-data-integrity/)
- [ECDSA-SD-2023 Cryptosuite](https://www.w3.org/TR/vc-di-ecdsa/)
- [TrustVC GitHub Repository](https://github.com/TrustVC/trustvc)

## Support

If you encounter issues during migration, please:

1. Check the [Common Issues](#common-issues-and-solutions) section
2. Open an issue on [GitHub](https://github.com/TrustVC/trustvc/issues)

---

**Note**: This migration guide covers the most common use cases. For advanced scenarios or custom implementations, please refer to the individual package documentation or contact our support team.
