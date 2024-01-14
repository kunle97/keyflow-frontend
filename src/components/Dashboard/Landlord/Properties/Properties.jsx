import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteProperty,
  getPropertyFilters,
  getProperties,
} from "../../../../api/properties";
import { getUnits } from "../../../../api/units";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import useScreen from "../../../../hooks/useScreen";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import { authUser } from "../../../../constants";
const Properties = () => {
  const { screenWidth, breakpoints } = useScreen();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  //Create a useEffect that calls the get propertiees api function and sets the properties state
  useEffect(() => {
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
      <>
        <UITableMobile
          testRowIdentifier="property"
          tableTitle="Properties"
          endpoint={"/properties/"}
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
      </>
    </div>
  );
};

export default Properties;
