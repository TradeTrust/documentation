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
    "https://www.w3.org/2018/credentials/v1",
    "https://didrp-test.esatus.com/schemas/basic-did-lei-mapping/v1",
    "https://w3id.org/security/bbs/v1",
    "https://w3id.org/vc/status-list/2021/v1"
  ],
  "credentialStatus": {
    "id": "https://didrp-test.esatus.com/credentials/statuslist/1#27934",
    "statusListCredential": "https://didrp-test.esatus.com/credentials/statuslist/1",
    "statusListIndex": 27934,
    "statusPurpose": "revocation",
    "type": "StatusList2021Entry"
  },
  "credentialSubject": {
    "entityName": "IMDA_active",
    "entityIdentifier": "391200WCZAYD47QIKX37",
    "id": "did:ethr:0x433097a1C1b8a3e9188d8C54eCC057B1D69f1638",
    "type": ["BasicDIDLEIMapping"]
  },
  "issuanceDate": "2024-04-01T12:19:52Z",
  "expirationDate": "2029-12-03T12:19:52Z",
  "issuer": "did:web:didrp-test.esatus.com",
  "type": ["VerifiableCredential"],
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2024-04-11T10:51:46Z",
    "proofPurpose": "assertionMethod",
    "proofValue": "uDqETewb6fwNzGgihIxUSdvTyncfEeIjowsj91O4qT2HsTLk4OUmkdreSY55d+SzYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i+CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx/IAvLVniyeMQ==",
    "verificationMethod": "did:web:didrp-test.esatus.com#keys-1"
  }
```

**@context**

The `@context` property is introduced as per the W3C VC data model to allow the issuer to map short-form aliases to the URIs required by specific verifiable credentials and presentations.

**credentialSubject**

The `credentialSubject` field describes the claims about the subject of the credential, conforming to the [W3C VC data model](https://www.w3.org/TR/vc-data-model/#credential-subject). This field contains information about the identity of the entity that the credential is issued to. We standardize the field to require 3 fields so that this VC will be classified as a Identity VC by GLEIF, if require, it may contain additional field other than these 3 fields.

- `entityName`: the company's/entity's name.
- `entityIdentifier`: the company's/entity's identifier. (e.g. GLEIF's lei, Unique Entity Number, D-U-N-S Number)
- `id`: a `did:ethr` which will link to the issuer's ethereum wallet.

**credentialStatus**

The `credentialStatus` field describes the [status of the document.](https://www.w3.org/TR/vc-data-model/#status)

**proof**

We currently only support [BBS 2020 cryptosuite](https://github.com/mattrglobal/jsonld-signatures-bbs) for the securing mechanism.

### Disclaimer

Please note that IDVC is currently in its beta phase, and the process may be subject to changes based on feedback and further development.
