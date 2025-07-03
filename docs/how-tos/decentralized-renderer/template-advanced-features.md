---
id: template-advanced-features
title: Template Advanced Features
sidebar_label: Template Advanced Features
---

# Template Advanced Features

This guide explores advanced features for document preview templates in TradeTrust. These features enhance the functionality and user experience of your templates beyond basic rendering.

## Introduction

Once you've created your basic document templates, you can enhance them with advanced features like multiple views, print-friendly formatting, and more. This guide demonstrates how to implement these features in your templates.

Before proceeding with these examples, make sure you're familiar with the basics of [decentralized renderer](/docs/how-tos/decentralized-renderer/decentralized-renderer-guide.md) and understand the [generic templates](/docs/how-tos/decentralized-renderer/using-generic-templates) available in TradeTrust.

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
    {/* Rest of your template */}
  </>
)
```
![Print Watermark](/docs/tutorial/decentralised-renderer/print-watermark.png)

### Conditional Rendering

You can conditionally render parts of your template based on document data or other conditions:

```jsx
export const ConditionalTemplate = ({ document }) => {
  return (
    <div>
      <h2>Document Details</h2>
      
      {/* Only show if the document has a valid status */}
      {document?.status === "VALID" && (
        <div className="valid-badge">✓ VALID</div>
      )}
      
      {/* Show different content based on document type */}
      {document?.type === "NEGOTIABLE" ? (
        <div className="negotiable-section">
          <h3>Negotiable Document</h3>
          {/* Negotiable-specific content */}
        </div>
      ) : (
        <div className="non-negotiable-section">
          <h3>Non-Negotiable Document</h3>
          {/* Non-negotiable-specific content */}
        </div>
      )}
    </div>
  );
};
```

### Interactive Elements

You can add interactive elements to your templates to enhance user experience:

```jsx
import React, { useState } from "react";
import { css, Global } from "@emotion/react";

export const InteractiveTemplate = ({ document }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };
  
  // CSS for print-friendly collapsible sections
  const printStyles = css`
    @media print {
      /* Hide toggle buttons when printing */
      .collapsible-toggle {
        display: none !important;
      }
      
      /* Always show section content when printing */
      .section-content {
        display: block !important;
        height: auto !important;
        overflow: visible !important;
        opacity: 1 !important;
      }
    }
  `;
  
  return (
    <div>
      <Global styles={printStyles} />
      <h2>Interactive Document View</h2>
      
      <div className="collapsible-section">
        <button className="collapsible-toggle" onClick={() => toggleSection("shipment")}>
          {expandedSection === "shipment" ? "▼" : "►"} Shipment Details
        </button>
        
        <div className="section-content" style={{ 
          display: expandedSection === "shipment" ? "block" : "none" 
        }}>
          <p><strong>Vessel:</strong> {document?.vessel?.name}</p>
          <p><strong>Voyage:</strong> {document?.vessel?.voyage}</p>
          <p><strong>Port of Loading:</strong> {document?.portOfLoading}</p>
          <p><strong>Port of Discharge:</strong> {document?.portOfDischarge}</p>
        </div>
      </div>
      
      <div className="collapsible-section">
        <button className="collapsible-toggle" onClick={() => toggleSection("cargo")}>
          {expandedSection === "cargo" ? "▼" : "►"} Cargo Details
        </button>
        
        <div className="section-content" style={{ 
          display: expandedSection === "cargo" ? "block" : "none" 
        }}>
          <p><strong>Description:</strong> {document?.cargo?.description}</p>
          <p><strong>Weight:</strong> {document?.cargo?.weight}</p>
          <p><strong>Measurement:</strong> {document?.cargo?.measurement}</p>
        </div>
      </div>
    </div>
  );
};
```

### Data Visualization

Enhance your templates with charts and graphs to visualize document data:

```jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export const DataVisualizationTemplate = ({ document }) => {
  // Transform package data for visualization
  const packageData = document.packages.map((pkg, index) => ({
    name: `Package ${index + 1}`,
    weight: parseFloat(pkg.weight),
    measurement: parseFloat(pkg.measurement),
  }));
  
  return (
    <div>
      <h2>Cargo Visualization</h2>
      
      <div className="chart-container">
        <h3>Package Weight and Measurement</h3>
        <BarChart width={600} height={300} data={packageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="weight" fill="#8884d8" name="Weight (kg)" />
          <Bar dataKey="measurement" fill="#82ca9d" name="Measurement (cbm)" />
        </BarChart>
      </div>
      
      <div className="data-table">
        <h3>Package Details</h3>
        <table>
          <thead>
            <tr>
              <th>Package</th>
              <th>Description</th>
              <th>Weight (kg)</th>
              <th>Measurement (cbm)</th>
            </tr>
          </thead>
          <tbody>
            {document.packages.map((pkg, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{pkg.description}</td>
                <td>{pkg.weight}</td>
                <td>{pkg.measurement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### Internationalization Support

Add multi-language support to your templates for international users:

```jsx
import React, { useState } from "react";

// Simple translation dictionary
const translations = {
  en: {
    title: "Bill of Lading",
    shipper: "Shipper",
    consignee: "Consignee",
    vessel: "Vessel",
    voyage: "Voyage",
    portOfLoading: "Port of Loading",
    portOfDischarge: "Port of Discharge",
    cargo: "Cargo",
  },
  zh: {
    title: "提单",
    shipper: "托运人",
    consignee: "收货人",
    vessel: "船舶",
    voyage: "航次",
    portOfLoading: "装货港",
    portOfDischarge: "卸货港",
    cargo: "货物",
  },
  es: {
    title: "Conocimiento de Embarque",
    shipper: "Embarcador",
    consignee: "Consignatario",
    vessel: "Buque",
    voyage: "Viaje",
    portOfLoading: "Puerto de Carga",
    portOfDischarge: "Puerto de Descarga",
    cargo: "Carga",
  },
};

export const MultiLanguageTemplate = ({ document }) => {
  const [language, setLanguage] = useState("en");
  const t = translations[language];
  
  return (
    <div>
      <div className="language-selector">
        <button onClick={() => setLanguage("en")}>English</button>
        <button onClick={() => setLanguage("zh")}>中文</button>
        <button onClick={() => setLanguage("es")}>Español</button>
      </div>
      
      <h2>{t.title}</h2>
      <p>B/L No: {document.blNumber}</p>
      
      <div>
        <p><strong>{t.shipper}:</strong> {document.shipper.name}</p>
        <p><strong>{t.consignee}:</strong> {document.consignee.name}</p>
        <p><strong>{t.vessel}:</strong> {document.vessel.name}</p>
        <p><strong>{t.voyage}:</strong> {document.vessel.voyage}</p>
        <p><strong>{t.portOfLoading}:</strong> {document.portOfLoading}</p>
        <p><strong>{t.portOfDischarge}:</strong> {document.portOfDischarge}</p>
        <p><strong>{t.cargo}:</strong> {document.cargo.description}</p>
      </div>
    </div>
  );
};
```

## Conclusion

Implementing advanced features in your TradeTrust document templates can significantly enhance the user experience and functionality of your documents. By leveraging multiple views, print-friendly formatting, conditional rendering, interactive elements, data visualization, QR codes, and internationalization, you can create rich, interactive document experiences that meet diverse user needs.

Remember that these advanced features should complement the core purpose of your document templates: to present document data clearly and accurately. Always prioritize readability and usability when implementing these features.

For more information on TradeTrust's decentralized renderer framework, refer to the [decentralized renderer guide](/docs/how-tos/decentralized-renderer/decentralized-renderer-guide.md) and explore the [generic templates](/docs/how-tos/decentralized-renderer/using-generic-templates) available in TradeTrust.
