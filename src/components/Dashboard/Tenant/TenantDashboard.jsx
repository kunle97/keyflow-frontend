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
import {
  getTenantTransactionsByUser,
  getTransactionsByTenant,
} from "../../../api/transactions";
import { listStripePaymentMethods } from "../../../api/payment_methods";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { getTenantDashboardData } from "../../../api/tenants";
import AlertModal from "../UIComponents/Modals/AlertModal";
import PaymentModal from "../UIComponents/Modals/PaymentModal";
import ConfirmModal from "../UIComponents/Modals/ConfirmModal";
import { useNavigate } from "react-router";
import { CircularProgress, FormControlLabel, Stack } from "@mui/material";
import UISwitch from "../UIComponents/UISwitch";
import UITable from "../UIComponents/UITable/UITable";
import UIPrompt from "../UIComponents/UIPrompt";
import UIButton from "../UIComponents/UIButton";
import DescriptionIcon from "@mui/icons-material/Description";
import { getTenantLeaseRenewalRequests } from "../../../api/lease_renewal_requests";
import UICard from "../UIComponents/UICards/UICard";
import UICardList from "../UIComponents/UICards/UICardList";
import UItableMiniCard from "../UIComponents/UICards/UITableMiniCard";
const TenantDashboard = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [leaseTemplate, setLeaseTemplate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddPaymentMethodAlert, setShowAddPaymentMethodAlert] =
    useState(false);
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

  const columns = [
    { name: "amount", label: "Amount" },
    {
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

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
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/tenant/`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
  };

  const handleAutoPayChange = () => {
    setAutoPayIsLoading(true);
    if (leaseAgreement && leaseAgreement.auto_pay_is_enabled) {
      turnOffAutoPay().then((res) => {
        console.log(res.data);
        if (res.data && res.data.status === 200) {
          navigate(0);
          setAutoPayIsLoading(false);
        }
      });
    } else {
      turnOnAutoPay().then((res) => {
        console.log(res.data);
        if (res.data && res.data.status === 200) {
          navigate(0);
          setAutoPayIsLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    //Get the payment methods for the user and check if they at least have one
    listStripePaymentMethods(`${authUser.user_id}`).then((res) => {
      setIsLoadingPaymentMethods(true);
      if (res.data.length < 1) {
        setShowAddPaymentMethodAlert(true);
        setIsLoadingPaymentMethods(false);
      } else {
        setPaymentMethods(res.data);
        console.log(res.data);
        setIsLoadingPaymentMethods(false);
      }
    });
    //Retrieve Tenant Transactions
    getTransactionsByTenant(authUser.tenant_id).then((res) => {
      setTransactions(res.data);
    });

    //Active subscription

    //Retrieve the unit
    getTenantDashboardData().then((res) => {
      console.log(res);
      setUnit(res.unit);
      setLeaseAgreement(res.lease_agreement);

      console.log(res.lease_agreement);

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
                navigate("/dashboard/tenant/my-lease");
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

      setLeaseTemplate(res.lease_template);
      if (res.lease_agreement) {
        //Retrieve next payment date
        getNextPaymentDate(authUser.user_id).then((res) => {
          console.log("nExt pay date data", res);
          setNextPaymentDate(res.data.next_payment_date);
        });
      }
    });
  }, []);

  return (
    <div className="container">
      {leaseAgreement &&
        !isLoadingPaymentMethods &&
        paymentMethods.length > 0 && (
          <PaymentModal
            open={showPaymentModal}
            amount={leaseTemplate.rent * 100}
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
                    <Typography sx={{ fontSize: 20 }} gutterBottom>
                      {dateDiffForHumans(new Date(nextPaymentDate)) <= 5 && (
                        <ReportIcon sx={{ color: "red" }} />
                      )}{" "}
                      Rent due in {dateDiffForHumans(new Date(nextPaymentDate))}
                    </Typography>

                    <Box
                      sx={
                        {
                          // display: "flex",
                          // justifyContent: "flex-start",
                          // alignItems: "flex-start",
                        }
                      }
                    >
                      <div className="my-2">
                        <FormControlLabel
                          value="end"
                          control={
                            <UISwitch
                              checked={
                                leaseAgreement &&
                                leaseAgreement.auto_pay_is_enabled
                              }
                              onChange={handleAutoPayChange}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label={`AutoPay ${
                            leaseAgreement && leaseAgreement.auto_pay_is_enabled
                              ? "Enabled"
                              : "Disabled"
                          }`}
                          labelPlacement="end"
                        />{" "}
                        {autoPayIsLoading && (
                          <CircularProgress
                            size="1rem"
                            sx={{
                              color: uiGreen,
                              top: 5,
                              position: "relative",
                            }}
                          />
                        )}
                      </div>{" "}
                      {leaseAgreement &&
                        !leaseAgreement.auto_pay_is_enabled && (
                          <Button
                            onClick={() => setShowPaymentModal(true)}
                            sx={{
                              color: "white",
                              textTransform: "none",
                              backgroundColor: uiGreen,
                            }}
                            btnText="Pay Now"
                            to="#"
                            variant="contained"
                          >
                            Pay Now
                          </Button>
                        )}
                    </Box>
                  </CardContent>
                </>
              </div>
            </Box>
          )}
          {/* TODO: Insert a better Maintenance Requests Component Here */}
          {/* <MaintenanceRequests /> */}
          {transactions.length === 0 ? (
            <UICard cardStyle={{ height: "478px" }}>
              <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
                sx={{ height: "400px", textAlign: "center", color: "black" }}
              >
                <h4>Seems like you're new around here...</h4>
                <p>There are no transactions to display.</p>
              </Stack>
            </UICard>
          ) : (
            <>
              {/* <UICardList
                cardStyle={{ background: "white", color: "black" }}
                infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
                titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                title={""}
                info={"Recent Transactions"}
                onInfoClick={() => navigate("/dashboard/landlord/transactions")}
                //Create Transaction list items using the transaction data with this object format:  {type:"revenur", amount:1909, created_at: "2021-10-12T00:00:00.000Z"}
                items={transactions
                  .map((transaction) => ({
                    primary: transaction.description,
                    secondary: new Date(
                      transaction.timestamp
                    ).toLocaleDateString(),
                    tertiary: `${
                      transaction.type === "revenue" ||
                      transaction.type === "rent_payment" ||
                      transaction.type === "security_deposit"
                        ? "+"
                        : "-"
                    }$${transaction.amount}`,
                    icon: <AttachMoneyIcon />,
                  }))
                  .slice(0, 4)}
                tertiaryStyles={{ color: uiGreen }}
              /> */}
            </>
          )}

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
        <div className="col-lg-7 col-xl-8 mb-4">
          {leaseAgreement ? (
            <div className="card" style={{ color: "white" }}>
              <div className="card-body">
                <PaymentCalendar />
              </div>
            </div>
          ) : (
            <UIPrompt
              icon={<DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />}
              title="No Active Lease"
              message="You do not have an active lease. Please contact your landlord to get started."
              body={<UIButton btnText="Apply for Lease" />}
            />
          )}
        </div>
        <div className="col-lg-12 col-xl-12 mb-4"></div>
      </div>
    </div>
  );
};

export default TenantDashboard;
