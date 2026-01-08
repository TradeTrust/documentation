---
id: cors-error
title: CORS Errors on External Resources
sidebar_label: CORS Errors on External Resources
keywords: ["cors", "cors error", "Access-Control-Allow-Origin", "cross-origin", "no-cors", "fetch blocked"]
---

When using the web-based verifier such as [ref.tradetrust.io](https://ref.tradetrust.io), the browser will block requests to external resources that do not have Cross-Origin Resource Sharing (CORS) enabled.

:::info
This is not a bug in TradeTrust. It is a security feature of the browser that enforces access controls on the resources you host.
:::

## The Error

You will see this in your browser console (F12):

```text
Access to fetch at 'https://your-domain.com/context.json' from origin 'https://ref.tradetrust.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

## The Cause

The TradeTrust verifier runs entirely in the client's browser. When it tries to read a JSON-LD context or a revocation list from your server (`your-domain.com`), the browser checks your server's headers.

If your server does not return the header `Access-Control-Allow-Origin: *` (or explicitly allow `https://ref.tradetrust.io`), the browser acts as a gatekeeper and blocks the data from reaching the verifier.

## Common Triggers in TradeTrust

These are the resources you host that frequently cause this error.

### 1. Custom @context URLs

If your document references custom JSON-LD contexts hosted on your infrastructure:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://your-domain.com/custom-context/v1.json" // <--- MUST ENABLE CORS
  ]
}
```

**Impact:** Verification fails instantly because the verifier cannot understand the document structure.

### 2. Status List Credentials (Revocation)

If you host your own revocation status list:

```json
{
  "credentialStatus": [
    {
      "id": "https://your-domain.com/status-list#5", // <--- MUST ENABLE CORS
      "type": "BitstringStatusListEntry"
    }
  ]
}
```

**Impact:** The verifier cannot check if the document has been revoked, leading to a verification failure or warning.

## The Fix

You must configure your web server (Nginx, Apache, S3, Netlify, etc.) to allow cross-origin requests on these public resources.

**Recommended Header:** `Access-Control-Allow-Origin: *`

:::note
Since these contexts and status lists are public information intended for verification by anyone, using the wildcard `*` is generally the standard practice.
:::

:::warning Security Notice
Only enable `Access-Control-Allow-Origin: *` for **public resources** like JSON-LD contexts and status lists. **Do not** apply this header to your entire domain or to endpoints that serve sensitive information. Configure CORS at the specific file or endpoint level to protect private data.
:::
