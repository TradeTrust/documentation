---
id: inline-html-renderer
title: Inline HTML Renderer
sidebar_label: Inline HTML Renderer
---

:::caution Beta
The inline HTML renderer currently ships only on the `@trustvc/trustvc@beta` tag — it is not yet in `latest`. Install with `npm install @trustvc/trustvc@beta`, and expect APIs to change before the stable release.
:::

This guide walks you through issuing a W3C Verifiable Credential that carries its own HTML and CSS template, and building a viewer that verifies, renders and prints it — entirely offline, with no remote renderer. Along the way you'll see exactly which `@trustvc/trustvc` SDK functions are used at each step: issuance (`compressTemplate`, `DocumentBuilder.inlineTemplate()`), and rendering (`verifyDocument`, `getRenderMethods`, `decompressInlineTemplate`, `renderInlineTemplate`, `printInlineTemplate`).

## What You'll Learn

- Write an HTML + CSS template that binds to a credential's `credentialSubject` with `data-field`, `data-field-src` and `data-repeat` attributes
- Compress a template and attach it to a document with `DocumentBuilder.inlineTemplate()`, alongside a URL renderer as a fallback
- Sign the document so the template is covered by the proof
- Verify the document and render the embedded template in a sandboxed iframe
- Print the rendered template
- Understand the fallback behaviour for documents without an inline template

## How It Works

A credential's `renderMethod` can carry a URL-based entry (the existing decentralised renderer) and an `INLINE_HTML_TEMPLATE` entry side by side. A viewer that understands inline templates uses it; everything else, and any failed inline render, falls back to the URL entry unchanged.

| | Decentralised renderer | Inline template |
| --- | --- | --- |
| Where the template lives | A website the issuer hosts, named by a URL `renderMethod` entry | Inside the credential itself |
| Network needed to render | Yes, the renderer page loads in an iframe | No — renders fully offline |
| Covered by the credential's proof | Only the URL, not the page behind it | Yes — the HTML and CSS are part of the signed document |
| Template logic | Arbitrary JavaScript (a React app) | Declarative HTML with `data-field` / `data-field-src` / `data-repeat` bindings; no scripts run |

A document usually carries both entries, so older viewers (and newer ones where the inline render fails) still display correctly.

## Prerequisites

Before starting, make sure you have:

- Node.js (version 20 or higher), npm or yarn, and a code editor
- `@trustvc/trustvc@beta` installed in your project — see the beta note above
- A signing key pair and a working document issuance flow. This tutorial assumes you can already generate a DID and build/sign a document with `DocumentBuilder` — if you haven't done this yet, follow the [Creator tutorial](/docs/tutorial/creator) first, then come back here with your `didKeyPairs` and `DocumentBuilder` instance ready. We'll focus only on what's specific to the inline renderer: writing a template and attaching it before signing.

## Part 1: Writing and Attaching an Inline Template

### 1. Write the template

A template is static HTML plus CSS, filled from `credentialSubject` through three binding attributes:

- `data-field="key"` — sets the element's text to `String(subject[key])`
- `data-field-src="key"` — sets an `<img>`'s `src` attribute (e.g. a `data:` URI logo)
- `<template data-repeat="key">...</template>` — clones its content once per item of the array `subject[key]`

```ts
const html = `
  <div class="bol">
    <h1>Bill of Lading <span data-field="blNumber"></span></h1>
    <p>Shipper: <span data-field="shipperName"></span></p>
    <table><tbody>
      <template data-repeat="packages">
        <tr><td data-field="packagesDescription"></td></tr>
      </template>
    </tbody></table>
  </div>
`;
const css = ".bol { font-family: sans-serif; } .bol h1 { color: navy; }";
```

No `<script>` tags, event-handler attributes or `javascript:` links will ever run — the template renders inside a sandboxed iframe with no `allow-scripts` (see [Security model](#security-model) below).

### 2. Compress the template

The credential's JSON-LD context defines `template` as a plain string term, so only a compressed string passes signing — never the template object.

```ts
import { compressTemplate } from "@trustvc/trustvc";

const compressed = await compressTemplate({
  templateName: "BILL_OF_LADING",
  html,
  css,
});
console.log("Compressed template:", compressed.slice(0, 12) + "...");
// always starts with "H4sI" — every gzip stream starts 1f 8b 08
```

`compressTemplate` returns `base64url(gzip(JSON.stringify({ templateName, html, css })))`. It's the only form issuers should produce; a viewer decompresses it back to an object after verification.

### 3. Attach it to your document and sign

Call `.inlineTemplate()` on your existing `DocumentBuilder` — the one that already has `credentialSubject()` and, typically, a URL `renderMethod()` fallback set up — then sign as usual:

```ts
import { DocumentBuilder } from "@trustvc/trustvc";

// `builder` already has credentialSubject() and renderMethod() set, e.g. from the Creator tutorial.
builder.inlineTemplate(compressed); // Adds the INLINE_HTML_TEMPLATE entry after the URL entry.

const signed = await builder.sign(didKeyPairs, "ecdsa-sd-2023", {
  // Make /renderMethod mandatory so a holder can't derive a copy that drops the template.
  mandatoryPointers: ["/renderMethod"],
});

console.log(JSON.stringify(signed, null, 2));
```

A few rules worth knowing about `inlineTemplate()`:

- It only accepts a `compressTemplate()` string — passing the template object or raw JSON throws `Configuration Error: inlineTemplate expects a template compressed with compressTemplate().`
- `inlineTemplate()` and `renderMethod()` can be called in either order; the result is always `[urlEntry, inlineEntry]`, so legacy readers that take `renderMethod[0]` still find a URL.
- Calling `inlineTemplate()` again replaces the inline entry — there is never more than one.
- Both methods throw `Configuration Error: Document is already signed.` once the document is signed.
- The template is covered by the proof: swapping in a different template, even a validly compressed one, fails verification. Pass `mandatoryPointers: ['/renderMethod']` for selective-disclosure suites (`ecdsa-sd-2023`, `bbs-2023`) — otherwise a holder could derive a copy with the template or the fallback URL stripped out.

Its `renderMethod` array now carries both entries:

```json
"renderMethod": [
  {
    "id": "https://generic-templates.tradetrust.io",
    "type": "EMBEDDED_RENDERER",
    "templateName": "BILL_OF_LADING"
  },
  {
    "type": "INLINE_HTML_TEMPLATE",
    "template": "H4sIAAAAAAAAE22QT2uEMBDFv8ow57Xi1c0GuiwtC2IPvQrLaOIaGpOQpIKI372oa_9ALzm8eW_ebzJhlL3TFGVJvcQcz9eiuL293Irny7V8xQN2sdeYY2UAmFADNJpCOFVYW10hX2QA1mX8rLQG20JBQpk7sODIgKBISaukFktCl599LX2FnKXLmLO0y_YVjr93yjnp8_-yYZstkL_jbk9HqrXkLNZWjA9tUR-3bbu8dJLiqUJHzQfdZfjm38yesyj-1u7OiwyNVy4qa9b6KJbH_zSle9UOlG4oLN3I1u9LhRp4ZfCATQiY41NtNUzQWhOTlnqlxxwCmZAE6VV7hBlWR5fBBI3V1udgaBiPMOP8BZ_YO9u5AQAA"
  }
]
```

## Part 2: Verifying and Rendering the Document

This part sets up a small React + Vite viewer, following the same pattern as the [Verifier tutorial](/docs/tutorial/verifier), extended to render the inline template.

### 1. Create a new project directory

```bash
mkdir inline-template-viewer
cd inline-template-viewer
npm init -y
```

### 2. Install required dependencies

```bash
npm install react react-dom vite-plugin-node-polyfills @trustvc/trustvc@beta
npm install --save-dev typescript @vitejs/plugin-react @types/react @types/react-dom vite
```

### 3. Set up Vite

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), nodePolyfills()],
});
```

### 4. Build the viewer component

Create `src/App.tsx`. It verifies a dropped document, then renders it either through the inline template or a message pointing at the fallback renderer URL:

```tsx
import React, { useCallback, useRef, useState } from "react";
import {
  decompressInlineTemplate,
  getRenderMethods,
  isValid,
  printInlineTemplate,
  renderInlineTemplate,
  verifyDocument,
} from "@trustvc/trustvc";

const App: React.FC = () => {
  const [document, setDocument] = useState<unknown>(null);
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [useInline, setUseInline] = useState(false);
  const [rendererUrl, setRendererUrl] = useState<string>();
  const hostRef = useRef<HTMLDivElement>(null);

  const renderDocument = useCallback(async (doc: unknown) => {
    const { inlineTemplate, renderer } = getRenderMethods(doc);
    setRendererUrl(renderer?.id);

    if (inlineTemplate && hostRef.current) {
      try {
        const decompressed = await decompressInlineTemplate(doc);
        if (!renderInlineTemplate(decompressed, hostRef.current)) {
          throw new Error("No renderable INLINE_HTML_TEMPLATE entry");
        }
        setUseInline(true);
        return;
      } catch (e) {
        console.error("Failed to render inline template, falling back to renderer URL", e);
      }
    }
    setUseInline(false);
  }, []);

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const vc = JSON.parse(await file.text());
    setDocument(vc);

    // No rpc argument needed: this document has no on-chain credentialStatus.
    const fragments = await verifyDocument(vc);
    const valid = isValid(fragments);
    setStatus(valid ? "valid" : "invalid");
    if (valid) await renderDocument(vc);
  };

  const handlePrint = () => {
    if (hostRef.current) printInlineTemplate(hostRef.current);
  };

  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
      <h1>Inline Template Viewer</h1>
      <p>Drop the signed.json produced in Part 1 here</p>

      {status === "invalid" && <p style={{ color: "red" }}>Document failed verification.</p>}

      {status === "valid" && (
        <>
          <button onClick={handlePrint} disabled={!useInline}>
            Print
          </button>
          <div ref={hostRef} data-testid="inline-template-host" />
          {!useInline && document && (
            <p>No inline template rendered; fall back to renderer: {rendererUrl ?? "none"}</p>
          )}
        </>
      )}
    </div>
  );
};

export default App;
```

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `index.html` in the root directory:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Inline Template Viewer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 5. Run the development server

Add `"dev": "vite"` to `package.json`'s `scripts`, then:

```bash
npm run dev
```

Drag `signed.json` from Part 1 onto the page. You should see the filled Bill of Lading markup rendered inline, with no request to `generic-templates.tradetrust.io` in the Network tab — DevTools shows an `<iframe title="Document" sandbox="allow-same-origin allow-modals" srcdoc=...>` inside the host `<div>`.

### What each function does here

```ts
const { inlineTemplate, renderer } = getRenderMethods(verifiedDoc);
if (inlineTemplate) {
  try {
    const doc = await decompressInlineTemplate(verifiedDoc);
    if (!renderInlineTemplate(doc, hostEl)) throw new Error("No renderable INLINE_HTML_TEMPLATE entry");
  } catch {
    showUrlRenderer(renderer?.id); // fallback
  }
}
// later, in a Print button's onClick:
printInlineTemplate(hostEl);
```

- **`getRenderMethods(doc)`** reads `renderMethod` (array or single object) and returns `{ inlineTemplate?, renderer? }`, found by type regardless of order.
- **`decompressInlineTemplate(doc)`** restores the compressed string back to `{ templateName, html, css }`. Call it only on the **verified** document — it returns a copy and never mutates its input, because the proof covers the compressed form.
- **`renderInlineTemplate(doc, host)`** builds the filled markup with `DOMParser`, mounts it in a sandboxed `<iframe srcdoc>` inside `host`, and returns `true` once mounted (`false`, `host` untouched, if there's nothing renderable).
- **`printInlineTemplate(host)`** finds the iframe `renderInlineTemplate` mounted in `host`, focuses it and calls its own `print()` — so only the template prints, not the surrounding page. It must be called from a user gesture such as a button click; browsers silently ignore `print()` calls outside one.

A document with **no** inline entry is untouched by any of this — `getRenderMethods(doc).inlineTemplate` is `undefined`, and the existing renderer path runs exactly as it did before this feature existed.

## SDK Functions Used in This Tutorial

| Function | Used in | Purpose |
| --- | --- | --- |
| `compressTemplate` | Part 1, step 2 | Compresses `{ templateName, html, css }` into the signable `H4sI...` string |
| `DocumentBuilder.inlineTemplate()` | Part 1, step 3 | Adds the `INLINE_HTML_TEMPLATE` entry, after the URL entry |
| `DocumentBuilder.sign()` | Part 1, step 3 | Signs the document; the template is covered by the proof |
| `verifyDocument` | Part 2, step 4 | Verifies document integrity, status and issuer identity |
| `isValid` | Part 2, step 4 | Reduces verification fragments to a single boolean |
| `getRenderMethods` | Part 2, step 4 | Finds the inline entry and the URL fallback, in either order |
| `decompressInlineTemplate` | Part 2, step 4 | Restores the compressed template to `{ templateName, html, css }`, post-verification |
| `renderInlineTemplate` | Part 2, step 4 | Mounts the filled template in a sandboxed iframe |
| `printInlineTemplate` | Part 2, step 4 | Prints only the rendered template, from a user gesture |

## Template Authoring Reference

| Attribute | On | Effect | Missing or null value |
| --- | --- | --- | --- |
| `data-field="key"` | Any element | Sets the element's text to `String(subject[key])` via `textContent` | Element text becomes empty |
| `data-field-src="key"` | An `<img>` | Sets the `src` attribute to `String(subject[key])`, e.g. a `data:` URI logo | `src` attribute is removed |
| `<template data-repeat="key">` | A `<template>` element | Clones its content once per item of the array `subject[key]`, inserted where the `<template>` stood | No clones; the `<template>` is removed |

```html
<div class="bol">
  <h1>Bill of Lading <span data-field="blNumber"></span></h1>
  <img data-field-src="logo" alt="Carrier logo" />
  <p>Shipper: <span data-field="shipperName"></span></p>
  <table>
    <tbody>
      <template data-repeat="packages">
        <tr><td data-field="packagesDescription"></td></tr>
      </template>
    </tbody>
  </table>
</div>
```

Rules worth knowing:

- Values are set as text (`textContent`) or as an `<img src>`, never parsed as HTML — a `credentialSubject` value cannot inject markup.
- Keys are flat property names: `data-field="shipper.name"` looks up a property literally named `shipper.name`, not a nested path.
- Inside a `data-repeat` clone, `data-field` and `data-field-src` resolve against the array item, not the top-level subject. Nested repeats are not expanded.
- Only the `<body>` content of `html` is used; anything in the template's own `<head>` is dropped, so styles belong in `css`.

## Security Model

Template HTML is issuer-controlled and treated as hostile: it is shown only inside a sandboxed `srcdoc` iframe with a strict Content Security Policy, never in the viewer page's own DOM.

- **Sandbox:** `allow-same-origin allow-modals` — deliberately **no** `allow-scripts`, so nothing in the frame can run: no `<script>`, no `onerror=` / `onload=` handlers, no `javascript:` links. `allow-same-origin` only lets the host page measure the frame's height, intercept link clicks and call `print()`; `allow-modals` exists only because browsers otherwise ignore `print()` on a sandboxed frame. **Never add `allow-scripts` alongside `allow-same-origin`** — together they let the frame remove its own sandbox.
- **CSP:** `default-src 'none'; img-src data:; font-src data:; style-src 'unsafe-inline'; form-action 'none'` — only `data:` images/fonts and inline styles are allowed; nothing remote can load.
- **Never use `innerHTML`, `dangerouslySetInnerHTML` or Shadow DOM** to render a template — a Shadow DOM is not a security boundary, and handlers would still run once nodes reach a live page. Render only through `renderInlineTemplate`.
- **Decompress and render only after verification**, on the verified document.

## Conclusion

In this tutorial, you've learned how to:

1. Author an HTML + CSS template with `data-field`, `data-field-src` and `data-repeat` bindings
2. Compress it with `compressTemplate` and attach it to a document with `DocumentBuilder.inlineTemplate()`, alongside a URL fallback
3. Sign the document so the template is covered by the proof
4. Verify the document and render its inline template in a sandboxed iframe with `getRenderMethods`, `decompressInlineTemplate` and `renderInlineTemplate`
5. Print just the rendered template with `printInlineTemplate`

For a production reference, see the `InlineTemplateRenderer` component in [tradetrust-website](https://github.com/TradeTrust/tradetrust-website), which wires this exact flow into `CertificateViewer` with a `forwardRef`-exposed `print()`, so the existing Print button works without knowing which renderer is active.
