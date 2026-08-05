---
id: gasless-operations
title: Gasless Operations
sidebar_label: Gasless Operations
---

# Gasless Operations

All functions on this page accept a `smartAccountClient` built as described in [Setup](./setup). They return a `Promise<string>` containing the UserOp transaction hash.

:::tip Remarks encryption
All `remarks` strings are automatically encrypted with the document ID (`options.id`) before being sent on-chain. Pass the document's `id` in the `TransactionOptions` argument whenever remarks are present.
:::

---

## Deploy a Token Registry

Deploys a new `TradeTrustToken` registry clone through the `PlatformPaymaster`. The caller must have at least 1 deployment credit (`setUserWhitelist`).

```ts
import { deployTokenRegistryGasless } from '@trustvc/trustvc';

const txHash = await deployTokenRegistryGasless(
  'My Shipping Line',        // registry name
  'MSL',                     // registry symbol
  smartAccountClient,
  {
    paymasterAddress:          '0xYourPaymaster...',
    tokenRegistryImplAddress:  '0x64bc665056DC8bE4092e569ED13a7F273Be28cD2', // TDocDeployer on Sepolia
  },
);
```

The `RegistryDeployed(user, deployed, creditsLeft)` event is emitted by the paymaster. Parse it from the receipt to get the deployed registry address.

---

## Mint a Document

Mints a new trade document on an authorized registry. Automatically authorizes the beneficiary, holder, and the new `TitleEscrow` on the paymaster.

```ts
import { mintGasless } from '@trustvc/trustvc';

const txHash = await mintGasless(
  {
    paymasterAddress:      '0xYourPaymaster...',
    tokenRegistryAddress:  '0xYourRegistry...',
  },
  smartAccountClient,
  {
    beneficiaryAddress: '0xBeneficiary...',
    holderAddress:      '0xHolder...',
    tokenId:            '0xdeadbeef',  // or a BigInt
    remarks:            'Initial issuance',  // optional
  },
  { id: 'document-uuid' },  // used to encrypt remarks
);
```

The `TitleEscrowLinked(titleEscrow, registry)` event is emitted. Parse it to get the deployed `TitleEscrow` address.

---

## Title Escrow Operations

All operations below target the `TitleEscrow` contract directly. The `smartAccountClient` owner must be the current holder or beneficiary as appropriate.

### Transfer Holder

Transfers the **holder** role to a new address. Caller must be the current holder.

```ts
import { transferHolderGasless } from '@trustvc/trustvc';

const txHash = await transferHolderGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  {
    holderAddress: '0xNewHolder...',
    remarks:       'Transferring to freight forwarder',  // optional
  },
  { id: 'document-uuid' },
);
```

### Transfer Beneficiary (Nominate)

Nominates a new beneficiary. Caller must be the current beneficiary.

```ts
import { transferBeneficiaryGasless } from '@trustvc/trustvc';

const txHash = await transferBeneficiaryGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  {
    newBeneficiaryAddress: '0xNewBeneficiary...',
    remarks:               'Endorsing to buyer',  // optional
  },
  { id: 'document-uuid' },
);
```

### Transfer Both Owners

Transfers holder and beneficiary in one transaction. Caller must be both holder and beneficiary.

```ts
import { transferOwnersGasless } from '@trustvc/trustvc';

const txHash = await transferOwnersGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  {
    newBeneficiaryAddress: '0xNewBeneficiary...',
    newHolderAddress:      '0xNewHolder...',
    remarks:               'Full transfer',  // optional
  },
  { id: 'document-uuid' },
);
```

### Nominate a Beneficiary

Nominates a beneficiary without immediately completing the transfer. The nominated beneficiary must accept separately.

```ts
import { nominateGasless } from '@trustvc/trustvc';

const txHash = await nominateGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  {
    newBeneficiaryAddress: '0xNominatedBeneficiary...',
    remarks:               'Nomination for endorsement',  // optional
  },
  { id: 'document-uuid' },
);
```

### Reject a Pending Transfer — Holder

Rejects a pending holder transfer. Caller must be the current holder.

```ts
import { rejectTransferHolderGasless } from '@trustvc/trustvc';

const txHash = await rejectTransferHolderGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  { remarks: 'Rejecting transfer' },  // optional
  { id: 'document-uuid' },
);
```

### Reject a Pending Transfer — Beneficiary

Rejects a pending beneficiary (nomination). Caller must be the current beneficiary.

```ts
import { rejectTransferBeneficiaryGasless } from '@trustvc/trustvc';

const txHash = await rejectTransferBeneficiaryGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  { remarks: 'Rejecting nomination' },
  { id: 'document-uuid' },
);
```

### Reject a Pending Transfer — Both Owners

Rejects a pending combined transfer. Caller must be both current holder and beneficiary.

```ts
import { rejectTransferOwnersGasless } from '@trustvc/trustvc';

const txHash = await rejectTransferOwnersGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  { remarks: 'Rejecting combined transfer' },
  { id: 'document-uuid' },
);
```

---

## Return to Issuer

At the end of a document's lifecycle, the holder (who is also the beneficiary) returns the token to the issuer.

```ts
import { returnToIssuerGasless } from '@trustvc/trustvc';

const txHash = await returnToIssuerGasless(
  { titleEscrowAddress: '0xTitleEscrow...' },
  smartAccountClient,
  { remarks: 'Surrendering document' },  // optional
  { id: 'document-uuid' },
);
```

### Reject a Returned Document

The platform (registry admin) restores the document back to the title escrow, rejecting the return.

```ts
import { rejectReturnedGasless } from '@trustvc/trustvc';

const txHash = await rejectReturnedGasless(
  { tokenRegistryAddress: '0xYourRegistry...' },
  smartAccountClient,
  {
    tokenId: '0xdeadbeef',
    remarks: 'Return rejected',  // optional
  },
  { id: 'document-uuid' },
);
```

### Accept a Returned Document (Burn)

The platform accepts the return and burns the document.

```ts
import { acceptReturnedGasless } from '@trustvc/trustvc';

const txHash = await acceptReturnedGasless(
  { tokenRegistryAddress: '0xYourRegistry...' },
  smartAccountClient,
  {
    tokenId: '0xdeadbeef',
    remarks: 'Document accepted and destroyed',  // optional
  },
  { id: 'document-uuid' },
);
```

---

## Summary

| Function | Target | Caller |
|---|---|---|
| `deployTokenRegistryGasless` | PlatformPaymaster | Whitelisted user |
| `mintGasless` | PlatformPaymaster | User with MINTER_ROLE |
| `transferHolderGasless` | TitleEscrow | Current holder |
| `transferBeneficiaryGasless` | TitleEscrow | Current beneficiary |
| `transferOwnersGasless` | TitleEscrow | Holder and beneficiary |
| `nominateGasless` | TitleEscrow | Current beneficiary |
| `rejectTransferHolderGasless` | TitleEscrow | Current holder |
| `rejectTransferBeneficiaryGasless` | TitleEscrow | Current beneficiary |
| `rejectTransferOwnersGasless` | TitleEscrow | Holder and beneficiary |
| `returnToIssuerGasless` | TitleEscrow | Holder = beneficiary |
| `rejectReturnedGasless` | Token Registry | Registry admin |
| `acceptReturnedGasless` | Token Registry | Registry admin |
