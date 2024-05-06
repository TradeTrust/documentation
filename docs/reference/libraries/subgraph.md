---
id: subgraph
title: Subgraph
sidebar_label: Subgraph
---

# Token Registry Subgraph

> The following information is from the [token-registry-subgraph repository](https://github.com/TradeTrust/token-registry-subgraph), refer to the repository for the most recent changes.

This subgraph allows anyone to easily query the network for information about the records from and create opportunities for applications to build on top of your Token Registry contracts.

## Setup

During the setup, you'll need to clone the token-registry-subgraph repository, and do the initial setup so that it can be queried using graphql.

### Configuration

Configure your Token Registry contract addresses in the `config.json` file.

```json
{
  "network": "amoy",
  "dataSources": [
    {
      "address": "0xabc",
      "startBlock": 12345678
    },
    ...
  ]
}
```

- The `network` field can be any one of the many network names supported by the Graph protocol, for eg, `mainnet` for Ethereum mainnet, `matic` for Polygon, `amoy` for Polygon Amoy, etc.
- The `address` is the address of your Token Registry contract and `startBlock` is the start block of your contract.
- You can index multiple Token Registry contracts by adding to the `dataSources` array

### Installation

Next, install and generate the subgraph:

```
# Install all dependencies
npm install

# Generate the subgraph
npm run codegen

# You can also build the subgraph:
npm run build
```

After the installation, the `subgraph.yaml` file should be automatically generated for you based on your configurations
in `config.json`. If you have changes in `config.json`, you will need to run the `prepare` script to re-generate it:

```
npm run prepare
```

## Deployment

The deployment can be done either to the Graph Studio or Hosted Service depending on the network.

### Graph Studio

Authenticate with your Graph deployment key:

```
graph auth
```

Then deploy the subgraph:

```
npm run deploy:studio
```

This deploys the subgraph under the name `token-registry-subgraph`. You can change the name in the `package.json` file.

### Hosted Service

Authenticate with your Graph deployment key:

```
graph auth --product hosted-service
```

Then deploy the subgraph:

```
graph deploy --product hosted-service GITHUB_USERNAME/token-registry-subgraph
```

Alternatively, you can edit the Github username and subgraph name in `package.json` and run `npm run deploy:hosted` to
deploy the subgraph to the hosted service.

### Example Queries

There are many interesting queries that can be made. Here are some example queries:

- What are all the document IDs and their surrender statuses in my Token Registries?
  ```graphql
  {
    tokenRegistries {
      tokens {
        documentId
        surrendered
      }
    }
  }
  ```
- What are all the documents that the user `0xbabe` is currently a beneficiary?
  ```graphql
  {
    accounts(where: { id: "0xbabe" }) {
      id
      titleEscrowsAsBeneficiary {
        token {
          documentId
        }
      }
    }
  }
  ```
- What about listing snapshots of a document at the time of all actions (issuance, surrender, etc)?
  ```graphql
  {
    tokens(where: { documentId: "0x0ddba11" }) {
      tokenSnapshots(orderBy: timestamp) {
        timestamp
        action
        beneficiary {
          id
        }
        holder {
          id
        }
        nominee {
          id
        }
        surrendered
        accepted
      }
    }
  }
  ```
- Can I have the complete token transfers (including holder transfers) and approval histories of the document ID `0x0ddba11`? I want to know the beneficiaries and holders that were transferred to and from.
  > 💡 This query is useful (and also a much easier and elegant way) for building the [endorsement chain](/docs/reference/tradetrust-website/endorsement-chain) of a document or just trying to retrieve the ownership details of any documents.
  ```graphql
  {
    tokens(where: { documentId: "0x0ddba11" }) {
      beneficiaryTransfers(orderBy: timestamp) {
        timestamp
        from {
          id
        }
        to {
          id
        }
      }
      holderTransfers(orderBy: timestamp) {
        timestamp
        from {
          id
        }
        to {
          id
        }
      }
      nominations(orderBy: timestamp) {
        timestamp
        nominee {
          id
        }
      }
    }
  }
  ```

> For a guide on querying on subgraph, refer to the [subgraph documentation](https://thegraph.com/docs/en/querying/querying-from-an-application/)
