import { useState } from "react";
import { authPost, loginPost } from "../../api/apiClient";
import { useNavigate } from "react-router";
import { login, logout } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import AlertModal from "./AlertModal";
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
      console.log(
        "Local storage Access token",
        localStorage.getItem("accessToken")
      );
      console.log(
        "Local storage User Data",
        localStorage.getItem("authUser")
      );
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
    <div className="container">
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
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-6 col-xl-10">
          <div className="card shadow-lg o-hidden border-0 my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <h4
                        className="text-light mb-4"
                        style={{ color: "rgb(255,255,255)" }}
                      >
                        Login
                      </h4>
                    </div>
                    <form className="user" onSubmit={(e) => handleSubmit(e)}>
                      <div className="mb-3">
                        <input
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
                        <input
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
                      <button
                        className="btn btn-primary d-block btn-user w-100 ui-btn"
                        type="submit"
                      >
                        Login
                      </button>
                    </form>
                    <div className="text-center">
                      <a
                        className="small"
                        href="forgot-password.html"
                        style={{ color: "#3aaf5c" }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="text-center">
                      <a
                        className="small"
                        href="register.html"
                        style={{ color: "#3aaf5c" }}
                      >
                        Create an Account!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
