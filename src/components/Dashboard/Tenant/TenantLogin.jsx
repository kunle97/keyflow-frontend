import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../../api/auth";
import { useAuth } from "../../../contexts/AuthContext";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { uiGreen, uiGrey2 } from "../../../constants";
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
  const { loginUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [redirectURL, setRedirectURL] = useState(null);
  const [email, setEmail] = useState("");
  const [tenantsEmails, setTenantsEmails] = useState([]); //TODO: get usernames from db and set here
  const [tenantsUsernames, setTenantsUsernames] = useState([]); //TODO: get usernames from db and set here
  const [emailLoginMode, setEmailLoginMode] = useState(false); //T
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email:
        process.env.REACT_APP_ENVIRONMENT !== "development"
          ? ""
          : "Kamille86@yahoo.com",
      password:
        process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : "Password1",
    },
  });

  const onSubmit = async (data) => {
    const response = await login(data.email, data.password);
    setIsLoading(true);

    //if token is returned, set it in local storage
    if (response.token) {
      //Set authUser and isLoggedIn in context
      localStorage.setItem("accessToken", response.token);
      //Save auth user in local storage
      localStorage.setItem("authUser", JSON.stringify(response.userData));
      setRedirectURL("/dashboard/tenant");
      setIsLoading(false);
      //Navigate to dashboard
      setOpen(true);
    } else {
      setErrMsg(response.message);
      setIsLoading(false);
    }
  };
  const onJWTSubmit = async (e) => {
    let response = await loginUser(e);
    // console.log(response);
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

      <div className="row">
        <div
          className="col-md-8 banner-col  d-none d-md-block"
          style={{
            background: "url('/assets/img/tenant-login-page-banner-1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "50%",
            height: "100vh",
          }}
        >
          {/* <img style={{width:"100%"}} src="/assets/img/login-page-banner.jpg" /> */}
        </div>
        {/* d-flex justify-content-center */}

        <div className="col-md-4 col-sm-12 login-col " style={{}}>
          <div className="row">
            <div className=" ">
              <img
                style={{ width: "60%", marginBottom: "25px" }}
                src="/assets/img/key-flow-logo-white-transparent.png"
              />
              <Typography color="white" className="mb-4 ml-4">
                Tenant Login
              </Typography>
              <form className="user" onSubmit={onJWTSubmit}>
                {/* <div className="mb-3">
                  <Input
                    {...register("email", {
                      required: "This is a required field",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email",
                      },
                    })}
                    className="form-control form-control-user"
                    type="email"
                    id="exampleInputEmail"
                    aria-describedby="emailHelp"
                    placeholder="Enter Email Address..."
                    name="email"
                  />
                  <span style={validationMessageStyle}>
                    {errors.email && errors.email.message}
                  </span>
                </div> */}
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
                          background: uiGrey2,
                          color: "white !important",
                          marginBottom: "25px",
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      >
                        {tenantsEmails.map((email) => (
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
                  <Input
                    {...register("password", {
                      required: "This is a required field",
                    })}
                    className="form-control form-control-user"
                    sx={{ borderColor: uiGreen }}
                    type="password"
                    id="exampleInputPassword"
                    placeholder="Password"
                    name="password"
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
                        className="form-check-label custom-control-label"
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
