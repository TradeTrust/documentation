import React from "react";
import { FiatLabel } from "../FiatLabel";
import { useFetchGasPrice, Chain } from "../hooks";
import { DeploymentTypeLabel } from "../DeploymentTypeLabel";
import { BoxTag } from "../BoxTag";

const contractGasData = {
  verifiable: [
    {
      name: "Document Store Deployment (one time set-up)",
      gas: 1106320,
      remarks: "Only applicable to DID if require revocation.",
      deploymentType: ["DNS", "DID"],
    },
    {
      name: "Issuance of Document",
      gas: 47886,
      remarks: "Applicable for batch Issue.",
      deploymentType: ["DNS"],
    },
    {
      name: "Revoke Document",
      gas: 47980,
      deploymentType: ["DNS", "DID"],
    },
  ],
  transferable: [
    {
      name: "Token Registry Deployment[standalone] (one time set-up)",
      gas: 3719718,
      deploymentType: ["DNS"],
    },
    {
      name: "Token Registry Deployment[through TDocDeployer] (one time set-up)",
      gas: 308748,
      deploymentType: ["DNS"],
    },
    {
      name: "Issuance of Document",
      gas: 404835,
      deploymentType: ["DNS"],
    },
    {
      name: "Transfer Ownership",
      gas: 127795,
      deploymentType: ["DNS"],
    },
    {
      name: "Transfer Holdership",
      gas: 137033,
      deploymentType: ["DNS"],
    },
    {
      name: "Nominate Ownership",
      gas: 82530,
      deploymentType: ["DNS"],
    },
    {
      name: "Endorse Ownership",
      gas: 103550,
      deploymentType: ["DNS"],
    },
    {
      name: "Return Document to Issuer",
      gas: 124270,
      deploymentType: ["DNS"],
    },
    {
      name: "Restore Document",
      gas: 123723,
      deploymentType: ["DNS"],
    },
    {
      name: "Burn Document",
      gas: 125194,
      deploymentType: ["DNS"],
    },
    {
      name: "Reject Transfer Owner",
      gas: 81834,
      deploymentType: ["DNS"],
    },
    {
      name: "Reject Transfer Holder",
      gas: 76774,
      deploymentType: ["DNS"],
    },
    {
      name: "Reject Transfer Owner and Holder",
      gas: 91265,
      deploymentType: ["DNS"],
    },
  ],
};

export const PriceTable = (props) => {
  const FETCH_INTERVAL = 30000;
  const { price, gwei } = useFetchGasPrice(Chain.Ethereum, FETCH_INTERVAL);
  console.log("price", price, gwei);
  const { price: maticPrice, gwei: maticGwei } = useFetchGasPrice(Chain.Polygon, FETCH_INTERVAL);
  const { price: xdcPrice, gwei: xdcGwei } = useFetchGasPrice(Chain.XDC, FETCH_INTERVAL);
  const priceFactor = gwei * 0.000000001 * price;
  const maticPriceFactor = maticGwei * 0.000000001 * maticPrice;
  const xdcPriceFactor = xdcGwei * 0.000000001 * xdcPrice;
  const { type, priceFormatOptions } = props;
  const costData = contractGasData[type];
  const currentDtStr = new Date().toLocaleString("en-SG", { hour12: true, timeZoneName: "short" });
  const nf = new Intl.NumberFormat();
  const rows = costData.map((record, idx) => (
    <tr key={idx}>
      <td>{record.name}</td>
      <td>{nf.format(record.gas)}</td>
      <td>{priceFactor === 0 ? <em>Calculating...</em> : <FiatLabel>{record.gas * priceFactor}</FiatLabel>}</td>
      <td>
        {maticPriceFactor === 0 ? (
          <em>Calculating...</em>
        ) : (
          <FiatLabel {...priceFormatOptions}>{record.gas * maticPriceFactor}</FiatLabel>
        )}
      </td>
      <td>
        {xdcPriceFactor === 0 ? (
          <em>Calculating...</em>
        ) : (
          <FiatLabel {...priceFormatOptions}>{record.gas * xdcPriceFactor}</FiatLabel>
        )}
      </td>
      <td>
        <FiatLabel {...priceFormatOptions}>{0}</FiatLabel>
      </td>
      <td>
        <FiatLabel {...priceFormatOptions}>{0}</FiatLabel>
      </td>
    </tr>
  ));
  const tableHeaderStyle = { textAlign: "left" as const };
  return (
    <div>
      <p>
        Estimations are made based on the current ETH price at USD{" "}
        <BoxTag>
          <FiatLabel>{price}</FiatLabel>
        </BoxTag>{" "}
        for <strong>Ethereum</strong>, MATIC price at USD{" "}
        <BoxTag>
          <FiatLabel>{maticPrice}</FiatLabel>
        </BoxTag>{" "}
        for <strong>Polygon</strong>, XDC price at USD{" "}
        <BoxTag>
          <FiatLabel>{xdcPrice}</FiatLabel>
        </BoxTag>{" "}
        for <strong>XDC</strong> as at {currentDtStr}.
      </p>
      <table>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Action</th>
            <th style={tableHeaderStyle}>Estimated Gas</th>
            <th style={tableHeaderStyle}>Est. Fiat (USD) on Ethereum</th>
            <th style={tableHeaderStyle}>Est. Fiat (USD) on Polygon</th>
            <th style={tableHeaderStyle}>Est. Fiat (USD) on XDC</th>
            <th style={tableHeaderStyle}>Est. Fiat (USD) on Stability</th>
            <th style={tableHeaderStyle}>Est. Fiat (USD) on Astron</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
