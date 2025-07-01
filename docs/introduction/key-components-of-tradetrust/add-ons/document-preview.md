---
id: document-preview
title: Document Preview
sidebar_label: Document Preview
---

## Introduction

TradeTrust documents are designed to be both machine-readable and human-readable. While TradeTrust documents are stored in `.json` format for machine processing, they require a renderer to present the data in a human-readable format. Document Preview provides this essential functionality, allowing users to visualize TradeTrust documents in a structured and readable way.

## What are Document Preview?

Document Preview are decentralized renderers that transform the raw JSON data of TradeTrust documents into visually appealing and human-readable formats. These templates are essentially static websites that are embedded in compliant TradeTrust viewers. When a TradeTrust document is loaded, the appropriate template is used to render the document's data into a structured HTML format.

## Decentralized Renderer Implementation

TradeTrust recommends using our Decentralized Renderer implementation by forking the [public template repository](https://github.com/TradeTrust/decentralized-renderer). This approach offers complete flexibility in designing the visual representation of TradeTrust documents while leveraging pre-built advanced features.

### Built-in Advanced Features

The Decentralized Renderer comes with several powerful built-in features that enhance document functionality:

- **Selective Redaction**: Allows users to selectively hide sensitive information while maintaining document validity. Users can toggle edit mode to remove specific fields before sharing documents, with the redacted document remaining cryptographically valid.

- **Print Watermark**: Automatically adds a watermark to printed versions of documents, enhancing security and indicating the document's origin. The watermark is visible only when the document is printed.

- **Document QR Code**: Generates a QR code for printed documents that links back to the digital version, enabling quick verification and access to the latest document state. The QR code appears on a separate page when printing.

### Implementation Steps

Implementing the Decentralized Renderer involves:

- Forking the template repository
- Defining your document data structure
- Developing React components to render the data
- Configuring the template registry
- Leveraging the built-in features as needed
- Deploying the renderer to a hosting service

This approach allows organizations to maintain their branding, include specific visual elements, and tailor the document presentation to their exact requirements while benefiting from TradeTrust's advanced features.

## Key Benefits

- **Human Readability**: Transforms machine-readable JSON data into visually structured documents
- **Flexibility**: Supports various document types through different templates
- **Customization**: Allows for complete control over document appearance through custom renderers
- **Decentralization**: Renderers can be hosted independently of the TradeTrust platform

## Implementation Considerations

When implementing Document Preview, consider the following:

- Decentralized renderers should be deployed to reliable hosting services with custom domains for production use
- Implement proper CORS configuration to allow your renderer to be embedded in TradeTrust Viewers [ref.tradetrust.io](https://ref.tradetrust.io) / [dev.tradetrust.io](https://dev.tradetrust.io) or any other implementation
- Consider implementing the built-in features (Selective Redaction, Print Watermark, QR Code) for enhanced functionality

## Next Steps

To learn more about Document Preview:

- Follow the guide on [Creating a Custom Decentralized Renderer](/docs/tutorial/decentralized-renderer) to build your own template
- Explore our comprehensive [Decentralized Renderer Guide](/docs/how-tos/decentralized-renderer/decentralized-renderer-guide) for best practices and troubleshooting
- Learn about [Using Generic Templates](/docs/how-tos/decentralized-renderer/using-generic-templates) for quick demonstrations
- Review detailed [Template Implementation Examples](/docs/how-tos/decentralized-renderer/template-implementation-examples) including Bill of Lading and Cover Letter

By leveraging Document Preview, you can ensure that your TradeTrust documents are not only cryptographically secure and verifiable but also easily understandable and visually appealing to end-users.