
```mermaid
sequenceDiagram
    autonumber
    actor Company
    participant Platform
    Company->>Platform: issues TradeTrust document using the same DID indicated in the ID-VC issued by GLEIF
    Company->>Platform: submits ID-VC    
    Platform->>Company: challenge the ownership of ID-VC
    Company->>Platform: completes the challenge
    Platform->>Company: generate TradeTrust document based on the same DID indicated in the ID-VC issued by GLEIF
```
