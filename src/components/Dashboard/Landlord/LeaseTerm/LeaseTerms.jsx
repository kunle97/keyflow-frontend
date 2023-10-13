import React, { useState } from "react";
import { Button } from "@mui/material";
import { token, uiGreen } from "../../../../constants";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  deleteLeaseTerm,
  getLandlordUnits,
  getLeaseTermsByUser,
} from "../../../../api/api";
import MUIDataTable from "mui-datatables";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { set } from "react-hook-form";
import UITable from "../../UIComponents/UITable/UITable";
const LeaseTerms = () => {
  const [leaseTerms, setLeaseTerms] = useState([]);
  const [units, setUnits] = useState([]);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [deleteErrorMessageTitle, setDeleteErrorMessageTitle] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);
  const navigate = useNavigate();
  const columns = [
    { name: "id", label: "ID", options: { display: true } },
    { name: "rent", label: "Rent" },
    {
      name: "term",
      label: "Duration",
      options: {
        customBodyRender: (value) => {
          return value + " months";
        },
      },
    },
    { name: "late_fee", label: "Late Fee" },
    { name: "security_deposit", label: "Security Deposit" },
    {
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  function deleteLeaseTermsIfNotUsed(leaseTerms, unitsToCheck) {
    const leaseTermIdsToDelete = [];
    const leaseTermIdsToOmit = [];
    let leaseTermsInUse = 0;
    for (const leaseTerm of leaseTerms) {
      // Check if the lease term is associated with any units
      const isUsedByUnits = unitsToCheck.some(
        (unit) => unit.lease_term === leaseTerm.id
      );

      // If not used by any units, add its ID to the list of IDs to be deleted
      if (!isUsedByUnits) {
        leaseTermIdsToDelete.push(leaseTerm.id);
      } else {
        leaseTermsInUse++;
        leaseTermIdsToOmit.push(leaseTerm.id);
      }
    }

    // Remove the lease terms from the original array
    const updatedLeaseTerms = leaseTerms.filter(
      (leaseTerm) => !leaseTermIdsToDelete.includes(leaseTerm.id)
    );

    return { leaseTermIdsToDelete, leaseTermIdsToOmit, leaseTermsInUse };
  }

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/lease-terms/${rowData}`;
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
      const leaseTermIdsSelected = [];
      //Place the selected rows into an array
      const selectedRows = rowsDeleted.data.map((row) => {
        leaseTermIdsSelected.push(leaseTerms[row.dataIndex]);
      });
      const filteredLeaseTerms = deleteLeaseTermsIfNotUsed(
        leaseTermIdsSelected,
        units
      );
      if (filteredLeaseTerms.leaseTermsInUse > 0) {
        setDeleteErrorMessageTitle("Error");
        setDeleteErrorMessage(
          "Some of the selected lease terms are in use and have not been deleted."
        );
        setShowDeleteError(true);
      } else {
        setDeleteErrorMessageTitle("Success");
        setDeleteErrorMessage(
          "The selected lease terms have been deleted successfully."
        );
        setShowDeleteError(true);
      }
      filteredLeaseTerms.leaseTermIdsToDelete.map((id) => {
        deleteLeaseTerm(id)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setDeleteErrorMessage(err.response.data.message);
            setShowDeleteError(true);
          });
      });
    },
  };

  //Retrieve user's lease terms
  useEffect(() => {
    //retrieve lease terms that the user has created
    getLeaseTermsByUser().then((res) => {
      setLeaseTerms(res.data);
      console.log(res);
    });
    //Retrieve the user's units
    getLandlordUnits().then((res) => {
      setUnits(res.data);
      console.log(res);
    });
  }, []);
  return (
    <>
      <div className="card" style={{ overflow: "hidden" }}>
        <AlertModal
          open={showDeleteError}
          setOpen={setShowDeleteError}
          title={deleteErrorMessageTitle}
          message={deleteErrorMessage}
          btnText="Ok"
          onClick={() => {
            setShowDeleteError(false);
          }}
        />
        {/* <MUIDataTable
          title={"Lease Terms"}
          data={leaseTerms}
          columns={columns}
          options={options}
        /> */}
      </div>
      <UITable
        columns={columns}
        options={options}
        endpoint="/lease-terms/"
        title="Lease Terms"
        createURL="/dashboard/landlord/lease-terms/create"
        detailURL="/dashboard/landlord/lease-terms/" 
        showCreate={true}
      />
    </>
  );
};

export default LeaseTerms;
