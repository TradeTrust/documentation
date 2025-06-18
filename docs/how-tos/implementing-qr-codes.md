---
id: implementing-qr-codes
title: Implementing QR Codes in Documents
sidebar_label: Implementing QR Codes
---

# Implementing QR Codes in W3C VC and OA Documents

This documentation explains how to implement QR codes in W3C Verifiable Credentials and OpenAttestation documents. QR codes provide a convenient way to access and verify documents by allowing users to scan them with mobile devices, making document verification more accessible and user-friendly.

## QR Code URL Structure and Payload Schema

QR codes in TradeTrust documents follow a standard URL structure with an encoded JSON payload using the query parameter `q`:

```
https://actions.tradetrust.io?q=<encoded_payload>
```

The `q` parameter is **critical** - it identifies the request as a document verification action. The verification portal specifically looks for this parameter to extract and process the encoded document data.

The encoded payload is a URL-safe string created by using `encodeURIComponent(JSON.stringify(payload))`, where the payload follows this schema:

```javascript
{
  "type": "DOCUMENT",                              // Fixed value, must be "DOCUMENT"
  "payload": {
    "uri": "https://example.com/documents/123",    // URL where document is hosted
    "key": "abcdef1234567890",                     // Encryption key (optional)
    "permittedActions": ["STORE"],                 // Allowed actions (optional)
    "redirect": "https://tradetrust.io/",          // Redirect URL after verification (optional)
    "chainId": "101010"                            // Blockchain ID (optional | required for Transferable Documents)
  }
}
```

When scanned, this QR code will direct users to the verification portal where the document is retrieved from the specified URI, decrypted if necessary, and verified.

## Why Use QR Codes in Documents

### 1. Enhanced Accessibility
QR codes enable users to quickly access documents without manually typing URLs, making them more accessible on mobile devices.

### 2. Seamless Verification
QR codes enable one-scan document verification on any supporting platform. Organizations can implement verification on their own systems while also allowing verification through public services like TradeTrust. This provides flexibility while maintaining consistent verification standards.

### 3. Integration with Physical Workflows
For industries that still rely on physical documents, QR codes bridge the gap between paper and digital workflows. When integrated into document templates (like in TradeTrust's generic-templates), QR codes are included in the rendered document using components like `DocumentQrCode`. This allows printed documents to maintain a direct link to their digital versions, enabling instant verification through a simple scan even when the document exists in physical form.

```jsx
// Example from BillOfLadingTemplate.tsx
export const BillOfLadingTemplate: FunctionComponent<TemplateProps<BillOfLadingSchema>> = ({ document }) => {
  const documentData = getDocumentData(document) as BillOfLadingDocument;
  const qrCodeUrl = getQRCodeURL(document); // Extract QR code URL from document
  return (
    <Wrapper>
      {/* Document content sections */}
      {qrCodeUrl && <DocumentQrCode url={qrCodeUrl} />} {/* Add QR code if URL exists */}
    </Wrapper>
  );
};
```

This ensures that even when documents are printed, exchanged physically, or archived in paper form, they maintain their verifiable digital connection.

## QR Code Implementation for Different Document Types

### W3C Verifiable Credentials

For W3C Verifiable Credentials, you need to add a `qrCode` property to your credential with the following structure:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://trustvc.io/context/bill-of-lading-carrier.json",
    "https://trustvc.io/context/qrcode-context.json" // Required for QR code support
  ],
  "type": ["VerifiableCredential"],
  "qrCode": {
    "type": "TrustVCQRCode",
    "uri": "https://actions.tradetrust.io?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fexample.com%2Fdocuments%2F123%22%2C%22key%22%3A%22abcdef1234567890%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Ftradetrust.io%2F%22%2C%22chainId%22%3A%22101010%22%7D%7D"
  },
  // Other credential properties
}
```

**Note**: Make sure to include the `qrcode-context.json` in your `@context` array to properly define the QR code schema.

### OpenAttestation v3 Documents

For OA v3 documents, QR codes are implemented in the `credentialSubject.links.self.href` property:

```json
{
  "version": "https://schema.openattestation.com/3.0/schema.json",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json"
  ],
  "credentialSubject": {
    // Document data
    "links": {
      "self": {
        "href": "https://actions.tradetrust.io?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fexample.com%2Fdocuments%2F123%22%2C%22key%22%3A%22abcdef1234567890%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Ftradetrust.io%2F%22%2C%22chainId%22%3A%22101010%22%7D%7D"
      }
    }
  },
  // Other document properties
}
```

### OpenAttestation v2 Documents

In OA v2 documents, QR codes are implemented through the `data.links.self.href` property:

```json
{
  "version": "https://schema.openattestation.com/2.0/schema.json",
  "data": {
    // Document data
    "links": {
      "self": {
        "href": "https://actions.tradetrust.io?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fexample.com%2Fdocuments%2F123%22%2C%22key%22%3A%22abcdef1234567890%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Ftradetrust.io%2F%22%2C%22chainId%22%3A%22101010%22%7D%7D"
      }
    }
  },
  // Other document properties
}
```

## QR Code URI Structure

The QR code URI follows this structure:

```
https://actions.tradetrust.io?q=<encoded_payload>
```

Where `<encoded_payload>` is an encoded JSON object with the following structure:

```json
{
  "type": "DOCUMENT",
  "payload": {
    "uri": "https://example.com/documents/123", // URL to the document
    "key": "abcdef1234567890", // Encryption key (optional)
    "permittedActions": ["STORE"], // Allowed actions on the document
    "redirect": "https://tradetrust.io/", // Redirect URL after verification
    "chainId": "101010" // Blockchain ID (optional)
  }
}
```

### Creating the QR Code URL

The URL in the QR code is generated by encoding the payload object:

```javascript
const payload = {
  type: "DOCUMENT",
  payload: {
    uri: "https://example.com/documents/123",
    key: "abcdef1234567890",
    permittedActions: ["STORE"],
    redirect: "https://tradetrust.io/",
    chainId: "101010"
  }
};

const qrCodeUrl = `https://actions.tradetrust.io?q=${encodeURIComponent(JSON.stringify(payload))}`;
```

## Security Considerations

### Document Encryption

Since documents referenced by QR codes need to be publicly accessible, it's recommended to encrypt them. The TradeTrust system supports the [oa-encryption](https://github.com/Open-Attestation/oa-encryption) library for this purpose:

1. Encrypt the document:

```javascript
const encryptedContent = {
  cipherText: "encrypted_document_content",
  iv: "initialization_vector",
  tag: "authentication_tag",
  key: "encryption_key",
  type: "OPEN-ATTESTATION-TYPE-1"
};
```

2. Upload the encrypted content without the key to a publicly accessible location (e.g., S3 bucket).

3. Include the URI to the encrypted content and the key in the QR code payload:

```javascript
const payload = {
  type: "DOCUMENT",
  payload: {
    uri: "https://storage.example.com/encrypted-document-123",
    key: encryptedContent.key,
    // Other payload properties
  }
};
```

### Cross-Origin Resource Sharing (CORS)

If you're hosting documents on a custom backend, ensure you've configured CORS to allow requests from TradeTrust domains:

```
Access-Control-Allow-Origin: *.tradetrust.io
```

## Custom URL Redirection

Instead of directly using the `ref.tradetrust.io` URL, you can implement a custom reverse proxy to handle QR code redirection:

1. Deploy your own redirect service based on [TradeTrust Actions](https://github.com/TradeTrust/actions).

2. Configure the service to whitelist allowed redirect domains.

3. Use your custom domain in the QR code URL:

```
https://actions.yourdomain.com?q=<encoded_payload>
```

## How TradeTrust Renders QR Codes

When a TradeTrust-compatible document with a QR code is loaded, the TradeTrust website:

1. Extracts the QR code URL using the `getQRCodeLink` function, which checks for:
   - `qrCode.uri` in W3C VC documents
   - `credentialSubject.links.self.href` in OA v3 documents
   - `links.self.href` in OA v2 documents

2. Renders the URL as a scannable QR code.

3. When the QR code is scanned, the encoded URL is opened, which redirects to TradeTrust with the document URI.

4. TradeTrust then downloads the document from the specified URI, decrypting it if necessary.

## Testing Your QR Code Implementation

To test if your QR code implementation is working correctly:

1. Create a document with a QR code following one of the formats above.
2. Host the document at a publicly accessible URL.
3. Upload your document to [https://dev.tradetrust.io/](https://dev.tradetrust.io/) / [https://ref.tradetrust.io/](https://ref.tradetrust.io/).
4. Verify that the QR code icon appears in the document utility bar.
5. Click the QR code icon and scan it with a mobile device.
6. Confirm that scanning the QR code successfully redirects to TradeTrust and loads the document.

By following these guidelines, you can successfully implement QR codes in your W3C VC and OpenAttestation documents, making them more accessible and easier to verify.
