import React, { useState } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router-dom";
import BackButton from "../../UIComponents/BackButton";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import { uiGreen } from "../../../../constants";
const LeaseRenewalRequests = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-renewal-requests-table-container",
      content: "This is the list of all your lease renewal requests.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-search-input",
      content:
        "Use the search bar to search for a specific lease renewal request.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view lease renewal request details.",
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
    {
      name: "tenant",
      label: "Tenant",
      options: {
        orderingField: "tenant__user__last_name",
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
        orderingField: "rental_unit__name",
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    {
      name: "rental_property",
      label: "Property",
      options: {
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    { name: "status", label: "Status" },
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
  const handleRowClick = (row) => {
    const navlink = `/dashboard/owner/lease-renewal-requests/${row.id}/`;
    navigate(navlink);
  };
  const options = {
    isSelectable: false,
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
    //CREate a function to handle the row delete
  };
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
      <div className="lease-renewal-requests-table-container">
        {isMobile ? (
          <UITableMobile
            endpoint={"/lease-renewal-requests/"}
            tableTitle={"Lease Renewal Requests"}
            createInfo={(row) =>
              `${row.tenant.user.first_name} ${row.tenant.user.last_name}`
            }
            createTitle={(row) =>
              `Unit ${row.rental_unit.name} | ${row.rental_property.name}`
            }
            createSubtitle={(row) => `${row.status}`}
            orderingFields={[
              {field: "tenant__user__last_name", label: "Tenant (Ascending)"},
              {field: "-tenant__user__last_name", label: "Tenant (Descending)"},
              { field: "status", label: "Status (Ascending)" },
              { field: "-status", label: "Status (Descending)" },
              { field: "created_at", label: "Date Created (Ascending)" },
              { field: "-created_at", label: "Date Created (Descending)" },
            ]}
            onRowClick={handleRowClick}
            loadingTitle="Lease renewal Requests"
            loadingMessage="Please wait while we fetch your lease renewal requests."
          />
        ) : (
          <UITable
            columns={columns}
            options={options}
            endpoint={"/lease-renewal-requests/"}
            title={"Lease Renewal Requests"}
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  const navlink = `/dashboard/owner/lease-renewal-requests/${row.id}`;
                  navigate(navlink);
                },
              },
            ]}
          />
        )}
      </div>
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default LeaseRenewalRequests;
