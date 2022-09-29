---
id: endorsement-chain
title: Endorsement Chain
sidebar_label: Endorsement Chain
---

The endorsement chain provides an overview of the EBL's transaction history, showing which wallet is currently the EBL's ownership/holdership.

![Endorsement Chain](/docs/tradetrust-website/endorsement-chain/endorsement-chain.png)

**Document has been issued** -> Document is created by issuer with Owner and Holder being empty at the start. Owner and Holder will be then be specified by issuer during issuance.

**Transfer of Holdership** -> Current Holder can transfer the holdership to another holder.

**Nominate Change of Owner** -> When Owner and Holder are different, current Owner can transfer nominate change of owner. This will require current Holder to endorse the change (this will not be reflected in endorsement chain, as it is not a finalized owner/holder record until holder accepts the nomination)

**Endorse of Change of Owner** -> When Owner and Holder are same, current Owner/Holder can endorse the change of owner to another owner. This will result in a change of Owner and Holder values.

**Surrender of Document** -> When Owner and Holder are the same, the current Owner/Holder can surrender the document to issuer. Once the document is surrendered, both Owner and Holder values will be empty because it is no longer in circulation.

**Surrender of document accepted** -> Document is shredded and destroyed.

> The endorsement chain is only viewable for Transferable Record documents.
