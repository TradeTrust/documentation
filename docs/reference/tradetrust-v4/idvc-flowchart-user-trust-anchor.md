# Issue ID-VC:

```mermaid
sequenceDiagram
    autonumber
    actor Company
    participant Trust Anchor
    Company->>Trust Anchor: login to portal
    Company->>Trust Anchor: requests an IDVC 
    Company->>Trust Anchor: provides DID
    Trust Anchor->>Company: challenge the ownership of DID
    Company->>Trust Anchor: completes the challenge
    Trust Anchor->>Trust Anchor: generate IDVC - signs and binds the DID to IDVC
    Trust Anchor->>Company: issues IDVC to company
```
