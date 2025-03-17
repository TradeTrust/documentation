---
id: prerequisites
title: Prerequisites
sidebar_label: Prerequisites
---

Please keep in mind that we have more than one method to achieve our goal and throughout the tutorial we will be diving into the different methods available, to issue verifiable documents and to mint transferable records.

In most of our tutorial we will be using:

- Method 1: TradeTrust CLI
- Method 2: Code integration (using our library to achieve the same result)

Before we get started, to make sure you have a good experience with the tutorial, you will need to install our TradeTrust CLI.

### What TradeTrust CLI does

The [TradeTrust CLI](https://github.com/TradeTrust/tradetrust-cli) is a tool that allows users to run many operation on their machine to get a valid TradeTrust documents. It can be used for both Verifiable Documents and Transferable Records.

### Installation of TradeTrust CLI

#### Binary

To install the binary, simply download the binary from the [CLI release page](https://github.com/TradeTrust/tradetrust-cli/releases/) for your OS.

> We are aware that the size of the binaries must be reduced and we have tracked the issue in [Github](https://github.com/Open-Attestation/open-attestation-cli/issues/68). We hope to find a solution in a near future and any help is welcomed.

#### NPM

Alternatively for Linux or MacOS users, if you have `npm` installed on your machine, you may install the cli using the following command:

```bash
npm install -g @tradetrust-tt/tradetrust-cli
```

The above command will install the TradeTrust CLI to your machine. You will need to have node.js installed to be able to run the command.

You can also opt to use npx:

```bash
npx -p @tradetrust-tt/tradetrust-cli tradetrust <arguments>
```

> In all the guides, we will refer to the CLI as `tradetrust` when running a command. That means we will assume the CLI is available in your execution path. If it's not the case, you will to change `tradetrust` by the full path to the executable.

---

### Running the CLI

To check if the setup is working correctly, run the following command:

```bash
tradetrust --version
```

> In the event you need to change the binary name or the path to the binary, makes sure to change the command above accordingly as well as all the commands we will run throughout the guide.

## Wallet Creation

Now that the TradeTrust CLI has been installed successfully, the first thing you will need is an [ethereum wallet](https://ethereum.org/en/wallets/).

They can be created either by using our TradeTrust CLI or with [ethers.js](https://docs.ethers.org/v5/api/signer/#Wallet) or via [metamask](https://support.metamask.io/hc/en-us/articles/360059952212-MetaMask-is-a-self-custodial-wallet) browser extension.

### Method 1: Using TradeTrust CLI

The first step that we will need to go through, is the [wallet](/docs/glossary#wallet) creation:

```bash
tradetrust wallet create --output-file wallet.json
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

### Method 2: Using ethers.js

```ts
import { Wallet } from "ethers";
const generatedWallet = Wallet.createRandom();

console.log(`Address: ${generatedWallet.address}`);
console.log(`Private Key: ${generatedWallet.privateKey}`);
```

```
Address: 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
Private Key: 0x49723865a8ab41e5e8081839e33dff15ab6b0125ba3acc82c25df64e8a8668f5
```

For more information please check [ethers.js Wallet](https://docs.ethers.org/v5/api/signer/#Wallet).

> Alternately, ethers.js provides a getting started guide on basic usage, we suggest referencing the guide as provided [https://docs.ethers.org/v5/getting-started/](https://docs.ethers.org/v5/getting-started/)

### Method 3: Using Metamask

Follow the guide as linked: [https://www.coindesk.com/learn/how-to-set-up-a-metamask-wallet/](https://www.coindesk.com/learn/how-to-set-up-a-metamask-wallet/)

## Understanding Provider class

The next thing we need to take note of is the provider class, both in ethers.js and metamask.

### Ethers.js

Ethers provides multiple Provider class to access the blockchain networks, some of which provides provider specific information

We recommend the following providers that provides apis to send transaction into the network:

- [DefaultProvider](https://docs.ethers.org/v5/api/providers/#providers-getDefaultProvider)
- [InfuraProvider (Infura)](https://docs.infura.io/tutorials/ethereum/send-a-transaction/send-a-transaction-2)
- [AlchemyProvider (Alchemy)](https://docs.alchemy.com/docs/ethers-js-provider)
- [JsonRpcProvider (Generic)](https://docs.ethers.org/v5/api/providers/jsonrpc-provider/)

```ts
import { ethers } from "ethers";

// Use the mainnet
const network = "homestead";

// Specify your own API keys
// Each is optional, and if you omit it the default
// API key for that service will be used.
const provider = ethers.getDefaultProvider(network, {
    etherscan: YOUR_ETHERSCAN_API_KEY,
    infura: YOUR_INFURA_PROJECT_ID,
    // Or if using a project secret:
    // infura: {
    //   projectId: YOUR_INFURA_PROJECT_ID,
    //   projectSecret: YOUR_INFURA_PROJECT_SECRET,
    // },
    alchemy: YOUR_ALCHEMY_API_KEY,
    pocket: YOUR_POCKET_APPLICATION_KEY
    // Or if using an application secret key:
    // pocket: {
    //   applicationId: ,
    //   applicationSecretKey:
    // },
    ankr: YOUR_ANKR_API_KEY
});
```

Other Providers are also available, [ethers.js documentation](https://docs.ethers.org/v5/api/providers/)

> Take note that there's an issue on ethers-v5 on estimating gas prices.
>
> Utilize Gas Station or Oracles to estimate gas prices.
>
> A sample implementation is available on open-attestation-cli and document-creator-website.
>
> The issue does not occur on metamask, as gas prices is handled separately.

For more information, please check out this [ethers.js guide](https://docs.ethers.org/v5/getting-started/#getting-started--connecting).

### Metamask

Metamask and other wallet providers are also provides access to the network, alongside the ability to send transactions from the wallet.

The reference implementation is compliant to [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)

```ts
import { ethers } from "ethers";

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum);

// MetaMask requires requesting permission to connect users accounts
await provider.send("eth_requestAccounts", []);

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner();
```

For more information, please check out this [Metamask guide](https://docs.metamask.io/wallet/reference/provider-api/).

## Important terms to keep in mind

| Term     | Description                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider | A Provider (in ethers) is a class which provides an abstraction for a connection to the Ethereum Network. It provides read-only access to the Blockchain and its status.                                                  |
| Signer   | A Signer is a class which (usually) in some way directly or indirectly has access to a private key, which can sign messages and transactions to authorize the network to charge your account ether to perform operations. |
| Contract | A Contract is an abstraction which represents a connection to a specific contract on the Ethereum Network, so that applications can use it like a normal JavaScript object.                                               |

### Examples

```ts
import { Wallet, providers, getDefaultProvider } from "ethers";

// Providers
const mainnetProvider = getDefaultProvider();
const amoyProvider = getDefaultProvider("amoy");
const metamaskProvider = new providers.Web3Provider(web3.currentProvider); // Will change network automatically

// Signer
const signerFromPrivateKey = new Wallet("YOUR-PRIVATE-KEY-HERE", provider);
const signerFromEncryptedJson = Wallet.fromEncryptedJson(json, password);
signerFromEncryptedJson.connect(provider);
const signerFromMnemonic = Wallet.fromMnemonic("MNEMONIC-HERE");
signerFromMnemonic.connect(provider);
```

Now that you have a basic understand, let us begin our journey to create a TradeTrust document!
