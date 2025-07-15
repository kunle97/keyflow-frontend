import React, { useState } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router-dom";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import { uiGreen } from "../../../../constants";
import { denyLeaseCancellationRequest } from "../../../../api/lease_cancellation_requests";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const LeaseCancellationRequests = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const handleRowClick = (row) => {
    const navlink = `/dashboard/owner/lease-cancellation-requests/${row.id}/`;
    navigate(navlink);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
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
      name: "tenant",
      label: "Tenant",
      options: {
        orderingField: "tenant__user__last_name",
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
        orderingField: "rental_unit__name",
        isObject: true,
        customBodyRender: (value) => {
          if (!value) {
            return <span>N/A</span>;
          } else {
            return <span>{value.name}</span>;
          }
        },
      },
    },
    {
      name: "status",
      label: "Status",
    },
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
    onRowDelete: (row) => {
      setIsLoading(true);
      //Delete the lease cancellation request with the api
      denyLeaseCancellationRequest({
        lease_agreement_id: row.lease_agreement.id,
        lease_cancellation_request_id: row.id,
      }).then((res) => {
        if (res.status === 204) {
          setAlertModalTitle("Success");
          setAlertModalMessage("Lease cancellation request rejected!");
          setAlertModalOpen(true);
        } else {
          setAlertModalTitle("Error");
          setAlertModalMessage("Something went wrong!");
          setAlertModalOpen(true);
        }
      });
    },
    deleteOptions: {
      label: "Reject",
      confirmTitle: "Reject Lease Cancellation Request",
      confirmMessage:
        "Are you sure you want to reject this lease cancellation request?",
    },
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
      <ProgressModal open={isLoading} title="Please Wait..." />
      <AlertModal
        open={alertModalOpen}
        title={alertModalTitle}
        message={alertModalMessage}
        onClick={() => {
          navigate(0);
        }}
      />

      {isMobile ? (
        <UITableMobile
          dataTestId="lease-cancellation-requests-table-mobile"
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
            { field: "tenant__user__last_name", label: "Tenant (Ascending)" },
            { field: "-tenant__user__last_name", label: "Tenant (Descending)" },
            { field: "status", label: "Status (Ascending)" },
            { field: "-status", label: "Status (Descending)" },
            { field: "created_at", label: "Date Created (Ascending)" },
            { field: "-created_at", label: "Date Created (Descending)" },
          ]}
          onRowClick={handleRowClick}
          loadingTitle="Lease Cancellation Requests"
          loadingMessage="Please wait while we fetch your lease cancellation requests."
        />
      ) : (
        <div className="lease-cancellation-requests-table-container">
          <UITable
            dataTestId="lease-cancellation-requests-table"
            columns={columns}
            options={options}
            endpoint={"/lease-cancellation-requests/"}
            title={"Lease Cancellation Requests"}
            onRowClick={handleRowClick}
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
