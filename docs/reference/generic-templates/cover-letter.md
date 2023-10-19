---
id: cover-letter
title: Cover Letter
sidebar_label: Cover Letter
---

We have designed and created a simple generic template (cover letter) config file for you to use.

Click <a href="/docs/topics/generic-templates/cover-letter/cover-letter-generic-template-config-file.json" target="_blank" rel="noopener noreferrer" download="cover-letter-generic-template-config-file.json">here</a> to download a config file.

![Generic Template - Cover Letter](/docs/topics/generic-templates/cover-letter/cover-letter-generic-template.png)

Above is an example of how the generic cover letter will look like.

To make full use of this generic template (cover letter), please update the config file as following.

### Fields to update

_Note: **Please replace all the placeholder "<...>" with your values.**_

```json
"network": "<Your network>",
"wallet": "<Your wallet string>",
```

- `"network"` - Update with the desired network. For more information, click [here](/docs/reference/document-creator/config-file/file-structure#network-field).
- `"wallet"` - Update with your wallet string. For more information, click [here](/docs/reference/document-creator/config-file/file-structure#wallet-field).

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
},

```

- `"documentStore"` - Update with your document store. For more information, click [here](/docs/tutorial/verifiable-documents/ethereum/document-store).
- `"location"` - Update with the Issuer's domain. For more information, click [here](/docs/reference/configuration/configure-dns).
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

- `"apiKey"` - Update with the document storage API key. For more information, click [here](/docs/reference/document-creator/config-file/file-structure#apikey-field).
- `"url"` - Update with the document storage URL. For more information, click [here](/docs/reference/document-creator/config-file/file-structure#url-field).

_Note: **The "documentStorage" field is optional, if you do not have any document storage endpoint setup, you can omit this entire section.**._
