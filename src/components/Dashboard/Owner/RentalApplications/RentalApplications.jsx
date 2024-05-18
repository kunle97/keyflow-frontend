import React, { useEffect, useState } from "react";
import { getRentalApplicationsByUser } from "../../../../api/rental_applications";
import { useNavigate } from "react-router";
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
import AlertModal from "../../UIComponents/Modals/AlertModal";
const RentalApplications = () => {
  const [rentalApplications, setRentalApplications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
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
      name: "first_name",
      label: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      label: "Last Name",
      name: "last_name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      label: "Unit",
      name: "unit",
      options: {
        customBodyRender: (value) => {
          return value.name;
        },
      },
    },
    {
      label: "Property",
      name: "unit",
      options: {
        customBodyRender: (value) => {
          return value.rental_property_name;
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
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/owner/rental-applications/${rowData}`;
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
  };

  useEffect(() => {
    getRentalApplicationsByUser()
      .then((res) => {
        console.log(res);
        if (res) {
          //Create a new array that only holds data with the is_arhived property set to false
          // const filteredData = res.data.filter((data) => {
          //   return data.is_archived === false;
          // });
          setRentalApplications(res.data);
          setIsLoading(false);
        }
        console.log("Rental Applications: ", rentalApplications);
      })
      .catch((error) => {
        console.error("Error getting rental applications:", error);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while fetching rental applications. Please try again."
        );
        setShowAlert(true);
      });
  }, []);
  return (
    <div className="container-fluid rental-application-list">
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
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
      {isMobile ? (
        <UITableMobile
          tableTitle={"Rental Applications"}
          endpoint={`/rental-applications/`}
          createInfo={(row) => `${row.first_name} ${row.last_name}`}
          createTitle={(row) => `${row.unit.name}`}
          createSubtitle={(row) =>
            `${row.is_approved ? "Approved" : "Pending"}`
          }
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
          // getImage={(row) => {
          //   retrieveFilesBySubfolder(
          //     `properties/${row.id}`,
          //     authUser.id
          //   ).then((res) => {
          //     if (res.data.length > 0) {
          //       return res.data[0].file;
          //     } else {
          //       return "https://picsum.photos/200";
          //     }
          //   });
          // }}
          onRowClick={(row) => {
            const navlink = `/dashboard/owner/rental-applications/${row.id}`;
            navigate(navlink);
          }}
        />
      ) : (
        <UITable
          columns={columns}
          options={options}
          endpoint={`/rental-applications/`}
          title="Rental Applications"
          detailURL="/dashboard/owner/rental-applications/"
          showCreate={false}
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
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default RentalApplications;
