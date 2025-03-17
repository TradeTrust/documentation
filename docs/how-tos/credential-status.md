---
id: credential-status
title: Issuing W3C VCs
sidebar_label: Issuing W3C VCs
---

# Handling Different Credential Statuses in W3C VCs

This page guides you through signing and managing **W3C Verifiable Credentials (VCs)** with different `credentialStatus` configurations. Whether you're dealing with **transferable tokens**, **non-transferable bitstring status lists**, or **static credentials without a status**, this guide covers the necessary actions, from deploying token registries to signing and minting credentials.

**Each section includes**:

1. [Transferable W3C VC - Token Registry](#transferable-w3c-vc---token-registry)

   Learn how to sign the credential, and mint it on the blockchain.

2. [Non-Transferable W3C VC - Bitstring Status List](#non-transferable-w3c-vc---bitstring-status-list)

   Sign and manage credentials that utilize a `Bitstring status list`.

3. [Non-Status W3C VC](#non-status-w3c-vc)

   Sign credentials without requiring a `credentialStatus` field, perfect for permanent claims.

**For details on structuring your credential, refer to**:

- [Working with Contexts](/docs/how-tos/contexts.md)
- [Using Custom Contexts for "credentialSubject"](/docs/how-tos/credential-subject.md)

## Transferable W3C VC - Token Registry

To enable transferable credentials, a Token Registry is required. [See Deploying a Token Registry](/docs/how-tos/deployment#token-registry) for setup instructions.

**This section covers**:

- Signing a Verifiable Credential
- Minting the Credential as a Transferable Token

**Requirements**:

- Ethers.js v5 or v6
- A wallet with sufficient funds
- A supported network (e.g., Amoy, Sepolia, Polygon, etc.)
- Chain-specific gas fee estimation (if applicable)

### 1. Signing a Verifiable Credential

After deploying the token registry, create and sign a W3C Verifiable Credential (VC) referencing the Token Registry. For signing, we use `BbsBlsSignature2020`, which enables selective disclosure and maintains privacy when verifying credentials.

#### Deployment Code

```ts
import { signW3C, VerificationType } from "@trustvc/trustvc";

const rawDocument = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3c-ccg.github.io/citizenship-vocab/contexts/citizenship-v1.jsonld",
    "https://w3id.org/security/bbs/v1",
    "https://trustvc.io/context/transferable-records-context.json",
  ],
  credentialStatus: {
    type: "TransferableRecords",
    tokenNetwork: {
      chain: "MATIC",
      chainId: "80002",
    },
    tokenRegistry: "0xH3C2...", // Address of the Token Registry deployed
  },
  credentialSubject: {
    name: "TrustVC",
    birthDate: "2024-04-01T12:19:52Z",
    type: ["PermanentResident", "Person"],
  },
  expirationDate: "2029-12-03T12:19:52Z",
  issuer: "did:web:example.com",
  type: ["VerifiableCredential"],
  issuanceDate: "2024-04-01T12:19:52Z",
};

// Sign the credential
const signedDocument = await signW3C(rawDocument, {
  id: "did:web:example.com#keys-1",
  controller: "did:web:example.com",
  type: VerificationType.Bls12381G2Key2020,
  publicKeyBase58: "<publicKeyBase58>",
  privateKeyBase58: "<privateKeyBase58>",
});

console.log(`Signed Document: ${JSON.stringify(signedDocument, null, 2)}`);
```

### 2. Minting the Credential

After signing the Verifiable Credential (VC), the next step is minting it on the blockchain using the Token Registry. This process ensures the document is tokenized, allowing for on-chain verification and transferability.

#### Deployment Code

```ts
import { Wallet, ethers } from "ethers";
import { CHAIN_ID, SUPPORTED_CHAINS, getTokenId, encrypt, v5Contracts } from "@trustvc/trustvc";

// Set the chain
const chainId = CHAIN_ID.amoy; // Amoy test network
const CHAININFO = SUPPORTED_CHAINS[chainId];

// Values from previous steps
const tokenRegistryAddress = "<TOKEN_REGISTRY_ADDRESS>";
const signedDocument = "<SIGNED_DOCUMENT_FROM_STEP_1>";
const owner = "<OWNER_WALLET_ADDRESS>";
const holder = "<HOLDER_WALLET_ADDRESS>";
const tokenId = getTokenId(signedDocument as any);
const remarks = "<Optional remarks for minting>";

// Set up the wallet
const unconnectedWallet = new Wallet("<YOUR_PRIVATE_KEY>");
const provider = new ethers.JsonRpcProvider(CHAININFO.rpcUrl);
const wallet = unconnectedWallet.connect(provider);

// Get the Token Registry contract
const { TradeTrustToken__factory } = v5Contracts;
const tokenRegistry = new ethers.Contract(tokenRegistryAddress, TradeTrustToken__factory.abi, wallet);

// Encrypt remarks (optional)
const encryptedRemarks = remarks ? encrypt(remarks, signedDocument.id) : "0x";

// Mint the tokenized document on-chain
let tx;
if (CHAININFO.gasStation) {
  const gasFees = await CHAININFO.gasStation();

  tx = await tokenRegistry.mint(owner, holder, tokenId, encryptedRemarks, {
    maxFeePerGas: gasFees.maxFeePerGas?.toBigInt() ?? 0,
    maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas?.toBigInt() ?? 0,
  });
} else {
  tx = await tokenRegistry.mint(owner, holder, tokenId, encryptedRemarks);
}

// Wait for the transaction to be confirmed
const receipt = await tx.wait();
console.log(`Document minted successfully! Transaction Hash: ${receipt.hash}`);
```

## Non-Transferable W3C VC - Bitstring Status List

For non-transferable W3C Verifiable Credentials (VCs), we use a Bitstring Status List to manage credential status efficiently. This allows issuers to update credential revocation status without modifying the original credential.

🔗 Learn more: [Credential Status Management with Bitstring Status Lists](/docs/how-tos/bitstring)

### 1. Signing the Credential

The following example demonstrates how to sign a VC using the Bitstring Status List. For signing, we use `BbsBlsSignature2020`, which enables selective disclosure and maintains privacy when verifying credentials.

```ts
import { signW3C, VerificationType } from "@trustvc/trustvc";

const rawDocument = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3c-ccg.github.io/citizenship-vocab/contexts/citizenship-v1.jsonld",
    "https://w3id.org/security/bbs/v1",
    "https://w3id.org/vc/status-list/2021/v1",
  ],
  credentialStatus: {
    id: "https://example.com/credentials/status/3#94567",
    type: "StatusList2021Entry",
    statusPurpose: "revocation",
    statusListIndex: "94567",
    statusListCredential: "https://example.com/credentials/status/3",
  },
  credentialSubject: {
    name: "TrustVC",
    birthDate: "2024-04-01T12:19:52Z",
    type: ["PermanentResident", "Person"],
  },
  expirationDate: "2029-12-03T12:19:52Z",
  issuer: "did:web:example.com",
  type: ["VerifiableCredential"],
  issuanceDate: "2024-04-01T12:19:52Z",
};

// Sign the credential
const signingResult = await signW3C(rawDocument, {
  id: "did:web:example.com#keys-1",
  controller: "did:web:example.com",
  type: VerificationType.Bls12381G2Key2020,
  publicKeyBase58: "<publicKeyBase58>",
  privateKeyBase58: "<privateKeyBase58>",
});

console.log(`Signed Document: ${JSON.stringify(signingResult)}`);
```

## Non-Status W3C VC

In some cases, a Verifiable Credential (VC) does not require a `credentialStatus` field. This means the credential is static and non-revocable, typically used for permanent claims like birth certificates, academic degrees, or identity proofs.

### 1. Signing the Credential

Below is an example of signing a VC without a credential status. For signing, we use `BbsBlsSignature2020`, which enables selective disclosure and maintains privacy when verifying credentials.

```ts
import { signW3C, VerificationType } from "@trustvc/trustvc";

const rawDocument = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3c-ccg.github.io/citizenship-vocab/contexts/citizenship-v1.jsonld",
    "https://w3id.org/security/bbs/v1",
  ],
  credentialSubject: {
    name: "TrustVC",
    birthDate: "2024-04-01T12:19:52Z",
    type: ["PermanentResident", "Person"],
  },
  expirationDate: "2029-12-03T12:19:52Z",
  issuer: "did:web:example.com",
  type: ["VerifiableCredential"],
  issuanceDate: "2024-04-01T12:19:52Z",
};

// Sign the credential
const signingResult = await signW3C(rawDocument, {
  id: "did:web:example.com#keys-1",
  controller: "did:web:example.com",
  type: VerificationType.Bls12381G2Key2020,
  publicKeyBase58: "<publicKeyBase58>",
  privateKeyBase58: "<privateKeyBase58>",
});

console.log(`Signed Document: ${JSON.stringify(signingResult)}`);
```
