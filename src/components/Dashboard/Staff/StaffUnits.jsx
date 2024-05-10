import React, { useEffect, useState } from "react";
import { staffData } from "../../../constants";
import { getStaffRentalAssignments } from "../../../api/staff";
import UITable from "../UIComponents/UITable/UITable";
import { useNavigate } from "react-router";
import useScreen from "../../../hooks/useScreen";
import UITableMobile from "../UIComponents/UITable/UITableMobile";
const StaffUnits = () => {
  const [units, setUnits] = useState([]);
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const unit_columns = [
    {
      name: "rental_property_name",
      label: "Rental Property",
    },
    { name: "name", label: "Name" },
    { name: "beds", label: "Beds" },
    { name: "baths", label: "Baths" },
    {
      name: "is_occupied",
      label: "Occupied",
      options: {
        customBodyRender: (value) => {
          if (value === true) {
            return <span>Yes</span>;
          } else {
            return <span>No</span>;
          }
        },
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: (rowData, rowMeta) => {
      const navlink = `/dashboard/landlord/units/${rowData}`;
      navigate(navlink);
    },
  };
  useEffect(() => {
    console.log(
      "Staff Dataaa assignement typ chek ",
      JSON.parse(staffData.rental_assignments)
    );
    getStaffRentalAssignments().then((res) => {
      setUnits(res);
    });
  }, []);

  return (
    <div className="container">
      {isMobile ? (
        <UITableMobile
          testRowIdentifier="rental-unit"
          tableTitle="Units"
          data={units}
          infoProperty="name"
          createTitle={(row) => `Occupied: ${row.is_occupied ? `Yes` : "No"} `}
          createSubtitle={(row) => `Beds: ${row.beds} | Baths: ${row.baths}`}
          //   createURL={`/dashboard/landlord/units/create/${id}`}
          showCreate={true}
          acceptedFileTypes={[".csv"]}
          showUpload={true}
          uploadHelpText="CSV file must contain the following columns: name, beds, baths, size. All lowercase and no spaces."
          //   fileUploadEndpoint={`/properties/${id}/upload-csv-units/`}
          //   onRowClick={(row) => {
          //     const navlink = `/dashboard/landlord/units/${row.id}/${row.rental_property}`;
          //     navigate(navlink);
          //   }}
        />
      ) : (
        <UITable
          columns={unit_columns}
          options={options}
          data={units}
          title="Units"
          createURL="/dashboard/landlord/units/create"
          detailURL="/dashboard/landlord/units/"
          showCreate={false}
        />
      )}
    </div>
  );
};

export default StaffUnits;
