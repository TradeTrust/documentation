---
id: create-key
title: Create key
sidebar_label: Create key
sidebar_position: 2
---

Sign up for an AWS account if you have not done so. Login to the dashboard.

<img src="/docs/advanced/aws-kms/create-key-01.png" alt="search service" width="800" class="my-4" />

Look for key management service in AWS search and proceed to create a key.

<img src="/docs/advanced/aws-kms/create-key-02.png" alt="configure key" width="800" class="my-4" />

Configure key by selecting `Asymmetric` + `Sign and verify` option. Key specification to choose is `ECC_SECG_P256K1`. Thereafter, assign respective IAM user(s) to this key.

Once done, take note of the generated `Key ID`, you will need this later on.
