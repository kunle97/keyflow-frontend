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
const LeaseTemplates = () => {
  const [leaseTemplates, setLeaseTemplates] = useState([]);
  const [units, setUnits] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const { isMobile } = useScreen();
  const navigate = useNavigate();

  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-agreements-page",
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

    console.log("Current Joyride data", data);
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
    console.log(runTour);
  };

  const columns = [
    { name: "rent", label: "Rent" },
    {
      name: "term",
      label: "Duration",
      options: {
        customBodyRender: (value) => {
          return value + " months";
        },
      },
    },
    { name: "late_fee", label: "Late Fee" },
    { name: "security_deposit", label: "Security Deposit" },
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

  function deleteLeaseTemplatesIfNotUsed(leaseTemplates, unitsToCheck) {
    const leaseTemplateIdsToDelete = [];
    const leaseTemplateIdsToOmit = [];
    let leaseTemplatesInUse = 0;
    for (const leaseTemplate of leaseTemplates) {
      // Check if the lease term is associated with any units
      const isUsedByUnits = unitsToCheck.some(
        (unit) => unit.lease_template === leaseTemplate.id
      );

      // If not used by any units, add its ID to the list of IDs to be deleted
      if (!isUsedByUnits) {
        leaseTemplateIdsToDelete.push(leaseTemplate.id);
      } else {
        leaseTemplatesInUse++;
        leaseTemplateIdsToOmit.push(leaseTemplate.id);
      }
    }

    // Remove the lease terms from the original array
    const updatedLeaseTemplates = leaseTemplates.filter(
      (leaseTemplate) => !leaseTemplateIdsToDelete.includes(leaseTemplate.id)
    );

    return {
      leaseTemplateIdsToDelete,
      leaseTemplateIdsToOmit,
      leaseTemplatesInUse,
    };
  }

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
    onRowsDelete: (rowsDeleted, data) => {
      const leaseTemplateIdsSelected = [];
      //Place the selected rows into an array
      const selectedRows = rowsDeleted.data.map((row) => {
        leaseTemplateIdsSelected.push(leaseTemplates[row.dataIndex]);
      });
      const filteredLeaseTemplates = deleteLeaseTemplatesIfNotUsed(
        leaseTemplateIdsSelected,
        units
      );
      if (filteredLeaseTemplates.leaseTemplatesInUse > 0) {
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "Some of the selected lease terms are currently in use by units. Please remove them from the units before deleting them."
        );
        setShowAlertModal(true);
      } else {
        setAlertModalTitle("Success");
        setAlertModalMessage(
          "The selected lease terms have been deleted successfully."
        );
        setShowAlertModal(true);
      }
      filteredLeaseTemplates.leaseTemplateIdsToDelete.map((id) => {
        deleteLeaseTemplate(id)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setAlertModalMessage(err.response.data.message);
            setShowAlertModal(true);
          });
      });
    },
  };

  //Retrieve user's lease terms
  useEffect(() => {
    //retrieve lease terms that the user has created
    getLeaseTemplatesByUser()
      .then((res) => {
        setLeaseTemplates(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.error("Error fetching lease templates:", error);
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "There was an error fetching your lease templates. Please try again."
        );
        setShowAlertModal(true);
      });
    //Retrieve the user's units
    getOwnerUnits()
      .then((res) => {
        setUnits(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.error("Error fetching units:", error);
        setAlertModalTitle("Error");
        setAlertModalMessage(
          "There was an error fetching your units. Please try again."
        );
        setShowAlertModal(true);
      });
  }, []);
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
      <AlertModal
        open={showAlertModal}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText="Ok"
        onClick={() => {
          setShowAlertModal(false);
        }}
      />
      <div className="card" style={{ overflow: "hidden" }}></div>
      <div className="lease-template-table-container">
        {isMobile ? (
          <UITableMobile
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
            columns={columns}
            options={options}
            endpoint="/lease-templates/"
            title="Lease Templates"
            showCreate={true}
            createURL="/dashboard/owner/lease-templates/create"
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
