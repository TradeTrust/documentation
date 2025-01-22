---
id: document-integrity
title: Document Integrity
sidebar_label: Document Integrity
---

TradeTrust ensures that the content of a document remains intact and untampered with after its creation by leveraging decentralized identifiers (DID) and cryptographic methods. The adoption of did:web simplifies document verification, focusing on validating proofs using the public key of the specified DID. Let’s explore how this mechanism works.

### Document Structure and did:web Integration

The document now uses a did:web identifier to ensure cryptographic integrity and traceability. Below is an example structure:

_Sample did:web host._

```js
{
  "id": "did:web:trustvc.github.io:did:1",
  "verificationMethod": [
    {
      "type": "Bls12381G2Key2020",
      "id": "did:web:trustvc.github.io:did:1#keys-1",
      "controller": "did:web:trustvc.github.io:did:1",
      "publicKeyBase58": "oRfEeWFresvhRtXCkihZbxyoi2JER7gHTJ5psXhHsdCoU1MttRMi3Yp9b9fpjmKh7bMgfWKLESiK2YovRd8KGzJsGuamoAXfqDDVhckxuc9nmsJ84skCSTijKeU4pfAcxeJ"
    }
  ],
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/bls12381-2020/v1"
  ],
  "authentication": [
    "did:web:trustvc.github.io:did:1#keys-1"
  ],
  "assertionMethod": [
    "did:web:trustvc.github.io:did:1#keys-1"
  ],
  "capabilityInvocation": [
    "did:web:trustvc.github.io:did:1#keys-1"
  ],
  "capabilityDelegation": [
    "did:web:trustvc.github.io:did:1#keys-1"
  ]
}
```

### How It Works

#### 1. Document Proof Generation

Upon creation, the document is signed using a cryptographic algorithm, such as `Bls12381G2Key2020`. This signature is tied to the document's content and the did:web identifier, ensuring authenticity.

- The proof value contains cryptographic evidence of the document's integrity.
- The public key associated with the did:web identifier is used to verify this signature.

#### 2. Validation Process

To verify the integrity of a document, the following steps are executed:

**Extract the Public Key:**
Retrieve the public key (publicKeyBase58) from the verificationMethod section of the did:web document.

- **Validate the Proof:**
  Use the public key and cryptographic algorithms to validate the proof provided in the document. The signature ensures that no unauthorized modifications have been made.

- **Contextual Validation:**
  Confirm the document adheres to the specified `JSON-LD contexts` (@context), ensuring compatibility and alignment with the DID and cryptographic specifications.

#### 3. Selective Disclosure and Privacy

The current implementation supports selective disclosure without compromising document validity. By design, users can share specific sections of a document while hiding others:

- Omitted sections are hashed and replaced with identifiers.
- Verification accounts for these hashes to ensure the document remains valid even with partial disclosure.

#### 4. Cryptographic Resilience

The method leverages strong cryptographic algorithms like `Bls12381G2Key2020` to ensure tamper resistance. Any unauthorized changes to the document render the cryptographic proof invalid.

### Summary

By integrating `did:web`, TradeTrust achieves robust document integrity through decentralized identifiers and cryptographic proofs. This approach guarantees the authenticity and integrity of documents, supports selective disclosure, and provides a streamlined mechanism for validation using public keys associated with did:web.
