import React from "react";
import LeaseRenewalForm from "./LeaseRenewalForm";
import UIDialog from "../../../UIComponents/Modals/UIDialog";
import UIButton from "../../../UIComponents/UIButton";

const LeaseRenewalDialog = (props) => {
  return (
    <div>
      <UIDialog
        open={props.open}
        onClose={props.onClose}
        title={
          props.isOwnerMode
            ? "Renew Tenant Lease Agreement"
            : "Request Lease Renewal"
        }
        style={{ padding: "15px" }}
      >
        {props.showLeaseRenewalForm ? (
          <LeaseRenewalForm
            leaseAgreement={props.leaseAgreement}
            setShowLeaseRenewalDialog={props.setShowLeaseRenewalDialog}
            setAlertModalTitle={props.setAlertModalTitle}
            setAlertModalMessage={props.setAlertModalMessage}
            setShowAlertModal={props.setShowAlertModal}
            isOwnerMode={props.isOwnerMode}
            tenant={props.tenant}
          />
        ) : (
          <div className="row">
            <div className="col-md-12">
              {props.isOwnerMode ? (
                <p className="text-black" style={{ fontSize: "12pt" }}>
                  You are about to renew the lease for your tenant. Please
                  review the lease renewal terms on the next page before
                  sending.
                </p>
              ) : (
                <p className="text-black" style={{ fontSize: "12pt" }}>
                  You are about to request a lease renewal from your landlord.
                  Please review the lease renewal terms below before sending the
                  request.
                </p>
              )}
              <UIButton
                btnText="Continue"
                onClick={() => {
                  props.setShowLeaseRenewalForm(true);
                }}
              />
            </div>
          </div>
        )}
      </UIDialog>
    </div>
  );
};

export default LeaseRenewalDialog;
