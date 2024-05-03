import React, { useState } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { uiGreen, uiRed } from "../../../../constants";
import { useNavigate } from "react-router";
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
const ViewLeaseAgreements = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-agreements-page",
      content:
        "This is the lease agreements page. Here you can view all your lease agreements.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".lease-agreements-table-container",
      content: "This is the list of all your lease agreements.",
    },
    {
      target: ".ui-table-search-input",
      content: "Use the search bar to search for a specific lease agreement.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view lease agreement details.",
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
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/lease-agreements/${rowData}`;
    navigate(navlink);
  };

  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    isSelectable: false,
    onRowClick: handleRowClick,
  };
  return (
    <div className="container-fluid lease-agreements-page">
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
      <div className="lease-agreements-table-container">
        {isMobile ? (
          <UITableMobile
            tableTitle={"Lease Agreements"}
            endpoint={"/lease-agreements/"}
            createInfo={(row) =>
              `${
                row.tenant
                  ? row.tenant.user.first_name + row.tenant.user.last_name
                  : "N/A"
              }`
            }
            createSubtitle={(row) =>
              `${row.is_active ? "Active" : "Inactive"} - Ends: ${
                row.end_date
                  ? new Date(row.end_date).toLocaleDateString()
                  : "N/A"
              }`
            }
            createTitle={(row) => `Unit ${row.rental_unit.name}`}
            orderingFields={[
              { field: "created_at", label: "Date Created (Ascending)" },
              { field: "-created_at", label: "Date Created (Descending)" },
              { field: "is_active", label: "Status (Ascending)" },
              { field: "-is_active", label: "Status (Descending)" },
              { field: "tenant__last_name", label: "Tenant (Ascending)" },
              { field: "-tenant__last_name", label: "Tenant (Descending)" },
              { field: "start_date", label: "Start Date (Ascending)" },
              { field: "-start_date", label: "Start Date (Descending)" },
              { field: "end_date", label: "End Date (Ascending)" },
              { field: "-end_date", label: "End Date (Descending)" },
            ]}
            onRowClick={(row) => {
              const navlink = `/dashboard/landlord/lease-agreements/${row.id}`;
              navigate(navlink);
            }}
          />
        ) : (
          <UITable
            columns={columns}
            endpoint={"/lease-agreements/"}
            options={options}
            title={"Lease Agreements"}
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  const navlink = `/dashboard/landlord/lease-agreements/${row.id}`;
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

export default ViewLeaseAgreements;
