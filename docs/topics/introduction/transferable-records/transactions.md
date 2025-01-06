---
id: transactions
title: Transactions
sidebar_label: Transactions
---

### Transfer/Reject of Holdership

#### Transfer Holdership:

Enables the transfer of holdership rights to another party, allowing them to take temporary possession of the asset.

```bash
tradetrust title-escrow change-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --to <TO> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

#### Reject Holdership:

Declines a request for holdership transfer, preventing an unauthorized or invalid transaction.

```bash
tradetrust title-escrow reject-transfer-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING>  --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Transfer/Reject of Ownership

#### Transfer Ownership:

Facilitates the transfer of ownership rights to a new owner, making them the legitimate and permanent owner of the asset.

```bash
tradetrust title-escrow endorse-change-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newOwner <NEW_OWNER_ADDRESS> --newHolder <NEW_HOLDER_ADDRESS> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

#### Reject Ownership Transfer:

Prevents a transfer of ownership to an incorrect or unauthorized party.

```bash
tradetrust title-escrow reject-transfer-owner-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID>  -n sepolia --key <ALICE_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Nominate Owner

Allows an entity to propose a new owner for the asset, initiating the process for ownership transfer, pending acceptance by the nominated party.

```bash
tradetrust title-escrow nominate-change-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newOwner <NEW_OWNER_ADDRESS> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Endorse Owner

Confirms and approves the proposed ownership, affirming the nominated individual or entity as the rightful new owner.

```bash
tradetrust title-escrow endorse-transfer-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newBeneficiary <NEW_OWNER> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Return to Issuer

Initiates the process of returning the asset to its original issuer (Token Registry), relinquishing all holdership or ownership rights.

```bash
tradetrust title-escrow return-to-issuer --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

### Accept/Reject Return to Issuer

#### Accept Return to Issuer:

Confirms the receipt of the returned asset by the issuer, reinstating their ownership or custodial rights.

```bash
tradetrust title-escrow accept-returned --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

#### Reject Return to Issuer:

Declines the return of the asset, maintaining the current holdership or ownership status.

```bash
tradetrust title-escrow reject-returned --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <YOUR_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```
