---
id: obligation-records
title: Obligation Records
sidebar_label: Obligation Records
---

:::caution Beta
Obligation Registry (Bill of Exchange) support is currently in **beta**. APIs, contract addresses, and behavior may change before the stable release. Use on testnet only and do not rely on this feature in production.
:::

The Obligation Registry is TrustVC's title registry for documents whose lifecycle needs more than "who currently holds it" — it adds a real business **status** on-chain: has the holder accepted the document, rejected it, or has it already been paid off (discharged)? The first document type built on it is the electronic **Bill of Exchange (BoE)**.

## When to Use It

Use the **Obligation Registry** when your document's lifecycle needs the system itself to know:

- Has the holder **accepted** the document, or **rejected** it?
- Has the beneficiary been paid — i.e. has the document been **discharged**?

A Bill of Exchange is the clearest example: a drawee has to formally accept or refuse the bill, and once accepted, the payee is eventually paid and the bill is discharged. None of that can be represented by a registry that only tracks who is holding the document.

Keep using the classic **Token Registry / Title Escrow** (ETR) for documents where possession is the whole story — an electronic Bill of Lading or a Title Deed doesn't need an accept/reject/discharge step; it only needs to change hands and eventually be surrendered.

| If your document... | Use |
| --- | --- |
| Only needs to change ownership/holdership and eventually be surrendered (eBL, Title Deed) | Token Registry + Title Escrow (ETR) |
| Also needs a holder to formally accept or reject it, and a beneficiary to mark it paid (Bill of Exchange) | **Obligation Registry** |

## Architecture

The Obligation Registry is built from three contracts:

| Contract | Role |
| --- | --- |
| `TrustVCToken` | The registry contract — an ERC-721 token representing each Bill of Exchange document on-chain. |
| `ObligationEscrowFactory` | Creates a new `ObligationEscrow` for each minted document. |
| `ObligationEscrow` | Holds a minted document in custody between a **beneficiary** and a **holder**, and tracks a `status` field together with the actions that move it. |

## Status Lifecycle

![Bill of Exchange status lifecycle — deploy, mint, transfer, accept/reject, discharge](/docs/obligation/boe-event-lifecycle.png)

A document moves through the lifecycle above from the moment it's minted (`status = Issued`) through to `Accepted`/`Rejected` and, if accepted and paid, `Discharged`. The two guard conditions in the diagram (the red markers) are enforced on-chain, not just in the UI:

- **Accept** / **Reject** can only be called by the **holder**, and only while the **beneficiary and holder are different parties**.
- **Discharge** can only be called by the **beneficiary**, once the document is **Accepted**.
- **Reject** and **Discharge** close the title automatically, in the same transaction — the token is handed back to the registry and burned. There's no separate manual burn step for these two paths.
- **Return to issuer** is an escape hatch: it needs a single wallet holding **both** beneficiary and holder, works at any point while the escrow is active, and doesn't touch `status` at all — the issuer then accepts (burns) or rejects (restores) the return.

## Capabilities

The Obligation Registry supports:

- Minting a document
- Transferring beneficiary / holder (endorsement)
- Returning a document to the issuer (dual role)
- Pausing the registry
- The holder **accepting** or **rejecting** the document
- The beneficiary **discharging** the document

The [Deployment](/docs/how-tos/obligation-registry/deployment) and [Perform Transaction](/docs/how-tos/obligation-registry/transactions) guides walk through deploying, minting, endorsing, and reading the endorsement chain for the Obligation Registry.

> Obligation Registry is **v5-only** — there is no v4 equivalent, and classic `token-registry` / `title-escrow` commands should not be used for obligation documents (they'll fail extraction, since obligation documents carry `credentialStatus.obligationRegistry` instead of `credentialStatus.tokenRegistry`).
