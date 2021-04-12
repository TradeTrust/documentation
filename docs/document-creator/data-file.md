---
id: data-file
title: Data File
sidebar_label: Data File
---

After setting up your on config file for TradeTrust Creator, you can now log in to access the create and issue functionalities. Upon picking a template, you will notice that there is a `Upload Data File` button.

## Upload Data file

The purpose of this upload button is to cater for users who wants a quick way to pre-populate a set of determined values to the fields of a respective template.

As of today, you can:

- pre-populate a **single** transferable record document.
- pre-populate **mulitple** verifiable documents.

### Example of a data file (bill of lading)

```json
{
  "data": {
    "blNumber": "123",
    "scac": "987",
    "carrierName": "Demo Carrier",
    "shipper": {
      "name": "Demo Shipper",
      "address": {
        "street": "One North",
        "country": "Singapore"
      }
    },
    "consignee": {
      "name": "Demo Consignee"
    },
    "notifyParty": {
      "name": "Demo Notify"
    },
    "vessel": "1",
    "voyageNo": "100",
    "portOfLoading": "Singapore Port",
    "portOfDischarge": "China Port",
    "placeOfReceipt": "Beijing",
    "placeOfDelivery": "Singapore",
    "packages": [
      {
        "description": "Green Apples",
        "weight": "20",
        "measurement": "100"
      }
    ],
    "fileName" : "Demo Filename 1"
  },
  "ownership": {
    "beneficiaryAddress": "0xa61b056da0084a5f391ec137583073096880c2e3",
    "holderAddress": "0xa61b056da0084a5f391ec137583073096880c2e3"
  }
}
```
