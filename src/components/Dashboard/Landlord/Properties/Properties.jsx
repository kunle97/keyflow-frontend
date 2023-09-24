import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProperty, getProperties, getUnits } from "../../../../api/api";
import MUIDataTable from "mui-datatables";
import { Typography, CircularProgress, Box } from "@mui/material";
import { uiGreen } from "../../../../constants";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { set } from "react-hook-form";
const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const columns = [
    { name: "id", options: { display: false } },
    { name: "name" },
    { name: "street", label: "Street Address" },
    { name: "city" },
    { name: "state" },
    { name: "zip_code", label: "Zip Code" },
    { name: "country" },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/properties/${rowData[0]}`;
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
      console.log(rowsDeleted);
      //Create an array to hold the ids of the rows to be deleted
      const idsToDelete = [];
      //Loop through the rows to be deleted and push the ids to the idsToDelete array
      rowsDeleted.data.map((row) => {
        idsToDelete.push(properties[row.dataIndex].id);
      });
      //Call the delete properties api function and pass the idsToDelete array
      idsToDelete.map((id) => {
        //Check if property has units before deleting
        getUnits(id).then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            setShowDeleteError(true);
            setErrorMessage(
              `One or more of the the properties you have selected have units. Please delete units first before deleting them.`
            );

            return false;
          } else {
            deleteProperty(id).then((res) => {
              console.log(res);
              //If the delete was successful, remove the deleted rows from the properties state
              const newProperties = properties.filter(
                (property) => property.id !== id
              );
              setProperties(newProperties);
            });
          }
        });
      });
    },
  };

  //Create a useEffect that calls the get propertiees api function and sets the properties state
  useEffect(() => {
    getProperties().then((res) => {
      console.log(res);
      if (res) {
        setProperties(res.data);
        setIsLoading(false);
      }
      console.log("Properties: ", properties);
    });
  }, []);
  console.log(properties);
  return (
    <div className="container">
      <div className="col overflow-auto mb-4">
        <Link to="/dashboard/landlord/properties/create">
          <button className="btn btn-primary float-end ui-btn" type="button">
            New Property
          </button>
        </Link>
      </div>
      <div className="card shadow " style={{ overflow: "hidden" }}>
        {isLoading ? (
          <Box sx={{ display: "flex" }}>
            <Box m={"55px auto"}>
              <CircularProgress sx={{ color: uiGreen }} />
            </Box>
          </Box>
        ) : (
          <>
            {" "}
            {properties.length === 0 ? (
              <Typography m={5} color={"white"}>
                No Properties Created
              </Typography>
            ) : (
              <>
                <AlertModal
                  open={showDeleteError}
                  setOpen={setShowDeleteError}
                  title={"Error"}
                  message={errorMessage}
                  btnText={"Ok"}
                  onClick={() => setShowDeleteError(false)}
                />
                <MUIDataTable
                  title={"Properties"}
                  data={properties}
                  columns={columns}
                  options={options}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
