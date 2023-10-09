---
id: file-structure
title: File Structure
sidebar_label: File Structure
---

The configuration file is a JSON file that contains information to configure the application to suit your business needs.

### Config file structure

A reference of a configuration file can be found [here](https://raw.githubusercontent.com/TradeTrust/tradetrust-config/master/build/config-reference-v3.json).

Below are examples of a configuration file

#### Encrypted JSON Wallet

```json
{
  "network": "sepolia",
  "wallet": {
    "type":"ENCRYPTED_JSON",
    "encryptedJson": "{\"address\":\"6a36c563a5350d7be66c801f901a67...\", ...}}",
  },
  "forms": [{...}],
  "documentStorage": {
    "apiKey": "<Document storage API Key>",
    "url": "<Document storage URL>"
  }
}
```

#### Aws Kms Wallet

```json
{
  "network": "sepolia",
  "wallet": {
    "type":"AWS_KMS",
    "accessKeyId": "<IAM Access Key ID>",
    "region": "<Key Region>",
    "kmsKeyId": "<KMS Key Identifier>",
  },
  "forms": [{...}],
  "documentStorage": {
    "apiKey": "<Document storage API Key>",
    "url": "<Document storage URL>"
  }
}
```

Let's break down the properties that make up this config file.

Required properties:

- `"network"` - [Network property](#network-property)
- `"wallet"` - [Wallet property](#wallet-property)
- `"forms"` - [Forms property](#forms-property)

Optional property:

- `"documentStorage"` - [Document Storage property](#document-storage-property)

---

## Network property

The value of `"network"` property is a string that refers to the network in which the document is created in.

Currently, we only support to 5 networks.

- Ethereum Mainnet : `"homestead"`
- Sepolia Testnet : `"sepolia"`
- Polygon Mainnet: `"matic"`
- Mumbai Testnet: `"maticmum"`

---

## Wallet property

The `"wallet"` property is a string that refers to your ethereum wallet. We support two types of wallet options.

- ENCRYPTED_JSON
- AWS_KMS

> **!!! WARNING !!!** This wallet value is highly sensitive. **Do not share** with anyone unless you know what you are doing.

#### ENCRYPTED_JSON Wallet

The wallet property can be derive from either one of these methods:

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

The wallet string should be displayed on your terminal and you can enter it into the `"encryptedJson"` property in the [config file](#encrypted-json-wallet).

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

This result can now be entered into the `"wallet"` property in the [config file](#encrypted-json-wallet).

#### AWS_KMS Wallet

Ethereum uses Elliptic Curve Digital Signing Algorithm (ECDSA). More specifically, the elliptic curve being used for transaction signing is secp256k1

1. If you don't have an Aws Kms Wallet, you can refer to [documentation](https://docs.tradetrust.io/docs/reference/aws-kms/overview) to create a ECC_SECG_P256K1 Key.

2. Connect the Aws Kms Key to an Aws Iam User and enable the signing access control.

3. The IAM credential and KMS Key ID can now be entered into the `"wallet"` property in the [config file](#aws-kms-wallet).

---

## Forms property

The value of `"forms"` property is an array of form object which expect `name`, `type`, `defaults` and `schema` as required properties. `uiSchema`, `extension`, `attachments` and `fileName` are optional properties which can be added.

example of the `"forms"` properties:

```json
{
  "name": "TradeTrust Invoice",
  "type": "VERIFIABLE_DOCUMENT",
  "defaults": {...},
  "schema": {...},
  "uiSchema": {
    "remarks": {
      "ui:widget": "textarea"
    }
  },
  "attachments": {...},
  "extension": "tt",
  "fileName":"demo-<%= field-properties %>"
}
```

- The value of `"name"` property is a string that refers to the name of the form that will display when creating the document, as shown in the image below.

![name](/docs/topics/document-creator/config-file/form-name.png)

- The value of `"type"` property is a string that refers to the type of the document, either `"TRANSFERABLE_RECORD"` or `"VERIFIABLE_DOCUMENT"`.

- The value of `"defaults"` property is an object that contains the settings that you have that are constant among the different documents of the same kind of file. You can use either version 2 or version 3 document in this section. Some examples of default values are the document store address, token registry address, template, issuers, company logo, signatures, etc. are stored here, since they are a constant in the different documents of the same kind. Default values of the form should also be stored here. For example, you can store a default value for a `"title"` property here, this value will be used in the form schema as the value for the `"title"` property in the document.

#### V2 document defaults

Below is an example of the `"defaults"` property:

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
},
```

- The value of `"$template"` property contains an object that refers to the custom renderer, please refer to [creating document renderer](https://www.openattestation.com/docs/developer-section/quickstart/create-custom-renderer).

- The value of `"issuers"` property contains an array of the issuer object. The required properties for each issuer are `name`, `identityProof` and one of `documentStore` OR `tokenRegistry`.

_Transferrable document requires a [`tokenRegistry`](/docs/tutorial/transferable-records/token-registry), whereas, a verifiable document requires a [`documentStore`](/docs/tutorial/verifiable-documents/ethereum/document-store)._

- The `"name"` property in the `"issuers"` section is a string, which refers to the name of the token registry or the name of the document store.
  Please refer to [token registry](/docs/tutorial/transferable-records/token-registry) for transferable document or [deploying document store](/docs/tutorial/verifiable-documents/ethereum/document-store) for verifiable document, for more information.

- The `"tokenRegistry"` property is a string that is the address for the token registry, please refer to [token registry](/docs/tutorial/transferable-records/token-registry) for more information.

- The `"documentStore"` property is a string that is the address for the document store, please refer to [deploying document store](/docs/tutorial/verifiable-documents/ethereum/document-store/) for more information.

- The `"identityProof"` property is an object that refers to the issuer identity, please refer to [identity Proof](https://www.openattestation.com/docs/developer-section/quickstart/configure-dns/) for more information.

#### V3 document defaults

```json
"defaults": {
  "version": "https://schema.openattestation.com/3.0/schema.json",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/io/tradetrust/Invoice/1.0/invoice-context.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json"
  ],
  "type": [
    "VerifiableCredential",
    "OpenAttestationCredential"
  ],
  "issuanceDate": "2010-01-01T19:23:24Z",
  "openAttestationMetadata": {
    "template": {
      "type": "EMBEDDED_RENDERER",
      "name": "INVOICE",
      "url": "https://generic-templates.tradetrust.io"
    },
    "proof": {
      "type": "OpenAttestationProofMethod",
      "method": "DOCUMENT_STORE",
      "value": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
      "revocation": {
        "type": "NONE"
      }
    },
    "identityProof": {
      "type": "DNS-TXT",
      "identifier": "demo-tradetrust.openattestation.com"
    }
  },
  "credentialSubject": {},
  "issuer": {
    "id": "https://example.com",
    "name": "DEMO DOCUMENT STORE",
    "type": "OpenAttestationIssuer"
  }
},
```

- The value of the `"version"` property contains information about the version of the document to be created.

- The value of the `"@context"` property contain value that MUST be an ordered set where the first item is a URI with the value https://www.w3.org/2018/credentials/v1. Subsequent items in the array MUST express context information and be composed of any combination of URIs or objects. It is RECOMMENDED that each URI in the @context be one which, if dereferenced, results in a document containing machine-readable information about the @context.

- The value of the `"type"` property contains value that MUST be, or map to (through interpretation of the @context property), one or more URIs. If more than one URI is provided, the URIs MUST be interpreted as an unordered set.

- The value of the `"issuanceDate"` property MUST be a string value of a combined date-time string representing the date and time the credential becomes valid. Note that this value represents the earliest point in time at which the information associated with the credentialSubject property becomes valid.

- The value of the `"openAttestationMetadata"` properties contains information about the `"template"` and `"proof"`.

- The value of `"template"` property contains an object that refers to the custom renderer, please refer to [creating document renderer](https://www.openattestation.com/docs/developer-section/quickstart/create-custom-renderer).

- The value `"proof"` property contains an object with the necessary information about the `"type"` of proof, `"method"` of proof, `"value"` of the proof method and the `"revocation"` type and status of the document.

- The `"identityProof"` property is an object that refers to the issuer identity, please refer to [identity Proof](https://www.openattestation.com/docs/developer-section/quickstart/configure-dns/) for more information.

- The value of the `"credentialSubject"` property is defined as a set of objects that contain one or more properties that are each related to a subject of the verifiable credential.

- The value of the `"issuer"` property MUST be either a URI or an object containing an id property. It is RECOMMENDED that the URI in the issuer or its id be one which, if dereferenced, results in a document containing machine-readable information about the issuer that can be used to verify the information expressed in the credential.

---

### `"schema"` property

The value of `"schema"` property is an object that is used to generate a document. It follows [JSON schema format.](https://json-schema.org/)

The structure of the schema will derive from the structure of the document you expect to build and will be inline with the custom renderer that you have built for this document.

It will probably be a subset of an already existing schema without the data that you expect to be constants across your document.

An example of the `"schema"` property:

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

### `"Attachments"` property

_Note: This attachments property is optional._

The value of `"attachments"` property contains the information about the required attachments for this document.

_If there is no attachment for the particular form that you are creating, please set `"allow"` property to false._

An example of the `"attachments"` property:

```json
"attachments": {
  "allow": true,
  "accept": [".pdf", ".tt", ".json", ".jpg"]
}
```

- The value of `"allow"` property accepts a boolean value(true or false) and it will display the attachment section based on this value.

- The value of `"accept"` property accepts an array of string, that are file types, which will set the accepted file types for the attachments.

_If you want to accept all file types, remove the entire `"accept"` property from `"attachments"` object._

### `"UiSchema"` property

```json
"uiSchema": {
    "remarks": {
      "ui:widget": "textarea"
    }
  }
```

_Note: This uiSchema property is optional. Only add this section in if you want to provide information on how the selected property should be rendered._

The value of `"uiSchema"` property is basically an object literal providing information on how the selected property should be rendered.

For more information regarding the uiSchema property, please visit [react jsonschema form documents.](https://react-jsonschema-form.readthedocs.io/en/latest/api-reference/uiSchema/)

### `"Extension"` property

```json
"extension": "tradetrust",
```

_Note: This extension property is optional. Only add this section in if you want to generate a document with the specific extension._

The value of `"extension"` property is a string that refers to the extension of the created document.

By default, if this property is not present, it will create the document with ".tt" as the extension.

_i.e. "document-1.tt"_

### `"fileName"` property

```json
"fileName": "ebl-<%= ebl-number %>",
```

Example :

```json
// data.csv file
ebl-number, data, ...
demo-123, data, ...

// config file
{
...,
"fileName": "ebl-<%= ebl-number=%>"
}

The output file name will be "ebl-demo-123".
```

_Note: This fileName property is optional. Only add this section in if you want to customise the file name to follow the form properties when uploading data file._

The `"fileName"` property is a string that refers to the file name of the created document. The method uses interpolate delimiters to interpolate properties of data from data file.

By default, if this property is not present, The documents will follow the forms name with increment number.

_i.e. "document-1"_

---

## Document Storage property

```json
"documentStorage": {
  "apiKey": "<Document storage API Key>",
  "url": "<Document storage URL>"
}
```

_Note: This document storage property is optional. Only add this section in if you want to generate a QRcode for easy sharing._

##### If you do not want to upload your documents to a document storage endpoint you can omit this in the config file.

To use a document storage endpoint, you will have to have the endpoint infrastructure already set up and configured. The value of `"documentStorage"` property is an object which expects an `"url"` property. `"apiKey"` can also be added.

- The value of `"apikey"` property it accepts a string as the API key.
  - If your document storage endpoint does not require an API key, you can omit this property.
- The value of `"url"` property accepts a string which will be the endpoint of the document storage.

##### Document storage endpoint

For the convenience of developers, we provide a [testing environment endpoint](https://github.com/TradeTrust/tradetrust-functions#document-storage) that will work for testnets:

`https://tradetrust-functions.netlify.app/.netlify/functions/storage`

This endpoint may only be used for valid and issued documents on the respective networks, and may not be mixed. An API key has been handled and not required for this example endpoint.

> This API endpoint is a reference on how you would implement such microservices for your own business requirements. It is NOT to be relied on, for any of your production related needs. We reserve the right to change or shutdown the API anytime. We do not retain documents permanently and any stored documents will be removed after a period of time (30 days).
