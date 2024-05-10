import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPropertyFilters, getProperties } from "../../../../api/properties";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import useScreen from "../../../../hooks/useScreen";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { authUser } from "../../../../constants";
import { getStaffRentalAssignments } from "../../../../api/staff";
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
    isSelectable: false,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/landlord/properties/${row}`;
      navigate(navlink);
    },
  };

  //Create a useEffect that calls the get propertiees api function and sets the properties state
  useEffect(() => {
    if (authUser.account_type == "owner") {
      getProperties().then((res) => {
        if (res) {
          setProperties(res.data);
        }
      });
      getPropertyFilters().then((res) => {
        if (res) {
          setFilters(res);
        }
      });
    } else if (authUser.account_type == "staff") {
      getStaffRentalAssignments().then((res) => {
        setProperties(res);
      });
    }
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
          endpoint={authUser.account_type == "owner" ? "/properties/" : null}
          data={authUser.account_type == "owner" ? null : properties}
          infoProperty="name"
          createTitle={(row) => `${row.street}, ${row.city}, ${row.state}`}
          subtitleProperty="somthing"
          acceptedFileTypes={[".csv"]}
          showUpload={true}
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
            const navlink = `/dashboard/landlord/properties/${row.id}`;
            navigate(navlink);
          }}
          createURL="/dashboard/landlord/properties/create"
          showCreate={true}
        />
      ) : (
        <UITable
          endpoint={authUser.account_type == "owner" ? "/properties/" : null}
          data={authUser.account_type == "owner" ? null : properties}
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
                const navlink = `/dashboard/landlord/properties/${row.id}`;
                navigate(navlink);
              },
            },
          ]}
          title="Properties"
          showCreate={true}
          createURL="/dashboard/landlord/properties/create"
          options={options}
          checked={checked}
          columns={columns}
          setChecked={setChecked}
        />
      )}
    </div>
  );
};

export default Properties;
