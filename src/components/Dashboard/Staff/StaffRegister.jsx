import React, { useEffect, useState } from "react";
import { uiGreen } from "../../../constants";
import { faker } from "@faker-js/faker";
import { registerStaff } from "../../../api/auth";
import { Link } from "react-router-dom";
import AlertModal from "../UIComponents/Modals/AlertModal";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { Input, Button, Stack, IconButton } from "@mui/material";
import { validationMessageStyle } from "../../../constants";
import { makeId } from "../../../helpers/utils";
import UIButton from "../UIComponents/UIButton";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import UIStepper from "../UIComponents/UIStepper";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import { useParams } from "react-router-dom";
import { verifyStaffInviteRegistrationCredentials } from "../../../api/staff_invites";
import { useNavigate } from "react-router-dom";
const StaffRegister = () => {
  const navigate = useNavigate();
  const { owner_id, staff_invite_id, approval_hash } = useParams();
  const [open, setOpen] = useState(false);
  const [errorMode, setErrorMode] = useState(false);
  const [stripeRedirectLink, setStripeRedirectLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [successMode, setSuccessMode] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [cardMode, setCardMode] = useState(true);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState(0);
  const [planSelectDialogIsOpen, setPlanSelectDialogIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.firstName()
  );
  const [lastName, setLastName] = useState(
    process.env.REACT_APP_ENVIRONMENT !== "development"
      ? ""
      : faker.person.lastName()
  );

  const [formData, setFormData] = useState({
    first_name: firstName,
    last_name: lastName,
    email:
      process.env.REACT_APP_ENVIRONMENT !== "development"
        ? ""
        : faker.internet.email({ firstName, lastName }),
    username:
      process.env.REACT_APP_ENVIRONMENT !== "development"
        ? ""
        : faker.internet.userName({ firstName, lastName }),
    password: "Password1",
    password_repeat: "Password1",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = triggerValidation(
      name,
      value,
      formInputs.find((input) => input.name === name).validations
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log("Form data ", formData);
    console.log("Errors ", errors);
  };
  const formInputs = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        minLength: 3,
        errorMessage: "Minimum length should be 3 characters",
      },
      dataTestId: "first_name",
      errorMessageDataTestId: "first_name_error",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        minLength: 3,
        errorMessage: "Minimum length should be 3 characters",
      },
      dataTestId: "last_name",
      errorMessageDataTestId: "last_name_error",
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      onChange: (e) => handleChange(e),
      colSpan: 12,
      validations: {
        required: true,
        minLength: 3,
        errorMessage: "Minimum length should be 3 characters",
      },
      dataTestId: "username",
      errorMessageDataTestId: "username_error",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      onChange: (e) => handleChange(e),
      colSpan: 12,
      validations: {
        required: true,
        pattern: /\S+@\S+\.\S+/,
        errorMessage: "Please enter a valid email address",
      },
      dataTestId: "email",
      errorMessageDataTestId: "email_error",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      onChange: (e) => handleChange(e),
      colSpan: 6,
      validations: {
        required: true,
        minLength: 6,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
      dataTestId: "password",
      errorMessageDataTestId: "password_error",
    },
    {
      name: "password_repeat",
      label: "Repeat Password",
      type: "password",
      colSpan: 6,
      onChange: (e) => handleChange(e),

      validations: {
        required: true,
        minLength: 6,
        validate: (val) => {
          if (formData.password != val) {
            return "Your passwords do not match";
          }
        },
      },
      dataTestId: "password_repeat",
      errorMessageDataTestId: "password_repeat_error",
    },
  ];

  //Create handlSubmit() function to handle form submission to create a new user using the API
  const onSubmit = async () => {
    setIsLoading(true);
    let payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      password_repeat: formData.password_repeat,
      owner_id: owner_id,
      activation_token: makeId(32),
      account_type: "staff",
      staff_invite_id: staff_invite_id,
    };

    const response = await registerStaff(payload).then((res) => {
      console.log(res);
      if (res.status === 200) {
        //Show success message
        setErrorMode(false);
        setOpen(true);
        setIsLoading(false);
        navigate(`/dashboard/activate-account/`);
      } else {
        //TODO: Show error message moodal
        setErrorMode(true);
        setOpen(true);
        setIsLoading(false);
      }
    });
  };
  useEffect(() => {
    let payload = {
      owner_id: owner_id,
      approval_hash: approval_hash,
      staff_invite_id: staff_invite_id,
    };
    verifyStaffInviteRegistrationCredentials(payload).then((res) => {
      console.log(res);
      if (res.status == 200) {
        setFormData({
          ...formData,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
        });
      }else{
        navigate(`/*`);
      }
    });
  }, []);
  return (
    <div className="container-fluid" style={{ padding: 0, overflow: "hidden" }}>
      <ProgressModal
        open={isLoading}
        onClose={() => setIsLoading}
        title="Registering Your Account..."
      />
      {open && (
        <>
          {errorMode ? (
            <AlertModal
              open={true}
              onClose={() => setOpen(false)}
              title={"Registration Failed!"}
              message="Registration failed. Please try again"
              btnText="Close"
              to="/dashboard/staff/register"
            />
          ) : (
            <AlertModal
              open={true}
              onClose={() => setOpen(false)}
              title={"Registration Successful!"}
              message="You have been registered Successfully! Be sure to check your email
              for confirmation to activate your account. "
              btnText="Continue"
              confirmCheckbox={true}
              checkboxLabel="I have read and understood the above message"
              to={stripeRedirectLink}
            />
          )}
        </>
      )}

      <div className="row">
        <div
          className="col-md-12"
          style={{
            background: "url('/assets/img/staff-register-page-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ height: "100vh" }}
          >
            <div className="row card py-3">
              <div className=" ">
                <img
                  style={{ maxWidth: "175px", marginBottom: "25px" }}
                  src="/assets/img/key-flow-logo-black-transparent.png"
                /> <h4>Staff Registration</h4>
                <form className="user mt-3">
                  <div className="row">
                    {formInputs.map((input, index) => {
                      return (
                        <div
                          key={index}
                          className={` ${
                            input.colSpan ? `mb-3 col-md-${input.colSpan}` : ""
                          }`}
                        >
                          <div className="form-group  mb-2">
                            <label htmlFor={input.name} className="text-black">
                              {input.label}
                            </label>
                            <input
                              className="form-control"
                              type={input.type}
                              id={input.name}
                              placeholder={input.label}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              name={input.name}
                              value={formData[input.name]}
                            />
                            {errors[input.name] && (
                              <span
                                data-testId={input.errorMessageDataTestId}
                                style={{ ...validationMessageStyle }}
                              >
                                {errors[input.name]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="col-md-12">
                      <UIButton
                        onClick={() => {
                          const { isValid, newErrors } = validateForm(
                            formData,
                            formInputs
                          );
                          if (isValid) {
                            onSubmit();
                          } else {
                            setErrors(newErrors);
                          }
                        }}
                        style={{ width: "100%" }}
                        btnText="Submit"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="my-3">
                <div className="mb-2">
                  <a
                    className="small"
                    href="forgot-password.html"
                    style={{ color: uiGreen }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="mb-2">
                  <Link
                    className="small"
                    to="/dashboard/staff/login"
                    style={{ color: uiGreen }}
                  >
                    Already have an account? Login!
                  </Link>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default StaffRegister;
