---
id: tradetrust-api
title: TradeTrust API
sidebar_label: TradeTrust API
---

### Verify endpoint

Currently there is an API endpoint for verifying documents issued on both ropsten and rinkeby network:

```
ropsten: https://api-ropsten.tradetrust.io/verify
rinkeby: https://api-rinkeby.tradetrust.io/verify

```

However it is recommended that you setup your own, refer to the <a href="/docs/appendix/infrastructure-template#verify">guide</a> on how.

## Axios example

`axios.post("https://api-ropsten.tradetrust.io/verify", { document: ISSUED_DOCUMENT })`

Example usage:

```
axios
  .post("https://api-ropsten.tradetrust.io/verify", { document: ISSUED_DOCUMENT })
  .then(function (response) {
    console.log(response.data.summary); // should return { all: true, documentStatus: true, documentIntegrity: true, issuerIdentity: true }
  })
  .catch(function (error) {
    console.log(error);
  });
```

## Curl example

`curl -H "Content-Type: application/json" --request POST --data '{"document":"ISSUED_DOCUMENT"}' https://api-ropsten.opencerts.io/verify`

Return response of a verified document:

```
{
   "summary":{
      "all":true,
      "documentStatus":true,
      "documentIntegrity":true,
      "issuerIdentity":true
   },
   "data":[
      {
         "type":"DOCUMENT_INTEGRITY",
         "name":"OpenAttestationHash",
         "data":true,
         "status":"VALID"
      },
      {
         "status":"SKIPPED",
         "type":"DOCUMENT_STATUS",
         "name":"OpenAttestationEthereumDocumentStoreIssued",
         "reason":{
            "code":4,
            "codeString":"SKIPPED",
            "message":"Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or DOCUMENT_STORE method"
         }
      },
      {
         "name":"OpenAttestationEthereumTokenRegistryMinted",
         "type":"DOCUMENT_STATUS",
         "data":{
            "mintedOnAll":true,
            "details":[
               {
                  "minted":true,
                  "address":"0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B"
               }
            ]
         },
         "status":"VALID"
      },
      {
         "status":"SKIPPED",
         "type":"DOCUMENT_STATUS",
         "name":"OpenAttestationEthereumDocumentStoreRevoked",
         "reason":{
            "code":4,
            "codeString":"SKIPPED",
            "message":"Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or DOCUMENT_STORE method"
         }
      },
      {
         "name":"OpenAttestationDnsTxt",
         "type":"ISSUER_IDENTITY",
         "data":[
            {
               "status":"VALID",
               "location":"demo-tradetrust.openattestation.com",
               "value":"0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B"
            }
         ],
         "status":"VALID"
      }
   ]
}
```

Remember to replace `ISSUED_DOCUMENT` with your own document json object in the above examples.
