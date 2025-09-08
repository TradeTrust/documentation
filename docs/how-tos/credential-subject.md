---
id: credential-subject
title: Using Custom Contexts for "credentialSubject"
sidebar_label: Using Custom Contexts for "credentialSubject"
---

# Custom Context for "credentialSubject" in W3C VCs

This documentation explains how to define and utilize a custom `@context` for the `credentialSubject` field in W3C Verifiable Credentials (VCs), with a specific focus on the Bill of Lading use case. It covers the importance of custom contexts, the steps to define and host them, and how to reference them within credentials. Additionally, it provides guidance on enforcing strict checks or defining schemas based on the specific use case.

## Why You Need a Custom Context

### 1. Define Domain-Specific Terms
Custom contexts allow you to create terms that are specific to your use case, ensuring that your data model is precise and meaningful. For instance, in the case of a Bill of Lading credential, terms like `portOfLoading` and `voyageNo` are explicitly defined, reducing ambiguity.

### 2. Ensure Interoperability
Interoperability among systems is the cornerstone of W3C Verifiable Credentials. A custom context helps different organizations understand and process the credential uniformly. By using globally resolvable URIs for terms, systems in shipping, logistics, and trade finance can seamlessly interact with the credential.

### 3. Facilitate Validation
Defining a context allows for schema validation to enforce structure and ensure data integrity. For instance, a Bill of Lading credential must include terms like `blNumber` and `scac` while maintaining a consistent format.

## Define the Custom Context

### Example: Bill of Lading Custom Context

```json
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "BillOfLading": {
      "@id": "https://example.com/terms#BillOfLading",
      "@type": "@id",
      "@context": {
        "@protected": true,
        "billOfLadingName": {
          "@id": "https://example.com/terms#billOfLadingName"
        },
        "scac": {
          "@id": "https://example.com/terms#scac"
        },
        "blNumber": {
          "@id": "https://example.com/terms#blNumber"
        },
        "vessel": {
          "@id": "https://example.com/terms#vessel"
        },
        "voyageNo": {
          "@id": "https://example.com/terms#voyageNo"
        },
        "portOfLoading": {
          "@id": "https://example.com/terms#portOfLoading"
        },
        "portOfDischarge": {
          "@id": "https://example.com/terms#portOfDischarge"
        },
        "carrierName": {
          "@id": "https://example.com/terms#carrierName"
        },
        "placeOfReceipt": {
          "@id": "https://example.com/terms#placeOfReceipt"
        },
        "placeOfDelivery": {
          "@id": "https://example.com/terms#placeOfDelivery"
        },
        "packages": {
          "@id": "https://example.com/terms#packages",
          "@container": "@set",
          "@context": {
            "@protected": true,
            "packagesDescription": {
              "@id": "https://example.com/terms#packagesDescription"
            },
            "packagesWeight": {
              "@id": "https://example.com/terms#packagesWeight"
            },
            "packagesMeasurement": {
              "@id": "https://example.com/terms#packagesMeasurement"
            }
          }
        },
        "shipperName": {
          "@id": "https://example.com/terms#shipperName"
        },
        "shipperAddressStreet": {
          "@id": "https://example.com/terms#shipperAddressStreet"
        },
        "shipperAddressCountry": {
          "@id": "https://example.com/terms#shipperAddressCountry"
        },
        "consigneeName": {
          "@id": "https://example.com/terms#consigneeName"
        },
        "notifyPartyName": {
          "@id": "https://example.com/terms#notifyPartyName"
        },
        "links": {
          "@id": "https://example.com/terms#links"
        }
      }
    }
  }
}
```

## Where to Host the Custom Context

### Options for Hosting

1. **Publicly Accessible Web Servers**  
   Host the JSON-LD context on a reliable server (e.g., `https://example.com/contexts/billoflading.jsonld`). Use HTTPS to ensure secure access.

2. **Version Control**  
   If updates are required, version your contexts (e.g., `https://example.com/contexts/billoflading-v1.0.jsonld`).

### Key Considerations

- Ensure the context URL is resolvable globally.
- Maintain stability to prevent breaking existing implementations.

## How to Reference the Context in the Credential

To use the custom context in a Verifiable Credential, reference its URL in the `@context` field of the credential. Below is an example:

### Example: Bill of Lading Credential

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2",
    "https://example.com/contexts/billoflading.jsonld"
  ],
  "type": ["VerifiableCredential"],
  "issuer": "did:web:example:123456",
  "validFrom": "2025-02-10T00:00:00Z",
  "credentialSubject": {
    "type": ["BillOfLading"],
    "billOfLadingName": "Example Bill of Lading",
    "scac": "SGPU",
    "blNumber": "BL1234567890",
    "carrierName": "Example Carrier",
    "portOfLoading": "Port of Singapore",
    "portOfDischarge": "Port of Rotterdam",
    "vessel": "MV Example Vessel",
    "voyageNo": "1234",
    "placeOfReceipt": "Singapore",
    "placeOfDelivery": "Rotterdam",
    "packages": [
      {
        "packagesDescription": "10 pallets of electronics",
        "packagesWeight": "1000 kg",
        "packagesMeasurement": "5 m³"
      }
    ]
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2025-02-10T00:00:00Z",
    "cryptosuite": "ecdsa-sd-2023",
    "proofPurpose": "assertionMethod",
    "proofValue": "eyJhbGciOiJFZERTQSJ9...",
    "verificationMethod": "did:web:example:123456#key1"
  }
}
```

## Enforcing Strict Checks or Defining a Schema

Strict checks or schema enforcement ensures that the credential complies with your custom context. This can be achieved by:

1. **Using JSON Schema Validation**: Define a JSON Schema for the `credentialSubject` and validate the credential against it.

Example JSON Schema for the Bill of Lading:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "type": {
      "type": "array",
      "items": { "type": "string" }
    },
    "scac": { "type": "string" },
    "blNumber": { "type": "string" },
  },
  "required": ["type", "scac", "blNumber"]
}
```

2. **Custom Validation Code**: Implement a function in your application to validate the `credentialSubject` against the custom context. For example:

```ts
function validateBillOfLading(credentialSubject) {
  if (!credentialSubject) {
    throw new Error("Missing credentialSubject");
  }

  // Check for the "type" field
  if (!credentialSubject.type || !credentialSubject.type.includes("BillOfLading")) {
    throw new Error('Invalid or missing "type" field, must include "BillOfLading"');
  }

  const { blNumber, scac } = credentialSubject;

  // Check for missing required fields
  if (!blNumber || !scac) {
    throw new Error("Missing required BillOfLading fields");
  }
}
```

Enforcing these checks ensures the credential meets the intended data integrity and format requirements.
