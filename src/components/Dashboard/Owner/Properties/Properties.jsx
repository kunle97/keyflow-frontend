import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPropertyFilters, getProperties } from "../../../../api/properties";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import useScreen from "../../../../hooks/useScreen";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import Joyride, { STATUS } from "react-joyride";
import { uiGreen } from "../../../../constants";
const Properties = () => {
  const { screenWidth, breakpoints, isMobile } = useScreen();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { label: "Name", name: "name" },
    { label: "Street", name: "street" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
  ];

  const options = {
    isSelectable: false,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/owner/properties/${row}`;
      navigate(navlink);
    },
  };
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".properties-list-section",
      content: "This is the list of all your properties.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view more options for this property",
    },
    {
      target: ".ui-table-create-button",
      content: "Click here to create a new property",
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

  //Create a useEffect that calls the get propertiees api function and sets the properties state
  useEffect(() => {
    getProperties()
      .then((res) => {
        if (res) {
          setProperties(res.data);
        }
      })
      .catch((error) => {
        console.error("Error getting properties:", error);
        setErrorMessage(
          "An error occurred while retrieving properties. Please try again later."
        );
        setShowDeleteError(true);
      });
    getPropertyFilters()
      .then((res) => {
        if (res) {
          setFilters(res);
        }
      })
      .catch((error) => {
        console.error("Error getting property filters:", error);
        setErrorMessage(
          "An error occurred while retrieving property filters. Please try again later."
        );
        setShowDeleteError(true);
      });
    setIsLoading(false);
  }, []);
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
      <AlertModal
        open={showDeleteError}
        setOpen={setShowDeleteError}
        title={"Error"}
        message={errorMessage}
        btnText={"Ok"}
        onClick={() => setShowDeleteError(false)}
      />{" "}
      {isMobile ? (
        <UITableMobile
          testRowIdentifier="property"
          tableTitle="Properties"
          endpoint={"/properties/"}
          infoProperty="name"
          createTitle={(row) => `${row.street}, ${row.city}, ${row.state}`}
          subtitleProperty="somthing"
          acceptedFileTypes={[".csv"]}
          showUpload={true}
          uploadButtonText="Upload CSV"
          uploadHelpText="*CSV file must contain the following column headers: name, street, city, state, zip_code, and country."
          fileUploadEndpoint={`/properties/upload-csv-properties/`}
          onRowClick={(row) => {
            const navlink = `/dashboard/owner/properties/${row.id}`;
            navigate(navlink);
          }}
          createURL="/dashboard/owner/properties/create"
          showCreate={true}
          options={options}
          checked={checked}
          setChecked={setChecked}
          searchFields={[
            "name",
            "street",
            "city",
            "state",
            "zip_code",
            "country",
          ]}
          orderingFields={[
            { field: "name", label: "Name (Ascending)" },
            { field: "-name", label: "Name (Descending)" },
            { field: "street", label: "Street (Ascending)" },
            { field: "-street", label: "Street (Descending)" },
            { field: "created_at", label: "Date Created (Ascending)" },
            { field: "-created_at", label: "Date Created (Descending)" },
          ]}
        />
      ) : (
        <div
          className="properties-list-section"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <UITable
            options={options}
            columns={columns}
            checked={checked}
            setChecked={setChecked}
            endpoint={"/properties/"}
            searchFields={[
              "name",
              "street",
              "city",
              "state",
              "zip_code",
              "country",
            ]}
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  const navlink = `/dashboard/owner/properties/${row.id}`;
                  navigate(navlink);
                },
              },
            ]}
            title="Properties"
            showCreate={true}
            createURL="/dashboard/owner/properties/create"
            acceptedFileTypes={[".csv"]}
            showUpload={true}
            uploadButtonText="Upload CSV"
            uploadHelpText="*CSV file must contain the following column headers: name, street, city, state, zip_code, and country."
            fileUploadEndpoint={`/properties/upload-csv-properties/`}
          />
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default Properties;
