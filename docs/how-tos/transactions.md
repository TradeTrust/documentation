---
id: transactions
title: Perform Transactions
sidebar_label: Perform Transactions
---

This document includes a Stateflow diagram illustrating the available actions that can be performed on a token ID by the holder and owner on the blockchain. The Title Escrow contract manages and represents token ownership between a beneficiary and a holder. During minting, the Token Registry creates and assigns a Title Escrow as the owner of the token. Actual owners interact with the Title Escrow contract to execute ownership-related operations.

Below is the Stateflow diagram depicting all the functions of the Title Escrow smart contract.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/transactions/stateflow.png' />
</figure>

Below are the available transactions based on your role (Owner/Holder) and the current state of the token, whether as a Nominee, Previous Holder, or Beneficiary. You can successfully execute transactions depending on the provided state and role conditions.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/transactions/txntable.png' />
</figure>

## Executing Transactions on Title Escrow

To execute these transactions, you can use either the Command Line Interface (CLI) or interact with the smart contract programmatically through code. Below, we provide step-by-step instructions on both methods, starting with the installation process.

### 1) Using Code

#### Installation

```sh
npm install --save @tradetrust-tt/token-registry
```

---

### Usage

To use the package, you will need to provide your own
Web3 [provider](https://docs.ethers.io/v5/api/providers/api-providers/)
or [signer](https://docs.ethers.io/v5/api/signer/#Wallet) (if you are writing to the blockchain).
This package exposes the [Typechain (Ethers)](https://github.com/dethcrypto/TypeChain/tree/master/packages/target-ethers-v6) bindings for the contracts.

### TradeTrustToken

The `TradeTrustToken` is a Soulbound Token (SBT) tied to the Title Escrow. The SBT implementation is loosely based on OpenZeppelin's implementation of the [ERC721](http://erc721.org/) standard.
An SBT is used in this case because the token, while can be transferred to the registry, is largely restricted to its designated Title Escrow contracts.
See issue [#108](https://github.com/Open-Attestation/token-registry/issues/108) for more details.

### Connect to existing token registry

```ts
import { v5Contracts } from "@trustvc/trustvc";

const connectedRegistry = v5Contracts.TradeTrustToken__factory.connect(tokenRegistryAddress, signer);
```

### Issuing a Document

```ts
await connectedRegistry.mint(beneficiaryAddress, holderAddress, tokenId, remarks);
```

### Restoring a Document

```ts
await connectedRegistry.restore(tokenId, remarks);
// Guard - document should be already returned to issuer
```

### Accept/Burn a Document

```ts
await connectedRegistry.burn(tokenId, remarks);
// Guard - document should be already returned to issuer
```

### Title Escrow

The Title Escrow contract is used to manage and represent the ownership of a token between a **`beneficiary`** and **`holder`**.
During minting, the Token Registry will create and assign a Title Escrow as the owner of that token.
The actual owners will use the Title Escrow contract to perform their ownership operations.

:::important

A new `remark` field has been **introduced** for all contract operations.

The `remark` field is optional and can be left empty by providing an empty string `"0x"`.
Please note that any value in the `remark` field is limited to **120** characters, and encryption is **recommended**.

Please refer to the sample encryption implementation .
:::

### Connect to Title Escrow

```ts
import { v5Contracts } from "@trustvc/trustvc";

const connectedEscrow = v5Contracts.TitleEscrow__factory.connect(existingTitleEscrowAddress, signer);
```

### Transfer of Beneficiary/Holder

Transferring of **`beneficiary`** and **`holder`** within the Title Escrow relies on the following methods:

```ts
await connectedTitleEscrow.transferBeneficiary(nominee, remark);
// Guard - nominee ≠ zero_address & owner ≠ newOwner
await connectedTitleEscrow.transferHolder(newHolder, remark);
// Guard - holder ≠ newHolder
await connectedTitleEscrow.transferOwners(nominee, newHolder, remark);
// Guard - holder ≠ newHolder & beneficiary  &ne; newBeneficiary
await connectedTitleEscrow.nominate(nominee, remark);
// Guard - beneficiary ≠ nominee
```

:::note
The `transferBeneficiary` transfers only the beneficiary and `transferHolder` transfers only the holder.
To transfer both beneficiary and holder in a single transaction, use `transferOwners`.

In the event where the **`holder`** is different from the **`beneficiary`**, the transfer of beneficiary will require a nomination done through the `nominate` method.
:::

### Reject Transfers of Beneficiary/Holder

Rejection of transfers for any wrongful transactions.

```ts
await connectedTitleEscrow.rejectTransferBeneficiary(_remark);
// Guard - prevHolder  ≠ zero_address
await connectedTitleEscrow.rejectTransferHolder(_remark);
// Guard - prevBeneficiary  ≠ zero_address
await connectedTitleEscrow.rejectTransferOwners(_remark);
// Guard - prevOwner  ≠ zero_address & prevHolder  ≠  zero_address
```

::: important
Rejection must occur as the very next action after being appointed as **`beneficiary`** and/or **`holder`**. If any transactions occur by the new appointee, it will be considered as an implicit acceptance of appointment.

There are separate methods to reject a **`beneficiary`** (`rejectTransferBeneficiary`) and a **`holder`** (`rejectTransferHolder`). However, if you are both, you must use `rejectTransferOwners`, as the other two methods will not work in this case.
:::

### Return ETR Document to Issuer

Use the `returnToIssuer` method in the Title Escrow.

```ts
await connectedTitleEscrow.returnToIssuer(remark);
// Guard - holder = owner
```

:::important `returnToIssuer` can occur only when the `beneficiary` and `holder` are same.
:::

## 2) Using CLI

### Installation

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

Now we will see performing the same transactions via the command line

### Mint document to token registry

Mint a hash to a token registry deployed on the blockchain. The tokenId option would be used to indicate the document hash, and the to option to indicate the title escrow address the document is mapped to.

```bash
tradetrust token-registry mint --network <NETWORK> --address <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --beneficiary <BENEFICIARY> --holder <HOLDER> [options]
```

### Transfer/Reject of Holdership

#### Transfer Holdership:

Enables the transfer of holdership rights to another party, allowing them to take temporary possession of the asset.

```bash
tradetrust title-escrow change-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --to <TO> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

#### Reject Holdership:

Declines a request for holdership transfer, preventing an unauthorized or invalid transaction.

```bash
tradetrust title-escrow reject-transfer-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING>  --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Transfer/Reject of Ownership

#### Transfer Ownership:

Facilitates the transfer of ownership rights to a new owner, making them the legitimate and permanent owner of the asset.

```bash
tradetrust title-escrow endorse-change-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newOwner <NEW_OWNER_ADDRESS> --newHolder <NEW_HOLDER_ADDRESS> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

#### Reject Ownership Transfer:

Prevents a transfer of ownership to an incorrect or unauthorized party.

```bash
tradetrust title-escrow reject-transfer-owner-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID>  -n sepolia --key <ALICE_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Nominate Owner

Allows an entity to propose a new owner for the asset, initiating the process for ownership transfer, pending acceptance by the nominated party.

```bash
tradetrust title-escrow nominate-change-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newOwner <NEW_OWNER_ADDRESS> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Endorse Owner

Confirms and approves the proposed ownership, affirming the nominated individual or entity as the rightful new owner.

```bash
tradetrust title-escrow endorse-transfer-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newBeneficiary <NEW_OWNER> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Return to Issuer

Initiates the process of returning the asset to its original issuer (Token Registry), relinquishing all holdership or ownership rights.

```bash
tradetrust title-escrow return-to-issuer --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Accept/Reject Return to Issuer

#### Accept Return to Issuer:

Confirms the receipt of the returned asset by the issuer, reinstating their ownership or custodial rights.

```bash
tradetrust title-escrow accept-returned --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

#### Reject Return to Issuer:

Declines the return of the asset, maintaining the current holdership or ownership status.

```bash
tradetrust title-escrow reject-returned --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```
