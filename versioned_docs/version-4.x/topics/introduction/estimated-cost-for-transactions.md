---
id: estimated-cost-for-transactions
title: Estimated cost for transactions
sidebar_label: Estimated cost for transactions
---

import { PriceTable } from "@site/src/components/ContractCost/ContractCostTable";

Here is an estimated breakdown of the gas and costs involved when interacting with the contracts.
You should be aware that the estimated gas required can differ slightly depending on the states of the contract when called. The gas prices and fiat costs are constantly changing and you should check the numbers from a source you trust to get an accurate figure.

:::note
Note that the following estimation is _not_ a comprehensive list of all the costs involved and should be used as a reference only.

The live gas fees and prices on this page are updated every 15s. Data are retrieved from [BlockNative Gas Estimator](https://www.blocknative.com/gas-estimator) and [CryptoCompare](https://www.cryptocompare.com/).
:::

### Verifiable Documents

<PriceTable type="verifiable" priceFormatOptions={{ maximumSignificantDigits: 3, minimumFractionDigits: 2 }} version="v4" />

### Transferable Records

<PriceTable type="transferable" priceFormatOptions={{ maximumSignificantDigits: 3, minimumFractionDigits: 2 }} version="v4" />
