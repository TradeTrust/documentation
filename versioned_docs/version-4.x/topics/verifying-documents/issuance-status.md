---
id: issuance-status
title: Issuance Status
sidebar_label: Issuance Status
---

TradeTrust checks that the document has been issued and that it's issuance status is in good standing (for instance, that it hasn't been revoked). As of today, TradeTrust supports two ways to issue documents: DIDs and Ethereum Smart Contracts.

## Ethereum Smart Contracts

### Token Registry

The Token Registry smart contract is deployed by individual transferable records issuers such as the land title registry (for title deed) or shipping lines (for bill of lading). This smart contract replaces the document store smart contract in the previous section. similarly to document store contract, it also has it's identity bound to the issuer using DNS.

The Token Registry stores the ownership state of the transferable records using a mapping from document ID to smart contract address, where the document ID (also known as the token ID) is the target hash (and merkle root) of the individual TradeTrust document and the smart contract address will be a title escrow smart contract address.

### Document Store

The [document store](/docs/4.x/topics/introduction/verifiable-documents/document-store) is a smart contract on the Ethereum network that records the issuance and revocation status of TradeTrust documents. It stores the hashes of wrapped documents, which are the records of the owner of the document store having issued the documents. Before we explain the verification process in detail, we need to introduce a new concept: the `merkleRoot`.

Let's imagine that we need to wrap thousands of files and had to issue the `targetHash` for each of them. It would be extremely inefficient because Ethereum is slow, and we would have to pay for each transaction.

That's where the `merkleRoot` will come in handy.

### merkleRoot

Once the `targetHash` of a document is computed, TradeTrust will determine the `merkleRoot`. The `merkleRoot` value is the merkle root hash computed from the [merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) using the `targetHash` of all the document wrapped together. Each `targetHash` is a leaf in the tree. After computing the merkle tree, the `merkleRoot` associated to a document will be added to it as well as the proofs (intermediate hashes) needed to ensure that the `targetHash` has been used to compute the `merkleRoot`. The proofs are added into the `proof` property.

On a side note, when we wrap only one document at a time, the `targetHash` and the `merkleRoot` are identical and the `proof` is empty. This is completely normal. When we wrap at least 2 documents at the same time, we will notice a difference between `targetHash` and the `merkleRoot`, and proofs appended.

> The `merkleRoot` will always be the same for all the documents wrapped together (in a batch). It will be different for documents wrapped separately.

### Issuance

Now that our batch of documents has a common identifier and that we can prove (thanks to the merkle tree algorithm) that the `targetHash` of a document was used to create a specific `merkleRoot`, we can use the `merkleRoot` in our document store and issue it.

### Revocation

As discussed above, issuance of documents can happen individually or by batch. Issuing a batch documents is by far the more efficient way. When it comes to revocation both values can also be used:

- `targetHash` will allow for the revocation of a specific document.
- `merkleRoot` will allow for the revocation of the whole batch of documents.

### Issuance and verification process

To issue a document, an institution or individual :

- [Deploys a new document store](/docs/4.x/tutorial/verifiable-documents/advanced/document-store/deploying-document-store/document-store-cli) on Ethereum and get the address of the deployed contract. (this action needs to be performed only once)
- Adds the address of the deployed contract into the document (before wrapping).
- Wraps a document (or a batch of documents) and get a `merkleRoot`. The wrapped documents can be shared to the recipients.
- Issues the `merkleRoot` by calling the `issue` function from the document store contract, or `mint` function from the token registry contract.

A TradeTrust verifier:

- Checks the `merkleRoot` of the document has been issued:

  1. Gets back the document store contract address from the document itself.
  2. Ensures that the `targetHash` and the `proof` matches the `merkleRoot`.
  3. Checks the `merkleRoot` is in the document store provided, by calling the `isIssued` function from the deployed contract.
  4. A sample of `isIssued` function will look something like this:

  ```js
  import { providers } from "ethers";
  import { DocumentStoreFactory } from "@tradetrust-tt/tradetrust-core";

  try {
    const documentStore = "0xabc..."; // your document store address
    const merkleRoot = "0x789..."; // your document signature merkleRoot
    const documentStoreContract = await DocumentStoreFactory.connect(documentStore, providers.Provider);
    const issued = await documentStoreContract.isIssued(merkleRoot);
    return issued
      ? {
          issued: true,
          address: documentStore,
        }
      : {
          issued: false,
          address: documentStore,
          reason: {
            message: `Document ${merkleRoot} has not been issued under contract ${documentStore}`,
          },
        };
  } catch (error) {
    // handle error accordingly
  }
  ```

- Checks the `merkleRoot` of the document has been revoked:

  1. Gets back the document store contract address from the document itself.
  2. Checks the `targetHash` is **not** in the document store provided, by calling the `isRevoked` function from the deployed contract.
  3. Checks the `merkleRoot` is **not** in the document store provided, by calling the `isRevoked` function from the deployed contract.
  4. A sample of `isRevoked` function will look something like this:

  ```js
  import { providers } from "ethers";
  import { DocumentStoreFactory } from "@tradetrust-tt/tradetrust-core";

  try {
    const documentStore = "0xabc..."; // your document store address
    const targetHash = "262939..."; // your document signature targetHash
    const proofs = []; // your document signature proof
    const documentStoreContract = await DocumentStoreFactory.connect(documentStore, providers.Provider);
    const intermediateHashes = getIntermediateHashes(targetHash, proofs);
    const revokedHash = await isAnyHashRevoked(documentStoreContract, intermediateHashes);

    return revokedHash
      ? {
          revoked: true,
          address: documentStore,
          reason: {
            message: `Document ${merkleRoot} has been revoked under contract ${documentStore}`,
          },
        }
      : {
          revoked: false,
          address: documentStore,
        };
  } catch (error) {
    // handle error accordingly
  }
  ```

## DIDs

Decentralized identifiers (DIDs) are a new type of identifier that enables verifiable, decentralized digital identity. DID document associated with DIDs contains a verification method, often a public key. The owner of a DID can use the private key associated and anyone can verify that the owner control the public key.

At the moment, TradeTrust only supports one DID method: `ethr`.

### Issuance

DIDs are significantly faster and incur not costs. They could directly use the `targetHash` of the document (which is unique) and sign it using the private key associated. However for consistency with our initial design, we sign the `merkleRoot`.

The information about the signature are added to the document, into the `proof` property. That's it, the document has been issued.

Let's dig a bit more to understand how it works.

An [`ethr` DID document](https://dev.uniresolver.io/1.0/identifiers/did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69) looks like:

```json
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69",
  "publicKey": [
    {
      "id": "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69#controller",
      "type": "Secp256k1VerificationKey2018",
      "controller": "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69",
      "ethereumAddress": "0x6813eb9362372eef6200f3b1dbc3f819671cba69"
    }
  ],
  "authentication": [
    {
      "type": "Secp256k1SignatureAuthentication2018",
      "publicKey": "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69#controller"
    }
  ]
}
```

Three important information can be found:

- the DID identifier (here `did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69`). It's used to identify the DID and must be added into the `issuer.id` property of the document.
- The DID controller (here `did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69#controller`). It's used to identify which public key control the DID and must be added into the `issuer.identityProof.key` property of the document. It's also worth to note that the value is equal to the DID identifier, appended with `#controller`.
- The ethereum address associated to the DID controller (here `0x6813eb9362372eef6200f3b1dbc3f819671cba69`). We will use it to verify the signature.

> You can find an example of document using DID in our [guide](/docs/4.x/tutorial/verifiable-documents/raw-document).

A proof of signature looks like:

```json
{
  "proof": [
    {
      "type": "OpenAttestationSignature2018",
      "created": "2020-10-05T09:05:35.171Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:ethr:0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69#controller",
      "signature": "0x6d0ff5c64b8230cdc471f38267495002f2c762acf7a80250599809ee32b4255377f1adcb56fb712dee66bfeb21be6b5d802f299aea1f1edca129e88e4c1742ce1c"
    }
  ]
}
```

- `signature` is the signed `merkleRoot`
- `verificationMethod` is the DID controller.

That's all the information that we need to verify that the document has been signed with the correct private key. Indeed,`ethr` DID uses [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) with [Secp256k1](https://en.bitcoin.it/wiki/Secp256k1) as parameter of the elliptic curve which provides an interesting property: when we verify a signature, using the initial value (`merkleRoot`), and the signed value (`signature`) it will recover the ethereum address associated with the private key used. We can then compare the ethereum address from the DID document, with the ethereum address returned by the verification. If it matches, the signature is valid.

If you want to dig more on ECDSA, you can read this guide from [Yos Riady](https://yos.io/2018/11/16/ethereum-signatures/).

### Revocation

It's possible to revoke a DID document if a document store has been declared in its revocation block. You can revoke a document using a document store.

Note that if you do use revocation for `DID`, you still need to have at least 1 transaction with the ethereum blockchain to deploy a `documentStore`, which means `DID` flow is not free anymore.

### Issuance and verification process

To issue a document, an institution or individual :

- Creates a new ethr DID (this action needs to be performed only once) and get the private key and the public address.
- Adds the DID address and controller into the document (before wrapping).
- Wraps a document and get a `merkleRoot`.
- Sign the `merkleRoot` using the private key. The signature must be appended into the wrapped document.
- The wrapped document can be shared to the recipients.

An TradeTrust verifier:

- Retrieves the ethereum address associated with the DID identifier and DID controller from the document.
- Retrieves the ethereum used to sign the merkle root.
- Makes sure both addresses match.
