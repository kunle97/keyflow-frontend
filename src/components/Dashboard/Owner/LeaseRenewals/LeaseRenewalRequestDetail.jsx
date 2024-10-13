import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { uiGreen, uiRed, uiGrey2 } from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import { Stack } from "@mui/material";
import {
  getLeaseRenewalRequestById,
  rejectLeaseRenewalRequest,
} from "../../../../api/lease_renewal_requests";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import { getLeaseAgreementsByTenant } from "../../../../api/lease_agreements";
import UITable from "../../UIComponents/UITable/UITable";
import BackButton from "../../UIComponents/BackButton";
import useScreen from "../../../../hooks/useScreen";
import { getTenantInvoices } from "../../../../api/tenants";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const LeaseRenewalRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaseRenewalRequest, setLeaseRenewalRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dueDates, setDueDates] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [currentLeaseAgreement, setCurrentLeaseAgreement] = useState(null); //TODO: get current lease agreement from db and set here
  const [currentLeaseTemplate, setCurrentLeaseTemplate] = useState(null); //TODO: get current lease template from db and set here
  const [currentLeaseTerms, setCurrentLeaseTerms] = useState(null);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".current-lease-agreement-details-card",
      content:
        "This is the current lease agreement details card. Here you can view the details of the current lease agreement.",
      disableBeacon: true,
    },
    {
      target: ".lease-renewal-request-details-card",
      content:
        "This is the lease renewal request details card. Here you can view the details of the lease renewal request.",
    },
    {
      target: ".tenant-bills-list",
      content: "This is the list of all the tenant's bills.",
    },
    {
      target: "#reject-lease-renewal-button",
      content: "Click here to reject the lease renewal request.",
    },
    {
      target: "#accept-lease-renewal-button",
      content: "Click here to accept the lease renewal request.",
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

  const rent_payment_columns = [
    {
      label: "Type",
      name: "metadata",
      options: {
        customBodyRender: (value) => {
          return removeUnderscoresAndCapitalize(value.type);
        },
      },
    },
    {
      label: "Amount Due",
      name: "amount_remaining",
      options: {
        orderingField: "amount_remaining",
        customBodyRender: (value) => {
          const amountDue = `$${String(value / 100).toLocaleString("en-US")}`;

          return (
            <span
              style={{
                color: uiRed,
              }}
            >
              {amountDue}
            </span>
          );
        },
      },
    },
    {
      label: "Amount Paid",
      name: "amount_paid",
      options: {
        orderingField: "amount_paid",
        customBodyRender: (value) => {
          const amountPaid = `$${String(value / 100).toLocaleString("en-US")}`;
          return (
            <span
              style={{
                color: uiGreen,
              }}
            >
              {amountPaid}
            </span>
          );
        },
      },
    },
    {
      label: "Date Due",
      name: "due_date",
      options: {
        orderingField: "due_date",
        customBodyRender: (value) => {
          return new Date(value * 1000).toLocaleDateString();
        },
      },
    },
  ];

  const { isMobile } = useScreen();
  const handleReject = () => {
    rejectLeaseRenewalRequest({
      lease_renewal_request_id: leaseRenewalRequest.id,
    })
      .then((res) => {
        if (res.status === 204) {
          setAlertModalTitle("Success");
          setAlertModalMessage("Lease renewal request rejected.");
          setShowAlertModal(true);
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong!");
          setShowAlertModal(true);
        }
      })
      .catch((error) => {
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong!");
        setShowAlertModal(true);
      });
  };

  const actionStack = (
    <Stack
      direction="row"
      gap={2}
      justifyContent={"end"}
      sx={{ margin: "30px 0" }}
    >
      <UIButton
        id="reject-lease-renewal-button"
        onClick={setOpenRejectModal}
        variant="contained"
        style={{ backgroundColor: uiRed }}
        btnText="Reject"
      />
      <UIButton
        id="accept-lease-renewal-button"
        onClick={() =>
          navigate("/dashboard/owner/lease-renewal-accept-form/" + id)
        }
        variant="contained"
        style={{ background: uiGreen }}
        btnText="Reveiw & Accept"
      />
    </Stack>
  );
  useEffect(() => {
    setIsLoading(true);
    getLeaseRenewalRequestById(id)
      .then((lease_renewal_res) => {
        if (lease_renewal_res.status === 200) {
          setLeaseRenewalRequest(lease_renewal_res.data);
          if (!currentLeaseAgreement || !currentLeaseTemplate) {
            getLeaseAgreementsByTenant(lease_renewal_res.data.tenant.id).then(
              (res) => {
                const lease_agreements = res.data;
                console.log("tenant lease agreements: ", lease_agreements);
                const current_lease_agreement = lease_agreements.find(
                  (lease_agreement) => lease_agreement.is_active === true
                );
                setCurrentLeaseAgreement(current_lease_agreement);
                setCurrentLeaseTemplate(
                  current_lease_agreement?.lease_template
                );
                setCurrentLeaseTerms(
                  current_lease_agreement
                    ? JSON.parse(
                        current_lease_agreement?.lease_terms
                      )
                    : []
                );
                getTenantInvoices(lease_renewal_res.data.tenant.id).then(
                  (res) => {
                    setInvoices(res.invoices);
                  }
                );
              }
            );
          }
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong!");
          setShowAlertModal(true);
        }
      })
      .catch((err) => {
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong. Please try again later.");
        setShowAlertModal(true);
      })
      .finally(() => setIsLoading(false));
      console.log("currnt lease terms: ",currentLeaseTerms);
  }, []);

  return (
    <div className="container-fluid">
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
      <BackButton to="/dashboard/owner/lease-renewal-requests/" />
      <AlertModal
        open={showAlertModal}
        onClick={() => navigate("/dashboard/owner/lease-renewal-requests/")}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Okay"
      />

      <ConfirmModal
        open={openRejectModal}
        onClick={() => setOpenRejectModal(false)}
        title="Reject Lease Renewal Request"
        message="Are you sure you want to reject this lease renewal request? The tenant will be notified."
        btnText="Reject"
        handleConfirm={handleReject}
        handleCancel={() => setOpenRejectModal(false)}
        cancelBtnText="Cancel"
        confirmBtnText="Reject"
        cancelBtnStyle={{ backgroundColor: uiGrey2 }}
        confirmBtnStyle={{ backgroundColor: uiRed }}
      />
      {isLoading ? (
        <UIProgressPrompt
          title="Hang tight!"
          message="Please wait while we load the lease renewal request details..."
        />
      ) : (
        <>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <h4
              style={{ color: uiGrey2, fontSize: isMobile ? "15pt" : "24pt" }}
            >
              {" "}
              {leaseRenewalRequest?.tenant.user.first_name}{" "}
              {leaseRenewalRequest?.tenant.user.last_name}'s Lease Renewal
              Request ({leaseRenewalRequest?.status})
            </h4>
          </Stack>

          <div className="row">
            {currentLeaseAgreement && (
              <div className="col-md-6 align-self-center">
                <div className="card mb-3  current-lease-agreement-details-card">
                  <div className="card-body">
                    <div className="row">
                      <h5
                        className="mb-3"
                        data-testId="current-lease-agreement-heading"
                      >
                        Current Lease Agreement Details
                      </h5>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6
                          className="rental-application-lease-heading"
                          data-testId="current-lease-agreement-unit-heading"
                        >
                          Unit
                        </h6>

                        <span data-testId="current-lease-agreement-unit-value">
                          {currentLeaseAgreement?.rental_unit.name}
                        </span>
                      </div>{" "}
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6
                          className="rental-application-lease-heading"
                          data-testId="current-lease-agreement-term-heading"
                        >
                          Term
                        </h6>
                        <span data-testId="current-lease-agreement-term-value">
                          {
                            currentLeaseTerms?.find(
                              (term) => term.name === "term"
                            ).value
                          }{" "}
                        </span>
                        <span data-testId="current-lease-agreement-rent-frequency-value">
                          {
                            currentLeaseTerms?.find(
                              (term) => term.name === "rent_frequency"
                            ).value
                          }
                        </span>
                        (s)
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6
                          className="rental-application-lease-heading"
                          data-testId="current-lease-agreement-property-heading"
                        >
                          Property
                        </h6>
                        <span data-testId="current-lease-agreement-property-value">
                          {
                            currentLeaseAgreement?.rental_unit
                              .rental_property_name
                          }
                        </span>
                      </div>{" "}
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6
                          className="rental-application-lease-heading"
                          data-testId="current-lease-agreement-rent-heading"
                        >
                          Rent
                        </h6>
                        <span data-testId="current-lease-agreement-rent-value">
                          $
                          {
                            currentLeaseTerms?.find(
                              (term) => term.name === "rent"
                            ).value
                          }
                        </span>
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6
                          className="rental-application-lease-heading"
                          data-testId="current-lease-agreement-start-date-heading"
                        >
                          Lease Start Date
                        </h6>
                        <span data-testId="current-lease-agreement-start-date-value">
                          {new Date(
                            currentLeaseAgreement?.start_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6
                          className="rental-application-lease-heading"
                          data-testId="current-lease-agreement-end-date-heading"
                        >
                          Lease End Date
                        </h6>
                        <span data-testId="current-lease-agreement-end-date-value">
                          {new Date(
                            currentLeaseAgreement?.end_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`col-md-${
                currentLeaseAgreement ? "6" : "12"
              } align-self-center`}
            >
              <div className="card mb-3 lease-renewal-request-details-card">
                <div className="card-body">
                  <div className="row">
                    <h5
                      className="mb-3"
                      data-testId="lease-renewal-request-details-heading"
                    >
                      Lease Renewal Request Details
                    </h5>{" "}
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6
                        className="rental-application-lease-heading"
                        data-testId="lease-renewal-request-unit-heading"
                      >
                        Requested Unit
                      </h6>
                      <span data-testId="lease-renewal-request-unit-value">
                        {leaseRenewalRequest?.rental_unit.name}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6
                        className="rental-application-lease-heading"
                        data-testId="lease-renewal-request-term-heading"
                      >
                        Requested Lease Term
                      </h6>
                      <span data-testId="lease-renewal-request-term-value">
                        {leaseRenewalRequest?.request_term}{" "}
                      </span>
                      <span data-testId="lease-renewal-request-rent-frequency-value">
                        {leaseRenewalRequest?.rent_frequency}
                      </span>
                      (s)
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6
                        className="rental-application-lease-heading"
                        data-testId="lease-renewal-request-desired-move-in-date-heading"
                      >
                        Desired Move In Date
                      </h6>
                      <span data-testId="lease-renewal-request-desired-move-in-date-value">
                        {new Date(
                          leaseRenewalRequest?.move_in_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6
                        className="rental-application-lease-heading"
                        data-testId="lease-renewal-request-date-submitted-heading"
                      >
                        Date Submitted
                      </h6>
                      <span data-testId="lease-renewal-request-date-submitted-value">
                        {new Date(
                          leaseRenewalRequest?.request_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-12 mb-4 text-black">
                      <h6
                        className="rental-application-lease-heading"
                        data-testId="lease-renewal-request-additional-comments-heading"
                      >
                        Additional Comments
                      </h6>
                      <span data-testId="lease-renewal-request-additional-comments-value">
                        {leaseRenewalRequest?.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 tenant-bills-list">
              {isMobile ? (
                <UITableMobile
                  showCreate={false}
                  tableTitle="Invoices"
                  data={invoices}
                  createInfo={(row) =>
                    `${removeUnderscoresAndCapitalize(row.metadata.type)}`
                  }
                  createSubtitle={(row) =>
                    `$${String(row.amount_due / 100).toLocaleString("en-US")}`
                  }
                  createTitle={(row) => {
                    return (
                      <span
                        style={{
                          color: row.paid ? uiGreen : uiRed,
                        }}
                      >
                        {row.paid
                          ? "Paid"
                          : "Due " +
                            new Date(row.due_date * 1000).toLocaleDateString()}
                      </span>
                    );
                  }}
                  onRowClick={(row) => {
                    navigate(`/dashboard/tenant/bills/${row.id}`);
                  }}
                  orderingFields={[
                    {
                      field: "created_at",
                      label: "Date Created (Ascending)",
                    },
                    {
                      field: "-created_at",
                      label: "Date Created (Descending)",
                    },
                    { field: "type", label: "Transaction Type (Ascending)" },
                    {
                      field: "-type",
                      label: "Transaction Type (Descending)",
                    },
                    { field: "amount", label: "Amount (Ascending)" },
                    { field: "-amount", label: "Amount (Descending)" },
                  ]}
                  searchFields={[
                    "metadata.type",
                    "metadata.description",
                    "amount_due",
                  ]}
                />
              ) : (
                <UITable
                  dataTestId="tenant-bills-list"
                  columns={rent_payment_columns}
                  options={{
                    isSelectable: false,
                  }}
                  title="Bills"
                  showCreate={false}
                  data={invoices}
                  menuOptions={[
                    {
                      name: "Details",
                      onClick: (row) => {
                        navigate(`/dashboard/tenant/bills/${row.id}`);
                      },
                    },
                  ]}
                  searchFields={[
                    "metadata.type",
                    "metadata.description",
                    "amount_due",
                  ]}
                />
              )}
            </div>
          </div>
          {leaseRenewalRequest?.status !== "approved" && actionStack}
        </>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default LeaseRenewalRequestDetail;
