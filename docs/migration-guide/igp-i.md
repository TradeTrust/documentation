---
id: igp-i
title: New Features in Token Registry v5
sidebar_label: New Features in Token Registry v5
---

[Version 5 of our Token Registry smart contracts](https://github.com/TradeTrust/token-registry) introduces significant updates designed to improve functionality, control, and compliance, particularly with **IG P&I requirements**. These enhancements provide robust features for managing transferable records while ensuring alignment with industry standards.

## Key Changes in Version 5

- **Remark Field**:
  - Supports detailed documentation for transactional actions.

- **Reject Functions**:
  - Prevent wrongful transfers by rejecting ownership or holding changes.
  - Ensure that ownership or holding can revert to the previous party when necessary.

### 1. Support for Remark Field

- A new, optional **remark** field has been added to all contract operations.

- **Details**:
  - Optional: Can be left empty by providing `"0x"`.
  - Limit: Up to **120 characters**.
  - Encryption: Recommended for sensitive remarks.

- **IG P&I Alignment**: Enabling users to document additional context for all actions.

### 2. Reject Functions

- Reject functions empower users to decline unwanted changes to ownership or holding roles.

- **Details**:
  - Reject Transfer of Ownership (`rejectTransferOwner`)
  - Reject Transfer of Holding (`rejectTransferHolder`)
  - Reject Both Roles (`rejectTransferOwners`)

- **IG P&I Alignment**: Provides control to reverse unintended transfers, ensuring that records return to the rightful parties.

- **Important Note**: Rejection must occur immediately after being appointed as the beneficiary and/or holder. If any transactions occur by the new appointee (such as transfer actions or other operations), it will be treated as an implicit acceptance of the appointment, and the rejection process will be voided.

## Migrating to Token Registry v5

For detailed instructions on migrating to **Token Registry v5**, please refer to the [Migration Guide](migration-tr-v5).
