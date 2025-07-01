---
id: template-implementation-examples
title: Template Implementation Examples
sidebar_label: Template Implementation Examples
---

# Template Implementation Examples

This guide provides detailed examples of implementing document preview templates for specific document types in TradeTrust. We'll cover implementation examples for Bill of Lading templates, along with advanced features like multiple views.

## Introduction

Document preview templates transform the raw JSON data of TradeTrust documents into visually appealing and human-readable formats. In this guide, we'll provide concrete examples of how to implement templates for specific document types.

Before proceeding with these examples, make sure you're familiar with the basics of [decentralized renderer](/docs/how-tos/decentralized-renderer/decentralized-renderer-guide.md) and understand the [generic templates](/docs/how-tos/decentralized-renderer/using-generic-templates) available in TradeTrust.

## Adding a Custom Template

You can follow the [Creating Your First Template](/docs/tutorial/decentralized-renderer.md#creating-your-first-template) section to create a custom template.

## Advanced Features

In many cases, you'll want to provide multiple views or formats for the same document. TradeTrust's decentralized renderer framework makes this easy to implement. Let's explore how to create multiple views for a document and add advanced features.

### Implementing Multiple Views

To provide different views of the same document, you can register multiple templates for the same document type. This is useful when you want to show different aspects of the document or different formats (e.g., a detailed view vs. a summary view).

Let's extend our Bill of Lading example to include multiple views:

#### 1. Create Additional Template Components

Create a new file `src/templates/BillOfLading/summary-template.tsx` for a summary view:

```tsx
import { css } from "@emotion/react";
import { TemplateProps } from "@tradetrust-tt/decentralized-renderer-react-components";
import React, { FunctionComponent } from "react";
import { BillOfLadingSchema } from "./types";

const containerStyle = css`
  font-family: "Arial", sans-serif;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #333;
`;

const headerStyle = css`
  text-align: center;
  margin-bottom: 20px;
`;

const sectionStyle = css`
  margin-bottom: 15px;
`;

export const BillOfLadingSummaryTemplate: FunctionComponent<TemplateProps<BillOfLadingSchema>> = ({ document }) => {
  return (
    <div css={containerStyle} id="bill-of-lading-summary-template">
      <div css={headerStyle}>
        <h2>BILL OF LADING SUMMARY</h2>
        <p>B/L No: {document?.blNumber}</p>
      </div>

      <div css={sectionStyle}>
        <p>
          <strong>Shipper:</strong> {document?.shipper?.name}
        </p>
        <p>
          <strong>Consignee:</strong> {document?.consignee?.name}
        </p>
        <p>
          <strong>Vessel:</strong> {document?.vessel?.name}, Voyage: {document?.vessel?.voyage}
        </p>
        <p>
          <strong>Ports:</strong> {document?.portOfLoading} to {document?.portOfDischarge}
        </p>
        <p>
          <strong>Cargo:</strong> {document?.cargo?.description}
        </p>
      </div>
    </div>
  );
};
```

#### 2. Update the Template Configuration

Modify your `src/templates/BillOfLading/index.tsx` file to include both templates:

```tsx
import { BillOfLadingSummaryTemplate } from "./summary-template";
import { Template } from "./template";

export const BillOfLadingTemplates = [
  {
    id: "bill-of-lading-template",
    label: "Bill of Lading",
    template: Template,
  },
  {
    id: "bill-of-lading-summary",
    label: "Summary View",
    template: BillOfLadingSummaryTemplate,
  },
];
```

#### 3. Add Storybook Stories for the New Template

Update your `src/templates/BillOfLading/template.stories.tsx` file to include the summary view:

```tsx
import { Meta, StoryFn } from "@storybook/react";
import React, { FunctionComponent } from "react";
import { BillOfLadingSample } from "./sample";
import { Template } from "./template";
import { BillOfLadingDocument } from "./types";

export default {
  title: "BillOfLading",
  component: Template,
  parameters: {
    componentSubtitle: "Bill of Lading template.",
  },
} as Meta;

export const BillOfLadingEmpty: FunctionComponent = () => {
  return <Template document={{} as any} handleObfuscation={() => {}} />; // when empty, visually should not show any dangling values
};

export const BillOfLading: FunctionComponent = () => {
  return <Template document={BillOfLadingSample} handleObfuscation={() => {}} />;
};

export const SummaryView: FunctionComponent = () => {
  return <Template document={BillOfLadingSample} handleObfuscation={() => {}} />;
};
```

<details>
<summary>Screenshot of Bill of Lading Summary View</summary>

Based on the [Decentralized Renderer Tutorial](/docs/tutorial/decentralized-renderer.md)

![Bill of Lading Summary View](/docs/how-tos/decentralized-renderer/multiple-view-summary-view.png)

</details>

### Adding Print-Friendly Views

You can create a print-friendly version of your document by adding specific CSS for printing. Add a print stylesheet to your template:

```jsx
import { css, Global } from "@emotion/core";

// Add this to your template component
const PrintStyles = () => (
  <Global
    styles={css`
      @media print {
        body {
          font-size: 12pt;
        }
        .no-print {
          display: none !important;
        }
        .print-only {
          display: block !important;
        }
        /* Add more print-specific styles as needed */
      }
    `}
  />
);

// Add this to your component's return statement
<>
  <PrintStyles />
  {/* Rest of your template */}
</>;
```

### Adding Dynamic Form Fields

You can add editable fields to your templates to allow users to fill in missing information. Here's an example of adding editable fields to the Bill of Lading template:

```jsx
import React, { FunctionComponent, useState } from "react";
import { TemplateProps } from "@tradetrust-tt/decentralized-renderer-react-components";
import { css } from "@emotion/core";
import { BillOfLadingDocument } from "./sample";

// Add this to your styles
const editableFieldStyle = css`
  border-bottom: 1px dashed #999;
  padding: 2px 5px;
  min-width: 100px;
  display: inline-block;
`;

const EditableField = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value || "");

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) onChange(fieldValue);
  };

  return isEditing ? (
    <input
      type="text"
      value={fieldValue}
      onChange={(e) => setFieldValue(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <span css={editableFieldStyle} onClick={() => setIsEditing(true)}>
      {fieldValue || "Click to edit"}
    </span>
  );
};

// Use the EditableField component in your template
<div css={sectionStyle}>
  <div css={sectionTitleStyle}>Remarks</div>
  <EditableField value="" onChange={(value) => console.log("New value:", value)} />
</div>;
```

### Adding Document Verification Status

You can display the verification status of a TradeTrust document in your template:

```jsx
import { utils } from "@tradetrust-tt/decentralized-renderer-react-components";

// Add this to your component
const { isVerified } = utils.documentStatus(document);

// Add this to your component's return statement
<div
  css={css`
    padding: 10px;
    background-color: ${isVerified ? "#e6f7e6" : "#ffebeb"};
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  `}
>
  <div
    css={css`
      margin-right: 10px;
    `}
  >
    {isVerified ? "✓" : "✗"}
  </div>
  <div>
    <strong>{isVerified ? "Verified" : "Not Verified"}</strong>
    <p>{isVerified ? "This document has been verified." : "This document could not be verified."}</p>
  </div>
</div>;
```

You can customize the Bill of Lading template to fit your specific needs.

### Adding an Image

Update your template component to render a logo / image:

```tsx
// Add to your imports
import logo from "./logo.png";

// Add to your styles
const logoStyle = css`
  max-width: 200px;
  margin-bottom: 20px;
`;

// Add to your component's return statement, inside the headerStyle div
<img src={logo} alt="Company Logo" css={logoStyle} />;
```

### Adding a Barcode or QR Code

For more information on adding a barcode or QR code to your document, refer to the [QR Code Implementation](/docs/how-tos/implementing-qr-codes.md).

The QR Code can also be preivew inside the template. You can add a barcode or QR code to your template:

```jsx
// Add to your imports
import { QRCodeSVG } from "qrcode.react";

// Add to your styles
const qrCodeStyle = css`
  margin: 20px auto;
  display: block;
`;

// Add to your component's return statement
<QRCodeSVG css={qrCodeStyle} value={url} level="M" size={400} />
```
