---
id: title-transfer
title: Title Transfer Overview
sidebar_label: Overview
---

### Background

Legal asset ownership is typically conferred upon an entity by a document termed as a **Title**, or **Title Deed**. The party who holds this ownership is known as the **Owner**.

In the physical world, an original print of the physical Title can be held by various parties at points in its' life cycle. This is termed **Possession**, or **Holdership**. There are no restrictions on who can have possession of a title, subject to the physical constraints of an existing holder passing holdership to the next holder.

A Title that can have its' Owner changed after issuance, is known as a **Negotiable Title**. Conversely, a Title that has a fixed Owner for the rest of its' lifetime is known as a **Non-negotiable Title**.

In the case where a **Negotiable Title** has its' Owner changed, this procedure is termed **Endorsement**. This change of ownership is only allowed by its' current Owner.

### TradeTrust Contribution

As previously documented under the Token Registry section, we can represent control of a TradeTrust document uniquely and singularly by registering its' hash with the Issuer's token registry. This hash is also known as a **Token ID**. This control will also be referred to as the **Token**.

However, as the ERC721 standard only specifies a single mode of ownership, it cannot represent the duality of physical possession and legal ownership.

In order to properly represent this, we introduce the **Title Escrow** smart contract. This smart contract will hold the Token and subject it to logical rules that we have derived from the existing physical workflow. Since the smart contract holds the Token in escrow, the smart contract, and only the smart contract can allow any changes in the Token status.

### Title Escrow

The Title Escrow is an immutable contract except for its fields. It has two notable fields:

1. The Owner

2. The Holder

#### Owner

Every instance of the Title Escrow consists of the Owner field that changes when a transfer takes place.

There are two scenarios in which this can occur.

Firstly, if Owner and Holder are the same party - he can directly effect a transfer of the Token. This is termed **Immediate Endorsement**.

Secondly, if Owner and Holder are different parties - this is a novel scenario not possible in the current physical model, as physical Endorsement requires the Title be physically signed upon by the Owner and thus making him also the holder.

In this scenario, we allow the Owner to prepare a **Remote Endorsement**, but for it to take effect the holder has to subsequently execute it.

#### Holder

The Holder field is much simpler, and similarly to the physical world - an existing holder (and only the holder) can effect a change in Possession without further approval.

#### Surrender

At the end of its' life cycle, a Title is surrendered back to the Issuer. This is effected by transferring the Token back to the Issuer.

The Title Escrow makes an allowance for this action to be performed by the Owner, only when he is also the holder. This action is termed **Surrender**.

## Manage Assets

User interface of how EBL is transferred/endorsed/surrendered using Manage Assets. (Note that this only appears for Transferable Record type of documents)

![Manage Asset](/docs/topics/introduction/transferable-records/title-transfer/manage-asset.png)

## Summary Table of Actions

<p align="center" width="100%">
  <figure>
      <img src='/docs/topics/introduction/transferable-records/title-transfer/title-escrow-summary.png' />
  </figure>
</p>
