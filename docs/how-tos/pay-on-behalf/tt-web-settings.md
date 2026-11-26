---
id: tt-web-settings
title: Pay on Behalf on TT-web
sidebar_label: Web Setting
---

# Pay on Behalf on TT-web

Pay on Behalf on TT-web (the TradeTrust web application) lives on the **TT Verify page**. The `PlatformPaymaster` input field appears on that page once the connected wallet is confirmed to have EIP-7702 delegation enabled.

:::info Token Registry v5 only
Pay on Behalf only applies to documents issued from **Token Registry v5 (TR v5)** registries. It has no effect on earlier registry versions.
:::

:::caution Third-Party Service Notice
The Pay on Behalf feature requires a third-party bundler service to relay sponsored transactions to the blockchain. TradeTrust's reference implementation has been tested with Pimlico; other providers offering equivalent services exist, and the provider can be changed.

Bundler services referenced here are not officially endorsed by IMDA Singapore. Use them at your own discretion. Platforms contract directly with their chosen provider and are solely responsible for assessing its suitability, reliability, pricing, and terms of service.
:::

## User experience

On the TT Verify page, once a document is loaded:

1. TT-web checks whether the connected wallet already has EIP-7702 delegation enabled. The `PlatformPaymaster` input field only appears once this check passes.

   ![Delegation enabled detection](/docs/payOnBehalf/delegationEnabledDetection.png)

2. The user enters the platform's `PlatformPaymaster` address (provided by the issuer) into that input field.
3. TT-web checks the connected wallet against that paymaster's whitelist and reports back whether the wallet is eligible (whitelisted) for sponsored transactions.

   ![Paymaster enabled](/docs/payOnBehalf/paymasterEnabled.png)

4. If eligible, supported actions (minting, transferring, etc.) prompt the user's wallet for a **signature** (of the UserOperation) instead of the usual gas-payment transaction confirmation — no ETH is required from the user.

   <img src="/docs/payOnBehalf/metamaskSignatureRequest.png" alt="Metamask signature request" style={{display: 'block', margin: '0 auto', maxWidth: '320px'}} />

5. If not eligible, TT-web surfaces this so the user knows to request access from their platform admin — admins grant eligibility by whitelisting the address via `setUserWhitelist` (see [Setup](./setup)).
6. If delegation was not already enabled in step 1, the one-time EIP-7702 delegation happens transparently as part of the user's first sponsored action.

See [Overview](./overview) for a diagram of the full admin-setup vs. user-experience flow, and [Operations](./operations) for the underlying SDK calls TT-web makes on the user's behalf.
