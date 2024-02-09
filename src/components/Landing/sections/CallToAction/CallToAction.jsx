import React, { useState } from "react";

import CallToActionForm from "./CallToActionForm";
const CallToAction = () => {
  return (
    <section
      id="call-to-action"
      className="newsletter-subscribe  landing-section"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.41) 99%), url("/assets/img/landing-page/call-to-action-bg.jpg") center fixed',
          padding: "100px 0",
      }}
    >
      <div className="container">
        <div className="text-center mx-auto">
          <h2 style={{ color: "white" }}>
            Ready to streamline your property management? Request a demo today!
          </h2>
          <p className="text-white">
            Unlock efficiency and freedom in property management today.
            Experience seamless workflows with KeyFlow. Start your journey to
            stress-free management now!
          </p>
        </div>
        <CallToActionForm />
      </div>
    </section>
  );
};

export default CallToAction;
