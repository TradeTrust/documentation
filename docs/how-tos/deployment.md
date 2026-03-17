---
id: deployment
title: Deployment
sidebar_label: Deployment
---

#### deploy Function Explanation

The **deploy** function creates a new contract instance by cloning an existing implementation of **Token Registry**.

### Installing TrustVC CLI

> **⚠️ DISCLAIMER**
>
> The TrustVC CLI helps developers prototype and test how document issuance and verification work before integrating the TrustVC core into their own systems.
>
> It should not be used for production issuance or live document management, as it lacks security, scalability, and operational controls required for real-world environments.

#### Binary

To install the binary, simply download the binary from the [CLI release page](https://github.com/TrustVC/trustvc-cli/releases) for your OS.

We are aware that the size of the binaries must be reduced and we have tracked the issue in Github. We hope to find a solution in a near future and any help is welcomed.

#### NPM

For Linux or MacOS users, if you have npm installed on your machine, you may install the CLI using the following command:

```bash
npm install -g @trustvc/trustvc-cli
```

The above command will install the TrustVC CLI to your machine. You will need to have node.js installed to be able to run the command.

You can also opt to use npx:

```bash
npx @trustvc/trustvc-cli <arguments>
```

## Document Store

The document store is a smart contract on the blockchain that records the issuance and revocation status of verifiable documents. You can deploy a document store contract using the TrustVC CLI.

### Deploying via CLI

```bash
trustvc deploy document-store
```

The CLI will interactively prompt you for:

1. **Store name**: Enter the name of the document store (e.g., "My First Document Store")
2. **Network selection**: Choose from available networks (e.g., sepolia, polygon-amoy)
3. **Owner address**: Enter the owner address (optional - uses deployer address if not provided)
4. **Wallet selection**: Choose between encrypted wallet, private key file, or environment variable

Example session:

```bash
trustvc deploy document-store

? Enter the name of the document store: My First Document Store
? Select a network: sepolia
? Enter the owner address (optional, press Enter to use deployer address):
? Select wallet type: Environment Variable (OA_PRIVATE_KEY)

ℹ  info      Deploying document store My First Document Store
✔  success   Document store My First Document Store deployed at 0xBBb55Bd1D709955241CAaCb327A765e2b6D69c8b
ℹ  info      Find more details at https://sepolia.etherscan.io/tx/0x...
```

**Save the document store address.** You will need this address for issuing and revoking documents.

## TDocDeployer

TDocDeployer is a **deployer** contract for transferable documents using minimal proxy clones. It allows the deployment of contract instances based on predefined implementations while associating each implementation with a **titleEscrowFactory**.

### Key Features

- Cloning Mechanism: Uses OpenZeppelin's Clones library for efficient contract deployment.
- Implementation Management: Allows the owner to register, update, and remove implementations.
- Deployment Control: Ensures only registered implementations can be deployed.
- Upgradeability: Supports UUPS proxy pattern for future upgrades.

### deploy Function Explanation

The **deploy** function creates a new contract instance by cloning an existing implementation of **Token Registry**.

## TitleEscrowFactory

The **TitleEscrowFactory** contract is responsible for deploying and managing instances of **TitleEscrow** contracts. It follows a factory pattern that enables the deterministic creation of title escrow instances using the Clones library from OpenZeppelin. This approach ensures gas efficiency and allows for easy management of multiple title escrow contracts.

The Title Escrow Factory contract is already registered in our **TDocDeployer** contract against the Token Registry. However, if you need to deploy the Token Registry separately as a **standalone** contract, you can deploy the Title Escrow Factory independently.

Here's how:

```bash
trustvc deploy title-escrow-factory
```

The CLI will interactively prompt you for:

- **Network selection**: Choose from available networks (e.g., sepolia, polygon-amoy)
- **Wallet selection**: Choose between encrypted wallet, private key file, or environment variable

## Token Registry

You can deploy a Token Registry contract on the blockchain either as a standalone deployment or through a Factory Contract(tDocDeployer). If a Factory Contract has been deployed using the Token Registry, you can use the factory address flag to interact with it. Additionally, you have the flexibility to deploy the Token Registry using both the CLI and code, depending on your preferred approach.

### Using TDocDeployer

#### 1) Deploying via CLI

Now we will see performing the deployment using tDocDeployer via the command line.

The TrustVC CLI uses an interactive prompt system that guides you through the deployment process:

```bash
trustvc deploy token-registry
```

The CLI will interactively prompt you for:

1. **Network selection**: Choose from available networks (e.g., sepolia, polygon-amoy)
2. **Registry name**: Enter the name of the token registry (e.g., "My Sample Token")
3. **Registry symbol**: Enter the symbol of the token registry (e.g., "MST")
4. **Deployment type**: Choose between standalone or factory deployment
   - If **factory deployment** (default): You can optionally provide:
     - Token registry implementation address (optional - uses default if not provided)
     - Deployer contract address (optional - uses default if not provided)
5. **Wallet selection**: Choose between encrypted wallet, private key file, or environment variable

Example session:

```bash
trustvc deploy token-registry

? Select a network: sepolia
? Enter the name of the token registry: My Sample Token
? Enter the symbol of the token registry: MST
? Is this a standalone deployment? No
? Enter the token registry implementation address (optional, press Enter to use default):
? Enter the deployer contract address (optional, press Enter to use default):
? Select wallet type: Environment Variable (OA_PRIVATE_KEY)

ℹ  info      Deploying token registry My Sample Token
✔  success   Token registry deployed at 0x4B127b8d5e53872d403ce43414afeb1db67B1842
ℹ  info      Find more details at https://sepolia.etherscan.io/tx/0x...
```

**Notes:**

- tDocDeployer can have multiple implementations added as options
- If no implementation address is provided, **tDocDeployer** will automatically pick the **default implementation**
- The CLI will perform a dry run on Ethereum and Polygon networks to estimate gas costs before deployment

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
import { v5Contracts, v5ContractAddress, v5Utils } from "@trustvc/trustvc";
import { ethers, Signer } from "ethers";

const rpc = `https://polygon-amoy.infura.io/v3/${INFURA_ID}`; // add your infura ID

const JsonRpcProvider = ethers.version.startsWith("6.")
  ? (ethers as any).JsonRpcProvider
  : (ethers as any).providers.JsonRpcProvider; // to manage both ether's v5 and v6

const _provider = new JsonRpcProvider(rpc);
const networkId = await provider.getNetwork();

const tDocDeployerAddress = v5ContractAddress.Deployer[networkId]; // token registry deployer address
const connectedDeployer = new ethers.Contract(tDocDeployerAddress, v5Contracts.TDocDeployer__factory.abi, _provider);

const initParam = v5Utils.encodeInitParams({
  name,
  symbol,
  deployer: await signer.getAddress(),
});

const tx = await connectedDeployer.deploy(implAddress, initParam);
```

### Standalone Deployment

If you want to deploy the Token Registry as a standalone contract instead of using TDocDeployer, you will need the Title Escrow Factory contract address.

```bash
trustvc deploy token-registry
```

The CLI will interactively prompt you for:

1. **Network selection**: Choose from available networks (e.g., sepolia, polygon-amoy)
2. **Registry name**: Enter the name of the token registry (e.g., "My Sample Token")
3. **Registry symbol**: Enter the symbol of the token registry (e.g., "MST")
4. **Deployment type**: Choose **Yes** for standalone deployment
   - If **standalone**: You can optionally provide:
     - Factory address (optional - uses default Title Escrow Factory if not provided)
5. **Wallet selection**: Choose between encrypted wallet, private key file, or environment variable

Example session:

```bash
trustvc deploy token-registry

? Select a network: sepolia
? Enter the name of the token registry: My Sample Token
? Enter the symbol of the token registry: MST
? Is this a standalone deployment? Yes
? Enter the factory address (optional, press Enter to use default): 0xfcafea839e576967b96ad1FBFB52b5CA26cd1D25
? Select wallet type: Environment Variable (OA_PRIVATE_KEY)

ℹ  info      Deploying token registry My Sample Token
✔  success   Token registry deployed at 0x4B127b8d5e53872d403ce43414afeb1db67B1842
ℹ  info      Find more details at https://sepolia.etherscan.io/tx/0x...
```

## TitleEscrow

### Mint document to token registry

Mint a hash to a token registry deployed on the blockchain. The tokenId is used to indicate the document hash, and the beneficiary and holder options indicate the title escrow ownership. Every minting of a new document will also create a new Title Escrow Contract.

```bash
trustvc token-registry mint
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file (JSON)
   - The CLI automatically extracts the token registry address, token ID, and network from the document
   - Verifies the document signature before proceeding
2. **Beneficiary address**: The initial recipient/owner of the document
3. **Holder address**: The initial holder of the document (can be the same as beneficiary)
4. **Wallet selection**: Choose between encrypted wallet, private key file, or environment variable
5. **Remark** (optional, V5 only): Additional remarks to be encrypted and stored with the token

Example session:

```bash
trustvc token-registry mint

? Enter the path to the wrapped document: ./wrapped-documents/document-1.json
ℹ  info      Document signature verified successfully
? Enter the beneficiary address: 0xB26B4941941C51a4885E5B7D3A1B861E54405f90
? Enter the holder address: 0xB26B4941941C51a4885E5B7D3A1B861E54405f90
? Select wallet type: Environment Variable (OA_PRIVATE_KEY)
? Enter remarks (optional, press Enter to skip):

ℹ  info      Issuing 0x10ee711d151bc2139473a57531f91d961b639affb876b350c31d031059cdcc2c to the initial recipient 0xB26B4941941C51a4885E5B7D3A1B861E54405f90 and initial holder 0xB26B4941941C51a4885E5B7D3A1B861E54405f90 in the registry 0x6133f580aE903b8e79845340375cCfd78a45FF35
⠋  awaiting  Waiting for transaction 0x... to be mined
✔  success   Token with hash 0x10ee711d151bc2139473a57531f91d961b639affb876b350c31d031059cdcc2c has been minted on 0x6133f580aE903b8e79845340375cCfd78a45FF35 with the initial recipient being 0xB26B4941941C51a4885E5B7D3A1B861E54405f90 and initial holder 0xB26B4941941C51a4885E5B7D3A1B861E54405f90
ℹ  info      Find more details at https://sepolia.etherscan.io/tx/0x...
```

**Key Features:**

- **Automatic extraction**: Token registry address, token ID, and network are automatically extracted from the wrapped document
- **Document verification**: The CLI verifies the document signature before minting
- **Encrypted remarks**: Remarks (if provided) are encrypted using the document ID as the encryption key
- **Gas estimation**: Automatic dry run on Ethereum and Polygon networks to estimate gas costs
- **Title Escrow creation**: A new Title Escrow contract is automatically created during the minting process
