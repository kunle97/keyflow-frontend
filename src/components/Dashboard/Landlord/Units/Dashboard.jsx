import React, { useState } from "react";
import { uiGreen, uiRed, uiGrey2 } from "../../../../constants";
import { useEffect } from "react";
import { getTransactionsByUser } from "../../../../api/transactions";
import { useNavigate } from "react-router";
import UILineChartCard from "../../UIComponents/UICards/UILineChartCard";
import UITableCard from "../../UIComponents/UICards/UITableCard";
import UIPieChartCard from "../../UIComponents/UICards/UIPieChartCard";
import { getLandlordUnits } from "../../../../api/units";
import { getProperties } from "../../../../api/properties";
import UIInfoCard from "../../UIComponents/UICards/UIInfoCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UICardList from "../../UIComponents/UICards/UICardList";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import { faker } from "@faker-js/faker";
import { getAllLeaseRenewalRequests } from "../../../../api/lease_renewal_requests";
import { get } from "react-hook-form";
import { getAllLeaseCancellationRequests } from "../../../../api/lease_cancellation_requests";
const Dashboard = () => {
  const multiplier = [1, 2, 3, 5];
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set loading to true on component mount
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [leaseRenewalRequests, setLeaseRenewalRequests] = useState([]);
  const [leaseCancellationRequests, setLeaseCancellationRequests] = useState(
    []
  );
  const [occupiedUnits, setOccupiedUnits] = useState([]);
  const [vacantUnits, setVacantUnits] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [transactionLabels, setTransactionLabels] = useState([]);
  const [transactionDataValues, setTransactionDataValues] = useState([]);
  const [groupedPropertiesByTransactions, setGroupedPropertiesByTransactions] =
    useState([]);
  const [groupedLeaseRenewalRequests, setGroupedLeaseRenewalRequests] =
    useState([]);
  const [
    groupedLeaseCancellationRequests,
    setGroupedLeaseCancellationRequests,
  ] = useState([]);

  //Create MUI DataTable columsn for transactions using amount, description, rental_property, rental_unit, type, created_at, and tenant_id

  const lease_agreement_columns = [
    {
      name: "tenant",
      label: "Tenant",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          let output = "";
          if (value) {
            output = `${value.first_name} ${value.last_name}`;
          } else {
            output = "N/A";
          }
          return <span>{output}</span>;
        },
      },
    },
    {
      name: "rental_unit",
      label: "Unit",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    {
      name: "is_active",
      label: "Active",
      options: {
        customBodyRender: (value) => {
          return value ? (
            <span style={{ color: uiGreen }}>Active</span>
          ) : (
            <span style={{ color: uiRed }}>Inactive</span>
          );
        },
      },
    },

    {
      name: "start_date",
      label: "Start Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
    {
      name: "end_date",
      label: "End Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const lease_cancellation_columns = [
    {
      name: "tenant",
      label: "Tenant",
      options: {
        customBodyRender: (value) => {
          let output = "";
          if (value) {
            output = `${value.first_name} ${value.last_name}`;
          } else {
            output = "N/A";
          }
          return <span>{output}</span>;
        },
      },
    },
    {
      name: "rental_unit",
      label: "Unit",
      options: {
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "pending") {
            return <span className="text-warning">Pending</span>;
          } else if (value === "approved") {
            return <span style={{ color: uiGreen }}>Approved</span>;
          }
          return <span>{value}</span>;
        },
      },
    },

    {
      name: "created_at",
      label: "Date Submitted",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  const lease_renewal_columns = [
    {
      name: "tenant",
      label: "Tenant",
      options: {
        customBodyRender: (value) => {
          let output = "";
          if (value) {
            output = `${value.first_name} ${value.last_name}`;
          } else {
            output = "N/A";
          }
          return <span>{output}</span>;
        },
      },
    },
    {
      name: "rental_unit",
      label: "Unit",
      options: {
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "pending") {
            return <span className="text-warning">Pending</span>;
          } else if (value === "approved") {
            return <span style={{ color: uiGreen }}>Approved</span>;
          }
          return <span>{value}</span>;
        },
      },
    },
    {
      name: "request_date",
      label: "Date Requested",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
    {
      name: "created_at",
      label: "Date Submitted",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const maintenance_request_columns = [
    { name: "description", label: "Issue" },
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

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/transactions/${rowData}`;
    navigate(navlink);
  };

  const lease_agreement_options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "end_date",
      direction: "desc",
    },
    limit: 10,
  };
  const lease_cancellation_options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    limit: 10,
  };
  const maintenance_request_options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    limit: 5,
  };

  const chartData = [];

  chartData[0] = {
    id: "revenue",
    color: "hsl(53, 70%, 50%)",
    data: transactions.map((transaction, index) => {
      if (transaction.type === "revenue") {
        return {
          x: new Date(transaction.created_at).toLocaleDateString(),
          y: transaction.amount,
        };
      }
    }),
  };
  function groupTransactionsByMonth(transactions, numMonthsToShow) {
    const currentDate = new Date();
    const pastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - numMonthsToShow + 1,
      1
    ); // Determine the start date based on numMonthsToShow

    const allMonths = {};
    while (pastDate <= currentDate) {
      const yearMonth = pastDate.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
      }); // Get month name
      allMonths[yearMonth] = {
        month: yearMonth,
        totalAmount: 0,
      };
      pastDate.setMonth(pastDate.getMonth() + 1);
    }

    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at);
      const monthYear = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
      }); // Get month name

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
          }),
          totalAmount: 0,
        };
      }

      acc[monthYear].totalAmount += parseFloat(transaction.amount);
      return acc;
    }, {});

    return { ...allMonths, ...groupedData };
  }

  const groupedData = groupTransactionsByMonth(transactions, 5);
  const labels = Object.values(groupedData).map((data) => data.month);
  const dataValues = Object.values(groupedData).map((data) => data.totalAmount);

  //Create a function to group properties by the amount of transactions they have. Group them as an array of objects with the property name and total amount of transactions {name:"property name", totalAmount: 1900"}

  const groupPropertiesByTransactions = (
    transactions,
    numberOfPropertiesToShow = 5
  ) => {
    const groupedProperties = {};

    transactions.forEach((transaction) => {
      const propName = transaction.rental_property.name;
      const propAmount = parseFloat(transaction.amount);

      if (!groupedProperties[propName]) {
        groupedProperties[propName] = {
          name: propName,
          totalAmount: 0,
        };
      }
      groupedProperties[propName].totalAmount += propAmount;
    });

    // Convert the object to an array of property objects
    const propertyArray = Object.values(groupedProperties);

    // Sort the properties based on totalAmount in descending order
    const sortedProperties = propertyArray.sort(
      (a, b) => b.totalAmount - a.totalAmount
    );

    // Get the specified number of properties or less if there are fewer than that number
    const topProperties = sortedProperties.slice(0, numberOfPropertiesToShow);

    return topProperties;
  };

  //Create a function to group lease renewal requests by pending rejected ,and approved
  const groupLeaseRenewalRequests = (leaseRenewalRequests) => {
    const groupedLeaseRenewalRequests = {
      pending: [],
      approved: [],
      rejected: [],
    };
    leaseRenewalRequests.forEach((leaseRenewalRequest) => {
      if (leaseRenewalRequest.status === "pending") {
        groupedLeaseRenewalRequests.pending.push(leaseRenewalRequest);
      } else if (leaseRenewalRequest.status === "approved") {
        groupedLeaseRenewalRequests.approved.push(leaseRenewalRequest);
      } else {
        groupedLeaseRenewalRequests.rejected.push(leaseRenewalRequest);
      }
    });
    return groupedLeaseRenewalRequests;
  };

  //Create a function to group lease cancellation requests by pending rejected ,and approved
  const groupLeaseCancellationRequests = (leaseCancellationRequests) => {
    const groupedLeaseCancellationRequests = {
      pending: [],
      approved: [],
      rejected: [],
    };
    leaseCancellationRequests.forEach((leaseCancellationRequest) => {
      if (leaseCancellationRequest.status === "pending") {
        groupedLeaseCancellationRequests.pending.push(leaseCancellationRequest);
      } else if (leaseCancellationRequest.status === "approved") {
        groupedLeaseCancellationRequests.approved.push(
          leaseCancellationRequest
        );
      } else if (leaseCancellationRequest.status === "rejected") {
        groupedLeaseCancellationRequests.rejected.push(
          leaseCancellationRequest
        );
      }
    });
    return groupedLeaseCancellationRequests;
  };

  //Create a  function to change the occupied units and vacant units based on the property selected
  const handlePropertyChange = (e) => {
    const propertyId = e.target.value;
    //If property id is all then set occupied units to all occupied units and vacant units to all vacant units
    if (propertyId === "all") {
      setOccupiedUnits(
        units.filter((unit) => unit.is_occupied === true).length
      );
      setVacantUnits(units.filter((unit) => unit.is_occupied === false).length);
      return;
    }
    const property = properties.find(
      (property) => property.id === parseInt(propertyId)
    );
    setOccupiedUnits(
      property.units.filter((unit) => unit.is_occupied === true).length
    );
    setVacantUnits(
      property.units.filter((unit) => unit.is_occupied === false).length
    );
    console.log(occupiedUnits, vacantUnits);
  };

  useEffect(() => {
    setIsLoading(true);
    //retrieve transactions from api
    try {
      getTransactionsByUser().then((res) => {
        setTransactions(res.data);
        setGroupedTransactions(groupTransactionsByMonth(res.data, 5));
        setTransactionLabels(
          Object.values(groupTransactionsByMonth(res.data)).map(
            (data) => data.month
          )
        );
        setTransactionDataValues(
          Object.values(groupTransactionsByMonth(res.data)).map(
            (data) => data.totalAmount
          )
        );
        setGroupedPropertiesByTransactions(
          groupPropertiesByTransactions(res.data),
          3
        );
        console.log(
          "Grouped properties byu transaction",
          groupPropertiesByTransactions(res.data),
          3
        );
      });
      getLandlordUnits().then((res) => {
        setUnits(res.data);
        setOccupiedUnits(
          res.data.filter((unit) => unit.is_occupied === true).length
        );
        setVacantUnits(
          res.data.filter((unit) => unit.is_occupied === false).length
        );
      });
      getProperties().then((res) => {
        setProperties(res.data);
      });
      getAllLeaseRenewalRequests().then((res) => {
        setLeaseRenewalRequests(res.data);
        setGroupedLeaseRenewalRequests(groupLeaseRenewalRequests(res.data));
      });
      getAllLeaseCancellationRequests().then((res) => {
        setLeaseCancellationRequests(res.data);
        setGroupedLeaseCancellationRequests(
          groupLeaseCancellationRequests(res.data)
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
    setIsLoading(false);
  }, []);
  return isLoading ? (
    <UIProgressPrompt
      title={"Fetching your data for ya. Give us a sec..."}
      message={"Hang Tight!"}
    />
  ) : (
    <div className="container-fluid">
      {/* <h3 style={{ color: uiGrey2, fontWeight: "bold" }}>Dashboard</h3> */}

      {/* Line Chart Row */}
      <div className="row">
        <div className="col-md-12 ">
          <UILineChartCard
            isLoading={isLoading}
            height={"360px"}
            title="Total Revenue"
            info={`$${transactionDataValues
              .reduce((a, b) => a + b, 0)
              .toLocaleString()}`}
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "22pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "15pt" }}
            // data={data1}
            labels={labels}
            data={dataValues}
            dropDownOptions={[
              { value: "monthly", label: "Monthly" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "yearly", label: "Yearly" },
            ]}
            onDropdownChange={(e) => console.log(e.target.value)}
          />
        </div>
      </div>

      {/* Info Card Row */}
      <div className="row my-2">
        {multiplier.map((item, index) => {
          return (
            <div className="col-md-3">
              <UIInfoCard
                cardStyle={{ background: "white", color: uiGrey2 }}
                infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
                titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
                info={`$${transactionDataValues
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString()}`}
                title={"Total Revenue"}
                icon={<AttachMoneyIcon style={{ fontSize: "25pt" }} />}
              />
            </div>
          );
        })}
      </div>

      {/* Vacancies & Transactions Row */}
      <div className="row">
        <div className="col-md-8">
          <UIPieChartCard
            isLoading={isLoading}
            info={"Unit Vacancies"}
            title={"Occupied vs Vacant Units"}
            height={"386px"}
            legendPosition={"right"}
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
            data={[occupiedUnits, vacantUnits]}
            labels={["Occupied", "Vacant"]}
            colors={[uiGreen, "#f4f7f8"]}
            dropDownOptions={[
              { value: "all", label: "All Properties" }, // Hardcoded default option
              ...properties.map((property) => ({
                value: property.id,
                label: property.name,
              })),
            ]}
            onDropdownChange={handlePropertyChange}
          />
        </div>
        <div className="col-md-4">
          <UICardList
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
                  transaction.created_at
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
          />
        </div>
      </div>

      {/* Lease Agreements &  Row */}
      <div className="row">
        <div className="col-md-6">
          <UITableCard
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
            title={"Upcoming Lease Endings"}
            columns={lease_agreement_columns}
            info={"Lease Agreements"}
            endpoint={"/lease-agreements/"}
            options={lease_agreement_options}
          />
        </div>
        <div className="col-md-6">
          <UIPieChartCard
            isLoading={isLoading}
            info={"Best Performing Properties"}
            title={"Revenue Per Property"}
            height={"456px"}
            legendPosition={"bottom"}
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
            chartContainerStyles={{ padding: "1rem" }}
            data={groupedPropertiesByTransactions.map((property) => {
              return property.totalAmount;
            })}
            labels={groupedPropertiesByTransactions.map((property) => {
              return property.name;
            })}
            colors={["#D9E3BC", "#D1EFD5", "#7FC9BB", "#A3F58F", "#3AAF5C"]} // |--X #B5EAD7, #A5DEE4, #A5BEE4
          />
        </div>
      </div>

      {/*Maintenance Request Row*/}
      <div className="row">
        <div className="col-md-12">
          <UITableCard
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

      {/* Lease Cancellation  Row */}
      <div className="row">
        <div className="col-md-6">
          <UITableCard
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
            title={"Recent Lease Cancellation Requests"}
            columns={lease_cancellation_columns}
            info={"Recent Lease Cancellation Requests"}
            endpoint={"/lease-cancellation-requests/"}
            options={lease_agreement_options}
          />
        </div>
        <div className="col-md-6">
          <UIPieChartCard
            isLoading={isLoading}
            info={"Pending vs Approved Requests"}
            title={"Lease Cancellation Requests"}
            height={"456px"}
            legendPosition={"bottom"}
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
            chartContainerStyles={{ padding: "1rem" }}
            data={[
              groupLeaseCancellationRequests(leaseCancellationRequests).pending
                .length,
              groupLeaseCancellationRequests(leaseCancellationRequests).approved
                .length,
            ]}
            labels={["Pending", "Approved"]}
            colors={["#f4f7f8", uiGreen]}
          />
        </div>
      </div>

      {/* Lease Renewal  Row */}
      <div className="row">
        <div className="col-md-6">
          <UITableCard
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
            title={"Recent Lease Renewal Requests"}
            columns={lease_renewal_columns}
            info={"Recent Lease Renewal Requests"}
            endpoint={"/lease-renewal-requests/"}
            options={lease_agreement_options}
          />
        </div>
        <div className="col-md-6">
          <UIPieChartCard
            isLoading={isLoading}
            info={"Pending vs Approved Requests"}
            title={"Lease Renewal Requests"}
            height={"456px"}
            legendPosition={"bottom"}
            cardStyle={{ background: "white", color: "black" }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt" }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
            chartContainerStyles={{ padding: "1rem" }}
            data={[
              groupLeaseRenewalRequests(leaseRenewalRequests).pending.length,
              groupLeaseRenewalRequests(leaseRenewalRequests).approved.length,
            ]}
            labels={["Pending", "Approved"]}
            colors={["#f4f7f8", uiGreen]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
