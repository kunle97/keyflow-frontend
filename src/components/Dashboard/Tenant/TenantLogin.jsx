import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { login } from "../../../api/auth";
import AuthContext, { useAuth } from "../../../contexts/AuthContext";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { uiGreen, uiGrey, defaultWhiteInputStyle } from "../../../constants";
import { Input, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { validationMessageStyle } from "../../../constants";
import { getTenantsEmails, getTenantsUsernames } from "../../../api/api";
import {
  triggerValidation,
  validateForm,
} from "../../../helpers/formValidation";
import UICheckbox from "../UIComponents/UICheckbox";
const TenantLogin = () => {
  const [errMsg, setErrMsg] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [redirectURL, setRedirectURL] = useState(null);
  const [email, setEmail] = useState("");
  const [tenantsEmails, setTenantsEmails] = useState([]); //TODO: get usernames from db and set here
  const [tenantsUsernames, setTenantsUsernames] = useState([]); //TODO: get usernames from db and set here
  const [emailLoginMode, setEmailLoginMode] = useState(true); //T
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    password:
      process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : "Password1",
  });

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
    console.log("Remember me state varaianble", rememberMe);
  };

  const handleChange = (e, formInputs) => {
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

  const passwordInput = [
    {
      name: "password",
      label: "Password",
      type: "password",
      colSpan: 12,
      onChange: (e) => handleChange(e, passwordInput),
      placeholder: "Password",
      validations: {
        required: true,
        errorMessage: "Password must not be blank",
        //Create a regex patern to check that the field is not empty
        regex: /\S/,
      },
      dataTestId: "password",
      errorMessageDataTestId: "password-error",
    },
  ];

  const textformInputs = [
    {
      name: "email",
      label: "Email",
      type: "email",
      colSpan: 12,
      onChange: (e) => handleChange(e, textformInputs),
      placeholder: "Email",
      validations: {
        required: true,
        regex: /\S+@\S+\.\S+/,
        errorMessage: "Please enter a valid email address",
      },
      dataTestId: "email",
      errorMessageDataTestId: "email-error",
    },
  ];

  const selectFormInputs = [
    {
      name: "email",
      label: "Email",
      type: "select",
      colSpan: 12,
      onChange: (e) => handleChange(e, selectFormInputs),
      options: tenantsEmails,
      placeholder: "Email",
      validations: {
        required: true,
        regex: /\S+@\S+\.\S+/,
        errorMessage: "Please enter a valid email address",
      },
      dataTestId: "email",
      errorMessageDataTestId: "email-error",
    },
  ];

  const onSubmit = async (e) => {
    setIsLoading(true);
    let payload = {
      email: formData.email,
      password: formData.password,
      remember_me: rememberMe,
    };
    const response = await login(payload);
    //if token is returned, set it in local storage
    if (response.token) {
      //Set authUser and isLoggedIn in context
      // localStorage.setItem("accessToken", response.token);
      //Save auth user in local storage
      // localStorage.setItem("authUser", JSON.stringify(response.userData));
      setRedirectURL("/dashboard/tenant");
      setAuthUser(response.userData);
      setIsLoggedIn(true);
      setIsLoading(false);
      //Navigate to dashboard
      setOpen(true);
    } else {
      console.log("Login Error: ", response);
      setErrMsg(response.message);
      setOpenError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (process.env.REACT_APP_ENVIRONMENT === "development") {
      getTenantsEmails().then((res) => {
        if (res) {
          setTenantsEmails(res);
        }
      });
      getTenantsUsernames().then((res) => {
        if (res) {
          setTenantsUsernames(res);
        }
      });
    }
  }, []);

  return (
    <div
      className="container-fluid "
      style={{ padding: 0, overflow: "hidden" }}
    >
      <ProgressModal
        open={isLoading}
        handleCLose={() => setIsLoading(false)}
        title="Logging you in..."
      />

      <AlertModal
        open={open}
        onClose={() => setOpen(false)}
        title={"Login Successful!"}
        message="You have been logged in Successfully! Click the link below to view your dashboard"
        btnText="Go to Dashboard"
        to={redirectURL}
      />
      <AlertModal
        dataTestId="error-modal"
        className="error-modal"
        open={openError && errMsg}
        onClose={() => setErrMsg(null)}
        title={"Login Failed"}
        message={errMsg}
        onClick={() => setErrMsg(null)}
        btnText="Close"
      />
      <div
        className="row"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%),url('/assets/img/tenant-login-page-banner-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "50%",
          height: "100vh",
        }}
      >
        <div className="col-md-4 offset-md-4 d-flex justify-content-center align-items-center">
          <div className="card">
            <div className="card-body">
              <img
                data-testid="keyflow-black-logo"
                style={{ maxWidth: "170px", marginBottom: "25px" }}
                src="/assets/img/key-flow-logo-black-transparent.png"
              />
              <Typography color="black" className="mb-4 ml-4">
                Tenant Login
              </Typography>
              <form className="user" onSubmit={onSubmit}>
                {process.env.REACT_APP_ENVIRONMENT === "development" ? (
                  <div>
                    {selectFormInputs.map((input, index) => {
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
                              style={{
                                ...defaultWhiteInputStyle,
                                background: uiGrey,
                              }}
                              type={input.type}
                              name={input.name}
                              onChange={input.onChange}
                              onBlur={input.onChange}
                              value={formData[input.name]}
                            >
                              <option value="" disabled selected>
                                Select an Email
                              </option>
                              {input.options.map((option, index) => {
                                return (
                                  <option key={index} value={option}>
                                    {option}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <input
                              style={{
                                ...defaultWhiteInputStyle,
                                background: uiGrey,
                              }}
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
                  </div>
                ) : (
                  <div className="mb-3">
                    {textformInputs.map((input, index) => {
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
                          <input
                            style={{
                              ...defaultWhiteInputStyle,
                              background: uiGrey,
                            }}
                            type={input.type}
                            name={input.name}
                            onChange={input.onChange}
                            onBlur={input.onChange}
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
                      );
                    })}
                  </div>
                )}

                {passwordInput.map((input, index) => {
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
                      <input
                        style={{
                          ...defaultWhiteInputStyle,
                          background: uiGrey,
                        }}
                        type={input.type}
                        name={input.name}
                        onChange={input.onChange}
                        onBlur={input.onChange}
                        value={formData[input.name]}
                        // {...register(input.name, { required: true })}
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
                  );
                })}
                <div className="mb-3">
                  <span>
                    {" "}
                    <UICheckbox
                      checked={rememberMe}
                      onChange={handleCheckboxChange}
                      label="Remember Me"
                    />
                  </span>
                </div>

                <Button
                  data-testid="login-button"
                  className="d-block w-100 ui-btN"
                  type="button"
                  style={{
                    backgroundColor: uiGreen,
                    textTransform: "none",
                    padding: "10px",
                    fontSize: "12pt",
                    fontWeight: "lighter",
                    margin: "25px 0",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const {
                      isValid: textEmailIsValid,
                      newErrors: textNewErrors,
                    } = validateForm(formData, textformInputs);
                    const {
                      isValid: selectEmailIsValid,
                      newErrors: selectNewErrors,
                    } = validateForm(formData, selectFormInputs);
                    const {
                      isValid: passwordIsValid,
                      newErrors: passwordNewErrors,
                    } = validateForm(formData, passwordInput);
                    if (process.env.REACT_APP_ENVIRONMENT === "development") {
                      if (selectEmailIsValid && passwordIsValid) {
                        setIsLoading(true);
                        onSubmit();
                      } else {
                        //Add selectNewErrors and passwordNewErrors to the errors object
                        setErrors({
                          ...selectNewErrors,
                          ...passwordNewErrors,
                        });
                      }
                    } else {
                      if (textEmailIsValid && passwordIsValid) {
                        setIsLoading(true);
                        onSubmit();
                      } else {
                        //Add textNewErrors and passwordNewErrors to the errors object
                        setErrors({ ...textNewErrors, ...passwordNewErrors });
                      }
                    }
                  }}
                  variant="contained"
                >
                  Login
                </Button>
              </form>
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
                  to="/dashboard/owner/login"
                  style={{ color: uiGreen }}
                >
                  Owner Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantLogin;
