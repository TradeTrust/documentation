---
id: issue
title: Issue
sidebar_label: Issue
---

## Token Registry

> The following information is from the [token-registry repository](https://github.com/TradeTrust/Token-Registry/), refer to the repository for the most recent changes.

## Installation

```sh
npm install --save @govtechsg/token-registry
```

---

## Usage

To use the package, you will need to provide your own Web3 [provider](https://docs.ethers.io/v5/api/providers/api-providers/) or [signer](https://docs.ethers.io/v5/api/signer/#Wallet) (if you are writing to the blockchain).

## Network Configuration

Here's a list of network names currently pre-configured:

- `mainnet` (Ethereum)
- `sepolia`
- `polygon` (Polygon Mainnet)
- `mumbai` (Polygon Mumbai)
- `xdc` (XDC Network Mainnet)
- `xdcapothem` (XDC Apothem TestNet)

For unconfigured networks, refer to the token-registry repository on instructions to setting it up, or deploy Token Registry using the Open-Attestation-CLI application

### TradeTrustToken

The `TradeTrustToken` is a Soulbound Token (SBT) tied to the Title Escrow. The SBT implementation is loosely based on OpenZeppelin's implementation of the [ERC721](http://erc721.org/) standard.
An SBT is used in this case because the token, while can be transferred to the registry, is largely restricted to its designated Title Escrow contracts.
See issue [#108](https://github.com/Open-Attestation/token-registry/issues/108) for more details.

#### Deploy new token registry

##### Hardhat

To deploy using the Hardhat method, setup the token-registry repository and deploy using the following command.

```
Usage: hardhat [GLOBAL OPTIONS] deploy:token --factory <STRING> --name <STRING> [--standalone] --symbol <STRING> [--verify]

OPTIONS:

  --factory   	Address of Title Escrow factory (Optional)
  --name      	Name of the token
  --standalone	Deploy as standalone token contract
  --symbol    	Symbol of token
  --verify    	Verify on Etherscan

deploy:token: Deploys the TradeTrust token
```

Example:

```
npx hardhat deploy:token --network mumbai --name "The Great Shipping Co." --symbol GSC
```

> 💡 Remember to supply the`--network` argument with the name of the network you wish to deploy on.
> See [Network Configuration](#network-configuration) section for more info on the list of network names.

##### Code Deployment

```ts
import { TDocDeployer__factory } from "@govtechsg/token-registry/contracts";
import { constants as TokenRegistryConstants, utils as TokenRegistryUtils } from "@govtechsg/token-registry";
import { DeploymentEvent } from "@govtechsg/token-registry/dist/contracts/contracts/utils/TDocDeployer";

const privateKey = ""; // insert your private key as generated on wallet creation
const registryName = "DemoTokenRegistry";
const registrySymbol = "DTR";

const unconnectedWallet = new Wallet(privateKey);
const provider = ethers.getDefaultProvider("sepolia");
const wallet = unconnectedWallet.connect(provider);
const walletAddress = await wallet.getAddress();
const chainId = await wallet.getChainId();

const { TokenImplementation, Deployer } = TokenRegistryConstants.contractAddress;

const deployerContract = TDocDeployer__factory.connect(Deployer[chainId], wallet);

const initParam = TokenRegistryUtils.encodeInitParams({
  name: registryName,
  symbol: registrySymbol,
  deployer: walletAddress,
});

const tx = await deployerContract.deploy(TokenImplementation[chainId], initParam);
const receipt = await tx.wait();
const registryAddress = TokenRegistryUtils.getEventFromReceipt<DeploymentEvent>(
  receipt,
  deployerContract.interface.getEventTopic("Deployment")
).args.deployed;
return { transaction: receipt, contractAddress: registryAddress };
```

#### Connect to existing token registry

```ts
import { TradeTrustToken__factory } from "@govtechsg/token-registry/contracts";

const connectedRegistry = TradeTrustToken__factory.connect(tokenRegistryAddress, signer);
```

#### Issuing a Document

```ts
await connectedRegistry.mint(beneficiaryAddress, holderAddress, tokenId);
```

#### Restoring a Document

```ts
await connectedRegistry.restore(tokenId);
```

#### Accept/Burn a Document

```ts
await connectedRegistry.burn(tokenId);
```

### Title Escrow

The Title Escrow contract is used to manage and represent the ownership of a token between a beneficiary and holder.
During minting, the Token Registry will create and assign a Title Escrow as the owner of that token.
The actual owners will use the Title Escrow contract to perform their ownership operations.

#### Connect to Title Escrow

```ts
import { TitleEscrow__factory } from "@govtechsg/token-registry/contracts";

const connectedEscrow = TitleEscrow__factory.connect(existingTitleEscrowAddress, signer);
```

#### Transfer of Beneficiary/Holder

Transferring of beneficiary and holder within the Title Escrow relies on the following methods:

```solidity
function transferBeneficiary(address beneficiaryNominee) external;

function transferHolder(address newHolder) external;

function transferOwners(address beneficiaryNominee, address newHolder) external;

function nominate(address beneficiaryNominee) external;

```

The `transferBeneficiary` transfers only the beneficiary and `transferHolder` transfers only the holder.
To transfer both beneficiary and holder in a single transaction, use `transferOwners`. Transfer of beneficiary will require a nomination done through the `nominate` method.

#### Surrendering/Burning a Document

Use the `surrender` method in the Title Escrow.

```solidity
function surrender() external;

```

Example:

```ts
await connectedEscrow.surrender();
```

#### Accessing the Current Owners

The addresses of the current owners can be retrieved from the `beneficiary`, `holder` and `nominee` methods.

Example:

```ts
const currentBeneficiary = await connectedEscrow.beneficiary();

const currentHolder = await connectedEscrow.holder();

const nominatedBeneficiary = await connectedEscrow.nominee();
```

## Subgraph

Check out our [Token Registry Subgraph](https://github.com/Open-Attestation/token-registry-subgraph) Github repository
for more information on using and deploying your own subgraphs for the Token Registry contracts.
