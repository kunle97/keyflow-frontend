import React from "react";
import { useState } from "react";
import { getTenantDashboardData } from "../../../../api/tenants";
import { useEffect } from "react";
import UIButton from "../../UIComponents/UIButton";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import LeaseCancellationForm from "./LeaseCancellation/LeaseCancellationForm";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIPrompt from "../../UIComponents/UIPrompt";
import DescriptionIcon from "@mui/icons-material/Description";
import { uiGreen } from "../../../../constants";
import { set } from "react-hook-form";
import { Stack } from "@mui/material";
import LeaseCancellationDialog from "./LeaseCancellation/LeaseCancellationDialog";
import LeaseRenewalDialog from "./LeaseRenewal/LeaseRenewalDialog";
import { getTenantLeaseCancellationRequests } from "../../../../api/lease_cancellation_requests";
import { getTenantLeaseRenewalRequests } from "../../../../api/lease_renewal_requests";
const MyLeaseAgreement = () => {
  const [unit, setUnit] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [leaseTemplate, setLeaseTemplate] = useState(null);
  const [showLeaseCancellationDialog, setShowLeaseCancellationFormDialog] =
    useState(false);
  const [showLeaseCancellationForm, setShowLeaseCancellationForm] =
    useState(false);
  const [showLeaseRenewalDialog, setShowLeaseRenewalDialog] = useState(false);
  const [showLeaseRenewalForm, setShowLeaseRenewalForm] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [
    hasExistingLeaseCancellationRequest,
    setHasExistingLeaseCancellationRequest,
  ] = useState(false);
  const [hasExistingLeaseRenewalRequest, setHasExistingLeaseRenewalRequest] =
    useState(false);

  const openCancellationDialog = () => {
    let today = new Date();
    let noticePeriod = leaseTemplate.lease_cancellation_notice_period;
    let leaseStartDate = new Date(leaseAgreement.start_date);
    let leaseEndDate = new Date(leaseAgreement.end_date);

    // Calculate the date which falls within the notice period
    let noticeStartDate = new Date(leaseEndDate);
    noticeStartDate.setMonth(noticeStartDate.getMonth() - noticePeriod);

    console.log(
      "has existing cancellation",
      hasExistingLeaseCancellationRequest
    );
    if (today > leaseStartDate && today < noticeStartDate) {
      // Ensure today is after the lease start date but before the notice start date
      setAlertModalTitle("Lease Cancellation Notice Period");
      setAlertModalMessage(
        `You cannot cancel your lease at this time. Please try again after ${leaseTemplate.lease_cancellation_notice_period} month(s) before the end of your lease.`
      );
      setShowAlertModal(true);
      console.log("You cannot cancel your lease at this time");
    } else if (hasExistingLeaseCancellationRequest) {
      setShowLeaseCancellationFormDialog(false);
      setAlertModalTitle("Existing Lease Cancellation Request");
      setAlertModalMessage(
        "You already have an existing lease cancellation request. You will be notified when the property manager responds."
      );
      console.log("You cannot cancel your lease at this time");
      setShowAlertModal(true);
      return;
    } else if (hasExistingLeaseRenewalRequest) {
      setShowLeaseCancellationFormDialog(false);
      setAlertModalTitle("Existing Lease Renewal Request");
      setAlertModalMessage(
        "You cannot cancel your lease at this time. You already have an existing lease renewal request. You will be notified when the property manager responds."
      );
      console.log("You cannot cancel your lease at this time");
      setShowAlertModal(true);
      return;
    } else {
      setShowLeaseCancellationFormDialog(true);
    }
  };

  const openRenewalDialog = () => {
    let today = new Date();
    let noticePeriod = leaseTemplate.lease_cancellation_notice_period;
    let leaseStartDate = new Date(leaseAgreement.start_date);
    let leaseEndDate = new Date(leaseAgreement.end_date);

    // Calculate date 2 months before the lease end date
    let twoMonthsBeforeEndDate = new Date(leaseEndDate);
    twoMonthsBeforeEndDate.setMonth(twoMonthsBeforeEndDate.getMonth() - 2);

    // Check if today is at most 2 months before the end of the lease
    if (today >= twoMonthsBeforeEndDate) {
      // If yes, open the renewal dialog
      setShowLeaseRenewalDialog(true);
    } else if (hasExistingLeaseRenewalRequest) {
      setShowLeaseRenewalDialog(false);
      setAlertModalTitle("Existing Lease Renewal Request");
      setAlertModalMessage(
        "You already have an existing lease renewal request. You will be notified when the property manager responds."
      );
      setShowAlertModal(true);
    } else if (hasExistingLeaseCancellationRequest) {
      setShowLeaseRenewalDialog(false);
      setAlertModalTitle("Existing Lease Cancellation Request");
      setAlertModalMessage(
        "You cannot renew your lease at this time. You already have an existing lease cancellation request. You will be notified when the property manager responds."
      );
      setShowAlertModal(true);
    } else {
      // If no, show an error message
      setAlertModalTitle("Lease Renewal Notice Period");
      setAlertModalMessage(
        `You cannot renew your lease at this time. Please try again 2 month(s) before the end of your lease.`
      );
      setShowAlertModal(true);
    }
  };
  useEffect(() => {
    //Retrieve the unit
    getTenantDashboardData().then((res) => {
      console.log(res);
      setUnit(res.unit);
      setLeaseAgreement(res.lease_agreement);
      setLeaseTemplate(res.lease_template);
    });
    //Using the getTententLeaseCancellationRequests function check if the user has any existing lease cancellation requests. If they do display an error message and do not allow them to submit a new request and return from the function.
    getTenantLeaseCancellationRequests().then((res) => {
      if (res.status === 200) {
        //Check if any of the requests are pending
        let pending_lc_requests = res.data.filter(
          (lc_request) => lc_request.status === "Pending"
        );
        if (pending_lc_requests.length > 0) {
          setHasExistingLeaseCancellationRequest(true);
        }
      }
    });
    getTenantLeaseRenewalRequests().then((res) => {
      if (res.status === 200) {
        if (res.data.length > 0) {
          setHasExistingLeaseRenewalRequest(true);
        }
      }
    });
  }, []);

  return (
    <>
      {leaseAgreement ? (
        <div className="row">
          <AlertModal
            open={showAlertModal}
            onClick={() => setShowAlertModal(false)}
            title={alertModalTitle}
            message={alertModalMessage}
            btnText="Okay"
          />
          <h4 className="my-3 ">My Lease Agreement</h4>
          <div className="col-md-4">
            <div className="card my-3">
              <div className="card-body">
                <h4 className="card-title text-black mb-4">
                  Lease Agreement Overview
                </h4>
                {leaseTemplate && (
                  <div className="row">
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">Unit</h6>
                      {unit.name}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">Rent</h6>
                      ${leaseTemplate.rent}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">Term</h6>
                      {leaseTemplate.term} Months
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Late Fee
                      </h6>
                      {`$${leaseTemplate.late_fee}`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Security Deposit
                      </h6>
                      {`$${leaseTemplate.security_deposit}`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Gas Included?
                      </h6>
                      {`${leaseTemplate.gas_included ? "Yes" : "No"}`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Electric Included?
                      </h6>
                      {`${leaseTemplate.electric_included ? "Yes" : "No"}`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Water Included?
                      </h6>
                      {`${leaseTemplate.water_included ? "Yes" : "No"}`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Lease Cancellation Fee
                      </h6>
                      {`$${leaseTemplate.lease_cancellation_fee}`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Lease Cancellation Notice period
                      </h6>
                      {`${leaseTemplate.lease_cancellation_notice_period} Month(s)`}
                    </div>
                    <div
                      className="col-sm-12 col-md-6 mb-4 text-black"
                      style={{ marginTop: "20px" }}
                    >
                      <h6 className="rental-application-lease-heading">
                        Lease Start Date
                      </h6>
                      {leaseAgreement.start_date}
                    </div>
                    <div
                      className="col-sm-12 col-md-6 mb-4 text-black"
                      style={{ marginTop: "20px" }}
                    >
                      <h6 className="rental-application-lease-heading">
                        Lease End Date
                      </h6>
                      {leaseAgreement.end_date}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card my-3" style={{ height: "850px" }}>
              {/* PDF Viewer Goes Here */}
            </div>
            <Stack direction="row" spacing={2}>
              <UIButton
                btnText="Request Cancellation"
                onClick={openCancellationDialog}
              />
              <UIButton btnText="Request Renewal" onClick={openRenewalDialog} />
            </Stack>
          </div>
          <LeaseCancellationDialog
            open={showLeaseCancellationDialog}
            onClose={() => setShowLeaseCancellationFormDialog(false)}
            leaseAgreement={leaseAgreement}
            setShowLeaseCancellationFormDialog={
              setShowLeaseCancellationFormDialog
            }
            showLeaseCancellationForm={showLeaseCancellationForm}
            setShowLeaseCancellationForm={setShowLeaseCancellationForm}
            setAlertModalTitle={setAlertModalTitle}
            setAlertModalMessage={setAlertModalMessage}
            setShowAlertModal={setShowAlertModal}
          />
          <LeaseRenewalDialog
            open={showLeaseRenewalDialog}
            onClose={() => setShowLeaseRenewalDialog(false)}
            leaseAgreement={leaseAgreement}
            setShowLeaseRenewalDialog={setShowLeaseRenewalDialog}
            showLeaseRenewalForm={showLeaseRenewalForm}
            setShowLeaseRenewalForm={setShowLeaseRenewalForm}
            setAlertModalTitle={setAlertModalTitle}
            setAlertModalMessage={setAlertModalMessage}
            setShowAlertModal={setShowAlertModal}
          />
        </div>
      ) : (
        <UIPrompt
          icon={<DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />}
          title="No Active Lease"
          message="You do not have an active lease. Please contact your landlord to get started."
          body={<UIButton btnText="Apply for Lease" />}
        />
      )}
    </>
  );
};

export default MyLeaseAgreement;
