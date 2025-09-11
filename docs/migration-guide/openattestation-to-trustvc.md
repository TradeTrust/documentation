---
id: openattestation-to-trustvc
title: "Migration Guide: OpenAttestation to TrustVC SDK"
sidebar_label: OpenAttestation to TrustVC
---

# Migration Guide: OpenAttestation to TrustVC SDK

This guide helps **OpenAttestation (OA)** users migrate to the **TrustVC SDK** for seamless business continuity. TrustVC provides full backward compatibility with OpenAttestation while offering access to modern **W3C Verifiable Credentials v2.0** standards.

## Quick Migration: Replace Imports

The simplest migration path is to replace your OpenAttestation imports with TrustVC equivalents. TrustVC maintains full compatibility with existing OpenAttestation workflows.

### 1. Install TrustVC SDK

```bash
# Remove OpenAttestation packages (optional - can keep for gradual migration)
npm uninstall @govtechsg/open-attestation @govtechsg/oa-verify

# Install TrustVC SDK
npm install @trustvc/trustvc
```

### 2. Replace Document Wrapping

#### Before (OpenAttestation)
```typescript
import { wrapDocument } from '@govtechsg/open-attestation';

const rawDocument = { /* your OA document */ };
const wrappedDocument = wrapDocument(rawDocument);
```

#### After (TrustVC)
```typescript
import { wrapOADocument } from '@trustvc/trustvc';

const rawDocument = { /* your OA document */ };
const wrappedDocument = await wrapOADocument(rawDocument);
```

### 3. Replace Document Signing

#### Before (OpenAttestation)
```typescript
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from '@govtechsg/open-attestation';

const signedDocument = await signDocument(wrappedDocument, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
  public: 'did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller',
  private: '<privateKey>',
});
```

#### After (TrustVC)
```typescript
import { signOA } from '@trustvc/trustvc';

const signedDocument = await signOA(wrappedDocument, {
  public: 'did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller',
  private: '<privateKey>',
});
```

### 4. Replace Document Verification

#### Before (OpenAttestation)
```typescript
import { verify } from '@govtechsg/oa-verify';

const verificationResults = await verify(signedDocument);
```

#### After (TrustVC)
```typescript
import { verifyDocument } from '@trustvc/trustvc';

const verificationResults = await verifyDocument(signedDocument);
```

## Migration Summary

| Function | OpenAttestation | TrustVC Equivalent |
|----------|----------------|-------------------|
| **Wrapping** | `wrapDocument()` | `wrapOADocument()` |
| **Signing** | `signDocument()` | `signOA()` |
| **Verification** | `verify()` | `verifyDocument()` |

## Benefits of Migration

### Immediate Benefits
- ✅ **Drop-in replacement** - Minimal code changes required
- ✅ **Backward compatibility** - Existing OA documents continue to work
- ✅ **Unified SDK** - Handle multiple credential formats with one library
- ✅ **Enhanced verification** - Improved verification logic and error handling

### Future Opportunities
- 🚀 **W3C VC v2.0 support** - Access to modern credential standards
- 🔒 **Selective disclosure** - Privacy-preserving credential sharing
- 🌐 **Interoperability** - Credentials work across different platforms
- 📈 **Ecosystem growth** - Participate in broader W3C VC ecosystem

## Next Steps: Modernize with W3C VC v2.0

Once you've migrated your OpenAttestation workflow to TrustVC, consider adopting **W3C Verifiable Credentials v2.0** for new projects:

### W3C VC v2.0 Example
```typescript
import { issuer, signW3C } from '@trustvc/trustvc';

const { generateKeyPair, CryptoSuite } = issuer;

// Generate modern ECDSA-SD-2023 keys
const keyPair = await generateKeyPair({
  type: CryptoSuite.EcdsaSd2023
});

// Create W3C VC v2.0 credential
const w3cCredential = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://w3id.org/security/data-integrity/v2'
  ],
  type: ['VerifiableCredential'],
  issuer: 'did:web:your-domain.com',
  validFrom: '2024-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:example:subject',
    // your credential data
  }
};

// Sign with selective disclosure
const { signed } = await signW3C(w3cCredential, keyPair, CryptoSuite.EcdsaSd2023);
```

## Migration Checklist

- [ ] Install `@trustvc/trustvc` package
- [ ] Replace `wrapDocument` with `wrapOADocument`
- [ ] Replace `signDocument` with `signOA`
- [ ] Replace `verify` with `verifyDocument`
- [ ] Test existing OpenAttestation workflows
- [ ] Consider W3C VC v2.0 for new projects

## Support

- [W3C VC v2.0 Migration Guide](w3c-vc-v2)
- [GitHub Issues](https://github.com/TrustVC/trustvc/issues)

---

**Ready to migrate?** Replace your OpenAttestation imports with TrustVC today for seamless compatibility and access to modern credential standards.
