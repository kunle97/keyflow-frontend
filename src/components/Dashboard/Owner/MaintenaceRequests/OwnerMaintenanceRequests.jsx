import React from "react";
import { useEffect } from "react";
import {
  deleteMaintenanceRequest,
  getAllOwnerMaintenanceRequests,
} from "../../../../api/maintenance_requests";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uiGreen, uiGrey2 } from "../../../../constants";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import UIInfoCard from "../../UIComponents/UICards/UIInfoCard";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { Chip } from "@mui/material";
import useScreen from "../../../../hooks/useScreen";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const OwnerMaintenanceRequests = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  //TODO: Display data on what properties/units have the most pending, respolved isues

  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [pendingIssues, setPendingIssues] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [inProgressIssues, setInProgressIssues] = useState(0);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [orderingField, setOrderingField] = useState("created_at");
  const [searchField, setSearchField] = useState("");
  const [limit, setLimit] = useState(10);
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".maintenace-requests-section",
      content:
        "This is the maintenance requests section. Here you can view all the maintenance requests for your properties.",
      disableBeacon: true,
    },
    {
      target: ".info-cards-row",
      content:
        "These are the info cards that show you the number of resolved, pending, and in progress issues.",
    },
    {
      target: ".pay-vendor-button",
      content: "You can pay your vendors here.",
    },
    {
      target: ".maintenance-request-section-table",
      content:
        "This is the maintenance requests table. Here you can view all the maintenance requests for your properties.",
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
  const columns = [
    {
      name: "tenant",
      label: "Tenant",
      options: {
        orderingField: "tenant__user__last_name",
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
    { name: "description", label: "Issue" },
    {
      name: "priority",
      label: "Priority",
      options: {
        customBodyRender: (value) => {
          if (value === 1) {
            return <Chip label="Low" color="success" />;
          } else if (value === 2) {
            return <Chip label="Moderate" color="info" />;
          } else if (value === 3) {
            return <Chip label="High" color="warning" />;
          } else if (value === 4) {
            return <Chip label="Urgent" color="error" />;
          } else if (value === 5) {
            return <Chip label="Emergency" color="error" />;
          } else {
            return <Chip label="N/A" color="default" />;
          }
        },
      },
    },
    { name: "type", label: "Type" },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "pending") {
            return <Chip label="Pending" color="warning" />;
          } else if (value === "in_progress") {
            return <Chip label="In Progress" color="info" />;
          } else if (value === "completed") {
            return <Chip label="Completed" color="success" />;
          } else {
            return <Chip label="N/A" color="default" />;
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

  const handleRowClick = (row, rowMeta) => {
    const navlink = `/dashboard/owner/maintenance-requests/${row.id}`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
    rowHover: true,
    onRowDelete: (row) => {
      setIsLoading(true);
      deleteMaintenanceRequest(row.id)
        .then((res) => {
          if (res.status === 204) {
            setAlertTitle("Success");
            setAlertMessage("Maintenance request deleted successfully");
            setShowAlert(true);
          } else {
            setAlertTitle("Error");
            setAlertMessage(
              "An error occurred while deleting the maintenance request"
            );
            setShowAlert(true);
          }
        })
        .catch((err) => {
          setAlertTitle("Error");
          setAlertMessage(
            "An error occurred while deleting the maintenance request"
          );
          setShowAlert(true);
        });
    },
    deleteOptions: {
      confirmTitle: "Delete Maintenance Request",
      confirmMessage:
        "Are you sure you want to delete this maintenance request?",
    },
  };

  useEffect(() => {
    //Retrieve the maintenance requests
    getAllOwnerMaintenanceRequests(orderingField, searchField, limit)
      .then((res) => {
        setMaintenanceRequests(res.data.results);
        setResolvedIssues(
          res.data.results.filter((request) => {
            return request.status === "completed";
          }).length
        );
        setPendingIssues(
          res.data.results.filter((request) => {
            return request.status === "pending";
          }).length
        );
        setInProgressIssues(
          res.data.results.filter((request) => {
            return request.status === "in_progress";
          }).length
        );
      })
      .catch((error) => {
        console.error("Error fetching maintenance requests:", error);
        setDeleteErrorMessage("Error fetching maintenance requests");
        setShowDeleteError(true);
      });
  }, [orderingField, searchField, limit]);

  return (
    <div className="container-fluid maintenace-requests-section">
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
        title={alertTitle}
        message={alertMessage}
        open={showAlert}
        onClick={() => {
          navigate(0);
        }}
      />
      <ProgressModal open={isLoading} title="Please Wait..." />
      <div className="row info-cards-row ">
        <div className="col-md-4 mb-4">
          <UIInfoCard
            cardStyle={{ background: "white", color: uiGrey2 }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
            info={resolvedIssues}
            title={"Resolved Issues"}
          />
        </div>
        <div className="col-6 col-md-4 mb-4">
          <UIInfoCard
            cardStyle={{ background: "white", color: uiGrey2 }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
            info={inProgressIssues}
            title={"Issues In Progress"}
          />
        </div>
        <div className="col-6 col-md-4 mb-4">
          <UIInfoCard
            cardStyle={{ background: "white", color: uiGrey2 }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
            info={pendingIssues}
            title={"Pending Issues"}
          />
        </div>
      </div>
      <AlertModal
        open={showDeleteError}
        onClick={() => setShowDeleteError(false)}
        title="Error"
        message={deleteErrorMessage}
        btnText="Close"
      />
      {isMobile ? (
        <UITableMobile
          // data={maintenanceRequests}
          endpoint="/maintenance-requests/"
          createInfo={(row) =>
            `${row.tenant.user["first_name"]} ${row.tenant.user["last_name"]}`
          }
          createTitle={(row) => `${row.description}`}
          createSubtitle={(row) => `${row.status.replace("_", " ")}`}
          onRowClick={(row) => {
            const navlink = `/dashboard/owner/maintenance-requests/${row.id}`;
            navigate(navlink);
          }}
          titleStyle={{
            maxHeight: "17px",
            maxWidth: "230px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          orderingFields={[
            { field: "created_at", label: "Date Created (Ascending)" },
            { field: "-created_at", label: "Date Created (Descending)" },
            { field: "status", label: "Status (Ascending)" },
            { field: "-status", label: "Status (Descending)" },
          ]}
          showResultLimit={false}
          tableTitle="Maintenance Requests"
          loadingTitle="Maintenance Requests"
          loadingMessage="Loading your maintenance requests..."
          searchFields={["description", "status"]}
        />
      ) : (
        <div className="maintenance-request-section-table">
          <UITable
            showCreate={true}
            createURL="/dashboard/owner/create-maintenance-request"
            dataTestId="maintenance-requests-table"
            testRowIdentifier="maintenance-request-row"
            endpoint="/maintenance-requests/"
            columns={columns}
            options={options}
            title="Maintenance Requests"
            searchFields={["description", "status"]}
            onSearch={(value) => {
              setSearchField(value);
            }}
            onOrderingChange={(value) => {
              setOrderingField(value);
            }}
            onResultLimitChange={(value) => {
              setLimit(value);
            }}
            showResultLimit={true}
            loadingTitle="Maintenance Requests"
            loadingMessage="Loading your maintenance requests..."
            onRowClick={handleRowClick}
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  const navlink = `/dashboard/owner/maintenance-requests/${row.id}`;
                  navigate(navlink);
                },
              },
            ]}
          />
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default OwnerMaintenanceRequests;
