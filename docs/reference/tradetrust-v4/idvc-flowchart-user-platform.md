
```mermaid
sequenceDiagram
    autonumber
    actor Company
    participant Platform
    Company->>Platform: issues TradeTrust document using ID-VC
    Company->>Platform: submits ID-VC    
    Platform->>Company: challenge the ownership of ID-VC
    Company->>Platform: completes the challenge
    Platform->>Company: generate TradeTrust document with ID-VC
```
