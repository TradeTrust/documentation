---
id: title-transfer-example
title: Example
sidebar_label: Example
---

For this particular document, we will go through the many actions that various parties will be allowed to do in a typical title transfer flow.
In order to demonstrate it properly, we will be setting up some prerequisites before we begin. Note that this is not intended to be a tutorial, but just a demonstration of the various capabilities of each state change of the transferable record.

For this demonstration we will have 3 players.

1. Alice
2. Bob
3. Charlie

We will assume that the transferable record has already been issued by a token registry, and the present state of the transferable record is as follows: `(holder: Alice, owner: Alice)`, in words, this means that the transferable record is held and owned by `Alice`

With all the prerequisites ready, we will then proceed on with the actions of the title transfer.

Note that we will be using token/transferable record interchangeably at times.

---

## Order of actions to be done for this demonstration:

- endorse change of ownership
- reject change of ownership (v5)
- change holder
- reject change holder (v5)
- nominate change of ownership
- endorse transfer of ownership
- reject transfer of ownership (v5)

At each action done, we will state the present state of the token, and the respective actions the players can do with the given present state.

---

## Endorse Change of Ownership

### Present state:

The token belongs to `Alice` (both owner and holder are the address of Alice)

### Actions

1. Alice:
   - change holder
   - endorse
   - return document to issuer
2. Bob:
   - no access
3. Charlie:
   - no access

We will do **endorse change of ownership** first.

What this command does is it sets the states (holder and owner) of the token to a given address, in this case we will endorse the change of ownership to Charlie.

```
tradetrust title-escrow endorse-change-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newOwner <CHARLIE_ADDRESS> --newHolder <CHARLIE_ADDRESS> -n sepolia --key <ALICE_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

If this transaction is mined and successful, the state of the transferable record will be different.

---

---

## Reject Change of Ownership and Holdership

### Present state:

The token belongs to `Charlie` (both owner and holder are the address of Charlie)

### Actions

1. Alice:
   - no access
2. Bob:
   - no access
3. Charlie:
   - change holder
   - endorse
   - return document to issuer
   - reject ownership and holdership

We will do **reject change of ownership** now.

What this command does is it sets the states (holder and owner) of the token to it's previous holder and owner address, in this case we will reject the change of ownership back to Alice.

```
tradetrust title-escrow reject-transfer-owner-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <CHARLIE_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

If this transaction is mined and successful, the state of the transferable record will be different.

---

## Change Holder

The next action we will demonstrate is **change holder**, but first, the present states and actions.

### Present state:

_NOTE - Considering Charlie actually not made the reject change of owner transaction._

The token belongs to `Charlie` (both owner and holder are the address of Charlie)

### Actions:

1. Alice:
   - no access
2. Bob:
   - no access
3. Charlie:
   - change holder
   - endorse change of ownership
   - return document to issuer

Now we will do the **change holder** command.

What this command does is it just sets the holder state to a new address.

In this case we will set the holder state to `Bob`, owner state remains as `Charlie` address

```bash
tradetrust title-escrow change-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --to <TO> -n sepolia --key <CHARLIE_PTE_KEY> --remark <REMARK_STRING>  --encryption-key <REMARK_ENCRYPTION_KEY>
```

Do take note that the private key supplied should be that of Charlie instead of Alice since Charlie currently holds and owns the token.

If this command is successful, we will yet again advance the state of the token.

---

## Reject Change of Holder

The next action we will demonstrate is **reject change of holder**, but first, the present states and actions.

### Present state:

The token is held by `Bob`, token is owned by `Charlie`

### Actions:

1. Alice:
   - no access
2. Bob:
   - change holder
   - reject change of holder
3. Charlie:
   - nominate change of ownership

Now we will do the **reject change of holder** command.

What this command does is it just sets the holder state to it's previous holder address.

```bash
tradetrust title-escrow reject-transfer-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <BOB_PTE_KEY> --remark <REMARK_STRING>  --encryption-key <REMARK_ENCRYPTION_KEY>
```

Do take note that the private key supplied should be that of Bob instead of Charlie since Bob currently holds the token and Charlie owns the token.

If this command is successful, we will yet again advance the state of the token.

---

## Nominate Change of Ownership

### Present state:

_NOTE - Considering Bob actually not made the reject change of holder transaction._

The token is still held by `Bob`, token is owned by `Charlie`

### Actions:

1. Alice:
   - no access
2. Bob:
   - change holder
3. Charlie:
   - nominate change of ownership

Next, we will do **nominate change of ownership** as we have already demonstrated **change holder**.

What this command does is to allow `Charlie`, the current owner, to suggest a new owner of the token.

In this case we will suggest `Alice` to be the new owner.

Does this lead to any change in state (holder, owner)? The answer is no, not yet.

```
tradetrust title-escrow nominate-change-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --newOwner <NEW_OWNER_ADDRESS> -n sepolia --key <CHARLIE_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

If this action is successful, then an additional action should be present on `Bob`.

---

## Endorse Transfer of Ownership

### Present state:

The token is held by `Bob`, token is owned by `Charlie`, no change in state from previous action.

### Actions:

1. Alice:
   - no access
2. Bob:
   - change holder
   - endorse transfer of ownership
3. Charlie:
   - nominate change of ownership

Notice that `Bob` actions have increased, it can now endorse the suggested owner from the previous action.

That is what we will do, and we will now perform **endorse transfer of ownership**.

What the command does is that it allows `Bob` to allow and complete the nominated change of ownership from `Charlie` to `Alice`.

```
tradetrust title-escrow endorse-transfer-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <BOB_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

---

## Reject transfer of ownership

### Present state:

The token is held by `Bob`, token is owned by `Alice`

### Actions:

1. Alice:
   - nominate change of ownership
   - reject transfer of ownership
2. Bob:
   - change holder
3. Charlie:
   - no access

Now we will do the **reject change of owner** command.

What this command does is it just sets the owner state to it's previous owner address.

```bash
tradetrust title-escrow reject-transfer-owner --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> -n sepolia --key <ALICE_PTE_KEY> --remark <REMARK_STRING> --encryp
tion-key <REMARK_ENCRYPTION_KEY>
```

---

## Final Action of Demonstration

### Present state:

_NOTE - Considering Alice actually not made the reject change of owner transaction._
The token is held by `Bob`, token is owned by `Alice`

### Actions:

1. Alice:
   - nominate change of ownership
2. Bob:
   - change holder
3. Charlie:
   - no access

If the prev command worked as intended, then the new owner state of the token will be `Alice`.

we will wrap up this demonstration by changing the holder to `Alice` so we will come full circle.

```bash
tradetrust title-escrow change-holder --token-registry <TOKEN_REGISTRY_ADDRESS> --tokenId <TOKEN_ID> --to <TO> -n sepolia --key <BOB_PTE_KEY> --remark <REMARK_STRING> --encryption-key <REMARK_ENCRYPTION_KEY>
```

---

### Final State:

The token is still held by `Alice`, the token is owned by `Alice`.

## Conclusion:

In this demonstration, we have simulated a Title Transfer between 3 parties, going through each state change and the actions that could happen with each different state of the token.

This demonstration does not cover any return to issuer actions that could happen and it should be covered in an upcoming document.
