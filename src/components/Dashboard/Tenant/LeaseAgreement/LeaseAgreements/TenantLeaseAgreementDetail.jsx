import React from "react";
import { useState } from "react";
import {
  updateTenantAutoRenewStatus,
} from "../../../../../api/tenants";
import { useEffect } from "react";
import UIButton from "../../../UIComponents/UIButton";
import AlertModal from "../../../UIComponents/Modals/AlertModal";
import UIPrompt from "../../../UIComponents/UIPrompt";
import DescriptionIcon from "@mui/icons-material/Description";
import { uiGreen } from "../../../../../constants";
import { Stack } from "@mui/material";
import LeaseCancellationDialog from "../LeaseCancellation/LeaseCancellationDialog";
import LeaseRenewalDialog from "../LeaseRenewal/LeaseRenewalDialog";
import { getTenantLeaseCancellationRequests } from "../../../../../api/lease_cancellation_requests";
import { getTenantLeaseRenewalRequests } from "../../../../../api/lease_renewal_requests";
import { getTenantInvoices } from "../../../../../api/tenants";
import { useNavigate } from "react-router";
import Joyride, {
  STATUS,
} from "react-joyride";
import UIHelpButton from "../../../UIComponents/UIHelpButton";
import UISwitch from "../../../UIComponents/UISwitch";
import { useParams } from "react-router";
import { getLeaseAgreementById } from "../../../../../api/lease_agreements";
import { authenticatedInstance } from "../../../../../api/api";
import PaymentCalendar from "../../PaymentCalendar";
import ProgressModal from "../../../UIComponents/Modals/ProgressModal";
import { preventPageReload } from "../../../../../helpers/utils";
const TenantLeaseAgreementDetail = () => {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [isPreparingDownload, setIsPreparingDownload] = useState(false);
  const [unitPreferences, setUnitPreferences] = useState(null);
  const navigate = useNavigate();
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
  const [autoRenewalEnabled, setAutoRenewalEnabled] = useState(false);
  const [
    hasExistingLeaseCancellationRequest,
    setHasExistingLeaseCancellationRequest,
  ] = useState(false);
  const [hasExistingLeaseRenewalRequest, setHasExistingLeaseRenewalRequest] =
    useState(false);
  const [totalAmountDue, setTotalAmountDue] = useState(0);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  // Create tour steps array tha inclued the classnames lease-agreement-page,lease-agreement-overview-section, and lease-agreement-document
  const tourSteps = [
    {
      target: ".lease-agreement-page",
      content:
        "This is the lease agreement page. Here you can view all the details of your lease agreement.",
      disableBeacon: true,
    },
    {
      target: ".lease-agreement-overview-section",
      content:
        "This is the lease agreement overview section. Here you can view all the details of your lease agreement.",
    },
    {
      target: ".lease-agreement-document",
      content: "This is the lease agreement document.",
    },
    {
      target: ".lease-cancellation-button",
      content:
        "Click here to request a lease cancellation. You can only request a lease cancellation if your lease agreement or owner allows it.",
    },
    {
      target: ".lease-renewal-button",
      content:
        "Click here to request a lease renewal. You can only request a lease renewal if your lease agreement or owner allows it.",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);

  };
  const openCancellationDialog = () => {
    let today = new Date();
    let leaseTerms = JSON.parse(unit.lease_terms);
    let cancellationNoticePeriod = leaseTerms.find(
      (term) => term.name === "lease_cancellation_notice_period"
    ).value;
    let leaseEndDate = new Date(leaseAgreement.end_date);

    // Calculate date notice period before the lease end date
    let noticePeriodBeforeEndDate = new Date(leaseEndDate);
    noticePeriodBeforeEndDate.setMonth(
      noticePeriodBeforeEndDate.getMonth() - cancellationNoticePeriod
    );




    // Check if today is before the notice period starts
    if (today < noticePeriodBeforeEndDate) {
      setAlertModalTitle("Lease Cancellation Notice Period");
      setAlertModalMessage(
        `You cannot cancel your lease at this time. Please try again after ${cancellationNoticePeriod} month(s) before the end of your lease.`
      );
      setShowAlertModal(true);

    } else if (hasExistingLeaseCancellationRequest) {
      setShowLeaseCancellationFormDialog(false);
      setAlertModalTitle("Existing Lease Cancellation Request");
      setAlertModalMessage(
        "You already have an existing lease cancellation request. You will be notified when the property manager responds."
      );
      setShowAlertModal(true);

    } else if (hasExistingLeaseRenewalRequest) {
      setShowLeaseCancellationFormDialog(false);
      setAlertModalTitle("Existing Lease Renewal Request");
      setAlertModalMessage(
        "You cannot cancel your lease at this time. You already have an existing lease renewal request. You will be notified when the property manager responds."
      );
      setShowAlertModal(true);

    } else {
      setShowLeaseCancellationFormDialog(true);
    }
  };

  const openRenewalDialog = () => {
    let today = new Date();
    let leaseTerms = JSON.parse(unit.lease_terms);
    let renewalNoticePeriod = leaseTerms.find(
      (term) => term.name === "lease_renewal_notice_period"
    ).value;
    let leaseEndDate = new Date(leaseAgreement.end_date);

    // Calculate date notice period before the lease end date
    let noticePeriodBeforeEndDate = new Date(leaseEndDate);
    noticePeriodBeforeEndDate.setMonth(
      noticePeriodBeforeEndDate.getMonth() - renewalNoticePeriod
    );




    // Check if today's date is within the notice period threshold before the end of the lease
    if (today < noticePeriodBeforeEndDate) {
      setAlertModalTitle("Lease Renewal Notice Period");
      setAlertModalMessage(
        `You cannot renew your lease at this time. Please try again ${renewalNoticePeriod} month(s) before the end of your lease.`
      );
      setShowAlertModal(true);
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
      setShowLeaseRenewalDialog(true);
    }
  };
  const changeAutoRenewal = (event) => {
    setAutoRenewalEnabled(event.target.checked);
    //Use the updateLEaseAgreement function to update the lease agreement with the new auto renewal status
    updateTenantAutoRenewStatus({
      auto_renew_lease_is_enabled: event.target.checked,
      tenant_id: leaseAgreement.tenant.id,
    })
      .then((res) => {

        if (res.status !== 200) {
          setAlertModalTitle("Error");
          setAlertModalMessage(
            "An error occurred while updating the lease agreement's auto renewal status"
          );
          setShowAlertModal(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "An error occurred while updating the lease agreement's auto renewal status"
        );
        setShowAlertModal(true);
      });
  };
  const handleDownloadDocument = async () => {
    setIsPreparingDownload(true);
    try {
      const response = await authenticatedInstance.post(
        "/boldsign/download-document/",
        { document_id: leaseAgreement.document_id },
        { responseType: "blob" } // This is important to handle binary data
      );

      if (response.status !== 200) {
        throw new Error("Error downloading document");
      }

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lease_agreement.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error:", error);
      setAlertModalTitle("Error");
      setAlertModalMessage(
        "An error occurred while downloading the lease agreement document. Please try again."
      );
      setShowAlertModal(true);
      return;
    } finally {
      setIsPreparingDownload(false);
    }
  };

  useEffect(() => {
    try {
      //Retrieve the unit
      getLeaseAgreementById(id).then((res) => {
        setLeaseAgreement(res.data);
        setLeaseTemplate(res.data.lease_template);
        setUnit(res.data.rental_unit);
        setAutoRenewalEnabled(res.data.auto_renew_lease_is_enabled);
        setUnitPreferences(JSON.parse(res.data.rental_unit.preferences));
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
      getTenantInvoices().then((res) => {
        let amountDue = 0;
        let amountPaid = 0;
        res.invoices.data.forEach((invoice) => {
          amountDue += invoice.amount_remaining;
          amountPaid += invoice.amount_paid;
        });


        setTotalAmountDue(amountDue / 100);
        setTotalAmountPaid(amountPaid / 100);
      });
    } catch (error) {
      console.error(error);
      setAlertModalTitle("Error");
      setAlertModalMessage(
        "An error occurred while fetching the lease agreement"
      );
      setShowAlertModal(true);
    }
    preventPageReload();
  },[]);

  return (
    <div className="container">
      <Joyride
        run={runTour}
        index={tourIndex}
        steps={tourSteps}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: uiGreen,
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip",
        }}
      />
      <AlertModal
        open={showAlertModal}
        onClick={() => {
          setShowAlertModal(false);
          navigate(0);
        }}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Okay"
      />
      <ProgressModal open={isPreparingDownload} title="Preparing download..." />
      {leaseAgreement ? (
        <div className="row lease-agreement-page">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <h4 className="my-3 ">My Lease Agreement</h4>
            <UIButton
              btnText="Download Lease Document"
              onClick={handleDownloadDocument}
            />
          </Stack>
          <div className="col-md-4">
            <div className="card mb-3 lease-agreement-overview-section">
              <div className="card-body">
                <h4 className="card-title text-black ">
                  Lease Agreement Overview
                </h4>
                {/* {unitPreferences.find(
                  (preference) => preference.name === "allow_lease_auto_renewal"
                ).value && (
                  <Stack
                    direction="row"
                    spacing={2}
                    alignContent={"center"}
                    alignItems={"center"}
                    sx={{ marginBottom: "14px" }}
                  >
                    <span className="text-black">Enable Auto Renewal </span>
                    <UISwitch
                      value={autoRenewalEnabled}
                      onChange={changeAutoRenewal}
                    />
                  </Stack>
                )} */}
                <div className="row">
                  <div className="col-sm-12 col-md-6 mb-4 text-black">
                    <h6 className="rental-application-lease-heading">
                      Total Amount Paid
                    </h6>
                    ${totalAmountPaid.toLocaleString()}
                  </div>
                  <div className="col-sm-12 col-md-6 mb-4 text-black">
                    <h6 className="rental-application-lease-heading">
                      Total Amount Due
                    </h6>
                    ${totalAmountDue.toLocaleString()}
                  </div>
                </div>
                {unit && (
                  <div className="row">
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">Unit</h6>
                      {unit.name}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">Rent</h6>
                      $
                      {
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "rent"
                        ).value
                      }
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">Term</h6>
                      {
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "term"
                        ).value
                      }{" "}
                      {
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "rent_frequency"
                        ).value
                      }
                      s
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Late Fee
                      </h6>
                      {`$${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "late_fee"
                        ).value
                      }`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Security Deposit
                      </h6>
                      {`$${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "security_deposit"
                        ).value
                      }`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Gas Included?
                      </h6>
                      {`${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "gas_included"
                        ).value
                          ? "Yes"
                          : "No"
                      }`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Electric Included?
                      </h6>
                      {`${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "electricity_included"
                        ).value
                          ? "Yes"
                          : "No"
                      }`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Water Included?
                      </h6>
                      {`${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "water_included"
                        ).value
                          ? "Yes"
                          : "No"
                      }`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Lease Cancellation Fee
                      </h6>
                      {`$${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "lease_cancellation_fee"
                        ).value
                      }`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Lease Cancellation Notice period
                      </h6>
                      {`${
                        JSON.parse(unit.lease_terms).find(
                          (term) =>
                            term.name === "lease_cancellation_notice_period"
                        ).value
                      } months`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Lease Renewal Fee
                      </h6>
                      {`$${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "lease_renewal_fee"
                        ).value
                      }`}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Lease Renewal Notice period
                      </h6>
                      {`${
                        JSON.parse(unit.lease_terms).find(
                          (term) => term.name === "lease_renewal_notice_period"
                        ).value
                      } months`}
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
            <div
              className="card payment-calendar-card mb-2"
              style={{ color: "white" }}
            >
              <div className="card-body ">
                <PaymentCalendar />
              </div>
            </div>
            <Stack direction="row" spacing={2}>
              {unitPreferences.find(
                (preference) => preference.name === "accept_lease_cancellations"
              ).value && (
                <div className="lease-cancellation-button">
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
                  <UIButton
                    btnText="Request Cancellation"
                    onClick={openCancellationDialog}
                  />
                </div>
              )}
              {unitPreferences.find(
                (preference) => preference.name === "accept_lease_renewals"
              ).value && (
                <div className="lease-renewal-button">
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
                  <UIButton
                    btnText="Request Renewal"
                    onClick={openRenewalDialog}
                  />
                </div>
              )}
            </Stack>
          </div>
          <UIHelpButton onClick={handleClickStart} />
        </div>
      ) : (
        <UIPrompt
          icon={<DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />}
          title="No Active Lease"
          message="You do not have an active lease. Please contact your owner to get started."
          body={<UIButton btnText="Apply for Lease" />}
        />
      )}
    </div>
  );
};

export default TenantLeaseAgreementDetail;
