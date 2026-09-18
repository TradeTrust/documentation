---
id: cli
title: Pay on Behalf CLI
sidebar_label: CLI Reference
---

# Pay on Behalf — CLI Reference

Use the TrustVC CLI to deploy a `PlatformPaymaster`, administer it, and run any title-escrow, mint, or token-registry deployment command as a **sponsored (gasless)** transaction.

:::caution Beta — testnets only
Gasless transactions are in beta and only supported on **Sepolia** and **Amoy**. Do not use a `PlatformPaymaster` or `EIP7702Implementation` contract in production.
:::

:::info Token Registry v5 only
Gasless CLI commands only work against **Token Registry v5 (TR v5)** contracts.
:::

## Installation

:::caution Beta — testnets only
Pay on Behalf (gasless) commands are in **beta** and only supported on **Sepolia** and **Amoy**. Install the `@beta` tag of the CLI to access them — the `latest` release does not include gasless support.
:::

```bash
npm install -g @trustvc/trustvc-cli@beta
```

Or run without installing:

```bash
npx @trustvc/trustvc-cli@beta <command>
```

Node.js 22.19.5+ is required.

## Required environment variables

Set these before running any gasless command:

| Variable | Required for | Notes |
|---|---|---|
| `PIMLICO_API_KEY` | Every gasless transaction | Get a free key from [dashboard.pimlico.io](https://dashboard.pimlico.io). Never logged — the CLI redacts it from error output. |
| `SEPOLIA_EIP7702_IMPL_ADDRESS` or `AMOY_EIP7702_IMPL_ADDRESS` | Every gasless transaction | The deployed `EIP7702Implementation` address for your network. Use the generic `EIP7702_IMPL_ADDRESS` as a fallback if no network-scoped variable is set. See [Overview — Deployed addresses](./overview#deployed-addresses). |
| `SEPOLIA_RPC` / `AMOY_RPC` | Optional | Overrides the default public RPC for gasless reads and client setup. |

:::tip Use gaslessConstants
The pre-deployed `EIP7702Implementation` addresses are also exported from the SDK as `gaslessConstants.GASLESS_EIP7702_IMPL_ADDRESS_SEPOLIA` and `gaslessConstants.GASLESS_EIP7702_IMPL_ADDRESS_AMOY` — see [Overview](./overview#contract-addresses-via-gaslessconstants).
:::

---

## Setup workflow

Run these once before any user can submit gasless transactions:

```bash
# 1. Deploy a PlatformPaymaster for your platform
trustvc deploy-platform-paymaster

# 2. Authorize what it may sponsor
trustvc paymaster-admin add-title-escrow
trustvc paymaster-admin add-registry
trustvc paymaster-admin add-authorized-caller

# 3. Fund and stake it
trustvc paymaster-admin fund-paymaster
trustvc paymaster-admin stake-paymaster

# 4. (mint --gasless only) grant MINTER_ROLE to the paymaster on the token registry

# 5. (token-registry deploy --gasless only) whitelist deployers
trustvc paymaster-admin set-user-whitelist
```

The user's EOA is delegated to `EIP7702Implementation` automatically on their first sponsored UserOperation — no separate activation step is needed. Use `paymaster-admin delegate-user` only if you want to delegate ahead of time.

---

## deploy-platform-paymaster

Deploys a `PlatformPaymaster` clone for your platform. This is a **regular transaction** — you pay gas. The clone address is deterministic from the salt.

```bash
trustvc deploy-platform-paymaster
```

**Interactive prompts:**

1. Network (Sepolia or Amoy)
2. Salt — `0x`-prefixed 32-byte hex, or any string (hashed into one)
3. Platform owner address (optional, defaults to deployer)
4. Daily sponsored-gas limit in wei (optional, `0` = unlimited)
5. Wallet / private key

**Output:** Deployed paymaster address, transaction hash, and explorer link.

Before it can sponsor anything, authorize what it covers and fund it with `paymaster-admin` (see below).

---

## paymaster-admin \<method\>

Owner-only administration of a deployed `PlatformPaymaster`. Every method is a **regular transaction** — the paymaster owner pays gas. All methods prompt for: network → paymaster address → wallet/private key, then the method-specific fields below.

```bash
trustvc paymaster-admin <method>
```

| Method | Extra prompts | Purpose |
|---|---|---|
| `add-authorized-caller` | caller address | Authorize an address to trigger sponsored title-escrow/registry calls |
| `remove-authorized-caller` | caller address | Deauthorize a caller |
| `add-title-escrow` | title escrow address | Authorize a title escrow so its calls can be sponsored |
| `remove-title-escrow` | title escrow address | Deauthorize a title escrow |
| `add-registry` | registry address | Authorize a token registry so its calls can be sponsored |
| `remove-registry` | registry address | Deauthorize a token registry |
| `set-daily-limit` | daily limit in wei | Set the global per-user daily sponsored-gas spend limit (`0` = unlimited) |
| `set-user-whitelist` | user address, deployment credits (0–3) | Whitelist a user and set how many token registries they may deploy gaslessly |
| `remove-user-from-whitelist` | user address | Reset a user's deployment credits to 0 |
| `fund-paymaster` | amount in ETH | Deposit ETH into the paymaster's EntryPoint balance so it can sponsor gas |
| `stake-paymaster` | amount in ETH, unstake delay in seconds (default `86400`) | Stake ETH on the EntryPoint — required before bundlers accept sponsored UserOperations |
| `delegate-user` | network, wallet/private key (no paymaster address prompt) | Delegate a user's EOA to the `EIP7702Implementation` contract. Normally done automatically on first sponsored UserOp — run explicitly only to delegate ahead of time. |

**Output:** Transaction hash and explorer link for each call.

---

## Running any command gaslessly (`--gasless`)

Add `--gasless` to a supported command to submit it as a sponsored EIP-7702 smart-account UserOperation instead of a regular transaction. The caller needs no ETH.

### Title escrow commands

```bash
# Transfers
trustvc transfer-holder --gasless              # transfer holder
trustvc endorse-transfer-owner --gasless       # transfer/endorse beneficiary (owner)
trustvc transfer-owner-holder --gasless        # transfer both beneficiary and holder
trustvc nominate-transfer-owner --gasless      # nominate a new beneficiary

# Rejections
trustvc reject-transfer-holder --gasless
trustvc reject-transfer-owner --gasless
trustvc reject-transfer-owner-holder --gasless

# Return to issuer
trustvc return-to-issuer --gasless             # holder + beneficiary return the record
trustvc accept-return-to-issuer --gasless      # issuer accepts the return (burn)
trustvc reject-return-to-issuer --gasless      # issuer rejects the return (restore)
```

All title-escrow commands also accept the `title-escrow` prefix:

```bash
trustvc title-escrow transfer-holder --gasless
trustvc title-escrow return-to-issuer --gasless
# etc.
```

### Mint and registry deployment

```bash
trustvc mint --gasless                   # mint gaslessly (paymaster must hold MINTER_ROLE)
trustvc token-registry deploy --gasless  # deploy a registry gaslessly (caller needs deploy credits)
```

### What changes with `--gasless`

- Gas and dry-run prompts are skipped — Pimlico's bundler estimates and sponsors gas.
- One extra prompt appears for the **PlatformPaymaster contract address**.
- An eligibility check runs against the paymaster on-chain before submitting, and fails fast with a specific error if any requirement is not met.
- Role requirements are identical to the non-gasless command (e.g. `transfer-holder --gasless` still requires the caller to be the current holder).

---

## Eligibility checks

Before submitting any sponsored UserOperation, the CLI reads the `PlatformPaymaster` on-chain and fails fast with a specific error if any check doesn't pass.

### Title-escrow and registry-side actions

For `transfer-holder`, `return-to-issuer`, `reject-transfer-owner`, and similar commands:

1. The paymaster contract exists at the given address.
2. The title escrow (or registry, for registry-level actions) is authorized — `paymaster-admin add-title-escrow` / `add-registry`.
3. The caller is an authorized caller — `paymaster-admin add-authorized-caller`.
4. The caller's daily sponsored-gas limit has not been reached — `paymaster-admin set-daily-limit` (`0` = unlimited).
5. The paymaster has a non-zero ETH deposit at the EntryPoint — `paymaster-admin fund-paymaster`.

### `mint --gasless`

1. The paymaster contract exists.
2. The token registry has granted the **`PlatformPaymaster` contract itself** `MINTER_ROLE` (done by the token registry owner via `grantRole` on the registry contract).
3. The token registry is authorized on the paymaster — `paymaster-admin add-registry`.
4. The paymaster has a non-zero EntryPoint deposit.

### `token-registry deploy --gasless`

1. The paymaster contract exists.
2. The caller has at least one deployment credit — `paymaster-admin set-user-whitelist` (0–3 credits).
3. The paymaster has a non-zero EntryPoint deposit.

---

## Who can run what

| Action | Who |
|---|---|
| `deploy-platform-paymaster` | Anyone (deploys their own paymaster; pays gas directly) |
| `paymaster-admin <method>` (except `delegate-user`) | The paymaster owner |
| `paymaster-admin delegate-user` | Any user, for their own EOA |
| `<title-escrow command> --gasless` | Same role as the regular command, plus: must be an authorized caller on the paymaster |
| `accept-return-to-issuer --gasless` / `reject-return-to-issuer --gasless` | Same as the regular command — enforced by the registry contract, not by an authorized-caller check |
| `mint --gasless` | Anyone, once the registry has granted `MINTER_ROLE` to the paymaster and the registry is authorized |
| `token-registry deploy --gasless` | Anyone the paymaster owner has whitelisted with deployment credits |

---

## Troubleshooting

Every eligibility failure names the specific check and the admin command that fixes it:

```text
This account cannot perform a gasless transaction: caller 0x... is not an authorized
caller on the PlatformPaymaster (0x...). Ask the paymaster owner to call addAuthorizedCaller first.
```

| Error | Fix |
|---|---|
| "is not authorized on the PlatformPaymaster" | `paymaster-admin add-title-escrow` / `add-registry` for the address in the error |
| "is not an authorized caller" | `paymaster-admin add-authorized-caller` for your address |
| "daily sponsored-gas limit reached" | Wait for the daily window to reset, or `paymaster-admin set-daily-limit 0` |
| "has no ETH deposited at the EntryPoint" | `paymaster-admin fund-paymaster` |
| "does not hold MINTER_ROLE" (mint only) | Token registry owner must `grantRole(MINTER_ROLE, paymasterAddress)` |
| "has no deployment credits" (deploy only) | `paymaster-admin set-user-whitelist` with credits 1–3 |
| "PIMLICO_API_KEY environment variable is required" | Get a key from [dashboard.pimlico.io](https://dashboard.pimlico.io) and set `PIMLICO_API_KEY` |
