import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  deleteLeaseTemplate,
  getLeaseTemplatesByUser,
} from "../../../../api/lease_templates";
import { getLandlordUnits } from "../../../../api/units";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
const LeaseTemplates = () => {
  const [leaseTemplates, setLeaseTemplates] = useState([]);
  const [units, setUnits] = useState([]);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [deleteErrorMessageTitle, setDeleteErrorMessageTitle] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);
  const { isMobile } = useScreen();
  const navigate = useNavigate();
  const columns = [
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

  function deleteLeaseTemplatesIfNotUsed(leaseTemplates, unitsToCheck) {
    const leaseTemplateIdsToDelete = [];
    const leaseTemplateIdsToOmit = [];
    let leaseTemplatesInUse = 0;
    for (const leaseTemplate of leaseTemplates) {
      // Check if the lease term is associated with any units
      const isUsedByUnits = unitsToCheck.some(
        (unit) => unit.lease_template === leaseTemplate.id
      );

      // If not used by any units, add its ID to the list of IDs to be deleted
      if (!isUsedByUnits) {
        leaseTemplateIdsToDelete.push(leaseTemplate.id);
      } else {
        leaseTemplatesInUse++;
        leaseTemplateIdsToOmit.push(leaseTemplate.id);
      }
    }

    // Remove the lease terms from the original array
    const updatedLeaseTemplates = leaseTemplates.filter(
      (leaseTemplate) => !leaseTemplateIdsToDelete.includes(leaseTemplate.id)
    );

    return {
      leaseTemplateIdsToDelete,
      leaseTemplateIdsToOmit,
      leaseTemplatesInUse,
    };
  }

  const handleRowClick = (row) => {
    const navlink = `/dashboard/landlord/lease-templates/${row.id}`;
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
      const leaseTemplateIdsSelected = [];
      //Place the selected rows into an array
      const selectedRows = rowsDeleted.data.map((row) => {
        leaseTemplateIdsSelected.push(leaseTemplates[row.dataIndex]);
      });
      const filteredLeaseTemplates = deleteLeaseTemplatesIfNotUsed(
        leaseTemplateIdsSelected,
        units
      );
      if (filteredLeaseTemplates.leaseTemplatesInUse > 0) {
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
      filteredLeaseTemplates.leaseTemplateIdsToDelete.map((id) => {
        deleteLeaseTemplate(id)
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
    getLeaseTemplatesByUser().then((res) => {
      setLeaseTemplates(res.data);
      console.log(res);
    });
    //Retrieve the user's units
    getLandlordUnits().then((res) => {
      setUnits(res.data);
      console.log(res);
    });
  }, []);
  return (
    <div className="container-fluid">
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
          data={leaseTemplates}
          columns={columns}
          options={options}
        /> */}
      </div>
      {isMobile ? (
        <UITableMobile
          tableTitle="Lease Templates"
          endpoint="/lease-templates/"
          createInfo={(row) => {
            let frequency_unit = "";
            let frequency = "";
            if (row.rent_frequency === "month") {
              frequency_unit = "mo";
              frequency = "month(s)";
            } else if (row.rent_frequency === "week") {
              frequency_unit = "wk";
              frequency = "week(s)";
            } else if (row.rent_frequency === "day") {
              frequency_unit = "day";
              frequency = "day(s)";
            } else if (row.rent_frequency === "year") {
              frequency_unit = "yr";
              frequency = "year(s)";
            } else {
              frequency_unit = "mo";
              frequency = "month(s)";
            }
            return `$${row.rent}/${frequency_unit} | ${row.term} ${frequency} `;
          }}
          createSubtitle={(row) => `Late Fee:  $${row.late_fee}`}
          createTitle={(row) => `Security Deposit: $${row.security_deposit}`}
          onRowClick={handleRowClick}
          orderingFields={[
            { field: "created_at", label: "Date Created (Ascending)" },
            { field: "-created_at", label: "Date Created (Descending)" },
            { field: "rent", label: "Rent (Ascending)" },
            { field: "-rent", label: "Rent (Descending)" },
            { field: "term", label: "Term (Ascending)" },
            { field: "-term", label: "Term (Descending)" },
          ]}
          showCreate={true}
          createURL="/dashboard/landlord/lease-templates/create"
        />
      ) : (
        <UITable
          columns={columns}
          options={options}
          endpoint="/lease-templates/"
          title="Lease Templates"
          showCreate={true}
          createURL="/dashboard/landlord/lease-templates/create"
          menuOptions={[
            {
              name: "Manage",
              onClick: (row) => {
                const navlink = `/dashboard/landlord/lease-templates/${row.id}`;
                navigate(navlink);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default LeaseTemplates;
