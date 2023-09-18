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
  getTenantDashboardData,
  getTenantTransactionsByUser,
  listStripePaymentMethods,
  turnOffAutoPay,
  turnOnAutoPay,
} from "../../../api/api";
import AlertModal from "../UIComponents/Modals/AlertModal";
import PaymentModal from "../UIComponents/Modals/PaymentModal";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router";
import { CircularProgress, FormControlLabel } from "@mui/material";
import UISwitch from "../UIComponents/UISwitch";
const TenantDashboard = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [leaseTerm, setLeaseTerm] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddPaymentMethodAlert, setShowAddPaymentMethodAlert] =
    useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [autoPayIsLoading, setAutoPayIsLoading] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const columns = [
    { name: "id", label: "ID", options: { display: false } },
    { name: "amount", label: "Amount" },
    {
      name: "type",
      label: "Transaction",
      options: {
        customBodyRender: (value) => {
          if (value === "revenue") {
            return <span>Income</span>;
          } else {
            return <span>Expense</span>;
          }
        },
      },
    },
    { name: "description", label: "Description" },
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

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/tenant/`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
  };

  const handleAutoPayChange = () => {
    setAutoPayIsLoading(true);
    if (leaseAgreement && leaseAgreement.stripe_subscription_id) {
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
    listStripePaymentMethods(`${authUser.id}`).then((res) => {
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
    //Retrieve the unit
    getTenantDashboardData().then((res) => {
      console.log(res);
      setUnit(res.unit);
      setLeaseAgreement(res.lease_agreement);
      console.log(res.lease_agreement);
      setLeaseTerm(res.lease_term);
    });
    //Retrieve Tenant Transactions
    getTenantTransactionsByUser().then((res) => {
      console.log(res);
      setTransactions(res.data);
    });
    //Retrieve next payment date
    getNextPaymentDate().then((res) => {
      console.log("nExt pay date data", res);
      setNextPaymentDate(res.data.next_payment_date);
    });
  }, []);

  return (
    <div className="container">
      {!isLoadingPaymentMethods && paymentMethods.length > 0 && (
        <PaymentModal
          open={showPaymentModal}
          amount={leaseTerm.rent * 100}
          paymentMethods={paymentMethods}
          handleClose={() => setShowPaymentModal(false)}
        />
      )}
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
        <h3 className="text-light mb-0">
          Good Afternoon, {`${authUser.first_name}!`}
        </h3>
      </div>
      <div className="row">
        <div className="col-lg-5 col-xl-4">
          <Box sx={{ minWidth: 275 }}>
            <div
              className="card shadow mb-4"
              variant="outlined"
              style={{ background: uiGrey2, color: "white" }}
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
                              leaseAgreement.stripe_subscription_id
                            }
                            onChange={handleAutoPayChange}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        }
                        label={`AutoPay ${
                          leaseAgreement &&
                          leaseAgreement.stripe_subscription_id
                            ? "Enabled"
                            : "Disabled"
                        }`}
                        labelPlacement="end"
                      />{" "}
                      {autoPayIsLoading && (
                        <CircularProgress
                          size="1rem"
                          sx={{ color: uiGreen, top: 5, position: "relative" }}
                        />
                      )}
                    </div>{" "}
                    {leaseAgreement &&
                      !leaseAgreement.stripe_subscription_id && (
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
          {/* TODO: Insert a better Maintenance Requests Component Here */}
          {/* <MaintenanceRequests /> */}
        </div>
        <div className="col-lg-7 col-xl-8 mb-4">
          <div className="card" style={{ color: "white" }}>
            <div className="card-body">
              <PaymentCalendar />
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-xl-12 mb-4">
          <MUIDataTable
            data={transactions}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
