import React, { useEffect, useState } from "react";
import { useRefresh } from "./useRefresh";

export enum Chain {
  Ethereum = "ethereum",
  Polygon = "polygon",
  XDC = "xdc",
}

// Public JSON-RPC endpoints (CORS-enabled) used to read the current gas price on-chain.
const rpcApi = {
  [Chain.Ethereum]: "https://ethereum-rpc.publicnode.com",
  [Chain.Polygon]: "https://polygon-bor-rpc.publicnode.com",
  [Chain.XDC]: "https://rpc.xinfin.network",
};

// CoinGecko asset ids. Polygon gas is paid in POL (ex-MATIC) since the 2024 migration.
const coinGeckoIds = {
  [Chain.Ethereum]: "ethereum",
  [Chain.Polygon]: "polygon-ecosystem-token",
  [Chain.XDC]: "xdce-crowd-sale",
};

// All hook instances share one batched CoinGecko request (multiple PriceTables
// mount at once — separate requests per chain trip the free-tier rate limit,
// whose 429 responses carry no CORS headers and surface as CORS errors).
const PRICE_CACHE_TTL = 25000;
const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(coinGeckoIds).join(
  ","
)}&vs_currencies=usd`;
let priceCache: { data: any; fetchedAt: number } | null = null;
let priceInflight: Promise<any> | null = null;

const fetchAllPrices = async () => {
  if (priceCache && Date.now() - priceCache.fetchedAt < PRICE_CACHE_TTL) {
    return priceCache.data;
  }
  if (!priceInflight) {
    priceInflight = fetch(priceUrl)
      .then((req) => {
        if (!req.ok) throw new Error(`CoinGecko responded ${req.status}`);
        return req.json();
      })
      .then((data) => {
        priceCache = { data, fetchedAt: Date.now() };
        return data;
      })
      .finally(() => {
        priceInflight = null;
      });
  }
  return priceInflight;
};

const fetchPrice = async (chain: Chain) => {
  const res = await fetchAllPrices();
  return res?.[coinGeckoIds[chain]]?.usd;
};

const fetchGasPriceInGwei = async (chain: Chain) => {
  const resp = await fetch(rpcApi[chain], {
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

const fetchGasCostData = async (chain: Chain) => {
  try {
    const price = await fetchPrice(chain);
    const gwei = await fetchGasPriceInGwei(chain);
    if (!price || !gwei || Number.isNaN(gwei)) {
      throw new Error(`Incomplete data for ${chain} (price: ${price}, gwei: ${gwei})`);
    }
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
