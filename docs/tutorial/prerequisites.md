---
id: prerequisites
title: Prerequisites
sidebar_label: Prerequisites
---

Before we start, you will need the OpenAttestation CLI correctly setup.

## What it does

The [Open Attestation CLI](https://github.com/Open-Attestation/open-attestation-cli) tool allows users to deploy, mint, wrap and other operation on their documents. It can be used for both Verifiable Documents and Transferable Records.

## Installation

### Binary

To install the binary, simply download the binary from the [CLI release page](https://github.com/Open-Attestation/open-attestation-cli/releases) for your OS.

> We are aware that the size of the binaries must be reduced and we have tracked the issue in [Github](https://github.com/Open-Attestation/open-attestation-cli/issues/68). We hope to find a solution in a near future and any help is welcomed.

### NPM

Alternatively for Linux or MacOS users, if you have `npm` installed on your machine, you may install the cli using the following command:

```bash
npm install -g @govtechsg/open-attestation-cli
```

The above command will install the open-attestation CLI to your machine. You will need to have node.js installed to be able to run the command.

You can also opt to use npx:

```bash
npx -p @govtechsg/open-attestation-cli open-attestation <arguments>
```

> In all the guides, we will refer to the CLI as `open-attestation` when running a command. That means we will assume the CLI is available in your execution path. If it's not the case, you will to change `open-attestation` by the full path to the executable.

---

## Running the CLI

To check if the setup is working correctly, run the following command:

```bash
open-attestation --version
```

> In the event you need to change the binary name or the path to the binary, makes sure to change the command above accordingly as well as all the commands we will run throughout the guide.

## Further

For detailed information about the application, please refer to the [Github Repository](https://github.com/Open-Attestation/open-attestation-cli)
