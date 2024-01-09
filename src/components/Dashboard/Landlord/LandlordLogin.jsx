import { useContext, useEffect, useState } from "react";
import { getLandlordsEmails, getLandlordsUsernames } from "../../../api/api";
import { login } from "../../../api/auth";
import { useAuth } from "../../../contexts/AuthContext";
import AlertModal from "../UIComponents/Modals/AlertModal";
import {
  defaultWhiteInputStyle,
  uiGreen,
  uiGrey2,
  validationMessageStyle,
} from "../../../constants";
import { Input, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { useForm } from "react-hook-form";

const LandlordLogin = () => {
  const [email, setEmail] = useState("");
  const [landlordsEmails, setLandlordsEmails] = useState([]);
  const [landlordUsernames, setLandlordUsernames] = useState([]); //TODO: get usernames from db and set here
  const [emailLoginMode, setEmailLoginMode] = useState(true); //Toggle to determine what login credentials to use
  const [errMsg, setErrMsg] = useState();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { setAuthUser, setIsLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [redirectURL, setRedirectURL] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : email,
      password:
        process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : "Password1",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await login(data.email, data.password);

    //if token is returned, set it in local storage
    if (response.token) {
      setRedirectURL("/dashboard/landlord");
      setAuthUser(response.userData);
      setIsLoggedIn(true);
      setIsLoading(false);
      //Navigate to dashboard
      setOpenError(false);
      setOpen(true);
    } else {
      setErrMsg(response.message);
      setIsLoading(false);
      setOpen(false);
      setOpenError(true);
    }
  };

  useEffect(() => {
    getLandlordsEmails().then((res) => {
      if (res) {
        setLandlordsEmails(res);
      }
    });
    getLandlordsUsernames().then((res) => {
      if (res) {
        setLandlordUsernames(res);
      }
    });
  }, []);

  return (
    <div className="container-fluid" style={{ padding: 0, overflow: "hidden" }}>
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
      <div className="row">
        <div
          className="col-md-8 banner-col  d-none d-md-block"
          style={{
            background: "url('/assets/img/login-page-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        ></div>
        <div className="col-md-4 col-sm-12 login-col " style={{}}>
          <div className="row">
            <div className=" ">
              <img
                style={{ width: "60%", marginBottom: "25px" }}
                src="/assets/img/key-flow-logo-black-transparent.png"
              />
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
                        className="form-control card"
                        style={{
                          color: "white !important",
                          marginBottom: "25px",
                          padding: "15px",
                          borderRadius: "10px",
                          background: "white",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      >
                        {landlordsEmails.map((email) => (
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
                          background: uiGrey2,
                          color: "white !important",
                          marginBottom: "25px",
                        }}
                        name="username"
                      >
                        {landlordUsernames.map((username) => (
                          <option value={username}>{username}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div className="mb-3">
                    <input
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
                      style={{
                        ...defaultWhiteInputStyle,
                        padding: "15px",
                        borderRadius: "10px",
                        background: "white",
                      }}
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
                <AlertModal
                  open={openError && errMsg}
                  onClose={() => setErrMsg(null)}
                  title={"Login Failed"}
                  message={errMsg}
                  onClick={() => setErrMsg(null)}
                  btnText="Close"
                />
                <Button
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
                <Link
                  className="small"
                  to="/dashboard/forgot-password/"
                  style={{ color: uiGreen }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  className="small"
                  to="/dashboard/landlord/register"
                  style={{ color: uiGreen }}
                >
                  Create an Account!
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  className="small"
                  to="/dashboard/tenant/login"
                  style={{ color: uiGreen }}
                >
                  Tenant Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordLogin;
