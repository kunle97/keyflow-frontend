import React, { useState, useEffect } from "react";
import { getTenantLeaseRenewalRequests } from "../../../../../api/lease_renewal_requests";
import UITable from "../../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router";
import UITableMobile from "../../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../../hooks/useScreen";
import Joyride, {
  STATUS,
} from "react-joyride";
import UIHelpButton from "../../../UIComponents/UIHelpButton";
import { uiGreen } from "../../../../../constants";
import AlertModal from "../../../UIComponents/Modals/AlertModal";
const TenantLeaseRenewalRequests = () => {
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
    const { status } = data;
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
    const navlink = `/dashboard/tenant/lease-renewal-requests/${rowData}/`;
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
    getTenantLeaseRenewalRequests()
      .then((res) => {
        setData(res.data);

      })
      .catch((error) => {
        console.error("Error fetching lease renewal requests:", error);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while fetching lease renewal requests"
        );
        setShowAlert(true);
      });
  },[]);
  return (
    <div className="container-fluid lease-renewal-request-page">
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
      <div className="lease-renewal-requests-table-container">
        {isMobile ? (
          <UITableMobile
            data={data}
            tableTitle={"Lease Renewal Requests"}
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
            onRowClick={(row) => {
              const navlink = `/dashboard/tenant/lease-renewal-requests/${row.id}/`;
              navigate(navlink);
            }}
            loadingTitle="Lease renewal Requests"
            loadingMessage="Please wait while we fetch your lease renewal requests."
            searchFeilds={["status"]}
          />
        ) : (
          <UITable
            title="Lease Renewal Requests"
            columns={columns}
            data={data}
            options={options}
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  const navlink = `/dashboard/tenant/lease-renewal-requests/${row.id}/`;
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

export default TenantLeaseRenewalRequests;
