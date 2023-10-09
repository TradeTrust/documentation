---
id: tradetrust-document-schema
title: TradeTrust document schema
sidebar_label: TradeTrust document schema
---

To explain on document schema, we will use an sample document. For this example, an invoice document scenario.

## Raw document

Let's take a closer look at a raw invoice document:

```json
{
  "$template": {
    "name": "INVOICE",
    "type": "EMBEDDED_RENDERER",
    "url": "https://generic-templates.tradetrust.io"
  },
  "issuers": [
    {
      "name": "Company A",
      "documentStore": "0x93092C2B449712281008112870063fF439367C00",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "example.tradetrust.io"
      }
    }
  ],
  "network": {
    "chain": "MATIC",
    "chainId": "80001"
  },
  "id": "1111",
  "date": "2018-02-21",
  "customerId": "564",
  "terms": "Due Upon Receipt",
  "billFrom": {
    "name": "ABC Company",
    "streetAddress": "Level 1, Industry Offices",
    "city": "Singapore",
    "postalCode": "123456",
    "phoneNumber": "60305029"
  },
  "billTo": {
    "company": {
      "name": "DEF Company",
      "streetAddress": "Level 2, Industry Offices",
      "city": "Singapore",
      "postalCode": "612345",
      "phoneNumber": "61204028"
    },
    "name": "James Lee",
    "email": "def@company.com"
  },
  "billableItems": [
    {
      "description": "Service Fee",
      "quantity": 1,
      "unitPrice": 200,
      "amount": 200
    },
    {
      "description": "Labor: 5 hours at $75/hr",
      "quantity": 5,
      "unitPrice": 75,
      "amount": 375
    },
    {
      "description": "New client discount",
      "quantity": 1,
      "unitPrice": 50,
      "amount": 50
    }
  ],
  "subtotal": 625,
  "tax": 0,
  "taxTotal": 0,
  "total": 625
}
```

## Document schema

Key fields to note:

- $template
- issuers
- network

> The remaining data values is dependant on the type of document you want to render. They will differ accordingly.

### $template

**Required**. The `$template` key describes the template name used to render this display. It should have the following keys:

- `name` is the name of the template used to render a given TradeTrust document. This allows a single document renderer to render for multiple types of TradeTrust documents; each with a different template name.
- `type` will always take the value of EMBEDDED_RENDERER for documents rendered in this manner.
- `url` will be the remote URL where your decentralized renderer resides.

### issuers

**Required**. The `issuers` key describes who issued this document. It should have the following keys:

- `name` is a name label.
- `documentStore` is the address of your deployed document store.
- `identityProof.type` is the method type of identifying issuer identify.
- `identityProof.location` is the domain URL where document store address is defined as a DNS txt record.

### network

**Optional**. The `network` key is used on TradeTrust website to switch networks accordingly. It should have the following keys:

- `chain` is the currency.
- `chainId` is the network ID.
