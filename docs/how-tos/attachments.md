---
id: attachments
title: Working with Attachments
sidebar_label: Working with Attachments
---

# Working with Attachments in TradeTrust Documents

TradeTrust allows you to attach files directly to your verifiable documents and credentials, making them part of the document's integrity verification. This guide focuses primarily on the recommended W3C Verifiable Credentials format, with references to legacy formats for backward compatibility.

**W3C Verifiable Credentials (Recommended)**: Attachments are included within the credentialSubject

Legacy formats (for reference only):
- OpenAttestation v2: Attachments are included in the document data before wrapping
- OpenAttestation v3: Attachments are added at the root level of the document

Attachments enable you to bundle supporting files with your verifiable documents, ensuring that all related information remains together and tamper-evident.

## Understanding Attachments

Attachments in TradeTrust documents are files that are embedded directly within the document itself. These can include:

- Supporting documentation (PDFs, images)
- Additional certificates
- Supplementary information
- Any other file types that need to be bundled with the document

Attachments are stored as plain base64-encoded strings within the document structure, allowing them to be included in the document hash and therefore be part of the document's integrity verification. Unlike web contexts where data URLs (e.g., `data:application/pdf;base64,...`) are common, TradeTrust attachments should contain only the raw base64-encoded data without any prefix.

## Attachment Structure

For broad compatibility with TradeTrust, we recommend the following attachment structure:

| Field | Type | Description | Required | Notes |
|-------|------|-------------|----------|-------|
| `data` | string | Base64-encoded file content | Yes | Must be plain base64 string without data URL prefixes (e.g., `JVBERi0xLjQKJ...`) |
| `filename` | string | Name of the file | Yes* | Example: "invoice.pdf" (also supports `fileName` in OA v3) |
| `mimeType` | string | MIME type of the file | Yes* | Example: "application/pdf" (also supports `type` in OA v2) |

*Required for proper rendering in TradeTrust Verification Website

This structure is preferred for new documents. However, the TradeTrust platform, particularly its decentralized renderer, is designed to be flexible and can parse attachments from older OpenAttestation (OA) v2 and v3 formats as well.

### Important Considerations for Attachments

When working with attachments, keep these points in mind:

- **File Size**: Large attachments increase the overall document size, which can impact performance and storage. Consider compressing files where appropriate.
- **MIME Types**: Always specify the correct MIME type (e.g., `application/pdf`, `image/jpeg`, `text/csv`) to ensure proper handling.
- **Format Variations**: While the TradeTrust renderer supports variations in field names for backward compatibility, using the recommended structure is best practice for new documents.

### Renderer Parsing and Legacy Support

The TradeTrust decentralized renderer processes attachments to extract the necessary information for display. It primarily looks for the recommended fields (`data`, `filename`, `mimeType`) but also checks for common variations found in OA v2 and OA v3 documents.

The following code snippet from `decentralized-renderer-react-components/src/utils.ts` illustrates how the renderer extracts attachment details:

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
      // For filename, it checks for 'fileName' (common in OA v3) then 'filename' (recommended, and OA v2)
      label: ((attachment as any).fileName ?? (attachment as any)?.filename) || "Unknown filename",
      // For MIME type, it checks for 'type' (common in OA v2) then 'mimeType' (recommended, and OA v3)
      type: ((attachment as any).type ?? (attachment as any).mimeType) || "Unknown filetype",
      // The 'data' property is used within attachmentToComponent to render the content
      template: attachmentToComponent(attachment, document)!
    };
  })
  .filter((template: any) => template.template);
```

As shown in the snippet:

-   For the attachment's **name/label**, the renderer first looks for a `fileName` property (common in OA v3) and falls back to `filename` (recommended, and also used in OA v2).
-   For the attachment's **type**, it first looks for a `type` property (common in OA v2) and falls back to `mimeType` (recommended, and also used in OA v3).

This ensures that documents created with older OpenAttestation schemas remain compatible. While this flexibility is provided, new implementations should adhere to the recommended structure (`data`, `filename`, `mimeType`) for clarity and future-proofing.

While you must include these properties for the generic templates to display attachments correctly, you are free to implement your own custom renderer that handles attachments differently.

## Adding Attachments to Documents

### W3C Verifiable Credentials (Recommended)

#### Attachment Context

For W3C Verifiable Credentials, you need to include the attachments context in your document's `@context` array **only if** the original credentialSubject schema does not have an attachments key:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2",
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
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2",
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

### OpenAttestation (Legacy)

<details>
<summary><b>OpenAttestation v2</b></summary>

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
</details>

<details>
<summary><b>OpenAttestation v3</b></summary>

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
</details>

## Handling Attachments in TradeTrust Verification Website

TradeTrust's Verification Website automatically detects and displays attachments in the document viewer. Attachments appear as tabs alongside the main document view, allowing users to switch between the main document and its attachments.

### Supported File Types

The TradeTrust renderer can display various file types directly in the browser:

- **PDFs**: Rendered using the browser's built-in PDF viewer
- **Images** (JPEG, PNG, GIF, etc.): Displayed directly in the viewer
- **Text files**: Displayed as formatted text
- **Other file types**: Provided as downloadable files

## Best Practices

1. **File Size**: Keep attachments as small as possible to minimize document size and improve performance.
2. **File Types**: Use common file formats that are widely supported by browsers.
3. **Sensitive Information**: Remember that attachments are part of the document and will be visible to anyone with access to the document.
4. **Base64 Encoding**: Always use proper base64 encoding for the file content. Remember to use raw base64 strings without data URL prefixes (no `data:application/pdf;base64,`).
5. **Validation**: Validate attachments before adding them to ensure they meet size and format requirements.

## Troubleshooting

### Common Issues

1. **Attachments not displaying**: Ensure the attachment's MIME type is correct and the base64 encoding is valid.
2. **Large document size**: Consider compressing files before attaching them or using external references for very large files.
3. **Rendering issues**: Some file types may not render correctly in all browsers. Stick to widely supported formats.
