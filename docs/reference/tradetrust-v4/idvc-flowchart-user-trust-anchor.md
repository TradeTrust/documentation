# Issue ID-VC:

```mermaid
sequenceDiagram
    autonumber
    actor Company
    participant Trust Anchor
    Company->>Trust Anchor: login to portal
    Company->>Trust Anchor: requests an ID-VC 
    Company->>Trust Anchor: provides DID
    Trust Anchor->>Company: challenge the ownership of DID
    Company->>Trust Anchor: completes the challenge
    Trust Anchor->>Trust Anchor: generate ID-VC - signs and binds the DID to ID-VC
    Trust Anchor->>Company: issues ID-VC to company
```
