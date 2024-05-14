import React, { useState } from "react";
import {
  authUser,
  defaultWhiteInputStyle,
  uiGreen,
  validationMessageStyle,
} from "../../../../constants";
import { set, useForm } from "react-hook-form";
import UIButton from "../../UIComponents/UIButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { createTenantInvite } from "../../../../api/tenant_invite";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { sendDocumentToUser } from "../../../../api/boldsign";

const TenantInviteForm = (props) => {
  const [unit, setUnit] = useState({});
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const handleSubmitTenantInvite = (data) => {
    setIsLoading(true);
    if (props.templateId) {
      const doc_payload = {
        owner_id: authUser.owner_id,
        template_id: props.templateId,
        tenant_first_name: data.first_name,
        tenant_last_name: data.last_name,
        tenant_email: data.email,
        document_title: `${data.first_name} ${data.last_name} Lease Agreement for unit ${props.unitName}`,
        message: "Please sign the lease agreement",
      };

      sendDocumentToUser(doc_payload).then((res) => {
        console.log("sendDocResponse: ", res);
        // Retrieve document_id from sendDocResponse and add to data
        if (res.documentId) {
          data.boldsign_document_id = res.documentId;
          data.rental_unit = props.rental_unit_id;
          createTenantInvite(data).then((res) => {
            console.log("Create invite res ",res);
            if (res.status === 200) {
              setMessage("Tenant invite sent!");
              setTitle("Success!");
              setOpen(true);
            } else {
              setMessage("Tenant invite failed to send. Please try again.");
              setTitle("Error Sending Invite");
              setOpen(true);
            }
          });
        }
      }).catch((err) => {
        console.log("sendDocError: ", err);
        setMessage("Tenant invite failed to send. Please try again.");
        setTitle("Error Sending Invite");
        setOpen(true);
      }).finally(() => {
        setIsLoading(false);
      });
    }else if (props.signedLeaseDocumentFileId) {
      data.rental_unit = props.rental_unit_id;
      createTenantInvite(data).then((res) => {
        console.log("Create invite res ",res);
        if (res.status === 200) {
          setMessage("Tenant invite sent!");
          setTitle("Success!");
          setOpen(true);
        } else {
          setMessage("Tenant invite failed to send. Please try again.");
          setTitle("Error Sending Invite");
          setOpen(true);
        }
      }).catch((err) => {
        console.log("sendDocError: ", err);
        setMessage("Tenant invite failed to send. Please try again.");
        setTitle("Error Sending Invite");
        setOpen(true);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <div className=" ">
      <AlertModal
        open={open}
        setOpen={setOpen}
        title={title}
        message={message}
        btnText="Ok"
        onClick={() => {
          setOpen(false);
          props.setTenantInviteDialogOpen(false);
        }}
      />
      <ProgressModal open={isLoading} title={"Sending Invite..."} />
      <form
        onSubmit={handleSubmit(handleSubmitTenantInvite)}
        encType="multipart/form-data"
      >
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label
              data-testid="invite-tenant-first-name-label"
              className="form-label text-black"
              htmlFor="firstName"
            >
              <strong>First Name</strong>
            </label>
            <input
              data-testid="invite-tenant-first-name-input"
              {...register("first_name", {
                required: "This is a required field",
              })}
              // defaultValue={unit.name}
              className="form-control text-black"
              type="text"
              id="firstName"
              placeholder="John"
              style={{
                borderStyle: "none",
                color: "rgb(255,255,255)",
              }}
            />
            <span style={validationMessageStyle}>
              {errors.firstName && errors.firstName.message}
            </span>
          </div>
          <div className="col-md-6 mb-3">
            <label
              data-testid="invite-tenant-last-name-label"
              className="form-label text-black"
              htmlFor="lastName"
            >
              <strong>Last Name</strong>
            </label>
            <input
              data-testid="invite-tenant-last-name-input"
              {...register("last_name", {
                required: "This is a required field",
              })}
              // defaultValue={unit.name}
              className="form-control text-black"
              type="text"
              id="lastName"
              placeholder="Doe"
              style={{
                borderStyle: "none",
                color: "rgb(255,255,255)",
              }}
            />
            <span style={validationMessageStyle}>
              {errors.lastName && errors.lastName.message}
            </span>
          </div>
          <div className="col-md-12 mb-3">
            <label
              data-testid="invite-tenant-email-label"
              className="form-label text-black"
              htmlFor="email"
            >
              <strong>Email</strong>
            </label>
            <input
              data-testid="invite-tenant-email-input"
              {...register("email", {
                required: "This is a required field",
              })}
              // defaultValue={unit.name}
              className="form-control text-black"
              type="email"
              id="email"
              placeholder="example@email.com"
              style={{
                borderStyle: "none",
                color: "rgb(255,255,255)",
              }}
            />
            <span style={validationMessageStyle}>
              {errors.email && errors.email.message}
            </span>
          </div>
        </div>
        <UIButton
          data-testid="invite-tenant-submit-button"
          style={{
            textTransform: "none",
            background: uiGreen,
            color: "white",
            width: "100%",
          }}
          btnText="Send Invite"
          type="submit"
        />
      </form>
    </div>
  );
};

export default TenantInviteForm;
