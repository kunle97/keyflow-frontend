import { useState } from "react";
import { useNavigate } from "react-router";
import { login, logout } from "../../../api/api";
import { useAuth } from "../../../contexts/AuthContext";
import AlertModal from "../UIComponents/Modals/AlertModal";
import { uiGreen, validationMessageStyle } from "../../../constants";
import { Input, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ProgressModal from "../UIComponents/Modals/ProgressModal";
import { useForm } from "react-hook-form";
const LandlordLogin = () => {
  const [email, setEmail] = useState("Madalyn_Murray@gmail.com");
  const [password, setPassword] = useState("password");
  const [errMsg, setErrMsg] = useState();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const navigate = useNavigate();
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
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
          : "Madalyn_Murray@gmail.com",
      password:
        process.env.REACT_APP_ENVIRONMENT !== "development" ? "" : "Password1",
    },
  });
  const onSubmit = async (data) => {
    console.log(data);
    const response = await login(data.email, data.password);
    setIsLoading(true);

    //if token is returned, set it in local storage
    if (response.token) {
      //Set authUser and isLoggedIn in context
      localStorage.setItem("accessToken", response.token);
      //Save auth user in local storage
      localStorage.setItem("authUser", JSON.stringify(response.userData));
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
            background: "url('/assets/img/login-page-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
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
              <form className="user" onSubmit={handleSubmit(onSubmit)}>
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
