import React, { useState } from "react";
import { useNavigate } from "react-router";
import { set, useForm } from "react-hook-form";
import {
  authUser,
  defaultWhiteInputStyle,
  uiGrey,
  validationMessageStyle,
} from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import { createPortfolio } from "../../../../api/portfolios";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import useScreen from "../../../../hooks/useScreen";
import {
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
const CreatePortfolio = () => {
  const navigate = useNavigate();
  const { isMobile, screenWidth, breakpoints } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [errors, setErrors] = useState({});
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
      name: "name",
      label: "Name",
      type: "text",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Portfolio Name",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a valid name for the portfolio",
      },
      dataTestId: "portfolio-name",
      errorMessageDataTestId: "portfolio-name-error",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      colSpan: 12,
      onChange: (e) => handleChange(e),
      placeholder: "Portfolio Description",
      validations: {
        required: true,
        regex: /^[a-zA-Z0-9\s]*$/,
        errorMessage: "Please enter a valid description for the portfolio",
      },
      dataTestId: "portfolio-description",
      errorMessageDataTestId: "portfolio-description-error",
    },
  ];
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();
  const onSubmit = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      owner: authUser.owner_id,
    };

    console.log(payload);

    createPortfolio(payload)
      .then((res) => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          setAlertTitle("Success");
          setAlertMessage("Portfolio created successfully");
          setOpen(true);
          // navigate("/dashboard/landlord/portfolios");
        } else {
          setAlertTitle("Error");
          setAlertMessage("Error Creating Portfolio");
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertTitle("Error");
        setAlertMessage("Error Creating Portfolio. " + err.message);
      })
      .finally(() => {
        console.log("finally");
      });
  };

  return (
    <div
      className={`${screenWidth > breakpoints.md && "container-fluid "} pt-4`}
    >
      <ProgressModal open={isLoading} title={"Creating Portfolio..."} />
      <AlertModal
        open={open}
        setOpen={setOpen}
        title={alertTitle}
        message={alertMessage}
        btnText={"Ok"}
        onClick={() => navigate("/dashboard/landlord/portfolios")}
      />
      <h4 data-testid="create-portfolio-title">Create Portfolio</h4>
      <div className="card">
        <div className="card-body">
          <form
            data-testid="create-portfolio-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {formInputs.map((input, index) => {
              return (
                <div
                  className={`col-md-${input.colSpan} mb-3`}
                  key={index}
                  data-testId={`${input.dataTestId}`}
                >
                  <label className="form-label text-black" htmlFor={input.name}>
                    {input.label}
                  </label>
                  {input.type === "textarea" ? (
                    <textarea
                      style={{ ...defaultWhiteInputStyle, background: uiGrey }}
                      type={input.type}
                      name={input.name}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      // {...register(input.name, { required: true })}
                    ></textarea>
                  ) : (
                    <input
                      style={{ ...defaultWhiteInputStyle, background: uiGrey }}
                      type={input.type}
                      name={input.name}
                      onChange={input.onChange}
                      onBlur={input.onChange}
                      // {...register(input.name, { required: true })}
                    />
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
            {/*             
            <div className="form-group mb-4">
              <label
                className="text-black"
                data-testid="create-portfolio-name-label"
                htmlFor="name"
              >
                Name
              </label>
              <input
                data-testid="create-portfolio-name-input"
                style={{ ...defaultWhiteInputStyle, background: uiGrey }}
                type="text"
                id="name"
                {...register("name", { required: true })}
              />
              {errors.name && <span>This field is required</span>}
            </div>

            <div className="form-group mb-4">
              <label
                data-testid="create-portfolio-description-label"
                className="text-black"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                data-testid="create-portfolio-description-textarea"
                style={{ ...defaultWhiteInputStyle, background: uiGrey }}
                type="text"
                id="description"
                {...register("description", { required: true })}
              ></textarea>
            </div> */}
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
              style={{ float: "right", width: isMobile ? "100%" : "auto" }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;
