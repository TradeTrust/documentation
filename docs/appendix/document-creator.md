---
id: document-creator
title: Document Creator
sidebar_label: Document Creator
---

You can use the [document creator](https://creator.tradetrust.io) to create and issue your document.

To use this functionality, you will need a configuration file(`.json` file) and some pre-requisite informations.

---

## What is document creator about?

It's to provide a UI to the staffs that are involved with the daily operations who do not need to know anything about blockchain.

## Why do we do this?

Mainly because we want to cater to small firms or companies that doesn't really have the capabilities to build deep integration with their existing softwares or workflows.

## How is this document creator helping small firms and companies?

One way is for the IT department or someone who is tech savvy enough, can set up the configuration file and clerks or staffs can use this document creator to create the documents.

---

## Pre-requisite

Before you construct your configuration file(`.json` file), please ensure you have these:

- [Wallet (`.json` file)](/docs/wallet/via-cli)
- [Document Store (for verifiable document)](/docs/verifiable-document/document-store)
- [Token Registry (for transferable document)](/docs/transferable-record/token-registry)
- [Configured DNS](/docs/advanced/configuring-dns)
- [Decentralized Renderer](/docs/component/decentralized-renderer-react-components)
- [Document Storage](/docs/appendix/infrastructure-template#storage)

Please refer to the approprate links to prepare them.

---

## Configuration file

The configuration file is a JSON file that contains information to configure the application to suit your business needs.

### Config file structure

Below is an example of the configuration file.

```json
{
  "network": "ropsten",
  "wallet": "{\"address\":\"6a36c563a5350d7be66c801f901a67...\", ...}}",
  "forms": [{...}],
  "documentStorage": {
    "apiKey": "kNb15YYZ6N1zBlYd25cjj8PLgK6YAuvN9Gf7fPM1",
    "url": "https://api-ropsten.tradetrust.io/storage"
  }
}
```

Let's break down the required fields for this config file.

We will need:

- [Network field](#network-field)
- [Wallet field](#wallet-field)
- [Forms field](#forms-field)
- [Document Storage field](#document-storage-field)

---

## Network field

The `"network"` field is a string that refers to the network in which the document is created in.

As of now, we only cater to 3 networks.

- Mainnet : `"homestead"`
- Ropsten testnet : `"ropsten"`
- Rinkeby testnet : `"rinkeby"`

---

## Wallet field

The `"wallet"` field is a string that refers to your ethereum wallet. You can derive it from either one of these methods:

1. If you don't have a wallet, you can refer to [Open Attestation's documentation](https://github.com/Open-Attestation/open-attestation-cli#wallet) to create a wallet.
   _Note: you will need to have Open Attestation Cli installed._ After running OA CLI `wallet create` command, this will give you a wallet.json.

2. Alternatively, you can also generate a wallet.json from an existing account created in Metamask using the OpenAttestation Cli. _Note: you will need to have Open Attestation Cli installed._
   You will have to input your wallet's private key which can be found when you go to your account in Metamask, click on the menu icon, go to
   "Account Details" and click "Export Private Key". You can refer to the [Metamask Support Page](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)
   for a guided walkthrough. You will be prompted to input your Metamask password. Once you have your private key,
   you can key in the following command to generate a wallet.json:

```javascript
open-attestation wallet encrypt -k 0x<privatekey> --of ./wallet.json
```

You will then be prompted to set your wallet password. Once entered, you will see a success message with the path to your wallet.json:

```javascript
ℹ  info      Encrypting a wallet
? Wallet password [hidden]
…  awaiting  Encrypting Wallet [====================] [100/100%]
ℹ  info      Wallet with public address 0xcE16E13045363a4aFb1f4dc6b584256cCb0DDd15 successfully created. Find more details:
✔  success   Wallet successfully saved into /<path>/wallet.json
```

Once you have an existing wallet.json, enter the following command to serialise it into a string:

```
node -r fs -e 'console.log(JSON.stringify(JSON.stringify(JSON.parse(fs.readFileSync("./wallet.json", "utf-8")))));'
```

The wallet string should be displayed on your terminal and you can enter it into the `"wallet"` field in the [config file](#configuration-file).

If you have an existing Metamask account but don't want to use the Open Attestation Cli, you can still get your wallet string doing this:

- Get your private key from Metamask (_See option 2 if unsure_)
- Open your terminal
- Navigate to a repository that has `ether.js`
- Type these commands line by line in the terminal:

```javascript
node;
e = require("ethers");
key = "<Enter private key here>";
wallet = new e.Wallet(key);
wallet.encrypt("<Enter a password of your choice here>").then((str) => console.log(JSON.stringify(str)));
```

(_Note: you can watch a tutorial on this [here](https://www.youtube.com/watch?v=z3l9OSVGHH8&feature=youtu.be&t=577) at 7:29 onwards_)

This result can now be entered into the `"wallet"` field in the [config file](#configuration-file).

---

## Forms field

The `"forms"` field is an array of form object which expect `name`, `type`, `defaults` and `schema`. `attachments` can also be added.

```json
{
  "name": "Cover Letter",
  "type": "VERIFIABLE_DOCUMENT",
  "defaults": {...},
  "schema": {...},
  "attachments": {...}
}
```

### `"name"` field

The `"name"` field is a string that refers to the name of the form that will display when creating the document, as shown in the image below.

![name](/docs/appendix/document-creator/form-name.png)

### `"type"` field

The `"type"` field is a string that reters to the type of the document, either `"TRANSFERABLE_RECORD"` or `"VERIFIABLE_DOCUMENT"`.

### `"defaults"` field

The `"defaults"` field is an object that contains the settings that you have that are constant among the different documents of the same kind of file.

Usually the document store address, token registry address, template, issuers, company logo, signatures, etc. are stored here, since they are a constant in the different documents of the same kind.

Default value of the form should also be stored here.

For example, you can store a default value for a `"title"` field here, this value will be used in the form shema as the value for the `"title"` field.

Below is an example of the `"defaults"` field:

```json
"defaults": {
  "$template": {
    "type": "EMBEDDED_RENDERER",
    "name": "COVERING_LETTER",
    "url": "https://generic-templates.openattestation.com"
  },
  "issuers": [
    {
      "name": "Demo Issuer",
      "documentStore": "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "demo-tradetrust.openattestation.com"
      }
    }
  ],
  "name": "Covering Letter",
  "logo": "https://www.aretese.com/images/govtech-animated-logo.gif",
  "title": "Documents Bundle",
  "remarks": "Some very important documents in here for some submission",
  "uiSchema": {
    "remarks": {
      "ui:widget": "textarea"
    }
  }
},
```

#### `"$template"` field

The `"$template"` field is an object that refers to the custom renderer, please refer to [creating document renderer](/docs/advanced/custom-renderer).

#### `"issuers"` field

The `"issuers"` is an array of the issuer object. The required fields for each issuer are `name`, `identityProof` and one of `documentStore` OR `tokenRegistry`.

Transferrable document requires a [`tokenRegistry`](/docs/transferable-record/token-registry), whereas, a verifiable document requires a [`documentStore`](/docs/verifiable-document/document-store).

The `"name"` field in the `"issuers"` section is a string, which refers to the name of the token registry or the name of the document store.
Please refer to [token registry](/docs/transferable-record/token-registry) for transferable document or [deploying document store](/docs/verifiable-document/document-store) for verifiable document, for more information.

The `"tokenRegistry"` field is a string that is the address for the token registry, please refer to [token registry](/docs/transferable-record/token-registry) for more information.

The `"documentStore"` field is a string that is the address for the document store, please refer to [deploying document store](/docs/verifiable-document/document-store) for more information.

The `"identityProof"` field is an object that refers to the issuer identity, please refer to [identity Proof](/docs/advanced/identity-proofs) for more information.

_Note: any UI schema should be included under defaults as `"uiSchema"` field_

### `"schema"` field

The `"schema"` field is an object used to generate a form. It follows [JSON schema format.](https://json-schema.org/)

The structure of the schema will derived from the structure of the document you expect to build and will be inline with the custom renderer that you have built for this document.

It will probably be a subset of an already existing schema without the data that you expect to be constants across your document.

An example of the `"schema"` field:

```json
"schema": {
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "title": "Document Title"
    },
    "remarks": {
      "type": "string",
      "title": "Remarks"
    }
  }
},
```

### `"Attachments"` field

The `"attachments"` field contains the information about the required attachments for this document.

If there are no attachment for the particular form that you are creating, please set `"allow"` field to false.

An example of the `"attachments"` field:

```json
"attachments": {
  "allow": true,
  "accept": [".pdf", ".tt", ".json", ".jpg"]
}
```

The `"allow"` accepts a boolean value(true or false) and it will display the attachment section based on this value.

The `"accept"` accepts an array of string, that are file types, which will set the accepted file types for the attachments.

If you want to accept all file types, remove the entire `"accept"` line from `"attachments"` object.

---

## Document Storage field

```json
"documentStorage": {
  "apiKey": "kNb15YYZ6N1zBlYd25cjj8PLgK6YAuvN9Gf7fPM1",
  "url": "https://api-ropsten.tradetrust.io/storage"
}
```

_Note: This document storage field is optional. Only add this section in if you want to generate a QRcode for easy sharing._

##### If you do not want to upload your documents to a document storage endpoint you can omit this in the config file.

To use a document storage endpoint, you will have to have the endpoint infrastructure already set up and configured.

You can refer to [infra template's storage section](/docs/appendix/infrastructure-template#storage) for more information.

The `"documentStorage"` field is an object which expects an `"url"` field. `"apiKey"` can also be added.

### `"apikey"` field

The `"apikey"` field is optional, it accepts a string as the API key.

If your document storage endpoint does not requires an API key, you should omit this field.

### `"url"` field

The `"url"` field accepts a string which will be the endpoint of the document storage.

_Note: please ensure that this document storage endpoint has a path `"/storage/queue"` that will return the queue number for storing your document in the document storage endpoint._

For the convenience of developers, we provide the below document storage endpoints for the Ropsten and Rinkeby testnets.

### Ropsten document storage endpoint

```
"url": "https://api-ropsten.tradetrust.io/storage"

```

### Rinkeby document storage endpoint

```
"url": "https://api-rinkeby.tradetrust.io/storage"

```

These endpoints may only be used for valid and issued documents on the respective test networks, and may not be mixed.

For example, a valid Ropsten document will fail validation and fail to be uploaded if the Rinkeby endpoint is specified.

An API key is not required to be provided for these endpoints as they will accept unauthenticated requests.

_Note: **The testnet endpoints do not retain documents permanently and any stored documents will be removed after a period of time**._

---

## Generic Template (Cover Letter)

We have designed and created a simple generic template (cover letter) config file for you to use.

Click <a href="/docs/appendix/document-creator/cover-letter/cover-letter-generic-template-config-file.json" target="_blank" rel="noopener noreferrer" download="cover-letter-generic-template-config-file.json">here</a> to download a config file.

![Generic Template - Cover Letter](/docs/appendix/document-creator/cover-letter/cover-letter-generic-template.png)

Above is an example of how the generic cover letter will look like.

To make full use of this generic template (cover letter), please update the config file as following.

### Fields to update

_Note: **Please replace all the placeholder "<...>" with your values.**_

```json
"network": "<Your network>",
"wallet": "<Your wallet string>",
```

- `"network"` - Update with the desired network. For more information, click [here](#network-field).
- `"wallet"` - Update with your wallet string. For more infomation, click [here](#wallet-field).

```json
"defaults": {
  "$template": { ... },
  "issuers": [
    {
      "name": "Demo Issuer",
      "documentStore": "<Your document store>",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "<Issuer's domain>"
      }
    }
  ],
  "name": "Covering Letter",
  "logo": "<Logo URL>",
  "backgroundColor": "<Background color>",
  "titleColor": "<Title text color>",
  "descriptionColor": "<Remarks text color>",
  "title": "<Default title for the document>",
  "remarks": "<Default remarks for the document>",
  "uiSchema": {
    "remarks": {
      "ui:widget": "textarea"
    }
  }
},

```

- `"documentStore"` - Update with your document store. For more infomation, click [here](/docs/verifiable-document/document-store).
- `"location"` - Update with the Issuer's domain. For more information, click [here](/docs/advanced/identity-proofs).
- `"logo"` - Update with the Logo's URL, to be displayed accordingly as the image above.
- `"backgroundColor"` - Update with the desired background color. The default color(#ffffff) will be used if color is not stated here. i.e. values for this field "#000000", "black"
- `"titleColor"` - Update with the desired title text color. The default color(#4e4e50) will be used if color is not stated here. i.e. values for this field "#ffffff", "white"
- `"descriptionColor"` - Update with the desired description text color. The default color(#4e4e50) will be used if color is not stated here. i.e. values for this field "#ffffff", "white"
- `"title"` - Update with the default title for the document.
- `"remarks"` - Update with the default remarks for the document.

```json
"documentStorage": {
  "apiKey": "<Document storage API Key>",
  "url": "<Document storage URL>"
}
```

- `"apiKey"` - Update with the document storage API key. For more infomation, click [here](#document-storage-field).
- `"url"` - Update with the document storage URL. For more infomation, click [here](#document-storage-field).

_Note: **The "documentStorage" field is optional, if you do not have any document storage endpoint setup, you can omit this entire section.**._

---

## Generic Template (Bill of Lading)

We have designed and created a simple generic template (bill of lading) config file for you to use.

Click <a href="/docs/appendix/document-creator/bill-of-lading/ebl-generic-template-config-file.json" target="_blank" rel="noopener noreferrer" download="ebl-generic-template-config-file.json">here</a> to download a config file.

![Generic Template - Bill of Lading](/docs/appendix/document-creator/bill-of-lading/ebl-generic-template.png)

Above is an example of how the generic bill of lading will look like.

To make full use of this generic template (bill of lading), please update the config file as following.

### Fields to update

_Note: **Please replace all the placeholder "<...>" with your values.**_

```json
"network": "<Your network>",
"wallet": "<Your wallet string>",
```

- `"network"` - Update with the desired network. For more information, click [here](#network-field).
- `"wallet"` - Update with your wallet string. For more infomation, click [here](#wallet-field).

```json
"defaults": {
  "$template": {
    "type": "EMBEDDED_RENDERER",
    "name": "BILL_OF_LADING_GENERIC",
    "url": "https://generic-templates.tradetrust.io"
  },
  "issuers": [
    {
      "identityProof": {
        "type": "DNS-TXT",
        "location": "<Issuer's domain>"
      },
      "name": "DEMO TOKEN REGISTRY",
      "tokenRegistry": "<Your token registry>"
    }
  ],
  "blNumber": "<BL Number>",
  "companyName": "<Company Name>",
  "field1": "<Field1 text>",
  "field2": "<Field2 text>",
  "field3": "<Field3 text>",
  "field4": "<Field4 text>",
  "field5": "<Field5 text>",
  "field6": "<Field6 text>",
  "field7": "<Field7 text>",
  "field8": "<Field8 text>",
  "field9": "<Field9 text>",
      "uiSchema": {
    "logo": {
      "ui:widget": "file"
    }
  }
},

```

- `"tokenRegistry"` - Update with your token registry. For more infomation, click [here](/docs/transferable-record/token-registry).
- `"location"` - Update with the Issuer's domain. For more information, click [here](/docs/advanced/identity-proofs).
- `"blNumber"` - Update with the BL Number, to be displayed accordingly as the image above.
- `"companyName"` - Update with the Company Name, to be displayed accordingly as the image above.
- `"field#"` - Update with the Field content, to be displayed accordingly as the image above.

---
