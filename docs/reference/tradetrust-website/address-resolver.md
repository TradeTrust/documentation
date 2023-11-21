---
id: address-resolver
title: Address Resolver
sidebar_label: Address Resolver
---

Different companies may choose to use different pseudo-identity, some of these identifiers are reused and some are not. For those companies who chose to reuse a pseudo-identity, there is almost always a need to point to them again when doing transactions because it acts as an identifier to the user / company when doing transactions with them.. Examples of such resources could be a shipping line wallet, multi-sig wallet or eBL token registry. Read more about identifier resolution framework <a href="https://github.com/Open-Attestation/adr/blob/master/identifier_resolution_framework.md" target="_blank" rel="noopener noreferrer">here</a>.

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

### Setup

So to recap the steps on setting your own local addressbook:

1. First, prepare a csv excel sheet list of addresses and identifiers. For example:
   ![local csv](/docs/reference/tradetrust-website/local-csv.png)
2. Develop an import csv file feature in your application. You'll need to:
   - Convert file to string. For example:
     ```js
     const readAsText = async (file: File): Promise<string> => {
       return new Promise((resolve, reject) => {
         const reader = new FileReader();
         if (reader.error) {
           reject(reader.error);
         }
         reader.onload = () => resolve(reader.result as string);
         reader.readAsText(file);
       });
     };
     ```
   - Then convert string to key value object. For example:
     ```js
     import { parse } from "papaparse";
     const csvToAddressBook = (csv: string) => {
       const { data } = parse(csv, { skipEmptyLines: true, header: true });
       const addressBook = {};
       data.forEach((row, index) => {
         const identifierText = row.Identifier || row.identifier;
         const addressText = row.Address || row.address;
         addressBook[addressText.toLowerCase()] = identifierText;
       });
       return addressBook;
     };
     csvToAddressBook(readAsText);
     ```
3. Finally, if local address tally, return identifier name as per defined in csv file previously.
   ```js
   const addressToMatch = "0xabc..."; // your local address
   for (const [key, value] of Object.entries(csvToAddressBook)) {
     if (addressToMatch === key) {
       return value;
     }
   }
   ```

## Address Resolver (Third party)

For our reference implementation, we are using Google Sheets as our "database" for demonstrating the third party address resolution concept conveniently. Similar to local address book, think of it as a list of records that map ethereum addresses to a defined label name within the google sheet columns.

In the settings page you can add your third party address resolver. It enables you to add a third party's endpoint to resolve Ethereum addresses to their company's name. With Ethereum addresses being cryptic to end users, this Address Resolver will act as a digital address book, think of it as your mobile phone contact list, we only remember names, not numbers. The address book allows end users to see familiar identifiers such as `ABC Pte Ltd`. Once the Address Resolver endpoint has been added, when you verify a document with an identifiable Ethereum address, it will look like the following:

![Address-resolved](/docs/reference/tradetrust-website/address-resolved.png)

You can see that the company's name, resolver details and source will also be displayed above the resolved Ethereum
address.

_Note: There is a difference between "Resolved by" and "Source" parameters. Resolved by refers to the naming of the 3rd
party resolver that the user has set in the settings page. Source (an optional field) refers to information that is
verified by another party. For example, in NDI Myinfo, they have verified information from different agencies._

> You are not restricted to Google Sheets approach and is free to use any other backend solutions.

### How to set up a 3rd party Address Resolver (Google Sheet approach)

_Prerequisite: [Google sheets API](https://developers.google.com/sheets/api/reference/rest)._

- Go to [Google Console](https://console.cloud.google.com/apis/library) and create a new project.
  ![create project](/docs/reference/tradetrust-website/create-project.png)
- Enable Google Sheets API. Once enabled, it should be added to the list.
  ![enable api](/docs/reference/tradetrust-website/enable-api.png)
- Create an API key.
  ![create key](/docs/reference/tradetrust-website/create-key.png)
- Create and populate a Google Sheet with columns of:
  - `identifier` (The ethereum address of the company)
  - `name` (The name of the company)
  - `source`. (_Optional:The source of the information_)
- Set Google Sheet to public.
- Setup the third party resolution service by configuring it to access Google Sheets with the API key gotten from step 1.
  - Fork this [reference implementation](https://github.com/TradeTrust/demo-identifier-resolver).
  - Define these environment variables in github repo secrets:
    - SHEETS_API_KEY = Your created API key from Google Console.
    - SHEETS_ID = Your google sheet ID.
    - SHEETS_RANGE = Your google sheet cell range.
    - STAGING_AWS_ACCESS_KEY_ID = Your AWS access key id.
    - STAGING_AWS_SECRET_ACCESS_KEY = Your AWS access key secret.
  - Spin up this service up by pushing to master, github actions will automate the deployment.
  - Go to API Gateway in your AWS account. Create a custom domain name of your preference. Take note of API Gateway domain name.
    ![api gateway](/docs/reference/tradetrust-website/api-gateway.png)
  - Click API mappings and configure it by selecting `stg-demo-identifier-resolver` from dropdown list.
  - Go to Route53 and create a new CNAME record. The value is your API Gateway domain name.
    ![route53](/docs/reference/tradetrust-website/route53.png)
  - Once set, wait for a few minutes and your API endpoint will be accessible in the custom domain name that you've created. This will be what we call the third party resolution service endpoint.
- Go to the website application, clicking the "+ Add" button in the settings page will show you following:

![Settings](/docs/topics/tradetrust-website/address-resolver/address-resolver.png)

- Fill in the following:
  - `name` (A label you want to name this endpoint, this will be reflected as the "Resolved by")
  - `endpoint` (The third party resolution service endpoint that you've spinned up)
  - `API Header and API Key` (The authentication handling on service that you've spinned up)

---

#### Name

The "Name" input refers to the name of the address resolver that contains all the mappings of companies and their respective Ethereum address. For example, "BANKS.SG" could be the address resolver for all banks in Singapore.

---

#### Endpoint

The "Endpoint" input refers to the endpoint that will be called to resolve an Ethereum Address.
A demo hosted endpoint is available at [https://demo-resolver.tradetrust.io/](https://demo-resolver.tradetrust.io/).

![return-search](/docs/reference/tradetrust-website/return-search.png)

_Note: This demo endpoint is not suitable for production environment, please use it only in testing or staging environment._

---

#### API Header and API Key

For the API to know that you are an authorised user, an API Key is required and you will need to pass it in through an
API Header. An example would be `x-api-key` for the API Header and `DEMO` for the API Key.
