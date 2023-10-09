import React from "react";

export const DeploymentTypeLabel = ({ deploymentType, remarks }) => {
  return (
    <div>
      <div className="deploymentTypeContainer">
        {deploymentType.map((type, index) => {
          if (type === "DNS")
            return (
              <div key={index} className="deploymentTypeDNS">
                DNS
              </div>
            );
          if (type === "DID")
            return (
              <div key={index} className="deploymentTypeDID">
                DID
              </div>
            );
        })}
      </div>
      <div className="deploymentTypeRemark">{remarks}</div>
    </div>
  );
};
