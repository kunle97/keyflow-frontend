import React, { useEffect, useState } from "react";
import LeaseCancellationForm from "./LeaseCancellationForm";
import UIDialog from "../../../UIComponents/Modals/UIDialog";
import UIButton from "../../../UIComponents/UIButton";
import ConfirmModal from "../../../UIComponents/Modals/ConfirmModal";
import { uiRed } from "../../../../../constants";
const LeaseCancellationDialog = (props) => {
  const [leaseTerms, setLeaseTerms] = useState({});
  useEffect(() => {
    console.log("lease ageeementt",props.leaseAgreement);
    setLeaseTerms(JSON.parse(props.leaseAgreement?.lease_terms));
  }, []);
  return (
    <>
      {props.isOwnerMode ? (
        <>
          <ConfirmModal
            open={props.open}
            onClose={props.onClose}
            title="Request Lease Cancellation"
            message="Are you sure you want to request lease cancellation? Please besure that you have informed the tenant about the lease cancellation and are abiding by your state's tenant and eviction laws."
            handleClose={props.onClose}
            handleCancel={props.onClose}
            handleConfirm={props.onConfirmCancelLease}
            cancelBtnText={"Cancel"}
            confirmBtnText={"Cancel Lease Agreement"}
            confirmBtnStyle={{
              background: uiRed,
              color: "white",
            }}
          />
        </>
      ) : (
        <div>
          {" "}
          <UIDialog
            open={props.open}
            onClose={props.onClose}
            title="Request Lease Cancellation"
            style={{ padding: "15px" }}
          >
            {props.showLeaseCancellationForm ? (
              <LeaseCancellationForm
                leaseAgreement={props.leaseAgreement}
                setShowLeaseCancellationFormDialog={
                  props.setShowLeaseCancellationFormDialog
                }
                setAlertModalTitle={props.setAlertModalTitle}
                setAlertModalMessage={props.setAlertModalMessage}
                setShowAlertModal={props.setShowAlertModal}
              />
            ) : (
              <div className="row">
                <div className="col-md-12">
                  <p className="text-black">
                    Please note that you will be charged a lease cancellation
                    fee of $
                    {Array.isArray(leaseTerms) && leaseTerms?.find
                      ? leaseTerms.find(
                          (term) => term.name === "lease_cancellation_fee"
                        )?.value ?? 0
                      : 0}{" "}
                    if you cancel your lease before the end of the lease term.
                  </p>
                  <p className="text-black">
                    You will also be required to give a notice period of{" "}
                    {Array.isArray(leaseTerms)
                      ? leaseTerms.find(
                          (term) =>
                            term.name === "lease_cancellation_notice_period"
                        )?.value ?? 0
                      : 0}{" "}
                    month(s) before you can cancel your lease.
                  </p>
                  <p className="text-black">
                    If you wish to proceed, please click the button below to
                    continue.
                  </p>
                  <UIButton
                    dataTestId="lease-cancellation-request-dialog-continue-button"
                    btnText="Continue"
                    onClick={() => {
                      props.setShowLeaseCancellationForm(true);
                    }}
                  />
                </div>
              </div>
            )}
          </UIDialog>
        </div>
      )}
    </>
  );
};

export default LeaseCancellationDialog;
