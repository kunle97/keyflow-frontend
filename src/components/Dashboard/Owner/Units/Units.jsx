import React, { useState, useEffect } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
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

  return (
    <div className="container-fluid">
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
        />
      ) : (
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
                const navlink = `/dashboard/owner/units/${row.rental_property}/${row.id}`;
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
      )}
    </div>
  );
};

export default Units;
