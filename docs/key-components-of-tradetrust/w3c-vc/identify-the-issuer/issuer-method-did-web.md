---
id: issuer-method-did-web
title: Did:Web
sidebar_label: DID:Web
---

## Hands-on Creating a DID:web Document

This guide explains how to self-host a Decentralized Identifier (DID) using the did:web method. The did:web method allows you to create a DID linked to a domain you control, enabling decentralized identity services hosted on your website.

### Prerequisites

- A domain name: You need access to a domain name where you can host static content.
- Web hosting: Ensure you have the ability to host static files on your domain. This can be done via any web hosting service that supports serving static JSON files (e.g., GitHub Pages, Netlify, your own web server).
- Tools: Familiarity with basic command-line tools and JSON structure is helpful.
- A DID:web identifier is represented as did:web:`<domain>` or did:web:`<domain>:<path>`.

  For example:

  - did:web:example.com
  - did:web:example.com:subpath

The DID document associated with a DID:web identifier is hosted at the following location on your domain:

- For root domains: `https://example.com/.well-known/did.json`
- For subdomains or paths: `https://example.com/<path>/did.json`
  This DID document contains details about the entity, including public keys, service endpoints, and methods of verification.

### Step-by-Step Setup

**1. Generate DID Document**

- Use TrustVC W3C Issuer to generate your DID Document: Our tool simplifies the process of creating a compliant DID Document.
- Review your DID Document: Ensure the generated file contains the required properties, such as id, verificationMethod, and authentication. Here's an example using the BbsBlsSignature2020 verification method:

```typescript
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:web:yourdomain.com",
  "verificationMethod": [{
    "id": "did:web:yourdomain.com#key-1",
    "type": "BbsBlsSignature2020",
    "controller": "did:web:yourdomain.com",
    "publicKeyBase58": "2qz8jVcPgs6xzL5mZHTZGkXQaDe5BsVofLpqqBfAw1Nc"
  }],
  "authentication": [
    "did:web:yourdomain.com#key-1"
  ]
}
```

- Save the document as did.json.

**2. Host DID Document**

1.  Determine your DID URL: For a domain like example.com, the DID Document needs to be accessible at the URL https://example.com/.well-known/did.json.

2.  Upload the DID Document:

- Ensure the file is accessible at https://yourdomain.com/.well-known/did.json.
- Test by visiting the URL directly in your browser to ensure the file is being served correctly.

### Example using GitHub Pages

:::note
We hosted a sample did:web `did:web:trustvc.github.io:did:1` in this repo https://github.com/TrustVC/did
:::

If you’re hosting the DID document on GitHub Pages:

1. Create a repository with the structure:

```typescript
└── <path>
   └── did.json
```

2. Push the repository to GitHub and enable GitHub Pages for the repository.
3. Your DID document `did:web:<yourusername>.github.io:<repo>:<path>` should be accessible at https://<yourusername>.github.io/<repo>/<path>/did.json.

### Verifying Your did:web

To verify that your DID Document is properly hosted:
Libraries like @decentralized-identity/did-resolver.
Use a DID resolver like [Universal Resolver](https://dev.uniresolver.io/) to check that your DID can be resolved.
Verify that your DID Document conforms to the DID specification.

### Best Practices

- HTTPS: Ensure your site uses HTTPS, as DID documents must be served over secure connections.
- Versioning: Maintain version control of your DID document to track any changes.
- Security: Protect private keys associated with the DID Document. Only publish public keys in the did.json file.

### Troubleshooting

- File Not Found Error: Double-check the file path and ensure your web hosting service is correctly serving static files.
- DID Not Resolving: Verify that your DNS is properly configured, and the DID Document is correctly formatted.

### Additional Notes for Hosting DID:web Documents

- Make sure your server supports HTTPS.
- Ensure the .well-known/did.json file is publicly readable.
- For advanced use cases, you can add service endpoints or include additional verification methods in your DID document.
- By following the above steps, you can successfully create and manage a DID:web identifier, providing a secure, decentralized identity anchored to your domain.
