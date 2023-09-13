import React, { useState, useEffect } from "react";
import { getTransactionsByUser } from "../../../../api/api";
import { useNavigate } from "react-router";
import MUIDataTable from "mui-datatables";
import RevenueChart from "../Charts/RevenueChart";
const LandlordTransactions = () => {
  let revenueData = [];
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([{ x: 0, y: 0 }]);

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
    const navlink = `/dashboard/landlord/transactions/${rowData[0]}`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
  };
  useEffect(() => {
    //retrieve transactions from api
    getTransactionsByUser().then((res) => {
      setTransactions(res.data);
      res.data.forEach((transaction) => {
        if (transaction.type === "revenue") {
          revenueData.push({
            x: new Date(transaction.created_at).toISOString().split("T")[0],
            y: parseFloat(transaction.amount),
          });
        }
      });
      setRevenueChartData(revenueData);
      console.log(revenueData);
      console.log(data[0].data);
    });
  }, []);
  console.log([
    {
      id: "revenue",
      data: revenueChartData,
    },
  ]);
  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12 mb-4">
                  <h6 className="card-title">
                    <strong>Total profit</strong>
                  </h6>
                  <p className="card-text">
                    $
                    {(
                      calculateTotalRevenue() - calculateTotalExpenses()
                    ).toLocaleString("en-US")}
                  </p>
                </div>
                <div className="col-md-12 mb-4">
                  <h6 className="card-title">
                    <strong>Total Revenue</strong>
                  </h6>
                  <p className="card-text">
                    ${calculateTotalRevenue().toLocaleString("en-US")}
                  </p>
                </div>
                <div className="col-md-12 mb-4">
                  <h6 className="card-title">
                    <strong>Total Expenses</strong>
                  </h6>
                  <p className="card-text">
                    ${calculateTotalExpenses().toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <RevenueChart
            data={
              [
                {
                  id: "revenue",
                  data: revenueChartData,
                },
              ]
              // data
            }
          />
        </div>
        <div className="col-md-12">
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

export default LandlordTransactions;
