---
id: stability-gasfee-workaround
title: Workaround to "ZeroGasTransactions RPCs" error on GTN ( Stability ) Networks
sidebar_label: Workaround to ZeroGasTransactions RPCs on GTN ( Stability ) Networks
---

When you use methods from `document-store` that require gas fee such as deploying doucment-store or minting token, you will encounter this error `ZeroGasTransactions RPCs do not support transactions where maxFeePerGas/gasPrice is greater than 0`. This error occurs because stability networks ( both mainnet and testnet ) don't require any gas fee and we need to mention that the gasPrice is 0.

### Example on how we set the gas price to zero when we deploy the document store

```ts
import { DocumentStoreFactory } from "@tradetrust-tt/document-store";

// specify zero gas fee for stability network
const gasFees = {
  maxPriorityFeePerGas: 0,
  maxFeePerGas: 0,
};

const docStoreFactory = new DocumentStoreFactory(wallet);
const transaction = await docStoreFactory.deploy("<DOCUMENT_STORE_NAME>", ownerAddr, {
  ...gasFees,
});
const receipt = await transaction.deployTransaction.wait();
console.log(receipt);
```
