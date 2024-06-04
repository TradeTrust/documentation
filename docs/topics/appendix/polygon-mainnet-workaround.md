---
id: polygon-mainnet-workaround
title: Workaround to ‘transaction underpriced’ error on Polygon Mainnet
sidebar_label: Workaround to ‘transaction underpriced’ error on Polygon Mainnet
---

The "transaction underpriced" error occurs on the Polygon Mainnet when using ethers.js v5, typically when the specified gas price for a transaction is too low.

To resolve this issue, we can use a gas station to estimate the gas price.

### Using of gas station to estimate the gas price

```ts
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

export const fetchPolygonGasStationSuggestedPrice = async (): Promise<Overrides> => {
  const apiUrl = "https://gasstation.polygon.technology/v2";

  const suggestedPriceResponse = await fetch(apiUrl);
  const suggestedPriceObject = await suggestedPriceResponse.json();
  return {
    maxPriorityFeePerGas: safeParseUnits(suggestedPriceObject.standard.maxPriorityFee, 9),
    maxFeePerGas: safeParseUnits(suggestedPriceObject.standard.maxFee, 9),
  };
};

const safeParseUnits = (_value: number | string, decimals: number): BigNumber => {
  const value = String(_value);
  if (!value.match(/^[0-9.]+$/)) {
    throw new Error(`invalid gwei value: ${_value}`);
  }

  // Break into [ whole, fraction ]
  const comps = value.split(".");
  if (comps.length === 1) {
    comps.push("");
  }

  // More than 1 decimal point or too many fractional positions
  if (comps.length !== 2) {
    throw new Error(`invalid gwei value: ${_value}`);
  }

  // Pad the fraction to 9 decimal places
  while (comps[1].length < decimals) {
    comps[1] += "0";
  }

  // Too many decimals and some non-zero ending, take the ceiling
  if (comps[1].length > 9 && !comps[1].substring(9).match(/^0+$/)) {
    comps[1] = BigNumber.from(comps[1].substring(0, 9)).add(BigNumber.from(1)).toString();
  }

  return parseUnits(`${comps[0]}.${comps[1]}`, decimals);
};
```

### Example on how we use the gas price when we mint a transferable record

```ts
import { TradeTrustToken__factory } from "@tradetrust-tt/tradetrust-core";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

const tokenRegistryAddress = "<TOKEN_REGISTRY_CONTRACT_ADDRESS>";
const owner = "<OWNER_WALLET_ADDRESS>";
const holder = "<HOLDER_WALLET_ADDRESS>";
const tokenId = "<MERKLE_ROOT>";
const signer = "<SIGNER>";

export const issueToTokenRegistry = async (): Promise<TransactionReceipt> => {
  const connectedRegistry = TradeTrustToken__factory.connect(tokenRegistryAddress, signer);
  const gasFees = await fetchPolygonGasStationSuggestedPrice(); // using the function from the above code snippet

  // Previously, we are using the default gas price
  // const transaction = await connectedRegistry.mint(owner, holder, tokenId);

  // Now, we will need to override with the new gas price when interacting with the chain
  const transaction = await connectedRegistry.mint(owner, holder, tokenId, { ...gasFees });

  return transaction.wait();
};
```
