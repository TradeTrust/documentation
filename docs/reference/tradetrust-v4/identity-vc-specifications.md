---
id: identity-vc-specifications
title: Identity Verifiable Credential (IDVC) Specifications
sidebar_label: Identity Verifiable Credential (IDVC) Specifications
---

Identity Verifiable Credential (IDVC) is built based on [W3C Verifiable Credential data model v1.1](https://www.w3.org/TR/vc-data-model/).

A sample IDVC:

```json
{
  "@context": [
    "https://w3id.org/security/bbs/v1",
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/vc/status-list/2021/v1"
  ],
  "id": "https://sbl.alwaysdata.net/oa/credentials/123456789",
  "type": ["VerifiableCredential"],
  "issuer": "did:web:sbl.alwaysdata.net:oa",
  "credentialSubject": {
    "uen": "198801234E",
    "companyname": "My Own Company Pte Ltd",
    "type": ["CorporateBasicDetails"],
    "id": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
  },
  "expirationDate": "2023-11-01T06:45:43Z",
  "credentialStatus": {
    "id": "https://sbl.alwaysdata.net/oa/status/1#325",
    "type": "StatusList2021Entry",
    "statusListIndex": 325,
    "statusListCredential": "https://sbl.alwaysdata.net/oa/status/1/325"
  },
  "issuanceDate": "2023-22-13T01:35:08Z",
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2023-10-18T07:14:46Z",
    "proofPurpose": "assertionMethod",
    "proofValue": "tqvUVZOPaY/A+7Wu47HZIYbboPU/MPGhb1EPLUKKPRwmRe8QJ/dzjRviQ5fAbR88TjSalqLbaBeopNocjrl7TmzCOlLQxGeNC4El1TCICu5tiX0HxGSNAPY4t5CglTLMTsdu5kg4f0a5MGQTnFgwyw==",
    "verificationMethod": "did:web:sbl.alwaysdata.net:oa#didkey"
  }
}
```

**@context**

The `@context` property is introduced as per the W3C VC data model to allow the issuer to map short-form aliases to the URIs required by specific verifiable credentials and presentations.

**credentialSubject**

The `credentialSubject` field describes the claims about the subject of the credential, conforming to the [W3C VC data model](https://www.w3.org/TR/vc-data-model/#credential-subject). This field contains information about the identity of the entity that the credential is issued to. We standardize the field to require 3 fields so that this VC will be classified as a Identity VC by GLEIF, if require, it may contain additional field other than these 3 fields.

- `uen`: the entity's registered company number.
- `companyname`: the company's name.
- `id`: a `did:ethr` which will link to the issuer's ethereum wallet.

**credentialStatus**

The `credentialStatus` field describes the [status of the document.](https://www.w3.org/TR/vc-data-model/#status)

**proof**

We currently only support [BBS 2020 cryptosuite](https://github.com/mattrglobal/jsonld-signatures-bbs) for the securing mechanism.

### Disclaimer

Please note that IDVC is currently in its beta phase, and the process may be subject to changes based on feedback and further development.
