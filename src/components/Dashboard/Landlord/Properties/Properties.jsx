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
const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const columns = [
    { name: "id", label: "ID", options: { display: false } },
    { name: "name", label: "Property Name" },
    { name: "street", label: "Street Address" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/properties/${rowData}`;
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
    <div className="container">
      <AlertModal
        open={showDeleteError}
        setOpen={setShowDeleteError}
        title={"Error"}
        message={errorMessage}
        btnText={"Ok"}
        onClick={() => setShowDeleteError(false)}
      />
      <UITable
        columns={columns}
        options={options}
        endpoint="/properties/"
        title="Properties"
        createURL="/dashboard/landlord/properties/create"
        detailURL="/dashboard/landlord/properties/"
        showCreate={true}
        filters={
          filters
            ? [
                { param: "state", label: "State", values: filters.states },
                { param: "city", label: "City", values: filters.cities },
              ]
            : []
        }
      />
    </div>
  );
};

export default Properties;
