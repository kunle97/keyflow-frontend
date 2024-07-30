import React, { useEffect, useState } from "react";
import { dateDiffForHumans, uiGreen, uiGrey2 } from "../../../constants";
import { authUser } from "../../../constants";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReportIcon from "@mui/icons-material/Report";
import PaymentCalendar from "./PaymentCalendar";
import {
  getNextPaymentDate,
  turnOffAutoPay,
  turnOnAutoPay,
} from "../../../api/manage_subscriptions";
import { getTransactionsByTenant } from "../../../api/transactions";
import { listStripePaymentMethods } from "../../../api/payment_methods";
import { getTenantDashboardData } from "../../../api/tenants";
import AlertModal from "../UIComponents/Modals/AlertModal";
import PaymentModal from "../UIComponents/Modals/PaymentModal";
import ConfirmModal from "../UIComponents/Modals/ConfirmModal";
import { useNavigate } from "react-router";
import { Alert, AlertTitle, CircularProgress, Stack } from "@mui/material";
import UIPrompt from "../UIComponents/UIPrompt";
import UIButton from "../UIComponents/UIButton";
import DescriptionIcon from "@mui/icons-material/Description";
import { getTenantLeaseRenewalRequests } from "../../../api/lease_renewal_requests";
import UItableMiniCard from "../UIComponents/UICards/UITableMiniCard";
import { getTenantInvoices } from "../../../api/tenants";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../UIComponents/UIHelpButton";
import UIProgressPrompt from "../UIComponents/UIProgressPrompt";
import UISwitch from "../UIComponents/UISwitch";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
const TenantDashboard = () => {
  const navigate = useNavigate();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [autoRenewResonse, setAutoRenewResponse] = useState(null);
  const [autoPayAllowed, setAutoPayAllowed] = useState(null);
  const [showSignConfirmModal, setShowSignConfirmModal] = useState(false);
  const [signLink, setSignLink] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [showAddPaymentMethodAlert, setShowAddPaymentMethodAlert] =
    useState(false);
  const [tenantData, setTenantData] = useState(null); //TODO: Remove this and replace with [leaseAgreement, setLeaseAgreement
  const [currentBalance, setCurrentBalance] = useState(0);
  const [lateFees, setLateFees] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [autoPayIsLoading, setAutoPayIsLoading] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmButtonText, setConfirmButtonText] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [cancelButtonText, setCancelButtonText] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [totalAmountDue, setTotalAmountDue] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".tenant-dashboard-container",
      content:
        "Welcome to your dashboard! Here you can view your account balance, pay your bills, and submit maintenance requests.",
      disableBeacon: true,
    },
    {
      target: ".navbar.topbar",
      content:
        "This is the navigation bar. You will be using this frequently to navigate to different sections of the dashboard.",
    },
    {
      target: "[data-testid='nav-menu-button'] ",
      content:
        "Click here to access the navigation menu. You can access all the sections of the dashboard from here including properties, units, tenants, maintenance requests, lease agreements, etc. ",
      spotlightClicks: true,
      disableBeacon: false,
      disableOverlayClose: true,
      placement: "right",
      styles: {
        options: {
          zIndex: 10000,
        },
      },
    },
    {
      target: ".topbar-brand",
      content:
        "This is the Keyflow logo. Click here to return to the dashboard home page at any time.",
    },
    {
      target: ".notification-topbar-icon",
      content:
        "Click here to view your notifications. You will receive notifications for new messages, maintenance requests, and other important updates",
    },
    {
      target: ".messages-topbar-icon",
      content:
        "Click here to view your messages. You can send and receive messages from your owner.",
    },
    {
      target: ".my-account-topbar-dropdown",
      content: "Click here to view your account settings, and to log out.",
      spotlightClicks: true,
      disableBeacon: false,
    },
    {
      target: ".amount-due-card",
      content:
        "This is the total amount due on your account. Click 'View Bills' to view and pay your bills.",
      disableBeacon: true,
    },
    {
      target: ".maintenance-request-card",
      content:
        "This is a list of your recent maintenance requests. Click on a row to view more details.",
    },
    {
      target: ".payment-calendar-card",
      content:
        "This is a calendar of your payments. Click on a date to view payment details.",
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
  const maintenance_request_columns = [
    { name: "type", label: "Type" },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "pending") {
            return <span className="text-warning">Pending</span>;
          } else if (value === "in_progress") {
            return <span className="text-info">In Progress</span>;
          } else if (value === "completed") {
            return <span className="text-success">Completed</span>;
          }
        },
      },
    },
    {
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
      sort: true,
    },
  ];

  const maintenance_request_options = {
    filter: true,
    sort: true,
    onRowClick: () => {},
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    limit: 5,
  };
  const autoPaySwitchOnClick = () =>{
    setConfirmModalTitle("Turn On Auto Pay")
    setConfirmModalMessage("Are you sure you want to turn on auto pay?"+
      "This will automatically pay your rent on the due date. In order "+
      "to turn it off you must contact your landlord.");
    setConfirmButtonText("Turn On AutoPay");
    setCancelButtonText("Cancel");
    setConfirmAction(() => handleAutoPayChange);
    setShowConfirmModal(true);
  }
  const handleAutoPayChange = async () => {
    try {
      setAutoPayIsLoading(true);
      if (leaseAgreement && leaseAgreement.auto_pay_is_enabled) {
        const res = await turnOffAutoPay();
        if (res.data && res.data.status === 200) {
          setAlertMessage("Auto pay has been turned off.");
          setAlertTitle("Success");
          setShowAlert(true);
        }else{
          setAlertMessage("An error occurred while turning off auto pay. Please try again.");
          setAlertTitle("Error");
          setShowAlert(true);
        }
      } else {
        const res = await turnOnAutoPay();
        if (res.data && res.data.status === 200) {
          setAlertMessage("Auto pay has been turned on.");
          setAlertTitle("Success");
          setShowAlert(true);
        }else{
          setAlertMessage("An error occurred while turning on auto pay. Please try again.");
          setAlertTitle("Error");
          setShowAlert(true);
        }
      }
    } catch (e) {
      console.error(e);
      setAlertMessage(
        "An error occurred while turning on/off auto pay. Please try again."
      );
      setAlertTitle("Error");
      setShowAlert(true);
    } finally {
      setAutoPayIsLoading(false);
    }
  };

  //Create a function to retrieve the invoices that are past due or are within 31 days of the due date
  const getDueInvoices = (invoices) => {
    return invoices.filter((invoice) => {
      //Check if invoiuce is paid
      if (!invoice.paid) {
        const dueDate = new Date(invoice.due_date * 1000);
        const today = new Date();
        const diffTime = Math.abs(dueDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 31;
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    setIsLoadingPage(true);
    try {
      //Get the payment methods for the user and check if they at least have one
      listStripePaymentMethods(`${authUser.id}`).then((res) => {
        setIsLoadingPaymentMethods(true);
        if (res.data.length < 1) {
          setShowAddPaymentMethodAlert(true);
          setIsLoadingPaymentMethods(false);
        } else {
          setPaymentMethods(res.data);

          setIsLoadingPaymentMethods(false);
        }
      });
      //Retrieve the unit
      getTenantDashboardData()
        .then((res) => {
          setTenantData(res);
          console.log(res.lease_agreement);
          setLeaseAgreement(res.lease_agreement);
          setCurrentBalance(res.current_balance);
          setAutoPayAllowed(res.auto_pay_is_allowed);
          console.log("Auto Pay Allowed: ", res.auto_pay_is_allowed);
          setLateFees(res.late_fees);
          setAnnouncements(res.announcements);
          if (res.auto_renew_response) {
            setAutoRenewResponse(res.auto_renew_response);
            if (res.auto_renew_response.keyflow_sign_link) {
              setSignLink(res.auto_renew_response.keyflow_sign_link);
              setShowSignConfirmModal(true);
            }
          }
          //Check if lease agreement endate is in 2 months or less, if so show confirm modal
          if (res.lease_agreement) {
            const endDate = new Date(res.lease_agreement.end_date);
            const today = new Date();
            const diffTime = Math.abs(endDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            getTenantLeaseRenewalRequests()
              .then((res) => {
                let lease_renewal_requests = res.data;

                let hasValidLeaseRenewalRequest = lease_renewal_requests.some(
                  (lease_renewal_request) => {
                    let lease_renewal_request_created_at = new Date(
                      lease_renewal_request.move_in_date
                    );
                    return lease_renewal_request_created_at > endDate;
                  }
                );

                if (!hasValidLeaseRenewalRequest && diffDays <= 70) {
                  setConfirmModalTitle("Lease Renewal");
                  setConfirmModalMessage(
                    "Your lease agreement is about to expire. Would you like to renew your lease?"
                  );
                  setConfirmButtonText("Renew Lease");
                  setCancelButtonText("Not Now");
                  //Set confirm action to a function that will navigate
                  const handleConfirmAction = () => {
                    navigate("/dashboard/tenant/lease-agreements/");
                  };
                  setConfirmAction(() => handleConfirmAction);
                  setShowConfirmModal(true);
                }
              })
              .catch((error) => {
                // Handle any errors from getTenantLeaseRenewalRequests()
                console.error(error);
              });
          }
          if (res.lease_agreement) {
            //Retrieve next payment date
            getNextPaymentDate(authUser.id).then((res) => {
              setNextPaymentDate(res.data.next_payment_date);
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setAlertMessage(
            "An error occurred while fetching data. Please try again."
          );
          setAlertTitle("Error");
          setShowAlert(true);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
      // Retrieve invoices
      getTenantInvoices().then((res) => {
        let invoicesDue = getDueInvoices(res.invoices.reverse());

        setInvoices(invoicesDue);
        let amount_due =
          invoicesDue.reduce((acc, invoice) => {
            return acc + invoice.amount_due;
          }, 0) / 100;
        setTotalAmountDue(amount_due);
      });
    } catch (e) {
      console.error(e);
      setAlertMessage(
        "An error occurred while fetching data. Please try again."
      );
      setAlertTitle("Error");
      setShowAlert(true);
    } finally {
    }
  }, []);

  return (
    <>
      {isLoadingPage ? (
        <UIProgressPrompt
          title="Loading Dashboard..."
          message="Please wait while we load your dashboard"
        />
      ) : (
        <div className="container  tenant-dashboard-container">
          <AlertModal
            open={showAlert}
            onClick={() => {
              navigate(0);
            }}
            title={alertTitle}
            message={alertMessage}
            btnText="Okay"
          />
          <ProgressModal open={autoPayIsLoading} title="Updating Auto Pay" />
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
          {leaseAgreement &&
            !isLoadingPaymentMethods &&
            paymentMethods.length > 0 && (
              <PaymentModal
                invoices={invoices}
                open={showPaymentModal}
                amount={totalAmountDue}
                paymentMethods={paymentMethods}
                handleClose={() => setShowPaymentModal(false)}
              />
            )}
          <ConfirmModal
            open={showConfirmModal}
            onClose={() => {}}
            title={confirmModalTitle}
            message={confirmModalMessage}
            cancelBtnText={cancelButtonText}
            confirmBtnText={confirmButtonText}
            handleConfirm={() => {
              setShowConfirmModal(false);
              confirmAction();
            }}
            handleCancel={() => {
              setShowConfirmModal(false);
            }}
          />
          <ConfirmModal
            open={showSignConfirmModal}
            onClose={() => {}}
            title="Sign Lease Renewal"
            message="Your lease agreement is ready for renewal. Click the button below to sign your lease agreement."
            cancelBtnText="Not Now"
            confirmBtnText="Sign Lease"
            handleConfirm={() => {
              navigate(signLink);
              setShowSignConfirmModal(false);
            }}
            handleCancel={() => {
              setShowSignConfirmModal(false);
            }}
          />
          <AlertModal
            open={showAddPaymentMethodAlert}
            onClose={() => {}}
            title="Add Payment Method"
            message="Welcome to the Keyflow Dashbaord! Here you will be able to pay your rent, 
        manage your account, view your payment history, and submit maintenance requests. 
        In order to pay your rent, you must first add a payment method. Click the button 
        below to add a payment method."
            to="/dashboard/tenant/add-payment-method"
            btnText="Add Payment Method"
          />
          {announcements && announcements.length > 0 && (
            <>
              {announcements.map((announcement) => (
                <Alert
                  severity={announcement.severity}
                  sx={{ mb: 3 }}
                  className=""
                >
                  <AlertTitle>{announcement.title}</AlertTitle>
                  {announcement.body}
                </Alert>
              ))}
            </>
          )}
          <div className="d-sm-flex justify-content-between align-items-center mb-4">
            <h3 className="text-black mb-0">
              Good Afternoon, {`${authUser.first_name}!`}
            </h3>
          </div>
          <div className="row">
            <div className="col-lg-5 col-xl-4">
              {leaseAgreement && (
                <Box sx={{ minWidth: 275 }}>
                  <div
                    className="card shadow mb-4"
                    variant="outlined"
                    style={{ background: "white", color: "black" }}
                  >
                    <>
                      <CardContent>
                        {totalAmountDue > 0 ? (
                          <div className="amount-due-card">
                            <Typography sx={{ fontSize: 20 }} gutterBottom>
                              {dateDiffForHumans(new Date(nextPaymentDate)) <=
                                5 && <ReportIcon sx={{ color: "red" }} />}{" "}
                              <span>
                                {/*Calculate the  total amount due by adding the sume of all amount_due properties in each invoice*/}
                                Total Amount Due: ${totalAmountDue}
                              </span>{" "}
                              due in{" "}
                              {dateDiffForHumans(new Date(nextPaymentDate))}
                            </Typography>
                            {autoPayAllowed && (
                              <Box>
                                <Stack
                                  direction="row"
                                  justifyContent={"flex-start"}
                                  alignItems={"center"}
                                  spacing={1}
                                  sx={{ mb: 2 }}
                                >
                                  <UISwitch
                                    checked={leaseAgreement.auto_pay_is_enabled}
                                    onChange={autoPaySwitchOnClick}
                                  />
                                  {leaseAgreement.auto_pay_is_enabled ? (
                                    <Typography
                                      sx={{ fontSize: 16 }}
                                      gutterBottom
                                    >
                                      Turn off Auto Pay
                                    </Typography>
                                  ) : (
                                    <Typography
                                      sx={{ fontSize: 16 }}
                                      gutterBottom
                                    >
                                      Turn On Auto Pay
                                    </Typography>
                                  )}
                                  {autoPayIsLoading && (
                                    <CircularProgress
                                      size={20}
                                      sx={{
                                        color: uiGreen,
                                      }}
                                    />
                                  )}
                                </Stack>
                                <Button
                                  onClick={() =>
                                    navigate("/dashboard/tenant/bills")
                                  }
                                  sx={{
                                    color: "white",
                                    textTransform: "none",
                                    backgroundColor: uiGreen,
                                  }}
                                  btnText="View Bills"
                                  to="#"
                                  variant="contained"
                                >
                                  View Bills
                                </Button>
                              </Box>
                            )}
                          </div>
                        ) : (
                          <>
                            <Typography sx={{ fontSize: 20 }} gutterBottom>
                              <span>You have no outstanding balance</span>{" "}
                            </Typography>
                            {autoPayAllowed && (
                              <Stack
                                direction="row"
                                justifyContent={"flex-start"}
                                alignItems={"center"}
                                spacing={1}
                                sx={{ mb: 2 }}
                              >
                                <UISwitch
                                  value={leaseAgreement.auto_pay_is_enabled}
                                  onChange={autoPaySwitchOnClick}
                                />
                                {leaseAgreement.auto_pay_is_enabled ? (
                                  <Typography
                                    sx={{ fontSize: 16 }}
                                    gutterBottom
                                  >
                                    Turn off Auto Pay
                                  </Typography>
                                ) : (
                                  <Typography
                                    sx={{ fontSize: 16 }}
                                    gutterBottom
                                  >
                                    Turn On Auto Pay
                                  </Typography>
                                )}
                                {autoPayIsLoading && (
                                  <CircularProgress
                                    size={20}
                                    sx={{
                                      color: uiGreen,
                                    }}
                                  />
                                )}
                              </Stack>
                            )}
                          </>
                        )}
                      </CardContent>
                    </>
                  </div>
                </Box>
              )}
              <div className="maintenance-request-card">
                <UItableMiniCard
                  cardStyle={{ background: "white", color: "black" }}
                  infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
                  titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                  title={"Recent Maintenance Requests"}
                  columns={maintenance_request_columns}
                  info={"Recent Maintenance Requests"}
                  endpoint={"/maintenance-requests/"}
                  options={maintenance_request_options}
                />
              </div>
            </div>
            <div className="col-lg-7 col-xl-8 mb-4">
              {leaseAgreement ? (
                <div
                  className="card payment-calendar-card"
                  style={{ color: "white" }}
                >
                  <div className="card-body">
                    <PaymentCalendar />
                  </div>
                </div>
              ) : (
                <UIPrompt
                  icon={
                    <DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />
                  }
                  title="No Active Lease"
                  message="You do not have an active lease. Please contact your owner to get started."
                  body={
                    <UIButton
                      btnText="Pending Lease Renewals"
                      onClick={() => {
                        navigate("/dashboard/tenant/lease-renewal-requests");
                      }}
                    />
                  }
                />
              )}
            </div>
            <div className="col-lg-12 col-xl-12 mb-4"></div>
          </div>
          <UIHelpButton onClick={handleClickStart} />
        </div>
      )}
    </>
  );
};

export default TenantDashboard;
