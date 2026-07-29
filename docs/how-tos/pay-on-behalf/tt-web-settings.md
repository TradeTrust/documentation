---
id: tt-web-settings
title: Pay on Behalf on TT-web
sidebar_label: TT-web Settings
---

# Pay on Behalf on TT-web

TT-web (the TradeTrust web application) exposes Pay on Behalf configuration through its **Settings** panel, accessible from the gear icon on the top navigation bar. Settings is organized into tabs; **Pay on Behalf** is the fourth tab, alongside:

| Tab               | Purpose                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| General           | Application-wide preferences.                                                                                         |
| Network           | Blockchain network and RPC configuration.                                                                             |
| Address Resolver  | Configure address resolution for identifying wallet addresses — see [Address Resolver](../advanced/address-resolver). |
| **Pay on Behalf** | Configure and enable sponsored (gas-free) transactions for your users.                                                |

:::info Token Registry v5 only
The Pay on Behalf tab only applies to documents issued from **Token Registry v5 (TR v5)** registries. It has no effect on earlier registry versions.
:::

## What the Pay on Behalf tab does

This tab lets a platform admin turn on Pay on Behalf for their TT-web deployment without writing any code. It's a UI wrapper around the same underlying setup described in [Setup](./setup):

- Point TT-web at your deployed `PlatformPaymaster` address.
- Provide the bundler/paymaster infrastructure credentials (for example, a Pimlico API key) used to submit sponsored transactions.
- Enable or disable Pay on Behalf for the connected registry.

Values entered here should match what you configured on-chain in [Setup](./setup) — the tab does not deploy a `PlatformPaymaster` or whitelist users for you; those steps still happen via the SDK/admin functions described there.

:::info Disclaimer
Pay on Behalf is one possible way to sponsor a user's transaction costs. The TT-web implementation of this tab is built and tested against **Pimlico** as an example bundler/paymaster provider. This is not an endorsement of, or dependency on, Pimlico specifically — any ERC-4337-compatible provider that supports EIP-7702 can be used, as long as it's wired up through the same [Setup](./setup) steps.
:::

## User experience

Once an admin has enabled Pay on Behalf, users of that platform's TT-web instance can check their own eligibility from the same tab:

1. Once the user drops the document to act on, TT-web checks whether the connected wallet address already has EIP-7702 delegation enabled. If it does, a message appears prompting the user to paste the platform's `PlatformPaymaster` address.

   ![Delegation enabled detection](/docs/payOnBehalf/delegationEnabledDetection.png)

2. The user enters the platform's `PlatformPaymaster` address (provided by the issuer) into the input field on the Pay on Behalf tab.
3. TT-web checks the connected wallet against that paymaster's whitelist and reports back whether the wallet is eligible (whitelisted) for sponsored transactions.

   ![Paymaster enabled](/docs/payOnBehalf/paymasterEnabled.png)

4. If eligible, supported actions (minting, transferring, etc.) prompt the user's wallet for a **signature** (of the UserOperation) instead of the usual gas-payment transaction confirmation — no ETH is required from the user.

   <img src="/docs/payOnBehalf/metamaskSignatureRequest.png" alt="Metamask signature request" style={{display: 'block', margin: '0 auto', maxWidth: '320px'}} />

5. If not eligible, TT-web surfaces this so the user knows to request access from their platform admin — admins grant eligibility by whitelisting the address via `setUserWhitelist` (see [Setup](./setup)).
6. If delegation was not already enabled in step 1, the one-time EIP-7702 delegation happens transparently as part of the user's first sponsored action.

See [Overview](./overview) for a diagram of the full admin-setup vs. user-experience flow, and [Operations](./operations) for the underlying SDK calls TT-web makes on the user's behalf.
