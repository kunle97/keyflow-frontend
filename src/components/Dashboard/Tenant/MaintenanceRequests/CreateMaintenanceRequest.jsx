import React, { useEffect, useState } from "react";
import { createMaintenanceRequest } from "../../../../api/maintenance_requests";
import { getTenantDashboardData } from "../../../../api/tenants";
import {
  authUser,
  uiGreen,
  uiGrey,
  validationMessageStyle,
} from "../../../../constants";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import UIPrompt from "../../UIComponents/UIPrompt";
import DescriptionIcon from "@mui/icons-material/Description";
import { triggerValidation, validateForm } from "../../../../helpers/formValidation";
import UIButton from "../../UIComponents/UIButton";
import useScreen from "../../../../hooks/useScreen";

const CreateMaintenanceRequest = () => {
  const [unit, setUnit] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {isMobile } = useScreen();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: newErrors[name] }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };

  const formInputs = [
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "", label: "Select One" },
        { value: "plumbing", label: "Plumbing" },
        { value: "electrical", label: "Electrical" },
        { value: "structural", label: "Structural" },
        { value: "appliance", label: "Appliance" },
        { value: "other", label: "Other" },
      ],

      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Type",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please select a type for the maintenance request",
      },
      dataTestId: "maintenance-type",
      errorMessageDataTestId: "maintenance-type-error",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Description",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage:
          "Please enter a valid description for the maintenance request",
      },
      dataTestId: "maintenance-description",
      errorMessageDataTestId: "maintenance-description-error",
    },
  ];

  useEffect(() => {
    //Retrieve the unit
    getTenantDashboardData().then((res) => {
      console.log(res);
      setUnit(res.unit);
      setLeaseAgreement(res.lease_agreement);
    });
  }, []);



  //Create a function to handle the form submission
  const onSubmit = () => {
    setIsLoading(true);
    //Create a data object to send to the backend
    const payload = {
      rental_unit: unit.id,
      rental_property: unit.rental_property,
      description: formData.description,
      tenant: authUser.tenant_id,
      type: formData.type,
      owner: leaseAgreement.owner.id,
    };
    console.log("Payload", payload);
    createMaintenanceRequest(payload).then((res) => {
      setIsLoading(false);
      console.log(res);
      if (res.status !== 400) {
        setResponseMessage(res.message);
        setShowResponseModal(true);
        console.log(res.message);
      } else {
        setResponseMessage(res.message);
        setShowResponseModal(true);
        console.log(responseMessage);
      }
    });
  };

  return (
    <>
      {leaseAgreement ? (
        <div className="container-fluid">
          <ProgressModal
            open={isLoading}
            handleClose={() => setIsLoading(false)}
            title="Creating Maintenance Request..."
          />
          <AlertModal
            open={showResponseModal}
            handleClose={() => setShowResponseModal(false)}
            title="Maintenance Request"
            message={responseMessage}
            btnText="Okay"
            to="/dashboard/tenant/maintenance-requests"
          />

          <div className="row mb-3">
            <div className="col-sm-12 col-md-8 col-lg-8 offset-sm-0 offset-md-2 offset-lg-2">
              <h3 className="text-black mb-4">Create A Maintenance Request</h3>
              <div className="card shadow mb-5">
                <div className="card-body">
                  <div className="row" />
                  <div className="row" />
                  <div className="row">
                    <div className="col-12">
                      <form >
                        {formInputs.map((input, index) => {
                          return (
                            <div
                              className={`col-md-${input.colSpan} mb-3`}
                              key={index}
                              data-testId={`${input.dataTestId}`}
                            >
                              <label
                                className="form-label text-black"
                                htmlFor={input.name}
                              >
                                {input.label}
                              </label>
                              {input.type === "select" ? (
                                <select
                                  className="form-control"
                                  name={input.name}
                                  onChange={input.onChange}
                                  onBlur={input.onChange}
                                >
                                  {input.options.map((option, index) => {
                                    return (
                                      <option key={index} value={option.value}>
                                        {option.label}
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : (
                                <textarea
                                  style={{
                                    ...validationMessageStyle,
                                    background: uiGrey,
                                  }}
                                  className="form-control"
                                  type={input.type}
                                  name={input.name}
                                  onChange={input.onChange}
                                  onBlur={input.onChange}
                                  // {...register(input.name, { required: true })}
                                ></textarea>
                              )}
                              {errors[input.name] && (
                                <span
                                  data-testId={input.errorMessageDataTestId}
                                  style={{ ...validationMessageStyle }}
                                >
                                  {errors[input.name]}
                                </span>
                              )}
                            </div>
                          );
                        })}
                        <div className="mb-3">
                          <UIButton
                            dataTestId="create-portfolio-submit-button"
                            onClick={() => {
                              const { isValid, newErrors } = validateForm(
                                formData,
                                formInputs
                              );
                              if (isValid) {
                                setIsLoading(true);
                                onSubmit();
                              } else {
                                setErrors(newErrors);
                              }
                            }}
                            btnText="Create"
                            buttonStyle="btnGreen"
                            style={{
                              float: "right",
                              width: isMobile ? "100%" : "auto",
                            }}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <UIPrompt
          icon={<DescriptionIcon sx={{ fontSize: 45, color: uiGreen }} />}
          title="No Active Lease Agreement"
          message="You need to have an active lease agreement to create a maintenance requests."
          btnText="Okay"
        />
      )}
    </>
  );
};

export default CreateMaintenanceRequest;
