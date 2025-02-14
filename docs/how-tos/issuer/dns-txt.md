---
id: dns-txt
title: Issuer method DNS-TXT
sidebar_label: Issuer method DNS-TXT
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

In the current implementation of TradeTrust, we are using the Domain Name System (DNS) as the method of issuer identity verification.
A one-liner introduction to the DNS system can be summarised as: "Phonebook for the Internet". Its primary purpose is to resolve human readable names such as "google.com", or "tradetrust.io", etc. to a set of records.
The most common records are 'A records', which resolve to IP addresses - this allows network routing to operate over the Internet.

For TradeTrust, we are using the `TXT` type of record, which simply allows us to store textual data. The textual data we store indicates the deployed Document Store / Token Registry address that the domain administrator trusts.

By allowing the DNS system to be used as an identity registry, we let domain name owners claim ownership of a Document Store / Token Registry smart contract on the Ethereum / Polygon Blockchain.

:::note

Please take note of the document types that supports this method of identifying the issuer.

| Document type        | Support DNS-TXT |
| -------------------- | --------------- |
| Verifiable Document  | &check;         |
| Transferable Records | &check;         |

Not sure which type of document to use?
Have a better understanding about our different document types: [verifiable documents](/docs/4.x/topics/introduction/verifiable-documents/overview) and [Transferable Records](/docs/4.x/topics/introduction/transferable-records/overview).

:::

## Hands-on Creating a DNS-TXT Record

Before we start creating the DNS-TXT records, please take note that this method **requires** ethers/matic (cryptocurrency) to begin.
Also, please make sure you have completed the prerequisites listed below.

### Prerequisites

- A deployed Document Store / Token Registry.
- Domain name.
- Edit access to your domain's DNS records.

#### Deployment of smart contracts

- How to deploy [Document Store](/docs/4.x/tutorial/verifiable-documents/advanced/document-store/deploying-document-store/document-store-cli).
- How to deploy [Token Registry](/docs/4.x/tutorial/transferable-records/token-registry/token-registry-cli).

### How to create DNS-TXT Record

As an issuer, you will need to add a DNS TXT record to your domain name. The exact steps to achieve this can be confirmed with your domain name registrar, this is usually achieved through your domain administration web UI.

To bind the domain name to the issuer's identity, you must be able to change the DNS record of the domain name.

### Inserting the DNS Record

You will need to add a DNS `TXT` record to your domain name. The exact steps to achieve this can be confirmed with your domain registrar, this is usually achieved through your domain registrar or DNS provider's web UI.

While we have provided [links to guides](#additional-note-for-adding-dns-txt-records) on adding DNS `TXT` records for some common domain registrars and DNS providers, the steps below is a generic procedure for any DNS provider.

Select a domain name that you will like to associate with your documents. The domain can either be the root domain (e.g. `tradetrust.io`) or a subdomain (e.g. `issuer.tradetrust.io`). Using the root domain is recommended as it will be easier for viewers of your documents to recognize visually.

Within your domain registrar or DNS provider's web UI, insert a `TXT` record into the DNS in the following format:

| Type | Name        | Value                                                   |
| ---- | ----------- | ------------------------------------------------------- |
| TXT  | example.com | "openatts net=ethereum netId=11155111 addr=`<ADDRESS>`" |

The `<ADDRESS>` in the `Value` field above is the Document Store / Token Registry smart contract address obtained.

> The quotes around the value are necessary. They are used to delimit each different records that you might have to be bound to the same domain.

An example of a valid DNS `TXT` record is as shown:

| Type | Name                  | Value                                                                                  |
| ---- | --------------------- | -------------------------------------------------------------------------------------- |
| TXT  | sandbox.tradetrust.io | "openatts net=ethereum netId=11155111 addr=0x812A0E71c61A42C8d3d449BdfF51834f85686C73" |

The `TXT` record above is for use for documents issued on the Ethereum `sepolia` network. To bind the identity in production where your documents are issued in the Ethereum `mainnet` network, you will have to change `netId` to `1`.

An example of a valid `TXT` record for Ethereum `mainnet` network is as shown:

| Type | Name                  | Value                                                                           |
| ---- | --------------------- | ------------------------------------------------------------------------------- |
| TXT  | sandbox.tradetrust.io | "openatts net=ethereum netId=1 addr=0x9db35C07350e9a16C828dAda37fd9c2923c75812" |

The `netId` corresponds to the [chain ID for the different Ethereum networks](https://chainid.network/). Here is a list of TradeTrust supported networks:

| Chain ID   | netID      | Name                     | Network Name         |
| ---------- | ---------- | ------------------------ | -------------------- |
| `1`        | `1`        | Ethereum Mainnet         | `homestead`          |
| `11155111` | `11155111` | Ethereum Sepolia Testnet | `sepolia`            |
| `137`      | `137`      | Polygon Mainnet          | `matic`              |
| `80002`    | `80002`    | Polygon Amoy Testnet     | `amoy`               |
| `50`       | `50`       | XDC Mainnet              | `XDC`                |
| `51`       | `51`       | XDC Apothem Testnet      | `xdcapothem`         |
| `101010`   | `101010`   | Stability Mainnet        | `stability`          |
| `20180427` | `20180427` | Stability Testnet        | `stabilitytestnet`   |
| `1338`     | `1338`     | Astron Mainnet           | `astron`             |

### Testing the DNS Record

After adding the `TXT` record, we recommend you to check that the record has been inserted correctly by viewing with [Google DNS](https://dns.google.com/). Make sure to select `TXT` in the _RR Type_ dropdown.

> The DNS propagation should take a few minutes, though in some cases you may need to wait up to 24 hours. Continue with the other parts of the guide while waiting for DNS to propagate.

### Additional Note for Adding DNS `TXT` Records

Below is a list of guides provided by some of the common domain registrars and DNS providers. This list is by no means comprehensive.

- [Amazon Route 53](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/dns-txt-records.html)
- [Cloudflare](https://support.cloudflare.com/hc/en-us/articles/360019093151-Managing-DNS-records-in-Cloudflare)
- [Name.com](https://www.name.com/support/articles/115004972547-Adding-a-TXT-Record)
- [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain)
- [GoDaddy](https://sg.godaddy.com/help/add-a-txt-record-19232)
