import { Hidden } from "@mui/material";
import React from "react";
import DataTable from "react-data-table-component";
import { uiGrey2 } from "../../../../constants";
const LeaseTerms = () => {
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Rent",
      selector: (row) => row.rent,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      sortable: true,
    },
    {
      name: "Late Fee",
      selector: (row) => row.late_fee,
      sortable: true,
    },
    {
      name: "Security Deposit",
      selector: (row) => row.security_deposit,
      sortable: true,
    },
  ];

  const data = [
    {
      id: 1,
      name: "Beetlejuice",
      rent: "$2400",
      duration: "12 months",
      late_fee: "$350",
      security_deposit: "$1250",
    },
  ];

  return (
    <>
      <h4 >Lease Terms</h4>
      <div className="card" style={{ overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={data}
          theme="dark"
          pagination
          onRowClicked={(row) => console.log(row)}
        />
      </div>
    </>
  );
};

export default LeaseTerms;
