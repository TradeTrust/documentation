---
id: overview
title: Gasless Operations (EIP-7702)
sidebar_label: Overview
---

# Gasless Operations with EIP-7702

:::caution Beta
Gasless transactions are currently in **beta**. APIs, contract addresses, and behavior may change before the stable release. Use on testnet only and do not rely on this feature in production.
:::

TrustVC supports **gasless trade document operations** via [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) (smart account delegation). Users can deploy token registries, mint documents, and perform all title escrow operations without holding ETH — gas is sponsored by a **PlatformPaymaster**.

## Architecture

The system is built on three smart contracts:

| Contract                 | Role                                                                                                                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EIP7702Implementation`  | Shared smart account logic. EOAs delegate to this once via a type-4 transaction — their bytecode becomes `0xef0100 \|\| impl_address`, giving them full smart-account capability while keeping the same address and private key. |
| `PlatformPaymaster`      | Per-platform ERC-4337 paymaster deployed as a minimal-proxy clone. Sponsors gas for registry deploys, mints, and title escrow operations within configured limits.                                                               |
| `PlatformAccountFactory` | Deploys `PlatformPaymaster` clones deterministically via `CREATE2`. Cheap (~55 k gas) and the clone address is predictable before deployment.                                                                                    |

## How it works

```
User (EOA, no ETH)
  │
  │  1. Sign EIP-7702 authorization → EOA delegates to EIP7702Implementation
  │  2. Submit UserOperation via Pimlico bundler
  │
  ▼
Bundler (Pimlico)
  │
  │  3. Calls EntryPoint → validates against PlatformPaymaster
  │
  ▼
PlatformPaymaster
  │
  ├── Path A — Title escrow / registry calls
  │     Checks: caller ∈ authorizedCallers, target ∈ authorizedRegistries or authorizedTitleEscrows
  │     Enforces: dailyLimit per user
  │
  └── Path B — deployRegistry / mintDocument on the paymaster itself
        deployRegistry: userWhitelist[sender] > 0 (platform whitelists users)
        mintDocument:   caller has MINTER_ROLE on the registry
```

## Deployed addresses

### Sepolia (chainId: 11155111)

| Contract                           | Address                                      |
| ---------------------------------- | -------------------------------------------- |
| EIP7702Implementation              | `0xa46EC3920Ac5fc54F4bA33185A91ae250aDF59B8` |
| PlatformPaymaster (implementation) | `0xa24695178ea881ab7d4d105106e4906a8da4752b` |
| PlatformAccountFactory             | `0x7e9ef6363180baa744eb32ceab367a44f52adc9f` |
| TDocDeployer                       | `0x64bc665056DC8bE4092e569ED13a7F273Be28cD2` |
| EntryPoint v0.8                    | `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108` |

### Polygon Amoy (chainId: 80002)

| Contract                           | Address                                      |
| ---------------------------------- | -------------------------------------------- |
| EIP7702Implementation              | `0x044de1d4515a76ed9e431e8ec89e8d600405fd86` |
| PlatformPaymaster (implementation) | `0x1c4367128933E9a88de26C723F50C288fA0fFea7` |
| PlatformAccountFactory             | `0xfbe1d336000d567f98ac5318f7c0144501388409` |
| TDocDeployer                       | `0xfcafea839e576967b96ad1FBFB52b5CA26cd1D25` |
| EntryPoint v0.8                    | `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108` |

## SDK package

The `@trustvc/trustvc` SDK exposes all gasless functions under the `eip7702-functions` namespace. Install it once:

```bash
npm install @trustvc/trustvc@beta
```

Import any gasless function directly:

```ts
import {
  deployTokenRegistryGasless,
  mintGasless,
  transferHolderGasless,
  transferBeneficiaryGasless,
  transferOwnersGasless,
  nominateGasless,
  returnToIssuerGasless,
  rejectReturnedGasless,
  acceptReturnedGasless,
  rejectTransferHolderGasless,
  rejectTransferBeneficiaryGasless,
  rejectTransferOwnersGasless,
} from "@trustvc/trustvc";
```

## Prerequisites

Before calling any gasless function you need:

1. **A PlatformPaymaster deployed for your platform** — see [Setup](./setup).
2. **A Pimlico API key** — free tier at [dashboard.pimlico.io](https://dashboard.pimlico.io).
3. **The user's EOA delegated** — one-time type-4 transaction (wallet signs an EIP-7702 authorization).
4. **A built `smartAccountClient`** — the permissionless `SmartAccountClient` wrapping the delegated EOA.

All four are covered in [Setup](./setup). Once set up, jump to [Gasless Operations](./gasless-operations) for code examples.
