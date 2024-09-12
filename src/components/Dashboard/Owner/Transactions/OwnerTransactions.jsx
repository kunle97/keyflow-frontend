import React, { useState, useEffect } from "react";
import { getTransactionsByUser } from "../../../../api/transactions";
import { useNavigate } from "react-router";
import { uiGreen, uiGrey2, uiRed } from "../../../../constants";
import TitleCard from "../../UIComponents/TitleCard";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import useScreen from "../../../../hooks/useScreen";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { Stack } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { getStripeAccountLink } from "../../../../api/owners";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import Joyride, { STATUS } from "react-joyride";
const OwnerTransactions = () => {
  let revenueData = [];
  const [showAlert, setShowAlert] = useState(false);
  const [stripeAccountLink, setStripeAccountLink] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [transactions, setTransactions] = useState([]);
  const [tabPage, setTabPage] = useState(0);
  const [revenueChartData, setRevenueChartData] = useState([{ x: 0, y: 0 }]);
  const barChartHeight = "430px";
  const pieChartHeight = "468px";
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".transactions-list",
      content: "This is the list of all your transactions.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-search-input",
      content: "Use the search bar to search for a specific transaction.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view transaction details.",
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

  //Create a function to calculate the total revenue for all transactions
  const calculateTotalRevenue = () => {
    let total = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "revenue") {
        total += parseFloat(transaction.amount);
      }
    });
    return total;
  };

  //Create a function to calculate the total expenses for all transactions
  const calculateTotalExpenses = () => {
    let total = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        total += transaction.amount;
      }
    });
    return total;
  };

  const columns = [
    { name: "amount", label: "Amount" },
    {
      name: "type",
      label: "Transaction Type",
      options: {
        customBodyRender: (value) => {
          //remove the underscore from the value and capitalize the first letter of each word
          let transactionType = value
            .replace(/_/g, " ")
            .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
          return <>{transactionType}</>;
        },
      },
    },
    {
      name: "timestamp",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <>{new Date(value).toLocaleDateString()}</>;
        },
      },
    },
  ];
  const handleRowClick = (row) => {
    const navlink = `/dashboard/owner/transactions/${row.id}`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "timestamp",
      direction: "desc",
    },
  };

  useEffect(() => {
    //retrieve transactions from api
    getTransactionsByUser()
      .then((res) => {
        setTransactions(res.data);
        res.data.forEach((transaction) => {
          if (transaction.type === "revenue") {
            revenueData.push({
              x: new Date(transaction.timestamp).toISOString().split("T")[0],
              y: parseFloat(transaction.amount),
            });
          }
        });
        setRevenueChartData(revenueData);
      })
      .catch((error) => {
        console.error("Error fetching transactions", error);
        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error fetching transactions. Please try again."
        );
        setShowAlert(true);
      });
    getStripeAccountLink().then((res) => {
      setStripeAccountLink(res.account_link);
    });
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
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        <UIButton
          dataTestId="stripe-dashboard-button"
          btnText="Stripe Dashboard"
          onClick={() => {
            window.open(stripeAccountLink, "_blank");
          }}
        />
      </Stack>
      {tabPage === 0 && (
        <>
          {isMobile ? (
            <UITableMobile
              showCreate={true}
              tableTitle="Transactions"
              endpoint="/transactions/"
              createInfo={(row) =>
                `${
                  row.type === "vendor_payment" || row.type === "expense"
                    ? "-$"
                    : "+$"
                }${String(row.amount).toLocaleString("en-US")}`
              }
              createSubtitle={(row) =>
                `${removeUnderscoresAndCapitalize(row.type)}`
              }
              createTitle={(row) =>
                `${new Date(row.timestamp).toLocaleDateString()}`
              }
              onRowClick={handleRowClick}
              orderingFields={[
                { field: "timestamp", label: "Date Created (Ascending)" },
                { field: "-timestamp", label: "Date Created (Descending)" },
                { field: "type", label: "Transaction Type (Ascending)" },
                { field: "-type", label: "Transaction Type (Descending)" },
                { field: "amount", label: "Amount (Ascending)" },
                { field: "-amount", label: "Amount (Descending)" },
              ]}
              searchFields={["type", "amount", "timestamp"]}
            />
          ) : (
            <div className="transactions-list">
              <UITable
                dataTestId="transactions-table"
                testRowIdentifier="transactions-table-row"
                columns={columns}
                options={options}
                endpoint="/transactions/"
                title="Transactions"
                detailURL="/dashboard/owner/transactions/"
                showCreate={false}
                menuOptions={[
                  {
                    name: "View",
                    onClick: (row) => {
                      const navlink = `/dashboard/owner/transactions/${row.id}`;
                      navigate(navlink);
                    },
                  },
                ]}
              />
            </div>
          )}
        </>
      )}
      {tabPage === 1 && (
        <>
          <div className="row mb-4">
            <div className="col-md-4">
              <TitleCard
                title="Total Profit"
                value={`$
            ${(
              calculateTotalRevenue() - calculateTotalExpenses()
            ).toLocaleString("en-US")}`}
                icon={<i className="fas fa-chart-bar fa-2x text-gray-300" />}
                backgroundColor={uiGrey2}
                subtext={"% since last month"}
                style={{ marginBottom: "1rem" }}
              />
              <TitleCard
                title="Total Revenue"
                value={`$
            ${calculateTotalRevenue().toLocaleString("en-US")}`}
                icon={<i className="fas fa-chart-bar fa-2x text-gray-300" />}
                backgroundColor={uiGreen}
                subtext={"% since last month"}
                style={{ marginBottom: "1rem" }}
              />
              <TitleCard
                title="Total Expenses"
                value={`$
            ${calculateTotalExpenses().toLocaleString("en-US")}`}
                icon={<i className="fas fa-chart-bar fa-2x text-gray-300" />}
                backgroundColor={uiRed}
                subtext={"% since last month"}
                style={{ marginBottom: "1rem" }}
              />
            </div>
            <div className="col-md-8">
              <div
                className="card"
                style={{ overflow: "auto", height: barChartHeight }}
              >
                <div className="card-header">
                  <h5 className="mt-2">Monthly Profit</h5>
                </div>
                <div className="card-body">
                  {/* <RevenueExpenseBarChart /> */}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3" style={{ height: pieChartHeight }}>
                <div className="card-header">
                  <h5 className="mt-2">Revenue By Property</h5>
                </div>
                <div className="card-body">
                  {/* <RevenueByPropertyPieChart /> */}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card mb-3" style={{ height: pieChartHeight }}>
                <div className="card-header">
                  <h5 className="mt-2">Expense By Property</h5>
                </div>
                <div className="card-body">
                  {/* <ExpenseByPropertyPieChart /> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default OwnerTransactions;
