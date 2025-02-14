---
id: fetch-endorsement-chain
title: Fetch Endorsement Chain
sidebar_label: Fetch Endorsement Chain
---

### Description:

This function retrieves the endorsement chain of a token by fetching its transfer history from a **Title Escrow contract**. It supports two versions of the Title Escrow contract (V4 and V5) and processes their respective transfer events. If the contract version is V5, it also decrypts any remarks associated with the transfer events.

### Parameters:

| Parameter        | Type     | Description                                                 |
| ---------------- | -------- | ----------------------------------------------------------- |
| tokenRegistry    | string   | The address of the Token Registry contract.                 |
| tokenId          | string   | The unique identifier of the token.                         |
| provider         | Provider | A blockchain provider to interact with the smart contracts. |
| keyId (optional) | string   | The key used for decrypting remarks in V5 contracts.        |

### Returns:

A Promise `<EndorsementChain>` that resolves to an array of transfer events representing the endorsement chain of the token.

### Functionality Overview:

#### 1) Input Validation:

- The function checks if tokenRegistry, tokenId, and provider are provided.
- If any required parameter is missing, it throws an error.

#### 2) Determine Token Registry Version:

- The function checks whether the Token Registry is V4 or V5 using **isTitleEscrowVersion()**.
- If neither version is detected, it throws an error, as only V4 and V5 are supported.

#### 3) Retrieve Transfer Events:

- It fetches the address of the Title Escrow contract for the given token using **getTitleEscrowAddress()**.
- Depending on the version:
  - For V4:
    - It fetches token transfer logs from the registry.
    - It fetches escrow transfer logs from the V4 contract.
    - The logs are merged using **mergeTransfersV4()**.
  - For V5:
    - It fetches escrow transfer logs from the V5 contract.
    - The logs are merged using **mergeTransfersV5()**.

#### 4) Build the Endorsement Chain:

- The fetched transfer events are processed into an endorsement chain using **getEndorsementChain()**.
- If the contract is V5, any remarks attached to the events are decrypted using the provided **keyId** (keyId and tokenId are not same).

#### 5) Return the Processed Endorsement Chain:

- The function returns the endorsement chain, with decrypted remarks if applicable.

### Example Usage

```typescript
import { fetchEndorsementChain } from "@trustvc/trustvc";

const endorsementChain = await fetchEndorsementChain(
  "0x123456...", // Token Registry Address
  "0x12345", // Token ID
  provider, // Web3 Provider
  "my-decryption-key", // Optional decryption key for remarks VC ID
);
console.log(endorsementChain);
```

Considering a case where you have a VC -

```typescript
const file = event.dataTransfer.files[0];
// considering the VC is the file dropped in the drop box
try {
  const fileContent = await file.text();
  const vc = JSON.parse(fileContent);
  const _provider = new ethers.providers.JsonRpcProvider(rpc);
  //fetch endorsement chain
  const _endorsementChain = await fetchEndorsementChain(
    vc.credentialStatus.tokenRegistry,
    "0x" + vc.credentialStatus.tokenId,
    _provider as any,
    vc.id,
  );
  console.log("Endorsement Chain", _endorsementChain);
} catch (error) {
  console.error(error);
}
```

### Error Handling:

- Throws "Missing required dependencies" if any required parameter is missing.
- Throws "Only Token Registry V4/V5 is supported" if the token registry version is not recognized.

This function ensures compatibility with both V4 and V5 registries while handling encrypted remarks in V5.
