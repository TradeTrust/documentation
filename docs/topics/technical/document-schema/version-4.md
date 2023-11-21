---
id: version-4
title: Version 4 (Alpha)
sidebar_label: Version 4 (Alpha)
---

The document schema v4.0 follows [W3C VC data model](https://www.w3.org/TR/vc-data-model-2.0/). Do note that this is an **alpha version** and will be subjected to changes. Let's look at an v4 document example:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json"
  ],
  "type": ["VerifiableCredential", "OpenAttestationCredential"],
  "validFrom": "2021-03-08T12:00:00+08:00",
  "name": "Republic of Singapore Driving Licence",
  "issuer": {
    "id": "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    "type": "OpenAttestationIssuer",
    "name": "Government Technology Agency of Singapore (GovTech)",
    "identityProof": { "identityProofType": "DNS-DID", "identifier": "example.openattestation.com" }
  },
  "credentialStatus": { "type": "OpenAttestationCredentialStatus", "credentialStatusType": "NONE" },
  "renderMethod": {
    "type": "OpenAttestationRenderMethod",
    "renderMethodType": "EMBEDDED_RENDERER",
    "name": "GOVTECH_DEMO",
    "url": "https://demo-renderer.openattestation.com"
  },
  "credentialSubject": {
    "id": "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    "type": ["DriversLicense"],
    "name": "John Doe",
    "licenses": [
      {
        "class": "3",
        "description": "Motor cars with unladen weight <= 3000kg",
        "effectiveDate": "2013-05-16T00:00:00+08:00"
      },
      {
        "class": "3A",
        "description": "Motor cars with unladen weight <= 3000kg",
        "effectiveDate": "2013-05-16T00:00:00+08:00"
      }
    ]
  }
}
```

Note that some fields are optional so let's focus on the critical ones:

### @context

The `@context` property is now introduced as per [W3C VC data model](https://www.w3.org/TR/vc-data-model-2.0/#contexts) to allow the issuer to map such short-form aliases to the URIs required by specific verifiable credentials and verifiable presentations.

OpenAttestation has released our alpha extension to W3C credentials context via [here](https://schemata.openattestation.com/com/openattestation/4.0/alpha-schema.json).

### issuer

In OA v4, there is only be one named `issuer` of verifiable credentials, as conforming to [W3C VC data model](https://www.w3.org/TR/vc-data-model-2.0/#issuer).

### credentialStatus

Revocation status of document. credentialStatus.credentialStatusType of `NONE`, `REVOCATION_STORE`.

### credentialSubject

Previously stored in the `data` key, the claims about the subject of the credential are now to be placed in the `credentialSubject` field.

### renderMethod

Previously stored in the `$template` field, this determines the rendering method.

> This [reserved property](https://www.w3.org/TR/vc-data-model-2.0/#reserved-extension-points), renderMethod is at risk and subjected to changes.
