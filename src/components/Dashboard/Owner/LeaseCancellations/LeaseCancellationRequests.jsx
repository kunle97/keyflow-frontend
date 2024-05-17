import React, { useState, useEffect } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router-dom";
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
const LeaseCancellationRequests = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const handleRowClick = (row) => {
    const navlink = `/dashboard/owner/lease-cancellation-requests/${row.id}/`;
    navigate(navlink);
  };

  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-cancellation-request-page",
      content:
        "This is the lease cancellation requests page. Here you can view all your lease cancellation requests.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".lease-cancellation-requests-table-container",
      content: "This is the list of all your lease cancellation requests.",
    },
    {
      target: ".ui-table-search-input",
      content:
        "Use the search bar to search for a specific lease cancellation request.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view lease cancellation request details.",
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
      name: "status",
      label: "Status",
    },
    {
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const options = {
    isSelectable: false,
    onRowClick: handleRowClick,
  };

  return (
    <div className="container-fluid lease-cancellation-request-page">
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
      {isMobile ? (
        <UITableMobile
          endpoint={"/lease-cancellation-requests/"}
          tableTitle={"Lease Cancellation Requests"}
          createInfo={(row) =>
            `${row.tenant.user.first_name} ${row.tenant.user.last_name}`
          }
          createTitle={(row) =>
            `Unit ${row.rental_unit.name} | ${row.rental_property.name}`
          }
          createSubtitle={(row) => `${row.status}`}
          orderingFields={[
            { field: "created_at", label: "Date Created (Ascending)" },
            { field: "-created_at", label: "Date Created (Descending)" },
            { field: "status", label: "Status (Ascending)" },
            { field: "-status", label: "Status (Descending)" },
          ]}
          onRowClick={handleRowClick}
          loadingTitle="Lease Cancellation Requests"
          loadingMessage="Please wait while we fetch your lease cancellation requests."
        />
      ) : (
        <div className="lease-cancellation-requests-table-container">
          <UITable
            columns={columns}
            options={options}
            endpoint={"/lease-cancellation-requests/"}
            title={"Lease Cancellation Requests"}
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  const navlink = `/dashboard/owner/lease-cancellation-requests/${row.id}`;
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

export default LeaseCancellationRequests;
