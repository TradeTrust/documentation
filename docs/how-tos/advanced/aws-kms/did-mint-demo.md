---
id: kms-mint-demo
title: Mint Demo
sidebar_label: Minting tokens
---

This guide shows how to mint an NFT containing a W3C Verifiable Credential, using AWS KMS to securely sign the document.
Minting tokens in a secure environment often requires the use of hardware security modules (HSMs) like AWS KMS to safeguard private keys while allowing authorized applications to perform cryptographic operations.

> **IMPORTANT:** You must be careful about how you expose your secret key and access key. Always follow AWS security best practices.

## Prerequisites

Before proceeding with this tutorial, ensure you have completed the following steps:

1. Understand the [AWS KMS overview](overview)
2. [Create a key](create-key) in AWS KMS
3. Obtain [access keys](access-keys) for CLI, SDK, & API access
4. Familiarize yourself with the [DID signing demo](did-sign-demo)
5. Obtain a did key pair for signing the w3c document [Create DID key pair](/docs/tutorial/creator#72-create-a-script-to-generate-a-new-did-and-store-it-in-the-env-file)

## Tutorial

### 1. Setup Dependencies

First, create a new project and install the necessary dependencies:

```bash
mkdir aws-kms-mint-demo
cd aws-kms-mint-demo
npm init -y
```

Update the `package.json` file:
> **NOTE:** The AWS KMS library used in this tutorial requires ethers.js v5.
<br/>
```json
{
  "name": "aws-kms-mint-demo",
  "version": "1.0.0",
  "description": "Demo for minting tokens using AWS KMS",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@trustvc/trustvc": "^1.5.5",
    "ethers": "^5.8.0",
    "dotenv": "^17.0.0"
  }
}
```

Install the dependencies:

```bash
npm install
```

### 2. Initialize AWS KMS Signer

Create a `signer.js` file to modularize the AWS KMS signer initialization. This makes the signer reusable across your application:

```javascript
require("dotenv").config();
const { AwsKmsSigner } = require("@trustvc/trustvc");
const { ethers } = require("ethers");

const signer = new AwsKmsSigner(
  {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
    keyId: process.env.AWS_KEY_ID,
  },
  new ethers.JsonRpcProvider(process.env.RPC_URL)
);

module.exports = { signer };
```

### 3. Deploy Token Registry using KMS signer

Before minting tokens, we need to deploy a token registry smart contract to the blockchain. The token registry serves as the on-chain record keeper that maintains ownership information, facilitates transfers, and validates the tokens we mint.

Create a `deployRegistry.js` file with the following code:

```javascript
// deployRegistry.js - Module for deploying token registry
const {
  SUPPORTED_CHAINS,
  v5ContractAddress,
  v5Contracts,
  v5Utils,
} = require("@trustvc/trustvc");
const { ethers } = require("ethers");

const deployRegistry = async (signer, chainId) => {
  const CHAININFO = SUPPORTED_CHAINS[chainId];
  const walletAddress = await signer.getAddress();
  console.log("Deploying token registry with address:", walletAddress);

  const { TDocDeployer__factory } = v5Contracts;
  const { TokenImplementation, Deployer } = v5ContractAddress;
  const deployerContract = new ethers.Contract(
    Deployer[chainId],
    TDocDeployer__factory.abi,
    signer
  );

  const initParam = v5Utils.encodeInitParams({
    name: "DemoTokenRegistry",
    symbol: "DTR",
    deployer: walletAddress,
  });

  let tx;
  if (CHAININFO.gasStation) {
    const gasFees = await CHAININFO.gasStation();
    console.log("Gas fees:", gasFees);

    tx = await deployerContract.deploy(
      TokenImplementation[chainId],
      initParam,
      {
        maxFeePerGas: gasFees?.maxFeePerGas?.toBigInt() ?? 0,
        maxPriorityFeePerGas: gasFees?.maxPriorityFeePerGas?.toBigInt() ?? 0,
      }
    );
  } else {
    tx = await deployerContract.deploy(TokenImplementation[chainId], initParam);
  }

  const receipt = await tx.wait();
  let registryAddress;
  registryAddress = v5Utils.getEventFromReceipt(
    receipt,
    deployerContract.interface.getEventTopic("Deployment"),
    deployerContract.interface
  ).args.deployed;

  console.log("Token registry deployed at address:", registryAddress);
  return registryAddress;
};

module.exports = { deployRegistry };
```

After creating the deployment module, you can invoke the deployRegistry function with the signer and chain ID to deploy the registry. 
Make sure to take note of the registry address as it will be used for minting tokens.

### 4. Mint Token

After deploying a token registry, we can now mint a token. The following code creates a W3C verifiable credential document and mints it as a token on the blockchain:

```javascript
// Import necessary modules for minting
const { getTokenId, signW3C, CHAIN_ID, SUPPORTED_CHAINS, v5Contracts, encrypt } = require("@trustvc/trustvc");
const { signer } = require("./signer");
const { ethers } = require("ethers");

const mintToken = async () => {
    
  const CHAINID = CHAIN_ID.stabilitytestnet;
  const CHAININFO = SUPPORTED_CHAINS[CHAINID];
  const REGISTRY_ADDRESS = ""; // Replace with your token registry address obtained from previous step 
  const owner = ""; // Add the token owner address
  const holder = ""; // Add the token holder address

  const document = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/bbs/v1",
      "https://trustvc.io/context/transferable-records-context.json",
      "https://trustvc.io/context/render-method-context.json",
      "https://trustvc.io/context/attachments-context.json",
      "https://schemata.openattestation.com/io/tradetrust/bill-of-lading/1.0/bill-of-lading-context.json",
    ],
    type: ["VerifiableCredential"],
    credentialStatus: {
      type: "TransferableRecords",
      tokenNetwork: {
        chain: CHAININFO.currency,
        chainId: CHAINID,
      },
      tokenRegistry: REGISTRY_ADDRESS, // Replace with your token registry address obtained from previous step
    },
    renderMethod: [
      {
        id: "https://generic-templates.tradetrust.io",
        type: "EMBEDDED_RENDERER",
        templateName: "BILL_OF_LADING",
      },
    ],
    credentialSubject: {
      shipper: { address: {} },
      consignee: {},
      notifyParty: {},
      blNumber: "250107",
      scac: "250107",
    },
    issuanceDate: new Date().toISOString(),
    issuer: "did:web:your-did-controller", // Replace with your DID controller
  };

  // Sign the W3C document using the DID key pair obtained from the prerequisites
  const didKeyPairs = {
    id: "did:web:your-did-controller#keys-1",
    type: "Bls12381G2Key2020",
    controller: "did:web:your-did-controller",
    privateKeyBase58: "your-private-key",
    publicKeyBase58: "your-public-key"
  };
  
  const { signed: signedW3CDocument } = await signW3C(document, didKeyPairs);
  
  // Generate a token ID from the signed document
  const tokenId = getTokenId(signedW3CDocument);
  

  const tokenRegistry = new ethers.Contract(
    REGISTRY_ADDRESS,
    v5Contracts.TradeTrustToken__factory.abi,
    signer
  );    

  const remarks = "Minting token";
  const encryptedRemarks = remarks && `0x${encrypt(remarks, signedW3CDocument?.id)}` || '0x';
  try {
    await tokenRegistry.callStatic.mint(owner, holder, tokenId, encryptedRemarks);
  } catch (error) {
    console.error("Pre-mint verification failed:", error);
    throw new Error('Failed to mint token - verification check failed');
  }
  
  // Process the actual minting transaction
  let tx;
  if (CHAININFO.gasStation) {
    const gasFees = await CHAININFO.gasStation();
    console.log('Gas fees:', gasFees);
    
    tx = await tokenRegistry.mint(owner, holder, tokenId, encryptedRemarks, {
      maxFeePerGas: gasFees?.maxFeePerGas?.toBigInt() ?? 0,
      maxPriorityFeePerGas: gasFees?.maxPriorityFeePerGas?.toBigInt() ?? 0,
    });
  } else {
    tx = await tokenRegistry.mint(owner, holder, tokenId, encryptedRemarks);
  }
  
  // Wait for transaction confirmation
  const receipt = await tx.wait();
  console.log(`Transaction hash: ${receipt?.transactionHash}`);
  
};
```

## Troubleshooting

### Common Issues

1. **KMS Access Denied**: Ensure your AWS IAM user has the correct permissions to use the KMS key
2. **Invalid Key Format**: Verify your KMS key is using the correct algorithm (ECC_SECG_P256K1)
3. **Transaction Failures**: Check gas settings and blockchain connection
4. **Document Signing Error**: Ensure your DID configuration is correct
5. **Ethers Version Compatibility**: The AWS KMS library uses ethers v5. Make sure to use ethers v5 (as specified in the package.json example) and not v6, as using v6 might cause ENS address resolution errors or other compatibility issues

## Conclusion

You've now successfully learned how to mint tokens by signing with AWS KMS keys. This approach provides a secure method for generating and managing tokens by utilizing AWS's Key Management Service for cryptographic operations while maintaining security best practices.