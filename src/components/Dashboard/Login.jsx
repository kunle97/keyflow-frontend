import React from "react";

const Login = () => {
  return (
    <div className="container">
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
                    <form className="user">
                      <div className="mb-3">
                        <input
                          className="form-control form-control-user"
                          type="email"
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          placeholder="Enter Email Address..."
                          name="email"
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          className="form-control form-control-user"
                          type="password"
                          id="exampleInputPassword"
                          placeholder="Password"
                          name="password"
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
