---
id: issue
title: Issue
sidebar_label: Issue
---

# Document Store

> The following information is from the [document store repository](https://github.com/Open-Attestation/document-store/), refer to the repository for the most recent changes.

## Installation

```sh
npm install --save @govtechsg/document-store
```

---

## Usage

To use the package, you will need to provide your own Web3 [provider](https://docs.ethers.io/v5/api/providers/api-providers/) or [signer](https://docs.ethers.io/v5/api/signer/#Wallet) (if you are writing to the blockchain).

### Deploy new document store

```ts
import { deployAndWait } from "@govtechsg/document-store";

const documentStore = await deployAndWait("My Document Store", signer).then(console.log);
```

### Connect to existing document store

```ts
import { connect } from "@govtechsg/document-store";

const documentStore = await connect("0x4077534e82c97be03a07fb10f5c853d2bc7161fb", providerOrSigner);
```

## Example

```ts
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

const privateKey = ""; // insert your private key as generated on wallet creation
const jsonRPCProviderUrl = "http://127.0.0.1:8545"; // Local network
const documentStoreName = "DemoDocumentStore";

const unconnectedWallet = new Wallet(privateKey);
const provider = new ethers.providers.JsonRpcProvider(jsonRPCProviderUrl);
const wallet = unconnectedWallet.connect(provider);
const walletAddress = await wallet.getAddress();

const factory = new DocumentStoreFactory(wallet);
const transaction = await factory.deploy(documentStoreName, ownerAddress);
const transactionReceipt = await transaction.deployTransaction.wait();
const documentStoreAddress = transactionReceipt.contractAddress;
console.log(transactionReceipt.contractAddress);
```

### Interact with document store

```ts
const issueMerkleRoot = async () => {
  const documentStore = await connect("0x4077534e82c97be03a07fb10f5c853d2bc7161fb", signer);

  const tx = await documentStore.issue("0x7fe0b58ed760804eb7118988637693c4351613be327b56527e55bcd0a8d170d7");
  const receipt = await tx.wait();
  console.log(receipt);

  const isIssued = await documentStore.isIssued("0x7fe0b58ed760804eb7118988637693c4351613be327b56527e55bcd0a8d170d7");
  console.log(isIssued);
};
```

### List of available functions

```text
documentIssued
documentRevoked
isOwner
name
owner
renounceOwnership
transferOwnership
version
initialize
issue
bulkIssue
getIssuedBlock
isIssued
isIssuedBefore
revoke
bulkRevoke
isRevoked
isRevokedBefore
```
