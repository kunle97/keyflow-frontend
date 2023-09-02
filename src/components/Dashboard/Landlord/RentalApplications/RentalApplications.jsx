import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  getRentalApplications,
  getRentalApplicationsByUser,
} from "../../../../api/api";
import { CircularProgress, Box } from "@mui/material";
import { uiGreen } from "../../../../constants";
import { useNavigate } from "react-router";
const RentalApplications = () => {
  const [rentalApplications, setRentalApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone_number,
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
    },
    {
      name: "Desired Move In Date",
      selector: (row) => row.desired_move_in_date,
      sortable: true,
    },
    {
      name: "Date Subitted",
      selector: (row) => new Date(row.created_at).toISOString().split("T")[0],
      sortable: true,
    },
  ];


  useEffect(() => {
    getRentalApplicationsByUser().then((res) => {
      console.log(res);
      if (res) {
        //Create a new array that only holds data with the is_arhived property set to false
        const filteredData = res.data.filter((data) => {
          return data.is_archived === false;
        });
        setRentalApplications(filteredData);
        setIsLoading(false);
      }
      console.log("Rental Applications: ", rentalApplications);
    });
  }, []);
  return (
    <>
      <h4>Rental Applications</h4>
      <div className="card" style={{ overflow: "hidden" }}>
        {isLoading ? (
          <Box sx={{ display: "flex" }}>
            <Box m={"55px auto"}>
              <CircularProgress sx={{ color: uiGreen }} />
            </Box>
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={rentalApplications}
            theme="dark"
            pagination
            onRowClicked={(row) => navigate(`/dashboard/landlord/rental-applications/${row.id}`)}

          />
        )}
      </div>
    </>
  );
};

export default RentalApplications;
