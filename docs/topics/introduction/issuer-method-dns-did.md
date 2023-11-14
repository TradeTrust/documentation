---
id: issuer-method-dns-did
title: Issuer method DID / DNS-DID
sidebar_label: Issuer method DID / DNS-DID
---

|                                   | DNS-TXT (recommended) | DNS-DID | DID     |
| --------------------------------- | --------------------- | ------- | ------- |
| Domain name needed?               | &check;               | &check; | &cross; |
| Smart contract deployment needed? | &check;               | &cross; | &cross; |
| Identifiable issuer?              | &check;               | &check; | &cross; |

Alternatively, as an issuer one can use either `DID` or `DNS-DID` issuer method to verify that they indeed sign over the TradeTrust document.

> This method currently only works for Verifiable Documents.

## Rationale

Decentralized identifiers (DIDs) are a new type of identifier that enables verifiable, decentralized digital identity. DID document associated with DIDs contains a verification method. The owner of a DID can use the private key associated and anyone can verify that the owner control the public key. DID is new, 1.0 specification is recommended in July 2022. One advantage is that this allows our document issuance flow to not rely on the need to write on blockchain, eliminating the need for gas fees. You can read more about DID on [wikipedia](https://en.wikipedia.org/wiki/Decentralized_identifier) or deep dive into [w3c specifications](https://www.w3.org/TR/did-core/).

## How it works

When an individual entity creates an etheruem wallet, it is nothing more than a private / public key pair. The public key can be derived from a wallet address and hence the ethereum wallet address becomes the basis for the DID verification.

Let's look at the `did:ethr` method:

`did:ethr:<ethereum-address>`

- `did` is the DID method prefix.
- `ethr` signifies the Ethereum-based DID method.
- `<ethereum-address>` is the Ethereum address of the entity being identified.

## Prerequisites

- An etheruem wallet. (DID)
- Domain name. (DND-DID)
- Edit access to your domain's DNS records. (DND-DID)

## Creation of wallet

- Create a [wallet](/docs/tutorial/verifiable-documents/ethereum/wallet).

### DID

With an etheruem wallet address, you can go to `https://dev.uniresolver.io/1.0/identifiers/did:ethr:<YOUR_WALLET_ADDRESS>`. The returned response is an ethr DID document and it will look something like this:

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

When we use our private key to sign over `merkleRoot` of our TradeTrust document, `proof.signature` is appended. This is the signature that will be verified against with later in [oa-verify](https://github.com/Open-Attestation/oa-verify) library. What happens at this end is the DID document will be resolved and retrieved, verify if the signed message hash equates back to etheruem wallet address, ensuring the document was indeed signed by it's private key.

This method (DID) do not require you to own a domain name. However, please take note that when verifying a Document created from this method, the Issuer will reflect the wallet address which can be cryptic to most users. An example will look like this:

![DID ethr](/docs/introduction/did-ethr.png)

### DNS-DID

This method concept is the same as `DNS-TXT` method but instead of using a document store or a token registry we tie our DID to a custom txt record that we created in a domain name we own. Refer to below on how to implement.

## How to create DNS-DID Record

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

## Inserting the DNS Record for DID

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
