---
id: wallet-management
title: Wallet Management
sidebar_label: Wallet Management
---

For any signed transactions, a wallet private key is always needed. As of today, Tradetrust uses metamask browser extension as its wallet management solution. This [ADR](https://github.com/Open-Attestation/adr/blob/master/wallet_management.md#survey-of-key-management-solutions) provides a good background context on key management solutions.

The below are some of the solutions basic breakdown:

## Metamask

<img src="/docs/advanced/wallet-management/metamask.svg" alt="metamask" class="mb-4" width="300" />

- A software wallet.
- Wallet created + stored in browser extension.
- Convenient.
  - Able to access Dapp functionalities, as long as wallet is imported in multiple devices.
- Might be susceptible to security lapses due to multiple touchpoints.

#### Summary

- Fast to setup + use as it is only installing a browser extension.
- Lowest barrier of entry for adoption.

---

## Ledger Nano

<img src="/docs/advanced/wallet-management/ledger-nano.svg" alt="ledger nano" class="mb-4"  width="40" />

- A hardware wallet.
- Wallet stored in physical hardware.
- Not as convenient.
  - Able to access Dapp functionalities, only if wallet is connected physically.
  - Clunky interfaces depending on models / brands.
  - Research on which hardware ledger to get (coin support, business needs etc)
- More secured in a way, by limiting to only 1 touchpoint.

#### Summary

- Requires procurement of hardware device.
- Mid barrier of entry for adoption.

---

## Amazon’s Key Management Services (AWS KMS)

<img src="/docs/advanced/wallet-management/aws-kms.svg" alt="aws kms" class="mb-4" width="300" />

- A public private keys pair, can have multiple key pairs.
- Public private key pairs created + stored in KMS as Customer managed keys.
- Convenience?
  - Able to access Dapp functionalities, if Dapp is connected directly with AWS KWS.
  - How / who to setup + manage ownership of public private key pairs?
- Much of security responsibilities offloaded to AWS infrastructure.

#### Summary

- Ownership of public private keys pair needs to be addressed.

> There is tutorial [here](https://github.com/lucashenning/aws-kms-ethereum-signing) on implementing transactions signing with AWS KMS.
