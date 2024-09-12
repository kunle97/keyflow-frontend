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
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import UIButton from "../../UIComponents/UIButton";
import useScreen from "../../../../hooks/useScreen";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import {
  lettersNumbersAndSpecialCharacters,
  uppercaseAndLowercaseLetters,
  validAnyString,
} from "../../../../constants/rexgex";
import { preventPageReload } from "../../../../helpers/utils";
import { getAllUnits, getUnits } from "../../../../api/units";
import { authenticatedInstance } from "../../../../api/api";
import { useNavigate } from "react-router";

const OwnerCreateMaintenanceRequest = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [leaseAgreement, setLeaseAgreement] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [alertRedirectURL, setAlertRedirectURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".create-maintenance-request-form",
      content:
        "This is the maintenance request form. You can create a maintenance request here.",
      disableBeacon: true,
    },
    //Create target using the name as a  selector for the form inputs
    {
      target: "select[name='type']",
      content:
        "Here you can select the type of maintenance request you want to create. For example, if you are having a leaky faucet, you can select plumbing.",
    },
    {
      target: "textarea[name='description']",
      content:
        "Enter a description for the maintenance request. Try to be as detailed as possible. For example, if you are having a leaky faucet, you can describe the location of the faucet and the severity of the leak.",
    },
    {
      target: "#create-maintenance-request-submit-button",
      content:
        "Once you are done click here to create the maintenance request.",
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

  const formInputs = [
    {
      name: "unit",
      label: "Unit",
      type: "select",
      options: units.map((unit) => {
        return {
          value: unit.id,
          label: unit.name + " @ " + unit.rental_property_name,
        };
      }),
      colSpan: 12,
      onChange: (e) => {
        handleChange(e);
        setSelectedUnit(
          units.find((unit) => unit.id === parseInt(e.target.value))
        );
      },
      placeholder: "Unit",
      validations: {
        required: true,
        regex: validAnyString,
        errorMessage: "Please select a unit for the maintenance request",
      },
      dataTestId: "maintenance-unit-select",
      errorMessageDataTestId: "maintenance-unit-error",
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: [
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
        regex: uppercaseAndLowercaseLetters,
        errorMessage: "Please select a type for the maintenance request",
      },
      dataTestId: "maintenance-type-select", 
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
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage:
          "Please enter a valid description for the maintenance request",
      },
      dataTestId: "maintenance-description-textarea",
      errorMessageDataTestId: "maintenance-description-error",
    },
  ];

  //Create a function to handle the form submission
  const onSubmit = () => {
    setIsLoading(true);
    console.log(selectedUnit);
    //Create a data object to send to the backend
    const payload = {
      rental_unit: selectedUnit.id,
      rental_property: selectedUnit.rental_property,
      description: formData.description,
      tenant: selectedUnit.tenant,
      type: formData.type,
      owner: authUser.owner_id,
    };
    console.log(payload);

    createMaintenanceRequest(payload).then((res) => {
      setIsLoading(false);
      console.log("Createa MR RES", res);
      if (res.status !== 400) {
        setResponseMessage(res.message);
        setShowResponseModal(true);
        setAlertRedirectURL(
          "/dashboard/owner/maintenance-requests/" + res.data.data.id
        );
      } else {
        setResponseMessage(res.message);
        setShowResponseModal(true);
      }
    });
  };
  useEffect(() => {
    if (authUser.account_type === "tenant") {
      window.location.href = "/dashboard/tenant/";
    }
    authenticatedInstance.get("/units/?is_occupied=True").then((res) => {
      setUnits(res.data);
    });
  }, []);
  return (
    <>
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
      <div className="container-fluid ">
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
          to={alertRedirectURL}
        />

        <div className="row mb-3">
          <div className="col-sm-12 col-md-12 col-lg-12 ">
            <h3 className="text-black mb-4">Create A Maintenence Request</h3>
            <div className="card shadow mb-5 create-maintenance-request-form">
              <div className="card-body">
                <div className="row" />
                <div className="row" />
                <div className="row">
                  <div className="col-12">
                    <form>
                      {formInputs.map((input, index) => {
                        return (
                          <div
                            className={`col-md-${input.colSpan} mb-3`}
                            key={index}
                            data-testId={`${input.dataTestId}-container`}
                          >
                            <label
                            data-testId={`${input.dataTestId}-label`}
                              className="form-label text-black"
                              htmlFor={input.name}
                            >
                              {input.label}
                            </label>
                            {input.type === "select" ? (
                              <select
                                data-testId={`${input.dataTestId}`}
                                className="form-control"
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}
                              >
                                <option value="" disabled selected>
                                  Select {input.label}
                                </option>
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
                                data-testId={`${input.dataTestId}`}
                                className="form-control"
                                type={input.type}
                                name={input.name}
                                onChange={input.onChange}
                                onBlur={input.onChange}
                                rows={"10"}
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
                          id="create-maintenance-request-submit-button"
                          dataTestId="create-maintenance-request-submit-button"
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
                          btnText="Create Maintenance Request"
                          buttonStyle="btnGreen"
                          style={{
                            width: "100%",
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

      <UIHelpButton onClick={handleClickStart} />
    </>
  );
};

export default OwnerCreateMaintenanceRequest;
