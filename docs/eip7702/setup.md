---
id: setup
title: Setup
sidebar_label: Setup
---

# Setup

This page walks through one-time setup steps: deploying a PlatformPaymaster for your platform, whitelisting users, and building the `smartAccountClient` that all gasless SDK functions accept.

:::caution Beta
Install the beta release of `@trustvc/trustvc` to access the EIP-7702 gasless functions:

```bash
npm install @trustvc/trustvc@beta permissionless viem
```

The gasless API is not available in the `latest` (`2.x`) release.
:::

## 0. Get a Pimlico API key

Pimlico is the bundler that submits UserOperations on behalf of users. A free account is sufficient for development and testing.

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

The paymaster must hold a deposit on the EntryPoint to sponsor UserOps. Stake it once after deployment using a funded EOA:

```ts
import { parseAbi, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

const entryPointAbi = parseAbi([
  'function depositTo(address account) external payable',
  'function addStake(uint32 unstakeDelaySec) external payable',
]);

const ENTRY_POINT = '0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108';

// Deposit ETH to cover gas sponsorship
await walletClient.writeContract({
  address: ENTRY_POINT,
  abi: entryPointAbi,
  functionName: 'depositTo',
  args: [paymasterAddress],
  value: parseEther('0.1'),   // adjust as needed
});

// Stake for ERC-4337 compliance
await walletClient.writeContract({
  address: ENTRY_POINT,
  abi: entryPointAbi,
  functionName: 'addStake',
  args: [86400],              // 1-day unstake delay
  value: parseEther('0.001'),
  account: deployerAccount,
  chain: sepolia,
});
```

## 3. Whitelist users (admin)

The paymaster owner must whitelist users before they can deploy registries gaslessly. Credits represent how many registry deployments are allowed per user (max 3).

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

## 4. Build a smart account client

All gasless SDK functions take a `smartAccountClient` as their second argument. Build one from the user's delegated EOA using **permissionless** + **Pimlico**:

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

const PIMLICO_URL = `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${PIMLICO_API_KEY}`;
// EIP-7702 implementation deployed by permissionless team
const PERMISSIONLESS_IMPL = '0xe6Cae83BdE06E4c305530e199D7217f42808555B';

async function buildSmartAccountClient(ownerAddress: `0x${string}`, paymasterAddress: `0x${string}`) {
  const publicClient = createPublicClient({ chain: sepolia, transport: http(RPC_URL) });

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

  // Wraps the delegated EOA as an EIP-7702 smart account
  const account = await to7702SimpleSmartAccount({
    client: publicClient,
    owner: walletClient,
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
The first time a user submits a UserOp their EOA is automatically delegated in the same bundle — no separate delegation transaction is needed when using `to7702SimpleSmartAccount`.
:::

## Required environment variables

| Variable | Description |
|---|---|
| `PRIVATE_KEY` | Platform owner private key (pays deployment gas) |
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint |
| `PIMLICO_API_KEY` | Pimlico bundler API key — free tier at [dashboard.pimlico.io](https://dashboard.pimlico.io) |
| `PAYMASTER_ADDRESS` | Deployed `PlatformPaymaster` clone address |
