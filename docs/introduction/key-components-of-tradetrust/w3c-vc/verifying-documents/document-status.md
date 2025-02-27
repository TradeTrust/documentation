---
id: document-status
title: Document Status
sidebar_label: Document Status
---

TradeTrust checks that the document has been issued and that it's issuance status is in good standing (for instance, that it hasn't been revoked).

As of today, TradeTrust supports two ways to verify documents:

- Transferable: Uses Ethereum smart contracts through a Token Registry.
- Non-Transferable: Uses BitString CredentialStatus (specifically, BitStringStatusList2021).
- None

## Transferable

### Ethereum Smart Contracts - Token Registry

The Token Registry smart contract is deployed by individual issuers, such as land title registries (for title deeds) or shipping lines (for bills of lading), to mint transferable records. It stores document ownership by mapping document IDs (also known as token IDs) to title escrow contract addresses.

The Token Registry tracks the ownership state of transferable records using a mapping from document ID to smart contract address. Each document ID (token ID) is the hash of the Verifiable Credential (VC) ID of the individual TradeTrust document, and the corresponding smart contract address represents a title escrow smart contract.

_Sample TransferableRecords credentialStatus within a W3C VC document:_

```js
  "credentialStatus": {
    "type": "TransferableRecords",
    "tokenNetwork": {
      "chain": "ETH",
      "chainId": "1337"
    },
    "tokenRegistry": "0x9Eb613a88534E2939518f4ffBFE65F5969b491FF",
    "tokenId": "1683a00c42430b72c42a8013e6695b839ab7f7b06db69835b974392613826bd2"
  }
```

### Issuance and verification process

1. Create a issuer key pair using `did:web`.

2. Deploys a `Token Registry` contract on a supported network and obtain its address. (This is a one-time action)

3. Bind the registry's identity to the issuer using `did:web`.

4. Prepare the raw Verifiable Credential (VC) payload with a `TransferableRecords` `credentialStatus` object.

5. Sign the VC payload to generate the VC document's `id` and `tokenId`.

6. Issue the document by minting an NFT with the generated `tokenId`, specifying its holder and beneficiary.

7. During verification, the `tokenId` is checked against the `tokenRegistry` address to verify its validity.

For more information, refer to the [Tutorial - Creator](/docs/tutorial/creator)

## Non-Transferable

### BitString CredentialStatus - BitStringStatusList2021

The BitStringStatusList2021 credential status uses a compact, off-chain structure to manage document status efficiently. It relies on a bitstring to represent the state of each document, ensures scalability and reduces on-chain storage costs.

_Sample BitString credentialStatus within a W3C VC document:_

```js
  "credentialStatus": {
    "id": 'https://trustvc.github.io/did/credentials/statuslist/1#1',
    "statusListCredential": 'https://trustvc.github.io/did/credentials/statuslist/1',
    "statusListIndex": '1',
    "statusPurpose": 'revocation',
    "type": 'StatusList2021Entry'
  },
```

_Sample Bitstring Status List._ Example hosted on [GitHub Pages](https://github.com/TrustVC/did/blob/main/credentials/statuslist/1).

```js
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/bbs/v1",
    "https://w3id.org/vc/status-list/2021/v1"
  ],
  "id": "https://trustvc.github.io/did/credentials/statuslist/1",
  "type": [
    "VerifiableCredential",
    "StatusList2021Credential"
  ],
  "issuer": "did:web:trustvc.github.io:did:1",
  "issuanceDate": "2024-10-02T08:49:52.749Z",
  "validFrom": "2024-10-02T08:49:52.435Z",
  "credentialSubject": {
    "id": "https://trustvc.github.io/did/credentials/statuslist/1#list",
    "type": "StatusList2021",
    "statusPurpose": "revocation",
    "encodedList": "H4sIAAAAAAAAA-3BMQEAAAwCoH32b7RoxvAB8gcAAAAAAAAAAAAAAAAAAACMFVeOQ9sAQAAA"
  },
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2024-10-02T08:49:54Z",
    "proofPurpose": "assertionMethod",
    "proofValue": "ohxpxgF6BUhGkSLBSGknWAVgx2flaQ4Hvl8MpD+tvVVEESXlQf0PbefZgg0Kj4+AUQS9wzJ/DjfbmkEkqiQU4RSKC82uPmoL5K7QWQRL4G8tymiY5ITLuRtYeACoiZz/dhF1wxxyJArGEI8ZWGCGNw==",
    "verificationMethod": "did:web:trustvc.github.io:did:1#keys-1"
  }
}
```

### Issuance and verification process

1. A BitString Status List is generated for a batch of documents, where each bit represents the status of a document.

2. Prepare the raw Verifiable Credential (VC) payload with `StatusList2021Entry` `credentialStatus` object, which includes the `statusListIndex`.

3. The BitString Status List can be updated to modify the status of any index. After updating, the list is signed and rehosted.

4. Status verification involves:
   - Fetching the bitstring list associated to the document `id`.
   - Checking the bit corresponding to the document’s `statusListIndex`.

## Without any Document Status

When no document status is explicitly provided, the document's validity is determined based on its document integrity. This implies that the document may be perpetually active, without an explicit expiry date.

### Issuance and verification process

1. No `credentialStatus` required, therefore, no additional issuance steps are necessary.

2. The verification process performs the same integrity check as for standard document integrity verification.
