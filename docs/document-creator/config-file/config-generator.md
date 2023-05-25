---
id: config-generator
title: Config Generator
sidebar_label: Config Generator
---

To generate a config file, you could start by downloading a copy of our generic templates ([cover letter](https://docs.tradetrust.io/docs/generic-templates/cover-letter), [bill of lading](https://docs.tradetrust.io/docs/generic-templates/bill-of-lading)) and edit your forms from there.

Alternatively, we have a tool to help generate the config file.

Before we proceed, you will need to have Open Attestation CLI v1.45.3 or higher installed on your computer.
**Note: by using the open attestation cli method, it will generate a sandbox dns that will expire in 30 days.**

## Step 1: Acquiring a wallet.json file

Firstly, we will need to acquire a wallet.json file, please refer [here](https://www.openattestation.com/docs/integrator-section/verifiable-document/ethereum/wallet) on how to create the wallet.json file.

If you already have a wallet.json file, you can skip this step and proceed to [step 2](#step-2-generate-the-config-file).

## Step 2: Generate the config file

This command to generate a config file with a sandbox DNS, document store and token registry.

```
open-attestation config create --output-dir ./example-configs --encrypted-wallet-path </path/to>/wallet.json
```

The option `--output-dir` specifies which directory the config file will be created in.

The option `--encrypted-wallet-path` indicates a path to the encrypted wallet that you acquired in step 1.

## Selecting config template

**Note: The structure of the json config template will have to conform with our standards, [click here](./file-structure) for more information.**

Reference templates

- [v2 config template](https://raw.githubusercontent.com/TradeTrust/tradetrust-config/master/build/reference/config-v2.json)
- [v3 config template](https://raw.githubusercontent.com/TradeTrust/tradetrust-config/master/build/reference/config-v3.json).

### Method 1: Using a config template url

```
ℹ  info      Creating a new config file
? Using a config template URL? y
? Please enter the config template URL
```
### Method 2: Using config template path

This method will generate the most basic config file with a sandbox DNS, document store and token registry.

```
ℹ  info      Creating a new config file
? Using a config template URL? n
? Please enter the config template path
```

## Step 3: Select network

```
? Select Network 
  maticmum
  local 
❯ mainnet 
  goerli 
  sepolia 
  matic
```

## Completion

```
ℹ  info      Using 0xA38CC56c9291B9C1f52F862dd92326d352e710b8 as Title Escrow factory.
✔  success   Token registry deployed, address: 0xA38CC56c9291B9C1f52F862dd92326d352e710b9
✔  success   Record created at defiant-jade-perch.sandbox.fyntech.io and will stay valid until Fri Jun 24 2023 01:37:15 GMT+0800 (Singapore Standard Time)
…  awaiting  Sending transaction to pool
…  awaiting  Waiting for transaction 0x9c5fad88e5862879533f39577b0e135217b3353afb4ef9dd81fc5f3073b37df8 to be mined
✔  success   Document store deployed, address: 0xA38CC56c9291B9C1f52F862dd92326d352e710c0
✔  success   Record created at open-green-clownfish.sandbox.fyntech.io and will stay valid until Fri Jun 24 2023 01:37:15 GMT+0800 (Singapore Standard Time)
✔  success   Record created at net-bronze-minnow.sandbox.fyntech.io and will stay valid until Fri Jun 24 2023 01:37:15 GMT+0800 (Singapore Standard Time)
✔  success   Config file successfully created and saved in example-configs/config.json
```

Once the config file is generated, you can start using it on our [document creator website](https://creator.tradetrust.io/).

To take it a step further, you can customise your config file by **replacing the forms in the forms section with your own customised forms**, so you can create and issue your own custom documents.

_Please note that by using any of these methods of generating a config file, the config file will only be usable in **testnet** environments and with a validity of **30 days**._
