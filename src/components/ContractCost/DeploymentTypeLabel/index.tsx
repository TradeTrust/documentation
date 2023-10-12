import React from "react";

export const DeploymentTypeLabel = ({ deploymentType, remarks }) => {
  return (
    <div>
      <div className="deployment-type-container">
        {deploymentType.map((type, index) => {
          if (type === "DNS")
            return (
              <div key={index} className="deployment-type-dns">
                DNS
              </div>
            );
          if (type === "DID")
            return (
              <div key={index} className="deployment-type-did">
                DID
              </div>
            );
        })}
      </div>
      <div className="deployment-type-remark">{remarks}</div>
    </div>
  );
};
