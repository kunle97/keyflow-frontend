import React, { useEffect, useState } from "react";
import { getLandlordStaff } from "../../../../api/landlords";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import {
  defaultUserProfilePicture,
  uiGreen,
  uiRed,
} from "../../../../constants";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { deleteStaffInvite } from "../../../../api/staff_invites";
const StaffInvites = () => {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const columns = [
    {
      name: "first_name",
      label: "First Name",
    },
    {
      name: "last_name",
      label: "Last Name",
    },
    {
      name: "email",
      label: "E-mail",
    },
    {
      name: "staff",
      label: "Accepted",
      options: {
        customBodyRender: (value) => {
          console.log("Staff ID",value);
          return value ? (
            <span style={{ color: uiGreen }}>Yes</span>
          ) : (
            <span style={{ color: uiRed }}>No</span>
          );
        },
      },
    },
    {
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
    },
  ];

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/staff-invites/${rowData}/`;
    navigate(navlink);
  };

  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
  };

  useEffect(() => {}, []);
  return (
    <div className="container">
      <ConfirmModal
        open={showDeleteConfirmModal}
        title="Delete Staff"
        message="Are you sure you want to delete this staff?"
        confirmBtnText="Delete"
        cancelBtnText="Cancel"
        handleConfirm={() => {
          deleteStaffInvite(selectedStaffId).then((res) => {
            console.log(res);
            if (res.status === 204) {
              navigate(0);
            }
          });
          setShowDeleteConfirmModal(false);
        }}
        handleCancel={() => {
          setShowDeleteConfirmModal(false);
        }}
      />

      {isMobile ? (
        <UITableMobile
          tableTitle="Staff Invites"
          endpoint={`/staff-invites/`}
          onRowClick={(row) => {
            const navlink = `/dashboard/landlord/staff/${row.id}`;
            navigate(navlink);
          }}
          createInfo={(row) => `${row.first_name} ${row.last_name}`}
          createSubtitle={(row) => `${row.email}`}
          createTitle={(row) => `${row.email}`}
          orderingFields={[
            { field: "created_at", label: "Date Created" },
            { field: "-created_at", label: "Date Created (Descending)" },
          ]}
          loadingTitle="Loading Staff..."
          loadingMessage="Please wait while we load all the staff."
        />
      ) : (
        <UITable
          title="Staff Invites"
          endpoint={`/staff-invites/`}
          showSearch={true}
          showCreate={true}
          createURL="/dashboard/landlord/staff-invites/create"
          searchFields={["first_name", "last_name", "email"]}
          columns={columns}
          options={options}
          menuOptions={[
            {
              name: "Delete",
              onClick: (row) => {
                setShowDeleteConfirmModal(true);
                setSelectedStaffId(row.id);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default StaffInvites;
