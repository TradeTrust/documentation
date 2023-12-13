import React from "react";
import { FiatLabel } from "../FiatLabel";
import { useFetchGasPrice } from "../hooks";
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
      name: "Token Registry Deployment (one time set-up)",
      gas: 301065,
      deploymentType: ["DNS"],
    },
    {
      name: "Issuance of Document",
      gas: 250509,
      deploymentType: ["DNS"],
    },
    {
      name: "Transfer Ownership",
      gas: 61333,
      deploymentType: ["DNS"],
    },
    {
      name: "Transfer Holdership",
      gas: 47282,
      deploymentType: ["DNS"],
    },
    {
      name: "Nominate Ownership",
      gas: 47320,
      deploymentType: ["DNS"],
    },
    {
      name: "Endorse Ownership",
      gas: 52057,
      deploymentType: ["DNS"],
    },
    {
      name: "Surrender Document",
      gas: 84586,
      deploymentType: ["DNS"],
    },
    {
      name: "Restore Document",
      gas: 92043,
      deploymentType: ["DNS"],
    },
    {
      name: "Burn Document",
      gas: 94795,
      deploymentType: ["DNS"],
    },
  ],
};

export const PriceTable = (props) => {
  const { price, gwei } = useFetchGasPrice("ethereum", 30000);
  const { price: maticPrice, gwei: maticGwei } = useFetchGasPrice("polygon", 30000);
  const priceFactor = gwei * 0.000000001 * price;
  const maticPriceFactor = maticGwei * 0.000000001 * maticPrice;
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
        <DeploymentTypeLabel deploymentType={record.deploymentType} remarks={record.remarks} />
      </td>
    </tr>
  ));
  const tableHeaderStyle = { textAlign: "left" as const };
  return (
    <div>
      <p>
        Estimations based on the current gas average at <BoxTag>{Math.ceil(gwei)} gwei (ETH)</BoxTag>, ETH price at USD{" "}
        <BoxTag>
          <FiatLabel>{price}</FiatLabel>
        </BoxTag>{" "}
        for <strong>Ethereum</strong> and <BoxTag>{Math.ceil(maticGwei)} gwei (MATIC)</BoxTag>, MATIC price at USD{" "}
        <BoxTag>
          <FiatLabel>{maticPrice}</FiatLabel>
        </BoxTag>{" "}
        for <strong>Polygon</strong> as at {currentDtStr}.
      </p>
      <table>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Action</th>
            <th style={tableHeaderStyle}>Estimated Gas</th>
            <th style={tableHeaderStyle}>Est. Fiat (USD) on Ethereum</th>
            <th style={tableHeaderStyle}>Est. Fiat (USD) on Polygon</th>
            <th style={tableHeaderStyle}>Issuer's Identity Method</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
