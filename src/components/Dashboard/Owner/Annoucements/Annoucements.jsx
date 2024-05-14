import React, { useState } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import { getUnit } from "../../../../api/units";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import { uiGreen } from "../../../../constants";
const Annoucements = () => {
  const navigate = useNavigate();
  const handleRowClick = (row) => {
    navigate(`/dashboard/owner/announcements/${row.id}`);
  };
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".announcements-list",
      content: "This is the list of all your announcements.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-search-input",
      content:
        "Use the search bar to search for a specific announcement.",
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
      name: "title",
      label: "Title",
      options: {
        customBodyRender: (value) => {
          return value;
        },
      },
    },
    {
      name: "start_date",
      label: "Start Date",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
    },
    {
      name: "end_date",
      label: "End Date",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
    },
    {
      name: "target_object",
      label: "Target",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          console.log(value);
          return `${value.type} - ${value.name}`;
        },
      },
    },
  ];
  const options = {
    isSelectable: false,
  };

  return (
    <div className="container-fluid">
      {" "}
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
      <div className="announcements-list">
        {isMobile ? (
          <UITableMobile
            showCreate={true}
            createURL="/dashboard/owner/announcements/create"
            tableTitle="Announcements"
            endpoint="/announcements/"
            createInfo={(row) => `${row.title}`}
            createSubtitle={(row) => `${row.body}`}
            createTitle={(row) => {
              return (
                <span>{new Date(row.created_at).toLocaleDateString()}</span>
              );
            }}
            onRowClick={handleRowClick}
          />
        ) : (
          <UITable
            showCreate={true}
            createURL="/dashboard/owner/announcements/create"
            title="Announcements "
            columns={columns}
            options={options}
            handleRowClick={handleRowClick}
            endpoint="/announcements/"
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  navigate(`/dashboard/owner/announcements/${row.id}`);
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

export default Annoucements;
