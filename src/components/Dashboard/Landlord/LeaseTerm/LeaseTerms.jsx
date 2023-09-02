import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "@mui/material";
import { token, uiGreen } from "../../../../constants";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getLeaseTermsByUser } from "../../../../api/api";
const LeaseTerms = () => {
  const [leaseTerms, setLeaseTerms] = useState([]);
  const columns = [
    {
      name: "Rent",
      selector: (row) => row.rent,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => {
        return row.term + " months";
      },
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

  console.log(token);

  //Retrieve user's lease terms
  useEffect(() => {
    //retrieve lease terms that the user has created
    getLeaseTermsByUser().then((res) => {
      setLeaseTerms(res.data);
      console.log(res);
    });
  }, []);

  return (
    <>
      <div style={{ overflow: "auto", padding: "25px 0" }}>
        <h4 style={{ float: "left" }}>Lease Terms</h4>
        <Link to="/dashboard/landlord/lease-terms/create">
          <Button
            style={{ background: uiGreen, float: "right" }}
            variant="contained"
          >
            Create Lease Term
          </Button>
        </Link>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={leaseTerms}
          theme="dark"
          pagination
          onRowClicked={(row) => console.log(row)}
        />
      </div>
    </>
  );
};

export default LeaseTerms;
