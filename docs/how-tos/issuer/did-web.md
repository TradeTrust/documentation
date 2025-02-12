---
id: did-web
title: W3C did:web
sidebar_label: Issuer method W3C did:web
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

## Overview

`did:web` is a Decentralized Identifier (DID) method that utilizes existing web infrastructure. This method enables organizations to represent their identifiers through their web domains without requiring a blockchain. The `did:web` method follows the [`did:web` specification](https://w3c-ccg.github.io/did-method-web/) and leverages standard HTTPS and DNS infrastructure for DID resolution.

When working with TradeTrust documents, the `did:web` method's public key is used to validate the authenticity of any TradeTrust W3C signed document. This verification step is essential as it confirms the document's integrity by checking the digital signatures using the issuer's public key from their DID document. Since TradeTrust relies on these DID documents for verification, maintaining high availability of your `did:web` endpoint is critical - any downtime could prevent others from verifying your documents.

## How `did:web` Works

1.  `did:web` uses standard web domain names to create DIDs in the format: `did:web:example.com`
2.  The method resolves DIDs by converting them into standard HTTPS URLs.
3.  The DID Document is hosted at a well-known HTTPS endpoint on the domain.

## Requirements

- A web domain that you control.
- Ability to host files on your web server.
- HTTPS enabled on your domain.
  - Ensure your domain has a valid SSL certificate.
  - Set up proper CORS headers for cross-origin requests.

## Setting up `did:web`

### Create DID Document

Before you begin, ensure you have Node.js installed on your system.

<Tabs>
  <TabItem value="cli" label="Using CLI (Recommended)" default>

    1. Install the CLI globally:

    ```bash
    npm install -g @trustvc/w3c-cli
    ```

    2. Generate a key pair:

    ```bash
    w3c-cli key-pair
    ```
    Output:
    ```
    ? Please select an encryption algorithm: Bls12381G2Key2020
    ? Please enter a seed in base58 format (optional):
    ? Please specify a directory to save your key file (optional): .
    File written successfully to ./keypair.json
    ```

    3. Generate the DID document:

    ```bash
    w3c-cli did
    ```
    Output:
    ```
    ? Please enter the path to your key pair JSON file: ./keypair.json
    ? Please enter your domain for hosting the did-web public key (e.g.,
    https://example.com/.wellknown/did.json): https://example.com/.wellknown/did.json
    ? Please specify a directory path to save the DID token file (optional): .
    File written successfully to ./wellknown.json
    File written successfully to ./didKeyPairs.json
    ```

  </TabItem>

  <TabItem value="code" label="Using Code">

    1. Install the package:

    ```bash
    npm install @trustvc/w3c-issuer
    ```

    2. Create a script to generate the DID:

    ```typescript
    import { generateKeyPair, issueDID, VerificationType } from "@trustvc/w3c-issuer";

    const main = async () => {
      // Generate a key pair
      const keyPair = await generateKeyPair({
        type: VerificationType.Bls12381G2Key2020,
      });

      // Generate DID document
      const issuedDidWeb = await issueDID({
        domain: "example.com",
        ...keyPair,
      });

      // Access the DID document
      console.log(JSON.stringify(issuedDidWeb.wellKnownDid, null, 2));

      // Store the key pairs securely
      console.log("Key pairs:", issuedDidWeb.didKeyPairs);
    };

    main();
    ```

    > **Important**: Always securely store the generated key pairs (`didKeyPairs`). They are required for signing Verifiable Credentials.

  </TabItem>
</Tabs>

### Host the Document

1.  Place the generated DID document at `/.well-known/did.json` on your web server.
2.  Configure your web server to:
    - Serve the file over HTTPS.
    - Set appropriate CORS headers.
    - Set proper content-type headers (`application/json`).

### Example DID Document

```json
{
  "id": "did:web:example.com",
  "verificationMethod": [
    {
      "type": "Bls12381G2Key2020",
      "id": "did:web:example.com#keys-1",
      "controller": "did:web:example.com",
      "publicKeyBase58": "..."
    }
  ],
  "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/bls12381-2020/v1"],
  "authentication": ["did:web:example.com#keys-1"],
  "assertionMethod": ["did:web:example.com#keys-1"],
  "capabilityInvocation": ["did:web:example.com#keys-1"],
  "capabilityDelegation": ["did:web:example.com#keys-1"]
}
```

## Adding Keys to an Existing `did:web`

:::important Prerequisites
Before adding new keys:

- Your `did:web` document must be hosted and publicly accessible
- The CLI or code will fetch the existing DID document and append the new key-pair
- Ensure you have access to update the hosted document after modification
  :::

### Adding Multiple Keys

<Tabs>
  <TabItem value="cli" label="Using CLI" default>

    1. Generate a new key pair:
    ```bash
    w3c-cli key-pair
    ```
    Output:
    ```
    ? Please select an encryption algorithm: Bls12381G2Key2020
    ? Please enter a seed in base58 format (optional):
    ? Please specify a directory to save your key file (optional): .
    File written successfully to ./keypair.json
    ```

    2. Add the new key to your existing `did:web`, providing the same `did:web`:
    ```bash
    w3c-cli did
    ```
    Output:
    ```
    ? Please enter the path to your key pair JSON file: ./keypair.json
    ? Please enter your domain for hosting the did-web public key (e.g.,
    https://example.com/.wellknown/did.json): https://example.com/.wellknown/did.json
    ? Please specify a directory path to save the DID token file (optional): .
    File written successfully to ./wellknown.json
    File written successfully to ./didKeyPairs.json
    ```

  </TabItem>

  <TabItem value="code" label="Using Code">
    1. Install the package:
    ```bash
    npm install @trustvc/w3c-issuer
    ```

    2. Create a script to generate and add a new key:
    ```typescript
    import { generateKeyPair, issueDID, VerificationType } from "@trustvc/w3c-issuer";

    const addNewKey = async () => {
      // Generate a new key pair
      const newKeyPair = await generateKeyPair({
        type: VerificationType.Bls12381G2Key2020,
      });

      // Issue new DID document with additional key
      const updatedDid = await issueDID({
        domain: "example.com",
        ...newKeyPair,
      });

      console.log("Updated DID document:", JSON.stringify(updatedDid.wellKnownDid, null, 2));
      console.log("New key pair to store:", updatedDid.didKeyPairs);
    };

    addNewKey();
    ```

  </TabItem>
</Tabs>

:::important
After generating the updated DID document, you'll need to deploy it to your web server to replace the existing one.
:::

### Example DID Document with Multiple Keys

```json
{
  "id": "did:web:example.com",
  "verificationMethod": [
    {
      "type": "Bls12381G2Key2020",
      "id": "did:web:example.com#keys-1",
      "controller": "did:web:example.com",
      "publicKeyBase58": "..."
    },
    {
      "type": "Bls12381G2Key2020",
      "id": "did:web:example.com#keys-2",
      "controller": "did:web:example.com",
      "publicKeyBase58": "..."
    }
  ],
  "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/bls12381-2020/v1"],
  "authentication": ["did:web:example.com#key-1", "did:web:example.com#key-2"],
  "assertionMethod": ["did:web:example.com#key-1", "did:web:example.com#key-2"],
  "capabilityInvocation": ["did:web:example.com#key-1", "did:web:example.com#key-2"],
  "capabilityDelegation": ["did:web:example.com#key-1", "did:web:example.com#key-2"]
}
```

### Use Cases for Multiple Keys

1. **Key Rotation**: Maintain multiple keys to facilitate smooth key rotation
2. **Different Purposes**: Use different keys for different types of operations
3. **Backup Keys**: Have backup keys ready in case primary keys are compromised

## Managing Multiple `did:web` Identifiers

You can host multiple `did:web` identifiers on a single domain by using paths in your DID identifier. This allows organizations to manage multiple DIDs under the same domain.

### Path-based `did:web` format

The format for path-based `did:web` is:

```
did:web:<domain-name>:<path>
```

### Examples

1. **Root Domain DID**:

   ```
   did:web:example.com
   ```

   Document location: `https://example.com/.well-known/did.json`

2. **Subdirectory DID**:

   ```
   did:web:example.com:department-a
   ```

   Document location: `https://example.com/department-a/did.json`

3. **Deep Path DID**:
   ```
   did:web:example.com:users:alice
   ```
   Document location: `https://example.com/users/alice/did.json`

### Setting Up Path-based DIDs

<Tabs>
  <TabItem value="cli" label="Using CLI" default>

    ```bash
    # Generate DID for a specific path
    w3c-cli did
    ```

  </TabItem>
  <TabItem value="code" label="Using Code">

    ```typescript
    const issuedDidWeb = await issueDID({
      domain: "example.com/department-a",
      ...keyPair
    });
    ```

  </TabItem>
</Tabs>

### Directory Structure Example

```
example.com/
├── .well-known/
│   └── did.json              # Root DID
├── department-a/
│   └── did.json             # Department A's DID
├── department-b/
│   └── did.json             # Department B's DID
└── users/
    ├── alice/
    │   └── did.json         # Alice's DID
    └── bob/
        └── did.json         # Bob's DID
```

### Use Cases

| **Organizational Structure**                   | **User Management**      | **Environment Separation** |
| ---------------------------------------------- | ------------------------ | -------------------------- |
| 📂 Different departments having their own DIDs | 🔑 Individual user DIDs  | 🛠️ Development DIDs        |
| 👥 Team-specific DIDs                          | 👔 Role-based DIDs       | 🧪 Staging DIDs            |
| 📋 Project-based DIDs                          | ⚙️ Service-specific DIDs | 🚀 Production DIDs         |

## Security Considerations

### Private Key Management

- **Key Separation**

  - Maintain separate signing keys for different document types
  - Use distinct keys for different departments or teams
  - Keep development and production keys strictly separated

- **Key Rotation**

  - Establish regular key rotation schedules
  - Maintain overlap period during rotation for smooth transition
  - Document key expiry and rotation procedures

- **Active Key Security**
  - Use secure key management services that support high-frequency signing
  - Implement key access audit trails for compliance
  - Set up automated key usage monitoring and alerts

> Note: Since these keys are used frequently for document signing, ensure your application has appropriate access controls and authentication mechanisms to access the keys while maintaining security.

### DID Document Hosting

- **HTTPS Infrastructure**
  - Configure automatic SSL/TLS certificate renewal
  - Enable CORS only for required origins
  - Set up proper caching with cache-control headers

### Document Access Control

- **Change Management**
  - Implement version control for DID documents
  - Establish a review process for document changes
  - Set up automated validation checks
  - Maintain an audit trail of all modifications
