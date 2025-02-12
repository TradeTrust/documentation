---
id: did-web
title: W3C DID:WEB
sidebar_label: Issuer method W3C DID:WEB
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

## Overview

DID:WEB is a simple and practical method for creating Decentralized Identifiers (DIDs) using existing web infrastructure. This method allows organizations to leverage their existing web domains to create verifiable DIDs without the need for a blockchain. For more details, refer to the [DID:WEB specification](https://w3c-ccg.github.io/did-method-web/).

## How `DID:WEB` Works

1. DID:WEB uses standard web domain names to create DIDs in the format: `did:web:example.com`
2. The method resolves DIDs by converting them into standard HTTPS URLs
3. The DID Document is hosted at a well-known HTTPS endpoint on the domain

## Requirements

- A web domain that you control
- Ability to host files on your web server
- HTTPS enabled on your domain

## Setting up `DID:WEB`

### 1. Prepare Your Domain

- Ensure your domain has a valid SSL certificate
- Set up proper CORS headers for cross-origin requests

### 2. Create DID Document

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

### 3. Host the Document

- Place the DID document at: `/.well-known/did.json`
- Ensure it's accessible via HTTPS

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

## Adding Keys to an Existing `DID:WEB`

:::important Prerequisites
Before adding new keys:

- Your DID:WEB document must be hosted and publicly accessible
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

    2. Add the new key to your existing DID:WEB, providing the same did:web:
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
</Tabs>

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

## Having more than 1 `DID:WEB`

You can host multiple DID:WEB identifiers on a single domain by using paths in your DID identifier. This allows organizations to manage multiple DIDs under the same domain.

### Path-based `DID:WEB` format

The format for path-based DID:WEB is:
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

1. **Organizational Structure**
   - Different departments having their own DIDs
   - Team-specific DIDs
   - Project-based DIDs

2. **User Management**
   - Individual user DIDs
   - Role-based DIDs
   - Service-specific DIDs

3. **Environment Separation**
   - Development DIDs
   - Staging DIDs
   - Production DIDs

## Security Considerations

- Keep your private keys secure and never expose them
- Regularly update your SSL certificates
- Implement proper access controls on your web server
- Monitor for unauthorized changes to your DID document

## Benefits
 
1. Simple to implement using existing web infrastructure
2. No blockchain requirements
3. Leverages well-understood security properties of DNS and HTTPS
4. Easy to update and maintain

## Limitations

1. Relies on DNS and certificate authorities
2. Domain ownership required
3. Centralized control point
4. Web server must remain available

## Best Practices

1. Use strong cryptographic keys
2. Implement proper backup procedures
3. Regular security audits
4. Monitor domain and SSL certificate expiration
5. Keep documentation and implementations up to date
