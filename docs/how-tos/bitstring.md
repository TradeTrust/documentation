---
id: bitstring
title: Credential Status Management with Bitstring Status Lists
sidebar_label: Credential Status Management with Bitstring Status Lists
---

# Bitstring Status List

This guide explains how to manage the lifecycle of Verifiable Credentials (VCs) using the `@trustvc/trustvc` library. It covers the creation, hosting, and management of a credential status list that supports revocation or suspension using the **Bitstring Status List** method.

## Overview

The **Bitstring Status List** efficiently tracks the revocation/suspension state of VCs using a sequence of bits:

- Each bit corresponds to a credential in the list.
- 0 indicates the credential is valid (active).
- 1 indicates the credential is revoked or suspended.

This approach enables verifiers to determine the status of a credential without altering the original VC.

## Installation
To install the package, use:

```bash
npm install @trustvc/trustvc
```

## Creating a Credential Status List

### 1. Import Required Modules

```ts
import {
  createCredentialStatusPayload,
  CredentialStatusPurpose,
  StatusList,
} from '@trustvc/w3c-credential-status';
import { signCredential } from '@trustvc/w3c-vc';
```

### 2. Set Up Hosting URL and Status List

Pick a hosting URL for the status list:

```ts
const hostingUrl = 'https://example.com/credentials/status/3';
```

Initialize a new StatusList:

```ts
const credentialStatus = new StatusList({ length: 131072 }); // Default: 131,072 bits
```

### 3. Select the Status List Purpose

Choose between `revocation` or `suspension`:

```ts
const purpose: CredentialStatusPurpose = 'revocation';
```

### 4. Update the Status of an Index

Retrieve and modify the status of a specific index:

```ts
const index = 94567; // Example index
credentialStatus.setStatus(index, true); // true = revoked/suspended
```

### 5. Encode the Updated Status List

Compress and encode the bitstring:

```ts
const encodedList = await credentialStatus.encode();
```

### 6. Create and Sign the Credential Status VC

Create a Credential Status Payload:

```ts
const options = {
  id: hostingUrl,
  credentialSubject: {
    id: `${hostingUrl}#list`,
    type: 'StatusList2021',
    statusPurpose: purpose,
    encodedList,
  },
};

const keyPair = {
  id: 'did:web:example.com#keys-1',
  type: 'Bls12381G2Key2020',
  controller: 'did:web:example.com',
  privateKeyBase58: '<privateKeyBase58>',
  publicKeyBase58: '<publicKeyBase58>',
};

const credentialStatusVC = await createCredentialStatusPayload(options, keyPair);
console.log('Credential Status VC:', credentialStatusVC);
```

Sign the Credential Status VC:

```ts
const { signed, error } = await signCredential(credentialStatusVC, keyPair);
if (error) throw new Error(error);
console.log('Signed Credential Status VC:', signed);
```

## Updating the Credential Status List

### 1. Import Required Modules

```ts
import {
  createCredentialStatusPayload,
  fetchCredentialStatusVC,
  StatusList,
} from '@trustvc/w3c-credential-status';
import { signCredential } from '@trustvc/w3c-vc';
```

### 2. Fetch the Existing Credential Status VC

Retrieve the Credential Status VC from the hosting URL:

```ts
const hostingUrl = 'https://example.com/credentials/status/3';

let credentialStatusVC;
try {
  credentialStatusVC = await fetchCredentialStatusVC(hostingUrl);
} catch (err) {
  console.error('Invalid URL:', err);
  throw err;
}
```

### 3. Update the Status List

Decode the existing bitstring and update the status:

```ts
const statusList = await StatusList.decode({
  encodedList: credentialStatusVC.credentialSubject.encodedList,
});

const indexToUpdate = 94567; // Example index
statusList.setStatus(indexToUpdate, true); // true = revoked/suspended
```

### 4. Encode and Sign the Updated Status List

Re-encode the updated status list:

```ts
const encodedList = await statusList.encode();
```

Create and sign the updated Credential Status VC:

```ts
const credentialStatusPayload = await createCredentialStatusPayload(
  {
    id: hostingUrl,
    credentialSubject: {
      id: `${hostingUrl}#list`,
      type: 'StatusList2021',
      statusPurpose: 'revocation',
      encodedList,
    },
  },
  keyPair,
);

const { signed, error } = await signCredential(credentialStatusPayload, keyPair);
if (error) throw new Error(error);
console.log('Updated Credential Status VC:', signed);
```

## Hosting the Credential Status List

When managing credential status using a bitstring-based Status List, the list must be hosted at a publicly accessible URL. This allows verifiers to fetch the list and verify the credential's status.

For the examples above, the Credential Status List is hosted at:
https://example.com/credentials/status/3

### How the Credential Status Looks in a Verifiable Credential

Here is an example of how the hosted Credential Status List is referenced in a Verifiable Credential (VC):

```json
"credentialStatus": {
  "id": "https://example.com/credentials/status/3#94567",
  "type": "StatusList2021Entry",
  "statusPurpose": "revocation",
  "statusListIndex": "94567",
  "statusListCredential": "https://example.com/credentials/status/3"
}
```

### Using the Hosted Credential Status List

To use the hosted Credential Status List in your Verifiable Credential:

- Replace the example values in the `credentialStatus` object with those relevant to your setup:

    - Update the `id`, `statusListIndex`, and `statusListCredential` fields with the appropriate values based on your hosted Credential Status List and the credential's specific entry.

- Include the `credentialStatus` object in your Verifiable Credential payload before signing.

By referencing a hosted Credential Status List, verifiers can efficiently check the validity of credentials while ensuring that no sensitive data is exposed directly in the VC itself.
