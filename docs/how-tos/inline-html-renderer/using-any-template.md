---
id: using-any-template
title: Using Any Template with the Inline Renderer
sidebar_label: Using Any Template
---

# Using Any Template with the Inline Renderer

Unlike the [generic templates](/docs/how-tos/decentralized-renderer/using-generic-templates) hosted at `https://generic-templates.tradetrust.io` — a fixed catalog of predefined document types — the inline renderer has no catalog at all. You write whatever HTML and CSS your document needs, embed it directly in the credential, and the SDK renders exactly that markup. This guide walks through attaching a custom template to any document type.

:::note
This applies to W3C Verifiable Credentials only. See [Overview — Not for OpenAttestation documents](./overview#security-model) if you're issuing OpenAttestation documents.
:::

## When to Use a Custom Inline Template

A custom inline template is a good fit when:

- Your document type isn't one of the generic templates, and you don't want to host and maintain a decentralized renderer for it
- You want the template itself covered by the credential's proof, so it can never drift from what was signed
- You want the document to render correctly with no network access at all

For a document type that already matches a generic template, and you don't need the above guarantees, using the [hosted generic templates](/docs/how-tos/decentralized-renderer/using-generic-templates) is simpler. For heavy interactivity (multiple views, client-side logic), a [custom decentralized renderer](/docs/tutorial/decentralized-renderer) is still the right tool — the inline renderer only ever shows static, filled markup.

## 1. Write Your Template

A template is plain HTML plus CSS. Bind it to your document's `credentialSubject` with three attributes:

| Attribute | On | Effect |
| --- | --- | --- |
| `data-field="key"` | Any element | Sets the element's text to `String(subject[key])` |
| `data-field-src="key"` | An `<img>` | Sets the `src` attribute, e.g. a `data:` URI logo |
| `<template data-repeat="key">` | A `<template>` element | Clones its content once per item of the array `subject[key]` |

Here's a custom Invoice template — not one of the generic catalog's templates:

```html
<div class="invoice">
  <img data-field-src="logo" alt="Issuer logo" />
  <h1>Invoice <span data-field="invoiceNumber"></span></h1>
  <p>Billed to: <span data-field="billedTo"></span></p>
  <table>
    <thead>
      <tr><th>Description</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <template data-repeat="lineItems">
        <tr>
          <td data-field="description"></td>
          <td data-field="amount"></td>
        </tr>
      </template>
    </tbody>
  </table>
  <p class="total">Total: <span data-field="total"></span></p>
</div>
```

```css
.invoice { font-family: sans-serif; max-width: 600px; margin: 0 auto; }
.invoice h1 { color: #1a2b4c; }
.invoice table { width: 100%; border-collapse: collapse; }
.invoice th, .invoice td { border: 1px solid #ddd; padding: 8px; text-align: left; }
.invoice .total { text-align: right; font-weight: bold; }
```

Only the template's `<body>` content is used — put all styling in the CSS string, and embed any logo or font as a `data:` URI (no remote assets can load inside the sandboxed iframe).

## 2. Compress and Attach It

```ts
import { DocumentBuilder, compressTemplate } from "@trustvc/trustvc";

const compressed = await compressTemplate({
  templateName: "INVOICE",
  html, // the template HTML above
  css,  // the template CSS above
});

const builder = new DocumentBuilder({
  "@context": "https://trustvc.io/context/invoice.json",
})
  .credentialSubject({
    type: ["Invoice"],
    invoiceNumber: "INV-2024-001",
    billedTo: "Acme Corp",
    logo: "data:image/png;base64,...",
    lineItems: [
      { description: "Consulting services", amount: "$2,000.00" },
      { description: "Support retainer", amount: "$500.00" },
    ],
    total: "$2,500.00",
  })
  // A URL fallback for older viewers and failed inline renders.
  .renderMethod({
    id: "https://generic-templates.tradetrust.io",
    type: "EMBEDDED_RENDERER",
    templateName: "INVOICE",
  })
  .inlineTemplate(compressed);

const signed = await builder.sign(privateKey, "ecdsa-sd-2023", {
  mandatoryPointers: ["/renderMethod"],
});
```

Any document type works the same way: write HTML that matches your `credentialSubject`'s shape, compress it, and call `.inlineTemplate()`. There's no template name to register anywhere — `templateName` is just a label the viewer may display, with no catalog behind it to keep in sync.

## 3. Keep a Fallback

Always pair the inline entry with a URL `renderMethod` entry, as above. It covers:

- Viewers that don't yet support inline templates
- A failed inline render (an unsupported browser, a corrupted template)

Documents with no inline entry, or where the inline render fails, behave exactly as they did before this feature existed — the URL entry renders through the existing decentralized renderer.

## 4. Preview Before Signing

Render the unsigned document through a viewer that supports inline templates (see the [tutorial's viewer](/docs/tutorial/inline-html-renderer#part-2-verifying-and-rendering-the-document)) before signing, to confirm your bindings match your `credentialSubject` shape. Once signed, the template is covered by the proof — changing it, even to a validly compressed replacement, invalidates the signature.

## Limitations to Keep in Mind

- **Flat keys only** — `data-field="shipper.name"` looks up a property literally named `shipper.name`, not a nested path. Shape your `credentialSubject` with flat keys the template binds to directly.
- **No interactivity** — no scripts run, and only `#fragment` links work; nothing else does.
- **4 MB cap** — the decompressed template (HTML + CSS combined) must stay under `INLINE_TEMPLATE_MAX_DECOMPRESSED_BYTES` (4 MB), enforced while decompressing.

## See Also

- [Inline HTML Renderer — Overview](./overview) for the rendering pipeline and security model
- [Inline HTML Renderer Tutorial](/docs/tutorial/inline-html-renderer) for the full issue → verify → render → print walkthrough
- [Using Generic Templates](/docs/how-tos/decentralized-renderer/using-generic-templates) if your document type fits the existing catalog instead
