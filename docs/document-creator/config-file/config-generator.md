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

There are 2 ways of using this command to generate a config file, both in which, will return a new config file with sandbox DNS, updated document store and updated token registry.

### Method 1: Using config-type option

This method will generate the most basic config file with a sandbox DNS, document store and token registry.

```
open-attestation config create --output-dir ./example-configs --encrypted-wallet-path </path/to>/wallet.json --config-type tradetrust
```

### Method 2: Using config-template-path option

This method will generate a copy of your existing config file with the updated sandbox DNS, document store and token registry.

**Note: The structure of the config.json file that is being used as the template will have to conform with the our standards of config.json file, [click here](./file-structure) for more information.**

```
open-attestation config create --output-dir ./example-configs --encrypted-wallet-path </path/to>/wallet.json --config-template-path </path/to>/config.json
```

During the creation, you will be prompted for a password. Make sure to remember it for the following steps.

The option `--output-dir` specifies which directory the config file will be created in.

The option `--encrypted-wallet-path` indicates a path to the encrypted wallet that you acquired in step 1.

The option `--config-template-path` indicates a path to a config file that you would need to have.

The option `--config-type` specifies which default template to use to create the config file. For the case above, we specify to use tradetrust default template to create the config file.

Once the config file is generated, you can start using it on our [document creator website](https://creator.tradetrust.io/).

To take it a step further, you can customise your config file by **replacing the forms in the forms section with your own customised forms**, so you can create and issue your own custom documents.

_Please note that by using any of these methods of generating a config file, the config file will only be usable in **ropsten testnet** environment and with a validity of **30 days**._
