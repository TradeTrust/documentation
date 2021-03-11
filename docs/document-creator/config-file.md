---
id: config-file
title: Config File
sidebar_label: Config File
---

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

![name](/docs/document-creator/config-file/form-name.png)

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

The `"$template"` field is an object that refers to the custom renderer, please refer to [creating document renderer](https://www.openattestation.com/docs/advanced/custom-renderer).

#### `"issuers"` field

The `"issuers"` is an array of the issuer object. The required fields for each issuer are `name`, `identityProof` and one of `documentStore` OR `tokenRegistry`.

Transferrable document requires a [`tokenRegistry`](https://www.openattestation.com/docs/transferable-record/token-registry), whereas, a verifiable document requires a [`documentStore`](https://www.openattestation.com/docs/verifiable-document/document-store).

The `"name"` field in the `"issuers"` section is a string, which refers to the name of the token registry or the name of the document store.
Please refer to [token registry](https://www.openattestation.com/docs/transferable-record/token-registry) for transferable document or [deploying document store](https://www.openattestation.com/docs/verifiable-document/document-store) for verifiable document, for more information.

The `"tokenRegistry"` field is a string that is the address for the token registry, please refer to [token registry](https://www.openattestation.com/docs/transferable-record/token-registry) for more information.

The `"documentStore"` field is a string that is the address for the document store, please refer to [deploying document store](https://www.openattestation.com/docs/verifiable-document/document-store) for more information.

The `"identityProof"` field is an object that refers to the issuer identity, please refer to [identity Proof](https://www.openattestation.com/docs/advanced/identity-proofs) for more information.

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

### `"Document Storage"` field

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

For the convenience of developers, we provide the below document storage endpoints for the Ropsten testnets.

#### Ropsten document storage endpoint

```
"url": "https://api-ropsten.tradetrust.io/storage"

```

These endpoints may only be used for valid and issued documents on the respective networks, and may not be mixed.

An API key is not required to be provided for these endpoints as they will accept unauthenticated requests.

_Note: **The testnet endpoints do not retain documents permanently and any stored documents will be removed after a period of time**._
