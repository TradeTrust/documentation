---
id: migration-tr-v5
title: Migration to Token Registry v5
sidebar_label: Migration to Token Registry v5
---

This migration guide helps you transition from Token Registry v4 to **TrustVC** integrated with Token Registry v5. **TrustVC** simplifies the signing and verification processes for W3C Verifiable Credentials (VC) and OpenAttestation Verifiable Documents (VD), while offering full integration with Token Registry v5. It also explains how to handle different scenarios depending on your needs.

## 1. What’s New?

**TrustVC Integration**

- **TrustVC** is a comprehensive library that combines several TradeTrust libraries, including Token Registry v5, W3C Verifiable Credentials, and OpenAttestation Verifiable Documents. By using **TrustVC**, you can manage both credential documents and token-based credentials seamlessly in a unified solution.

**Token Registry v5**

- Token Registry v5 is the newest version. It allows you to manage token-based credentials and ownership transfers through smart contracts. For more information refer to [here](igp-i).

While TrustVC includes Token Registry v5, you may choose to integrate it separately depending on your needs.

## 2. How to Migrate to TrustVC and Token Registry v5

**Option 1: Install TrustVC for a unified solution**

If you need both Token Registry v5 and W3C Verifiable Credentials or OpenAttestation Documents, you can install TrustVC to access all functionalities in one place.

```bash
npm install @trustvc/trustvc
```

**Option 2: Install Token Registry v5 separately**

If you only need to integrate Token Registry v5 and don't require the full TrustVC stack, you can install Token Registry v5 directly.

```bash
npm install @tradetrust-tt/token-registry@^5.x
```

## 3. Code Migration

### Ethers v6 Integration

- The usage of Ethers v6 in the Token Registry module introduces conflicts with existing modules built on Ethers v5. Notably, only the **Token Registry** module has been upgraded to **Ethers v6**, while the rest of the modules remain on **Ethers v5**. To ensure compatibility across the system, **we recommend using Ethers v5**, as it is largely compatible with and avoids issues with the type changes introduced in v6.

In Ethers v6, stricter and more structured types—especially for Signer, Provider, and BigNumber—have been refactored for better type safety. Certain types, like Wallet, have been moved out of the main ethers object, and ABI encoding/decoding is now more type-sensitive. These changes can cause type mismatches with v5 code and may require casting functions to **'any'** to ensure compatibility.

Some of the common issues you might face are detailed in the examples below, along with solutions to address them. Please review them carefully.

- **Example 1**

**Ethers v5 (Token Registry v4 via TrustVC)**:

```ts
import { ethers } from "ethers";
ZeroAddress = ethers.constants.AddressZero;
```

**Ethers v5 (Token Registry v5 via TrustVC)**:

```ts
import { ethers } from "ethers";
if (ethers.version.includes("/5")) {
  (ethers as any).ZeroAddress = (ethers as any)?.constants?.AddressZero;
}
export const defaultAddress = {
  Zero: (ethers as any).ZeroAddress,
  Burn: "0x000000000000000000000000000000000000dEaD",
};
```

- **Example 2**

**Ethers v5 (Token Registry v4)**:

```ts
const tx = await token.mint(beneficiary.address, holder.address, tokenId);
const receipt = await tx.wait();

const titleEscrowFactoryInterface = (await ethers.getContractFactory("TitleEscrowFactory")).interface;
const event = getEventFromReceipt<TitleEscrowCreatedEvent>(
  receipt,
  titleEscrowFactoryInterface.getEventTopic("TitleEscrowCreated"),
  titleEscrowFactoryInterface, // optional parameter
);
```

**Ethers v5 (Token Registry v5 via TrustVC)**:

```ts
const tx = await token.mint(beneficiary.address, holder.address, tokenId, txnHexRemarks.mintRemark);
const receipt = await tx.wait();
if (receipt === null) {
  throw new Error("Transaction receipt is null.");
}
const titleEscrowFactoryInterface = (await ethers.getContractFactory("TitleEscrowFactory")).interface;
const event = getEventFromReceipt<any>( // use any to bypass type checking
  receipt,
  (titleEscrowFactoryInterface as any).getEventTopic("TitleEscrowCreated"), //Bypasses Type Checking
  titleEscrowFactoryInterface, // necessary parameter
);
```

- **Example 3**

**Ethers v5 (Using Token Registry v4)**:

```ts
titleEscrow.interface.parseLog(log);
```

**Ethers v5 (Using Token Registry v5)**:
In some of the contract instances if **'parseLog'** is not available function , Please refer to below code.

```ts
(titleEscrow.interface as any).parseLog(log);
```

- **Example 4**
  In Ethers v5, contract functions are organized under the functions property, requiring you to access them using this structure. However, in Ethers v6, functions are called directly from the contract object, simplifying the process.

**Ethers v5 (Using token Registry v4)**

```ts
const result = await contract.functions.myFunction(arg1, arg2); //called 'myFunction' under the functions property
```

**Ethers v5 (Using token Registry v5)**

```ts
const result = await contract.myFunction(arg1, arg2); //called directly from the contract object
```

### OpenZeppelin v5 Compatibility

- OpenZeppelin v5 contracts are written for Solidity version 0.8.20, whereas the compiler being used is 0.8.22. It is recommended to deploy on chains that have the Cancun upgrade to avoid potential issues with contract execution.

### Token Registry Deployment

**Before (Token Registry v4)**:

```ts
import { TDocDeployer__factory } from "@tradetrust-tt/token-registry/contracts";
import { constants, utils } from "@tradetrust-tt/token-registry";

const networkId = await signer.getChainId();
const tDocDeployerAddress = constants.contractAddress.Deployer[networkId];
const implContractAddress = constants.contractAddress.TokenImplementation[networkId];
const tDocDeployerV5 = TDocDeployer__factory.connect(tDocDeployerAddress, signer);
const initParams = utils.encodeInitParams({
  name,
  symbol,
  deployer: await signer.getAddress(),
});

const mintingReceipt = await tDocDeployerV5.deploy(implContractAddress, initParams);
const mintingTx = await mintingReceipt.wait();
console.log(mintingTx.transactionHash);
```

**After (Token Registry v5 with TrustVC)**:
If you are migrating to TrustVC, you will use the token-registry-v5 module to access the Token Registry v5 contracts.

```ts
import { v5ContractAddress, v5Contracts, v5Utils, SUPPORTED_CHAINS, CHAIN_ID } from "@trustvc/trustvc";

const walletAddress = await signer.getAddress();
const networkId = await signer.getChainId();
const tDocDeployerAddress = v5ContractAddress.Deployer[networkId];
const implContractAddress = v5ContractAddress.TokenImplementation[networkId];
const tDocDeployerV5 = v5Contracts.TDocDeployer__factory.connect(tDocDeployerAddress, signer);
const initParams = v5Utils.encodeInitParams({
  name,
  symbol,
  deployer: await signer.getAddress(),
});

const { gasStation } = SUPPORTED_CHAINS[networkId as unknown as CHAIN_ID];
const feeData = gasStation && (await gasStation());
const { maxFeePerGas, maxPriorityFeePerGas } = feeData || (await signer.getFeeData());
const { maxFeePerGas, maxPriorityFeePerGas } = feeData || (await signer.getFeeData());
const mintingReceipt = await tDocDeployerV5.deploy(implContractAddress, initParams, {
  maxPriorityFeePerGas: maxPriorityFeePerGas,
  maxFeePerGas: maxFeePerGas,
});
const mintingTx = await mintingReceipt.wait();

console.log(mintingTx.transactionHash);
```

### Connect to Token Registry

In Token Registry v5, the way you connect to a registry hasn’t changed much, but it's **important** to ensure you're using the **updated contract and factory from Token Registry v5**.

**Before (Token Registry v4)**:

```ts
import { TradeTrustToken__factory } from "@tradetrust-tt/token-registry/contracts";

const connectedRegistry = TradeTrustToken__factory.connect(tokenRegistryAddress, signer);
```

**After (Token Registry v5 via TrustVC)**:

If you are migrating to TrustVC, you will use the token-registry-v5 module to access the Token Registry v5 contracts.

```ts
import { v5Contracts } from "@trustvc/trustvc";

const connectedRegistry = v5Contracts.TradeTrustToken__factory.connect(tokenRegistryAddress, signer);
```

**If you are using Token Registry v5 directly (without TrustVC)**:

```ts
import { TradeTrustToken__factory } from "@tradetrust-tt/token-registry/contracts";

const connectedRegistry = TradeTrustToken__factory.connect(tokenRegistryAddress, signer);
```

### Issuing a Document

In Token Registry v5, there is a slight change when you mint tokens. You will now need to pass `remarks` as an optional argument. If no remarks are provided, ensure you pass `0x` to avoid errors.

**Before (Token Registry v4)**:

```ts
await connectedRegistry.mint(beneficiaryAddress, holderAddress, tokenId);
```

**After (Token Registry v5 with TrustVC)**:

```ts
await connectedRegistry.mint(beneficiaryAddress, holderAddress, tokenId, remarks);
```

**If no remarks are passed, the method expects '0x' as the value for remarks**:

```ts
await connectedRegistry.mint(beneficiaryAddress, holderAddress, tokenId, "0x");
```

### Restoring a Document

The restore method remains mostly the same, but you'll now also have the option to include remarks.

**Before (Token Registry v4)**:

```ts
await connectedRegistry.restore(tokenId);
```

**After (Token Registry v5 with TrustVC)**:

```ts
await connectedRegistry.restore(tokenId, remarks);
```

**If no remarks are passed, use '0x'**:

```ts
await connectedRegistry.restore(tokenId, "0x");
```

### Accepting/Burning a Document

You can burn or accept a document in Token Registry v5 by passing remarks as an optional argument.

**Before (Token Registry v4)**:

```ts
await connectedRegistry.burn(tokenId);
```

**After (Token Registry v5 with TrustVC)**:

```ts
await connectedRegistry.burn(tokenId, remarks);
```

**If no remarks are passed, use '0x'**:

```ts
await connectedRegistry.burn(tokenId, "0x");
```

### Function Name Update: getAddress to getEscrowAddress

In Token Registry v4, the method to fetch the address was getAddress(). With Token Registry v5, this has been updated to getEscrowAddress().

**Before (Token Registry v4)**:

```ts
await connectedRegistry.getAddress();
```

**After (Token Registry v5)**:

```ts
await connectedRegistry.getEscrowAddress();
```

### Connecting to Title Escrow

When connecting to Title Escrow, the process is similar. You will use the updated contract from Token Registry v5 or TrustVC depending on your installation choice.

**Before (Token Registry v4)**:

```ts
import { TitleEscrow__factory } from "@tradetrust-tt/token-registry/contracts";

const connectedEscrow = TitleEscrow__factory.connect(existingTitleEscrowAddress, signer);
```

**After (Token Registry v5 with TrustVC)**:

```ts
import { v5Contracts } from "@trustvc/trustvc";

const connectedEscrow = v5Contracts.TitleEscrow__factory.connect(existingTitleEscrowAddress, signer);
```

**If you are still using Token Registry v4 but with TrustVC, you will connect like this**:

```ts
import { v4Contracts } from "@trustvc/trustvc";

const connectedEscrow = v4Contracts.TitleEscrow__factory.connect(existingTitleEscrowAddress, signer);
```

### Function Name Update: Surrender to Return to Issuer

In Token Registry v4, the method to return the title to the issuer was surrender(). With Token Registry v5, this has been updated to returnToIssuer().

**Before (Token Registry v4)**:

```ts
await connectedEscrow.surrender();
```

**After (Token Registry v5 with TrustVC)**:

```ts
await connectedEscrow.returnToIssuer(remarks);
```

**If no remarks are provided, you must pass '0x' as the argument**:

```ts
await connectedEscrow.returnToIssuer("0x");
```

### Rejecting Transfers of Beneficiary/Holder

Token Registry v5 introduces additional methods for rejecting transfers, if necessary, for wrongful transactions:

**Reject Transfer of Ownership**:

Prevents a transfer of ownership to an incorrect or unauthorized party.

```ts
function rejectTransferBeneficiary(bytes calldata _remark) external;
```

**Reject Transfer of Holding**:

Prevents a transfer of holding to an incorrect or unauthorized party.

```ts
function rejectTransferHolder(bytes calldata _remark) external;
```

**Reject Both Roles (Ownership & Holding)**:

Prevents both ownership and holding transfers, effectively rejecting the entire transfer process.

```ts
function rejectTransferOwners(bytes calldata _remark) external;
```
