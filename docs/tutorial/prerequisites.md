---
id: prerequisites-cli
title: Prerequisites (CLI)
sidebar_label: Prerequisites (CLI)
---

Before we start, you will need the an [ethereum wallet](https://ethereum.org/en/wallets/). They can be created with [ethers.js](https://docs.ethers.org/v5/api/signer/#Wallet) or via [metamask](https://support.metamask.io/hc/en-us/articles/360059952212-MetaMask-is-a-self-custodial-wallet) browser extension. For our tutorials, we will be using OpenAttestation CLI (OA CLI) to [generate](https://github.com/Open-Attestation/open-attestation-cli#wallet) our wallet.

## What OA CLI does

The [Open Attestation CLI](https://github.com/Open-Attestation/open-attestation-cli) tool allows users to deploy, mint, wrap and other operation on their documents. It can be used for both Verifiable Documents and Transferable Records.

## Installation

### Binary

To install the binary, simply download the binary from the [CLI release page](https://github.com/Open-Attestation/open-attestation-cli/releases) for your OS.

> We are aware that the size of the binaries must be reduced and we have tracked the issue in [Github](https://github.com/Open-Attestation/open-attestation-cli/issues/68). We hope to find a solution in a near future and any help is welcomed.

### NPM

Alternatively for Linux or MacOS users, if you have `npm` installed on your machine, you may install the cli using the following command:

```bash
npm install -g @govtechsg/open-attestation-cli
```

The above command will install the open-attestation CLI to your machine. You will need to have node.js installed to be able to run the command.

You can also opt to use npx:

```bash
npx -p @govtechsg/open-attestation-cli open-attestation <arguments>
```

> In all the guides, we will refer to the CLI as `open-attestation` when running a command. That means we will assume the CLI is available in your execution path. If it's not the case, you will to change `open-attestation` by the full path to the executable.

---

## Running the CLI

To check if the setup is working correctly, run the following command:

```bash
open-attestation --version
```

> In the event you need to change the binary name or the path to the binary, makes sure to change the command above accordingly as well as all the commands we will run throughout the guide.

### Create Wallet

The first step that we will need to go through, is the [wallet](/docs/reference/appendix/glossary#wallet) creation:

```bash
open-attestation wallet create --output-file wallet.json
```

During the creation, you will be prompted for a password. Make sure to remember it for the following steps. You will see a message after completion of the command:

```text
ℹ  info      Creating a new wallet
? Wallet password [hidden]
…  awaiting  Encrypting Wallet [====================] [100/100%]
ℹ  info      Wallet with public address 0x10cFd56E11e7d66C8d0716Cd2D6B847Cb17ABeeD successfully created. Find more details:
✔  success   Wallet successfully saved into /home/nebulis/IdeaProjects/open-attestation-cli/wallet.json
```

A wallet will be created in the current folder, in the `wallet.json` file.

> In the example above, the public address for the wallet is `0x10cFd56E11e7d66C8d0716Cd2D6B847Cb17ABeeD`. You will definitely get a different value.

Make sure ethers have been added into your wallet. You will need some for the next steps. Head to etherscan (https://sepolia.etherscan.io/address/PUT_YOUR_ADDRESS_HERE}) and verify the balance. You should have 1 ether. For instance, for the wallet created above, the URL is https://sepolia.etherscan.io/address/0x10cFd56E11e7d66C8d0716Cd2D6B847Cb17ABeeD.

You can use any of these ether faucet for sepolia network to fund your wallet. For instance :

- https://sepoliafaucet.com/
- https://sepolia-faucet.pk910.de/

## Further

For detailed information about the application, please refer to the [Github Repository](https://github.com/Open-Attestation/open-attestation-cli)
