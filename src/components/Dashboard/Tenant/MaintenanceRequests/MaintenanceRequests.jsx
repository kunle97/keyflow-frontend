import React from "react";
import { useEffect } from "react";
import {
  getMaintenanceRequestsByTenant,
  getMaintenanceRequestsByUser,
} from "../../../../api/maintenance_requests";
import { useState } from "react";
import MUIDataTable from "mui-datatables";
import useScreen from "../../../../hooks/useScreen";
import UITable from "../../UIComponents/UITable/UITable";
import { getTenantDashboardData } from "../../../../api/tenants";
import UIPrompt from "../../UIComponents/UIPrompt";
import { authUser, uiGreen } from "../../../../constants";
import DescriptionIcon from "@mui/icons-material/Description";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { useNavigate } from "react-router";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const MaintenanceRequests = () => {
  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [orderingField, setOrderingField] = useState("created_at");
  const [searchField, setSearchField] = useState("");
  const [limit, setLimit] = useState(10);
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
    console.log(runTour);
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

  const handleRowClick = (rowData, rowMeta) => {
    // const navlink = `/dashboard/owner/`;
    // navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
  };

  useEffect(() => {
    //Retrieve the maintenance requests
    getTenantDashboardData().then((res) => {
      //Check if lease agreement is active
      console.log(res);
      setLeaseAgreement(res.lease_agreement);
      if (res.lease_agreement) {
        getMaintenanceRequestsByTenant(authUser.tenant_id).then((res) => {
          console.log(res);
          setMaintenanceRequests(res.data);
        });
      }
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
            />
          ) : (
            <div className="maintenance-request-section-table">
              <UITable
                data={maintenanceRequests}
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
                menuOptions={[
                  {
                    name: "View",
                    onClick: (row) => {
                      const navlink = `/dashboard/owner/maintenance-requests/${row.id}`;
                      navigate(navlink);
                    },
                  },
                  { name: "Delete", onClick: () => console.log("Delete") },
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
