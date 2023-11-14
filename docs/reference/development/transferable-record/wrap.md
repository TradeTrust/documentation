---
id: wrap
title: Wrap
sidebar_label: Wrap
---

## Open Attestation

> The following information is from the [open-attestation repository](https://github.com/Open-Attestation/Open-Attestation/), refer to the repository for the most recent changes.

The [Open Attestation](https://github.com/Open-Attestation/open-attestation) repository allows you to wrap the document to obtain the target hash to be committed to the blockchain. It also allows you to verify the signature of the document wrapped using the OpenAttestation framework.

## Installation

```bash
npm i --save @govtechsg/open-attestation
```

---

## Usage

### Wrapping document

`wrapDocument` takes in a document and returns the wrapped document. The document must be valid regarding the version of the schema used (see below). It computes the target hash of the document and appends it to the document. This target hash can be published on the blockchain and queried against to prove the provenance of the document issued this way.

In the future, this function may accept a second optional parameter to specify the version of open-attestation you want to use. Currently, open-attestation will use schema 2.0. See [Additional Information](#additional-information) for information on using experimental v3.0 documents, which aim to be compatible with the W3C's data model for [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/).

```js
import { wrapDocument } from "@govtechsg/open-attestation";
const document = {
  id: "SERIAL_NUMBER_123",
  $template: {
    name: "CUSTOM_TEMPLATE",
    type: "EMBEDDED_RENDERER",
    url: "https://localhost:3000/renderer",
  },
  issuers: [
    {
      name: "DEMO STORE",
      tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
      identityProof: {
        type: "DNS-TXT",
        location: "tradetrust.io",
      },
    },
  ],
  recipient: {
    name: "Recipient Name",
  },
  unknownKey: "unknownValue",
  attachments: [
    {
      filename: "sample.pdf",
      type: "application/pdf",
      data: "BASE64_ENCODED_FILE",
    },
  ],
} as any;

const wrappedDocument = wrapDocument(document); // will ensure document is valid regarding open-attestation 2.0 schema
console.log(wrappedDocument);
```

> Note:
> `wrapDocuments` is not applicable as merkle roots cannot be uniquely identified as seperate transferable records.

You can now mint the target hash to create valid transferable records.
