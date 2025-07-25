import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  authUser,
  defaultWhiteInputStyle,
  uiGrey,
  validationMessageStyle,
} from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import {
  createPortfolio,
  validatePortfolioName,
} from "../../../../api/portfolios";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import useScreen from "../../../../hooks/useScreen";
import {
  hasNoErrors,
  triggerValidation,
  validateForm,
} from "../../../../helpers/formValidation";
import { lettersNumbersAndSpecialCharacters } from "../../../../constants/rexgex";
import { getOwnerSubscriptionPlanData } from "../../../../api/owners";
const CreatePortfolio = () => {
  const navigate = useNavigate();
  const { isMobile, screenWidth, breakpoints } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertRedirect, setAlertRedirect] = useState(null);
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
        // errorMessage: "",
        validate: async (value) => {
          let regex = /^[\s\S]*$/;
          if (!regex.test(value)) {
            //Check errorMessage value in this object
            setErrors((prevErrors) => ({
              ...prevErrors,
              name: "Please enter a valid name for the portfolio. No special characters allowed.",
            }));
            return false;
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              name: "",
            }));
          }
          let payload = {
            name: value,
          };
          await validatePortfolioName(payload).then((res) => {

            if (res.status === 400) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                name: "One of your portfolios already has this name.",
              }));
              return false;
            }
          });
        },
      },
      dataTestId: "create-portfolio-name-input",
      errorMessageDataTestId: "create-portfolio-name-input-error",
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
        regex: lettersNumbersAndSpecialCharacters,
        errorMessage: "Please enter a valid description for the portfolio",
      },
      dataTestId: "create-portfolio-description-textarea",
      errorMessageDataTestId: "create-portfolio-description-textarea-error",
    },
  ];
  const onSubmit = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      owner: authUser.owner_id,
    };



    createPortfolio(payload)
      .then((res) => {
        
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          setAlertTitle("Success");
          setAlertMessage("Portfolio created successfully");
          setOpen(true);
          setAlertRedirect(`/dashboard/owner/portfolios/${res.data.id}`);
        } else {
          setAlertTitle("Error Creating Portfolio");
          setAlertMessage(
            res.message ? res.message : "Error Creating Portfolio: "
          );
          setOpen(true);
        }
      })
      .catch((err) => {

        setAlertTitle("Error Creating Portfolio");
        setAlertMessage(
          err.message ? err.message : "Error Creating Portfolio."
        );
      })
      .finally(() => {

        setIsLoading(false);
      });
  };
  useEffect(() => {
    getOwnerSubscriptionPlanData().then((res) => {

      if(!res.can_use_portfolios){
        setAlertTitle("Subscription Plan Mismatch");
        setAlertMessage("To create a portfolio, you need to upgrade your subscription plan to the Keyflow Owner Standard Plan or higher. ");
        setOpen(true);
      }else{
        setAlertTitle("");
        setAlertMessage("");
        setOpen(false);
      }
    });
     
  },[]);
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
        onClick={() => {
          if (alertRedirect) {
            navigate(alertRedirect);
          }else{
            navigate("/dashboard/owner/portfolios");
          }
          setOpen(false);
        }}
      />
      <h4 data-testid="create-portfolio-title">Create Portfolio</h4>
      <div className="card">
        <div className="card-body">
          <form data-testid="create-portfolio-form">
            {formInputs.map((input, index) => {
              return (
                <div
                  className={`col-md-${input.colSpan} mb-3`}
                  key={index}
                  data-testId={`${input.dataTestId}`}
                >
                  <label className="form-label text-black" htmlFor={input.name}
                    data-testId={`${input.dataTestId}-label`}
                  >
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

            <UIButton
              dataTestId="create-portfolio-submit-button"
              onClick={() => {
                const { isValid, newErrors } = validateForm(
                  formData,
                  formInputs
                );

                if (isValid && hasNoErrors(errors)) {
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
