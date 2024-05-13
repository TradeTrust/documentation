import React, { useEffect, useState } from "react";
import { useRefresh } from "./useRefresh";

export enum Chain {
  Ethereum = "ethereum",
  Polygon = "polygon",
  XDC = "xdc",
}

const gasApi = {
  [Chain.Ethereum]: "https://api.blocknative.com/gasprices/blockprices",
  [Chain.Polygon]: "https://api.blocknative.com/gasprices/blockprices?chainid=137",
  [Chain.XDC]: "https://rpc.xinfin.network/gasPrice",
};

const parseGasRes = (res: any) => {
  const estPrice = res.blockPrices[0].estimatedPrices[0];
  return estPrice.price ? estPrice.price + estPrice.maxPriorityFeePerGas : 0;
};

const priceApi = {
  [Chain.Ethereum]: "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
  [Chain.Polygon]: "https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD",
  [Chain.XDC]: "https://min-api.cryptocompare.com/data/price?fsym=XDC&tsyms=USD",
};

const fetchPrice = async (chain: Chain) => {
  const ethReq = await fetch(priceApi[chain]);
  const ethRes = await ethReq.json();
  return ethRes?.USD;
};

const fetchXDCGasPriceInGwei = async () => {
  const resp = await fetch(gasApi[Chain.XDC], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_gasPrice",
      params: [],
      id: 73,
    }),
  });
  const respData = await resp.json();
  const gasPriceInWei = parseInt(respData.result, 16);
  return gasPriceInWei / 1e9;
};

const fetchGasInGwei = async (chain: Chain) => {
  if (chain === Chain.XDC) {
    return await fetchXDCGasPriceInGwei();
  }
  const gweiReq = await fetch(gasApi[chain]);
  const gweiRes = await gweiReq.json();
  return parseGasRes(gweiRes);
};

const fetchGasCostData = async (chain: Chain) => {
  try {
    const price = await fetchPrice(chain);
    const gwei = await fetchGasInGwei(chain);
    console.log(`Price: ${price}, Gwei: ${gwei} for ${chain}`);
    return { price, gwei };
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
};

export const useFetchGasPrice = (chain: Chain, interval = 0) => {
  const [price, setPrice] = useState(0);
  const [gwei, setGwei] = useState(0);
  const tick = useRefresh(interval);
  let isMounted = true;
  const fetchData = async () => {
    const data = await fetchGasCostData(chain);
    if (!isMounted || !data) return;
    setPrice(data.price);
    setGwei(data.gwei);
  };

  useEffect(() => {
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [tick]);

  return { price, gwei };
};
