import React, { useEffect, useState } from "react";
import { getTenantLeaseCancellationRequests } from "../../../../../api/lease_cancellation_requests";
import { useNavigate } from "react-router";
import UITable from "../../../UIComponents/UITable/UITable";
import UITableMobile from "../../../UIComponents/UITable/UITableMobile";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../../UIComponents/UIHelpButton";
import { uiGreen } from "../../../../../constants";
import useScreen from "../../../../../hooks/useScreen";
import AlertModal from "../../../UIComponents/Modals/AlertModal";
const TenantLeaseCancellationRequests = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
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
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/tenant/lease-renewal-requests/`;
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
    //CREate a function to handle the row delete
  };
  useEffect(() => {
    getTenantLeaseCancellationRequests().then((res) => {
      console.log("TCRRR", res);
      setData(res.data);
    }).catch((error) => {
      console.error("Error fetching lease cancellation requests:", error);
      setAlertTitle("Error");
      setAlertMessage(
        "An error occurred while fetching the lease cancellation requests"
      );
      setShowAlert(true);
    });
  }, []);
  return (
    <div className="container-fluid lease-cancellation-request-page">
      <AlertModal 
        title={alertTitle}
        message={alertMessage}
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
        }}
        
      />
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
      <div className="lease-cancellation-requests-table-container">
        {isMobile ? (
          <UITableMobile
            data={data}
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
            searchFeilds={["status"]}
          />
        ) : (
          <UITable
            columns={columns}
            options={options}
            data={data}
            title={"Lease Cancellation Requests"}
            // menuOptions={[
            //   {
            //     name: "View",
            //     onClick: (row) => {
            //       const navlink = `/dashboard/tenant/lease-cancellation-requests/${row.id}`;
            //       navigate(navlink);
            //     },
            //   },
            // ]}
          />
        )}
      </div>
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default TenantLeaseCancellationRequests;
