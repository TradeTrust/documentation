---
id: transactions
title: Perform Transactions
sidebar_label: Obligation Records
---

:::caution Beta
Obligation Registry (Bill of Exchange) support is currently in **beta**. APIs, contract addresses, and behavior may change before the stable release. Use on testnet only and do not rely on this feature in production.
:::

## Background

A Bill of Exchange is a written, unconditional order by one party (the **drawer**) directing another party (the **drawee**) to pay a fixed sum to a payee, either on demand or at a future date. Once the drawee agrees to honour the bill, they are said to have **accepted** it — from that point they are obligated to pay it. If they refuse, they **reject** it. Once the payee has actually been paid, the bill is **discharged**.

None of "accepted", "rejected" or "discharged" exist in a plain ownership registry — they are a real business status, not just a change of hands.

### TrustVC Contribution

The Obligation Registry represents this with a `beneficiary` / `holder` custody model, plus a `status` field that only the current holder and beneficiary — not just anyone — are allowed to move. This is done through the **ObligationEscrow** smart contract.

### ObligationEscrow

During minting, the Obligation Registry (`TrustVCToken`) creates and assigns an `ObligationEscrow` as the owner of that token, which then holds it in custody on behalf of the beneficiary and holder.

#### Beneficiary and Holder

The **beneficiary** holds the underlying rights to the document; the **holder** is the party currently in possession. If beneficiary and holder are the same party, that party can transfer the token directly in one transaction (**immediate endorsement**). If they're different parties, the beneficiary prepares a **remote endorsement** — nominating a new beneficiary — which the holder must then execute for it to take effect. The holder alone can transfer holdership without any nomination step.

#### Status

This is the part that's new. Every `ObligationEscrow` also tracks a `status`:

| Action | Caller | From → To | Effect |
| --- | --- | --- | --- |
| `accept` | Holder (**beneficiary ≠ holder** required) | Issued → Accepted | Title stays active |
| `reject` | Holder (**beneficiary ≠ holder** required) | Issued → Rejected | Auto-closes and burns the title |
| `discharge` | Beneficiary | Accepted → Discharged | Auto-closes and burns the title |

:::important
`reject` and `discharge` close the title automatically, in the same transaction — the token is handed back to the registry and burned. There is no separate burn step to run afterwards for these two paths.
:::

:::note
`accept` and `reject` both require **beneficiary ≠ holder** — a single wallet holding both roles cannot accept or reject on its own. `discharge` has no such requirement; the beneficiary can discharge regardless of who the holder is.
:::

#### Return to Issuer

Return to issuer requires a single wallet holding **both** the current beneficiary and holder roles, and can be called at any point while the escrow is active — it does not require the title to already be Rejected or Discharged, and it does not change `status`.

## Executing Transactions on the Obligation Registry

To execute these transactions, you can use either the Command Line Interface (CLI) or interact with the smart contract programmatically through code.

## 1) Using Code

### Installation

```bash
npm install --save  @trustvc/trustvc@beta
```

---

### Usage

To use the package, you will need to provide your own Web3 [provider](https://docs.ethers.io/v5/api/providers/api-providers/) or [signer](https://docs.ethers.io/v5/api/signer/#Wallet) (if you are writing to the blockchain).

> Full function reference: [TrustVC SDK README — Obligation Registry (BoE)](https://github.com/TrustVC/trustvc/blob/v2.16.0-beta.6/README.md#c-obligation-registry-boe).

### Mint (Issue) a Document

Minting sets the document's status to **Issued** and creates its `ObligationEscrow`, which takes ownership of the newly minted token.

`encryptionKeyId` is whatever key you use to encrypt this remark -- it must be the exact same value later passed as `keyId` to [`fetchEndorsementChain`](/docs/how-tos/fetch-endorsement-chain), or the remark won't decrypt. The `trustvc` CLI always uses the signed document's own `id` for this (see [Fetch Endorsement Chain](/docs/how-tos/fetch-endorsement-chain) for the read side), which is why we set it that way below; calling the SDK directly, you can use any string as long as every write and read for this document use the same one.

```ts
import { mintObligationRegistry } from "@trustvc/trustvc";

const encryptionKeyId = signedDocument.id; // matches the convention used by the CLI and by fetchEndorsementChain

await (
  await mintObligationRegistry(
    { obligationRegistryAddress },
    issuerSigner,
    { beneficiaryAddress, holderAddress, tokenId: "1", remarks: "issued" },
    { chainId, id: encryptionKeyId },
  )
).wait();
```

### Accept a Document

```ts
import { acceptObligationRegistry } from "@trustvc/trustvc";

// encryptionKeyId here must be the same value used at mint (see above)

// Holder accepts — Issued → Accepted
await (
  await acceptObligationRegistry(
    { obligationRegistryAddress, tokenId: "1" },
    holderSigner,
    { remarks: "accepted" },
    { chainId, id: encryptionKeyId },
  )
).wait();
```

### Reject a Document

This is an alternative to accepting — once a document is `Issued`, the holder calls **either** `accept` **or** `reject`, not both (`reject` auto-closes and burns the title, so there is nothing left to accept afterwards).

```ts
import { rejectObligationRegistry } from "@trustvc/trustvc";

// encryptionKeyId here must be the same value used at mint (see above)

// Holder rejects — Issued → Rejected (auto-closes and burns)
await (
  await rejectObligationRegistry(
    { obligationRegistryAddress, tokenId: "1" },
    holderSigner,
    { remarks: "rejected" },
    { chainId, id: encryptionKeyId },
  )
).wait();
```

### Discharge a Document

```ts
import { dischargeObligationRegistry } from "@trustvc/trustvc";

// Beneficiary discharges — Accepted → Discharged (auto-closes and burns)
// encryptionKeyId here must be the same value used at mint (see above)
await (
  await dischargeObligationRegistry(
    { obligationRegistryAddress, tokenId: "1" },
    beneficiarySigner,
    { remarks: "paid in full" },
    { chainId, id: encryptionKeyId },
  )
).wait();
```

### Transfer of Beneficiary/Holder

Transferring **beneficiary** and **holder** uses the following SDK functions:

```ts
import {
  transferBeneficiaryObligationRegistry,
  transferHolderObligationRegistry,
  transferOwnersObligationRegistry,
  nominateObligationRegistry,
} from "@trustvc/trustvc";
```

:::note
`transferBeneficiaryObligationRegistry` transfers only the beneficiary and `transferHolderObligationRegistry` transfers only the holder. To transfer both in a single transaction, use `transferOwnersObligationRegistry`.

When the holder is different from the beneficiary, transferring the beneficiary requires a nomination first, via `nominateObligationRegistry`.
:::

### Reject Transfers of Beneficiary/Holder

```ts
import {
  rejectTransferBeneficiaryObligationRegistry,
  rejectTransferHolderObligationRegistry,
  rejectTransferOwnersObligationRegistry,
} from "@trustvc/trustvc";
```

:::important
Rejection must occur as the very next action after being appointed as beneficiary and/or holder. If any other transaction happens first, it counts as implicit acceptance of the appointment.
:::

### Return Document to Issuer

```ts
import {
  returnToIssuerObligationRegistry,
  acceptReturnedObligationRegistry,
  rejectReturnedObligationRegistry,
} from "@trustvc/trustvc";

// Dual role (beneficiary == holder) returns the title to the registry
// encryptionKeyId here must be the same value used at mint (see above)
await (
  await returnToIssuerObligationRegistry(
    { obligationRegistryAddress, tokenId: "1" },
    dualRoleSigner,
    { remarks: "returning to issuer" },
    { chainId, id: encryptionKeyId },
  )
).wait();

// Issuer accepts the return (burn) ...
await acceptReturnedObligationRegistry(/* ... */);
// ... or rejects it, restoring the title to escrow
await rejectReturnedObligationRegistry(/* ... */);
```

### Reading Status

```ts
import { getObligationRegistryStatus, getObligationEscrowTerminationReason, ownerOfObligationRegistry } from "@trustvc/trustvc";

const status = await getObligationRegistryStatus({ obligationRegistryAddress, tokenId: "1" }, provider);
```

## 2) Using CLI

### Installation

```bash
npm install -g @trustvc/trustvc-cli@beta
```

You can also opt to use npx:

```bash
npx @trustvc/trustvc-cli@beta <arguments>
```

> **Note**: Before minting, set `credentialStatus.obligationRegistry` on your document (not `tokenRegistry`) to your deployed registry address, then sign it with `trustvc w3c-sign`. Mint only accepts a signed document.

### Mint document to the Obligation Registry

```bash
trustvc w3c-sign
trustvc obligation-registry mint
```

The CLI extracts the registry address, token ID, and network from the signed document, then prompts you for the beneficiary and holder addresses and your wallet.

### Accept / Reject / Discharge

```bash
trustvc obligation-escrow accept
trustvc obligation-escrow reject
trustvc obligation-escrow discharge
```

Each prompts you for the document path, your wallet, and an optional remark.

### Status and History

```bash
# Read-only — no wallet required
trustvc obligation-escrow status
trustvc obligation-escrow endorsement-chain
```

### Transfers

```bash
trustvc obligation-escrow transfer-holder
trustvc obligation-escrow nominate-transfer-owner
trustvc obligation-escrow endorse-transfer-owner
trustvc obligation-escrow transfer-owner-holder
trustvc obligation-escrow reject-transfer-holder
trustvc obligation-escrow reject-transfer-owner
trustvc obligation-escrow reject-transfer-owner-holder
```

### Return to Issuer

```bash
trustvc obligation-escrow return-to-issuer
trustvc obligation-escrow accept-return-to-issuer
trustvc obligation-escrow reject-return-to-issuer
```

`return-to-issuer` requires one wallet holding both the current beneficiary and holder roles. `accept-return-to-issuer` requires the registry's **accepter** role (burns the title); `reject-return-to-issuer` requires the **restorer** role (restores it to escrow).

### Verify

```bash
trustvc verify
```

The `trustvc verify` command verifies Bill of Exchange / obligation documents — it auto-detects which check to run from the document's `credentialStatus`.
