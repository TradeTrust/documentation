---
id: using-generic-templates
title: Using Generic Templates for Document Preview
sidebar_label: Using Generic Templates
---

# Using Generic Templates for Document Preview

TradeTrust provides a set of pre-designed generic templates for common document types. These templates offer a quick and convenient way to render TradeTrust documents without having to create custom renderers from scratch. This guide will walk you through the process of using these generic templates for your documents.

## Overview of Available Templates

TradeTrust currently offers the following generic templates:

1. **Bill of Lading** - For shipping documents that acknowledge receipt of cargo
2. **Bill of Lading (Generic)** - A more flexible version of the Bill of Lading template
3. **Certificate of Origin** - For documents certifying the origin of goods
4. **Covering Letter** - For cover letters accompanying other documents
5. **Invoice** - For commercial invoices
6. **XmlRenderer** - For rendering XML-based documents

These templates are hosted at `https://generic-templates.tradetrust.io` and can be previewed in the [Generic Templates Storybook](https://storybook.generic-templates.tradetrust.io/).

## When to Use Generic Templates

Generic templates are ideal for:

- **Demonstration purposes** - When you want to quickly demonstrate TradeTrust functionality
- **Prototyping** - When you're in the early stages of development and need a working renderer
- **Testing** - When you want to test document issuance and verification without creating a custom renderer
- **Simple use cases** - When your document structure aligns well with one of the available templates

However, for production environments or specific document types that require custom branding or layouts, we recommend [creating a custom decentralized renderer](/docs/how-tos/document-preview-templates/custom-decentralized-renderer).

## Using Generic Templates

### 1. Choose the Appropriate Template

First, determine which generic template best fits your document type. You can preview the templates in the [Generic Templates Storybook](https://storybook.generic-templates.tradetrust.io/) to see how they look and what data fields they support.

### 2. Configure Your Document

To use a generic template, you need to configure your document's `$template` field to point to the generic templates renderer and specify the template name:

```json
"$template": {
  "type": "EMBEDDED_RENDERER",
  "name": "BILL_OF_LADING_GENERIC",
  "url": "https://generic-templates.tradetrust.io"
}
```

Replace `BILL_OF_LADING_GENERIC` with the appropriate template name from the following options:

- `BILL_OF_LADING` - Standard Bill of Lading template
- `BILL_OF_LADING_GENERIC` - Generic Bill of Lading template
- `CERTIFICATE_OF_ORIGIN` - Certificate of Origin template
- `COVERING_LETTER` - Covering Letter template
- `INVOICE` - Invoice template
- `XML_RENDERER` - XML Renderer template

### 3. Prepare Your Document Data

Each template requires specific data fields. Below are examples for common templates:

#### Bill of Lading (Generic)

```json
{
  "$template": {
    "type": "EMBEDDED_RENDERER",
    "name": "BILL_OF_LADING_GENERIC",
    "url": "https://generic-templates.tradetrust.io"
  },
  "issuers": [
    {
      "identityProof": {
        "type": "DNS-TXT",
        "location": "your-domain.com"
      },
      "name": "DEMO TOKEN REGISTRY",
      "tokenRegistry": "0x1234567890abcdef1234567890abcdef12345678"
    }
  ],
  "blNumber": "BL-12345",
  "companyName": "Your Company Name",
  "field1": "Shipper details",
  "field2": "Consignee details",
  "field3": "Notify party",
  "field4": "Vessel name and voyage",
  "field5": "Port of loading",
  "field6": "Port of discharge",
  "field7": "Description of goods",
  "field8": "Weight and measurement",
  "field9": "Additional information"
}
```

#### Covering Letter

```json
{
  "$template": {
    "type": "EMBEDDED_RENDERER",
    "name": "COVERING_LETTER",
    "url": "https://generic-templates.tradetrust.io"
  },
  "issuers": [
    {
      "name": "Demo Issuer",
      "documentStore": "0x1234567890abcdef1234567890abcdef12345678",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "your-domain.com"
      }
    }
  ],
  "name": "Covering Letter",
  "logo": "https://www.example.com/your-logo.png",
  "backgroundColor": "#ffffff",
  "titleColor": "#4e4e50",
  "descriptionColor": "#4e4e50",
  "title": "Important Document Enclosed",
  "remarks": "Please find attached the requested documents for your review."
}
```

### 4. Create and Issue Your Document

Once you've configured your document with the appropriate template and data fields, you can create and issue it using the TradeTrust document creator or the OpenAttestation CLI.

#### Using Document Creator

1. Create a configuration file (e.g., `config.json`) with your document template
2. Run the Document Creator with your configuration
3. Fill in the required fields
4. Issue the document

#### Using OpenAttestation CLI

1. Create your raw document JSON file
2. Wrap the document using the OpenAttestation CLI
3. Issue the document to the blockchain

## Customizing Generic Templates

While generic templates have limited customization options compared to custom renderers, you can still customize certain aspects:

### Covering Letter Customization

The Covering Letter template offers several customization options:

- `logo` - URL to your company logo
- `backgroundColor` - Background color of the letter (e.g., "#ffffff" for white)
- `titleColor` - Color of the title text (e.g., "#4e4e50" for dark gray)
- `descriptionColor` - Color of the description text (e.g., "#4e4e50" for dark gray)
- `title` - The title of the letter
- `remarks` - The content of the letter

### Bill of Lading Customization

The Bill of Lading template allows you to customize:

- `blNumber` - The Bill of Lading number
- `companyName` - Your company name
- `field1` through `field9` - Various fields for shipping details

## Example Configuration Files

### Bill of Lading Configuration

```json
{
  "network": "sepolia",
  "wallet": "0x1234567890abcdef1234567890abcdef12345678",
  "forms": [
    {
      "name": "Bill of Lading",
      "type": "TRANSFERABLE_RECORD",
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
              "location": "your-domain.com"
            },
            "name": "DEMO TOKEN REGISTRY",
            "tokenRegistry": "0x1234567890abcdef1234567890abcdef12345678"
          }
        ],
        "blNumber": "BL-12345",
        "companyName": "Your Company Name",
        "field1": "Shipper details",
        "field2": "Consignee details",
        "field3": "Notify party",
        "field4": "Vessel name and voyage",
        "field5": "Port of loading",
        "field6": "Port of discharge",
        "field7": "Description of goods",
        "field8": "Weight and measurement",
        "field9": "Additional information"
      },
      "schema": {
        "type": "object",
        "properties": {
          "blNumber": {
            "type": "string",
            "title": "BL Number"
          },
          "companyName": {
            "type": "string",
            "title": "Company Name"
          }
        }
      }
    }
  ]
}
```

### Cover Letter Configuration

```json
{
  "network": "sepolia",
  "wallet": "0x1234567890abcdef1234567890abcdef12345678",
  "forms": [
    {
      "name": "Cover Letter",
      "type": "VERIFIABLE_DOCUMENT",
      "defaults": {
        "$template": {
          "type": "EMBEDDED_RENDERER",
          "name": "COVERING_LETTER",
          "url": "https://generic-templates.tradetrust.io"
        },
        "issuers": [
          {
            "name": "Demo Issuer",
            "documentStore": "0x1234567890abcdef1234567890abcdef12345678",
            "identityProof": {
              "type": "DNS-TXT",
              "location": "your-domain.com"
            }
          }
        ],
        "name": "Covering Letter",
        "logo": "https://www.example.com/your-logo.png",
        "backgroundColor": "#ffffff",
        "titleColor": "#4e4e50",
        "descriptionColor": "#4e4e50",
        "title": "Important Document Enclosed",
        "remarks": "Please find attached the requested documents for your review."
      },
      "schema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "title": "Title"
          },
          "remarks": {
            "type": "string",
            "title": "Remarks"
          }
        }
      }
    }
  ]
}
```

## Limitations of Generic Templates

While generic templates provide a convenient way to get started, they have some limitations:

1. **Limited customization** - You can only customize the fields provided by the template
2. **Fixed layout** - The overall layout and design cannot be changed
3. **No custom branding** - Limited options for adding your company's branding
4. **No custom logic** - Cannot add custom validation or interactive features

For these reasons, generic templates are recommended primarily for demonstration, testing, and prototyping purposes. For production use, consider [creating a custom decentralized renderer](/docs/how-tos/document-preview-templates/custom-decentralized-renderer).

## Troubleshooting

### Common Issues

1. **Template not rendering** - Ensure the `$template.name` matches one of the available templates exactly
2. **Missing fields** - Check that all required fields for the template are provided
3. **Logo not displaying** - Ensure the logo URL is accessible and the image format is supported

### Getting Help

If you encounter issues with generic templates, you can:

1. Check the [TradeTrust documentation](https://docs.tradetrust.io/)
2. Preview the templates in the [Generic Templates Storybook](https://storybook.generic-templates.tradetrust.io/)
3. Examine the [source code](https://github.com/TradeTrust/generic-templates) for the generic templates

## Conclusion

Generic templates provide a quick and convenient way to render TradeTrust documents without having to create custom renderers. They are ideal for demonstration, testing, and prototyping purposes, but for production use, consider creating a custom decentralized renderer for greater flexibility and branding control.

By following the steps in this guide, you can effectively use TradeTrust's generic templates to render your documents in a visually appealing way.
