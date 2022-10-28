---
id: tradetrust-api
title: TradeTrust API
sidebar_label: TradeTrust API
---

### Verify endpoint

Currently there is a reference API endpoint for verifying documents on Ethereum network:

```
https://tradetrust-functions.netlify.app/.netlify/functions/verify
```

⚠️ Read more about it [here](https://github.com/TradeTrust/tradetrust-functions#verify).

### Curl example

```
curl --header "Content-Type: application/json" --request POST --data '{ "document" : WRAPPED_ISSUED_DOCUMENT }' https://tradetrust-functions.netlify.app/.netlify/functions/verify
```

Remember to replace `WRAPPED_ISSUED_DOCUMENT` with your own stringified document json object in the above example.

```
// Return response of a verified document:

{
  "summary": {
    "all": true,
    "documentStatus": true,
    "documentIntegrity": true,
    "issuerIdentity": true
  },
  "fragments": [
    {
      "type": "DOCUMENT_INTEGRITY",
      "name": "OpenAttestationHash",
      "data": true,
      "status": "VALID"
    },
    {
      "status": "SKIPPED",
      "type": "DOCUMENT_STATUS",
      "name": "OpenAttestationEthereumTokenRegistryStatus",
      "reason": {
        "code": 4,
        "codeString": "SKIPPED",
        "message": "Document issuers doesn't have \"tokenRegistry\" property or TOKEN_REGISTRY method"
      }
    },
    {
      "name": "OpenAttestationEthereumDocumentStoreStatus",
      "type": "DOCUMENT_STATUS",
      "data": {
        "issuedOnAll": true,
        "revokedOnAny": false,
        "details": {
          "issuance": [
            {
              "issued": true,
              "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD"
            }
          ],
          "revocation": [
            {
              "revoked": false,
              "address": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD"
            }
          ]
        }
      },
      "status": "VALID"
    },
    {
      "status": "SKIPPED",
      "type": "DOCUMENT_STATUS",
      "name": "OpenAttestationDidSignedDocumentStatus",
      "reason": {
        "code": 0,
        "codeString": "SKIPPED",
        "message": "Document was not signed by DID directly"
      }
    },
    {
      "name": "OpenAttestationDnsTxtIdentityProof",
      "type": "ISSUER_IDENTITY",
      "data": [
        {
          "status": "VALID",
          "location": "demo-tradetrust.openattestation.com",
          "value": "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD"
        }
      ],
      "status": "VALID"
    },
    {
      "status": "SKIPPED",
      "type": "ISSUER_IDENTITY",
      "name": "OpenAttestationDnsDidIdentityProof",
      "reason": {
        "code": 0,
        "codeString": "SKIPPED",
        "message": "Document was not issued using DNS-DID"
      }
    },
    {
      "status": "SKIPPED",
      "type": "ISSUER_IDENTITY",
      "name": "OpenAttestationDidIdentityProof",
      "reason": {
        "code": 0,
        "codeString": "SKIPPED",
        "message": "Document is not using DID as top level identifier or has not been wrapped"
      }
    }
  ]
}
```
