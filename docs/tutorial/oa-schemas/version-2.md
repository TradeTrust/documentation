---
id: version-2
title: Version 2
sidebar_label: Version 2
---

The OpenAttestation v2.0 defines the shape of data for the `raw document` - the data before the wrapping process. It is defined in [JSON Schema](https://json-schema.org/) format. The official OpenAttestation v2.0 schema can be found [here](https://schema.openattestation.com/2.0/schema.json). Let's look at a simple OA v2 document example:

```json
{
  "$template": {
    "name": "main",
    "type": "EMBEDDED_RENDERER",
    "url": "https://tutorial-renderer.openattestation.com"
  }, // needed for presentation of data in a decentralised renderer
  "issuers": [
    {
      "name": "Demo Issuer",
      "documentStore": "0x51de4F7F47DB190dba3482f94Ace3AdF9872c6dB",
      "revocation": {
        "type": "NONE"
      },
      "identityProof": {
        "type": "DNS-TXT",
        "location": "example.com"
      }
    }
  ], // required
  "recipient": {
    "name": "John Doe"
  }, // optional, basically all your data fields
  "network": {
    "chain": "ETH",
    "chainId": "11155111"
  } // optional, network switching for TradeTrust application end
}
```

Note that some fields are optional so let's focus on the critical ones:

### $template

- `name` = Template name to be use by template renderer to determine the template to use.
- `type` = Type of renderer template. Only `EMBEDDED_RENDERER` as of now.
- `url` = URL of a decentralised renderer to render this document.

### issuers

- `name` = Name of the issuer.
- `documentStore` / `tokenRegistry` = Smart contract etheruem address.
- `revocation` = Optional, revocation status of document. revocation.type of `NONE`, `REVOCATION_STORE`.
- `identityProof.type` = Method type used for identifying issuer. `DNS-TXT`, `DNS-DID` or `DID`.
- `identityProof.location` = URL where custom txt records of `documentStore` / `tokenRegistry` address is created.

> The above 2 fields are needed in all OA v2 documents.
