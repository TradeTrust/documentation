---
id: template-implementation
title: Template Implementation
sidebar_label: Template Implementation
---

# Template Implementation

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

#### 3. Update Storybook Stories for the New Template

<details>
<summary>Update your `src/templates/BillOfLading/template.stories.tsx` file to include the summary view:</summary>

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

const Template_: StoryFn<BillOfLadingDocument> = (args) => {
  const documentWithProperties = {
    ...BillOfLadingSample,
    credentialSubject: {
      ...BillOfLadingSample.credentialSubject,
      ...args,
    },
  };

  return <Template document={documentWithProperties} handleObfuscation={() => {}} />;
};

export const BillOfLadingCustomisable = Template_.bind({});
BillOfLadingCustomisable.argTypes = {
  // Define controls for sample document values
  scac: { control: "text", description: "SCAC code" },
  blNumber: { control: "text", description: "Bill of Lading number" },
  vessel: { control: "text", description: "Vessel name" },
  voyageNo: { control: "text", description: "Voyage number" },
  portOfLoading: { control: "text", description: "Port of loading" },
  portOfDischarge: { control: "text", description: "Port of discharge" },
  carrierName: { control: "text", description: "Carrier name" },
  shipperName: { control: "text", description: "Shipper name" },
  shipperAddressStreet: { control: "text", description: "Shipper street address" },
  shipperAddressCountry: { control: "text", description: "Shipper country" },
  consigneeName: { control: "text", description: "Consignee name" },
  notifyPartyName: { control: "text", description: "Notify party name" },
  placeOfReceipt: { control: "text", description: "Place of receipt" },
  placeOfDelivery: { control: "text", description: "Place of delivery" },
  packages: {
    control: "object",
    description: "Array of package objects with description, weight, and measurement",
  },
};
BillOfLadingCustomisable.args = {
  ...BillOfLadingSample.credentialSubject,
  packages: [
    {
      description: "10 PALLETS OF ELECTRONICS",
      weight: "500",
      measurement: "1000",
    },
    {
      description: "5 CRATES OF MACHINE PARTS",
      weight: "750",
      measurement: "600",
    },
  ],
};
```
</details>

#### 4. Screenshot of Bill of Lading Summary View in preview application

<details>
<summary>Screenshot of Bill of Lading Summary View</summary>

![Bill of Lading Summary View](/docs/how-tos/decentralized-renderer/multiple-view-summary-view.png)

</details>

### Adding Print-Friendly Views

You can create a print-friendly version of your document by adding specific CSS for printing. Add a print stylesheet to your template:

```jsx
import { css, Global } from "@emotion/react";

// Add this to your template component
const PrintStyles = () => (
  <Global
    styles={css`
      @media print {
        body {
          background-color: #ffffff;
          font-size: 12pt;
          max-width: 800px;
          margin: auto;
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

### Print Watermark

Add a print watermark to your template to ensure it is visible when printing:

```jsx
import { PrintWatermark } from "@tradetrust-tt/decentralized-renderer-react-components";

// In your template component
return (
  <>
    <PrintWatermark />
    ...
  </>
)
```
![Print Watermark](/docs/tutorial/decentralised-renderer/print-watermark.png)
