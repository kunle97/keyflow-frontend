import React, { useState } from "react";
import { uiGreen, uiRed, uiGrey2, authUser, uiGrey } from "../../constants";
import { useEffect } from "react";
import { getTransactionsByUser } from "../../api/transactions";
import { useNavigate } from "react-router";
import UILineChartCard from "./UIComponents/UICards/UILineChartCard";
import UItableMiniCard from "./UIComponents/UICards/UITableMiniCard";
import UIPieChartCard from "./UIComponents/UICards/UIPieChartCard";
import { getOwnerUnits } from "../../api/units";
import { getProperties } from "../../api/properties";
import UIInfoCard from "./UIComponents/UICards/UIInfoCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UICardList from "./UIComponents/UICards/UICardList";
import UIChartCard from "./UIComponents/UICards/UICard";
import UICard from "./UIComponents/UICards/UICard";
import UIProgressPrompt from "./UIComponents/UIProgressPrompt";
import { getAllLeaseRenewalRequests } from "../../api/lease_renewal_requests";
import { getAllLeaseCancellationRequests } from "../../api/lease_cancellation_requests";
import { Alert, IconButton, Stack, Tooltip } from "@mui/material";
import useScreen from "../../hooks/useScreen";
import { authenticatedInstance } from "../../api/api";
import { getAllOwnerMaintenanceRequests } from "../../api/maintenance_requests";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Link } from "react-router-dom";
import UIDialog from "./UIComponents/Modals/UIDialog";
import ImportDataForm from "./ImportDataForm";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "./UIComponents/UIHelpButton";
import UIButton from "./UIComponents/UIButton";
import {
  getStripeOnboardingAccountLink,
  getStripeAccountRequirements,
} from "../../api/owners";
import AlertModal from "./UIComponents/Modals/AlertModal";
import ConfirmModal from "./UIComponents/Modals/ConfirmModal";
const OwnerDashboard = () => {
  const multiplier = [1, 2, 3, 5];
  const { isMobile, breakpoints, screenWidth } = useScreen();
  const navigate = useNavigate();
  const [importDataDialogOpen, setImportDataDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set loading to true on component mount
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [leaseRenewalRequests, setLeaseRenewalRequests] = useState([]);
  const [leaseCancellationRequests, setLeaseCancellationRequests] = useState(
    []
  );
  const [stripeAccountRequirements, setStripeAccountRequirements] = useState(
    []
  );
  const [displayOnboardingAlert, setDisplayOnboardingAlert] = useState(false);
  const [stripeOnboardingPromptOpen, setStripeOnboardingPromptOpen] =
    useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [occupiedUnits, setOccupiedUnits] = useState([]);
  const [vacantUnits, setVacantUnits] = useState([]);
  const [leaseAgreements, setLeaseAgreements] = useState([]);
  const [stripeAccountLink, setStripeAccountLink] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalTitle, setAlertModalTitle] = useState("");
  /*Transaction Related States*/
  const [transactionTypes, setTransactionTypes] = useState([]); // ["revenue", "expense", "rent_payment", "security_deposit"
  const [groupedTransactionData, setGroupedTransactionData] = useState([]);
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
  const startIconStyles = {
    fontSize: "55pt",
    color: uiGreen,
  };
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const ownerTourSteps = [
    {
      target: ".dashboard-content",
      content: (
        <>
          <h4>Welcome to your dashboard</h4>
          <p>
            This is the the Keyflow owner dashboard. here you can view and
            manage your properties, units, tenants and more. Let's go over the
            basics!
          </p>
        </>
      ),
      disableBeacon: true,
      placement: "center",
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
      target: '[data-testid="search-bar-desktop"]',
      content:
        "Use the search bar to search for properties, units, tenants,maintenance requests and any other resources. You can simply type in the search bar or click the search icon to bring up the search dialog.",
    },
    {
      target: ".notification-topbar-icon",
      content:
        "Click here to view your notifications. You will receive notifications for tenant activity, lease renewal requests, lease cancellation requests, maintenance requests, and more. You can turn some notifications on or off in your account settings.",
    },
    {
      target: ".messages-topbar-icon",
      content:
        "Click here to view your messages. You can send and receive messages from your tenants.",
    },
    {
      target: ".my-account-topbar-dropdown",
      content: "Click here to view your account settings, and to log out.",
      spotlightClicks: true,
      disableBeacon: false,
    },
    {
      target: "#view-transactions-button",
      content:
        "Click here to view all your transactions on the Stripe express dashboard. You can also manage payouts, view your account balance, and more.",
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

  const handleOpenImportDataDialog = () => {
    const requirements_length = stripeAccountRequirements.currently_due.length;
    if (requirements_length > 0) {
      setStripeOnboardingPromptOpen(true);
    } else {
      setImportDataDialogOpen(true);
    }
  };

  const handleClickCreatePropertyCard = () => {
    const requirements_length = stripeAccountRequirements.currently_due.length;
    if (requirements_length > 0) {
      setStripeOnboardingPromptOpen(true);
    } else {
      navigate("/dashboard/owner/properties/create");
    }
  };

  const startScreenMenuItems = [
    {
      name: "Create A Property",
      icon: <MapsHomeWorkOutlinedIcon sx={startIconStyles} />,
      action: () => handleClickCreatePropertyCard(),
      subtitle: "Create a new property and add units to it.",
    },
    {
      name: "Create a Lease Template",
      icon: <StickyNote2OutlinedIcon sx={startIconStyles} />,
      url: "/dashboard/owner/lease-templates/create",
      subtitle:
        "Create a lease template to set the terms and conditions for multiple units.",
    },
    {
      name: "Import Data",
      icon: <FileDownloadOutlinedIcon sx={startIconStyles} />,
      action: () => handleOpenImportDataDialog(),
      subtitle:
        "Import data from a CSV file to add properties, units, and tenants.",
    },
  ];
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
            output = `${value.user.first_name} ${value.user.last_name}`;
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
            output = `${value.user.first_name} ${value.user.last_name}`;
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
            output = `${value.user.first_name} ${value.user.last_name}`;
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
    // { name: "description", label: "Issue" },
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
    const navlink = `/dashboard/owner/transactions/${rowData}`;
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
          x: new Date(transaction.timestamp).toLocaleDateString(),
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

    const allMonths = [];
    while (pastDate <= currentDate) {
      const yearMonth = pastDate.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
      }); // Get month name
      allMonths.push({
        month: yearMonth,
        totalRevenue: 0,
        totalExpense: 0,
      });
      pastDate.setMonth(pastDate.getMonth() + 1);
    }

    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp);
      const monthYear = date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
      }); // Get month name

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          totalRevenue: 0,
          totalExpense: 0,
        };
      }

      if (
        transaction.type === "expense" ||
        transaction.type === "vendor_payment"
      ) {
        acc[monthYear].totalExpense += parseFloat(transaction.amount);
      } else {
        acc[monthYear].totalRevenue += parseFloat(transaction.amount);
      }
      return acc;
    }, {});

    // Merge allMonths and groupedData in the correct order
    const mergedData = allMonths.map((monthData) => {
      const { month, totalRevenue, totalExpense } =
        groupedData[monthData.month] || monthData;
      return { month, totalRevenue, totalExpense };
    });

    return mergedData;
  }

  const groupedData = groupTransactionsByMonth(transactions, 5); // Use your function to get grouped data
  const labels = groupedData.map((data) => data.month);
  const dataValues = groupedData.map((data) => ({
    totalRevenue: data.totalRevenue,
    totalExpense: data.totalExpense,
  }));
  //Create a function to group properties by the amount of transactions they have. Group them as an array of objects with the property name and total amount of transactions {name:"property name", totalAmount: 1900"}

  const groupPropertiesByTransactions = (
    transactions,
    numberOfPropertiesToShow = 5
  ) => {
    const groupedProperties = {};
    transactions.forEach((transaction) => {
      const propName = transaction.rental_property?.name;
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
  };
  //Create a function to change the transaction data based on the transaction type selected
  const handleTransactionTypeChange = (e) => {
    const transactionType = e.target.value;

    // If transaction type is 'all', set transaction data to all transactions
    if (transactionType === "all") {
      setTransactionDataValues(dataValues);
      return;
    }

    // Filter the dataValues based on the selected transaction type
    const filteredData = groupedTransactionData.map((data) => ({
      month: data.month,
      totalAmount: data[transactionType],
    }));

    setTransactionDataValues(filteredData);
  };

  const fetchTransactionData = async () => {
    try {
      const res = await getTransactionsByUser(); // Assuming getTransactionsByUser is an async function
      setTransactions(res.data.reverse());

      const groupedData = groupTransactionsByMonth(res.data, 5);
      setGroupedTransactionData(groupedData);

      const labels = groupedData.map((data) => data.month);
      setTransactionLabels(labels);

      const dataValues = groupedData.map((data) => ({
        totalRevenue: data.totalRevenue,
        totalExpense: data.totalExpense,
      }));
      setTransactionDataValues(dataValues);

      setGroupedPropertiesByTransactions(
        groupPropertiesByTransactions(res.data)
      );
    } catch (error) {
      // Handle any errors here
    }
  };
  useEffect(() => {
    authUser.account_type === "tenant" && navigate("/dashboard/tenant");
    setIsLoading(true);
    //retrieve transactions from api
    try {
      getStripeOnboardingAccountLink().then((res) => {
        console.log("Stripe ACcount link res: ", res);
        setStripeAccountLink(res.account_link);
      });
      getStripeAccountRequirements().then((res) => {
        console.log("Stripe Account Requirements: ", res);
        setStripeAccountRequirements(res.requirements);
        setStripeOnboardingPromptOpen(
          res.requirements.currently_due.length > 0
        );
        setDisplayOnboardingAlert(res.requirements.currently_due.length > 0);
      });
      fetchTransactionData();
      getOwnerUnits().then((res) => {
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
      authenticatedInstance
        .get("/lease-agreements/?ordering=end_date&limit=5")
        .then((res) => {
          setLeaseAgreements(res.data.results);
        });
      getAllOwnerMaintenanceRequests().then((res) => {
        setMaintenanceRequests(res.data.results);
      });
    } catch (error) {
      console.error(error);
      setAlertModalTitle("Error");
      setAlertModalMessage("An error occurred while fetching your data.");
      setAlertModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [screenWidth]);

  return isLoading ? (
    <UIProgressPrompt
      title={"Fetching your data for ya. Give us a sec..."}
      message={"Hang Tight!"}
    />
  ) : (
    <div className="container-fluid dashboard-container">
      {displayOnboardingAlert && (
        <Alert
          severity="warning"
          style={{
            marginBottom: "1rem",
          }}
        >
          <div>
            <h6 className="mb-1">
              <strong>Complete Stripe Account Onboarding</strong>
            </h6>
            <span>
              Certain account features such as property/unit creation and rent
              collection will be disabled until you complete your Stripe account
              onboarding.
            </span>

            <div className="my-2">
              <a
                href={stripeAccountLink}
                style={{
                  color: "inherit",
                  textDecoration: "underline",
                }}
              >
                <strong>Complete Account Setup</strong>
              </a>
            </div>
          </div>
        </Alert>
      )}
      <AlertModal
        open={alertModalOpen}
        onClick={() => setAlertModalOpen(false)}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Okay"
      />
      <ConfirmModal
        open={stripeOnboardingPromptOpen}
        title={"Complete Stripe Account Onboarding"}
        message={
          "In order to receive payments, add properties, and units you need to complete your Stripe account onboarding. Click the button below to complete your account setup."
        }
        confirmBtnText={"Complete Account Setup"}
        handleConfirm={() => {
          window.open(stripeAccountLink, "_blank");
        }}
        confirmBtnStyle={{
          color: "white",
          background: uiGreen,
        }}
        cancelBtnStyle={{
          color: "white",
          background: uiGrey2,
        }}
        cancelBtnText={"Not Now"}
        handleCancel={() => {
          setStripeOnboardingPromptOpen(false);
        }}
      />
      {transactions.length === 0 &&
      leaseAgreements.length === 0 &&
      maintenanceRequests.length === 0 &&
      leaseRenewalRequests.length === 0 &&
      leaseCancellationRequests.length === 0 &&
      units.length === 0 ? (
        <div className="ui-start-screen" id="ui-start-screen">
          <UIDialog
            title="Import Data"
            open={importDataDialogOpen}
            onClose={() => setImportDataDialogOpen(false)}
            style={{
              width: "1200px",
            }}
          >
            <ImportDataForm />
          </UIDialog>
          <div
            className="row"
            style={{
              padding: "5rem 0rem",
            }}
          >
            <Stack
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={2}
              sx={{
                marginBottom: "2rem",
              }}
            >
              <h3 style={{ color: uiGrey2, fontWeight: "bold" }}>
                Welcome to your dashboard
              </h3>
              <span style={{ color: uiGrey2, fontSize: "14pt" }}>
                Let's get you started by creating a property, lease template, or
                importing data.
              </span>
            </Stack>
            {startScreenMenuItems.map((item, index) => {
              return (
                <div
                  className="col-md-4 px-4"
                  key={index}
                  style={{ cursor: "pointer" }}
                >
                  {item.url ? (
                    <Link to={item.url}>
                      <div
                        className="card"
                        style={{
                          height: "150px",
                          display: "flex",
                          backgroundColor: "white",
                          justifyContent: "center",
                          alignItems: "center",
                          color: uiGrey2,
                          padding: "130px 30px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>{item.icon}</div>
                          <span
                            style={{
                              fontSize: "14pt",
                              textAlign: "center",
                            }}
                          >
                            {item.name}
                          </span>
                          <span
                            className="text-muted"
                            style={{
                              fontSize: "12pt",
                              textAlign: "center",
                            }}
                          >
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : item.action ? (
                    <div
                      className="card"
                      style={{
                        height: "150px",
                        display: "flex",
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        color: uiGrey2,
                        padding: "130px 30px",
                      }}
                      onClick={item.action}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div>{item.icon}</div>
                        <span
                          style={{
                            fontSize: "14pt",
                            textAlign: "center",
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          className="text-muted"
                          style={{
                            fontSize: "12pt",
                            textAlign: "center",
                          }}
                        >
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <Joyride
            // key={runTour ? "run" : "stop"}
            run={runTour}
            index={tourIndex}
            steps={ownerTourSteps}
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
          <div className="data-section" id="data-section">
            {/* Line Chart Row */}
            <div className="row">
              <div className="col-md-8 ">
                <UILineChartCard
                  dataTestId="dashboard-line-chart-card"
                  isLoading={isLoading}
                  height={isMobile ? "270px" : "410px"}
                  title="Total Revenue and Expenses"
                  info={`$${transactionDataValues
                    .reduce((a, b) => a + b.totalRevenue, 0)
                    .toLocaleString()}`}
                  cardStyle={{ background: "white", color: "black" }}
                  infoStyle={{
                    color: uiGrey2,
                    fontSize: isMobile ? "15pt" : "22pt",
                  }}
                  titleStyle={{
                    color: uiGrey2,
                    fontSize: isMobile ? "12pt" : "16pt",
                  }}
                  labels={transactionLabels}
                  data={transactionDataValues}
                  onDropdownChange={handleTransactionTypeChange}
                  dropDownOptions={[
                    { value: "all", label: "All Transactions" }, // Hardcoded default option
                    { value: "noi", label: "Net Operating Income" }, //Should display two lines on the chart. one for revenue and one for expenses
                    { value: "rent_payments", label: "Rent Payments" },
                    { value: "security_deposits", label: "Security Deposits" },
                    { value: "expenses", label: "Expenses" },
                    { value: "revenue", label: "Revenue" },
                  ]}
                />
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4">
                {transactions.length === 0 ? (
                  <UICard
                    cardStyle={{ height: "478px" }}
                    dataTestId={"dashboard-transactions-card-no-data"}
                  >
                    <Stack
                      direction={"column"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      spacing={2}
                      sx={{
                        height: "400px",
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      <h4>Seems like you're new around here...</h4>
                      <p>There are no transactions to display.</p>
                    </Stack>
                  </UICard>
                ) : (
                  <div>
                    <UICardList
                      dataTestId="dashboard-transactions-card"
                      cardStyle={{ background: "white", color: "black" }}
                      infoStyle={{
                        color: uiGrey2,
                        fontSize: isMobile ? "12pt" : "16pt",
                      }}
                      titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                      title={"Recent Transactions"}
                      info={"Recent Transactions"}
                      onInfoClick={() =>
                        navigate("/dashboard/owner/transactions")
                      }
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
                    />
                    <UIButton
                      id="view-transactions-button"
                      style={{
                        float: "right",
                        width: "100%",
                      }}
                      onClick={() => {
                        window.open(stripeAccountLink, "_blank");
                      }}
                      btnText="View All Transactions"
                      btnIcon={<AttachMoneyIcon />}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Info Card Row (hidden on mobile and desktop too) */}
            <div className="row my-2">
              {multiplier.map((item, index) => {
                return (
                  <div className="d-none d-sm-none d-md-block col-md-6 col-lg-3">
                    <UIInfoCard
                      cardStyle={{ background: "white", color: uiGrey2 }}
                      infoStyle={{
                        color: uiGrey2,
                        fontSize: isMobile ? "12pt" : "16pt",
                        margin: 0,
                      }}
                      titleStyle={{
                        color: uiGrey2,
                        fontSize: "12pt",
                        margin: 0,
                      }}
                      info={`$`}
                      title={"Total Revenue"}
                      icon={<AttachMoneyIcon style={{ fontSize: "25pt" }} />}
                    />
                  </div>
                );
              })}
            </div>

            {/* Vacancies & Transactions Row */}
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <UIPieChartCard
                  dataTestId="dashboard-pie-chart-card"
                  isLoading={isLoading}
                  info={"Vacancies"}
                  title={"Occupied vs Vacant Units"}
                  height={isMobile ? "256px" : "306px"}
                  legendPosition={"right"}
                  cardStyle={{ background: "white", color: "black" }}
                  infoStyle={{
                    color: uiGrey2,
                    fontSize: isMobile ? "12pt" : "16pt",
                  }}
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
              </div>{" "}
              <div className="col-md-6">
                <UIPieChartCard
                  dataTestId="dashboard-revenue-by-property-pie-chart-card"
                  isLoading={isLoading}
                  info={"Best Performing Properties"}
                  title={"Revenue Per Property"}
                  height={isMobile ? "256px" : "306px"}
                  legendPosition={"right"}
                  cardStyle={{ background: "white", color: "black" }}
                  infoStyle={{
                    color: uiGrey2,
                    fontSize: isMobile ? "12pt" : "16pt",
                  }}
                  titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                  chartContainerStyles={{ padding: "1rem" }}
                  data={groupedPropertiesByTransactions.map((property) => {
                    return property.totalAmount;
                  })}
                  labels={groupedPropertiesByTransactions.map((property) => {
                    return property.name;
                  })}
                  colors={[
                    "#D9E3BC",
                    "#D1EFD5",
                    "#7FC9BB",
                    "#A3F58F",
                    "#3AAF5C",
                  ]} // |--X #B5EAD7, #A5DEE4, #A5BEE4
                />
              </div>
            </div>

            {/* Lease Agreements &  Row */}
            <div className="row">
              <div className="col-md-6">
                {screenWidth > breakpoints.md ? (
                  <UItableMiniCard
                    dataTestId="dashboard-lease-agreements-card-list-desktop"
                    cardStyle={{
                      background: "white",
                      color: "black",
                    }}
                    infoStyle={{
                      color: uiGrey2,
                      fontSize: isMobile ? "12pt" : "16pt",
                    }}
                    titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                    title={"Upcoming Lease Endings"}
                    columns={lease_agreement_columns}
                    info={"Lease Agreements"}
                    // endpoint={"/lease-agreements/"}
                    data={leaseAgreements}
                    options={lease_agreement_options}
                  />
                ) : (
                  <UICardList
                    dataTestId="dashboard-lease-agreements-card-list-mobile"
                    cardStyle={{ background: "white", color: "black" }}
                    infoStyle={{
                      color: uiGrey2,
                      fontSize: isMobile ? "12pt" : "16pt",
                    }}
                    titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                    title={"Upcoming Lease Endings"}
                    info={"Lease Agreements"}
                    onInfoClick={() =>
                      navigate("/dashboard/owner/lease-agreements")
                    }
                    items={leaseAgreements
                      .map((leaseAgreement) => ({
                        primary: `${leaseAgreement.tenant?.user.first_name} ${leaseAgreement.tenant?.user.last_name}`,
                        secondary: "Unit " + leaseAgreement.rental_unit.name,
                        tertiary: `Ends: ${new Date(
                          leaseAgreement.end_date
                        ).toLocaleDateString()}`,
                        icon: <AttachMoneyIcon />,
                      }))
                      .slice(0, 5)}
                    tertiaryStyles={{ color: uiGreen }}
                  />
                )}
              </div>{" "}
              <div className="col-md-6">
                {screenWidth > breakpoints.md ? (
                  <UItableMiniCard
                    dataTestId="dashboard-maintenance-requests-table-card-desktop"
                    cardStyle={{
                      background: "white",
                      color: "black",
                      height: "348px",
                      overflowY: "auto",
                    }}
                    infoStyle={{
                      color: uiGrey2,
                      fontSize: isMobile ? "12pt" : "16pt",
                    }}
                    titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                    title={"Recent Maintenance Requests"}
                    columns={maintenance_request_columns}
                    info={"Recent Maintenance Requests"}
                    data={maintenanceRequests}
                    options={maintenance_request_options}
                  />
                ) : (
                  <UICardList
                    dataTestId="dashboard-maintenance-requests-card-list-mobile"
                    cardStyle={{ background: "white", color: "black" }}
                    infoStyle={{
                      color: uiGrey2,
                      fontSize: isMobile ? "12pt" : "16pt",
                    }}
                    titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                    title={"Recent Maintenance Requests"}
                    info={"Maintenance Requests"}
                    onInfoClick={() =>
                      navigate("/dashboard/owner/maintenance-requests")
                    }
                    items={maintenanceRequests
                      .map((maintenanceRequest) => {
                        let status = maintenanceRequest.status.replace(
                          "_",
                          " "
                        );

                        if (status === "pending") {
                          status = (
                            <span>
                              {maintenanceRequest.type} |{" "}
                              <span className="text-warning">Pending</span>
                            </span>
                          );
                        } else if (status === "in progress") {
                          status = (
                            <span>
                              {maintenanceRequest.type} |{" "}
                              <span className="text-info">In Progress</span>
                            </span>
                          );
                        } else if (status === "completed") {
                          status = (
                            <span>
                              {maintenanceRequest.type} |{" "}
                              <span className="text-success">Completed</span>
                            </span>
                          );
                        }

                        const combinedStatus = `${maintenanceRequest.type} | ${status}`;

                        return {
                          primary: maintenanceRequest.description,
                          secondary: status,
                          tertiary: new Date(
                            maintenanceRequest.created_at
                          ).toLocaleDateString(),
                          icon: <AttachMoneyIcon />,
                        };
                      })
                      .slice(0, 5)}
                    tertiaryStyles={{ color: uiGreen }}
                  />
                )}
              </div>
            </div>

            {/* Lease Cancellation  Row */}
            {leaseCancellationRequests && (
              <div className="row">
                <div className="col-md-6">
                  {screenWidth > breakpoints.md ? (
                    <UItableMiniCard
                      dataTestId="dashboard-lease-cancellation-requests-table-card-desktop"
                      cardStyle={{
                        background: "white",
                        color: "black",
                        height: "530px",
                        overflowY: "auto",
                      }}
                      infoStyle={{
                        color: uiGrey2,
                        fontSize: isMobile ? "12pt" : "16pt",
                      }}
                      titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                      title={"Recent Lease Cancellation Requests"}
                      columns={lease_cancellation_columns}
                      info={"Recent Lease Cancellation Requests"}
                      endpoint={"/lease-cancellation-requests/"}
                      data={leaseCancellationRequests}
                      options={lease_agreement_options}
                    />
                  ) : (
                    <UICardList
                      dataTestId="dashboard-lease-cancellation-requests-card-mobile"
                      cardStyle={{ background: "white", color: "black" }}
                      infoStyle={{
                        color: uiGrey2,
                        fontSize: isMobile ? "12pt" : "16pt",
                      }}
                      titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                      title={"Recent Lease Cancellation Requests"}
                      info={"Lease Cancellation Requests"}
                      onInfoClick={() =>
                        navigate("/dashboard/owner/lease-cancellation-requests")
                      }
                      items={leaseCancellationRequests
                        .map((leaseCancellationRequest) => {
                          let status = leaseCancellationRequest.status.replace(
                            "_",
                            " "
                          );

                          if (status === "pending") {
                            status = (
                              <span>
                                Unit{" "}
                                {leaseCancellationRequest.rental_unit?.name} |{" "}
                                <span className="text-warning">Pending</span>
                              </span>
                            );
                          } else if (status === "approved") {
                            status = (
                              <span>
                                Unit{" "}
                                {leaseCancellationRequest.rental_unit?.name} |{" "}
                                <span className="text-success">Approved</span>
                              </span>
                            );
                          } else if (status === "rejected") {
                            status = (
                              <span>
                                Unit{" "}
                                {leaseCancellationRequest.rental_unit?.name} |{" "}
                                <span className="text-danger">Rejected</span>
                              </span>
                            );
                          }

                          return {
                            primary:
                              leaseCancellationRequest.tenant.user.first_name +
                              " " +
                              leaseCancellationRequest.tenant.user.last_name,
                            secondary: status,
                            tertiary: new Date(
                              leaseCancellationRequest.created_at
                            ).toLocaleDateString(),
                            icon: <AttachMoneyIcon />,
                          };
                        })
                        .slice(0, 5)}
                      tertiaryStyles={{ color: uiGreen }}
                    />
                  )}
                </div>
                <div className="col-md-6">
                  <UIPieChartCard
                    dataTestId="dashboard-lease-cancellation-requests-pie-chart-card"
                    isLoading={isLoading}
                    info={"Pending vs Approved Requests"}
                    title={"Lease Cancellation Requests"}
                    height={isMobile ? "356px" : "456px"}
                    legendPosition={"right"}
                    cardStyle={{ background: "white", color: "black" }}
                    infoStyle={{
                      color: uiGrey2,
                      fontSize: isMobile ? "12pt" : "16pt",
                    }}
                    titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                    chartContainerStyles={{ padding: "1rem" }}
                    data={[
                      groupLeaseCancellationRequests(leaseCancellationRequests)
                        .pending.length,
                      groupLeaseCancellationRequests(leaseCancellationRequests)
                        .approved.length,
                    ]}
                    labels={["Pending", "Approved"]}
                    colors={["#f4f7f8", uiGreen]}
                  />
                </div>
              </div>
            )}

            {/* Lease Renewal  Row */}
            {leaseRenewalRequests && (
              <div className="row">
                <div className="col-md-6">
                  {screenWidth > breakpoints.md ? (
                    <UItableMiniCard
                      dataTestId="dashboard-lease-renewal-requests-table-card-desktop"
                      cardStyle={{
                        background: "white",
                        color: "black",
                        height: "530px",
                        overflowY: "auto",
                      }}
                      infoStyle={{
                        color: uiGrey2,
                        fontSize: isMobile ? "12pt" : "16pt",
                      }}
                      titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                      title={"Recent Lease Renewal Requests"}
                      columns={lease_renewal_columns}
                      info={"Recent Lease Renewal Requests"}
                      data={leaseRenewalRequests}
                      options={lease_agreement_options}
                    />
                  ) : (
                    <UICardList
                      dataTestId="dashboard-lease-renewal-requests-card-mobile"
                      cardStyle={{ background: "white", color: "black" }}
                      infoStyle={{
                        color: uiGrey2,
                        fontSize: isMobile ? "12pt" : "16pt",
                      }}
                      titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                      title={"Recent Lease Renewal Requests"}
                      info={"Lease Renewal Requests"}
                      onInfoClick={() =>
                        navigate("/dashboard/owner/lease-renewal-requests")
                      }
                      items={leaseRenewalRequests
                        .map((leaseRenewalRequest) => {
                          let status = leaseRenewalRequest.status.replace(
                            "_",
                            " "
                          );

                          if (status === "pending") {
                            status = (
                              <span>
                                Unit {leaseRenewalRequest.rental_unit?.name} |{" "}
                                <span className="text-warning">Pending</span>
                              </span>
                            );
                          } else if (status === "denied") {
                            status = (
                              <span>
                                Unit {leaseRenewalRequest.rental_unit?.name} |{" "}
                                <span className="text-danger">Denied</span>
                              </span>
                            );
                          } else if (status === "approved") {
                            status = (
                              <span>
                                Unit {leaseRenewalRequest.rental_unit?.name} |{" "}
                                <span className="text-success">Approved</span>
                              </span>
                            );
                          }

                          return {
                            primary:
                              leaseRenewalRequest.tenant.user.first_name +
                              " " +
                              leaseRenewalRequest.tenant.user.last_name,
                            secondary: status,
                            tertiary: new Date(
                              leaseRenewalRequest.created_at
                            ).toLocaleDateString(),
                            icon: <AttachMoneyIcon />,
                          };
                        })
                        .slice(0, 5)}
                      tertiaryStyles={{ color: uiGreen }}
                    />
                  )}
                </div>
                <div className="col-md-6">
                  <UIPieChartCard
                    dataTestId="dashboard-lease-renewal-requests-pie-chart-card"
                    isLoading={isLoading}
                    info={"Pending vs Approved Requests"}
                    title={"Lease Renewal Requests"}
                    height={isMobile ? "356px" : "456px"}
                    legendPosition={"right"}
                    cardStyle={{ background: "white", color: "black" }}
                    infoStyle={{
                      color: uiGrey2,
                      fontSize: isMobile ? "12pt" : "16pt",
                    }}
                    titleStyle={{ color: uiGrey2, fontSize: "12pt" }}
                    chartContainerStyles={{ padding: "1rem" }}
                    data={[
                      groupLeaseRenewalRequests(leaseRenewalRequests).pending
                        .length,
                      groupLeaseRenewalRequests(leaseRenewalRequests).approved
                        .length,
                    ]}
                    labels={["Pending", "Approved"]}
                    colors={["#f4f7f8", uiGreen]}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <UIHelpButton onClick={handleClickStart} tooltipTitle="Take a Tour" />
    </div>
  );
};

export default OwnerDashboard;
