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

> **💡 Want to see a complete example?** Check out the [Title Transfer Example](/docs/introduction/key-components-of-tradetrust/transferability/title-transfer-example) for a step-by-step walkthrough with Alice, Bob, and Charlie demonstrating the full transfer workflow.

## 1) Using Code

### Installation

```bash
npm install --save  @trustvc/trustvc
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

> **⚠️ DISCLAIMER**
>
> The TrustVC CLI helps developers prototype and test how document issuance and verification work before integrating the TrustVC core into their own systems.
>
> It should not be used for production issuance or live document management, as it lacks security, scalability, and operational controls required for real-world environments.

#### Binary

To install the binary, simply download the binary from the [CLI release page](https://github.com/trustvc/trustvc-cli/releases) for your OS.

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

Now we will see performing the same transactions via the command line.

> **Note**: All TrustVC CLI commands use an interactive prompt system. The CLI will automatically extract information from your wrapped document and guide you through the required inputs.

### Mint document to token registry

Mint a hash to a token registry deployed on the blockchain. The CLI automatically extracts the token registry address, token ID, and network from the wrapped document.

```bash
trustvc token-registry mint
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file (JSON)
2. **Beneficiary address**: The initial recipient/owner of the document
3. **Holder address**: The initial holder of the document
4. **Wallet selection**: Choose between encrypted wallet, private key file, or environment variable
5. **Remark** (optional, V5 only): Additional remarks to be encrypted and stored

### Transfer/Reject of Holdership

#### Transfer Holdership:

Enables the transfer of holdership rights to another party, allowing them to take temporary possession of the asset.

```bash
trustvc title-escrow transfer-holder
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file (automatically extracts token registry, token ID, and network)
2. **New holder address**: The address of the new holder
3. **Wallet selection**: Choose your wallet type
4. **Remark** (optional, V5 only): Additional remarks

#### Reject Holdership:

Declines a request for holdership transfer, preventing an unauthorized or invalid transaction.

```bash
trustvc title-escrow reject-transfer-holder
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **Wallet selection**: Choose your wallet type
3. **Remark** (optional, V5 only): Additional remarks

### Transfer/Reject of Ownership

#### Transfer Ownership:

Facilitates the transfer of ownership rights to a new owner, making them the legitimate and permanent owner of the asset.

```bash
trustvc title-escrow transfer-owner-holder
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **New owner address**: The address of the new beneficiary (owner)
3. **New holder address**: The address of the new holder
4. **Wallet selection**: Choose your wallet type
5. **Remark** (optional, V5 only): Additional remarks

#### Reject Ownership Transfer:

Prevents a transfer of ownership to an incorrect or unauthorized party.

```bash
trustvc title-escrow reject-transfer-owner-holder
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **Wallet selection**: Choose your wallet type
3. **Remark** (optional, V5 only): Additional remarks

### Nominate Owner

Allows an entity to propose a new owner for the asset, initiating the process for ownership transfer, pending acceptance by the nominated party.

```bash
trustvc title-escrow nominate-transfer-owner
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **New beneficiary address**: The address of the new beneficiary (owner) to nominate
3. **Wallet selection**: Choose your wallet type
4. **Remark** (optional, V5 only): Additional remarks

### Endorse Owner

Confirms and approves the proposed ownership, affirming the nominated individual or entity as the rightful new owner.

```bash
trustvc title-escrow endorse-transfer-owner
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **New beneficiary address**: The address of the new beneficiary to endorse
3. **Wallet selection**: Choose your wallet type
4. **Remark** (optional, V5 only): Additional remarks

### Return to Issuer

Initiates the process of returning the asset to its original issuer (Token Registry), relinquishing all holdership or ownership rights.

```bash
trustvc title-escrow return-to-issuer
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **Wallet selection**: Choose your wallet type
3. **Remark** (optional, V5 only): Additional remarks

### Accept/Reject Return to Issuer

#### Accept Return to Issuer:

Confirms the receipt of the returned asset by the issuer, reinstating their ownership or custodial rights.

```bash
trustvc title-escrow accept-return-to-issuer
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **Wallet selection**: Choose your wallet type
3. **Remark** (optional, V5 only): Additional remarks

#### Reject Return to Issuer:

Declines the return of the asset, maintaining the current holdership or ownership status.

```bash
trustvc title-escrow reject-return-to-issuer
```

The CLI will interactively prompt you for:

1. **Document path**: Path to the wrapped document file
2. **Wallet selection**: Choose your wallet type
3. **Remark** (optional, V5 only): Additional remarks
