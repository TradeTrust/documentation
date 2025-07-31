---
id: create-w3c-document
title: How to create W3C VC Document
sidebar_label: How to create W3C VC Document
---

# How to create W3C VC Document

This guide demonstrates how to create a complete W3C VC document using TradeTrust. The process covers everything from key generation and DID setup to document creation, signing, minting for transferability, and verification.

## Prerequisites

Before proceeding with this tutorial, ensure you have completed the following steps:

1. **Generate BBS keypair and host DID:WEB**: Follow the [DID:WEB guide](/docs/how-tos/issuer/did-web/) to generate your BBS key pairs and set up DID:WEB hosting.
2. **Set up document revocation**: Configure bit string revocation following the [bit string guide](/docs/how-tos/bitstring/).
3. **Deploy Token Registry**: Deploy a token registry contract for transferable documents using the [token registry deployment guide](/docs/tutorial/creator#73-create-a-script-to-deploy-a-token-registry-contract).
4. **Document verification setup**: Familiarize yourself with the [document verification process](/docs/how-tos/verifydocument/).

## Tutorial

### 1. Setup Dependencies

First, create a new project and install the necessary dependencies:

```bash
mkdir w3c-document-demo
cd w3c-document-demo
npm init -y
```

Update the `package.json` file:

```json
{
  "name": "w3c-document-demo",
  "version": "1.0.0",
  "description": "Demo for creating W3C VC documents",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node src/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@trustvc/trustvc": "^1.8.0",
    "dotenv": "^17.0.0",
    "ethers": "^6.13.4"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "ts-node": "^10.9.2",
    "tsc-alias": "^1.8.16",
    "typescript": "^5.8.3",
    "nodemon": "^3.1.9"
  }
}
```

Install the dependencies:

```bash
npm install
```

Initialize TypeScript configuration:

```bash
npx tsc --init
```

Update the generated `tsconfig.json` file with the following configuration:

```json
{
  "compilerOptions": {
    ...
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "./dist",
    ...
  },
  ...
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. Key Pair and Environment Configuration

After completing the [first prerequisite](/docs/how-tos/issuer/did-web/) (generating BBS keypair and hosting DID:WEB), you should have **two pieces of information**:

1. **DID Document** - A JSON document that describes your decentralized identifier
2. **Key Pair** - The cryptographic keys used for signing documents

**Example of what you'll get:**

DID Document:
```json
{
  "id": "did:web:<your_domain>",
  "verificationMethod": [
    {
      "type": "Bls12381G2Key2020",
      "id": "did:web:<your_domain>#keys-1",
      "controller": "did:web:<your_domain>",
      "publicKeyBase58": "<your_public_key_base58>"
    }
  ],
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/bls12381-2020/v1"
  ],
  "authentication": ["did:web:<your_domain>#keys-1"],
  "assertionMethod": ["did:web:<your_domain>#keys-1"],
  "capabilityInvocation": ["did:web:<your_domain>#keys-1"],
  "capabilityDelegation": ["did:web:<your_domain>#keys-1"]
}
```

Key Pair:
```json
{
  "id": "did:web:<your_domain>#keys-1",
  "type": "Bls12381G2Key2020",
  "controller": "did:web:<your_domain>",
  "seedBase58": "<your_seed_base58>",
  "privateKeyBase58": "<your_private_key_base58>",
  "publicKeyBase58": "<your_public_key_base58>"
}
```

Now that you have our key pair object, we **convert it to a string format** before storing it in our environment file. Create a `.env` file with the following value:


```bash
# Your wallet private key for blockchain transactions
WALLET_PRIVATE_KEY=<your_wallet_private_key>

# Domain and did key pair
DOMAIN=<your_domain>
DID_KEY_PAIRS='{"id":"did:web:<your_domain>#keys-1","type":"Bls12381G2Key2020","controller":"did:web:<your_domain>","seedBase58":"<your_seed_base58>","privateKeyBase58":"<your_private_key_base58>","publicKeyBase58":"<your_public_key_base58>"}'

# Network ID (80002 for Amoy testnet)
NET=80002

# Optional depending on network selected (required for token registry deployment)
STABILITY_API_KEY=
STABILITY_TESTNET_API_KEY=
INFURA_API_KEY=
```

> **Note**: The API keys above are required for deploying the token registry on different networks. You can find detailed instructions on how to setup these API keys in the [network configuration guide](/docs/4.x/topics/advanced/additional-network-metamask-guide/#fill-in-the-network-configuration-for-the-new-network-as-required).

### 3. Document Revocation (Bit String)

In TradeTrust, the Bitstring Status List (also called StatusList2021) is used for revocation or suspension of Verifiable Credentials (VCs) without modifying the credentials themselves. This mechanism allows issuers to efficiently manage the status of multiple credentials using a single, compact, and publicly hosted bitstring.

**When to use Bitstring Revocation:**
- **Off-chain revocation**: This is an off-chain mechanism, meaning revocation status is not stored on the blockchain.
- **Non-transferable documents**: Ideal when your use case involves creating verifiable credentials that don't need to be transferable (not minted as NFTs).
- **Flexible revocation**: Perfect when you want the ability to revoke documents later without the overhead of blockchain transactions.
- **Cost-effective**: No gas fees required for revocation operations.

For detailed instructions on setting up document revocation using bitstring status lists, follow the [Bitstring Status List guide](/docs/how-tos/bitstring).

### 4. Deploy Token Registry

If you want to make your W3C documents **transferable** (tokenized as NFTs), you need to deploy a **Token Registry** contract to the blockchain. The token registry enables us mint the token ID obtained from the signed document as an NFT, making the document ownership transferable between parties.

> **Note**: This step is only required if you plan to mint your documents for transferability. You can create and sign W3C documents without a token registry.

To deploy your token registry, follow the detailed guide: [Create a script to deploy a token registry contract](/docs/tutorial/creator/#73-create-a-script-to-deploy-a-token-registry-contract)

After successfully deploying the token registry, you will receive a **contract address**. Update your `.env` file with this address:

```bash
# Your wallet private key for blockchain transactions
WALLET_PRIVATE_KEY=<your_wallet_private_key>

# Domain and did key pair
DOMAIN=<your_domain>
DID_KEY_PAIRS='{"id":"did:web:<your_domain>#keys-1","type":"Bls12381G2Key2020","controller":"did:web:<your_domain>","seedBase58":"<your_seed_base58>","privateKeyBase58":"<your_private_key_base58>","publicKeyBase58":"<your_public_key_base58>"}'

# Network ID (80002 for Amoy testnet)
NET=80002

# Optional depending on network selected (required for token registry deployment)
STABILITY_API_KEY=
STABILITY_TESTNET_API_KEY=
INFURA_API_KEY=

# Token registry address (obtained after deployment)
TOKEN_REGISTRY_ADDRESS=<your_token_registry_address>
```

### 5. Creating a W3C Verifiable Credential Using Document Builder

Now we'll use TrustVC's **DocumentBuilder** to create a W3C Verifiable Credential. The DocumentBuilder provides a clean, intuitive way for constructing verifiable credentials that comply with W3C standards while integrating seamlessly with TradeTrust's ecosystem.

Create a new file `src/utils/createW3CDocument.ts` with the document creation logic:

```typescript
require('dotenv').config();
import { DocumentBuilder, CHAIN_ID, SUPPORTED_CHAINS, W3CTransferableRecordsConfig } from '@trustvc/trustvc';

export const createW3CDocument = async () => {
  try {
    // Configuration
    const CHAINID: CHAIN_ID = process.env.NET as CHAIN_ID ?? CHAIN_ID.amoy;
    const CHAININFO = SUPPORTED_CHAINS[CHAINID];
    const RPC_PROVIDER_URL = CHAININFO.rpcUrl;

    // Prepare the document
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 3);
    const credentialStatus: W3CTransferableRecordsConfig = {
      chain: CHAININFO.currency,
      chainId: Number(CHAINID),
      tokenRegistry: process.env.TOKEN_REGISTRY_ADDRESS!,
      rpcProviderUrl: RPC_PROVIDER_URL!
    };

    console.log("Creating document...")

    // Create a base document with the required context (using Bill of Lading as an example)
    const baseDocument = {
      "@context": [
        "https://trustvc.io/context/bill-of-lading.json",
        "https://trustvc.io/context/attachments-context.json",
      ],
    };

    const document = new DocumentBuilder(baseDocument);

    // Add transferable record configuration
    document.credentialStatus(credentialStatus);
    // Add the actual document content/data about the asset
    document.credentialSubject({
      BillOfLading: {
        billOfLadingName: "name",
      },
    });
    // Set when this document expires
    document.expirationDate(expirationDate);
    // Define how the document should be rendered visually (template and renderer)
    document.renderMethod({
      id: "https://generic-templates.tradetrust.io",
      type: "EMBEDDED_RENDERER",
      templateName: "BILL_OF_LADING"
    }); 
    
    return document;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};
```

### 6. Signing the Document

Next, we need to sign our document to create a verifiable credential. We do this by calling the `sign` method on our DocumentBuilder instance and passing the DID key pair. Once signed, the document will include a **proof object** that contains cryptographic evidence of the document's authenticity.

The proof object includes:
- **type**: The signature algorithm used (e.g., `BbsBlsSignature2020`)
- **created**: Timestamp of when the signature was created
- **proofPurpose**: The purpose of the proof (e.g., `assertionMethod`)
- **proofValue**: The actual cryptographic signature
- **verificationMethod**: The DID identifier used to verify the signature

This proof allows anyone to cryptographically verify that the document was issued by the holder of the DID and hasn't been tampered with.

Create a new file `src/utils/signW3CDocument.ts` with the signing logic:

```typescript
require("dotenv").config();
import { DocumentBuilder } from "@trustvc/trustvc";

export const signDocument = async (document: DocumentBuilder) => {
  try {
    const keyPair = process.env.DID_KEY_PAIRS!;
    const DID_KEY_PAIRS = JSON.parse(keyPair.replace(/\\(?=["'])/g, ""));

    // Sign the document
    console.log("Signing document...");
    const signedW3CDocument = await document.sign(DID_KEY_PAIRS);
    console.log("Document signed successfully", signedW3CDocument);

    return signedW3CDocument;
  } catch (error) {
    console.error("Error signing document:", error);
    throw error;
  }
};
```

### 7. Minting Document for Transferability

Now that we have a signed the W3C verifiable credential, we can **mint** a token that represents ownership of the document. We obtain a tokenId from the signed document and mint it as an NFT on the blockchain.

We'll use TrustVC's **mint method** for minting a token.

Create a new file `src/utils/mintToken.ts` with the minting logic:

```typescript
import {
  getTokenId,
  CHAIN_ID,
  SUPPORTED_CHAINS,
  mint,
  SignedVerifiableCredential,
} from "@trustvc/trustvc";
import { ethers, Wallet } from "ethers";

export const mintDocument = async (
  signedW3CDocument: SignedVerifiableCredential,
  beneficiaryAddress: string,
  holderAddress: string,
  remarks = ""
) => {
  try {
    const CHAINID: CHAIN_ID = (process.env.NET as CHAIN_ID) ?? CHAIN_ID.amoy;
    const CHAININFO = SUPPORTED_CHAINS[CHAINID];
    const TOKEN_REGISTRY_ADDRESS = process.env.TOKEN_REGISTRY_ADDRESS!;

    // Generate token ID from the signed document
    const tokenId = getTokenId(signedW3CDocument!);
    
    const unconnectedWallet = new Wallet(process.env.WALLET_PRIVATE_KEY!);
    let provider;
    if (ethers.version.startsWith("6.")) {
      provider = new (ethers as any).JsonRpcProvider(CHAININFO.rpcUrl);
    } else if (ethers.version.includes("/5.")) {
      provider = new (ethers as any).providers.JsonRpcProvider(
        CHAININFO.rpcUrl
      );
    }
    const signer = unconnectedWallet.connect(provider);

    let transactionOptions = {};
    const { gasStation } = CHAININFO;
    if (gasStation) {
      try {
        const gasFees = await gasStation();
        const { maxFeePerGas, maxPriorityFeePerGas } = gasFees ?? {};
        transactionOptions = {
          maxFeePerGas: maxFeePerGas?.toString() ?? 0,
          maxPriorityFeePerGas: maxPriorityFeePerGas?.toString() ?? 0,
        };
      } catch (error) {
        console.warn("Failed to fetch gas prices", error);
      }
    }

    console.log("Minting document...");
    let tx = await mint(
      {
        tokenRegistryAddress: TOKEN_REGISTRY_ADDRESS,
      },
      signer,
      {
        beneficiaryAddress,
        holderAddress,
        tokenId,
        remarks,
      },
      {
        id: signedW3CDocument?.id!,
        ...transactionOptions,
      }
    );

    console.log("Transaction submitted successfully", tx.hash);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error(error);
  }
};
```

### 8. Verifying the Document

After creating and signing your W3C document, you can verify its authenticity and integrity. The verification process returns an array of verification fragments, each representing a different aspect of the document's validity.

Create a new file `src/utils/verifyDocument.ts` with the verification logic:

```typescript
require("dotenv").config();
import {
  verifyDocument,
  SignedVerifiableCredential,
  CHAIN_ID,
  SUPPORTED_CHAINS,
} from "@trustvc/trustvc";

export const verifyW3CDocument = async (
  signedDocument: SignedVerifiableCredential
) => {
  try {
    console.log("Starting document verification...");
    const CHAINID: CHAIN_ID = (process.env.NET as CHAIN_ID) ?? CHAIN_ID.amoy;
    const CHAININFO = SUPPORTED_CHAINS[CHAINID];
    const RPC_PROVIDER_URL = CHAININFO.rpcUrl;

    const verificationResult = await verifyDocument(signedDocument, {
      rpcProviderUrl: RPC_PROVIDER_URL,
    });

    return verificationResult;
  } catch (error) {
    console.error("Error verifying document:", error);
    throw error;
  }
};

```

The verification process checks multiple aspects of your document. To understand the different components of verification and what each fragment represents, refer to the [TradeTrust verification overview](https://docs.tradetrust.io/docs/introduction/key-components-of-tradetrust/w3c-vc/verifying-documents/overview), and the different [W3C verification fragments](https://docs.tradetrust.io/docs/tutorial/verifier#w3c-verifiers)

## Running the Complete Workflow

Now that we have all our functions ready, create a main file `src/index.ts` to orchestrate the complete workflow:

```typescript
import { DocumentBuilder, SignedVerifiableCredential } from "@trustvc/trustvc";
import { createW3CDocument } from "./utils/createW3CDocument";
import { signDocument } from "./utils/signW3CDocument";
import { mintDocument } from "./utils/mintToken";
import { verifyW3CDocument } from "./utils/verifyDocument";

require("dotenv").config();

const main = async () => {
 // Update the beneficiary and holder address
  const beneficiaryAddress = "";
  const holderAddress = "";

  const document: DocumentBuilder = await createW3CDocument();
  const signedDocument: SignedVerifiableCredential = await signDocument(
    document
  );
  await mintDocument(
    signedDocument,
    beneficiaryAddress,
    holderAddress,
    "document mint"
  );
  await verifyW3CDocument(signedDocument);
};

main();
```

> **Important**: 
> - **Update the addresses**: Replace the empty `beneficiaryAddress` and `holderAddress` with actual Ethereum addresses before running
> - **Token Registry Deployment**: Ensure your token registry has been deployed and the `TOKEN_REGISTRY_ADDRESS` is correctly set in your `.env` file, as this address is used during document creation

Run the complete workflow using:
```bash
npm run dev
```

## Troubleshooting

### Common Issues

1. **DID Key Pair Issues**: Ensure your DID key pairs are properly formatted and match your DID:WEB configuration
2. **Token Registry Not Found**: Verify that your token registry address is correct and deployed on the target network
3. **Insufficient Gas**: Check that your wallet has enough funds for transaction fees
4. **Network Connectivity**: Ensure your RPC endpoint is accessible and responsive
5. **Document Context Issues**: Verify that all required context URLs are accessible and valid

## Conclusion

You have successfully created a complete W3C Verifiable Credential document using TradeTrust. The document is now:

- ✅ Digitally signed using BBS+ signatures
- ✅ Minted as a transferable token on the blockchain
- ✅ Ready for verification and transfer
- ✅ Configured with proper rendering templates