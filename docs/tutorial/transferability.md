---
id: transferability
title: Transferability
sidebar_label: Transferability
---

This guide walks you through setting up a simple React project using TypeScript and Vite, and integrating the TrustVC library to visualize the endorsement chain and enable transactions to transfer, reject, or return a document. This tutorial focuses on transferable credentials.

## Source code and demo file

The source code for this project is also available on GitHub at [TradeTrust/transferability-tutorial](https://github.com/TradeTrust/transferability-tutorial). You can explore the code, contribute, or make any modifications.

To test the process, you can use the demo file available at [this link](https://github.com/TradeTrust/transferability-tutorial/blob/main/demo/amoy.tt). You are free to modify this file or upload your own document to see how the transferability process works.

You can continue building from the existing Verifier setup by adding another page or integrating it within the same page. Install `ethers` and [skip to step 6](#6-add-a-basic-project-structure). Alternatively, you can start fresh with a new React project.

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn
- A code editor, e.g., Visual Studio Code

## Setting Up the React Project

### 1. Create a new project directory

```bash
mkdir transferability-project
cd transferability-project
```

### 2. Initialize the project

```bash
npm init -y
```

This creates a `package.json` file in your project directory.

### 3. Install required dependencies

```bash
npm install react react-dom vite-plugin-node-polyfills @trustvc/trustvc ethers
npm install --save-dev typescript @vitejs/plugin-react @types/react @types/react-dom
```

### 4. Set up TypeScript configuration

Initialize TypeScript with the following command:

```bash
npx tsc --init
```

Update the `tsconfig.json` file as needed. For a basic setup, ensure the following options are included:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react",
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 5. Set up Vite (build tool):

Create a `vite.config.ts` file in the root directory and add the following content:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), nodePolyfills()],
});
```

### 6. Add a basic project structure:

Create the following files and folders:

```bash
├── src
│   ├── app.tsx
│   ├── assetManagement.tsx
│   ├── endorsementChain.tsx
│   └── main.tsx
└── index.html
```

Add and update the `.env` file with your Infura API key:

```
VITE_INFURA_ID=YOUR_INFURA_ID
```

You can update the chain you want to test by updating the RPC URL in `app.tsx`.

Add the following content to `app.tsx`:

```tsx
import { encrypt, fetchEndorsementChain, getTitleEscrowAddress, v5Contracts } from "@trustvc/trustvc";
import { ethers, Signer } from "ethers";
import React, { useState } from "react";
import AssetManagement from "./assetManagement";
import EndorsementChain from "./endorsementChain";

const App: React.FC = () => {
  const rpc = `https://polygon-amoy.infura.io/v3/${import.meta.env.VITE_INFURA_ID}`;
  const [hasAttemptedUpload, setHasAttemptedUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [account, setAccount] = useState<string>(""); //connected metamask account

  const [signer, setSigner] = useState<Signer | null>(null); // Signer created from provider to sign the action transaction
  const [newHolder, setNewHolder] = useState<string>(""); // New entered value in the input holder field
  const [newBeneficiary, setNewBeneficiary] = useState<string>(""); // New entered value in the input beneficiary field
  const [titleEscrowAddress, setTitleEscrowAddress] = useState<string>(""); // title escrow address retrieved from the document
  const [holder, setHolder] = useState<string>(""); // holder address retrieved from the document's titleEscrow contract
  const [prevHolder, setPrevHolder] = useState<string>(""); // previous holder address retrieved from the document's titleEscrow contract
  const [beneficiary, setBeneficiary] = useState<string>(""); // beneficiary address retrieved from the document's titleEscrow contract
  const [prevBeneficiary, setPrevBeneficiary] = useState<string>(""); // previous beneficiary address retrieved from the document's titleEscrow contract
  const [endorsementChain, setEndorsementChain] = useState<Array<any>>([]); // endorsement chain retrieved from the document's titleEscrow contract
  const [remarks, setRemarks] = useState<string>(""); // Remarks entered in the input field while making an action
  const [encryptionId, setEncryptionId] = useState<string>(""); // used to encrypt the remarks
  const [nominee, setNominee] = useState<string>(""); // nominee address retrieved from the document's titleEscrow contract
  const connectWallet = async () => {
    const { ethereum, web3 } = window as any;
    if (ethereum) {
      try {
        const injectedWeb3 = ethereum || (web3 && web3.currentProvider);
        let newProvider;
        if (ethers.version.startsWith("6.")) {
          newProvider = new (ethers as any).BrowserProvider(injectedWeb3, "any");
        } else {
          newProvider = new (ethers as any).providers.Web3Provider(injectedWeb3, "any");
        }
        await ethereum.request({ method: "eth_requestAccounts" });
        const _signer = await newProvider.getSigner();
        setSigner(_signer);
        const address = await _signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setHasAttemptedUpload(true);
    setIsLoading(true);

    const file = event.dataTransfer.files[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      const fileContent = await file.text();
      const vc = JSON.parse(fileContent);
      const JsonRpcProvider = ethers.version.startsWith("6.")
        ? (ethers as any).JsonRpcProvider
        : (ethers as any).providers.JsonRpcProvider;
      const _provider = new JsonRpcProvider(rpc);
      if (!_provider) return;
      const titleEscrowAddress = await getTitleEscrowAddress(
        vc.credentialStatus.tokenRegistry,
        "0x" + vc.credentialStatus.tokenId,
        _provider,
      );
      const contract = new ethers.Contract(titleEscrowAddress, v5Contracts.TitleEscrow__factory.abi, _provider);

      setHolder(await contract.holder());
      setBeneficiary(await contract.beneficiary());
      setPrevHolder(await contract.prevHolder());
      setPrevBeneficiary(await contract.prevBeneficiary());
      setTitleEscrowAddress(titleEscrowAddress);
      setEncryptionId(vc.id);
      setNominee(await contract.nominee());

      //fetch endorsement chain
      const _endorsementChain = await fetchEndorsementChain(
        vc.credentialStatus.tokenRegistry,
        "0x" + vc.credentialStatus.tokenId,
        _provider as any,
        vc?.id,
      );
      console.log("Endorsement Chain", _endorsementChain);
      setEndorsementChain(_endorsementChain as any);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleAction(action: string) {
    // Request access to MetaMask
    if (!signer) {
      return;
    }

    // Connect to the contract
    const contract = new ethers.Contract(titleEscrowAddress, v5Contracts.TitleEscrow__factory.abi, signer);

    const encryptedRemark = "0x" + encrypt(remarks, encryptionId);
    console.log("encrypted remark", encryptedRemark);

    const isAddress = ethers.version.startsWith("6.") ? (ethers as any).isAddress : (ethers as any).utils.isAddress;
    let params: string[] = [];
    if (action === "transferHolder") {
      if (!isAddress(newHolder)) {
        console.error("Invalid Ethereum address:", newHolder);
        return;
      }
      params = [newHolder, encryptedRemark];
    } else if (action === "transferBeneficiary") {
      if (!isAddress(newBeneficiary)) {
        console.error("Invalid Ethereum address:", newBeneficiary);
        return;
      }
      params = [newBeneficiary, encryptedRemark];
    } else if (action === "nominate") {
      if (!isAddress(newBeneficiary)) {
        console.error("Invalid Ethereum address:", newBeneficiary);
        return;
      }
      params = [newBeneficiary, encryptedRemark];
    } else if (action === "transferOwners") {
      if (!isAddress(newBeneficiary) || !isAddress(newHolder)) {
        console.error("Invalid Ethereum address:", newBeneficiary, newHolder);
        return;
      }
      params = [newHolder, newBeneficiary, encryptedRemark];
    } else {
      params = [encryptedRemark];
    }

    try {
      const tx = await contract[action](...params);
      console.log("Transaction sent:", tx.hash);

      // Wait for transaction confirmation
      await tx.wait();
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Error calling transferHolder:", error);
    }
  }
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const actionButtons = [
    {
      btnName: "Transfer Holder",
      action: "transferHolder",
      show: holder === account,
    },
    {
      btnName: "Nominate Beneficiary",
      action: "nominate",
      show: beneficiary === account,
    },
    {
      btnName: "Endorse Beneficiary",
      action: "transferBeneficiary",
      show: holder === account && nominee !== zeroAddress,
    },
    {
      btnName: "Transfer Owners",
      action: "transferOwners",
      show: holder === account && beneficiary === account,
    },
    {
      btnName: "Reject Transfer Holder",
      action: "rejectTransferHolder",
      show: holder === account && prevHolder !== zeroAddress && holder !== beneficiary,
    },
    {
      btnName: "Reject Transfer Beneficiary",
      action: "rejectTransferBeneficiary",
      show: beneficiary === account && prevBeneficiary !== zeroAddress && holder !== beneficiary,
    },
    {
      btnName: "Reject Transfer Owners",
      action: "rejectTransferOwners",
      show:
        holder === beneficiary && holder === account && prevHolder !== zeroAddress && prevBeneficiary !== zeroAddress,
    },
    {
      btnName: "Return to Issuer",
      action: "returnToIssuer",
      show: beneficiary === account && holder === account,
    },
  ];

  return (
    <div>
      <div
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <button onClick={connectWallet}>
          {account ? `Connected: ${account?.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
        </button>
      </div>
      {account && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1>Drop Document</h1>
          <p>Drop a Verifiable Credential file here </p>

          {isLoading && <div className="spinner">Loading Endorsement Chain...</div>}

          {hasAttemptedUpload && !isLoading && !endorsementChain && (
            <p style={{ color: "red" }}>Can not Load Endorsement Chain.</p>
          )}
        </div>
      )}
      <AssetManagement
        titleEscrowAddress={titleEscrowAddress}
        holder={holder}
        beneficiary={beneficiary}
        newHolder={newHolder}
        newBeneficiary={newBeneficiary}
        prevBeneficiary={prevBeneficiary}
        prevHolder={prevHolder}
        nominee={nominee}
        remarks={remarks}
        setNewHolder={setNewHolder}
        setNewBeneficiary={setNewBeneficiary}
        setRemarks={setRemarks}
        handleAction={handleAction}
        actionButtons={actionButtons}
      />

      <EndorsementChain endorsementChain={endorsementChain} />
    </div>
  );
};

export default App;
```

Add the following content to `main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Add the following content to `assentManagement.tsx`:

```tsx
import React, { Dispatch, Key, SetStateAction, useState } from "react";

type AssetManagementProps = {
  titleEscrowAddress: string;
  holder: string;
  beneficiary: string;
  newHolder: string;
  newBeneficiary: string;
  prevBeneficiary: string;
  prevHolder: string;
  nominee: string;
  remarks: string;
  setNewHolder: Dispatch<SetStateAction<string>>;
  setNewBeneficiary: Dispatch<SetStateAction<string>>;
  setRemarks: Dispatch<SetStateAction<string>>;
  handleAction: (action: string) => Promise<void>;
  actionButtons: any[];
};
const AssetManagement: React.FC<AssetManagementProps> = ({
  titleEscrowAddress,
  holder,
  beneficiary,
  newHolder,
  newBeneficiary,
  prevBeneficiary,
  prevHolder,
  nominee,
  remarks,
  setNewHolder,
  setNewBeneficiary,
  setRemarks,
  handleAction,
  actionButtons,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  return (
    <>
      {holder && beneficiary && (
        <div
          style={{
            border: "2px dashed #ccc",
            padding: "10px",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left", fontSize: "15px" }}>
            <p>
              <strong>Title Escrow</strong> : {titleEscrowAddress}
            </p>
            <p>
              <strong>Holder : </strong> {holder}
            </p>
            <p>
              <strong>Beneficiary : </strong> {beneficiary}
            </p>
            <p>
              <strong>Nominee : </strong>
              {nominee}
            </p>
            <p>
              <strong>Previous Beneficiary : </strong> {prevBeneficiary}
            </p>
            <p>
              <strong>Previous Holder : </strong> {prevHolder}
            </p>
            <p style={{ fontSize: "12px", fontWeight: "bold" }}>
              Note* - The previous beneficiary and holder are the addresses from the most recent transfer of the holder,
              beneficiary, or both. Their presence determines whether the reject action is available for this transfer.
            </p>
          </div>
          <div>
            <div
              style={{
                padding: "20px",
                width: "800px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="New Holder"
                value={newHolder}
                onChange={(e) => setNewHolder(e.target.value)}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "5px",
                  marginRight: "10px",
                }}
              />
              <input
                type="text"
                placeholder="New Beneficiary"
                value={newBeneficiary}
                onChange={(e) => setNewBeneficiary(e.target.value)}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "5px",
                  marginRight: "10px",
                }}
              />
              <input
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "5px",
                }}
              />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "right",
                alignItems: "right",
                paddingRight: "20px",
              }}
            >
              <button style={{ padding: "10px", width: "30%" }} onClick={() => setDropdownVisible(!dropdownVisible)}>
                Action
              </button>
              {dropdownVisible && (
                <div
                  style={{
                    position: "absolute",
                    padding: "2px",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    width: "30%",
                    marginTop: "40px",
                  }}
                >
                  {actionButtons.map((actionButton: any, index: Key) => {
                    return (
                      actionButton.show && (
                        <button
                          key={index}
                          onClick={() => handleAction(actionButton.action)}
                          style={{
                            width: "100%",
                            padding: "5px",
                          }}
                        >
                          {actionButton.btnName}
                        </button>
                      )
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetManagement;
```

Add the following content to `endorsementChain.tsx`:

```tsx
import React from "react";
interface EndorsementChainProps {
  endorsementChain: any[]; // add the endorsementChain prop
}

const EndorsementChain: React.FC<EndorsementChainProps> = ({ endorsementChain }) => {
  const actionMessage = {
    INITIAL: "Document has been issued",
    NOMINATE: "Nomination of new beneficiary",
    REJECT_TRANSFER_BENEFICIARY: "Rejection of beneficiary",
    REJECT_TRANSFER_HOLDER: "Rejection of holdership",
    REJECT_TRANSFER_OWNERS: "Rejection of owners",
    RETURN_TO_ISSUER_ACCEPTED: "Return to issuer accepted",
    RETURN_TO_ISSUER_REJECTED: "Return to issuer rejected",
    RETURNED_TO_ISSUER: "Returned to issuer",
    SURRENDER_ACCEPTED: "Return to issuer accepted",
    SURRENDER_REJECTED: "Return to issuer rejected",
    SURRENDERED: "Returned to issuer",
    TRANSFER_BENEFICIARY: "Transfer beneficiary",
    TRANSFER_HOLDER: "Transfer holdership",
    TRANSFER_OWNERS: "Trnasfer beneficiary and holdership",
  };
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    endorsementChain.length > 0 && (
      <div
        style={{
          overflowX: "auto",
          padding: "26px",
          border: "2px dashed #ccc",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <table style={{ width: "85%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Action/Date</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Owner</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Holder</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {endorsementChain.map(
              (action: {
                type: keyof typeof actionMessage;
                timestamp: number;
                owner: string;
                holder: string;
                remark: string;
              }) => (
                <tr style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: "8px" }}>
                    {actionMessage[action.type]}
                    <br />
                    <span style={{ color: "grey", fontSize: "12px" }}>{formatDate(action.timestamp)}</span>
                  </td>
                  <td style={{ padding: "8px" }}>{action.owner}</td>
                  <td style={{ padding: "8px" }}>{action.holder}</td>
                  <td style={{ padding: "8px" }}>{action.remark}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    )
  );
};
export default EndorsementChain;
```

Create an `index.html` in the root directory:

```html
<!doctype html>
<html>
  <head>
    <title>Transferability</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 7. Run the development server

Open your `package.json` file and add `"dev": "vite"` under the scripts section, like this:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "vite"
}
```

Then run the following command to see the app running in the browser.

```bash
npm run dev
```

The transferability app is now ready.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/initial.png' />
</figure>

## Steps to Perform Endorsement Chain Actions

### 1. Connect to MetaMask

- Click on the "Connect MetaMask" button.
- Select your preferred wallet and authorize the connection.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/connect-metamask.png' />
</figure>

### 2. Load the Endorsement Chain

- Drag and drop your file into the designated area.
- The endorsement chain will be processed and displayed.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/drop-document.png' />
</figure>

### 3. View the Endorsement Chains

- Once the file is loaded, the asset management box and the endorsement chain details will be shown.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/load-endorsement-chain.png' />
</figure>

- You will see addresses in the asset management box. Nominee, Previous Holder, and Previous Beneficiary are currently zero addresses. These will have relevant addresses when there is a nomination or transfer.

### 4. Transfer Holder

- Enter the new holder's address and remarks in the provided fields.
- Click on "Transfer Holder" to initiate the transfer.

<figure style={{ maxWidth: "600px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/transfer-holder.png' />
</figure>

### 5. View Updated Endorsement Chain

- After the transfer, check the updated endorsement chain to verify the changes.

 <figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/after-holder-transfer.png' />
</figure>

### 6. View Available Actions for the Connected Holder in MetaMask

- The new holder's available actions will be displayed.

<figure style={{ maxWidth: "400px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/available-actions-holder.png' />
</figure>

### 7. View Available Actions for the Connected Beneficiary in MetaMask

- The beneficiary’s available actions will also be shown.

<figure style={{ maxWidth: "400px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/available-actions-beneficiary.png' />
</figure>

### 8. Reject Transfer Holder as the New Holder

- Disconnect from the current wallet.
- Connect as the new holder via MetaMask.
- Select "Reject Transfer Holder" action and confirm.

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/reject-transfer.png' />
</figure>

### 9. View Updated Endorsement Chain

- The endorsement chain will now reflect the rejected transfer.
- After rejection, holdership reverts to the Previous Holder

<figure style={{ maxWidth: "800px", margin: "0 auto" }}>
<img src='/docs/tutorial/transferability/after-reject-transfer.png' />
</figure>
