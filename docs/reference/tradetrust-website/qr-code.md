---
id: qr-code
title: QR code
sidebar_label: QR code
---

Upon verification of document, you might notice that there is a QR code available to scan. This allows users to share the viewing of documents easily across devices with camera. Read more on the adr [here](https://github.com/Open-Attestation/adr/blob/master/universal_actions.md).

For our reference implementation, we have the following:

- [TradeTrust functions](https://github.com/TradeTrust/tradetrust-functions) with document storage service:
  - Stores an **encrypted** document as URI.
- [TradeTrust web application](https://github.com/TradeTrust/tradetrust-website):
  - Reads URI + **decrypts** the stored document.

> Document storage is an external service, you **should** set up your own hosting for the documents.

### TradeTrust functions

_Prerequisite: [Netlify functions](https://docs.netlify.com/functions/overview/)._

TradeTrust functions is built with Netlify functions. TradeTrust provides a set of API endpoints for demonstration purposes only. Essentially you should have an endpoint service yourself to store your documents so to facilitate rendering of QR code in your web application later on. Let's focus on [document storage](https://github.com/TradeTrust/tradetrust-functions#document-storage) service below.

#### Document storage

For our reference implementation of document storage service, it does the following:

- [Encrypts](https://github.com/Open-Attestation/oa-encryption#encrypting-a-document) a document, returning the `key` among other fields.
- Only neccessary fields are uploaded and stored in Amazon s3 bucket, without `key`.
- `key` is later prepared into document's `links.self.href` field, before it gets wrapped and issued.
- A decoded example of `links.self.href` (action url) value looks like this:

```
{
  "type":"DOCUMENT",
  "payload": {
    "uri":"https://tradetrust-functions.netlify.app/.netlify/functions/storage/95524c85-c1b4-44e3-ad91-3971f90e43cb","key":"1a8d6113d08210a2dbb91a3240216eefcf0de7601d87264ac2dd831c19853547",
    "permittedActions":["STORE"],
    "redirect":"https://dev.tradetrust.io/"
  }
}
```

- `key` 1a8d6... will be then be used to decrypt the document at `uri` with 95524... on TradeTrust web application end.

> Note that the `key` value is up to integrators on how it should be managed. Do note that the process of whether to encrypt your document is at your discretion.

### TradeTrust web application

Within our TradeTrust web application, you can refer to the code snippet [here](https://github.com/TradeTrust/tradetrust-website/blob/29075e295468eace4674a847bd82a7618fe51784/src/components/DocumentUtility/DocumentUtility.tsx#L64-L71) on how to render qrcode. Let's focus on the qrcode image below.

#### QR image

For QR code image generation, we are using this library called [qrcode.react](https://github.com/zpao/qrcode.react). The QR image holds information of just an URL. In our case, the QR image refers to `links.self.href` in the document.

Upon scanning the QR code, users will redirect to application end to handle the document rendering. Meanwhile, this is also the point where the `key` value will be used to decrypt against s3 bucket stored data to get back our original wrapped + issued document.

Thereafter, the document will be rendered accordingly.

> **Important:** Above are reference implementations, it is up to integrators to decide on their own architecture / flow.
