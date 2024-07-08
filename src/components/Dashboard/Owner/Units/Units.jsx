import React, { useState, useEffect } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import Joyride, { STATUS } from "react-joyride";
import { uiGreen } from "../../../../constants";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const Units = () => {
  const [units, setUnits] = useState([]);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState([]);
  const { isMobile } = useScreen();
  const navigate = useNavigate();

  const columns = [
    { label: "Name", name: "name" },
    { label: "Property", name: "rental_property_name" },
    { label: "Beds", name: "beds" },
    { label: "Baths", name: "baths" },
    { label: "Size", name: "size" },
    {
      label: "Occupied",
      name: "is_occupied",
      options: { customBodyRender: (value) => (value ? "Yes" : "No") },
    },
  ];

  const options = {
    isSelectable: false,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/owner/units/`;
      navigate(navlink);
    },
  };
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".units-list-section",
      content:
        "This is the list of all your units.",
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
          testRowIdentifier="units"
          tableTitle="units"
          endpoint={"/units/"}
          infoProperty="name"
          createTitle={(row) => `${row.name} - ${row.rental_property_name}`}
          subtitleProperty="somthing"
          acceptedFileTypes={[".csv"]}
          showUpload={true}
          uploadButtonText="Upload CSV"
          uploadHelpText="*CSV file must contain the following column headers: name, street, city, state, zip_code, and country."
          fileUploadEndpoint={`/properties/upload-csv-units/`}
          onRowClick={(row) => {
            const navlink = `/dashboard/owner/units/${row.rental_property.id}/${row.id}`;
            navigate(navlink);
          }}
          createURL="/dashboard/owner/units/create"
          showCreate={true}
          searchFields={["name", "rental_property_name"]}
          orderingFields={[
            { field: "name", label: "Name (Ascending)" },
            { field: "-name", label: "Name (Descending)" },
            { field: "rental_property_name", label: "Property (Ascending)" },
            { field: "-rental_property_name", label: "Property (Descending)" },
            { field: "beds", label: "Beds (Ascending)" },
            { field: "-beds", label: "Beds (Descending)" },
            { field: "baths", label: "Baths (Ascending)" },
            { field: "-baths", label: "Baths (Descending)" },
            { field: "size", label: "Size (Ascending)" },
            { field: "-size", label: "Size (Descending)" },
            { field: "is_occupied", label: "Occupied (Ascending)" },
            { field: "-is_occupied", label: "Occupied (Descending)" },
          ]}
        />
      ) : (
        <div
          className="units-list-section"
          style={{ padding: "20px" }}
        >
          <UITable
            options={options}
            checked={checked}
            columns={columns}
            setChecked={setChecked}
            endpoint={"/units/"}
            searchFields={["name", "rental_property_name"]}
            menuOptions={[
              {
                name: "View",
                onClick: (row) => {
                  const navlink = `/dashboard/owner/units/${row.id}/${row.rental_property}/`;
                  navigate(navlink);
                },
              },
            ]}
            title="Units"
            showCreate={true}
            createURL="/dashboard/owner/units/create"
            acceptedFileTypes={[".csv"]}
            showUpload={true}
            uploadButtonText="Upload CSV"
            uploadHelpText="*CSV file must contain the following column headers: name, street, city, state, zip_code, and country."
            fileUploadEndpoint={`/properties/upload-csv-units/`}
          />
        </div>
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default Units;
