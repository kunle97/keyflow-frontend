import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import { uiGreen, uiGrey1, uiGrey2 } from "../../../constants";
import { RevenueChart } from "./Charts/RevenueChart";
import { data1, data2, data3 } from "../../../mockData";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import MUIDataTable from "mui-datatables";
import { useEffect } from "react";
import { getTransactionsByUser } from "../../../api/api";
import { useNavigate } from "react-router";
const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  //Create MUI DataTable columsn for transactions using amount, description, rental_property, rental_unit, type, created_at, and tenant_id
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
    const navlink = `/dashboard/landlord/`;
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
      console.log(res);
      setTransactions(res.data);
    });
  }, []);
  return (
    <div className="container">
      <div className="row mb-3 ">
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <div className="row mb-2">
                <div className="col">
                  <p className="m-0">Total Profit</p>
                  <p className="m-0">
                    <strong>${faker.finance.accountNumber(6)}</strong>
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-bar fa-2x text-gray-300" />
                </div>
              </div>
              <p className="text-white-50 small m-0">
                <i className="fas fa-arrow-up" />
                &nbsp;5% since last month
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <div className="row mb-2">
                <div className="col">
                  <p className="m-0">Expense</p>
                  <p className="m-0">
                    <strong>${faker.finance.accountNumber(5)}</strong>
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                </div>
              </div>
              <p className="text-white-50 small m-0">
                <i className="fas fa-arrow-up" />
                &nbsp;5% since last month
              </p>
            </div>
          </div>
        </div>{" "}
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <div className="row mb-2">
                <div className="col">
                  <p className="m-0">Total Revenue</p>
                  <p className="m-0">
                    <strong>${faker.finance.accountNumber(7)}</strong>
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                </div>
              </div>
              <p className="text-white-50 small m-0">
                <i className="fas fa-arrow-up" />
                &nbsp;5% since last month
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <div className="row mb-2">
                <div className="col">
                  <p className="m-0">Peformance</p>
                  <p className="m-0">
                    <strong>65</strong>
                  </p>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300" />
                </div>
              </div>
              <p className="text-white-50 small m-0">
                <i className="fas fa-arrow-up" />
                &nbsp;5% since last month
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {" "}
        <div className="col-md-8 ">
          <div className="card shadow mb-4" style={{ height: "400px" }}>
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{ background: uiGrey2 }}
            >
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Profit
              </h6>

              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "20pt",
                color: "white",
                marginLeft: "15px",
                marginBottom: 0,
              }}
            >
              $45,000
            </p>
            <ResponsiveLine
              data={data1}
              curve="cardinal"
              enableArea={true}
              enableGridX={false}
              enableGridY={false}
              enablePoints={false}
              // margin={{ top: 15, right: 25, bottom: 25, left: 25 }}
              margin={{ top: 15, right: 0, bottom: 1, left: 0 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
              }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "transportation",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "count",
                legendOffset: -40,
                legendPosition: "middle",
              }}
              pointSize={10}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
        <div className="col-md-4 ">
          <div
            className="card shadow "
            style={{ height: "400px", background: "white" }}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Revenue By Property
              </h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <ResponsiveBar
              data={data2}
              keys={[
                "hot dog",
                "burger",
                "sandwich",
                "kebab",
                "fries",
                "donut",
              ]}
              indexBy="country"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.4}
              groupMode="grouped"
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              defs={[
                {
                  id: "dots",
                  type: "patternDots",
                  background: "inherit",
                  color: "#38bcb2",
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: "lines",
                  type: "patternLines",
                  background: "inherit",
                  color: "#eed312",
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
              fill={[
                {
                  match: {
                    id: "fries",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "sandwich",
                  },
                  id: "lines",
                },
              ]}
              borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "country",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "food",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
              }}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              role="application"
              ariaLabel="Nivo bar chart demo"
              barAriaLabel={(e) =>
                e.id + ": " + e.formattedValue + " in country: " + e.indexValue
              }
            />
          </div>
        </div>
      </div>
      <div className="d-sm-flex justify-content-between align-items-center mb-4"></div>

      <div className="row">
        {" "}
        <div className="col-lg-5  col-xl-4">
          <div className="card shadow mb-4" style={{ height: "450px" }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Revenue Sources
              </h6>
              <div className="dropdown no-arrow">
                <button
                  className="btn btn-link btn-sm dropdown-toggle"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  type="button"
                >
                  <i className="fas fa-ellipsis-v text-gray-400" />
                </button>
                <div className="dropdown-menu shadow dropdown-menu-end animated--fade-in">
                  <p className="text-center dropdown-header">
                    dropdown header:
                  </p>
                  <a className="dropdown-item" href="#">
                    &nbsp;Action
                  </a>
                  <a className="dropdown-item" href="#">
                    &nbsp;Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    &nbsp;Something else here
                  </a>
                </div>
              </div>
            </div>
            <ResponsivePie
              data={data3}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: "color",
                modifiers: [["darker", 0.2]],
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
              }}
              defs={[
                {
                  id: "dots",
                  type: "patternDots",
                  background: "inherit",
                  color: "rgba(255, 255, 255, 0.3)",
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: "lines",
                  type: "patternLines",
                  background: "inherit",
                  color: "rgba(255, 255, 255, 0.3)",
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
              fill={[
                {
                  match: {
                    id: "ruby",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "c",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "go",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "python",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "scala",
                  },
                  id: "lines",
                },
                {
                  match: {
                    id: "lisp",
                  },
                  id: "lines",
                },
                {
                  match: {
                    id: "elixir",
                  },
                  id: "lines",
                },
                {
                  match: {
                    id: "javascript",
                  },
                  id: "lines",
                },
              ]}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: "#000",
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
        <div className="col-lg-7 col-xl-8">
          <h4 className="">Recent Transactions</h4>
          <MUIDataTable data={transactions} columns={columns} options={options} />
        </div>
        <div className="col-lg-5 col-xl-4 pt-4">
          <div className="card">
            <div className="card-header py-3">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Rent Over Due Notice
              </h6>
            </div>
            <div className="card-body">
              <p className="card-text">
                John Doe is 3 Days overdue for their rent payment.
              </p>
              <a className="card-link" href="#" style={{ color: uiGreen }}>
                Dismiss
              </a>
            </div>
          </div>
          <div className="card shadow mb-4" style={{ marginTop: "15px" }}>
            <div className="card-header py-3">
              <h6 className="text-primary fw-bold m-0 card-header-text">
                Account Setup
              </h6>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <h6 className="mb-0">
                      <strong>Verify Email</strong>
                    </h6>
                  </div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-32 0 512 512"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                    >
                      {/*! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. */}
                      <path d="M200.3 142.4C193.3 135.9 183.1 134.2 174.4 138C165.7 141.8 160 150.5 160 159.1v192C160 361.5 165.7 370.2 174.4 374c8.719 3.812 18.91 2.094 25.91-4.375l104-96C309.2 269.1 312 262.7 312 256s-2.812-13.09-7.719-17.62L200.3 142.4zM384 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h320c35.34 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.18 16-16 16H64c-8.82 0-16-7.18-16-16V96c0-8.82 7.18-16 16-16h320c8.82 0 16 7.18 16 16V416z" />
                    </svg>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <h6 className="mb-0">
                      <strong>
                        Connect Your Bank Account To Receive Payments
                      </strong>
                    </h6>
                  </div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-32 0 512 512"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                    >
                      {/*! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. */}
                      <path d="M200.3 142.4C193.3 135.9 183.1 134.2 174.4 138C165.7 141.8 160 150.5 160 159.1v192C160 361.5 165.7 370.2 174.4 374c8.719 3.812 18.91 2.094 25.91-4.375l104-96C309.2 269.1 312 262.7 312 256s-2.812-13.09-7.719-17.62L200.3 142.4zM384 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h320c35.34 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.18 16-16 16H64c-8.82 0-16-7.18-16-16V96c0-8.82 7.18-16 16-16h320c8.82 0 16 7.18 16 16V416z" />
                    </svg>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row align-items-center no-gutters">
                  <div className="col me-2">
                    <h6 className="mb-0">
                      <strong>Enable 2FA</strong>
                    </h6>
                  </div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-32 0 512 512"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                    >
                      {/*! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. */}
                      <path d="M200.3 142.4C193.3 135.9 183.1 134.2 174.4 138C165.7 141.8 160 150.5 160 159.1v192C160 361.5 165.7 370.2 174.4 374c8.719 3.812 18.91 2.094 25.91-4.375l104-96C309.2 269.1 312 262.7 312 256s-2.812-13.09-7.719-17.62L200.3 142.4zM384 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h320c35.34 0 64-28.66 64-64V96C448 60.66 419.3 32 384 32zM400 416c0 8.82-7.18 16-16 16H64c-8.82 0-16-7.18-16-16V96c0-8.82 7.18-16 16-16h320c8.82 0 16 7.18 16 16V416z" />
                    </svg>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <button
            className="btn btn-primary ui-btn"
            type="button"
            style={{ width: "100%" }}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
