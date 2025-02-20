---
id: role-and-access
title: Roles and Access Control
sidebar_label: Roles and Access Control
---

Roles are useful for granting users to access certain functions only. Currently, here are the designated roles meant for the different key operations.

| Role         | Access                                     |
| ------------ | ------------------------------------------ |
| DefaultAdmin | Able to perform all operations             |
| MinterRole   | Able to mint new tokens                    |
| AccepterRole | Able to accept a token returned to issuer  |
| RestorerRole | Able to restore a token returned to issuer |

A trusted user can be granted multiple roles by the admin user to perform different operations. The following functions can be called on the token contract by the admin user to grant and revoke roles to and from users.

### Grant a role to a user

```ts
import { v5RoleHash } from "@trustvc/trustvc";

await connectedRegistry.grantRole(v5RoleHash.MinterRole, accountAddress);
```

:::important

Can only be called by default admin or role admin.
:::

### Revoke a role from a user

```ts
import { v5RoleHash } from "@trustvc/trustvc";

await connectedRegistry.revokeRole(v5RoleHash.AccepterRole, accountAddress);
```

:::important

Can only be called by default admin or role admin.
:::

### Setting a role admin (Advanced Usage)

The standard setup does not add the role-admin roles so that users don't deploy (and, hence, pay the gas for) more than what they need. If you need a more complex setup, you can add the admin roles to the designated roles.

```ts
import { v5RoleHash } from "@trustvc/trustvc";

await connectedRegistry.setRoleAdmin(v5RoleHash.MinterRole, v5RoleHash.MinterAdminRole);
await connectedRegistry.setRoleAdmin(v5RoleHash.RestorerRole, v5RoleHash.RestorerAdminRole);
await connectedRegistry.setRoleAdmin(v5RoleHash.AccepterRole, v5RoleHash.AccepterAdminRole);
```

:::important

Can only be called by default admin.
:::
