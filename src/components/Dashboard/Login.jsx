import { useState } from "react";
import { authPost, loginPost } from "../../api/apiClient";
import { useNavigate } from "react-router";
import { login, logout } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import AlertModal from "./AlertModal";
import { uiGreen } from "../../constants";
import { Input, Button, Typography } from "@mui/material";
import UIButton from "./UIButton";
const Login = () => {
  const [email, setEmail] = useState("testlandlord3@email.com");
  const [password, setPassword] = useState("password");
  const [errMsg, setErrMsg] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    console.log("Login funtion return value on Login.jsx: ", response);

    //if token is returned, set it in local storage
    if (response.token) {
      //Set authUser and isLoggedIn in context
      localStorage.setItem("accessToken", response.token);
      //Save auth user in local storage
      localStorage.setItem("authUser", JSON.stringify(response.userData));
      setAuthUser(response.userData);
      setIsLoggedIn(true);

      //Navigate to dashboard
      setOpen(true);
    } else {
      setErrMsg(response.message);
    }
    setOpen(true);
  };

  return (
    <div className="container-fluid" style={{ padding: 0 }}>
      {open && (
        <AlertModal
          open={true}
          onClose={() => setOpen(false)}
          title={"Login Successful!"}
          message="You have been logged in Successfully! Click the link below to view your dashboard"
          btnText="Go to Dashboard"
          to="/dashboard"
        />
      )}
      <div className="row">
        <div
          className="col-md-8 d-xs-none d-sm-none d-md-block "
          style={{
            background: "url('/assets/img/login-page-banner.jpg')",
            backgroundSize: "cover",
            height: "100vh",
          }}
        >
          {/* <img style={{width:"100%"}} src="/assets/img/login-page-banner.jpg" /> */}
        </div>
        {/* d-flex justify-content-center */}

        <div className="col-md-4 login-col " style={{paddingTop: "400px", paddingLeft:"100px", paddingRight:"200px"}}>
          <div className="row">
            <div className=" ">
              <img
                style={{ width: "350px", marginBottom: "25px" }}
                src="/assets/img/key-flow-logo-white-transparent.png"
              />
              <form className="user" onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                  <Input
                    className="form-control form-control-user"
                    type="email"
                    id="exampleInputEmail"
                    aria-describedby="emailHelp"
                    placeholder="Enter Email Address..."
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <Input
                    className="form-control form-control-user"
                    type="password"
                    id="exampleInputPassword"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                  <p className="mb-2 text-error w-full text-center text-danger">
                    {errMsg}
                  </p>
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
                    margin: "25px 0"
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
                <a
                  className="small"
                  href="/dashboard/register"
                  style={{ color: uiGreen }}
                >
                  Create an Account!
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
