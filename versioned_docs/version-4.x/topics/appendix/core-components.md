---
id: core-components
title: TradeTrust Decentralized Renderer Core Components
sidebar_label: TradeTrust Decentralized Renderer Core Components
---

[TradeTrust decentralized renderer](https://github.com/TradeTrust/tradetrust-decentralized-renderer) repository contains a collection of example templates along with demonstrations of how to use core components. You can find these examples in the `/src/templates` directory. These templates serve as references and guides to help you set up your own templates to meet your unique requirements.

### DocumentQrCode

It allows users to share documents across devices using a QR code.

For detailed information on how to use the QR Code Component, please refer to the official documentation [here](/docs/4.x/reference/tradetrust-website/qr-code/).

![QRCode Example](/docs/reference/core-components/qr.png)

### Wrapper/ ErrorBoundary

The Wrapper/ErrorBoundary Component is designed to handle scenarios where a template cannot be rendered correctly. In such cases, this component can act as a fallback, displaying a user-friendly error message and stack.

![Wrapper/ ErrorBoundary Example](/docs/reference/core-components/wrapper.png)

### SelectiveRedaction

The SelectiveRedaction Component is a powerful tool for safeguarding sensitive information within a document. To use the SelectiveRedaction in the decentralized renderer, follow these steps

Click the "Edit Document" button within the SelectiveRedaction component.

![SelectiveRedaction Example](/docs/reference/core-components/selective-redaction-1.png)

Click "Remove" on the redactable values to specify the information you want to remove.

![SelectiveRedaction Example](/docs/reference/core-components/selective-redaction-2.png)

Click "Done" on the to complete the process. After that, you can now download the document with hidden values

![SelectiveRedaction Example](/docs/reference/core-components/selective-redaction-3.png)

### PrintWatermark

The PrintWatermark Component allows users to include the TradeTrust watermark text in the background of a document's print preview.

![PrintWatermark Example](/docs/reference/core-components/watermark.png)

## See Also

[Generic Templates by TradeTrust](/docs/4.x/reference/generic-templates/overview)
