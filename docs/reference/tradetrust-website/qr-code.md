---
id: qr-code
title: QR code
sidebar_label: QR code
---

Upon verification of document, you might notice that there is a QR code available to scan. This allows users to share the viewing of documents easily across devices with camera.

The universal action method will provide a way for actions to be communicated to various client implementations that uses TradeTrust documents. In addition, these actions can be scanned directly using a phone's QR code scanner to process the document. Read more on the [rationale](https://github.com/Open-Attestation/adr/blob/master/universal_actions.md) from our Architectural Decision Records (ADRs).

For our reference implementation, we have the following:

- [TradeTrust functions](https://github.com/TradeTrust/tradetrust-functions) with document storage service:
  - Stores an **encrypted** document as URI.
- [TradeTrust web application](https://github.com/TradeTrust/tradetrust-website):
  - Reads URI + **decrypts** the stored document.

> You will need to have your own hosting for the documents. In the following example we will be using Netlify as our host.

#### Example

Sample of how the qrcode looks like upon document rendering:

![QRcode](/docs/reference/tradetrust-website/qrcode.png)

### TradeTrust functions

_Prerequisite: [Netlify functions](https://docs.netlify.com/functions/overview/)._

TradeTrust functions is built with Netlify functions. TradeTrust provides a set of API endpoints for demonstration purposes only. Essentially you should have an endpoint service yourself to store your documents so to facilitate rendering of QR code in your web application later on.

#### Setting up TradeTrust functions

Let's go through the steps:

1. Sign up an account with [Netlify](https://app.netlify.com/signup).
2. If you need document storage service, sign up an account with [AWS](https://aws.amazon.com/). Otherwise, this step **can be skipped**. Create an s3 bucket on AWS. Create access key ID and secret access key to access this resource. Take note of the bucket name, ID and secrets, we'll need them later.
3. Fork tradetrust-functions [repo](https://github.com/TradeTrust/tradetrust-functions) on your github. Make sure to spin up a netlify site connected to the forked github repo.
4. You should have a random site name allocated to your netlify site. You can edit site name to whichever name you want. For our example, we have renamed it to `tradetrust-functions.netlify.app`.
   ![tt functions](/docs/reference/tradetrust-website/tt-functions.png)
5. Populate your environment variables on netlify site settings.
   - `API_KEY` = Can be anything.
   - `TT_AWS_BUCKET_NAME` = Your AWS bucket name resource. (For document storage service)
   - `TT_STORAGE_AWS_ACCESS_KEY_ID` = Your AWS access key ID. (For document storage service)
   - `TT_STORAGE_AWS_SECRET_ACCESS_KEY` = Your AWS secret access key. (For document storage service)
6. Hit deploy site on netlify dashboard and your API endpoints should be up. They are accessible at:
   - https://<YOUR_RENAMED_NETLIFY_SITENAME>/.netlify/functions/verify/
   - https://<YOUR_RENAMED_NETLIFY_SITENAME>/.netlify/functions/storage/

#### Document storage

For our reference implementation of [document storage service](https://github.com/TradeTrust/tradetrust-functions#document-storage), it does the following:

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

Within our TradeTrust web application, you can setup the QRCode component as per shown below:

```js
import QRCode, { ImageSettings } from "qrcode.react";

<QRCode value={qrcodeUrl} level="Q" size={200} bgColor="#FFFFFF" fgColor="#000000" imageSettings={imageSettings} />;
```

Refer to the actual reference [here](https://github.com/TradeTrust/tradetrust-website/blob/29075e295468eace4674a847bd82a7618fe51784/src/components/DocumentUtility/DocumentUtility.tsx#L64-L71) if you need more help.

#### QR image

For QR code image generation, we are using this library called [qrcode.react](https://github.com/zpao/qrcode.react). The QR image holds information of just an URL. In our case, the QR image refers to `links.self.href` in the document.

Upon scanning the QR code, users will redirect to application end to handle the document rendering. Meanwhile, this is also the point where the `key` value will be used to decrypt against s3 bucket stored data to get back our original wrapped + issued document.

Thereafter, the document will be rendered accordingly.

> **Important:** Above are reference implementations, it is up to integrators to decide on their own architecture / flow.
