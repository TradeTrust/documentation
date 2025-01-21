---
id: issuance-status
title: Document Status
sidebar_label: Document Status
---

TradeTrust checks that the document has been issued and that it's issuance status is in good standing (for instance, that it hasn't been revoked). As of today, TradeTrust supports two ways to issue documents: DIDs and Ethereum Smart Contracts.

## Ethereum Smart Contracts

### Token Registry

The Token Registry smart contract is deployed by individual transferable records issuers such as the land title registry (for title deed) or shipping lines (for bill of lading).It stores the ownership of documents through mappings from a document ID (target hash) to a title escrow contract address.

The Token Registry stores the ownership state of the transferable records using a mapping from document ID to smart contract address, where the document ID (also known as the token ID) is the target hash (and merkle root) of the individual TradeTrust document and the smart contract address will be a title escrow smart contract address.

```js
  "credentialStatus": {
    "type": "TransferableRecords",
    "tokenNetwork": {
      "chain": "ETH",
      "chainId": "1337"
    },
    "tokenRegistry": "0x9Eb613a88534E2939518f4ffBFE65F5969b491FF"
  }
```

The process involves:

- Deploying the `Token Registry` contract.

- Binding the registry’s identity to the issuer using `DID:WEB`.

- Issuing documents by minting tokens that represent ownership.

- Shredding documents by interacting with the contract’s shred function.

## BitStringStatusList2021

The BitStringStatusList2021 credential status uses a compact, off-chain structure to manage document status efficiently. It relies on a bitstring to represent the state of each document in a batch.

Workflow

- A bitstring is generated for a batch of documents, where each bit represents the status of a document.

- The bitstring is stored off-chain and linked to a document through its Merkle Root.

- Status verification involves:

  - Fetching the bitstring associated with the Merkle Root.

  - Checking the bit corresponding to the document’s index.

This method ensures scalability and reduces on-chain storage costs.

```js
{
  "@context": [
    "https://www.w3.org/ns/status/v1"
  ],
  "id": "https://issuer.example/status/1",
  "type": "StatusList2021",
  "statusPurpose": "revocation",
  "encodedList": "H4sIAAAAAAAA/+3BQREAAAzCwNGhiJjEIA0go/j9KkjJEgCI7q6uq7+7eyDYbZXhKgAoAQPUsUCoQAAAAA=="
}
```

## DocumentIssuerVerification

The DocumentIssuerVerification credential status employs Decentralized Identifiers (DIDs) for signing and verifying document issuance. DIDs ensure that the document’s provenance can be traced back to a legitimate issuer.

### Issuance Process

- A DID is created for the issuer, providing a public-private key pair.

- The document’s Merkle Root is signed using the private key.

- The signature and DID metadata are added to the document.

- The document is shared with recipients.

### Verification Process

- Extract the DID and its associated public key from the document.

- Use the Merkle Root and signature to verify the document’s authenticity.

- Ensure the public key matches the DID controller.

- This approach offers a cost-effective and decentralized method for verifying document authenticity.

## Issuance and Verification

### Issuance Steps

- Deploy the required credential status mechanism (e.g., Token Registry, BitString, or DID).

- Generate a target hash.

- Issue the document(s) using the corresponding issuance function:

  - Token Registry: mint function.

  - DID: Sign the document with the private key.

### Verification Steps

Retrieve the credential status mechanism from the document metadata. Verify the document’s status by checking:

- Transferable Records: Merkle Root issuance and ownership mapping.

- BitStringStatusList2021: Bitstring status at the document’s index.

- DocumentIssuerVerification: Signature validity and DID metadata.

By integrating these three credential statuses, TradeTrust provides a robust and scalable framework for managing document issuance, verification, and revocation, ensuring trust and transparency in digital transactions.
