---
id: attachments
title: Working with Attachments
sidebar_label: Working with Attachments
---

# Working with Attachments in TradeTrust Documents

TradeTrust allows you to attach files directly to your verifiable documents and credentials, making them part of the document's integrity verification. This guide explains how to work with attachments across different document formats:

- **OpenAttestation v2**: Attachments are included in the document data before wrapping
- **OpenAttestation v3**: Attachments are added at the root level of the document
- **W3C Verifiable Credentials**: Attachments are included within the credentialSubject

Attachments enable you to bundle supporting files with your verifiable documents, ensuring that all related information remains together and tamper-evident.

## Understanding Attachments

Attachments in TradeTrust documents are files that are embedded directly within the document itself. These can include:

- Supporting documentation (PDFs, images)
- Additional certificates
- Supplementary information
- Any other file types that need to be bundled with the document

Attachments are stored as plain base64-encoded strings within the document structure, allowing them to be included in the document hash and therefore be part of the document's integrity verification. Unlike web contexts where data URLs (e.g., `data:application/pdf;base64,...`) are common, TradeTrust attachments should contain only the raw base64-encoded data without any prefix.

## Attachment Structure

The standard attachment structure contains the following properties:

```typescript
type Attachment = {
  data: string;      // Base64-encoded file content
  filename: string;  // Name of the file (in v2)
  fileName: string;  // Name of the file (in v3)
  mimeType: string;  // MIME type of the file (e.g., "application/pdf")
};
```

### Important Notes

1. **Base64 Encoding**: The `data` field should contain the file content encoded as a plain base64 string (e.g., `JVBERi0xLjQKJ...`). Do not include data URL prefixes like `data:application/pdf;base64,`.
2. **File Size**: Be mindful of attachment sizes as they directly impact the overall document size. Consider compressing files when possible.
3. **MIME Types**: Always specify the correct MIME type in the `mimeType` field to ensure proper rendering and handling of the attachment.
4. **Naming Conventions**: OpenAttestation v2 uses `filename`, while v3 uses `fileName`. The renderer supports both formats, but it's recommended to use the convention that matches your document version.

## Adding Attachments to Different Document Types

### In W3C Verifiable Credentials

#### Attachment Context

For W3C Verifiable Credentials, you need to include the attachments context in your document's `@context` array **only if** the original credentialSubject schema does not have an attachments key:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://trustvc.io/context/your-document-context.json",
    "https://trustvc.io/context/attachments-context.json"
  ]
}
```

The attachments context defines the following structure:

```json
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "attachments": {
      "@id": "https://example.org/terms#attachments",
      "@container": "@set",
      "@context": {
        "@protected": true,
        "data": {
          "@id": "https://example.org/terms#data"
        },
        "filename": {
          "@id": "https://example.org/terms#filename"
        },
        "mimeType": {
          "@id": "https://example.org/terms#mimeType"
        }
      }
    }
  }
}
```

#### Document Example

For W3C Verifiable Credentials, attachments must be added inside the `credentialSubject` object:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://trustvc.io/context/your-document-context.json",
    "https://trustvc.io/context/attachments-context.json"
  ],
  "type": ["VerifiableCredential", "YourDocumentType"],
  "credentialSubject": {
    // Your document data
    "attachments": [
      {
        "filename": "certificate.pdf",
        "mimeType": "application/pdf",
        "data": "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UaXRsZSAoRXhhbXBsZSBQREYpCi9Qcm9kdWNlciAoT3..."
      }
    ]
  }
}
```

### In OpenAttestation v2

#### Unwrapped Document

For OpenAttestation v2 documents, attachments are added to the document data before wrapping:

```json
{
  "$template": {
    "name": "DOCUMENT_NAME",
    "type": "EMBEDDED_RENDERER",
    "url": "https://example.com/renderer"
  },
  "issuers": [
    {
      "name": "ISSUER_NAME",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "example.com"
      }
    }
  ],
  "attachments": [
    {
      "filename": "certificate.pdf",
      "mimeType": "application/pdf",
      "data": "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UaXRsZSAoRXhhbXBsZSBQREYpCi9Qcm9kdWNlciAoT3..."
    }
  ],
  // Your document data
}
```

#### Wrapped Document

After wrapping, the attachments will be part of the document data with salted values:

```json
{
    "version": "https://schema.openattestation.com/2.0/schema.json",
    "data": {
        "$template": {
            "type": "baf548ee-2893-479e-9e97-4084f14a6d9f:string:EMBEDDED_RENDERER",
            "name": "8e5e3e77-8f35-410a-acb2-cd318d09d4a8:string:BILL_OF_LADING_CARRIER",
            "url": "9f2761b6-ed56-4719-8320-58a93f37e09b:string:https://generic-templates.tradetrust.io"
        },
        "issuers": [
            {
                "name": "d0c90c0d-a77d-4e93-87e5-7644fa0e6e56:string:DEMO TOKEN REGISTRY",
                "identityProof": {
                    "type": "30a65a46-9b14-4d9d-808a-2d5b8bc9dc82:string:DNS-TXT",
                    "location": "540bab5c-e99b-4ef8-a1ea-de43ae5f8345:string:example.tradetrust.io"
                }
            }
        ],
        "attachments": [
            {
                "data": "4e16f105-6294-4b41-9ce8-483cc84d575e:string:JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UaXRsZSAoRXhhbXBsZSBQREYpCi9Qcm9kdWNlciAoT3...",
                "filename": "9cca158c-bb9d-443e-9c82-611531297781:string:certificate.pdf",
                "mimeType": "45669f70-033b-496e-b92a-fb96ae2326ad:string:application/pdf"
            }
        ],
        // Other document data with salted values
    },
    "signature": {
        "type": "SHA3MerkleProof",
        "targetHash": "43ca1e5cacfaa1e7518ef69a6608fad35c8f69743ee5f8d7bbb0784b77aa0d1b",
        "proof": [],
        "merkleRoot": "43ca1e5cacfaa1e7518ef69a6608fad35c8f69743ee5f8d7bbb0784b77aa0d1b"
    }
}
```

### In OpenAttestation v3

For OpenAttestation v3 documents, attachments are added at the root level:

```json
{
    "version": "https://schema.openattestation.com/3.0/schema.json",
    "network": {
        "chain": "FREE",
        "chainId": "101010"
    },
    "credentialSubject": {
        // Document data goes here
    },
    "attachments": [
        {
            "data": "JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UaXRsZSAoRXhhbXBsZSBQREYpCi9Qcm9kdWNlciAoT3...",
            "fileName": "certificate.pdf",
            "mimeType": "application/pdf"
        }
    ],
    "openAttestationMetadata": {
        "template": {
            "type": "EMBEDDED_RENDERER",
            "name": "CHAFTA_COO",
            "url": "https://generic-templates.tradetrust.io"
        },
        "proof": {
            "type": "OpenAttestationProofMethod",
            "method": "DOCUMENT_STORE",
            "value": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B"
        },
        "identityProof": {
            "type": "DNS-TXT",
            "identifier": "example.tradetrust.io"
        }
    },
    "issuer": {
        "id": "https://example.com",
        "name": "DEMO DOCUMENT STORE",
        "type": "OpenAttestationIssuer"
    }
}
```

## Implementation Flexibility

The attachment structure described in this guide is a **recommendation** to ensure compatibility with the TradeTrust decentralized renderer. The renderer looks for specific properties in the attachment objects to properly display them:

```typescript
// From decentralized-renderer-react-components/src/utils.ts
const attachments = vc.isSignedDocument(document)
  ? [(document as SignedVerifiableCredential)?.credentialSubject]
      .flat()
      ?.map((s) => s.attachments)
      ?.filter(Boolean)
      ?.flat()
  : isV2Document(document) || isV3Document(document)
    ? document.attachments
    : [];
const tabsRenderedFromAttachments = (attachments || ([] as Attachment[]))
  .map((attachment: Attachment, index: number) => {
    return {
      id: `attachment-${index}`,
      label: ((attachment as any).fileName ?? (attachment as any)?.filename) || "Unknown filename",
      type: ((attachment as any).type ?? (attachment as any).mimeType) || "Unknown filetype",
      template: attachmentToComponent(attachment, document)!
    };
  })
  .filter((template: any) => template.template);
```

As shown above, the renderer looks for:
- `fileName` or `filename` property for the display name
- `type` or `mimeType` property for the file type
- `data` property containing the base64-encoded content

While you must include these properties for the generic templates to display attachments correctly, you are free to implement your own custom renderer that handles attachments differently.

## Handling Attachments in TradeTrust UI

TradeTrust's UI automatically detects and displays attachments in the document viewer. Attachments appear as tabs alongside the main document view, allowing users to switch between the main document and its attachments.

### Supported File Types

The TradeTrust renderer can display various file types directly in the browser:

- **PDFs**: Rendered using the browser's built-in PDF viewer
- **Images** (JPEG, PNG, GIF, etc.): Displayed directly in the viewer
- **Text files**: Displayed as formatted text
- **Other file types**: Provided as downloadable files

The TradeTrust website provides a user-friendly interface for adding attachments to documents:

1. Navigate to the form filling page
2. Look for the "Attachments" section (if enabled for the document type)
3. Use the file upload interface to add attachments
4. Continue with document issuance

## Best Practices

1. **File Size**: Keep attachments as small as possible to minimize document size and improve performance.
2. **File Types**: Use common file formats that are widely supported by browsers.
3. **Sensitive Information**: Remember that attachments are part of the document and will be visible to anyone with access to the document.
4. **Base64 Encoding**: Always use proper base64 encoding with the appropriate data URL prefix for the file type.
5. **Validation**: Validate attachments before adding them to ensure they meet size and format requirements.

## Troubleshooting

### Common Issues

1. **Attachments not displaying**: Ensure the attachment's MIME type is correct and the base64 encoding is valid.
2. **Large document size**: Consider compressing files before attaching them or using external references for very large files.
3. **Rendering issues**: Some file types may not render correctly in all browsers. Stick to widely supported formats.

## Conclusion

Attachments are a powerful feature in TradeTrust that enable you to bundle supporting files directly within your verifiable documents while maintaining tamper-evidence. This guide has covered:

- How to properly structure attachments for different document formats (OpenAttestation v2, OpenAttestation v3, and W3C Verifiable Credentials)
- The importance of using plain base64-encoded strings without data URL prefixes
- The different placement of attachments in each document type (in document data for v2, at root level for v3, and in credentialSubject for W3C)
- The flexibility for implementers to create custom renderers while maintaining compatibility with the standard TradeTrust UI

By following these guidelines, you can create robust verifiable documents with properly embedded attachments that will render correctly in the TradeTrust ecosystem while maintaining the integrity and security of your documents.
