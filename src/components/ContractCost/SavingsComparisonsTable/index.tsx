import React from "react";
import { FiatLabel } from "../FiatLabel";
import { useFetchGasPrice } from "../hooks";
import { BoxTag } from "../BoxTag";
import { Triangle } from "../Icon";

const contractGasData = {
  transferable: [
    {
      name: "Token Deployment (Quick Start)",
      gas: {
        v3: 3714024,
        v4: 301065,
      },
      remarks: (
        <>
          With{" "}
          <a
            href="https://github.com/Open-Attestation/token-registry/tree/master#quick-start"
            target="_blank"
            rel="noopener noreferrer"
          >
            Quick Start
          </a>{" "}
          deployment in v4
        </>
      ),
    },
    {
      name: "Issuance of Document",
      gas: {
        v3: 239523,
        v4: 250509,
      },
    },
    {
      name: "Endorse Beneficiary",
      gas: {
        v3: 324688,
        v4: 52057,
      },
    },
    {
      name: "Transfer Holdership",
      gas: {
        v3: 43634,
        v4: 47282,
      },
    },
    {
      name: "Transfer Ownership",
      gas: {
        v3: 324688,
        v4: 61333,
      },
      remarks: "Both beneficiary & holder",
    },
    {
      name: "Nominate Ownership",
      gas: {
        v3: 83225,
        v4: 47320,
      },
    },
    {
      name: "Return Document to Issuer",
      gas: {
        v3: 93435,
        v4: 84586,
      },
    },
    {
      name: "Restore Document",
      gas: {
        v3: 230980,
        v4: 92043,
      },
    },
    {
      name: "Burn Document",
      gas: {
        v3: 66732,
        v4: 94795,
      },
    },
    {
      name: "Token Deployment (Standalone)",
      gas: {
        v3: 3714024,
        v4: 2251821,
      },
      remarks: (
        <>
          For
          <a
            href="https://github.com/Open-Attestation/token-registry/tree/master#stand-alone-contract"
            target="_blank"
            rel="noopener noreferrer"
          >
            standalone
          </a>
          deployment in v4 (optional)
        </>
      ),
    },
    {
      name: "Title Escrow Factory (Optional)",
      gas: {
        v3: 0,
        v4: 1459818,
      },
      remarks: "New in V4",
    },
  ],
};

export const PriceTable = ({ type, chain, priceFormatOptions }) => {
  const { price, gwei } = useFetchGasPrice(chain, 15000);
  const priceFactor = gwei * 0.000000001 * price;
  const priceUnit = chain === "polygon" ? "MATIC" : "ETH";
  const costData = contractGasData[type];
  const currentDtStr = new Date().toLocaleString("en-SG", { hour12: true, timeZoneName: "short" });
  const nf = new Intl.NumberFormat();
  const rows = costData.map((record, idx) => {
    const v3Gas = record.gas.v3;
    const v4Gas = record.gas.v4;
    const v3Cost = v3Gas * priceFactor;
    const v4Cost = v4Gas * priceFactor;
    const savings = v4Cost - v3Cost;
    return (
      <tr key={idx}>
        <td>{record.name}</td>
        <td> {v3Gas ? nf.format(v3Gas) : "N.A."}</td>
        <td>
          {priceFactor === 0 ? <em>Calculating...</em> : <FiatLabel {...priceFormatOptions}>{v3Cost || "0"}</FiatLabel>}
        </td>
        <td> {v4Gas ? nf.format(v4Gas) : "N.A."}</td>
        <td>{priceFactor === 0 ? <em>Calculating...</em> : <FiatLabel {...priceFormatOptions}>{v4Cost}</FiatLabel>}</td>
        <td align="center">
          {!v3Gas ? "–" : <FiatLabel {...priceFormatOptions}>{savings}</FiatLabel>}
          {!v3Gas ? null : savings <= 0 ? (
            <Triangle color="#22c55e" style={{ marginLeft: "8px" }} />
          ) : (
            <Triangle color="#f43f5e" style={{ marginLeft: "8px", transform: "rotate(180deg)" }} />
          )}
        </td>
        <td>{record.remarks || "–"}</td>
      </tr>
    );
  });
  return (
    <div>
      <p>
        Estimations based on the current gas <em>average</em> at <BoxTag>{Math.ceil(gwei)} gwei</BoxTag> and {priceUnit}{" "}
        price at USD{" "}
        <BoxTag>
          <FiatLabel>{price}</FiatLabel>
        </BoxTag>{" "}
        as at {currentDtStr}.
      </p>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Action</th>
            <th colSpan={2}>V3.x</th>
            <th colSpan={2}>V4</th>
            <th rowSpan={2}>Fiat Difference (USD)</th>
            <th rowSpan={2}>Remarks</th>
          </tr>
          <tr>
            <th>Est. Gas</th>
            <th>Fiat (USD)</th>
            <th>Est. Gas</th>
            <th>Fiat (USD)</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
