---
id: using-generic-templates
title: Using Generic Templates for Document Preview
sidebar_label: Using Generic Templates
---

# Using Generic Templates for Document Preview

TradeTrust provides a set of pre-designed generic templates for common document types. These templates offer a quick and convenient way to render TradeTrust documents without having to create custom renderers from scratch. This guide will walk you through the process of using these generic templates for your documents.

## Overview of Available Templates

TradeTrust currently offers the following generic templates:

1. **Certificate of Origin (CoO)** - A document certifying the country in which a product was manufactured, grown, or processed.
2. **Electronic Promissory Note (ePN)** - A digital equivalent of a paper-based promissory note, representing a legally binding agreement to repay a debt.
3. **Electronic Bill of Lading (eBL)** - A digital record of a shipment, serving as a receipt, contract of carriage, and document of title.
4. **Invoice** - A commercial document issued by a seller to a buyer, detailing the products or services provided, their quantities and agreed prices, and the total amount due.
5. **Warehouse Receipt** - A document issued by a warehouse operator acknowledging the receipt of goods for storage.

These templates are hosted at `https://generic-templates.tradetrust.io` and can be previewed in the [TradeTrust Gallery](https://gallery.tradetrust.io/), other legacy templates can be previewed in the [Generic Templates Storybook](https://storybook.generic-templates.tradetrust.io/).

## When to Use Generic Templates

Generic templates are ideal for:

- **Demonstration purposes** - When you want to quickly demonstrate TradeTrust functionality
- **Prototyping** - When you're in the early stages of development and need a working renderer
- **Testing** - When you want to test document issuance and verification without creating a custom renderer
- **Simple use cases** - When your document structure aligns well with one of the available templates

However, for production environments or specific document types that require custom branding or layouts, we recommend [creating a custom decentralized renderer](/docs/tutorial/decentralized-renderer.md).

## Using Generic Templates

### 1. Choose the Appropriate Template

First, determine which generic template best fits your document type. You can preview the templates in the [Generic Templates Storybook](https://storybook.generic-templates.tradetrust.io/) to see how they look and what data fields they support.

### 2. Configure Your Document

To use a generic template, you need to configure your document's `renderMethod` field to point to the generic templates renderer and specify the template name:

```json
{
  ...
  "renderMethod": [
    {
      "id": "https://generic-templates.tradetrust.io",
      "type": "EMBEDDED_RENDERER",
      "templateName": "BILL_OF_LADING_CARRIER"
    }
  ],
  ...
}
```

Replace `BILL_OF_LADING_CARRIER` with the appropriate template name from the following options:

- `CHAFTA_COO` - Certificate of Origin template
- `PROMISSORY_NOTE` - Electronic Promissory Note template
- `BILL_OF_LADING_CARRIER` - Electronic Bill of Lading template
- `INVOICE` - Invoice template
- `WAREHOUSE_RECEIPT` - Warehouse Receipt template

### 3. Prepare Your Document Data

Each template requires specific data fields. Below are examples for common templates:

#### Bill of Lading

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/bbs/v1",
    "https://trustvc.io/context/transferable-records-context.json",
    "https://trustvc.io/context/render-method-context.json",
    "https://trustvc.io/context/attachments-context.json",
    "https://trustvc.io/context/bill-of-lading-carrier.json"
  ],
  "type": [
    "VerifiableCredential"
  ],
  "credentialStatus": {
    "type": "TransferableRecords",
    "tokenNetwork": {
      "chain": "MATIC",
      "chainId": "80002"
    },
    "tokenRegistry": "0x3652efbc80ace560844afc932d2bf8b452a96c6d",
    "tokenId": "02d85fa7969fc26d5b6714d09b905e3e7656c0200d6c3734fc7b64db274d4081"
  },
  "renderMethod": [
    {
      "id": "https://generic-templates.tradetrust.io",
      "type": "EMBEDDED_RENDERER",
      "templateName": "BILL_OF_LADING_CARRIER"
    }
  ],
  "credentialSubject": {
    "type": [
      "BillOfLadingCarrier"
    ],
    "shipperAddressStreet": "",
    "consigneeName": "",
    "notifyPartyName": "",
    "blNumber": "20250107",
    "scac": "20250107",
    "attachments": [
      {
        "filename": "word.docx",
        "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "data": "..."
      }
    ]
  },
  "expirationDate": "2025-09-30T15:53:58.112Z",
  "issuer": "did:web:did.trustvc.io",
}
```

### 4. Create and Issue Your Document

You can create and issue sample document using the [TradeTrust Creator (V5 - Mainnet)](https://v5-token-registry.tradetrust.io/creator) / [TradeTrust Creator (V5 - Testnet)](https://v5-token-registry.dev.tradetrust.io/creator).

Alternatively, you can setup your own creator by following the [TradeTrust Creator Tutorial](/docs/tutorial/creator.md).

## Limitations of Generic Templates

While generic templates provide a convenient way to get started, they have some limitations:

1. **Limited customization** - You can only customize the fields provided by the template
2. **Fixed layout** - The overall layout and design cannot be changed
3. **No custom branding** - Limited options for adding your company's branding
4. **No custom logic** - Cannot add custom validation or interactive features

For these reasons, generic templates are recommended primarily for demonstration, testing, and prototyping purposes. For production use, consider [creating a custom decentralized renderer](/docs/tutorial/decentralized-renderer.md).

## Conclusion

Generic templates provide a quick and convenient way to render TradeTrust documents without having to create custom renderers. They are ideal for demonstration, testing, and prototyping purposes, but for production use, consider creating a custom decentralized renderer for greater flexibility and branding control.

By following the steps in this guide, you can effectively use TradeTrust's generic templates to render your documents in a visually appealing way.
