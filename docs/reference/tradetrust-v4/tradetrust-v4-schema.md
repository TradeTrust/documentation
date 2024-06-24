---
id: tradetrust-v4-schema
title: TradeTrust V4 schema
sidebar_label: TradeTrust V4 Schema
---

TradeTrust V4 schema is currently in its beta phase. This version aligns more closely with the [W3C Verifiable Credentials (VC) data model](https://www.w3.org/TR/vc-data-model-2.0/), enhancing interoperability and standardization for verifiable documents.

The schema can be found [here](https://schemata.tradetrust.io/io/tradetrust/4.0/schema.json).

To explain the TradeTrust document schema, we will use a sample verifiable document as an example.

### Sample Document Structure

Here is a basic example of a TradeTrust V4 verifiable document in JSON format:

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

<Tabs groupId="document-schema">
  <TabItem value="v4" label="TradeTrust V4 Schema Beta">
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.tradetrust.io/io/tradetrust/4.0/context.json"
  ],
  "type": [
    "VerifiableCredential",
    "TradeTrustCredential"
  ],
  "validFrom": "2021-03-08T12:00:00+08:00",
  "issuer": {
    "id": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
    "type": "TradeTrustIssuer",
    "name": "My Own Company Pte Ltd",
    "identityProof": {
      // Note the new identityProofType
      "identityProofType": "IDVC",
      "identifier": "My Own Company Pte Ltd",
      "identityVC": {
        "type": "TradeTrustIdentityVC",
        // This is where you should put your IDVC data
        "data": {
          "@context": [
            "https://w3id.org/security/bbs/v1",
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/vc/status-list/2021/v1",
            ...
          ],
          "id": "<CREDENTIAL_ID>",
          "type": [
            "VerifiableCredential"
          ],
          "issuer": "<ISSUER>",
          "credentialSubject": {
            "uen": "198801234E",
            "companyname": "My Own Company Pte Ltd",
            "type": [
              "CorporateBasicDetails"
            ],
            "id": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          },
          ...
      }
    }
  },
  "network": {
    "chain": "sepolia",
    "chainId": "11155111"
  },
  "credentialStatus": {
    "type": "TradeTrustCredentialStatus",
    "credentialStatusType": "NONE"
  },
  "renderMethod": {
    "type": "TradeTrustRenderMethod",
    "renderMethodType": "EMBEDDED_RENDERER",
    "name": "INVOICE",
    "url": "https://generic-templates.tradetrust.io"
  },
  "credentialSubject": {
    "name": "Document",
    "id": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
    "date": "2018-02-21",
    ....
  }
}
```
  </TabItem>
</Tabs>

### Key Fields in the Schema

Key fields to note:

- @context
- issuer
- network
- renderMethod
- credentialSubject
- credentialStatus

**@context**

The `@context` property is introduced as per the [W3C VC data model](https://www.w3.org/TR/vc-data-model-2.0/#contexts) to allow the issuer to map short-form aliases to the URIs required by specific verifiable credentials and presentations. 

TradeTrust has released a beta extension to W3C credentials context, which can be accessed [here](https://schemata.tradetrust.io/io/tradetrust/4.0/context.json).

**issuer**

In TradeTrust Schema V4, there will be a single named issuer conforming to one of the three issuer methods: IDVC, DNS-TXT, and DNS-DID.

**network**

The `network` key is used to determine the network on which the document is issued. It includes the following keys:

- `chain`: The type of blockchain on which the document is issued/minted.
- `chainId`: The value of the network used to connect to the blockchain.

**renderMethod**

This key determines the rendering method of the document. It specifies how the document should be displayed or presented.

**credentialSubject**

The `credentialSubject` field describes the claims about the subject of the credential, conforming to the [W3C VC data model](https://www.w3.org/TR/vc-data-model-2.0/#credential-subject). This field contains information about the entity that the credential is issued to.

**credentialStatus**

The `credentialStatus` field describes the status of the document. The `credentialStatus.credentialStatusType` can be one of the following:

- `NONE`: No status information.
- `OCSP_RESPONDER`: Status provided by an OCSP responder.
- `REVOCATION_STORE`: Status managed in a document store.
- `TOKEN_REGISTRY`: Status tracked by a token registry.

### Disclaimer
Please note that TradeTrust V4 Schema is currently in its beta phase, and the process may be subject to changes based on feedback and further development.
