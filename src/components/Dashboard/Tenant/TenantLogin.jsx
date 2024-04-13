import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { login } from "../../../api/auth";
import AuthContext, { useAuth } from "../../../contexts/AuthContext";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { uiGreen, uiGrey2, defaultWhiteInputStyle } from "../../../constants";
import { Input, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../constants";
import { getTenantsEmails, getTenantsUsernames } from "../../../api/api";
const TenantLogin = () => {
  const [errMsg, setErrMsg] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [redirectURL, setRedirectURL] = useState(null);
  const [email, setEmail] = useState("");
  const [tenantsEmails, setTenantsEmails] = useState([]); //TODO: get usernames from db and set here
  const [tenantsUsernames, setTenantsUsernames] = useState([]); //TODO: get usernames from db and set here
  const [emailLoginMode, setEmailLoginMode] = useState(true); //T
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : email,
      password:
        process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : "Password1",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await login(data.email, data.password);
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
      setErrMsg(response.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

      <div
        className="row"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%),url('/assets/img/tenant-login-page-banner-1.jpg')",
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
              <form className="user" onSubmit={handleSubmit(onSubmit)}>
                {process.env.REACT_APP_ENVIRONMENT === "development" ? (
                  <div>
                    {emailLoginMode ? (
                      <select
                        {...register("email", {
                          required: "This is a required field",
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Please enter a valid email address",
                          },
                        })}
                        data-testid="email-select"
                        className="form-control card"
                        style={{
                          background: uiGrey2,
                          color: "white !important",
                          marginBottom: "25px",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      >
                        {tenantsEmails.map((email, index) => (
                          <option value={email}>{email}</option>
                        ))}
                      </select>
                    ) : (
                      <select
                        {...register("username", {
                          required: "This is a required field",
                        })}
                        className="form-control card"
                        style={{
                          background: "white",
                          color: "black",
                          marginBottom: "25px",
                        }}
                        name="username"
                      >
                        {tenantsUsernames.map((username) => (
                          <option value={username}>{username}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div className="mb-3">
                    <Input
                      input
                      {...register("email", {
                        required: "This is a required field",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className="form-control form-control-user"
                      type="email"
                      id="exampleInputEmail"
                      aria-describedby="emailHelp"
                      placeholder="Enter Email Address..."
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <span style={validationMessageStyle}>
                      {errors.email && errors.email.message}
                    </span>
                  </div>
                )}
                <div className="mb-3">
                  <input
                    {...register("password", {
                      required: "This is a required field",
                    })}
                    data-testid="password-input"
                    className="form-control-user"
                    sx={{ borderColor: uiGreen }}
                    type="password"
                    id="exampleInputPassword"
                    placeholder="Password"
                    style={{
                      ...defaultWhiteInputStyle,
                      border: "none",
                      padding: "15px",
                      borderRadius: "10px",
                      backgroundColor: "#f4f7f8",
                    }}
                  />
                  <span style={validationMessageStyle}>
                    {errors.password && errors.password.message}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="custom-control custom-checkbox small">
                    <div className="form-check">
                      <input
                        className="form-check-input custom-control-input"
                        type="checkbox"
                        id="formCheck-1"
                      />
                      <label
                        className="form-check-label custom-control-label text-black"
                        htmlFor="formCheck-1"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>
                </div>
                {errMsg && (
                  <AlertModal
                    open={true}
                    onClose={() => setErrMsg(null)}
                    onClick={() => setErrMsg(null)}
                    title={"Login Failed!"}
                    message={errMsg}
                    btnText="Close"
                  />
                )}
                <Button
                  data-testid="login-button"
                  className="d-block w-100 ui-btN"
                  type="submit"
                  style={{
                    backgroundColor: uiGreen,
                    textTransform: "none",
                    padding: "10px",
                    fontSize: "12pt",
                    fontWeight: "lighter",
                    margin: "25px 0",
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
                  to="/dashboard/landlord/login"
                  style={{ color: uiGreen }}
                >
                  Landlord Login
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
