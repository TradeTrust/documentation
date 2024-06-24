---
id: idvc-overview
title: Overview
sidebar_label: Overview
---

TradeTrust V4 introduces a new issuer method, Identity Verifiable Credential (IDVC), enhancing the way documents are authenticated and verified. This method allows for embedding or splicing an Identity Verifiable Credential from an established identity provider directly into a TradeTrust document. This documentation provides an overview of this new method and how it integrates with the TradeTrust V4 schema.

For more information about existing issuer methods like [DNS-TXT](/docs/topics/introduction/issuer-method-dns-txt) or [DID/DNS-DID](/docs/topics/introduction/issuer-method-dns-did), please visit their respective pages.

### TradeTrust V4 Document (IDVC)

A TradeTrust V4 document with the issuer method IDVC refers to a standard TradeTrust document that adheres to the TradeTrust V4 schema and incorporates an embedded or spliced Identity Verifiable Credential (IDVC) from a recognized identity provider. This integration ensures that the identity of the issuer is verifiable and trustworthy.

### Minimal Form of a TradeTrust V4 Document (IDVC)

In its most minimal form, the raw document should contain the following components:

- TradeTrust Document: A document that complies with the TradeTrust V4 schema.
- Identity Verifiable Credential (IDVC): An IDVC issued by a recognized identity provider, embedded within the TradeTrust document.

### Example of a Minimal TradeTrust V4 Document (IDVC)

Here is a basic example of how a minimal TradeTrust V4 document (IDVC) might look in JSON format:

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

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
  },
  "proof": {
    "type": "TradeTrustMerkleProofSignature2018",
    "proofPurpose": "assertionMethod",
    "targetHash": "841c8d1fb121bf7baab0b1677c91dc47cca6aa1e8ac77....",
    "proofs": [],
    "merkleRoot": "841c8d1fb121bf7baab0b1677c91dc47cca6aa1e8ac77....",
    "salts": "W3sidmFsdWUiOiJiYjMyNjdiNGRkZGY0ZWRkMzJlZDNmY2YxYTlhOWM5NzY3NGFi....",
    "privacy": {
      "obfuscated": []
    },
    "key": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C#controller",
    "signature": "0x76c3def684b98da04733f8f4..."
  }
}
```

### Disclaimer
Please note that the TradeTrust V4 is currently in its beta phase, and the process for creating TradeTrust V4 documents may be subject to changes based on feedback and further development.
