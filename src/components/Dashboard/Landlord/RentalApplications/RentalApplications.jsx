import React, { useEffect, useState } from "react";
import { getRentalApplicationsByUser } from "../../../../api/rental_applications";
import { useNavigate } from "react-router";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
const RentalApplications = () => {
  const [rentalApplications, setRentalApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
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
      label: "Approved",
      name: "is_approved",
      selector: (row) => row.unit,
      options: {
        customBodyRender: (value) => {
          return value ? "Yes" : "No";
        },
      },
      sortable: true,
    },

    {
      label: "Desired Move In Date",
      name: "desired_move_in_date",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
      selector: (row) => row.desired_move_in_date,
      sortable: true,
    },
    {
      label: "Date Submitted",
      name: "created_at",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
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
        // const filteredData = res.data.filter((data) => {
        //   return data.is_archived === false;
        // });
        setRentalApplications(res.data);
        setIsLoading(false);
      }
      console.log("Rental Applications: ", rentalApplications);
    });
  }, []);
  return (
    <div className="container-fluid">
      {/* <UITable
        columns={columns}
        options={options}
        endpoint={`/rental-applications/`}
        title="Rental Applications"
        detailURL="/dashboard/landlord/rental-applications/"
        showCreate={false}
      /> */}
      <UITableMobile
        tableTitle={"Rental Applications"}
        endpoint={`/rental-applications/`}
        createInfo={(row) => `${row.first_name} ${row.last_name}`}
        createTitle={(row) => `${row.unit.name}`}
        createSubtitle={(row) => `${row.is_approved ? "Approved" : "Pending"}`}
        orderingFields={[
          { field: "created_at", label: "Date Submitted (Ascending)" },
          { field: "-created_at", label: "Date Submitted (Descending)" },
          { field: "first_name", label: "First Name (Ascending)" },
          { field: "-first_name", label: "First Name (Descending)" },
          { field: "last_name", label: "Last Name (Ascending)" },
          { field: "-last_name", label: "Last Name (Descending)" },
          {field: "is_approved", label: "Approved (Ascending)"},
          {field: "-is_approved", label: "Approved (Descending)"}
        ]}  
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
          const navlink = `/dashboard/landlord/rental-applications/${row.id}`;
          navigate(navlink);
        }}
      />
    </div>
  );
};

export default RentalApplications;
