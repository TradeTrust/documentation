---
id: creator
title: Creator
sidebar_label: Creator
---

This guide walks you through creating a backend service for minting tokens on the blockchain using TradeTrust's Token Registry. You'll learn how to set up a secure and scalable backend infrastructure that enables the creation and management of transferable documents on the blockchain.

## What You'll Learn

- Set up a Node.js backend project with TypeScript and Express
- Create and configure a decentralized identifier (did:web) for document signing
- Deploy a Token Registry smart contract on the blockchain
- Implement secure endpoints for minting transferable documents

## Who This Guide Is For

This guide is designed for developers who want to:

- Build backend services that interact with blockchain networks
- Create and manage transferable documents using TradeTrust
- Understand the implementation of did:web and Token Registry

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn
- A code editor, e.g., Visual Studio Code

## Setting up the backend project

### 1. Create a new project directory

```bash
mkdir creator-tutorial
cd creator-tutorial
```

### 2. Initialize a new Node.js project

```bash
npm init -y
```

### 3. Install the required dependencies

```bash
npm install @trustvc/trustvc dotenv express
npm install --save-dev @types/express @types/node concurrently cross-env dotenv-cli nodemon ts-node tsc-alias typescript
```

### 4. Set up TypeScript

```
npx tsc --init
```

Update tsconfig.json with the following configurations:

```json
{
  "compilerOptions": {
    ...
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "outDir": "./dist",
    ...
  },
  ...
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 5. Create a empty express app

Create a src directory and an index.ts file in it, and add the following code:

```ts
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
```

### 6. Update package.json with scripts and nodemon configuration

Create a nodemon.json file in the root directory with the following content:

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "cross-env NODE_ENV=development ts-node src/index.ts"
}
```

Update package.json with the following scripts:

```json
  ...
  "scripts": {
    ...
    "build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json",
    "start": "node dist/index.js",
    "dev": "nodemon",
  }
```

### 7. Setup script for single executed commands

In order to sign and mint a token, we need to need the signing key pair (did:web) and a token registry contract (smart contract) respectively.
In this example, we will generate a new signing key pair and deploy a deploy a new token registry contract, and store the signing private key and contract address in the .env file.
The signing key public key will stored as a did.json file which will then be served as a publicly accessable did:web document.

:::note
For a multi tenanted environment, you can convert these scripts to a executable functinon and store the result in your database, in a secure manner.
:::

#### 7.1 Create a .env file

```.env
# Required values
DOMAIN=
WALLET_PRIVATE_KEY=
NET=20180427

# Optional
NGROK_AUTHTOKEN=

# Optional depending on network selected
STABILITY_API_KEY=
STABILITY_TESTNET_API_KEY=
INFURA_API_KEY=

# Generated values
DID_KEY_PAIRS=
TOKEN_REGISTRY_ADDRESS=
```

Sepcify the following values:

- `DOMAIN` variable, the domain name where you want to host your did:web
- `WALLET_PRIVATE_KEY` variable, with the private key of the wallet you want to use to deploy the token registry contract.
- `NET` variable, with the network you want to use to deploy the token registry contract.

Depend on your selected network, you will need to setup the RPC URL for your selected network. Retrieve the API KEY and add it to the.env file.

:::tip
If you would like to test and validate the issued document on the web, you can use ngrok to expose your local server to the internet.

Generate the authtoken and add it to the.env file under the `NGROK_AUTHTOKEN` variable.

For more details refer to the ngrok configuration [below](/docs/tutorial/creator#81-serve-the-did-with-ngrok).
:::

#### 7.2 Create a script to generate a new did:web and store it in the.env file

<details>
<summary>Create a src/scripts/util.ts file and add the following code:</summary>

```ts
import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";

export const writeEnvVariable = (key: string, value: string): void => {
  const envPath = join(process.cwd(), ".env");
  const envString = JSON.stringify(value);

  try {
    let existingEnv = readFileSync(envPath, "utf8");
    if (!existingEnv.includes(`${key}=`)) {
      const envData = existingEnv.endsWith("\n") ? `${key}=${envString}\n` : `\n${key}=${envString}\n`;
      appendFileSync(envPath, envData);
      console.log(`${key} has been written to .env file`);
    } else {
      // Replace existing value
      const envLines = existingEnv.split("\n");
      const updatedEnv = envLines.map((line) => (line.startsWith(`${key}=`) ? `${key}=${envString}` : line)).join("\n");
      writeFileSync(envPath, updatedEnv.endsWith("\n") ? updatedEnv : updatedEnv + "\n");
      console.log(`Existing ${key} has been overwritten in .env file`);
    }
  } catch (error) {
    writeFileSync(envPath, `${key}=${envString}\n`);
    console.log(`Created new .env file with ${key}`);
  }
};
```

</details>

<details>
<summary>Next create a src/scripts/createDid.ts file and add the following code:</summary>

```ts
import { generateKeyPair, issueDID, VerificationType } from "@trustvc/trustvc/w3c/issuer";
import { writeFileSync } from "fs";
import { join } from "path";
import { writeEnvVariable } from "./utils";
import { ethers } from "ethers";

const main = async () => {
  console.log("ethers.version", ethers.version);
  console.log("process.env.DOMAIN", process.env.DOMAIN);
  const keyPair = await generateKeyPair({
    type: VerificationType.Bls12381G2Key2020,
  });
  console.log("keyPair: ", keyPair);
  const issuedDidWeb = await issueDID({
    domain: process.env.DOMAIN,
    ...keyPair,
  });
  console.log("issuedDidWeb: ", JSON.stringify(issuedDidWeb, null, 2));

  // Write the wellKnownDid to a JSON file
  const outputPath = join(process.cwd());
  writeFileSync(join(outputPath, "did.json"), JSON.stringify(issuedDidWeb.wellKnownDid, null, 2));
  console.log("DID document has been written to ./did.json");

  // write issuedDidWeb.didKeyPairs into .env as DID_KEY_PAIRS key
  writeEnvVariable("DID_KEY_PAIRS", JSON.stringify(issuedDidWeb.didKeyPairs));
};
main();
```

</details>

The did:web private key will be stored as a stringified JSON object in the `DID_KEY_PAIRS` variable in the .env file.

While the public did:web will be stored in the did.json file.

#### 7.3 Create a script to deploy a token registry contract

:::important
You will need to setup the RPC URL for your selected network. Retrieve the API KEY and add it to the .env file.

More details [here](/docs/topics/advanced/additional-network-metamask-guide/#fill-in-the-network-configuration-for-the-new-network-as-required)
:::

<details>
<summary> Create a src/scripts/deployTokenRegistry.ts file and add the following code:</summary>

```ts
import { CHAIN_ID, SUPPORTED_CHAINS, v5ContractAddress, v5Contracts } from "@trustvc/trustvc";
import { utils as v5Utils } from "@trustvc/trustvc/token-registry-v5";
import { ethers, Wallet } from "ethers";
import { writeEnvVariable } from "./utils";

const main = async () => {
  const chainId: CHAIN_ID = (process.env.NET as CHAIN_ID) ?? CHAIN_ID.amoy;

  const unconnectedWallet = new Wallet(process.env.WALLET_PRIVATE_KEY!);
  const provider = new ethers.JsonRpcProvider(SUPPORTED_CHAINS[chainId].rpcUrl);
  const wallet = unconnectedWallet.connect(provider);
  const walletAddress = await wallet.getAddress();

  const { TDocDeployer__factory } = v5Contracts;

  const { TokenImplementation, Deployer } = v5ContractAddress;
  const deployerContract = TDocDeployer__factory.connect(Deployer[chainId], wallet);
  const initParam = v5Utils.encodeInitParams({
    name: "DemoTokenRegistry",
    symbol: "DTR",
    deployer: walletAddress,
  });

  const tx = await deployerContract.deploy(TokenImplementation[chainId], initParam);
  const receipt = await tx.wait();
  console.log(`Document ${documentId} minted on tx hash ${receipt?.hash}`);

  let registryAddress;
  if (ethers.version.includes("/5.")) {
    registryAddress = v5Utils.getEventFromReceipt<any>(
      receipt,
      (deployerContract as any).getEventTopic("Deployment"),
      deployerContract.interface,
    ).args.deployed;
  } else if (ethers.version.startsWith("6.")) {
    registryAddress = v5Utils.getEventFromReceipt<any>(receipt, "Deployment", deployerContract.interface).args.deployed;
  } else {
    throw new Error("Unsupported ethers version");
  }

  console.log(`Contract Address: ${registryAddress}`);
  console.log(`Transaction: ${JSON.stringify(receipt, null, 2)}`);

  // write registryAddress to .env file as TOKEN_REGISTRY_ADDRESS key
  writeEnvVariable("TOKEN_REGISTRY_ADDRESS", registryAddress);
};
main();
```

</details>

The token registry contract address will be stored as a string in the `TOKEN_REGISTRY_ADDRESS` variable in the .env file.

#### 7.4 Update package.json with the new scripts

```json
 ...
  "scripts": {
   ...
    "script:generateDidWeb": "dotenv -e .env npx ts-node ./scripts/generateDidWeb.ts",
    "script:deployTokenRegistry": "dotenv -e .env npx ts-node ./scripts/deployTokenRegistry.ts"
  }
```

#### 7.5 Run the scripts

```bash
npm run script:generateDidWeb
npm run script:deployTokenRegistry
```

After the execution, the `DID_KEY_PAIRS` and `TOKEN_REGISTRY_ADDRESS` variables will be stored in the **.env** file and the `did.json` file will be created.

### 8. Update the express app to serve the did.json file

```ts
import fs from "fs";
import path from "path";

...

app.get("/.well-known/did.json", (req: Request, res: Response, next: NextFunction) => {
  try {
    const didJsonPath = path.join(__dirname, "../did.json");
    const didJson = fs.readFileSync(didJsonPath, "utf-8");
    res.json(JSON.parse(didJson));
  } catch (error) {
    console.error(error);
    next(error);
  }
});
```

#### 8.1 Serve the did:web with ngrok

:::important
This step is optional, and is only required if you would like to test and validate the issued document on the web.
It shall only be used for testing purposes.
:::

You can use ngrok or any other service to expose your local server to the internet. In this example, we will use ngrok.

- Create an account on [ngrok.com](https://ngrok.com/), retrieve your authtoken and add it to the.env file under the NGROK_AUTHTOKEN variable.
- Create a static domain on ngrok.com and add it to the.env file under the DOMAIN variable. For more information refer to the [ngrok documentation](https://ngrok.com/blog-post/free-static-domains-ngrok-users).

<details>

<summary>Update src/index.ts with the following code, at the end of the file:</summary>

```ts
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Insert new code from here onwards
(async function () {
  if (process.env.NGROK_AUTHTOKEN) {
    ngrok
      .connect({ addr: port, authtoken_from_env: true, hostname: process.env.DOMAIN })
      .then((listener) => console.log(`[ngrok]: Ingress established at: ${listener.url()}`));
  }
})();
```

</details>

\*If you have already generated the did:web previously, remember to regenerate it, by running the command again

```bash
npm run script:generateDidWeb
```

#### 8.2 Run the app and test the did:web

```bash
npm run dev
```

```bash
curl --location 'localhost:3000/.well-known/did.json'

output:
{"id":"did:web:massive-steadily-crane.ngrok-free.app","verificationMethod":[{"type":"Bls12381G2Key2020","id":"did:web:massive-steadily-crane.ngrok-free.app#keys-1","controller":"did:web:massive-steadily-crane.ngrok-free.app","publicKeyBase58":"oCBKQMT7T7PFje1KaApEHYwe9ofrmsdyBMqmMgBJxVRiqNjuGChd1HoZzakrJGZh1x6uFRXRJB8PL2U8aStKCtnH2iLf5ZAC6rRSbj9DiW7aK7Ru3v7LRMCjdcteE7UTj8R"}],"@context":["https://www.w3.org/ns/did/v1","https://w3id.org/security/suites/bls12381-2020/v1"],"authentication":["did:web:massive-steadily-crane.ngrok-free.app#keys-1"],"assertionMethod":["did:web:massive-steadily-crane.ngrok-free.app#keys-1"],"capabilityInvocation":["did:web:massive-steadily-crane.ngrok-free.app#keys-1"],"capabilityDelegation":["did:web:massive-steadily-crane.ngrok-free.app#keys-1"]}
```

If you have setup ngrok, you can now test the did:web using the universal resolver.
Visit [https://dev.uniresolver.io/](https://dev.uniresolver.io/) and enter the did:web in the input field. `did:web:<your-domain>`.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
  <img src='/docs/tutorial/creator/uniresolver.png' />
</figure>

### 9. Update the express app to allow the creation of transferable documents

In this step, we will add the route to allow the creation of transferable documents. For documents with attachments, you will need to increase the limit of the request body.

<details>

<summary>Update src/index.ts with the following code:</summary>

```ts
import { CHAIN_ID, encrypt, getTokenId, signW3C, SUPPORTED_CHAINS } from "@trustvc/trustvc";
import { TradeTrustToken__factory } from "@trustvc/trustvc/token-registry-v5/contracts";
import { CredentialSubjects } from "@trustvc/trustvc/w3c/vc";
import { ethers, Wallet } from "ethers";
...
// Add middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));
// CORS allow all
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
...
const SUPPORTED_DOCUMENT: {
  [key: string]: string;
} = {
  BILL_OF_LADING: "https://schemata.openattestation.com/io/tradetrust/bill-of-lading/1.0/bill-of-lading-context.json",
  // "INOVICE": "https://schemata.openattestation.com/io/tradetrust/invoice/1.0/invoice-context.json",
  // "CERTIFIATE_OF_ORIGIN": "https://schemata.openattestation.com/io/tradetrust/certificate-of-origin/1.0/certificate-of-origin-context.json"
};

app.post("/create/:documentId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { documentId } = req.params;
    documentId = documentId?.toUpperCase() || "";

    // Validate documentId
    if (!SUPPORTED_DOCUMENT[documentId]) {
      throw new Error("Document not supported");
    }

    const { credentialSubject, owner, holder, remarks } = req.body as {
      credentialSubject: CredentialSubjects;
      owner: string;
      holder: string;
      remarks: string;
    };

    if (!process.env.WALLET_PRIVATE_KEY) {
      throw new Error("Wallet private key not found in environment variables");
    }

    if (!process.env.DID_KEY_PAIRS) {
      throw new Error("DID key pairs not found in environment variables");
    }

    if (!process.env.TOKEN_REGISTRY_ADDRESS) {
      throw new Error("Token registry address not found in environment variables");
    }

    // Get environment variables
    const SYSTEM_TOKEN_REGISTRY_ADDRESS = process.env.TOKEN_REGISTRY_ADDRESS;
    const CHAINID: CHAIN_ID = (process.env.NET as CHAIN_ID) ?? CHAIN_ID.amoy;
    const CHAININFO = SUPPORTED_CHAINS[CHAINID];
    // Remove escaped characters before parsing
    const cleanedJsonString = process.env.DID_KEY_PAIRS.replace(/\\(?=["])/g, "");
    const DID_KEY_PAIRS = JSON.parse(cleanedJsonString);

    // Prepare the document
    const issuanceDate = new Date();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 3);
    const document = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/bbs/v1",
        "https://trustvc.io/context/transferable-records-context.json",
        "https://trustvc.io/context/render-method-context.json",
        "https://trustvc.io/context/attachments-context.json",
        SUPPORTED_DOCUMENT[documentId],
      ],
      type: ["VerifiableCredential"],
      credentialStatus: {
        type: "TransferableRecords",
        tokenNetwork: {
          chain: CHAININFO.currency,
          chainId: CHAINID,
        },
        tokenRegistry: SYSTEM_TOKEN_REGISTRY_ADDRESS,
      },
      renderMethod: [
        {
          id: "https://generic-templates.tradetrust.io",
          type: "EMBEDDED_RENDERER",
          templateName: documentId,
        },
      ],
      credentialSubject,
      issuanceDate: issuanceDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      issuer: DID_KEY_PAIRS.id?.split("#")?.[0],
    };

    // Sign the document
    const { error, signed: signedW3CDocument } = await signW3C(document, DID_KEY_PAIRS);
    if (error) {
      throw new Error(error);
    }

    // Issue the document on chain:
    const tokenId = getTokenId(signedW3CDocument!);
    const unconnectedWallet = new Wallet(process.env.WALLET_PRIVATE_KEY!);
    let provider;
    if (ethers.version.startsWith("6.")) {
      provider = new (ethers as any).JsonRpcProvider(CHAININFO.rpcUrl);
    } else if (ethers.version.includes("/5.")) {
      provider = new (ethers as any).providers.JsonRpcProvider(CHAININFO.rpcUrl);
    }
    const wallet = unconnectedWallet.connect(provider);
    const tokenRegistry = TradeTrustToken__factory.connect(SYSTEM_TOKEN_REGISTRY_ADDRESS, wallet);

    // Encrypt remarks
    const encryptedRemarks = (remarks && encrypt(remarks ?? "", signedW3CDocument?.id!)) || "0x";

    // mint the document
    try {
      const mintTx = await tokenRegistry.mint.staticCall(owner, holder, tokenId, encryptedRemarks);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to mint token");
    }
    let tx: ethers.ContractTransactionResponse;
    // query gas station
    if (CHAININFO.gasStation) {
      const gasFees = await CHAININFO.gasStation();
      console.log("gasFees", gasFees);

      tx = await tokenRegistry.mint(owner, holder, tokenId, encryptedRemarks, {
        maxFeePerGas: gasFees!.maxFeePerGas?.toBigInt() ?? 0,
        maxPriorityFeePerGas: gasFees!.maxPriorityFeePerGas?.toBigInt() ?? 0,
      });
    } else {
      tx = await tokenRegistry.mint(owner, holder, tokenId, encryptedRemarks);
    }

    // Long polling for the transaction to be mined, can be optimized to skip the wait for transaction to be confirmed in 1 block
    const receipt = await tx.wait();

    return res.json({
      signedW3CDocument: signedW3CDocument,
      txHash: tx.hash,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error({ 'error:': err, 'req.url': req.url });
  res.status(500).json({
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    }
  });
});
```

</details>

#### 9.1 Run the app and test the creation of transferable documents

```bash
npm run dev
```

```bash
curl --location 'localhost:3000/create/bill_of_lading' \
--header 'Content-Type: application/json' \
--data '{"credentialSubject":{"shipper":{"address":{}},"consignee":{},"notifyParty":{},"blNumber":"20250107","scac":"20250107"},"owner":"0xCA93690Bb57EEaB273c796a9309246BC0FB93649","holder":"0xCA93690Bb57EEaB273c796a9309246BC0FB93649"}'

output:
{"signedW3CDocument":{"@context":["https://www.w3.org/2018/credentials/v1","https://w3id.org/security/bbs/v1","https://trustvc.io/context/transferable-records-context.json","https://trustvc.io/context/render-method-context.json","https://trustvc.io/context/attachments-context.json","https://schemata.openattestation.com/io/tradetrust/bill-of-lading/1.0/bill-of-lading-context.json"],"type":["VerifiableCredential"],"credentialStatus":{"type":"TransferableRecords","tokenNetwork":{"chain":"FREE","chainId":"20180427"},"tokenRegistry":"0xaD26f724287bCfDCE2740736F9235D2AB4281161","tokenId":"b8e283a18c92f387984e728a58753c4dbacd314d4ff98ad42328991a37ed88f4"},"renderMethod":[{"id":"https://generic-templates.tradetrust.io","type":"EMBEDDED_RENDERER","templateName":"BILL_OF_LADING"}],"credentialSubject":{"shipper":{"address":{}},"consignee":{},"notifyParty":{},"blNumber":"20250107","scac":"20250107"},"issuanceDate":"2025-02-06T07:55:44.957Z","expirationDate":"2025-05-06T07:55:44.957Z","issuer":"did:web:massive-steadily-crane.ngrok-free.app","id":"urn:bnid:_:0194da41-fbc0-777f-85eb-102d0874e309","proof":{"type":"BbsBlsSignature2020","created":"2025-02-06T07:55:47Z","proofPurpose":"assertionMethod","proofValue":"o+6dCbyPjNgOu/fjU4wd8pZVGHGvVAke35ZEBejOYqvuMd+9F2xM9706NbPNZQhmXj+Fu9e9Ge7znjjx24B6KUTa3hMFhBxCojvjiy8A2G4bml2DsdoBha7oRpuLTKeNCRevNDeYub63TF2XkMdX7w==","verificationMethod":"did:web:massive-steadily-crane.ngrok-free.app#keys-1"}},"txHash":"0xfe0467e5c2ec4d9e7e42a3116612b3fe1ed617be0c7ecfdc170185a8b0c42847"}
```

## Conclusion

In this tutorial, we have learned how to create a did:web and a token registry contract. We have also learned how to create a transferable document using the token registry contract.
You can reference the code in this [creator-tutorial](/) repository.

## Optional: Post validation using tradetrust.io

:::note
You might face issue with ngrok on browswers. A workaround can be found [here](https://stackoverflow.com/questions/73017353/how-to-bypass-ngrok-browser-warning#answer-78128230).
:::

- Copy the output value from step 9.1 and save it as a .tt file, e.g. `sample.tt`
- Visit [testnet](http://v5-token-registry.dev.tradetrust.io/) / [mainnet](https://v5-token-registry.tradetrust.io/) and upload the file.
- You will be able to view the document.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
  <img src='/docs/tutorial/creator/demo-verifier.png' />
</figure>
