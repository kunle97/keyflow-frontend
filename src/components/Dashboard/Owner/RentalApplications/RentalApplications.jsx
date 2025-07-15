import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import { uiGreen } from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import { Stack } from "@mui/material";
import { rejectRentalApplication } from "../../../../api/rental_applications";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const RentalApplications = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");

  const tourSteps = [
    {
      target: ".rental-application-list",
      content: "This is the list of all your rental applications.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-search-input",
      content:
        "Use the search bar to search for a specific rental application.",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view rental application details.",
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
      name: "first_name",
      label: "First Name",
    },
    {
      label: "Last Name",
      name: "last_name",
    },
    {
      label: "Unit",
      name: "unit",
      options: {
        orderingField: "unit__name",
        customBodyRender: (value) => {
          if (!value) {
            return <span>N/A</span>;
          } else {
            return value.name;
          }
        },
      },
    },
    {
      label: "Property",
      name: "unit",
      options: {
        orderingField: "unit__rental_property_name",
        customBodyRender: (value) => {
          if (!value) {
            return <span>N/A</span>;
          } else {
            return value.rental_property_name;
          }
        },
      },
    },
    {
      label: "Approved",
      name: "is_approved",
      selector: (row) => row.unit,
      options: {
        customBodyRender: (value) => {
          return value ? "Yes" : "No";
        },
      },
      sortable: true,
    },
    {
      label: "Date Submitted",
      name: "created_at",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
      selector: (row) => new Date(row.created_at).toISOString().split("T")[0],
      sortable: true,
    },
  ];
  const handleRowClick = (row, rowMeta) => {
    const navlink = `/dashboard/owner/rental-applications/${row.id}`;
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
    onRowDelete: (row) => {
      setIsLoading(true);
      rejectRentalApplication(row.id)
        .then((res) => {
          if (res.status === 200) {
            setOpenAlertModal(false);
            setAlertModalTitle("Success");
            setAlertModalMessage(res.message? res.message: "Rental application rejected successfully."); 
            setOpenAlertModal(true);
            setIsLoading(false);
          } else {
            setAlertModalTitle("An error occured");
            setAlertModalMessage(
              res.message
                ? res.message
                : "An error occurred while rejecting the rental application. Please try again."
            );
            setOpenAlertModal(true);
          }
        })
        .catch((error) => {
          console.error("Error rejecting rental application:", error);
          setAlertModalTitle("An error occurred");
          setAlertModalMessage(
            error.message
              ? error.message
              : "An error occurred while rejecting the rental application. Please try again."
          );
          setOpenAlertModal(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    deleteOptions: {
      label: "Reject",
      confirmTitle: "Reject Rental Application",
      confirmMessage: "Are you sure you want to reject this rental application?",
    },
  };
  return (
    <div className="container-fluid rental-application-list">
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
      <ProgressModal open={isLoading} title="Please wait..." />
      <AlertModal
        open={openAlertModal}
        setOpen={setOpenAlertModal}
        title={alertModalTitle}
        message={alertModalMessage}
        onClick={() => navigate(0)}
      />
      {isMobile ? (
        <UITableMobile
          tableTitle={"Rental Applications"}
          endpoint={`/rental-applications/`}
          createInfo={(row) => `${row.first_name} ${row.last_name}`}
          createTitle={(row) => `${row.unit.name}`}
          createSubtitle={(row) =>
            `${row.is_approved ? "Approved" : "Pending"}`
          }
          additionalParams={{
            is_archived: false,
          }}
          orderingFields={[
            { field: "created_at", label: "Date Submitted (Ascending)" },
            { field: "-created_at", label: "Date Submitted (Descending)" },
            { field: "first_name", label: "First Name (Ascending)" },
            { field: "-first_name", label: "First Name (Descending)" },
            { field: "last_name", label: "Last Name (Ascending)" },
            { field: "-last_name", label: "Last Name (Descending)" },
            { field: "is_approved", label: "Approved (Ascending)" },
            { field: "-is_approved", label: "Approved (Descending)" },
          ]}
          onRowClick={(row) => {
            const navlink = `/dashboard/owner/rental-applications/${row.id}`;
            navigate(navlink);
          }}
        />
      ) : (
        <UITable
          columns={columns}
          options={options}
          additionalParams={{
            is_archived: false,
          }}
          endpoint={`/rental-applications/`}
          title="Rental Applications"
          detailURL="/dashboard/owner/rental-applications/"
          showCreate={false}
          onRowClick={handleRowClick}
          menuOptions={[
            {
              name: "View",
              onClick: (row) => {
                const navlink = `/dashboard/owner/rental-applications/${row.id}`;
                navigate(navlink);
              },
            },
          ]}
        />
      )}
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginTop: "10px", px: "15px" }}
        justifyContent={"flex-end"}
      >
        <UIButton
          btnText="Archived Rental Applications"
          onClick={() =>
            navigate("/dashboard/owner/archived-rental-applications")
          }
        />
      </Stack>
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default RentalApplications;
