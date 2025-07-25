import React from "react";
import { useEffect } from "react";
import {
  deleteMaintenanceRequest,
  getMaintenanceRequestsByTenant,
} from "../../../../api/maintenance_requests";
import { useState } from "react";
import useScreen from "../../../../hooks/useScreen";
import UITable from "../../UIComponents/UITable/UITable";
import { getTenantDashboardData } from "../../../../api/tenants";
import UIPrompt from "../../UIComponents/UIPrompt";
import { authUser, uiGreen } from "../../../../constants";
import DescriptionIcon from "@mui/icons-material/Description";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { useNavigate } from "react-router";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const MaintenanceRequests = () => {
  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".maintenance-request-section-table",
      content:
        "This is the maintenance requests table. Here you can view all the maintenance requests for your properties.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view more options for this portfolio",
    },
    {
      target: ".ui-table-search-input",
      content:
        "Use the search bar to search for a specific maintenance request.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
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

  const handleRowClick = (row) => {
    const navlink = `/dashboard/tenant/maintenance-requests/${row.id}`;
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
    getTenantDashboardData()
      .then((res) => {
        //Check if lease agreement is active

        setLeaseAgreement(res.lease_agreement);
        if (res.lease_agreement) {
          getMaintenanceRequestsByTenant(authUser.tenant_id).then((res) => {
            setMaintenanceRequests(res.data);
          });
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while fetching maintenance requests"
        );
      });
  }, []);

  return (
    <div className="container-fluid">
      <AlertModal
        title={alertTitle}
        message={alertMessage}
        open={showAlert}
        onClick={() => {
          navigate(0);
        }}
      />
      <ProgressModal open={isLoading} title="Please Wait..." />
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
      {leaseAgreement ? (
        <>
          {isMobile ? (
            <UITableMobile
              data={maintenanceRequests}
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
                maxWidth: "180px",
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
              searchFields={[
                "description",
                "status",
                "tenant__user__last_name",
              ]}
            />
          ) : (
            <div className="maintenance-request-section-table">
              <UITable
                dataTestId="maintenance-requests-table"
                testRowIdentifier="maintenance-requests-table-row"
                data={maintenanceRequests}
                columns={columns}
                options={options}
                title="Maintenance Requests"
                showCreate={true}
                createURL="/dashboard/tenant/maintenance-requests/create"
                searchFields={["description", "status"]}
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
        </>
      ) : (
        <UIPrompt
          icon={<DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />}
          title="No Active Lease Agreement"
          message="You need to have an active lease agreement to view your maintenance requests."
          btnText="Okay"
        />
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default MaintenanceRequests;
