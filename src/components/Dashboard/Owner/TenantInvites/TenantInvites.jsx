import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UITable from "../../UIComponents/UITable/UITable";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { deleteTenantInvite } from "../../../../api/tenant_invite";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
const TenantInvites = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progressModalMessage, setProgressModalMessage] =
    useState("Loading...");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [leaseRenewals, setLeaseRenewals] = useState([]);
  const [leaseCancellations, setLeaseCancellations] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmModalConfirmAction, setConfirmModalConfirmAction] = useState(
    () => {}
  );

  const handleResendTenantInvite = () => {
    console.log("Resend Tenant Invite");
    setIsLoading(true);
    setProgressModalMessage("Resending tenant invite...");
  };

  const handleRevokeTenantInvite = (id) => {
    setIsLoading(true);
    setProgressModalMessage("Revoking tenant invite...");
    deleteTenantInvite(id)
      .then((res) => {
        console.log("TENANT INVITE REVOKE RES", res);
        if (res.status === 204) {
          setAlertTitle("Tenant Invite Revoked");
          setAlertMessage("The tenant invite revoked successfully.");
          setShowAlert(true);
        } else {
          throw new Error("Error revoking tenant invite");
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error revoking tenant invite. Please try again."
        );
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoading(false);
        setConfirmModalOpen(false);
      });
  };
  const navigate = useNavigate();
  const { isMobile } = useScreen();
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
      name: "rental_unit_name",
      label: "Unit Name",
    },
    {
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleString();
        },
      },
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/owner/tenant-invitess/${rowData}/`;
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
      <AlertModal
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
          navigate(0);
        }}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <ConfirmModal
        open={confirmModalOpen}
        title={confirmModalTitle}
        message={confirmModalMessage}
        confirmBtnText="Okay"
        cancelBtnText="Cancel"
        handleConfirm={confirmModalConfirmAction}
        handleCancel={() => {
          setConfirmModalOpen(false);
        }}
      />
      <div className="row">
        <div className="col-sm-12 col-md-12 ">
          {isMobile ? (
            <UITableMobile
              tableTitle="Tenants Invites"
              endpoint={`/tenant-invites/`}
              onRowClick={(row) => {
                const navlink = `/dashboard/owner/tenant-invitess/${row.id}`;
                navigate(navlink);
              }}
              createInfo={(row) => `${row.first_name} ${row.last_name}`}
              createSubtitle={(row) => `${row.email}`}
              createTitle={(row) => `${row.email}`}
              orderingFields={[
                { field: "created_at", label: "Date Created" },
                { field: "-created_at", label: "Date Created (Descending)" },
              ]}
              loadingTitle="Loading Tenants..."
              loadingMessage="Please wait while we load all the tenants."
              searchFields={["first_name", "last_name", "email"]}
            />
          ) : (
            <UITable
              title="Tenant Invites"
              endpoint={`/tenant-invites/`}
              searchFields={["first_name", "last_name", "email"]}
              columns={columns}
              options={options}
              showCreate={true}
              createURL="/dashboard/owner/tenant-invites/create"
              menuOptions={[
                {
                  name: "Resend Invite",
                  onClick: (row) => {
                    setConfirmModalTitle("Resend Tenant Invite");
                    setConfirmModalMessage(
                      "Are you sure you want to resend this tenant invite?"
                    );
                    setConfirmModalOpen(true);
                    setConfirmModalConfirmAction(
                      () => () => handleResendTenantInvite(row.id)
                    );
                  },
                },
                {
                  name: "Revoke Tenant Invite",
                  onClick: (row) => {
                    setConfirmModalTitle("Revoke Tenant Invite");
                    setConfirmModalMessage(
                      "Are you sure you want to revoke this tenant invite? " +
                        "The tenant invite will be deleted and the recipient will no longer be able to accept it. " +
                        "The lease agreement document will also be voided."
                    );
                    setConfirmModalOpen(true);
                    setConfirmModalConfirmAction(
                      () => () => handleRevokeTenantInvite(row.id)
                    );
                  },
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantInvites;
