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
        title="Request Lease Renewal"
        style={{ padding: "15px" }}
      >
        {props.showLeaseRenewalForm ? (
          <LeaseRenewalForm
            leaseAgreement={props.leaseAgreement}
            setShowLeaseRenewalDialog={props.setShowLeaseRenewalDialog}
            setAlertModalTitle={props.setAlertModalTitle}
            setAlertModalMessage={props.setAlertModalMessage}
            setShowAlertModal={props.setShowAlertModal}
          />
        ) : (
          <div className="row">
            <div className="col-md-12">
              <p className="text-black" style={{ fontSize: "15pt" }}>
                Please note that your lease renewal may be subject to a change
                in rent, security deposit, utility charges, and other lease
                terms.
              </p>
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
