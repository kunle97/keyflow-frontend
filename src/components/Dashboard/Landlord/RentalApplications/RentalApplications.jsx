import React, { useEffect, useState } from "react";
import {
  getRentalApplicationsByUser,
} from "../../../../api/rental_applications";
import { useNavigate } from "react-router";
import UITable from "../../UIComponents/UITable/UITable";
const RentalApplications = () => {
  const [rentalApplications, setRentalApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    {
      name: "id",
      label: "ID",
      selector: (row) => row.id,
      sortable: true,
      options: { display: false },
    },
    {
      name: "first_name",
      label: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      label: "Last Name",
      name: "last_name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      label: "Email",
      name: "email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      label: "Phone",
      name: "phone_number",
      selector: (row) => row.phone_number,
      sortable: true,
    },
    {
      label: "Unit",
      name: "unit",
      selector: (row) => row.unit,
      sortable: true,
    },
    {
      label: "Desired Move In Date",
      name: "desired_move_in_date",
      selector: (row) => row.desired_move_in_date,
      sortable: true,
    },
    {
      label: "Date Subitted",
      name: "created_at",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toISOString().split("T")[0];
        },
      },
      selector: (row) => new Date(row.created_at).toISOString().split("T")[0],
      sortable: true,
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/rental-applications/${rowData}`;
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
  };
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
      {/* <h4>Rental Applications</h4>
      <div className="card" style={{ overflow: "hidden" }}>
        {isLoading ? (
          <Box sx={{ display: "flex" }}>
            <Box m={"55px auto"}>
              <CircularProgress sx={{ color: uiGreen }} />
            </Box>
          </Box>
        ) : (
          <>
            <MUIDataTable
              title={"Rental Applications"}
              columns={columns}
              data={rentalApplications}
              options={options}
            />
          </>
        )}
      </div> */}
      <UITable
        columns={columns}
        options={options}
        endpoint={`/rental-applications/`}
        title="Rental Applications"
        detailURL="/dashboard/landlord/rental-applications/"
        showCreate={false}
      />
    </>
  );
};

export default RentalApplications;
