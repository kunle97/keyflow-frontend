import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getLeaseCancellationRequestById,
  approveLeaseCancellationRequest,
  denyLeaseCancellationRequest,
} from "../../../../api/lease_cancellation_requests";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import { Stack } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { uiGreen, uiGrey2, uiRed } from "../../../../constants";
import UITableMini from "../../UIComponents/UITable/UITableMini";
import {
  getNextPaymentDate,
  getPaymentDates,
} from "../../../../api/manage_subscriptions";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import BackButton from "../../UIComponents/BackButton";
import useScreen from "../../../../hooks/useScreen";
import { getTenantInvoices } from "../../../../api/tenants";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import UITable from "../../UIComponents/UITable/UITable";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const LeaseCancellationRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [leaseCancellationRequest, setLeaseCancellationRequest] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [nextPaymentDate, setNextPaymentDate] = useState(null); //TODO: get next payment date from db and set here
  const [dueDates, setDueDates] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [currentLeaseTerms, setCurrentLeaseTerms] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-cancellation-request-details-card",
      content:
        "This is the lease cancellation request details card. Here you can view the details of the lease cancellation request.",
      disableBeacon: true,
    },
    {
      target: ".current-lease-agreement-details-card",
      content:
        "This is the current lease agreement details card. Here you can view the details of the current lease agreement.",
    },
    {
      target: ".tenant-bills-list",
      content: "This is the list of all the tenant's bills.",
    },
    {
      target: "#reject-lease-cancellation-button",
      content: "Click here to reject the lease cancellation request.",
    },
    {
      target: "#accept-lease-cancellation-button",
      content: "Click here to accept the lease cancellation request.",
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

  const handleAccept = () => {
    setIsLoadingAccept(true);
    setOpenAcceptModal(false);
    approveLeaseCancellationRequest({
      lease_agreement_id: leaseCancellationRequest.lease_agreement.id,
      lease_cancellation_request_id: leaseCancellationRequest.id,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          setAlertModalTitle("Success");
          setAlertModalMessage("Lease cancellation request accepted!");
          setShowAlertModal(true);
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong!");
          setShowAlertModal(true);
        }
      })
      .finally(() => setIsLoadingAccept(false));
  };

  const handleReject = () => {
    denyLeaseCancellationRequest({
      lease_agreement_id: leaseCancellationRequest.lease_agreement.id,
      lease_cancellation_request_id: leaseCancellationRequest.id,
    }).then((res) => {
      console.log(res);
      if (res.status === 204) {
        setAlertModalTitle("Success");
        setAlertModalMessage("Lease cancellation request rejected!");
        setShowAlertModal(true);
      } else {
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong!");
        setShowAlertModal(true);
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getLeaseCancellationRequestById(id)
      .then((lease_cancellation_res) => {
        console.log(lease_cancellation_res.status);
        if (lease_cancellation_res.status === 200) {
          setLeaseCancellationRequest(lease_cancellation_res.data);
          // getNextPaymentDate(lease_cancellation_res.data.tenant.id).then(
          //   (res) => {
          //     console.log("nExt pay date data", res);
          //     setNextPaymentDate(
          //       new Date(res.data.next_payment_date).toLocaleDateString()
          //     );
          //   }
          // );
          setCurrentLeaseTerms(
            JSON.parse(lease_cancellation_res.data.rental_unit.lease_terms)
          );

          getTenantInvoices(lease_cancellation_res.data.tenant.id).then(
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
          // getPaymentDates(lease_cancellation_res.data.tenant.id).then((res) => {
          //   if (res.status === 200) {
          //     const payment_dates = res.data.payment_dates;
          //     console.log("Payment dates ", payment_dates);
          //     const due_dates = payment_dates.map((date) => {
          //       return {
          //         amount:
          //           lease_cancellation_res.data.lease_agreement.lease_template
          //             .rent,
          //         title: "Rent Due",
          //         due_date: new Date(date.payment_date).toLocaleDateString(),
          //         status: date.transaction_paid ? "Paid" : "Unpaid",
          //       };
          //     });
          //     setDueDates(due_dates);
          //     console.log("Due dates ", due_dates);
          //   }
          // });
        } else {
          navigate("/dashboard/owner/lease-cancellation-requests/");
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong!");
          setShowAlertModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertModalTitle("Error");
        setAlertModalMessage("Something went wrong!");
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
      <BackButton to={`/dashboard/owner/lease-cancellation-requests/`} />
      <ProgressModal
        open={isLoadingAccept}
        title="Cancelling Lease Agreement..."
      />
      <AlertModal
        open={showAlertModal}
        onClick={() => {
          setShowAlertModal(false);
          navigate("/dashboard/owner/lease-cancellation-requests/");
        }}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Okay"
      />
      <ConfirmModal
        open={openAcceptModal}
        onClick={() => setOpenAcceptModal(false)}
        title="Accept Lease Cancellation Request"
        message="Are you sure you want to accept this lease cancellation request? The lease agreement will be terminated and the tenant will be notified."
        btnText="Accept"
        handleConfirm={handleAccept}
        handleCancel={() => setOpenAcceptModal(false)}
        cancelBtnText="Cancel"
        confirmBtnText="Accept"
      />
      <ConfirmModal
        open={openRejectModal}
        onClick={() => setOpenRejectModal(false)}
        title="Reject Lease Cancellation Request"
        message="Are you sure you want to reject this lease cancellation request? The tenant will be notified."
        btnText="Reject"
        handleConfirm={handleReject}
        handleCancel={() => setOpenRejectModal(false)}
        cancelBtnText="Cancel"
        confirmBtnText="Reject"
      />
      {isLoading ? (
        <UIProgressPrompt
          title="Hang tight!"
          message="Please wait while we load the lease cancellation request details..."
        />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6 lease-cancellation-request-details-card">
              <h5
                className="mb-3"
                // style={{ color: uiGrey2, fontSize: isMobile ? "15pt" : "24pt" }}
              >
                {" "}
                {leaseCancellationRequest.tenant.user.first_name}{" "}
                {leaseCancellationRequest.tenant.user.last_name}'s Lease
                Cancellation Request
              </h5>
              <div className="card my-3">
                <div className="card-body">
                  <div className="row">
                    {" "}
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Reason
                      </h6>
                      <span className="text-dark">
                        {leaseCancellationRequest.reason}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Status
                      </h6>
                      <span className="text-dark">
                        {leaseCancellationRequest.status}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Date Requested
                      </h6>
                      <span className="text-dark">
                        {new Date(
                          leaseCancellationRequest.request_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Date Submitted
                      </h6>
                      <span className="text-dark">
                        {new Date(
                          leaseCancellationRequest.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-12 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Additional Comments
                      </h6>
                      <span className="text-dark">
                        {leaseCancellationRequest.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 current-lease-agreement-details-card">
              <h5 className="mb-3">Current Lease Agreement Details</h5>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Property
                      </h6>
                      <span className="text-dark">
                        {leaseCancellationRequest.rental_property.name}
                      </span>
                    </div>{" "}
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">Unit</h6>
                      <span className="text-dark">
                        {leaseCancellationRequest.rental_unit.name}
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">Rent</h6>
                      <span className="text-dark">
                        $
                        {
                          currentLeaseTerms.find((term) => term.name === "rent")
                            .value
                        }
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">Term</h6>
                      <span className="text-dark">
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
                      </span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Lease Cancellation Fee
                      </h6>
                      <span className="text-dark">{`$${
                        currentLeaseTerms.find(
                          (term) => term.name === "lease_cancellation_fee"
                        ).value
                      }`}</span>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-4">
                      <h6 className="rental-application-lease-heading">
                        Next Payment Date
                      </h6>
                      {/* <span className="text-dark">{nextPaymentDate}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`col-md-12 ${isMobile && "mt-3"} tenant-bills-list`}
            >
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
                    {
                      field: "type",
                      label: "Transaction Type (Ascending)",
                    },
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
          <Stack
            direction="row"
            gap={2}
            justifyContent={"flex-end"}
            sx={{ margin: "30px 0" }}
          >
            <UIButton
              id="reject-lease-cancellation-button"
              onClick={setOpenRejectModal}
              variant="contained"
              style={{ backgroundColor: uiRed }}
              btnText="Reject"
            />
            <UIButton
              id="accept-lease-cancellation-button"
              onClick={setOpenAcceptModal}
              variant="contained"
              style={{ background: uiGreen }}
              btnText="Accept"
            />
          </Stack>
        </>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default LeaseCancellationRequestDetail;
