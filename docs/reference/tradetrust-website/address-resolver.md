---
id: address-resolver
title: Address Resolver
sidebar_label: Address Resolver
---

Different entities may choose to use different pseudonyms (in our case Ethereum addresses), some of these identifiers are reused and some are not. For those entities who chose to reuse a pseudonym, they may want wish for these resources to be identified. Examples of such resources could be a shipping line wallet, multi-sig wallet or eBL token registry. Read more about identifier resolution framework <a href="https://github.com/Open-Attestation/adr/blob/master/identifier_resolution_framework.md" target="_blank" rel="noopener noreferrer">here</a>.

## TradeTrust's address resolution

For TradeTrust, currently there are 2 ways of resolving identities, 1 is through a local address book, the other is via 3rd party resolver API. These are accessible from the gear icon on the far right of the top navigation bar on TradeTrust website.

![Setting](/docs/topics/tradetrust-website/address-resolver/settings.png)

> You can refer to this [example](https://github.com/TradeTrust/address-identity-resolver) on how addresses get resolved on application end.

## Address Book (Local)

Address Book is like a local phone book. The data is in a csv/excel format, where the minimal amount of columns are:

- `identifier` (refers to the ethereum address)
- `name` (refers to the resolved name that the company defined in their csv/excel sheet).

![Addressbook](/docs/topics/tradetrust-website/address-resolver/address-book.png)

After importing the csv/excel sheet, previously ethereum addresses (where resolvable) should now be resolved to recognizable identities as defined within the imported sheet.

## Address Resolver (Third party)

_Prerequisite: [Google sheets API](https://developers.google.com/sheets/api/reference/rest)._

For our reference implementation, we are using Google Sheets as our "database" for demonstrating the third party address resolution concept conveniently. Similar to local address book, think of it as a list of records that map ethereum addresses to a defined label name within the google sheet columns.

In the settings page you can add your third party address resolver. It enables you to add a third party's endpoint to resolve
Ethereum addresses to their entity's name. With Ethereum addresses being cryptic to end users, this Address Resolver
will act as a digital "yellow pages", allowing end users to see familiar identifiers such as `ABC Pte Ltd`. Once the
Address Resolver endpoint has been added, when you verify a document with an identifiable Ethereum address, it will
look like the following:

![Address-resolved](/docs/topics/tradetrust-website/address-resolver/address-resolved.png)

You can see that the entity's name, resolver details and source will also be displayed above the resolved Ethereum
address.

_Note: There is a difference between "Resolved by" and "Source" parameters. Resolved by refers to the naming of the 3rd
party resolver that the user has set in the settings page. Source (an optional field) refers to information that is
verified by another party. For example, in NDI Myinfo, they have verified information from different agencies._

> You are not restricted to Google Sheets approach and is free to use any other backend solutions.

### How to set up a 3rd party Address Resolver (Google Sheet approach)

- Get a Google Sheets API key.
- Create and populate a sheet with columns of:
  - `identifier` (The ethereum address of the entity)
  - `name` (The name of the entity)
  - `source`. (_Optional:The source of the information_)
- Setup the third party resolution service by configuring it to access google sheets with the API key gotten from step 1.
  - A reference implementation of this service can be found [here](https://github.com/Open-Attestation/demo-identifier-resolver).
- Spin up this service and get a respective endpoint.
- Go to the website application, clicking the "+ Add" button in the settings page will show you following:

![Settings](/docs/topics/tradetrust-website/address-resolver/address-resolver.png)

- Fill in the following:
  - `name` (A label you want to name this endpoint, this will be reflected as the "Resolved by")
  - `endpoint` (The third party resolution service endpoint that you've spinned up)
  - `API Header and API Key` (The authentication handling on service that you've spinned up)

---

#### Name

The "Name" input refers to the name of the address resolver that contains all the mappings of entities and their respective
Ethereum address. For example, "BANKS.SG" could be the address resolver for all banks in Singapore.

---

#### Endpoint

The "Endpoint" input refers to the endpoint that will be called to resolve an Ethereum Address.
A demo hosted endpoint is available at [https://demo-resolver.tradetrust.io/identifier/](https://demo-resolver.tradetrust.io/identifier/).

_Note: This demo endpoint is not suitable for production environment, please use it only in testing or staging environment._

---

#### API Header and API Key

For the API to know that you are an authorised user, an API Key is required and you will need to pass it in through an
API Header. An example would be `x-api-key` for the API Header and `DEMO` for the API Key.