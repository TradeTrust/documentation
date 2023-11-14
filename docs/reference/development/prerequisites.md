---
id: prerequisites
title: Prerequisites
sidebar_label: Prerequisites
---

> Ethers.js provides a getting started guide on basic usage, we suggest referencing the guide as provided [https://docs.ethers.org/v5/getting-started/](https://docs.ethers.org/v5/getting-started/)

## Wallet creation

### Ethers.js

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

[Ethers.js Wallet](https://docs.ethers.org/v5/api/signer/#Wallet)

### Metamask

Follow the guide as linked: [https://www.coindesk.com/learn/how-to-set-up-a-metamask-wallet/](https://www.coindesk.com/learn/how-to-set-up-a-metamask-wallet/)

## Provider

> Take note that there's an issue on ethers-v5 on estimating gas prices.
>
> Utilize Gas Station or Oracles to estimate gas prices.
>
> A sample implementation is available on open-attestation-cli and document-creator-website.
>
> The issue does not occur on metamask, as gas prices is handled seperately

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

[Ethers.js Guide](https://docs.ethers.org/v5/getting-started/#getting-started--connecting)
[Metamask Guide](https://docs.metamask.io/wallet/reference/provider-api/)

## Signers, Providers and Contracts

| Term     | Description                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider | A Provider (in ethers) is a class which provides an abstraction for a connection to the Ethereum Network. It provides read-only access to the Blockchain and its status.                                                  |
| Signer   | A Signer is a class which (usually) in some way directly or indirectly has access to a private key, which can sign messages and transactions to authorize the network to charge your account ether to perform operations. |
| Contract | A Contract is an abstraction which represents a connection to a specific contract on the Ethereum Network, so that applications can use it like a normal JavaScript object.                                               |

## Examples

```ts
import { Wallet, providers, getDefaultProvider } from "ethers";

// Providers
const mainnetProvider = getDefaultProvider();
const goerliProvider = getDefaultProvider("goerli");
const metamaskProvider = new providers.Web3Provider(web3.currentProvider); // Will change network automatically

// Signer
const signerFromPrivateKey = new Wallet("YOUR-PRIVATE-KEY-HERE", provider);
const signerFromEncryptedJson = Wallet.fromEncryptedJson(json, password);
signerFromEncryptedJson.connect(provider);
const signerFromMnemonic = Wallet.fromMnemonic("MNEMONIC-HERE");
signerFromMnemonic.connect(provider);
```
