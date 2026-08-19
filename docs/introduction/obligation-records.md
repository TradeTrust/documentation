---
id: obligation-records
title: Obligation Records
sidebar_label: Obligation Records
---

:::caution Beta
Obligation Registry (Bill of Exchange) support is currently in **beta**. APIs, contract addresses, and behavior may change before the stable release. Use on testnet only and do not rely on this feature in production.
:::

The Obligation Registry is TrustVC's title registry for documents whose lifecycle needs more than "who currently holds it" — it adds a real business **status** on-chain: has the holder accepted the document, rejected it, or has it already been paid off (discharged)? The first document type built on it is the electronic **Bill of Exchange (BoE)**.

It is built on the same [Electronic Transferable Record (ETR)](/docs/how-tos/deployment) foundations as the classic Token Registry / Title Escrow pattern — the same custody model, the same endorsement rules — with one addition: a status field that only the Obligation Registry understands.

> For the full SDK function reference, see the [TrustVC SDK README — Obligation Registry (BoE)](https://github.com/TrustVC/trustvc/blob/v2.16.0-beta.6/README.md#c-obligation-registry-boe).

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

The Obligation Registry mirrors the classic ETR architecture contract-for-contract:

| Use case | Registry | Escrow | Factory |
| --- | --- | --- | --- |
| eBL / ETR | `TradeTrustToken` | `TitleEscrow` | `TitleEscrowFactory` |
| BoE / Obligation | `TrustVCToken` | `ObligationEscrow` | `ObligationEscrowFactory` |

![Obligation Registry architecture compared to classic ETR](/docs/obligation/difference.drawio.png)

Just like Title Escrow, every minted document gets its own `ObligationEscrow` contract holding the token in custody between a **beneficiary** and a **holder**. The only thing `ObligationEscrow` adds on top of `TitleEscrow` is a `status` field and the actions that move it.

## Status Lifecycle

![Bill of Exchange status lifecycle — deploy, mint, transfer, accept/reject, discharge](/docs/obligation/boe-event-lifecycle.png)

A document moves through the lifecycle above from the moment it's minted (`status = Issued`) through to `Accepted`/`Rejected` and, if accepted and paid, `Discharged`. The two guard conditions in the diagram (the red markers) are enforced on-chain, not just in the UI:

- **Accept** / **Reject** can only be called by the **holder**, and only while the **beneficiary and holder are different parties**.
- **Discharge** can only be called by the **beneficiary**, once the document is **Accepted**.
- **Reject** and **Discharge** close the title automatically, in the same transaction — the token is handed back to the registry and burned. There's no separate manual burn step for these two paths.
- **Return to issuer** is the same escape hatch classic ETR already has: it needs a single wallet holding **both** beneficiary and holder, works at any point while the escrow is active, and doesn't touch `status` at all — the issuer then accepts (burns) or rejects (restores) the return.

## How It Differs from Classic ETR

| Capability | Classic ETR | Obligation Registry |
| --- | --- | --- |
| Mint a document | ✅ | ✅ (identical) |
| Transfer beneficiary / holder (endorsement) | ✅ | ✅ (identical) |
| Return to issuer (dual role) | ✅ | ✅ (identical) |
| Pause the registry | ✅ | ✅ (identical) |
| Holder can **accept** or **reject** the document | ❌ | ✅ new |
| Beneficiary can **discharge** the document | ❌ | ✅ new |

Everything else — deploying, minting, endorsing, reading the endorsement chain — works the same way you already know from Token Registry / Title Escrow. The [Deployment](/docs/how-tos/deployment) and [Perform Transaction](/docs/how-tos/transactions) guides walk through each of these for the Obligation Registry specifically.

> Obligation Registry is **v5-only** — there is no v4 equivalent, and classic `token-registry` / `title-escrow` commands should not be used for obligation documents (they'll fail extraction, since obligation documents carry `credentialStatus.obligationRegistry` instead of `credentialStatus.tokenRegistry`).
