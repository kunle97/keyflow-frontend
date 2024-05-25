import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPropertyFilters, getProperties } from "../../../../api/properties";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import useScreen from "../../../../hooks/useScreen";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
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
    { label: "Zip Code", name: "zip_code" },
    { label: "Country", name: "country" },
  ];

  const options = {
    isSelectable: true,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/owner/properties/${row}`;
      navigate(navlink);
    },
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
            const navlink = `/dashboard/owner/properties/${row.id}`;
            navigate(navlink);
          }}
          createURL="/dashboard/owner/properties/create"
          showCreate={true}
        />
      ) : (
        <UITable
          options={options}
          checked={checked}
          columns={columns}
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
      )}
    </div>
  );
};

export default Properties;
