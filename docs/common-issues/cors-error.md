---
id: cors-error
title: CORS Error when Fetching External Resources
sidebar_label: CORS Error when Fetching External Resources
keywords: ["cors", "cors error", "Access-Control-Allow-Origin", "cross-origin", "no-cors", "fetch blocked"]
---

When using TradeTrust to fetch external resources (such as decentralized renderer URLs, document stores, or API endpoints), you may encounter a CORS (Cross-Origin Resource Sharing) error in the browser console:

```text
Access to fetch at 'xxx' from origin 'https://ref.tradetrust.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

## Common Causes in TradeTrust Documents

When verifying or rendering TradeTrust documents, CORS errors most commonly occur when fetching resources referenced in your W3C Verifiable Credential document. The browser needs to fetch these external URLs, and if they don't allow cross-origin requests, the verification or rendering will fail.

:::note
In the examples below, we use `trustvc.io` and `trustvc.github.io` as example domains. **In your case, replace these with your own custom domain** (e.g., `yourdomain.com`, `yourcompany.io`, etc.) where you're hosting your context files, renderers, or status lists.
:::

### URLs that commonly trigger CORS errors:

#### 1. **@context URLs**

The `@context` array contains JSON-LD context definitions that must be fetched:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2",
    "https://trustvc.io/context/render-method-context-v2.json",
    "https://trustvc.io/context/coo.json",
    "https://trustvc.io/context/attachments-context.json",
    "https://trustvc.io/context/transferable-records-context.json",
    "https://trustvc.io/context/qrcode-context.json"
  ]
}
```

**Issue**: If any of these context URLs don't have proper CORS headers, the document verification will fail.

#### 2. **credentialStatus URLs**

The `credentialStatus` contains URLs for checking revocation status:

```json
{
  "credentialStatus": [
    {
      "id": "https://trustvc.github.io/did/credentials/statuslist/2#5",
      "statusListCredential": "https://trustvc.github.io/did/credentials/statuslist/2",
      "statusListIndex": "5",
      "statusPurpose": "revocation",
      "type": "BitstringStatusListEntry"
    }
  ]
}
```

**Issue**: If the status list credential URL doesn't have CORS headers, the revocation check will fail.

## What is CORS?

CORS is a security feature implemented by web browsers to prevent malicious websites from accessing resources on other domains without permission. When TradeTrust (running on `ref.tradetrust.io` or your custom domain) tries to fetch resources from your server, the browser checks if your server allows cross-origin requests.

## Why does this error occur?

This error occurs because the server hosting your resource (e.g., decentralized renderer, API endpoint, or document store) does not include the necessary CORS headers in its HTTP response. Without these headers, the browser blocks the request for security reasons.

## How to Debug CORS Errors

### Using Browser Developer Tools

You can identify which specific URL is causing the CORS error by inspecting the browser's Network tab:

1. **Open Developer Tools**:

   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - Safari: Enable Developer menu in Preferences, then press `Cmd+Option+I`

2. **Go to the Network tab**

3. **Reload the page or verify the document**

4. **Look for failed requests** (shown in red):

   - Click on the failed request
   - Check the "Headers" tab
   - Look for missing `Access-Control-Allow-Origin` header in the Response Headers

5. **Check the Console tab** for the exact CORS error message, which will show the specific URL that's blocked

### Example of what you'll see:

**Console Error:**

```text
Access to fetch at 'https://your-custom-renderer.com/templates' from origin 'https://ref.tradetrust.io'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Network Tab:**

- Status: `(failed)` or `CORS error`
- The request will be highlighted in red
- Response Headers will be missing `Access-Control-Allow-Origin`

## Solution

To resolve this issue, you need to configure your server to include the appropriate CORS headers in its responses. The specific implementation depends on your server setup:

### Option 1: Allow Specific Origins (Recommended)

Configure your server to allow requests from TradeTrust domains:

**For Node.js/Express:**

```js
const express = require("express");
const cors = require("cors");
const app = express();

// Allow specific origins
const corsOptions = {
  origin: ["https://tradetrust.io", "https://ref.tradetrust.io", "https://dev.tradetrust.io"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

**For Nginx:**

```nginx
location / {
    add_header 'Access-Control-Allow-Origin' 'https://ref.tradetrust.io' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

**For Apache (.htaccess):**

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "https://ref.tradetrust.io"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### Option 2: Allow All Origins (Use with Caution)

If your resource is public and you want to allow all domains to access it:

**For Node.js/Express:**

```js
const express = require("express");
const cors = require("cors");
const app = express();

// Allow all origins
app.use(cors());
```

**For Nginx:**

```nginx
location / {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

### Option 3: Using a CORS Proxy (Development Only)

For development and testing purposes only, you can use a CORS proxy service. **Do not use this in production.**

```js
// Instead of fetching directly
const response = await fetch("https://your-api.com/endpoint");

// Use a CORS proxy (development only)
const response = await fetch("https://cors-anywhere.herokuapp.com/https://your-api.com/endpoint");
```

## Fixing CORS for Specific Scenarios

### Custom @context URLs

If you're hosting custom JSON-LD context files (e.g., `https://yourdomain.com/context/custom-context.json`):

1. Ensure your server serves the JSON file with proper CORS headers
2. The context file must be publicly accessible
3. Use HTTPS (not HTTP) for production contexts

**Example context file server configuration:**

```js
app.get("/context/*.json", cors(), (req, res) => {
  res.json(/* your context definition */);
});
```

### Custom Decentralized Renderer

If you're hosting a custom decentralized renderer, ensure your renderer server includes CORS headers:

1. **Allow TradeTrust origins** in your renderer server
2. **Enable CORS for all renderer routes** (template fetching, asset loading)
3. **Serve templates over HTTPS** in production

**Critical**: Your renderer must respond to both `GET` and `OPTIONS` requests with appropriate CORS headers.

### Custom credentialStatus / Status List

If you're hosting your own status list credentials:

1. Configure your GitHub Pages, server, or CDN to allow CORS
2. Ensure the status list credential JSON is publicly accessible
3. Test the URL directly in the browser before using it in documents

**For GitHub Pages:**
GitHub Pages automatically includes CORS headers, but ensure your repository is public and the file path is correct.

### Document Store API

If you're hosting an API that serves document data, configure CORS to allow TradeTrust domains to fetch the documents.

### Custom Verification Endpoints

If you've implemented custom verification endpoints, ensure they return appropriate CORS headers for all HTTP methods (GET, POST, OPTIONS).

## Testing Your CORS Configuration

You can test if your CORS configuration is working correctly using curl:

```bash
curl -H "Origin: https://ref.tradetrust.io" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://your-server.com/your-endpoint
```

Look for `Access-Control-Allow-Origin` in the response headers.

## Additional Resources

- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Enable CORS](https://enable-cors.org/)

## Need Help?

If you continue to experience CORS issues after configuring your server, please contact us at tradetrust@imda.gov.sg with:

- The URL of the resource you're trying to fetch
- Your server configuration
- The complete error message from the browser console
