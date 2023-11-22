---
id: tradetrust-document-schema
title: TradeTrust document schema
sidebar_label: TradeTrust document schema
---

To explain on document schema, we will use a sample document. For this example, an invoice document scenario. As of today we are using schema version 2, there is an [alpha version 4](/docs/topics/technical/document-schema/version-4) which is more aligned with w3c VC data model. Find out more from the links at bottom of the page.

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

## Wrapped document

Then go ahead to [wrap](/docs/tutorial/verifiable-documents/ethereum/wrapping-document) the document:

```json
{
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    "$template": {
      "name": "dbe7b89b-6e8f-46db-b33d-dfd03da5f48f:string:INVOICE",
      "type": "61d7a1b8-922b-4b62-ac94-79e6e992873e:string:EMBEDDED_RENDERER",
      "url": "9a7e19db-5b49-4f0f-9b6a-bc77fe4d3f6d:string:https://generic-templates.tradetrust.io"
    },
    "issuers": [
      {
        "name": "6dffe197-3fbb-41a5-ae7d-746d3a368dd8:string:Company A",
        "documentStore": "74ede7ce-d21d-4dad-bb95-abc771824b8f:string:0x93092C2B449712281008112870063fF439367C00",
        "identityProof": {
          "type": "d2395082-23d2-445b-b66b-9df3e061b9bc:string:DNS-TXT",
          "location": "e130b669-9612-4d73-bc7d-cc3d1937a6c8:string:example.tradetrust.io"
        }
      }
    ],
    "network": {
      "chain": "1e24be19-2e17-4b3f-ba24-22b8918b8b42:string:MATIC",
      "chainId": "c17c5cbe-df15-4756-9f03-e61a0c6c71a8:string:80001"
    },
    "id": "fd3b78f1-3fd9-4b82-8656-108a1cae2fea:string:1111",
    "date": "f70b8e47-e6e2-4006-8765-074384e554c9:string:2018-02-21",
    "customerId": "79a90de9-3e76-49f8-9bad-a6595d8e6c78:string:564",
    "terms": "9d0f1d6f-bce6-4493-9c61-9f7b13d37fbc:string:Due Upon Receipt",
    "billFrom": {
      "name": "ea7a33a0-8e6e-4b17-a17c-5fad99921738:string:ABC Company",
      "streetAddress": "f5e860b4-ddce-496f-b329-4c2ba8719ef0:string:Level 1, Industry Offices",
      "city": "8b602072-dd44-43f9-abc5-951eff0f6f87:string:Singapore",
      "postalCode": "16355f74-f42c-4cd1-ab2a-a2a291ab4ed0:string:123456",
      "phoneNumber": "4691db25-3475-4a2e-8e54-e79ac5659e25:string:60305029"
    },
    "billTo": {
      "company": {
        "name": "0043ba72-95d9-4756-9f36-4b19f0ad881b:string:DEF Company",
        "streetAddress": "9860a767-67bc-4cdc-a95e-1a0ec19cad7d:string:Level 2, Industry Offices",
        "city": "62ecda9d-f45e-46bb-9b61-a8bf1c78e004:string:Singapore",
        "postalCode": "98d54d39-98ed-459e-a63d-9d2b1bb719ba:string:612345",
        "phoneNumber": "a6eedf84-7fc9-485a-ba5c-b252bbdeb714:string:61204028"
      },
      "name": "a1434995-25e1-40de-86d1-c70441bb9402:string:James Lee",
      "email": "e7ef43bb-91e1-42e6-9a08-5445ff1a528f:string:def@company.com"
    },
    "billableItems": [
      {
        "description": "297b2fd0-f5d3-4847-91e4-8fd1fb6b35fa:string:Service Fee",
        "quantity": "b5c8867b-f3f8-484e-bd1c-b6fcf89c55f7:number:1",
        "unitPrice": "10b982d1-50bf-46a6-a109-81bfc9515ad5:number:200",
        "amount": "29dd3ee2-e06f-4440-bf74-6e2cae297ab2:number:200"
      },
      {
        "description": "6958d901-e980-4a2c-b9fc-f9bbad110bd7:string:Labor: 5 hours at $75/hr",
        "quantity": "5281a770-56e7-41c0-9c07-bdbb1a15c91d:number:5",
        "unitPrice": "b5a6ca9f-70fa-4fc0-a33e-6dc8ce002251:number:75",
        "amount": "875744d3-847b-4f2e-821e-b70e06cf9c75:number:375"
      },
      {
        "description": "e4b9d887-b85b-4c70-a783-bd9fc91e28ff:string:New client discount",
        "quantity": "80774862-e365-45f6-833f-c65c322ee444:number:1",
        "unitPrice": "01d7e508-c86a-4215-864b-5b1502109dde:number:50",
        "amount": "a1c5213e-9554-4bd3-976e-1e4404e2290f:number:50"
      }
    ],
    "subtotal": "7e381d92-a018-4974-86d5-a48ceb4bf75e:number:625",
    "tax": "3a8fbcbf-effc-473d-a0d6-76c4e81bb569:number:0",
    "taxTotal": "a26713ed-c1d5-46df-b59d-ce2a9fa9ff1b:number:0",
    "total": "5699877b-c408-4152-b973-0f61387dc27d:number:625"
  },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "68e321377e09301a6a7034a18b13f01630fd25afadd567729855a06270ba33f1",
    "proof": [],
    "merkleRoot": "68e321377e09301a6a7034a18b13f01630fd25afadd567729855a06270ba33f1"
  }
}
```

This will give us both `targetHash` and `merkleRoot`. Please read more on the [Document Integrity](/docs/topics/verifying-documents/document-integrity#the-signature-object) section on how the hashes are derived upon.

## Document schema

Key fields to note:

- $template
- issuers
- network

> The remaining data values are dependant on the type of document you want to render. They will differ accordingly.

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

### Schema versions

- [V2](/docs/topics/technical/oa-schemas/version-2).
- [V4 (alpha)](/docs/topics/technical/oa-schemas/version-4).
