---
id: fetch-endorsement-chain
title: fetchEndorsementChain
sidebar_label: Fetch Endorsement Chain
---

### Description

This function retrieves the endorsement chain of a token by fetching its transfer history from a **Title Escrow contract**. It supports two versions of the Title Escrow contract (V4 and V5) and processes their respective transfer events. If the contract version is V5, it also decrypts any remarks associated with the transfer events.

### Parameters

| Parameter        | Type     | Description                                                 |
| ---------------- | -------- | ----------------------------------------------------------- |
| tokenRegistry    | string   | The address of the Token Registry contract.                 |
| tokenId          | string   | The unique identifier of the token.                         |
| provider         | Provider | A blockchain provider to interact with the smart contracts. |
| keyId (optional) | string   | The key used for decrypting remarks (V5 Title Escrow or Obligation Escrow) — must match the key used to encrypt the remark at write time. |

### Returns:

A Promise `<EndorsementChain>` that resolves to an array of transfer events representing the endorsement chain of the token.

### Functionality Overview

#### 1) Input Validation

- The function checks if tokenRegistry, tokenId, and provider are provided.
- If any required parameter is missing, it throws an error.

#### 2) Determine Token Registry Version

- The function checks whether the Token Registry is V4 or V5 using **isTitleEscrowVersion()**.
- If neither version is detected, it throws an error, as only V4 and V5 are supported.

#### 3) Retrieve Transfer Events

- It fetches the address of the Title Escrow contract for the given token using **getTitleEscrowAddress()**.
- Depending on the version:
  - For V4:
    - It fetches token transfer logs from the registry.
    - It fetches escrow transfer logs from the V4 contract.
    - The logs are merged using **mergeTransfersV4()**.
  - For V5:
    - It fetches escrow transfer logs from the V5 contract.
    - The logs are merged using **mergeTransfersV5()**.

#### 4) Build the Endorsement Chain

- The fetched transfer events are processed into an endorsement chain using **getEndorsementChain()**.
- If the contract is V5, any remarks attached to the events are decrypted using the provided **keyId** (keyId and tokenId are not same).

#### 5) Return the Processed Endorsement Chain

- The function returns the endorsement chain, with decrypted remarks if applicable.

### Example Usage

```typescript
import { fetchEndorsementChain } from "@trustvc/trustvc";

const endorsementChain = await fetchEndorsementChain(
  "0x123456...", // Token Registry Address
  "0x12345", // Token ID
  provider, // Web3 Provider
  "my-decryption-key", // Optional decryption key for remarks VC ID
);
console.log(endorsementChain);
```

Considering a case where you have a VC -

```typescript
const file = event.dataTransfer.files[0];
// considering the VC is the file dropped in the drop box
try {
  const fileContent = await file.text();
  const vc = JSON.parse(fileContent);
  const _provider = new ethers.providers.JsonRpcProvider(rpc);
  //fetch endorsement chain
  const _endorsementChain = await fetchEndorsementChain(
    vc.credentialStatus.tokenRegistry,
    "0x" + vc.credentialStatus.tokenId,
    _provider as any,
    vc.id,
  );
  console.log("Endorsement Chain", _endorsementChain);
} catch (error) {
  console.error(error);
}
```

### Using the CLI

:::caution Beta
Obligation Registry (Bill of Exchange) support — including the CLI commands below — is currently in **beta**. Install the beta CLI (`npm install -g @trustvc/trustvc-cli@beta`) to use these commands. APIs, contract addresses, and behavior may change before the stable release. Use on testnet only and do not rely on this feature in production. This does not affect classic Token Registry / Title Escrow (V4/V5) endorsement chain lookups, which remain stable.
:::

For Obligation Registry titles, the `trustvc` CLI also wraps this lookup as a read-only command:

```bash
# Full history — transfers and status events
trustvc obligation-escrow endorsement-chain

# A single, current snapshot instead of the full history
trustvc obligation-escrow status
```

Both commands are **read-only** — no wallet or private key is requested. They extract the network, `obligationRegistry` address, and token ID from the document you point them at, and decrypt remarks using the document's `id`.

`trustvc obligation-escrow status` output includes the current `status` (`Issued` / `Accepted` / `Rejected` / `Discharged`), whether the title is registered, the termination reason (if the title has been closed), and the escrow's beneficiary/holder/nominee.

### Error Handling

- Throws "Missing required dependencies" if any required parameter is missing.
- Throws if the registry address and token ID can't be resolved to an escrow contract at all (e.g. a wrong registry address, or a token ID that was never minted there).
- Throws "Only Token Registry V4/V5 or Obligation Registry is supported" if the resolved escrow contract doesn't implement Title Escrow V4/V5 or Obligation Escrow.

This function ensures compatibility with V4/V5 Title Escrow and Obligation Escrow, while handling encrypted remarks on both.

### Classic ETR vs. Obligation ETR (Bill of Exchange)

`fetchEndorsementChain` is the **same function** for both -- it auto-detects whether the title's escrow is a classic `TitleEscrow` (V4/V5) or an `ObligationEscrow`, and returns the right kind of history either way. There is no separate "obligation" version to call.

Every entry in the returned chain shares the same shape (`type`, `transactionHash`, `transactionIndex`, `blockNumber`, `owner`, `holder`, `timestamp`, `remark`, and an optional `terminationReason`) -- what differs is which `type` values can appear:

| | Classic ETR (Title Escrow) | Obligation ETR (ObligationEscrow) |
| --- | --- | --- |
| Custody events | `INITIAL`, `TRANSFER_BENEFICIARY`, `TRANSFER_HOLDER`, `TRANSFER_OWNERS`, `REJECT_TRANSFER_*` (V5) | Same custody events, unchanged |
| Return/surrender | `SURRENDERED` / `RETURNED_TO_ISSUER`, `SURRENDER_ACCEPTED` / `RETURN_TO_ISSUER_ACCEPTED`, `SURRENDER_REJECTED` / `RETURN_TO_ISSUER_REJECTED` | `RETURNED_TO_ISSUER`, `RETURN_TO_ISSUER_REJECTED`, `RETURN_TO_ISSUER_ACCEPTED` only for an actual return-to-issuer. The closing shred row may include `terminationReason: ReturnToIssuer` |
| Status events | Not applicable | `STATUS_ACCEPTED`, `STATUS_REJECTED`, `STATUS_DISCHARGED`. Reject and discharge auto-shred in the same transaction — the chain keeps the status type (not `RETURN_TO_ISSUER_ACCEPTED`), with last `owner`/`holder` and optional `terminationReason` (`Rejected` or `Discharged`). The mint's `StatusInitialized` event is merged into the `INITIAL` row |

For a Bill of Exchange VC, pass `credentialStatus.obligationRegistry` (not `tokenRegistry`) as the registry address -- everything else about the call is identical.

### Example Response

**Classic ETR** -- a document minted and then surrendered/returned to the issuer:

```json
[
  {
    "type": "INITIAL",
    "transactionHash": "0x2d98ae3908f0edd095a871a0c56dd3c0e1cfd657b53f28f7c01b1cb83bebc28b",
    "transactionIndex": 5,
    "blockNumber": 6162747,
    "owner": "0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    "holder": "0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    "remark": "",
    "timestamp": 1713778879000
  },
  {
    "type": "SURRENDER_ACCEPTED",
    "transactionHash": "0xcf6968ef91efe74b8ada1770fc31e811f15989f80b0d518a42e06d4ab5bac8bd",
    "transactionIndex": 3,
    "blockNumber": 6242791,
    "owner": "0x0000000000000000000000000000000000000000",
    "holder": "0x0000000000000000000000000000000000000000",
    "remark": "",
    "timestamp": 1713958422000
  }
]
```

**Obligation ETR** -- a Bill of Exchange minted, accepted by the holder, then discharged once paid. `discharge()` emits both `StatusDischarged` and the closing `Shred` event in the same transaction; `fetchEndorsementChain` merges them into a single `STATUS_DISCHARGED` row (not `RETURN_TO_ISSUER_ACCEPTED`, which is classic ETR shred only). The row carries the discharge remark, optional `terminationReason` of `Discharged`, and `owner`/`holder` as the beneficiary/holder at the moment of closure, not the zero address. Reject follows the same pattern as `STATUS_REJECTED`.

```json
[
  {
    "type": "INITIAL",
    "transactionHash": "0x2d98ae3908f0edd095a871a0c56dd3c0e1cfd657b53f28f7c01b1cb83bebc28b",
    "transactionIndex": 5,
    "blockNumber": 6162747,
    "owner": "0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    "holder": "0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    "remark": "issued",
    "timestamp": 1713778879000
  },
  {
    "type": "STATUS_ACCEPTED",
    "transactionHash": "0xd6438cf1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abccc9360",
    "transactionIndex": 1,
    "blockNumber": 6172000,
    "owner": "0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    "holder": "0xd3DD1234567890abcdef1234567890abcdef4749",
    "remark": "accepted",
    "timestamp": 1713782103000
  },
  {
    "type": "STATUS_DISCHARGED",
    "transactionHash": "0xff88591234567890abcdef1234567890abcdef1234567890abcdef1234657135",
    "transactionIndex": 1,
    "blockNumber": 6202088,
    "owner": "0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    "holder": "0xd3DD1234567890abcdef1234567890abcdef4749",
    "remark": "paid in full",
    "timestamp": 1713867129000,
    "terminationReason": "Discharged"
  }
]
```
