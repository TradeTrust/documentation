---
id: document-store-code
title: Deploying Document Store Smart Contract (Code)
sidebar_label: Deploying Document Store (Code)
---

> For the current step, you can either opt to use the [CLI](/docs/tutorial/advanced/verifiable-documents/ethereum/document-store) or [Code](/docs/tutorial/advanced/verifiable-documents/ethereum/document-store-code).

## Installation

```sh
npm install --save @govtechsg/document-store
```

---

## Usage

To use the package, you will need to provide your own Web3 [provider](https://docs.ethers.io/v5/api/providers/api-providers/) or [signer](https://docs.ethers.io/v5/api/signer/#Wallet) (if you are writing to the blockchain).

Refer to the [pre-requisite](/docs/tutorial/prerequisites-code) on setup instructions.

### Deploy new document store

```ts
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { Wallet, ethers } from "ethers";

const unconnectedWallet = new Wallet("privateKey");
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Local network
const wallet = unconnectedWallet.connect(provider);
const walletAddress = await wallet.getAddress();

const factory = new DocumentStoreFactory(wallet);
const transaction = await factory.deploy("Demo Document Store", walletAddress);
const transactionReceipt = await transaction.deployTransaction.wait();
const documentStoreAddress = transactionReceipt.contractAddress;
console.log(transactionReceipt.contractAddress);
```

Output

```
Contract Address: 0x63A223E025256790E88778a01f480eBA77731D04
```

### Connect to existing document store

```ts
import { DocumentStoreFactory } from "@govtechsg/document-store";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { Wallet, ethers } from "ethers";

const unconnectedWallet = new Wallet("privateKey");
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Local network
const wallet = unconnectedWallet.connect(provider);

const documentStore = DocumentStoreFactory.connect("0x63A223E025256790E88778a01f480eBA77731D04", wallet);
console.log(`Document Store Name: ${await documentStore.name()}`);
```

Output

```
Document Store Name: DemoDocumentStore
```