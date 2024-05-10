import React, { useEffect, useState } from "react";
import { getLandlordStaff } from "../../../../api/landlords";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import { defaultUserProfilePicture, uiGreen } from "../../../../constants";
import Joyride, {
  STATUS,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".staff-list-section",
      content:
        "This is the staff list section. Here you can view all the staff members.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".staff-section-table-container",
      content:
        "This is the staff table. Here you can view all the staff members.",
    },
    {
      target: ".ui-table-search-input",
      content: "Use the search bar to search for a specific staff member.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view staff member details.",
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
      name: "user",
      label: "",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return (
            <div
              style={{
                overflow: "hidden",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
              }}
            >
              <img
                src={
                  value.user_profile_picture
                    ? value.user_profile_picture.file
                    : defaultUserProfilePicture
                }
                style={{ height: "50px", margin: "auto" }}
              />
            </div>
          );
        },
      },
    },
    {
      name: "user",
      label: "First Name",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return value.first_name;
        },
      },
    },
    {
      name: "user",
      label: "Last Name",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return value.last_name;
        },
      },
    },
    {
      name: "user",
      label: "E-mail",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return value.email;
        },
      },
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/staff/${rowData}/`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
  };
  useEffect(() => {
    getLandlordStaff()
      .then((res) => {
        setStaff(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="container staff-list-section">
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
      <div className="staff-section-table-container">
        {isMobile ? (
          <UITableMobile
            tableTitle="Staff"
            endpoint={`/staff/`}
            onRowClick={(row) => {
              const navlink = `/dashboard/landlord/staff/${row.id}`;
              navigate(navlink);
            }}
            createInfo={(row) => `${row.user.first_name} ${row.user.last_name}`}
            createSubtitle={(row) => `${row.user.email}`}
            createTitle={(row) => `${row.user.email}`}
            orderingFields={[
              { field: "created_at", label: "Date Created" },
              { field: "-created_at", label: "Date Created (Descending)" },
            ]}
            loadingTitle="Loading Staff..."
            loadingMessage="Please wait while we load all the staff."
          />
        ) : (
          <UITable
            title="Staff"
            endpoint={`/staff/`}
            showSearch={true}
            showCreate={true}
            createURL="/dashboard/landlord/staff-invites/create"
            searchFields={["first_name", "last_name", "email"]}
            columns={columns}
            options={options}
            menuOptions={[
              {
                name: "Manage",
                onClick: (row) => {
                  const navlink = `/dashboard/landlord/staff/${row.id}`;
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

export default StaffList;
