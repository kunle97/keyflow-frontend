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
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const LeaseRenewalRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaseRenewalRequest, setLeaseRenewalRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [nextPaymentDate, setNextPaymentDate] = useState(null); //TODO: get next payment date from db and set here
  const [dueDates, setDueDates] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [currentLeaseAgreement, setCurrentLeaseAgreement] = useState(null); //TODO: get current lease agreement from db and set here
  const [currentLeaseTemplate, setCurrentLeaseTemplate] = useState(null); //TODO: get current lease template from db and set here
  const [currentLeaseTerms, setCurrentLeaseTerms] = useState(null);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
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
    console.log(runTour);
  };

  const columns = [
    { name: "amount", label: "Amount" },
    { name: "due_date", label: "Due Date" },
    { name: "status", label: "Status" },
  ];

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
        console.log(res);
        if (res.status === 204) {
          setAlertModalTitle("Success");
          setAlertModalMessage("Lease renewal request rejected!");
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
                console.log("Tenant's Lease agreements ", res);
                const lease_agreements = res.data;
                const current_lease_agreement = lease_agreements.find(
                  (lease_agreement) => lease_agreement.is_active === true
                );
                setCurrentLeaseAgreement(current_lease_agreement);
                setCurrentLeaseTemplate(current_lease_agreement.lease_template);
                setCurrentLeaseTerms(
                  JSON.parse(current_lease_agreement.rental_unit.lease_terms)
                );

                console.log("Current Lease Agreement", current_lease_agreement);
                getTenantInvoices(lease_renewal_res.data.tenant.id).then(
                  (res) => {
                    setInvoices(res.invoices.data);
                    console.log(res.invoices.data);
                    const due_dates = res.invoices.data.map((invoice) => {
                      if (!invoice.paid) {
                        let date = new Date(invoice.due_date * 1000);
                        return {
                          amount: invoice.amount_due,
                          title: "Rent Due",
                          due_date: date.toLocaleDateString(),
                          status: "Unpaid",
                        };
                      } else if (invoice.paid) {
                        let date = new Date(
                          invoice.status_transitions.paid_at * 1000
                        );
                        return {
                          amount: invoice.amount_due,
                          title: "Rent Paid",
                          due_date: date.toLocaleDateString(),
                          status: "Paid",
                        };
                      }
                    });
                    console.log(due_dates);
                    setDueDates(due_dates);
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
        console.log(err);
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong. Please try again later.");
        setShowAlertModal(true);
      })
      .finally(() => setIsLoading(false));
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
              {leaseRenewalRequest.tenant.user.first_name}{" "}
              {leaseRenewalRequest.tenant.user.last_name}'s Lease Renewal
              Request ({leaseRenewalRequest.status})
            </h4>
            {/* {leaseRenewalRequest.status !== "approved" &&
              !isMobile &&
              actionStack} */}
          </Stack>

          <div className="row">
            {currentLeaseAgreement && (
              <div className="col-md-6 align-self-center">
                <div className="card mb-3  current-lease-agreement-details-card">
                  <div className="card-body">
                    <div className="row">
                      <h5 className="mb-3">Current Lease Agreement Details</h5>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6 className="rental-application-lease-heading">
                          Current Unit
                        </h6>
                        {currentLeaseAgreement.rental_unit.name}
                      </div>{" "}
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6 className="rental-application-lease-heading">
                          Curent Term
                        </h6>
                        {
                          currentLeaseTerms.find((term) => term.name === "term")
                            .value
                        }{" "}
                        {
                          currentLeaseTerms.find(
                            (term) => term.name === "rent_frequency"
                          ).value
                        }
                        (s)
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6 className="rental-application-lease-heading">
                          Property
                        </h6>
                        {currentLeaseAgreement.rental_unit.rental_property_name}
                      </div>{" "}
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6 className="rental-application-lease-heading">
                          Rent
                        </h6>
                        $
                        {
                          currentLeaseTerms.find((term) => term.name === "rent")
                            .value
                        }
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6 className="rental-application-lease-heading">
                          Lease Start Date
                        </h6>
                        {new Date(
                          currentLeaseAgreement.start_date
                        ).toLocaleDateString()}
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4 text-black">
                        <h6 className="rental-application-lease-heading">
                          Lease End Date
                        </h6>
                        {new Date(
                          currentLeaseAgreement.end_date
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-6 align-self-center">
              <div className="card mb-3 lease-renewal-request-details-card">
                <div className="card-body">
                  <div className="row">
                    <h5 className="mb-3">Lease Renewal Request Details</h5>{" "}
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Requested Unit
                      </h6>
                      {leaseRenewalRequest.rental_unit.name}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Requested Lease Term
                      </h6>
                      {leaseRenewalRequest.request_term}{" "}
                      {leaseRenewalRequest.rent_frequency}(s)
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Desired Move In Date
                      </h6>
                      {new Date(
                        leaseRenewalRequest.move_in_date
                      ).toLocaleDateString()}
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Date Submitted
                      </h6>
                      {new Date(
                        leaseRenewalRequest.request_date
                      ).toLocaleDateString()}
                    </div>
                    <div className="col-sm-12 col-md-12 mb-4 text-black">
                      <h6 className="rental-application-lease-heading">
                        Additional Comments
                      </h6>
                      {leaseRenewalRequest.comments}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 tenant-bills-list">
              {isMobile ? (
                <UITableMobile
                  showCreate={false}
                  title="Invoices"
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
                />
              ) : (
                <UITable
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
                />
              )}
            </div>
          </div>
          {leaseRenewalRequest.status !== "approved" && actionStack}
        </>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default LeaseRenewalRequestDetail;
