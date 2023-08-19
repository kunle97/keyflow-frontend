import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProperties } from "../../../../api/api";
import MUIDataTable from "mui-datatables";
import { Typography, CircularProgress, Box } from "@mui/material";
import { green } from "@mui/material/colors";
const Properties = () => {
  const [properties, setProperties] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const columns = [
    "id",
    "name",
    "address",
    "city",
    "state",
    "zip_code",
    "country",
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/properties/${rowData[0]}`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
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
        <Link to="/dashboard/properties/create">
          <button className="btn btn-primary float-end ui-btn" type="button">
            New Property
          </button>
        </Link>
      </div>
      <div className="card shadow " style={{ overflow: "hidden" }}>
        {isLoading ? (
          <Box sx={{ display: "flex" }}>
            <Box m={"55px auto"}>
              <CircularProgress sx={{color:"#3aaf5c"}} />
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
              <MUIDataTable
                title={"Properties"}
                data={properties}
                columns={columns}
                options={options}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
