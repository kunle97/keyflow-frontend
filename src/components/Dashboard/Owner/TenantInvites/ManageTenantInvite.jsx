import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { getTenantInvite } from "../../../../api/tenant_invite";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { deleteTenantInvite } from "../../../../api/tenant_invite";
const ManageTenantInvite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [progressModalMessage, setProgressModalMessage] =
    useState("Loading...");
  const [tenantInvite, setTenantInvite] = useState(null);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmModalConfirmAction, setConfirmModalConfirmAction] = useState(
    () => {}
  );

  const handleResendTenantInvite = () => {

    setIsLoading(true);
    setProgressModalMessage("Resending tenant invite...");
  };

  const handleRevokeTenantInvite = () => {
    setIsLoading(true);
    setProgressModalMessage("Revoking tenant invite...");
    deleteTenantInvite(id)
      .then((res) => {

        if (res.status === 204) {
          setAlertTitle("Tenant Invite Revoked");
          setAlertMessage("The tenant invite revoked successfully.");
          setShowAlert(true);
        } else {
          throw new Error("Error revoking tenant invite");
        }
      })
      .catch((err) => {

        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error revoking tenant invite. Please try again."
        );
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!tenantInvite) {
      try {
        getTenantInvite(id).then((res) => {

          setTenantInvite(res);
        });
      } catch (err) {

        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error fetching tenant data. Please try again."
        );
        setShowAlert(true);
      }
    }
  }, [tenantInvite]);
  return (
    <>
      <AlertModal
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
          navigate("/dashboard/owner/tenant-invites");
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

      <ProgressModal open={isLoading} title={progressModalMessage} />
      {tenantInvite && (
        <div className="container">
          <UIPageHeader
            backButtonURL="/dashboard/owner/tenants"
            backButtonPosition="top"
            title={`${tenantInvite.first_name} ${tenantInvite.last_name}`}
            subtitle={
              <a href={`mailto:${tenantInvite.email}`} className="text-muted">
                {tenantInvite.email}
              </a>
            }
            style={{ marginTop: "20px" }}
            menuItems={[
              {
                label: "Resend Invite",
                action: () => {
                  setConfirmModalTitle("Resend Tenant Invite");
                  setConfirmModalMessage(
                    "Are you sure you want to resend this tenant invite?"
                  );
                  setConfirmModalOpen(true);
                  setConfirmModalConfirmAction(() => handleResendTenantInvite);
                },
              },
              {
                label: "Revoke Tenant Invite",
                action: () => {
                  setConfirmModalTitle("Revoke Tenant Invite");
                  setConfirmModalMessage(
                    "Are you sure you want to revoke this tenant invite? " +
                      "The tenant invite will be deleteed and the recipient will no longer be able to accept it." +
                      "The lease agreement document will also be voided."
                  );
                  setConfirmModalOpen(true);
                  setConfirmModalConfirmAction(() => handleRevokeTenantInvite);
                },
              },
            ]}
          />
        </div>
      )}
    </>
  );
};

export default ManageTenantInvite;
