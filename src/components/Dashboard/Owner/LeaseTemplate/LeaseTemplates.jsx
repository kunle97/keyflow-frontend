import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  deleteLeaseTemplate,
  getLeaseTemplatesByUser,
} from "../../../../api/lease_templates";
import { getOwnerUnits } from "../../../../api/units";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
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
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const LeaseTemplates = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-template-page",
      content:
        "This is the lease template page where you can view all your lease templates. A lease template is a pre-made lease agreement document and set of terms that you can use to apply to multiple units.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".lease-template-table-container",
      content: "This is where you can view all of your lease templates.",
    },
    {
      target: ".ui-table-create-button",
      content: "Click here to create a new lease template.",
    },
    {
      target: ".ui-table-search-input",
      content: "Use the search bar to search for a specific lease template.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view lease template details.",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setTourIndex(0);
      setRunTour(false);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setTourIndex(nextStepIndex);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
  };

  const columns = [
    {
      name: "rent",
      label: "Rent",
      options: {
        customBodyRender: (value) => {
          return "$" + value;
        },
      },
    },
    {
      name: "term",
      label: "Duration",
      options: {
        customBodyRender: (value) => {
          return value + " months";
        },
      },
    },
    {
      name: "late_fee",
      label: "Late Fee",
      options: {
        customBodyRender: (value) => {
          return "$" + value;
        },
      },
    },
    {
      name: "security_deposit",
      label: "Security Deposit",
      options: {
        customBodyRender: (value) => {
          return "$" + value;
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

  const handleRowClick = (row) => {
    const navlink = `/dashboard/owner/lease-templates/${row.id}`;
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
    onRowDelete: (row) => {
      setIsLoading(true);
      deleteLeaseTemplate(row.id)
        .then((res) => {
          if (res.status === 204) {
            setAlertModalTitle("Success");
            setAlertModalMessage("Lease template deleted successfully");
            setShowAlertModal(true);
          } else {
            setAlertModalTitle("Error");
            setAlertModalMessage(
              "An error occurred while deleting the lease template"
            );
            setShowAlertModal(true);
          }
        })
        .catch((error) => {
          setAlertModalTitle("Error");
          setAlertModalMessage(
            error.message
              ? error.message
              : "An error occurred while deleting the lease template"
          );
          setShowAlertModal(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    deleteOptions: {
      confirmTitle: "Delete Lease Template",
      confirmMessage: "Are you sure you want to delete this lease template?",
    },
  };

  return (
    <div className="container-fluid lease-template-page">
      <Joyride
        run={runTour}
        stepIndex={tourIndex}
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
      <ProgressModal open={showAlertModal} title="Please Wait..." />
      <AlertModal
        open={showAlertModal}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Ok"
        onClick={() => {
          navigate(0);
        }}
      />
      <div className="card" style={{ overflow: "hidden" }}></div>
      <div className="lease-template-table-container">
        {isMobile ? (
          <UITableMobile
            dataTestId="lease-templates-table-mobile"
            tableTitle="Lease Templates"
            endpoint="/lease-templates/"
            createInfo={(row) => {
              let frequency_unit = "";
              let frequency = "";
              if (row.rent_frequency === "month") {
                frequency_unit = "mo";
                frequency = "month(s)";
              } else if (row.rent_frequency === "week") {
                frequency_unit = "wk";
                frequency = "week(s)";
              } else if (row.rent_frequency === "day") {
                frequency_unit = "day";
                frequency = "day(s)";
              } else if (row.rent_frequency === "year") {
                frequency_unit = "yr";
                frequency = "year(s)";
              } else {
                frequency_unit = "mo";
                frequency = "month(s)";
              }
              return `$${row.rent}/${frequency_unit} | ${row.term} ${frequency} `;
            }}
            createSubtitle={(row) => `Late Fee:  $${row.late_fee}`}
            createTitle={(row) => `Security Deposit: $${row.security_deposit}`}
            onRowClick={handleRowClick}
            orderingFields={[
              { field: "created_at", label: "Date Created (Ascending)" },
              { field: "-created_at", label: "Date Created (Descending)" },
              { field: "rent", label: "Rent (Ascending)" },
              { field: "-rent", label: "Rent (Descending)" },
              { field: "term", label: "Term (Ascending)" },
              { field: "-term", label: "Term (Descending)" },
            ]}
            showCreate={true}
            createURL="/dashboard/owner/lease-templates/create"
          />
        ) : (
          <UITable
            dataTestId="lease-templates-table"
            testRowIdentifier="lease-templates"
            columns={columns}
            options={options}
            endpoint="/lease-templates/"
            title="Lease Templates"
            showCreate={true}
            createURL="/dashboard/owner/lease-templates/create"
            onRowClick={handleRowClick}
            menuOptions={[
              {
                name: "Manage",
                onClick: (row) => {
                  const navlink = `/dashboard/owner/lease-templates/${row.id}`;
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

export default LeaseTemplates;
