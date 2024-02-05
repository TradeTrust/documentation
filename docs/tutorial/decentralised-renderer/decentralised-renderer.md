---
id: decentralised-renderer
title: Creating a Custom Decentralised Renderer
sidebar_label: Creating a Custom Decentralised Renderer
---

TradeTrust documents are both readable by machines as well as by humans. Every TradeTrust document file is stored in a `.json` format, allowing any application to process the content within. To present the data file in a human-readable format, a renderer needs to be written.

In this guide, we will build and deploy the renderer to display data from a 📜 Certificate of Completion.

This renderer is a static website that will be embedded in compliant TradeTrust viewer. It will take in the TradeTrust document and generates the corresponding HTML code for rendering.

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [GitHub account](https://github.com/)
- [Netlify account](https://www.netlify.com/)
- [Basic React.js and TypeScript knowledge](https://reactjs.org/)

## Clone Decentralized Renderer React Template

A template for building your own document renderer has been created for you at [our GitHub template repository](https://github.com/Open-Attestation/decentralized-renderer-react-template).

### Clone code repository locally

```sh
git clone https://github.com/TradeTrust/tradetrust-decentralized-renderer.git
cd tradetrust-decentralized-renderer
rm -rf .git
```

### Install code dependencies

```sh
npm install
```

### Run development preview

```sh
npm run storybook
```

### Development environment

![Default Story Book View](/docs/reference/configuration/custom-renderer/default-storybook.png)

After running the Storybook, you should be able to see the templates samples provided at `http://localhost:6006/`.

This is a live preview where you can see the changes when you:

1. edit the raw document data in the `Knobs` tab
1. edit the template code to render the data

### Clean the template

In order to fully understand how developing a renderer work, we will start by cleaning it a bit:

- remove all the template folders under `src/templates`
<<<<<<< HEAD
  :::info
  don't delete `src/templates/index.tsx` as it is the template registry
  :::
=======
:::info
don't delete `src/templates/index.tsx` as it is the template registry
:::
>>>>>>> 9824382 (feat: tt-11 replace repo include core comps (#135))

Once you have finished the tutorial feel free to clone the repository again and have a look into the deleted files.

Once you have a better understanding about how this decentralised renderer works, you can go ahead and fork a version of this repo and start development of your very own decentralised renderer template.

## Developing the Document Renderer

Now that we have set up the development environment, we can start writing our document renderer. We will first define the data structure of our 📜 Certificate of Completion (COC), followed by writing the renderer to render the HTML code corresponding to the data provided.

### Update sample document data and type

To update the raw document data and the corresponding data type, you will need to create the new folder for the template and data definition file in `src/templates/coc/sample.ts`:

```typescript jsx
import { v2 } from "@govtechsg/open-attestation";

export interface CocTemplateCertificate extends v2.OpenAttestationDocument {
  name: string;
  recipient: {
    name: string;
  };
}

export const cocTemplateCertificate: CocTemplateCertificate = {
  name: "TradeTrust Tutorial Certificate of Completion",
  issuers: [
    {
      name: "My name",
      documentStore: "0xBBb55Bd1D709955241CAaCb327A765e2b6D69c8b",
      identityProof: {
        location: "few-green-cat.sandbox.openattestation.com",
        type: v2.IdentityProofType.DNSTxt,
      },
    },
  ],
  recipient: {
    name: "John Doe",
  },
  $template: {
    name: "COC",
    type: v2.TemplateType.EmbeddedRenderer,
    url: "http://localhost:3000",
  },
};
```

### Document objects explained

In the above TradeTrust document, you will see four root objects:

#### `$template`

The `$template` key to describe the template name used to render this display. It should have the following keys:

- `$template.name` is the name of the template used to render a given TradeTrust document. This allows a single document renderer to render for multiple types of TradeTrust documents; each with a different template name.

- `$template.type` will always take the value of `EMBEDDED_RENDERER` for documents rendered in this manner.

- `$template.url` will be the remote URL where your TradeTrust decentralized renderer resides. For now, we set it to `https://localhost:3000` but we will change this value later on in the [Deploying Document Renderer](#deploying-document-renderer) section.

#### `name`

The `name` key is a compulsory key to describe the type of TradeTrust document. In this case, we are creating a `TradeTrust Tutorial Certificate of Completion`.

#### `recipient`

TradeTrust documents do not have a strict data structure and allows issuers of documents to define their own data schema. The `recipient` object is a user-defined object that describes who the certificate is conferred to. In this case, you may replace `John Doe` with your name.

In the next section, you will learn more about the TradeTrust document schema and how you may define your own data structure. For this guide, we will stick to this simple document.

#### `issuers`

See [Creating Raw Document](/docs/tutorial/verifiable-documents/raw-document).

### Developing the COC Template View

Now that the structure of the data has been defined, we may proceed to style our 📜 Certificate of Completion.

To change how the data is being rendered, we simply create a React component that takes in the raw document in the `document` props and render the corresponding HTML code.

For our 📜 Certificate of Completion, we will simply display the following text:

```text
OpenAttestation Tutorial Certificate of Completion
awarded to
John Doe
```

The first step consist of creating a file `src/templates/coc/template.tsx` with the following content:

```jsx harmony
import React, { FunctionComponent } from "react";
import { TemplateProps } from "@govtechsg/decentralized-renderer-react-components";
import { css } from "@emotion/core";
import { CocTemplateCertificate } from "./sample";

const containerStyle = css`
  background-color: #324353;
  color: #ffffff;
  padding: 15px;
  margin: auto;
  width: 80%;
  text-align: center;
`;

export const CocTemplate: FunctionComponent<TemplateProps<CocTemplateCertificate> & { className?: string }> = ({
  document,
  className = "",
}) => {
  return (
    <div css={containerStyle} className={className} id="custom-template">
      <h1>{document.name}</h1>
      <div>awarded to</div>
      <h2>{document.recipient.name}</h2>
    </div>
  );
};
```

Now that the component has been created, we can add a story to view it. Next to `src/templates/coc/template.tsx` create a file called `template.stories.tsx` with the following content:

```jsx harmony
import { Meta, Preview, Props, Description, Story } from "@storybook/addon-docs/blocks";
import { CocTemplate } from "./template";
import { cocTemplateCertificate } from "./sample";
import { FunctionComponent } from "react";
<<<<<<< HEAD
import React from "react";
=======
import React from 'react';
>>>>>>> 9824382 (feat: tt-11 replace repo include core comps (#135))

export default {
  title: "Sample Template",
  component: CocTemplate,
  parameters: {
    componentSubtitle: "Sample Template",
  },
};

<<<<<<< HEAD
export const SampleTemplate: FunctionComponent = () => {
  return <CocTemplate document={cocTemplateCertificate} handleObfuscation={() => {}} />;
};
=======
export const SampleTemplate: FunctionComponent  = ()=> {
  return <CocTemplate document={cocTemplateCertificate} handleObfuscation={() => {}} />
}
>>>>>>> 9824382 (feat: tt-11 replace repo include core comps (#135))
```

We can now [start storybook](#run-development-preview) and make sure our component looks like expected as below.

![Completed Story Book View](/docs/reference/configuration/custom-renderer/completed-storybook.png)

### Certificate of Completion template configuration

A TradeTrust document may have multiple views, each of them rendered in separate tabs. For example, a TradeTrust document that is a degree certificate may have the actual certificate as one view, and the transcript as another view in a single template.

For our 📜 Certificate of Completion, we will only use a single view. Create a file `src/templates/coc/index.tsx` with the following content:

```js
import { CocTemplate } from "./template";

export const templates = [
  {
    id: "certificate",
    label: "Certificate",
    template: CocTemplate,
  },
];
```

- `templates` must be an array where each element correspond to a view (or a tab). Here we need only one view.
- Each view must define the following property:
  - `id` which must be a uniq identifier for this template configuration.
  - `label` which will be displayed by tab in the application loading the renderer.
  - `template` which is is the component that will be displayed.

### Renderer template configuration

`src/templates/index.tsx` is a file containing the configuration of all the templates available in this renderer.

To register a new template, simply add it as a key to the `registry` constant. Take note that the key is case sensitive and must match the `$template.name` value defined in the [document data](#template).

Replace `src/templates/index.tsx` with the following code to add the new `COC` template:

```js
import { TemplateRegistry } from "@govtechsg/decentralized-renderer-react-components";
import { templates } from "./coc";

export const registry: TemplateRegistry<any> = {
  COC: templates,
};
```

If you open `src/index.tsx` you will notice that the `registry` defined above is used and provided to a component called `FramedDocumentRenderer`. This component will handle automatically the connection to the application and will display the correct component depending on your configuration. You can find more information in [this github repository](https://github.com/Open-Attestation/decentralized-renderer-react-components)

Now, your document renderer is ready to be built and deployed online.

## Deploying Document Renderer

### Push code to GitHub

Create a new repository in GitHub and push the code to the new repository. For a step-by-step guide to import source code to GitHub, you may read [this guide](https://help.github.com/en/github/importing-your-projects-to-github/adding-an-existing-project-to-github-using-the-command-line).

### Deploy site onto Netlify

Once you have your code on GitHub, you may build and deploy the site onto [Netlify](https://netlify.com).

![Create a new site on netlify](/docs/reference/configuration/custom-renderer/netlify-new.png)

Select "New Site From Git" and then "GitHub".

![Build settings](/docs/reference/configuration/custom-renderer/netlify-build.png)

On the build page, enter `npm run build` as the "Build command" and `dist` as the "Publish Directory" and click on "Deploy Site".

![Sample Deployed URL](/docs/reference/configuration/custom-renderer/netlify-deployed.png)

Once the site has been deployed, you will obtain the URL to the document renderer site. In the above example, the URL is `https://frosty-joliot-c02c3d.netlify.com/`.

Note that the website will be an empty page when viewed directly. **This is normal because it is not meant to be viewed directly through a web browser.**

> Save the website url for future reference. You should also update the `$template.url` in your OA document.

## Additional Note for Production Document Renderer

It is recommended to use a custom domain you own for the document renderer website in production. This prevents locking in to any specific third party hosting provider.

If you are using Netlify, we recommend you to check out [how to enable custom domains](https://docs.netlify.com/domains-https/custom-domains/).

## Core Components

Core components, located in the `src/core directory`, are reusable React components that offer enhanced functionalities for your decentralized renderer template.

This repository contains a collection of example templates along with demonstrations of how to use core components. You can find these examples in the `/src/templates` directory. These templates serve as references and guides to help you set up your own templates to meet your unique requirements.

### DocumentQrCode

It allows users to share documents across devices using a QR code.

For detailed information on how to use the QR Code Component, please refer to the official documentation [here](https://docs.tradetrust.io/docs/reference/tradetrust-website/qr-code/).

![QRCode Example](/docs/reference/core-components/qr.png)

### Wrapper/ ErrorBoundary

The Wrapper/ErrorBoundary Component is designed to handle scenarios where a template cannot be rendered correctly. In such cases, this component can act as a fallback, displaying a user-friendly error message and stack.

![Wrapper/ ErrorBoundary Example](/docs/reference/core-components/wrapper.png)

### PrivacyFilter

The Privacy Filter Component is a powerful tool for safeguarding sensitive information within a document. To use the Privacy Filter in the decentralized renderer, follow these steps

Click the "Edit Document" button within the PrivacyFilter component.

![Privacy Filter Example](/docs/reference/core-components/privacyfilter-1.png)

Click "Remove" on the redactable values to specify the information you want to remove.

![Privacy Filter Example](/docs/reference/core-components/privacyfilter-2.png)

Click "Done" on the Privacy Filter Component to complete the process. After that, you can now download the document with hidden values

![Privacy Filter Example](/docs/reference/core-components/privacyfilter-3.png)

### PrintWatermark

The PrintWatermark Component allows users to include the TradeTrust watermark text in the background of a document's print preview.

![PrintWatermark Example](/docs/reference/core-components/watermark.png)

## See Also

[Generic Templates by TradeTrust](/docs/reference/generic-templates/overview)
