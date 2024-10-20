import React from "react";

const ActivateAccountMessage = () => {
  //Create a message telling the user to check their email for the activation link
  const message =
    "Check your email for the activation link to activate your KeyFlow account.";
  return (
    <div
      className="container-fluid"
      style={{
        height: "100vh",
        background:
          'linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%), url("/assets/img/house9.jpg") center / cover',
      }}
    >
      <div className="row justify-content-center h-100">
        <div className="col-md-6 col-lg-6 col-xl-6 align-self-center h-100">
          <div className="card shadow-lg o-hidden border-0 my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-12  h-100">
                  <div className="p-5">
                    <div className="text-center">
                      <img
                        src="/assets/img/key-flow-logo-black-transparent.png"
                        className="mb-3"
                        width={200}
                        alt="logo"
                      />
                      <h4 className="mb-4">Activate Your Account</h4>
                      <p className="text-black">{message}</p>
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

export default ActivateAccountMessage;
