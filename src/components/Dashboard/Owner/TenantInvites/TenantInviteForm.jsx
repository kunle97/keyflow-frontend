import React, { useEffect, useState } from "react";
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
import { validAnyString, validEmail } from "../../../../constants/rexgex";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import { Stack } from "@mui/material";
import { authenticatedInstance } from "../../../../api/api";
import { useNavigate } from "react-router";
import { preventPageReload } from "../../../../helpers/utils";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import Joyride, { STATUS } from "react-joyride";
const TenantInviteForm = (props) => {
  const [selectedUnit, setSelectedUnit] = useState({});
  const [units, setUnits] = useState([]);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".tenant-invite-form",
      content: "This is the form to create a tenant invite that will allow a tenant to sign a lease agreement and create an account to pay rent, submit maintenance requests, and more.",
      disableBeacon: true,
      placement: "center"
    },
    {
      target: "[data-testid='invite-tenant-first-name']",
      content: "Enter the tenant's first name here.",
    },
    {
      target: "[data-testid='invite-tenant-last-name']",
      content: "Enter the tenant's last name here.",
    },
    {
      target: "[data-testid='invite-tenant-email']",
      content: "Enter the tenant's email here.",
    },
    {
      target: "[data-testid='invite-tenant-unit']",
      content: "Select the unit you want to invite the tenant to.",
    },
    {
      target: "[data-testid='invite-tenant-submit-button']",
      content: "Click here to send the tenant invite.",
    },

  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
    console.log(runTour);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleChangeSelectedUnit = (e) => {
    setSelectedUnit(units.find((unit) => unit.id === parseInt(e.target.value)));
    console.log("targe value: ", e.target.value);
    console.log("Selected Unit: ", selectedUnit);
  };
  const formInputs = [
    {
      label: "First Name",
      name: "first_name",
      type: "text",
      placeholder: "John",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Please enter a valid first name",
      },
      dataTestId: "invite-tenant-first-name",
      errorMessageDataTestId: "invite-tenant-first-name-error",
    },
    {
      label: "Last Name",
      name: "last_name",
      type: "text",
      placeholder: "Doe",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Please enter a valid last name",
      },
      dataTestId: "invite-tenant-last-name",
      errorMessageDataTestId: "invite-tenant-last-name-error",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "jdoe@email.com",
      onChange: (e) => handleChange(e),
      colSpan: 12,
      validations: {
        required: true,
        regex: validEmail,
        errorMessage: "Please enter a valid email",
      },
      dataTestId: "invite-tenant-email",
      errorMessageDataTestId: "invite-tenant-email-error",
    },
    {
      label: "Unoccupied Units",
      name: "rental_unit",
      type: "select",
      placeholder: "Select Unit",
      onChange: (e) => handleChangeSelectedUnit(e),
      colSpan: 12,
      options: units
        .filter(
          (unit) =>
            unit.template_id !== null ||
            unit.signed_lease_document_file !== null
        )
        .map((unit) => ({
          value: unit.id,
          label: unit.name + " - " + unit.rental_property_name,
        })),
      validations: {
        required: props.rental_unit_id || props.signedLeaseDocumentFileId,
        regex: validAnyString,
        errorMessage: "Please select a unit",
      },
      hidden: props.rental_unit_id || props.signedLeaseDocumentFileId,
      dataTestId: "invite-tenant-unit",
      errorMessageDataTestId: "invite-tenant-unit-error",
    },
  ];

  const handleSubmitTenantInvite = (e) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    const { isValid, newErrors } = validateForm(formData, formInputs);
    if (isValid) {
      setIsLoading(true);
      if (props.templateId || selectedUnit.template_id) {
        const doc_payload = {
          owner_id: authUser.owner_id,
          template_id: props.template_id || selectedUnit.template_id,
          tenant_first_name: formData.first_name,
          tenant_last_name: formData.last_name,
          tenant_email: formData.email,
          document_title: `${formData.first_name} ${
            formData.last_name
          } Lease Agreement for unit ${props.unitName || selectedUnit.name}`,
          message: "Please sign the lease agreement",
        };

        sendDocumentToUser(doc_payload)
          .then((res) => {
            console.log("sendDocResponse: ", res);
            // Retrieve document_id from sendDocResponse and add to data
            if (res.documentId) {
              let tenant_invite_data = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                rental_unit: props.rental_unit_id || selectedUnit.id,
                boldsign_document_id: res.documentId,
              };
              createTenantInvite(tenant_invite_data).then((res) => {
                console.log("Create invite res ", res);
                if (res.status === 200) {
                  setMessage("Tenant invite sent!");
                  setTitle("Success!");
                  setOpen(true);
                } else {
                  setMessage(
                    "Tenant invite failed to send. Please ensure you have not already sent a tenant invite to this email for this rental unit and try again."
                  );
                  setTitle("Error Sending Invite");
                  setOpen(true);
                }
              });
            }
          })
          .catch((err) => {
            console.log("sendDocError: ", err);
            setMessage(
              "Tenant invite failed to send. Please ensure you have not already sent a tenant invite to this email for this rental unit and try again."
            );
            setTitle("Error Sending Invite");
            setOpen(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (
        props.signedLeaseDocumentFileId ||
        selectedUnit.signed_lease_document_file
      ) {
        let tenant_invite_data = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          rental_unit: props.rental_unit_id || selectedUnit.id,
        };
        createTenantInvite(tenant_invite_data)
          .then((res) => {
            console.log("Create invite res ", res);
            if (res.status === 200) {
              setMessage("Tenant invite sent!");
              setTitle("Success!");
              setOpen(true);
            } else {
              setMessage(
                "Tenant invite failed to send. Please ensure you have not already sent a tenant invite to this email for this rental unit and try again."
              );
              setTitle("Error Sending Invite");
              setOpen(true);
            }
          })
          .catch((err) => {
            console.log("sendDocError: ", err);
            setMessage(
              "Tenant invite failed to send. Please ensure you have not already sent a tenant invite to this email for this rental unit and try again."
            );
            setTitle("Error Sending Invite");
            setOpen(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      setErrors(newErrors);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    preventPageReload();
    if (!props.rental_unit_id && !props.signedLeaseDocumentFileId) {
      authenticatedInstance("/units/?is_occupied=False").then((res) => {
        setUnits(res.data);
      });
    }
  }, []);
  return (
    <div className=" ">
      <Joyride
        run={runTour}
        index={tourIndex}
        steps={tourSteps}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: uiGreen,
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip",
        }}
      />
      <AlertModal
        open={open}
        setOpen={setOpen}
        title={title}
        message={message}
        btnText="Ok"
        onClick={() => {
          setOpen(false);
          if (props.setTenantInviteDialogOpen) {
            props.setTenantInviteDialogOpen(false);
          } else {
            //Redirect to tenant invites page
            navigate("/dashboard/owner/tenant-invites");
          }
        }}
      />
      <ProgressModal open={isLoading} title={"Sending Invite..."} />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        {props.showFormTitle && <h3 className="mb-2">Create Tenant Invite</h3>}
      </Stack>
      <form
        onSubmit={handleSubmitTenantInvite}
        encType="multipart/form-data"
        className="tenant-invite-form"
      >
        <div className="row mb-3">
          {formInputs.map((input, index) => (
            <div className={`col-md-${input.colSpan} mb-2`} key={index}>
              {!input.hidden && (
                <>
                  {input.type === "select" ? (
                    <>
                      <label className="text-black mb-2" htmlFor={input.name}>
                        {input.label}
                      </label>
                      <select
                        name={input.name}
                        className={`form-control ${defaultWhiteInputStyle}`}
                        onChange={input.onChange}
                        onBlur={input.onChange}
                        data-testid={input.dataTestId}
                      >
                        <option value="" disabled selected>
                          {input.placeholder}
                        </option>
                        {input.options.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[input.name] && (
                        <span
                          style={validationMessageStyle}
                          data-testid={input.errorMessageDataTestId}
                        >
                          {errors[input.name]}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <label className="text-black mb-2" htmlFor={input.name}>
                        {input.label}
                      </label>
                      <input
                        type={input.type}
                        name={input.name}
                        className={`form-control ${defaultWhiteInputStyle}`}
                        placeholder={input.placeholder}
                        onChange={input.onChange}
                        onBlur={input.onChange}
                        data-testid={input.dataTestId}
                      />
                      {errors[input.name] && (
                        <span
                          style={validationMessageStyle}
                          data-testid={input.errorMessageDataTestId}
                        >
                          {errors[input.name]}
                        </span>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <UIButton
          dataTestId="invite-tenant-submit-button"
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
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default TenantInviteForm;
