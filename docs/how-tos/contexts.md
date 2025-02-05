---
id: contexts
title: Working with Contexts
sidebar_label: Working with Contexts
---

# What Are Contexts?

In the world of decentralized systems and Verifiable Credentials (VCs), **contexts** (`@context`) play a critical role in defining the structure and semantics of data. A context acts as a shared vocabulary that enables systems to interpret data consistently and unambiguously. 

Contexts are represented as JSON-LD (JSON for Linked Data) documents and are specified using a URI. They provide a schema that defines the terms and relationships used within a credential or document. This ensures interoperability between various systems, platforms, and tools.

## Common Contexts

### 1. W3C VC Context

#### **URI**  
[https://www.w3.org/2018/credentials/v1](https://www.w3.org/2018/credentials/v1) - We are using version 1.1 of the credentials context to define and validate Verifiable Credentials.

#### **Description**  
The W3C Verifiable Credentials (VC) context defines the foundational vocabulary and semantics for Verifiable Credentials. It specifies the structure and meaning of core elements, such as `@context`, `id`, `type`, `issuer`, `issuanceDate`, `credentialSubject`, and `proof`. 

The `@context` field is required in every VC to ensure consistent interpretation of the credential's terms and to link it to globally recognized schemas.

#### **Key Elements**
- **`@context`**: Points to a JSON-LD document defining terms used in the VC.
- **`type`**: Specifies the credential type, typically includes `"VerifiableCredential"`.
- **`issuer`**: The entity that issued the credential, often represented by a DID.
- **`issuanceDate`**: The date and time when the credential was issued.
- **`credentialSubject`**: Describes the subject of the credential, including attributes or claims.
- **`proof`**: Contains cryptographic proof ensuring the authenticity and integrity of the credential.

#### **Purpose**  
The W3C context ensures that all participants (issuers, verifiers, and holders) interpret the credential consistently. It acts as a bridge between JSON-LD data and a semantic vocabulary, enabling interoperability across systems.

#### **Example Usage**

```json
{
  "@context": "https://www.w3.org/2018/credentials/v1",
  "type": ["VerifiableCredential"],
  "issuer": "did:example:123",
  "issuanceDate": "2025-01-01T12:00:00Z",
  "credentialSubject": {
    "id": "did:example:456",
    "name": "John Doe"
  },
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2025-01-01T12:00:00Z",
    "proofPurpose": "assertionMethod",
    "proofValue": "eyJhbGciOiJF...",
    "verificationMethod": "did:example:123#key-1"
  }
}
```

### 2. DID Context

#### **Description** 
The `@context` field in a DID document defines the semantic and structural framework of the document. It provides the necessary vocabulary and standards to interpret the DID document correctly. For example:

- DID Core Context (https://www.w3.org/ns/did/v1): This includes the base specification for creating, resolving, and interacting with DIDs.

- Cryptographic Contexts (e.g., https://w3id.org/security/suites/bls12381-2020/v1): These define the cryptographic signature suites and key types used in the document, enabling interoperability for specific cryptographic operations.

By including these contexts, the DID document can be validated and understood universally.

#### **Usage in DID Well-Known**

The DID well-known mechanism makes it possible to host and discover a DID document on a web domain by placing it at a predefined location: `/.well-known/did.json`. This location is consistent across domains, making it easy for applications to locate and retrieve the DID document.

#### **Example Usage**

Let’s break down a sample DID well-known document hosted at https://example.com/.well-known/did.json:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/bls12381-2020/v1"
  ],
  "id": "did:web:example.com",
  "verificationMethod": [
    {
      "id": "did:web:example.com#key-1",
      "type": "Bls12381G2Key2020",
      "controller": "did:web:example.com",
      "publicKeyBase58": "H3C2..."
    }
  ],
  "authentication": [
    "did:web:example.com#keys-1"
  ],
  "assertionMethod": [
    "did:web:example.com#keys-1"
  ],
  "capabilityInvocation": [
    "did:web:example.com#keys-1"
  ],
  "capabilityDelegation": [
    "did:web:example.com#keys-1"
  ]
}
```

#### **Key Components**

- **`@context`**: Includes the base DID Core context (https://www.w3.org/ns/did/v1) for defining the structure. Adds cryptographic signature suite context (https://w3id.org/security/suites/bls12381-2020/v1) to support specific key types and signature methods.
- **`id`**: Defines the DID itself, in this case, did:web:example.com, associating the decentralized identifier with the domain example.com.
- **`verificationMethod`**: Lists the cryptographic keys that the DID controller uses to prove ownership or to sign data. Each key includes details such as type (e.g., Bls12381G2Key2020), its controller, and the public key (publicKeyBase58).
- **`authentication, assertionMethod, capabilityInvocation, and capabilityDelegation`**: Specify the operations that the DID controller can perform, such as authentication and delegating capabilities.

### 3. Credential Status: Bitstring Context

#### **URI**  
[https://w3id.org/vc/status-list/2021/v1](https://w3id.org/vc/status-list/2021/v1) - This context is used to define and validate the status of a credential within a revocation list or a similar structure.

#### **Description** 

The Credential Status Bitstring Context provides a mechanism to represent and manage the revocation status of Verifiable Credentials (VCs) efficiently. It uses a **bitstring-based approach**, where each bit represents the status of a specific credential.

#### **Example Usage**

```json
"credentialStatus": {
  "id": "https://example.com/credentials/status/3#94567",
  "type": "StatusList2021Entry",
  "statusPurpose": "revocation",
  "statusListIndex": "94567",
  "statusListCredential": "https://example.com/credentials/status/3"
}
```

#### **Explanation of Fields**

- **`id`**: A unique identifier for the credential status. Combines the statusListCredential with the index (#94567).
- **`type`**: Defines the type of status entry as StatusList2021Entry.
- **`statusPurpose`**: Indicates the purpose of the status entry. Common purposes include revocation (to signal whether the credential has been revoked).
- **`statusListIndex`**: Refers to the specific bit position in the associated status list. In this example, it’s the 94567th bit.
- **`statusListCredential`**: Links to the status list credential (e.g., a list that defines the revocation or suspension status of credentials). This document contains the bitstring and additional metadata.

#### **How It Works**
- Status List Credential: A status list credential is a Verifiable Credential that contains a bitstring representing the status of multiple credentials. Each bit in the bitstring corresponds to a credential's status (e.g., 0 = valid, 1 = revoked).

- Credential Status Check: To verify a credential's status, a verifier fetches the statusListCredential from the provided URI (https://example.com/credentials/status/3). The statusListIndex determines the relevant bit in the bitstring.

- Efficient Revocation: This approach allows for efficient updates to credential status without altering the credential itself.

## Customized Contexts

This section explains the usage of custom contexts that we have created, including transferableRecords, renderMethod, and attachments, in the TrustVC framework. These contexts enhance the functionality and flexibility of Verifiable Credentials, enabling tailored solutions for diverse applications.

### 1. Transferable Records Context (Custom credentialStatus)

#### **URI**  
[https://trustvc.io/context/transferable-records-context.json](https://trustvc.io/context/transferable-records-context.json) - The `TransferableRecords` context defines credentials that can be tokenized and registered on a blockchain network, facilitating secure and transparent transferability.

#### **Example Usage**

```json
"credentialStatus": {
  "type": "TransferableRecords",
  "tokenNetwork": {
    "chain": "MATIC",
    "chainId": "80002"
  },
  "tokenRegistry": "0xH3C2..."
}
```

####  **Field Details**
- **`type`**: Defines the status type (TransferableRecords).
- **`tokenNetwork`**: Specifies the blockchain details:
- **`chain`**: Blockchain network name (e.g., MATIC).
- **`chainId`**: Blockchain ID (e.g., 80002 for Amoy network).
- **`tokenRegistry`**: Address of the token registry contract.

### 2. Render Method Context

#### **URI**
[https://trustvc.io/context/render-method-context.json](https://trustvc.io/context/render-method-context.json) - The `renderMethod` context provides a mechanism for defining custom render methods within verifiable credentials. It enables issuers to customize how credentials are visually presented, enhancing their usability and ensuring they are displayed consistently across applications.

#### **Example Usage**

```json
"renderMethod": [
    {
      "id": "https://localhost:3000/renderer",
      "type": "EMBEDDED_RENDERER",
      "templateName": "BILL_OF_LADING"
    }
]
```

####  **Field Details**
- **`id`**: Specifies the unique identifier for the render method, often pointing to a service or endpoint responsible for rendering the credential.
- **`type`**: Defines the type of renderer being used (e.g., EMBEDDED_RENDERER), indicating how the credential will be processed and displayed.
- **`templateName`**: Refers to a predefined template that will dictate the visual layout or structure of the credential (e.g., BILL_OF_LADING template for a shipping document).

### 3. Attachments Context

#### **URI**
[https://trustvc.io/context/attachments-context.json](https://trustvc.io/context/attachments-context.json) - The `attachments` context enables the inclusion of attachments within verifiable credentials, allowing issuers to add supplementary information or evidence. These attachments can include external or inline data, such as documents or images, enhancing the depth and utility of the credential.

#### **Example Usage**

```json
"attachments": [
    {
      "data": "BASE64_ENCODED_FILE",
      "filename": "sample1.pdf",
      "mimeType": "application/pdf"
    },
    {
      "data": "BASE64_ENCODED_IMAGE",
      "filename": "image1.png",
      "mimeType": "image/png"
    }
]
```

####  **Field Details**
- **`data`**: The base64-encoded content of the attachment, allowing inline inclusion of files or resources.
- **`filename`**: The name of the file, helping users identify the type of attachment included in the credential.
- **`mimeType`**: The MIME type of the attachment, indicating its format (e.g., application/pdf for PDFs, image/png for PNG images).

This setup provides a straightforward way to include additional data as part of a credential, enhancing its value and usability in various contexts.
