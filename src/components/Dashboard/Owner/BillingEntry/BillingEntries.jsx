import React, { useState } from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import { useNavigate } from "react-router";
import { uiGreen, uiRed } from "../../../../constants";
import UITable from "../../UIComponents/UITable/UITable";
import isMobile from "../../../../hooks/useScreen";
import useScreen from "../../../../hooks/useScreen";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const BillingEntries = () => {
  const navigate = useNavigate();
  const handleRowClick = (row) => {
    navigate(`/dashboard/owner/billing-entries/${row.id}`);
  };
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".billing-entries-list",
      content: "This is the list of all your announcements.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-search-input",
      content: "Use the search bar to search for a specific announcement.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view announcement details.",
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
      name: "type",
      label: "Type",
      options: {
        customBodyRender: (value) => {
          return removeUnderscoresAndCapitalize(value);
        },
      },
    },
    {
      name: "amount",
      label: "Amount",
      options: {
        customBodyRender: (value) => {
          return `$${String(value).toLocaleString("en-US")}`;
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          return (
            <span
              style={{
                color: value === "paid" ? uiGreen : uiRed,
                textTransform: "capitalize",
              }}
            >
              {value}
            </span>
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
  const options = {
    isSelectable: false,
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
      <div className="billing-entries-list">
        {isMobile ? (
          <UITableMobile
            showCreate={true}
            createURL="/dashboard/owner/billing-entries/create"
            tableTitle="Billing Entries"
            endpoint="/billing-entries/"
            createInfo={(row) => `${removeUnderscoresAndCapitalize(row.type)}`}
            createSubtitle={(row) =>
              `$${String(row.amount).toLocaleString("en-US")}`
            }
            createTitle={(row) => {
              return (
                <span
                  style={{
                    color: row.status === "paid" ? uiGreen : uiRed,
                    textTransform: "capitalize",
                  }}
                >
                  {row.status}
                </span>
              );
            }}
            onRowClick={handleRowClick}
            orderingFields={[
              { field: "created_at", label: "Date Created (Ascending)" },
              { field: "-created_at", label: "Date Created (Descending)" },
              { field: "type", label: "Transaction Type (Ascending)" },
              { field: "-type", label: "Transaction Type (Descending)" },
              { field: "amount", label: "Amount (Ascending)" },
              { field: "-amount", label: "Amount (Descending)" },
            ]}
            testRowIdentifier={`billing-entries-table-row`}
            createTestRowIdentifier={(row) => {
              let identifier = "";
              if (
                row.type === "revenue" ||
                row.type === "rent_payment" ||
                row.type === "late_fee" ||
                row.type === "security_deposit" ||
                row.type === "application_fee" ||
                row.type === "maintenance_fee"
              ) {
                identifier = "billing-entries-table-revenue-row";
              } else if (
                row.type === "expense" ||
                row.type === "vendor_payment"
              ) {
                identifier = "billing-entries-table-expense-row";
              }
              return identifier;
            }}
          />
        ) : (
          <UITable
            showCreate={true}
            createURL="/dashboard/owner/billing-entries/create"
            options={options}
            columns={columns}
            endpoint="/billing-entries/"
            title="Billing Entries"
            menuOptions={[
              {
                name: "Manage",
                onClick: (row) => {
                  navigate(`/dashboard/owner/billing-entries/${row.id}`);
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

export default BillingEntries;
