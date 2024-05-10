import React, { useEffect, useState } from "react";
import { getLandlordTenant } from "../../../../api/landlords";
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
import { deleteTenantInvite } from "../../../../api/tenant_invite";
const TenantInvites = () => {
  const [tenant, setTenant] = useState([]);
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(null);

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
      name: "tenant",
      label: "Accepted",
      options: {
        customBodyRender: (value) => {
          console.log("Tenant ID",value);
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
    const navlink = `/dashboard/landlord/tenant-invites/${rowData}/`;
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
        title="Delete Tenant"
        message="Are you sure you want to delete this tenant?"
        confirmBtnText="Delete"
        cancelBtnText="Cancel"
        handleConfirm={() => {
          deleteTenantInvite(selectedTenantId).then((res) => {
            console.log(res);
            if (res.status === 204) {
              navigate(0);
            }
          })
          setShowDeleteConfirmModal(false);
        }}
        handleCancel={() => {
          setShowDeleteConfirmModal(false);
        }}
      />

      {isMobile ? (
        <UITableMobile
          tableTitle="Tenant Invites"
          endpoint={`/tenant-invites/`}
          onRowClick={(row) => {
            const navlink = `/dashboard/landlord/tenant/${row.id}`;
            navigate(navlink);
          }}
          createInfo={(row) => `${row.first_name} ${row.last_name}`}
          createSubtitle={(row) => `${row.email}`}
          createTitle={(row) => `${row.email}`}
          orderingFields={[
            { field: "created_at", label: "Date Created" },
            { field: "-created_at", label: "Date Created (Descending)" },
          ]}
          loadingTitle="Loading Tenant..."
          loadingMessage="Please wait while we load all the tenant."
        />
      ) : (
        <UITable
          title="Tenant Invites"
          endpoint={`/tenant-invites/`}
          showSearch={true}
          showCreate={true}
          createURL="/dashboard/landlord/tenant-invites/create"
          searchFields={["first_name", "last_name", "email"]}
          columns={columns}
          options={options}
          menuOptions={[
            {
              name: "Delete",
              onClick: (row) => {
                setShowDeleteConfirmModal(true);
                setSelectedTenantId(row.id);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default TenantInvites;
