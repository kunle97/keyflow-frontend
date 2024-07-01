import React from "react";
import TenantInviteForm from "./TenantInviteForm";

const CreateTenantInvite = (props) => {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <TenantInviteForm showFormTitle={true} />
        </div>
      </div>
    </div>
  );
};

export default CreateTenantInvite;
