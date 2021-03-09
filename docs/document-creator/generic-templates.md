---
id: generic-templates
title: Generic Templates
sidebar_label: Generic Templates
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

- `"documentStore"` - Update with your document store. For more infomation, click [here](https://www.openattestation.com/docs/verifiable-document/document-store).
- `"location"` - Update with the Issuer's domain. For more information, click [here](https://www.openattestation.com/docs/advanced/identity-proofs).
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

## Generic Template (Transferable Record)

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

- `"tokenRegistry"` - Update with your token registry. For more infomation, click [here](https://www.openattestation.com/docs/transferable-record/token-registry).
- `"location"` - Update with the Issuer's domain. For more information, click [here](https://www.openattestation.com/docs/advanced/identity-proofs).
- `"blNumber"` - Update with the BL Number, to be displayed accordingly as the image above.
- `"companyName"` - Update with the Company Name, to be displayed accordingly as the image above.
- `"field#"` - Update with the Field content, to be displayed accordingly as the image above.
