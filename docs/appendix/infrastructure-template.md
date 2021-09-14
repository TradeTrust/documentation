---
id: infrastructure-template
title: Infrastructure Template
sidebar_label: Infrastructure Template
---

## Introduction

As TradeTrust is an open ecosystem, we have developed some templates that can be used to quickly deploy your own infrastructure.
These templates are available at [the Github repository](https://github.com/Open-Attestation/oa-functions).

Usage of these templates presume knowledge of Amazon Web Services, and users are liable for their own costs and infrastructure security.

These templates are Open Source and have been written using the [Serverless Framework](https://www.serverless.com/framework/docs/).

## AWS Credentials Setup

You will need one IAM user with an access key and a secret key. The user must be able to:

- create lambda function.
- manage api gateway.
- manage domains.

To input the credentials, you will need to put them into environmental variables like this:

```bash
# set environment variable
export AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY> # user secret key
export AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID> # user access key
export DOMAIN=some.domain.com # change to the domain you will deploy on
export CERTIFICATE_DOMAIN=*.domain.com # change to the domain you will deploy on
```

## Cloning the repository

Before you can use the templates you will need a copy of it on your computer.

```bash
git clone https://github.com/Open-Attestation/oa-functions.git
cd oa-functions
npm install
```

## Creating Domain

The templates also have the ability to set up custom domain names for the endpoints. To use this functionality you must have the root domain managed and hosted in AWS Route53.

If you wish to use the domain manager functionality you need to first set it up:

```bash
npm run create-domain:verify
```

Otherwise, if you do not wish to use the domain manager functionality, you must perform the following commands to disable it:

```bash
export DISABLE_DOMAIN=true
```

## Verify

The Verify API creates an endpoint that accepts a TradeTrust document and returns the results of the verification according to the [@govtechsg/oa-verify](https://www.npmjs.com/package/@govtechsg/oa-verify) library.

To deploy the Verify API to be used on Ropsten:

```bash
NETWORK=ropsten npm run deploy:verify -- --stage stg
```

To deploy the Verify API to be used on Rinkeby:

```bash
NETWORK=rinkeby npm run deploy:verify -- --stage stg
```

To deploy it for verifying against Main Net:

```bash
NETWORK=homestead npm run deploy:verify -- --stage prd
```

If you are using the domain manager, the API should then be available under `https://some.domain.com/verify`

## Storage

The Storage API creates an endpoint that accepts a TradeTrust document, encrypts and stores it, then returns an ID that can be used to retrieve the encrypted document.

The encrypted document can be decrypted by using the returned encryption key.

This endpoint can optionally be access controlled with an API key, to enable this:

```bash
export ENABLE_STORAGE_UPLOAD_API_KEY=true
```

To deploy this endpoint for Ropsten documents:

```bash
NETWORK=ropsten npm run deploy:storage -- --stage stg
```

To deploy this endpoint for Rinkeby documents:

```bash
NETWORK=rinkeby npm run deploy:storage -- --stage stg
```

To deploy it for Main Net documents:

```bash
NETWORK=homestead npm run deploy:storage -- --stage prd
```

## Other Configuration

This template is designed to be highly configurable, with many other configuration options that have not been detailed here.
Do look at the README.md in the repository in order to learn the full list of configuration options.
