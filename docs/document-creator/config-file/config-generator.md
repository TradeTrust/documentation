---
id: config-generator
title: Config Generator
sidebar_label: Config Generator
---

To generate a config file, you could start by downloading a copy of our generic templates ([cover letter](https://docs.tradetrust.io/docs/generic-templates/cover-letter), [bill of lading](https://docs.tradetrust.io/docs/generic-templates/bill-of-lading)) and edit your forms from there.

Alternatively, we have a tool to help generate the config file.

Before we proceed, you will need to have Open Attestation CLI v1.39.3 or higher installed in your computer.

## Step 1: Acquiring a wallet.json file

Firstly, we will need to acquire a wallet.json file, please refer [here](https://www.openattestation.com/docs/verifiable-document/wallet) on how to create the wallet.json file.

If you already have a wallet.json file, you can skip this step and proceed to [step 2](#step-2).

## Step 2: generate the config file

Run this command to generate a config file that includes some generic template forms.

```
open-attestation config create --output-dir <./examples/config> --encrypted-wallet-path </path/to/wallet.json> --config-type tradetrust

```

During the creation, you will be prompted for a password. Make sure to remember it for the following steps.

The option `--output-dir` specifies which directory the config file will be created in.

The option `--encrypted-wallet-path` indicates a path to the encrypted wallet that you acquired in step 1.

The option `--config-type` specifies which default template to use to create the config file. For the case above, we specify to use tradetrust default template to create the config file.

Once the config file is generated, you can test it out on our [document creator website](https://creator.tradetrust.io/).

To take it a step further, you can customise your config file by **replacing the forms in the forms section with your own customised forms**, so you can create and issue custom documents.
