import React, { useState, useEffect } from "react";
import { getTransactionsByUser } from "../../../../api/transactions";
import { useNavigate } from "react-router";
import { uiGreen, uiGrey2, uiRed } from "../../../../constants";
import TitleCard from "../../UIComponents/TitleCard";
import UITable from "../../UIComponents/UITable/UITable";
import UITabs from "../../UIComponents/UITabs";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import useScreen from "../../../../hooks/useScreen";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { Stack } from "@mui/material";
import UIButton from "../../UIComponents/UIButton";
import { getStripeAccountLink } from "../../../../api/owners";
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
  const data = [
    {
      id: "money",
      data: [
        { x: "2023-09-01", y: 1250 },
        { x: "2023-09-02", y: 3225 },
        { x: "2023-09-03", y: 2300 },
        { x: "2023-10-01", y: 1105 },
        { x: "2023-10-02", y: 150 },
        { x: "2023-10-03", y: 2030 },
        { x: "2023-11-01", y: 1200 },
        { x: "2023-11-02", y: 1450 },
        { x: "2023-11-03", y: 2050 },
        { x: "2023-12-01", y: 1040 },
        { x: "2023-12-02", y: 3050 },
        { x: "2023-12-03", y: 4400 },
        // Add more data points here
      ],
    },
  ];

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
    { name: "id", label: "ID", options: { display: false } },
    { name: "amount", label: "Amount" },
    {
      name: "type",
      label: "Transaction",
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
        console.log(revenueData);
        console.log(data[0].data);
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
      console.log("Stripe ACcount link res: ", res);
      setStripeAccountLink(res.account_link);
    });
  }, []);
  console.log([
    {
      id: "revenue",
      data: revenueChartData,
    },
  ]);
  return (
    <div className="container-fluid">
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
            />
          ) : (
            <UITable
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
    </div>
  );
};

export default OwnerTransactions;
