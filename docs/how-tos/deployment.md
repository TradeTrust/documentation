---
id: deployment
title: Deployment
sidebar_label: Deployment
---

### TDocDeployer

TDocDeployer is a **deployer** contract for transferable documents using minimal proxy clones. It allows the deployment of contract instances based on predefined implementations while associating each implementation with a **titleEscrowFactory**.

#### Key Features

- Cloning Mechanism: Uses OpenZeppelin’s Clones library for efficient contract deployment.
- Implementation Management: Allows the owner to register, update, and remove implementations.
- Deployment Control: Ensures only registered implementations can be deployed.
- Upgradeability: Supports UUPS proxy pattern for future upgrades.

#### deploy Function Explanation

The **deploy** function creates a new contract instance by cloning an existing implementation of **Token Registry**.

### Installing tradetrust-cli

#### Binary

To install the binary, simply download the binary from the [CLI release page](https://github.com/TradeTrust/tradetrust-cli/releases) for your OS.

We are aware that the size of the binaries must be reduced and we have tracked the issue in Github. We hope to find a solution in a near future and any help is welcomed.

#### NPM

Alternatively for Linux or MacOS users, if you have npm installed on your machine, you may install the cli using the following command:

```bash
npm install -g @tradetrust-tt/tradetrust-cli
```

The above command will install the TradeTrust CLI to your machine. You will need to have node.js installed to be able to run the command.

You can also opt to use npx:

```bash
npx -p @tradetrust-tt/tradetrust-cli tradetrust <arguments>
```

## TitleEscrowFactory

The **TitleEscrowFactory** contract is responsible for deploying and managing instances of **TitleEscrow** contracts. It follows a factory pattern that enables the deterministic creation of title escrow instances using the Clones library from OpenZeppelin. This approach ensures gas efficiency and allows for easy management of multiple title escrow contracts.

The Title Escrow Factory contract is already registered in our **TDocDeployer** contract against the Token Registry. However, if you need to deploy the Token Registry separately as a **standalone** contract, you can deploy the Title Escrow Factory independently.

Here's how:

```bash
tradetrust deploy title-escrow-factory --network sepolia
```

## Token Registry

You can deploy a Token Registry contract on the blockchain either as a standalone deployment or through a Factory Contract(tDocDeployer). If a Factory Contract has been deployed using the Token Registry, you can use the factory address flag to interact with it. Additionally, you have the flexibility to deploy the Token Registry using both the CLI and code, depending on your preferred approach.

### Using TDocDeployer

#### 1) Deploying via CLI

Now we will see performing the deployment using tDocDeployer via the command line -

- tDocDeployer can have multiple implementations added as option. The `--token-implementation-address` flag explicitly provides a custom token implementation address. It will look for this implementation address inside tDocDeployer.
- If no implementation is passed, **tDocDeployer** will automatically pick the **default implementation**.

```bash
tradetrust deploy token-registry <registry-name> <registry-symbol> --token-implementation-address <token-implementation-address> --network <network-name>
```

Example - with private key set in OA_PRIVATE_KEY environment variable (recommended).

```bash
tradetrust deploy token-registry "My Sample Token" MST --network sepolia

✔ success Token registry deployed at 0x4B127b8d5e53872d403ce43414afeb1db67B1842
```

#### 2) Deploying via code

##### Installation

```bash
npm install --save  @trustvc/trustvc
```

---

##### Usage

To use the package, you will need to provide your own
Web3 [provider](https://docs.ethers.io/v5/api/providers/api-providers/)
or [signer](https://docs.ethers.io/v5/api/signer/#Wallet) (if you are writing to the blockchain).
This package exposes the [Typechain (Ethers)](https://github.com/dethcrypto/TypeChain/tree/master/packages/target-ethers-v6) bindings for the contracts.

#### Connect to existing tDocDeployer

```ts
import { v5Contracts } from "@trustvc/trustvc";
import { ethers, Signer } from "ethers";

const rpc = `https://polygon-amoy.infura.io/v3/${INFURA_ID}`; // add your infura ID
const tDocDeployerAddress = "0x123"; // token registry deployer address

const JsonRpcProvider = ethers.version.startsWith("6.")
  ? (ethers as any).JsonRpcProvider
  : (ethers as any).providers.JsonRpcProvider; // to manage both ether's v5 and v6

const _provider = new JsonRpcProvider(rpc);
const connectedDeployer = new ethers.Contract(tDocDeployerAddress, v5Contracts.TDocDeployer__factory.abi, _provider);

const encodeInitParams = ({ name, symbol, deployer }: Params) => {
  return (ethers as any).AbiCoder.defaultAbiCoder().encode(["string", "string", "address"], [name, symbol, deployer]);
};

const initParam = encodeInitParams({
  name,
  symbol,
  deployerAddress,
});

const tx = await connectedDeployer.deploy(implAddress, initParam);
```

### StandAlone

If you want to deploy the Token Registry as a standalone contract instead of using TDocDeployer, you will need the Title Escrow Factory contract address. Below is the CLI command for deployment:

```bash
tradetrust deploy token-registry <registry-name> <registry-symbol> --factory-address <factory-address> --standalone --network <network-name>
```

Example - with private key set in OA_PRIVATE_KEY environment variable (recommended).

```bash
tradetrust deploy token-registry "My Sample Token" MST --factory 0xfcafea839e576967b96ad1FBFB52b5CA26cd1D25 --standalone --network sepolia

✔ success Token registry deployed at 0x4B127b8d5e53872d403ce43414afeb1db67B1842
```

## TitleEscrow

### Mint document to token registry

Mint a hash to a token registry deployed on the blockchain. The tokenId option would be used to indicate the document hash, and the to option to indicate the title escrow address the document is mapped to. Every minting of a new document will also create a new Title Escrow Contract .

```bash
tradetrust token-registry mint --network <NETWORK> --address <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --beneficiary <BENEFICIARY> --holder <HOLDER>
```

Example - with private key set in OA_PRIVATE_KEY environment variable (recommended).

```bash
tradetrust token-registry mint --network sepolia --address 0x6133f580aE903b8e79845340375cCfd78a45FF35 --tokenId 0x10ee711d151bc2139473a57531f91d961b639affb876b350c31d031059cdcc2c --beneficiary 0xB26B4941941C51a4885E5B7D3A1B861E54405f90  --holder 0xB26B4941941C51a4885E5B7D3A1B861E54405f90

✔  success   Token with hash 0x10ee711d151bc2139473a57531f91d961b639affb876b350c31d031059cdcc2c has been issued on 0x6133f580aE903b8e79845340375cCfd78a45FF35 with the initial recipient being 0xB26B4941941C51a4885E5B7D3A1B861E54405f90 and initial holder 0xB26B4941941C51a4885E5B7D3A1B861E54405f90
```
