---
id: setup
title: Setup
sidebar_label: Setup
---

# Setup

This page walks through one-time setup steps: deploying a PlatformPaymaster for your platform, whitelisting users, and building the `smartAccountClient` that all Pay on Behalf SDK functions accept.

:::info Disclaimer
The steps below use **Pimlico** as the bundler/paymaster infrastructure provider because that's what this reference implementation is built and tested against. This is not an endorsement or requirement — any ERC-4337-compatible bundler that supports EIP-7702 can be substituted, and the `smartAccountClient` construction in step 5 is where you'd swap providers.
:::

:::caution Beta
Install the beta release of `@trustvc/trustvc` to access the EIP-7702 Pay on Behalf functions:

```bash
npm install @trustvc/trustvc@beta permissionless viem
```

The Pay on Behalf API is not available in the `latest` (`2.x`) release.
:::

:::info Token Registry v5 only
This setup applies to **Token Registry v5 (TR v5)** deployments only.
:::

## 0. Get a bundler API key

A **bundler** submits UserOperations on behalf of users and, together with your `PlatformPaymaster`, is what makes Pay on Behalf work. This guide uses **Pimlico** as a working example — any ERC-4337-compatible bundler that supports EIP-7702 can be used instead. A free account is sufficient for development and testing.

1. Go to [dashboard.pimlico.io](https://dashboard.pimlico.io) and sign up (GitHub or email).
2. Create a new **API key** from the dashboard.
3. Add it to your `.env`:

```env
PIMLICO_API_KEY=your_key_here
```

The bundler URL is constructed as:

```text
https://api.pimlico.io/v2/{chainId}/rpc?apikey={PIMLICO_API_KEY}
```

| Network | chainId |
| --- | --- |
| Sepolia | `11155111` |
| Polygon Amoy | `80002` |

Pimlico's free tier has no credit card requirement and is enough to run through this entire guide.

## 1. Deploy a PlatformPaymaster

Each platform (issuer) deploys its own `PlatformPaymaster` clone via `PlatformAccountFactory`. The clone is a cheap minimal proxy (~55 k gas) with its own state (owner, daily limit, authorized registries).

:::info Already deployed infrastructure
The `EIP7702Implementation`, `PlatformPaymaster` implementation, and `PlatformAccountFactory` are **already deployed** on Sepolia and Amoy — addresses are in the [Overview](./overview). You only need to deploy your own **clone** of the paymaster using the factory. You do **not** re-deploy the shared infrastructure.
:::

### Using the SDK

```ts
import { deployPlatformPaymaster } from '@trustvc/trustvc';
import { createWalletClient, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const deployer = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account: deployer,
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

const { txHash, paymasterAddress } = await deployPlatformPaymaster(
  walletClient,
  {
    // factoryAddress defaults to the Sepolia PlatformAccountFactory if omitted
    platformAddress: deployer.address,  // EOA that owns the paymaster
    dailyLimit: 0n,                     // 0 = unlimited; set in wei if you want a cap
    salt: `0x${'ab'.repeat(32)}`,       // bytes32 CREATE2 salt — must be unique per platform
  },
  publicClient,
);

console.log('Paymaster deployed at:', paymasterAddress);
console.log('Tx:', txHash);
```

The function also accepts an ethers v5 or v6 signer in place of the viem `WalletClient`.

### Options

| Option | Required | Description |
|---|---|---|
| `salt` | Yes | `bytes32` CREATE2 salt. Use `crypto.randomBytes(32).toString('hex')` for a random one. |
| `platformAddress` | No | Paymaster owner. Defaults to the signer's address. |
| `dailyLimit` | No | Per-user daily gas spend cap in wei. `0n` = unlimited. |
| `factoryAddress` | No | Override factory address. Defaults to Sepolia's deployed factory. |
| `chainId` | No | Used to auto-resolve `factoryAddress`. Defaults to Sepolia. |

## 2. Stake the paymaster on EntryPoint

The paymaster must hold a stake and a deposit on the EntryPoint before it can sponsor UserOps. Use the SDK's `stakePaymaster` and `fundPaymaster` helpers:

```ts
import { stakePaymaster, fundPaymaster } from '@trustvc/trustvc';
import { parseEther } from 'viem';

// Stake ETH on the EntryPoint (required for ERC-4337 paymaster compliance)
await stakePaymaster(
  walletClient,       // funded platform owner signer
  paymasterAddress,   // your deployed PlatformPaymaster clone
  86400,              // unstake delay in seconds (1 day)
  parseEther('0.001'), // amount to stake
);

// Deposit ETH into the paymaster's gas pool to cover UserOp sponsorship
await fundPaymaster(
  walletClient,
  paymasterAddress,
  parseEther('0.1'),  // adjust as needed; this is the gas budget
);
```

Both functions accept a viem `WalletClient` or ethers v5/v6 signer and return `Promise<string>` (tx hash).

:::note Stake vs deposit
- **Stake** (`stakePaymaster`) — ETH locked with the EntryPoint under a time delay. Required for ERC-4337 paymaster compliance. Cannot be withdrawn until the unstake delay elapses.
- **Deposit** (`fundPaymaster`) — ETH deposited into the paymaster's EntryPoint balance to pay for sponsored gas. Not locked — can be withdrawn at any time.
:::

## 3. Whitelist users (admin)

The paymaster owner must whitelist users before they can deploy registries under Pay on Behalf. Credits represent how many registry deployments are allowed per user (max 3).

```ts
import { setUserWhitelist } from '@trustvc/trustvc';

// Whitelist a user with 2 deployment credits
await setUserWhitelist(
  ownerWalletClient,            // platform owner signer
  paymasterAddress,             // your PlatformPaymaster
  '0xUserAddress...',           // user to whitelist
  2n,                           // credits (0–3)
);
```

Other admin functions available from `@trustvc/trustvc`:

```ts
import {
  removeUserFromWhitelist,
  addRegistry,
  removeRegistry,
  addTitleEscrow,
  removeTitleEscrow,
  addAuthorizedCaller,
  removeAuthorizedCaller,
  setDailyLimit,
} from '@trustvc/trustvc';
```

All admin functions accept an ethers v5/v6 signer or viem `WalletClient` as the first argument and return `Promise<string>` (tx hash).

## 4. Delegate the user's EOA (platform owner)

Delegation is a separate, one-time type-4 transaction — it is **not** bundled into the user's first UserOperation. The EOA must already be delegated to `EIP7702Implementation` before any `*Gasless` function is called for it.

Use the SDK's `delegateUser` function. It handles the EIP-7702 authorization signature and type-4 submission:

```ts
import { delegateUser, gaslessConstants } from '@trustvc/trustvc';

const EIP7702_IMPL = gaslessConstants.GASLESS_EIP7702_IMPL_ADDRESS_SEPOLIA;
```

There are two cases depending on who holds the user's private key:

**User-owned wallet** — the user's wallet signs the authorization (no gas), and a funded `payerSigner` submits the type-4 transaction and pays the gas:

```ts
// ownerSigner: user's viem WalletClient (signs, no ETH needed)
// payerSigner: platform owner's funded WalletClient (submits and pays gas)
const delegationTxHash = await delegateUser(EIP7702_IMPL, ownerSigner, payerSigner);
```

**Platform-managed wallet** — the platform owns the key, so `ownerSigner` both signs and submits. Omit `payerSigner`:

```ts
// ownerSigner is the platform's WalletClient that holds the user's key
const delegationTxHash = await delegateUser(EIP7702_IMPL, platformManagedUserWalletClient);
```

:::caution
`delegateUser` only accepts viem `WalletClient` — not ethers signers. For ethers-based setups, call `signAuthorization` / `sendTransaction` directly with your viem client or use a viem adapter.
:::

## 5. Build a smart account client

All Pay on Behalf SDK functions take a `smartAccountClient` as their second argument. Build one from the user's delegated EOA using **permissionless** + **Pimlico** (or your chosen bundler):

```ts
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from 'viem';
import { sepolia } from 'viem/chains';
import { entryPoint08Address } from 'viem/account-abstraction';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { createSmartAccountClient } from 'permissionless';
import { to7702SimpleSmartAccount } from 'permissionless/accounts';

const PIMLICO_URL = `https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${process.env.PIMLICO_API_KEY}`;
// TrustVC's EIP7702Implementation on Sepolia — see Overview > Deployed addresses.
// Must match the contract the EOA was delegated to in step 4, not permissionless's default.
const EIP7702_IMPLEMENTATION_ADDRESS = '0xa46EC3920Ac5fc54F4bA33185A91ae250aDF59B8';

async function buildSmartAccountClient(ownerAddress: `0x${string}`, paymasterAddress: `0x${string}`) {
  const publicClient = createPublicClient({ chain: sepolia, transport: http(process.env.SEPOLIA_RPC_URL) });

  // walletClient wraps the user's signer (MetaMask, hardware wallet, etc.)
  const walletClient = createWalletClient({
    account: ownerAddress,
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  const pimlicoClient = createPimlicoClient({
    transport: http(PIMLICO_URL),
    entryPoint: { address: entryPoint08Address, version: '0.8' },
  });

  // Wraps the delegated EOA as an EIP-7702 smart account.
  // accountLogicAddress must match the implementation the EOA was delegated to (step 4) —
  // without it, this defaults to permissionless's own implementation, not TrustVC's.
  const account = await to7702SimpleSmartAccount({
    client: publicClient,
    owner: walletClient,
    accountLogicAddress: EIP7702_IMPLEMENTATION_ADDRESS,
  });

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: sepolia,
    bundlerTransport: http(PIMLICO_URL),
    client: publicClient,
    // PlatformPaymaster — validates on-chain, no off-chain signature needed
    paymaster: {
      async getPaymasterStubData() {
        return {
          paymaster: paymasterAddress,
          paymasterData: '0x' as `0x${string}`,
          paymasterVerificationGasLimit: 300_000n,
          paymasterPostOpGasLimit: 150_000n,
          isFinal: false,
        };
      },
      async getPaymasterData() {
        return {
          paymaster: paymasterAddress,
          paymasterData: '0x' as `0x${string}`,
          paymasterVerificationGasLimit: 300_000n,
          paymasterPostOpGasLimit: 150_000n,
        };
      },
    },
    userOperation: {
      estimateFeesPerGas: async () => {
        const { fast } = await pimlicoClient.getUserOperationGasPrice();
        return { maxFeePerGas: fast.maxFeePerGas, maxPriorityFeePerGas: fast.maxPriorityFeePerGas };
      },
    },
  });

  return { smartAccountClient, publicClient };
}
```

:::note
`to7702SimpleSmartAccount` wraps an EOA as a smart account for building and signing UserOperations — it does not perform delegation. The EOA must already be delegated to `EIP7702Implementation` beforehand, via the separate type-4 transaction described in [step 4](#4-delegate-the-users-eoa-platform-owner).
:::

## Required environment variables

### Wallets & RPC

| Variable | Description |
|---|---|
| `PRIVATE_KEY` | Deployer/gas-payer wallet — pays for deployments, delegation txs, staking |
| `PRIVATE_KEY2` | Secondary wallet (optional — for testing with a second account) |
| `OWNER_PRIVATE_KEY` | Platform owner / whitelisted user — signs UserOps, needs no ETH for gasless ops |
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint (e.g. Infura, Alchemy) |
| `AMOY_RPC_URL` | Polygon Amoy RPC endpoint |
| `PIMLICO_API_KEY` | Pimlico bundler API key — free tier at [dashboard.pimlico.io](https://dashboard.pimlico.io) |
| `NETWORK` | `sepolia` \| `amoy` — target network for viem/permissionless scripts (default: `sepolia`) |
| `ENTRY_POINT` | EntryPoint v0.8 address (default: `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108`, same on all supported chains) |

### Deployed contract addresses (network-scoped)

Deployed contract addresses used by the SDK are available via `gaslessConstants` (see the tip below). If you prefer environment variables, the convention is to suffix the variable name with `_SEPOLIA` or `_AMOY` (e.g. `FACTORY_ADDRESS_SEPOLIA`, `FACTORY_ADDRESS_AMOY`).

| Variable | Description |
|---|---|
| `EIP7702_IMPL_ADDRESS_<NETWORK>` | Deployed `EIP7702Implementation` address |
| `PAYMASTER_IMPLEMENTATION_<NETWORK>` | Deployed `PlatformPaymaster` implementation address |
| `FACTORY_ADDRESS_<NETWORK>` | Deployed `PlatformAccountFactory` address |
| `PAYMASTER_ADDRESS_<NETWORK>` | Your platform's deployed paymaster clone address |
| `TDOC_DEPLOYER_ADDRESS_<NETWORK>` | TrustVC `TDocDeployer` address (pre-deployed infra) |
| `REGISTRY_ADDRESS_<NETWORK>` | Token registry deployed via `deployTokenRegistryGasless` |
| `TITLE_ESCROW_ADDRESS_<NETWORK>` | Title escrow address captured after `mintGasless` |

:::tip Using `gaslessConstants`
All of TrustVC's pre-deployed addresses are also available directly from the SDK via `gaslessConstants` — you don't need to set them in `.env` when using the SDK. See [Overview — Contract addresses via gaslessConstants](./overview#contract-addresses-via-gaslessconstants).
:::

