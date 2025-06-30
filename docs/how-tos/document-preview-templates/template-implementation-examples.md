---
id: template-implementation-examples
title: Template Implementation Examples
sidebar_label: Template Implementation Examples
---

# Template Implementation Examples

This guide provides detailed examples of implementing document preview templates for specific document types in TradeTrust. We'll cover implementation examples for Bill of Lading and Cover Letter templates, along with advanced features like multiple views.

## Introduction

Document preview templates transform the raw JSON data of TradeTrust documents into visually appealing and human-readable formats. In this guide, we'll provide concrete examples of how to implement templates for specific document types.

Before proceeding with these examples, make sure you're familiar with the basics of [creating a custom decentralized renderer](/docs/how-tos/document-preview-templates/custom-decentralized-renderer) and understand the [generic templates](/docs/how-tos/document-preview-templates/using-generic-templates) available in TradeTrust.

## Bill of Lading Template Example

A Bill of Lading (BL) is a document issued by a carrier to acknowledge receipt of cargo for shipment. Let's create a custom template for a Bill of Lading document.

### 1. Define the Document Data Structure

First, let's define the data structure for our Bill of Lading. Create a file `src/templates/bill-of-lading/sample.ts`:

```typescript
import { v2 } from "@trustvc/trustvc";

export interface BillOfLadingDocument extends v2.OpenAttestationDocument {
  blNumber: string;
  shipper: {
    name: string;
    address: string;
  };
  consignee: {
    name: string;
    address: string;
  };
  notifyParty: {
    name: string;
    address: string;
  };
  vessel: {
    name: string;
    voyage: string;
  };
  portOfLoading: string;
  portOfDischarge: string;
  cargo: {
    description: string;
    weight: string;
    measurement: string;
  };
}

export const sampleBillOfLading: BillOfLadingDocument = {
  blNumber: "BL-123456",
  issuers: [
    {
      name: "Shipping Company Ltd",
      tokenRegistry: "0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2",
      identityProof: {
        location: "shipping-company.example.com",
        type: v2.IdentityProofType.DNSTxt,
      },
    },
  ],
  shipper: {
    name: "ABC Trading Co.",
    address: "123 Export St, Singapore 123456",
  },
  consignee: {
    name: "XYZ Imports Inc.",
    address: "456 Import Ave, Hong Kong",
  },
  notifyParty: {
    name: "Logistics Services Ltd",
    address: "789 Freight Rd, Hong Kong",
  },
  vessel: {
    name: "SS OCEAN VOYAGER",
    voyage: "V123-E",
  },
  portOfLoading: "SINGAPORE",
  portOfDischarge: "HONG KONG",
  cargo: {
    description: "100 CARTONS OF ELECTRONICS",
    weight: "1,000 KG",
    measurement: "10 CBM",
  },
  $template: {
    name: "BILL_OF_LADING",
    type: v2.TemplateType.EmbeddedRenderer,
    url: "http://localhost:3000",
  },
};
```

### 2. Create the Template Component

Next, let's create the React component to render the Bill of Lading. Create a file `src/templates/bill-of-lading/template.tsx`:

```jsx
import React, { FunctionComponent } from "react";
import { TemplateProps } from "@tradetrust-tt/decentralized-renderer-react-components";
import { css } from "@emotion/core";
import { BillOfLadingDocument } from "./sample";

const containerStyle = css`
  font-family: "Arial", sans-serif;
  max-width: 1000px;
  margin: auto;
  padding: 30px;
  border: 1px solid #333;
`;

const headerStyle = css`
  text-align: center;
  margin-bottom: 30px;
`;

const titleStyle = css`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const gridContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const sectionStyle = css`
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
`;

const sectionTitleStyle = css`
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
`;

export const BillOfLadingTemplate: FunctionComponent<TemplateProps<BillOfLadingDocument> & { className?: string }> = ({
  document,
  className = "",
}) => {
  return (
    <div css={containerStyle} className={className} id="bill-of-lading-template">
      <div css={headerStyle}>
        <h1 css={titleStyle}>BILL OF LADING</h1>
        <p>B/L No: {document.blNumber}</p>
      </div>

      <div css={gridContainerStyle}>
        <div css={sectionStyle}>
          <div css={sectionTitleStyle}>Shipper</div>
          <p>{document.shipper.name}</p>
          <p>{document.shipper.address}</p>
        </div>

        <div css={sectionStyle}>
          <div css={sectionTitleStyle}>Consignee</div>
          <p>{document.consignee.name}</p>
          <p>{document.consignee.address}</p>
        </div>
      </div>

      <div css={sectionStyle}>
        <div css={sectionTitleStyle}>Notify Party</div>
        <p>{document.notifyParty.name}</p>
        <p>{document.notifyParty.address}</p>
      </div>

      <div css={gridContainerStyle}>
        <div css={sectionStyle}>
          <div css={sectionTitleStyle}>Vessel & Voyage</div>
          <p>Vessel: {document.vessel.name}</p>
          <p>Voyage: {document.vessel.voyage}</p>
        </div>

        <div css={sectionStyle}>
          <div css={sectionTitleStyle}>Ports</div>
          <p>Port of Loading: {document.portOfLoading}</p>
          <p>Port of Discharge: {document.portOfDischarge}</p>
        </div>
      </div>

      <div css={sectionStyle}>
        <div css={sectionTitleStyle}>Cargo Details</div>
        <p>Description: {document.cargo.description}</p>
        <p>Weight: {document.cargo.weight}</p>
        <p>Measurement: {document.cargo.measurement}</p>
      </div>

      <div css={sectionStyle}>
        <div css={sectionTitleStyle}>Issuer</div>
        <p>{document.issuers[0].name}</p>
        <p>Domain: {document.issuers[0].identityProof.location}</p>
      </div>
    </div>
  );
};
```

## Advanced Features and Multiple Views

In many cases, you'll want to provide multiple views or formats for the same document. TradeTrust's decentralized renderer framework makes this easy to implement. Let's explore how to create multiple views for a document and add advanced features.

### Implementing Multiple Views

To provide different views of the same document, you can register multiple templates for the same document type. This is useful when you want to show different aspects of the document or different formats (e.g., a detailed view vs. a summary view).

Let's extend our Bill of Lading example to include multiple views:

#### 1. Create Additional Template Components

Create a new file `src/templates/bill-of-lading/summary-template.tsx` for a summary view:

```jsx
import React, { FunctionComponent } from "react";
import { TemplateProps } from "@tradetrust-tt/decentralized-renderer-react-components";
import { css } from "@emotion/core";
import { BillOfLadingDocument } from "./sample";

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

export const BillOfLadingSummaryTemplate: FunctionComponent<TemplateProps<BillOfLadingDocument> & { className?: string }> = ({
  document,
  className = "",
}) => {
  return (
    <div css={containerStyle} className={className} id="bill-of-lading-summary-template">
      <div css={headerStyle}>
        <h2>BILL OF LADING SUMMARY</h2>
        <p>B/L No: {document.blNumber}</p>
      </div>

      <div css={sectionStyle}>
        <p><strong>Shipper:</strong> {document.shipper.name}</p>
        <p><strong>Consignee:</strong> {document.consignee.name}</p>
        <p><strong>Vessel:</strong> {document.vessel.name}, Voyage: {document.vessel.voyage}</p>
        <p><strong>Ports:</strong> {document.portOfLoading} to {document.portOfDischarge}</p>
        <p><strong>Cargo:</strong> {document.cargo.description}</p>
      </div>
    </div>
  );
};
```

#### 2. Update the Template Configuration

Modify your `src/templates/bill-of-lading/index.tsx` file to include both templates:

```jsx
import { BillOfLadingTemplate } from "./template";
import { BillOfLadingSummaryTemplate } from "./summary-template";

export const templates = [
  {
    id: "bill-of-lading-detailed",
    label: "Detailed View",
    template: BillOfLadingTemplate,
  },
  {
    id: "bill-of-lading-summary",
    label: "Summary View",
    template: BillOfLadingSummaryTemplate,
  },
];
```

#### 3. Add Storybook Stories for the New Template

Update your `src/templates/bill-of-lading/template.stories.tsx` file to include the summary view:

```jsx
import React, { FunctionComponent } from "react";
import { BillOfLadingTemplate } from "./template";
import { BillOfLadingSummaryTemplate } from "./summary-template";
import { sampleBillOfLading } from "./sample";

export default {
  title: "Bill of Lading",
  parameters: {
    componentSubtitle: "Bill of Lading Templates",
  },
};

export const DetailedView: FunctionComponent = () => {
  return <BillOfLadingTemplate document={sampleBillOfLading} handleObfuscation={() => {}} />;
};

export const SummaryView: FunctionComponent = () => {
  return <BillOfLadingSummaryTemplate document={sampleBillOfLading} handleObfuscation={() => {}} />;
};
```

### Adding Tab Navigation

When you have multiple views, it's useful to add tab navigation to switch between them. The TradeTrust framework includes a `Tabs` component that you can use for this purpose.

Create a new file `src/templates/bill-of-lading/tabs.tsx`:

```jsx
import React, { FunctionComponent, useState } from "react";
import { TemplateProps } from "@tradetrust-tt/decentralized-renderer-react-components";
import { css } from "@emotion/core";
import { BillOfLadingDocument } from "./sample";
import { BillOfLadingTemplate } from "./template";
import { BillOfLadingSummaryTemplate } from "./summary-template";

const tabsContainerStyle = css`
  margin-bottom: 20px;
`;

const tabStyle = css`
  padding: 10px 20px;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-bottom: none;
  cursor: pointer;
  background-color: #f9f9f9;
`;

const activeTabStyle = css`
  background-color: white;
  border-bottom: 2px solid white;
  font-weight: bold;
`;

const tabContentStyle = css`
  border: 1px solid #ddd;
  padding: 20px;
`;

export const BillOfLadingTabs: FunctionComponent<TemplateProps<BillOfLadingDocument> & { className?: string }> = ({
  document,
  handleObfuscation,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState("detailed");

  return (
    <div className={className}>
      <div css={tabsContainerStyle}>
        <button
          css={[tabStyle, activeTab === "detailed" && activeTabStyle]}
          onClick={() => setActiveTab("detailed")}
        >
          Detailed View
        </button>
        <button
          css={[tabStyle, activeTab === "summary" && activeTabStyle]}
          onClick={() => setActiveTab("summary")}
        >
          Summary View
        </button>
      </div>

      <div css={tabContentStyle}>
        {activeTab === "detailed" && (
          <BillOfLadingTemplate document={document} handleObfuscation={handleObfuscation} />
        )}
        {activeTab === "summary" && (
          <BillOfLadingSummaryTemplate document={document} handleObfuscation={handleObfuscation} />
        )}
      </div>
    </div>
  );
};
```

#### Update the Template Configuration

Modify your `src/templates/bill-of-lading/index.tsx` file to include the tabbed view:

```jsx
import { BillOfLadingTemplate } from "./template";
import { BillOfLadingSummaryTemplate } from "./summary-template";
import { BillOfLadingTabs } from "./tabs";

export const templates = [
  {
    id: "bill-of-lading-tabs",
    label: "All Views",
    template: BillOfLadingTabs,
  },
  {
    id: "bill-of-lading-detailed",
    label: "Detailed View",
    template: BillOfLadingTemplate,
  },
  {
    id: "bill-of-lading-summary",
    label: "Summary View",
    template: BillOfLadingSummaryTemplate,
  },
];
```

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
</>
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
</div>
```

### Adding Document Verification Status

You can display the verification status of a TradeTrust document in your template:

```jsx
import { utils } from "@tradetrust-tt/decentralized-renderer-react-components";

// Add this to your component
const { isVerified } = utils.documentStatus(document);

// Add this to your component's return statement
<div css={css`
  padding: 10px;
  background-color: ${isVerified ? "#e6f7e6" : "#ffebeb"};
  border-radius: 5px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`}>
  <div css={css`margin-right: 10px;`}>
    {isVerified ? "✓" : "✗"}
  </div>
  <div>
    <strong>{isVerified ? "Verified" : "Not Verified"}</strong>
    <p>{isVerified ? "This document has been verified." : "This document could not be verified."}</p>
  </div>
</div>
```

### 3. Create Storybook Stories for Bill of Lading

To preview your Bill of Lading template during development, create Storybook stories. Create a file `src/templates/bill-of-lading/template.stories.tsx`:

```jsx
import React, { FunctionComponent } from "react";
import { BillOfLadingTemplate } from "./template";
import { sampleBillOfLading } from "./sample";

export default {
  title: "Bill of Lading",
  component: BillOfLadingTemplate,
  parameters: {
    componentSubtitle: "Bill of Lading Template",
  },
};

export const Default: FunctionComponent = () => {
  return <BillOfLadingTemplate document={sampleBillOfLading} handleObfuscation={() => {}} />;
};
```

### 4. Configure the Bill of Lading Template

Create a configuration file for your template. Create a file `src/templates/bill-of-lading/index.tsx`:

```jsx
import { BillOfLadingTemplate } from "./template";

export const templates = [
  {
    id: "bill-of-lading",
    label: "Bill of Lading",
    template: BillOfLadingTemplate,
  },
];
```

### 5. Register the Bill of Lading Template

Register your template in the template registry. Update the file `src/templates/index.tsx`:

```jsx
import { TemplateRegistry } from "@tradetrust-tt/decentralized-renderer-react-components";
import { templates as billOfLadingTemplates } from "./bill-of-lading";

export const registry: TemplateRegistry<any> = {
  BILL_OF_LADING: billOfLadingTemplates,
};
```

### 6. Testing the Bill of Lading Template

To test your Bill of Lading template, run Storybook:

```bash
npm run storybook
```

This will start Storybook at `http://localhost:6006/`, where you can see and interact with your template. You can modify the data in the "Knobs" tab to see how your template renders with different inputs.

### 7. Customizing the Bill of Lading Template

You can customize the Bill of Lading template to fit your specific needs. Here are some examples of customizations you might want to make:

#### Adding a Logo

Update your template component to include a logo:

```jsx
// Add to your imports
import logo from "./logo.png";

// Add to your styles
const logoStyle = css`
  max-width: 200px;
  margin-bottom: 20px;
`;

// Add to your component's return statement, inside the headerStyle div
<img src={logo} alt="Company Logo" css={logoStyle} />
```

#### Adding a Barcode or QR Code

You can add a barcode or QR code to your template:

```jsx
// Add to your imports
import { QRCode } from "react-qrcode-logo";

// Add to your styles
const qrCodeStyle = css`
  margin: 20px auto;
  display: block;
`;

// Add to your component's return statement
<QRCode
  value={document.blNumber}
  size={150}
  quietZone={10}
  css={qrCodeStyle}
/>
```

Remember to install the required package:

```bash
npm install react-qrcode-logo
```

## Conclusion

In this guide, we've explored detailed examples of implementing document preview templates for TradeTrust documents. We've covered:

1. Creating a Bill of Lading template with a complete data structure and React component
2. Implementing a Cover Letter template with customization options
3. Adding advanced features like multiple views, tab navigation, print-friendly views, and dynamic form fields

By following these examples, you can create professional-looking document templates that enhance the user experience when viewing TradeTrust documents. Remember that the templates you create can be as simple or as complex as needed for your specific use case.

### Next Steps

- Explore the [Best Practices](/docs/how-tos/document-preview-templates/best-practices) guide for tips on optimizing your templates
- Check out the [Troubleshooting](/docs/how-tos/document-preview-templates/troubleshooting) guide if you encounter any issues