---
id: dns-did
title: Issuer method DID / DNS-DID
sidebar_label: Issuer method DID / DNS-DID
---

:::important
This segment is retained for legacy support for Open Attestation Document. For more information, please refer to v4 docs.
:::

| Requirement                       | DNS-TXT | DNS-DID | DID     |
| --------------------------------- | ------- | ------- | ------- |
| Domain name needed?               | &check; | &check; | &cross; |
| Smart contract deployment needed? | &check; | &cross; | &cross; |
| Identifiable issuer?              | &check; | &check; | &cross; |

> smart contract deployment is the deployment of either document store smart contract or token registry smart contracts.

Alternatively to DNS-TXT method, as an issuer one can use either `DID` or `DNS-DID` issuer method to verify that they indeed sign over the TradeTrust document.

:::note

Please take note of the document types that supports this method of identifying the issuer.

| Document type        | Support DID / DNS-DID |
| -------------------- | --------------------- |
| Verifiable Document  | &check;               |
| Transferable Records | &cross;               |

Not sure which type of document to use?
Have a better understanding about our different document types: [verifiable documents](/docs/4.x/topics/introduction/verifiable-documents/overview) and [Transferable Records](/docs/4.x/topics/introduction/transferable-records/overview).

:::

## Rationale

Decentralized identifiers (DIDs) are a new type of identifier that enables verifiable, decentralized digital identity. DID document associated with DIDs contains a verification method. The owner of a DID can use the private key associated and anyone can verify that the owner control the public key. DID is new, 1.0 specification is recommended in July 2022. One advantage is that this allows our document issuance flow to not rely on the need to write on blockchain, eliminating the need for gas fees. You can read more about DID on [wikipedia](https://en.wikipedia.org/wiki/Decentralized_identifier) or deep dive into [w3c specifications](https://www.w3.org/TR/did-core/).

## How it works

When an individual entity creates an etheruem wallet, it is nothing more than a private / public key pair. The public key can be derived from a wallet address and hence the ethereum wallet address becomes the basis for the DID verification. When we use our private key to sign over `merkleRoot` of our TradeTrust document, `proof.signature` is appended. This is the signature that will be verified against with later in [tt-verify](https://github.com/TradeTrust/tt-verify) library. What happens at this end is the DID document will be resolved and retrieved, verify if the signed message hash equates back to etheruem wallet address, ensuring the document was indeed signed by it's private key. This way we know that it is "issued".

Let's look at the `did:ethr` method:

`did:ethr:<ethereum-address>`

- `did` is the DID method prefix.
- `ethr` signifies the Ethereum-based DID method.
- `<ethereum-address>` is the Ethereum address of the entity being identified.

Example of a DNS-DID signed document:

```json
{
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    "recipient": {
      "name": "bf8e3911-c3fc-44af-828b-c3ca206e1f7e:string:John Doe"
    },
    "$template": {
      "name": "a46be53b-a002-461c-a7cf-caaf7777e27b:string:main",
      "type": "7200491e-c731-43b4-b7c1-74401df1efe0:string:EMBEDDED_RENDERER",
      "url": "a3c6da71-0398-4925-88e4-8bbdc5bc034d:string:https://tutorial-renderer.openattestation.com"
    },
    "issuers": [
      {
        "id": "1bcba98a-90c2-4e84-9d78-7d367329423f:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
        "name": "11fcbdbc-1937-4899-a9cc-2bfc6bdafa31:string:Demo Issuer",
        "revocation": {
          "type": "eb10f23d-4b65-4124-afcb-82b3309468ec:string:NONE"
        },
        "identityProof": {
          "type": "98e739b6-1e5b-4f0e-a858-78e0d5206c3e:string:DNS-DID",
          "location": "e06d6dbe-41c5-4030-ac28-49ec1edb305d:string:demo-tradetrust.openattestation.com",
          "key": "c6df4c02-402c-418c-b8ff-5491d9e5f297:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller"
        }
      }
    ]
  },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "26293946d01299ca359ae40bbc3f6a9aef9654bb666331c604c8c1563faa655b",
    "proof": [],
    "merkleRoot": "26293946d01299ca359ae40bbc3f6a9aef9654bb666331c604c8c1563faa655b"
  },
  "proof": [
    {
      "type": "OpenAttestationSignature2018",
      "created": "2022-10-26T06:19:33.540Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
      "signature": "0x5c18263cc5194605080cffe77f934699d78d63711069cdf9917778ab0316aac1653e00b38537b482b48242bba5f0276f481c50845fce14cc91b4eada9e6a4e461c"
    }
  ]
}
```

## Hands-on Creating a DNS-DID / DID

Before we start creating the DNS-DID / DID, please take note that this method **does not require** any ethers/matic (cryptocurrency) to begin. Which means if you use this method, your verifiable document that you will generate will be free!
Also, please make sure you have completed the prerequisites listed below.

### Prerequisites

- An etheruem wallet. (DID)
- Domain name. (DND-DID)
- Edit access to your domain's DNS records. (DND-DID)

#### Creation of wallet

- Create a [wallet](/docs/4.x/tutorial/prerequisites#wallet-creation).

### Creation of DID

With an etheruem wallet address, you can go to `https://dev.uniresolver.io/1.0/identifiers/did:ethr:<YOUR_WALLET_ADDRESS>`. The returned response is an ethr DID document and it will look something like this:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/secp256k1recovery-2020/v2",
    "https://w3id.org/security/v3-unstable"
  ],
  "id": "did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d",
  "verificationMethod": [
    {
      "id": "did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller",
      "type": "EcdsaSecp256k1RecoveryMethod2020",
      "controller": "did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d",
      "blockchainAccountId": "eip155:1:0xeB68fae40F796d6605d482773c4a7B266da87A0d"
    }
  ],
  "authentication": ["did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller"],
  "assertionMethod": ["did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller"]
}
```

This method (DID) do not require you to own a domain name. However, please take note that when verifying a document created from this method, the Issuer will reflect the wallet address which can be cryptic to most users. An example will look like this:

![DID ethr](/docs/introduction/did-ethr.png)

### DNS-DID

This method concept is the same as `DNS-TXT` method but instead of using a document store or a token registry we tie our DID to a custom txt record that we created in a domain name we own. Refer to below on how to implement.

### How to create DNS-DID Record

Make sure you have a wallet, we are only interested in the wallet address. If you do not have an existing wallet, create one by:

```bash
open-attestation wallet create --of wallet.json
```

```bash
ℹ  info      Creating a new wallet
? Wallet password [hidden]
…  awaiting  Encrypting Wallet [====================] [100/100%]
ℹ  info      Wallet with public address 0xeB68fae40F796d6605d482773c4a7B266da87A0d successfully created.
ℹ  info      Find more details at https://sepolia.etherscan.io/address/0xeB68fae40F796d6605d482773c4a7B266da87A0d
✔  success   Wallet successfully saved into /Users/username/Desktop/tradetrust/wallet.json
```

Using the above example, the [DID document response for the wallet address](https://dev.uniresolver.io/1.0/identifiers/did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d) will look like this:

```json
{
  "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/secp256k1recovery-2020/v2"],
  "id": "did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d",
  "verificationMethod": [
    {
      "id": "did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller",
      "type": "EcdsaSecp256k1RecoveryMethod2020",
      "controller": "did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d",
      "blockchainAccountId": "eip155:1:0xeB68fae40F796d6605d482773c4a7B266da87A0d"
    }
  ],
  "authentication": ["did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller"],
  "assertionMethod": ["did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller"]
}
```

As an issuer, you will need to add a custom TXT record to your domain name. The exact steps to achieve this can be confirmed with your domain name registrar, this is usually achieved through your domain administration web UI.

### Inserting the DNS Record for DID

The following is an example for an issuer:

- Wallet address: `0xeB68fae40F796d6605d482773c4a7B266da87A0d`

```javascript
openatts a=dns-did; p=did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller; v=1.0;
```

Within your domain registrar or DNS provider's web UI, insert a `TXT` record into the DNS in the following format:

| Type | Name        | Value                                   |
| ---- | ----------- | --------------------------------------- |
| TXT  | example.com | "openatts a=dns-did; p=`<DID>`; v=1.0;" |

The `<DID>` value will be `did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller` in this example. Double check if the txt record exists by doing the following:

```bash
open-attestation dns txt-record get --location <YOUR_DOMAIN>
```

Which will display to you the list of the DNS TXT records associated to that location:

```text
┌─────────┬────────────┬───────────┬──────────────────────────────────────────────────────────────────┬─────────┬────────┐
│ (index) │    type    │ algorithm │                            publicKey                             │ version │ dnssec │
├─────────┼────────────┼───────────┼──────────────────────────────────────────────────────────────────┼─────────┼────────┤
│    0    │ 'openatts' │ 'dns-did' │ 'did:ethr:0xeB68fae40F796d6605d482773c4a7B266da87A0d#controller' │  '1.0'  │ false  │
└─────────┴────────────┴───────────┴──────────────────────────────────────────────────────────────────┴─────────┴────────┘

```

> Note that it can take some time for the record to be correctly propagated to the DNS, even though it usually takes 10 to 15s.
