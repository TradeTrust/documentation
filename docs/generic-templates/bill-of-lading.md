---
id: bill-of-lading
title: Bill of Lading
sidebar_label: Bill of Lading
---

We have designed and created a simple generic template (bill of lading) config file for you to use.

Click <a href="/docs/generic-templates/bill-of-lading/ebl-generic-template-config-file.json" target="_blank" rel="noopener noreferrer" download="ebl-generic-template-config-file.json">here</a> to download a config file.

![Generic Template - Bill of Lading](/docs/generic-templates/bill-of-lading/ebl-generic-template.png)

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
