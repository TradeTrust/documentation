---
id: endorsement-chain-ethers
title: Endorsement Chain (Ethers.js)
sidebar_label: Endorsement Chain (Ethers.js)
---

## Endorsement Chain (Ethers.js)

```sh
npm install --save @govtechsg/endorsement-chain
```

```ts
import { retrieveEndorsementChain } from "@govtechsg/endorsement-chain";
import { TradeTrustToken__factory } from "@govtechsg/token-registry/contracts";

const tokenRegistry = TradeTrustToken__factory.connect(tokenRegistryAddress, provider);
const tokenId = "0xabcd";
const endorsementChain = retrieveEndorsementChain({ tokenRegistry, tokenId });
console.log(endorsementChain);
```

## How it works internally

1. Retrieve Token Registry and Title Escrow Logs
2. Merge Logs occuring for the same Event
3. Provide context to events based on history of events

### Retrieve Token Registry and Title Escrow Logs

#### Retrieve Token Registry Logs

##### Retrieve Token Registry logs that emits Transfer

[Mint](https://github.com/Open-Attestation/token-registry/blob/f9495dbb716e4a0a818bc08974c2d1efe84b0735/contracts/base/SBTUpgradeable.sol#L236)

[Burn](https://github.com/Open-Attestation/token-registry/blob/f9495dbb716e4a0a818bc08974c2d1efe84b0735/contracts/base/SBTUpgradeable.sol#L259)

[Transfer](https://github.com/Open-Attestation/token-registry/blob/f9495dbb716e4a0a818bc08974c2d1efe84b0735/contracts/base/SBTUpgradeable.sol#L289)

#### Retrieve Title Escrow Logs

##### Retrieve Title Escrow logs that emits BeneficiaryTransfer

[setBeneficiary](https://github.com/Open-Attestation/token-registry/blob/f9495dbb716e4a0a818bc08974c2d1efe84b0735/contracts/TitleEscrow.sol#L268)

##### Retrieve Title Escrow logs that emits HolderTransfer

[setHolder](https://github.com/Open-Attestation/token-registry/blob/f9495dbb716e4a0a818bc08974c2d1efe84b0735/contracts/TitleEscrow.sol#L278)

### Merge Logs

Merge Overlapping Logs into Events

1. Group Log Event with the same Transaction Hash - hash(blockNumber, transactionIndex)
2. Idenitfy Event Type by Log Event Count and their Log Event Type on the same Transaction Hash

   INITIAL (Minting) that emits:

   - Title Escrow
     - HOLDER_TRANSFER
     - OWNER_TRANSFER
   - Token Registry
     - INITIAL

   TRANSFER_OWNERS that emits:

   - Title Escrow
     - HOLDER_TRANSFER
     - OWNER_TRANSFER

   SURRENDER_ACCEPTED (Shred) that emits:

   - Title Escrow
     - HOLDER_TRANSFER
     - OWNER_TRANSFER
   - Token Registry
     - SURRENDER_ACCEPTED

   Others, with only a single event

3. Merge Log Event with the same Transaction Hash into a Single Event as their idenified Event Type (INITIAL, TRANSFER_OWNERS or SURRENDER_ACCEPTED)

### Contextualise Events

1. Sort Events
2. Loop through Events
   1. Copy transaction details from Event
   2. Set holder and owner depending on event type and previous event
   3. Add event to Endorsement Chain
