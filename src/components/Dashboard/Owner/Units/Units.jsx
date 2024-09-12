import React, { useState, useEffect } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import Joyride, { STATUS } from "react-joyride";
import { authUser, token, uiGreen } from "../../../../constants";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import { getUserStripeSubscriptions } from "../../../../api/auth";
import { deleteUnit } from "../../../../api/units";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
const Units = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
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
    onRowDelete: async (row) => {
      setIsLoading(true);
      let payload = {
        unit_id: row.id,
        rental_property: row.rental_property,
        product_id: currentSubscriptionPlan?.plan?.product
          ? currentSubscriptionPlan?.plan?.product
          : null,
        subscription_id: currentSubscriptionPlan?.id
          ? currentSubscriptionPlan?.id
          : null,
      };
      //Delete the unit with the api
      deleteUnit(payload)
        .then((res) => {
          if (res.status === 204) {
            //Redirect to the property page
            // navigate(`/dashboard/owner/properties/${row.rental_property}`);
            setAlertMessage("Unit has been deleted");
            setAlertTitle("Success");
            setShowAlertModal(true);
          } else {
            //Display error message
            setErrorMessage(res.message ? res.message : "An error occurred");
            setShowDeleteError(true);
          }
        })
        .catch((err) => {
          setErrorMessage(err.message ? err.message : "An error occurred");
          setShowDeleteError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    deleteOptions: {
      confirmTitle: "Delete Unit",
      confirmMessage: "Are you sure you want to delete this unit?",
    },
  };

  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".units-list-section",
      content: "This is the list of all your units.",
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
  };

  useEffect(() => {
    let isMounted = true; // flag to check if component is still mounted

    const fetchSubscriptions = async () => {
      try {
        const res = await getUserStripeSubscriptions(authUser.id, token);
        if (isMounted) {
          setCurrentSubscriptionPlan(res.subscriptions);
        }
      } catch (error) {
        console.error("Failed to fetch subscriptions", error);
      }
    };

    fetchSubscriptions();

    return () => {
      isMounted = false; // cleanup: set isMounted to false if component unmounts
    };
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
      <AlertModal
        open={showAlertModal}
        setOpen={setShowAlertModal}
        title={alertTitle}
        message={alertMessage}
        btnText={"Ok"}
        onClick={() => navigate(0)}
      />
      <ProgressModal open={isLoading} title="Please wait..." />
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
        <div className="units-list-section" style={{ padding: "20px" }}>
          <UITable
            testRowIdentifier="rental-unit"
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
