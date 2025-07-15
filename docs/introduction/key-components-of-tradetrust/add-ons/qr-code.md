---
id: qr-code
title: QR code
sidebar_label: QR code
---

Upon verification of document, you might notice that there is a QR code available to scan. This allows users to share the viewing of documents easily across devices with camera.

The universal action method will provide a way for actions to be communicated to various client implementations that uses TradeTrust documents. In addition, these actions can be scanned directly using a phone's QR code scanner to process the document. Read more on the [rationale](https://github.com/Open-Attestation/adr/blob/master/universal_actions.md) from our Architectural Decision Records (ADRs).

For our reference implementation, we have the following:

- [TradeTrust functions](https://github.com/TradeTrust/tradetrust-functions) with document storage service:
  - Stores an **encrypted** document as URI.
- [TradeTrust web application](https://github.com/TradeTrust/tradetrust-website):
  - Reads URI + **decrypts** the stored document.

## Example

Sample of how the qrcode looks like upon document rendering:

![QRcode](/docs/introduction/qrcode.png)

> **Note**: For more information on qr code implementation, refer to [Implementing QR Codes](../../../how-tos/implementing-qr-codes).

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
