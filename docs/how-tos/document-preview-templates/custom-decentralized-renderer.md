---
id: custom-decentralized-renderer
title: Creating a Custom Decentralized Renderer
sidebar_label: Custom Decentralized Renderer
---

# Creating a Custom Decentralized Renderer

TradeTrust documents are designed to be both machine-readable and human-readable. While the data is stored in JSON format, a renderer is needed to present this data in a visually appealing way. This guide will walk you through the process of creating your own custom decentralized renderer for TradeTrust documents.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) (v14 or later recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- A [GitHub account](https://github.com/)
- A [Netlify account](https://www.netlify.com/) (for deployment)
- Basic knowledge of [React.js](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Clone the Template Repository

TradeTrust provides a template repository to help you get started quickly. Clone the repository and set up your project:

```bash
git clone https://github.com/TradeTrust/tradetrust-decentralized-renderer.git
cd tradetrust-decentralized-renderer
rm -rf .git
git init
```

### Install Dependencies

Install the required dependencies:

```bash
npm install
```

### Understanding the Project Structure

The template repository has the following structure:

```
tradetrust-decentralized-renderer/
├── src/
│   ├── core/                  # Core components for the renderer
│   ├── templates/             # Template definitions
│   │   ├── index.tsx          # Template registry
│   │   └── sample/            # Sample template
│   │       ├── index.tsx      # Template configuration
│   │       ├── sample.ts      # Sample data
│   │       ├── template.tsx   # Template component
│   │       └── template.stories.tsx  # Storybook stories
│   └── index.tsx              # Main entry point
├── .storybook/               # Storybook configuration
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Creating Your First Template

In this section, we'll create a custom template for a Certificate of Completion (COC). This will demonstrate the process of creating a template for any document type.

### 1. Define the Document Data Structure

First, create a new folder for your template and define the data structure. Create a file `src/templates/coc/sample.ts`:

```typescript
import { v2 } from "@trustvc/trustvc";

export interface CocTemplateCertificate extends v2.OpenAttestationDocument {
  name: string;
  recipient: {
    name: string;
  };
  issueDate: string;
  course: {
    name: string;
    duration: string;
  };
}

export const cocTemplateCertificate: CocTemplateCertificate = {
  name: "Certificate of Completion",
  issuers: [
    {
      name: "TradeTrust Academy",
      documentStore: "0xBBb55Bd1D709955241CAaCb327A765e2b6D69c8b",
      identityProof: {
        location: "tradetrust-academy.example.com",
        type: v2.IdentityProofType.DNSTxt,
      },
    },
  ],
  recipient: {
    name: "John Doe",
  },
  issueDate: "2025-06-24",
  course: {
    name: "TradeTrust Implementation",
    duration: "40 hours",
  },
  $template: {
    name: "COC",
    type: v2.TemplateType.EmbeddedRenderer,
    url: "http://localhost:3000",
  },
};
```

### 2. Create the Template Component

Next, create the React component that will render your certificate. Create a file `src/templates/coc/template.tsx`:

```jsx
import React, { FunctionComponent } from "react";
import { TemplateProps } from "@tradetrust-tt/decentralized-renderer-react-components";
import { css } from "@emotion/core";
import { CocTemplateCertificate } from "./sample";

const containerStyle = css`
  background-color: #ffffff;
  padding: 30px;
  max-width: 800px;
  margin: auto;
  border: 1px solid #333333;
  font-family: "Arial", sans-serif;
`;

const headerStyle = css`
  text-align: center;
  margin-bottom: 30px;
`;

const titleStyle = css`
  font-size: 2.5em;
  color: #0099cc;
  margin-bottom: 10px;
`;

const contentStyle = css`
  text-align: center;
  margin: 20px 0;
`;

const footerStyle = css`
  margin-top: 50px;
  text-align: center;
  font-size: 0.9em;
  color: #666666;
`;

export const CocTemplate: FunctionComponent<TemplateProps<CocTemplateCertificate> & { className?: string }> = ({
  document,
  className = "",
}) => {
  return (
    <div css={containerStyle} className={className} id="certificate-of-completion">
      <div css={headerStyle}>
        <h1 css={titleStyle}>{document.name}</h1>
        <p>This certifies that</p>
        <h2>{document.recipient.name}</h2>
        <p>has successfully completed</p>
        <h3>{document.course.name}</h3>
        <p>with a duration of {document.course.duration}</p>
      </div>
      
      <div css={contentStyle}>
        <p>Issued on: {document.issueDate}</p>
        <p>By: {document.issuers[0].name}</p>
      </div>
      
      <div css={footerStyle}>
        <p>Verify this certificate using TradeTrust</p>
        <p>Document ID: {document.$template.name}</p>
      </div>
    </div>
  );
};
```

### 3. Create Storybook Stories

To preview your template during development, create Storybook stories. Create a file `src/templates/coc/template.stories.tsx`:

```jsx
import React, { FunctionComponent } from "react";
import { CocTemplate } from "./template";
import { cocTemplateCertificate } from "./sample";

export default {
  title: "Certificate of Completion",
  component: CocTemplate,
  parameters: {
    componentSubtitle: "Certificate of Completion Template",
  },
};

export const Default: FunctionComponent = () => {
  return <CocTemplate document={cocTemplateCertificate} handleObfuscation={() => {}} />;
};
```

### 4. Configure the Template

Create a configuration file for your template. Create a file `src/templates/coc/index.tsx`:

```jsx
import { CocTemplate } from "./template";

export const templates = [
  {
    id: "certificate",
    label: "Certificate",
    template: CocTemplate,
  },
];
```

### 5. Register the Template

Register your template in the template registry. Update the file `src/templates/index.tsx`:

```jsx
import { TemplateRegistry } from "@tradetrust-tt/decentralized-renderer-react-components";
import { templates as cocTemplates } from "./coc";

export const registry: TemplateRegistry<any> = {
  COC: cocTemplates,
};
```

## Testing Your Template

### Run Storybook

To preview your template during development, run Storybook:

```bash
npm run storybook
```

This will start Storybook at `http://localhost:6006/`, where you can see and interact with your template.

### Test with Different Data

In Storybook, you can modify the data in the "Knobs" tab to see how your template renders with different inputs. This is useful for testing edge cases and ensuring your template is robust.

## Advanced Template Features

### Multiple Views

You can create multiple views for a single document, such as a certificate view and a transcript view. Update your template configuration:

```jsx
import { CocTemplate } from "./template";
import { TranscriptTemplate } from "./transcript";

export const templates = [
  {
    id: "certificate",
    label: "Certificate",
    template: CocTemplate,
  },
  {
    id: "transcript",
    label: "Transcript",
    template: TranscriptTemplate,
  },
];
```

### Responsive Design

Ensure your template looks good on different screen sizes by using responsive design principles:

```jsx
const containerStyle = css`
  background-color: #ffffff;
  padding: 30px;
  max-width: 800px;
  margin: auto;
  border: 1px solid #333333;
  font-family: "Arial", sans-serif;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.9em;
  }
`;
```

### Print Optimization

Add print-specific styles to ensure your template prints well:

```jsx
const containerStyle = css`
  background-color: #ffffff;
  padding: 30px;
  max-width: 800px;
  margin: auto;
  border: 1px solid #333333;
  font-family: "Arial", sans-serif;
  
  @media print {
    border: none;
    padding: 0;
    max-width: 100%;
  }
`;
```

## Deploying Your Renderer

### Push to GitHub

Create a new repository on GitHub and push your code:

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-renderer-repo.git
git push -u origin master
```

### Deploy to Netlify

1. Log in to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

Once deployed, you'll get a URL for your renderer (e.g., `https://your-renderer.netlify.app`).

### Update Template URL

Update the `$template.url` in your document data to point to your deployed renderer:

```typescript
$template: {
  name: "COC",
  type: v2.TemplateType.EmbeddedRenderer,
  url: "https://your-renderer.netlify.app",
}
```

## Production Considerations

### Custom Domain

For production use, it's recommended to use a custom domain for your renderer:

1. Purchase a domain name
2. Configure DNS settings to point to your Netlify site
3. Set up HTTPS for your custom domain

### Performance Optimization

Optimize your renderer for production:

1. Minimize bundle size
2. Use code splitting
3. Optimize images and assets
4. Implement caching strategies

### Monitoring and Analytics

Set up monitoring and analytics for your renderer:

1. Add error tracking
2. Implement performance monitoring
3. Set up usage analytics

## Troubleshooting

### Common Issues

1. **Template not rendering**: Check that the `$template.name` in your document matches the key in the template registry.
2. **CORS errors**: Ensure your renderer allows cross-origin requests.
3. **Styling issues**: Check for CSS conflicts or missing styles.

### Getting Help

If you encounter issues while creating a custom decentralized renderer, you can:

1. Check the [TradeTrust documentation](https://docs.tradetrust.io/)
2. Examine the [example renderer](https://github.com/TradeTrust/decentralized-renderer-react-template) for reference

You've now created a custom decentralized renderer for TradeTrust documents. This renderer can be used to display your documents in a visually appealing way, tailored to your specific needs.

By following the steps in this guide, you can create renderers for any type of document, from certificates and invoices to bills of lading and more.
