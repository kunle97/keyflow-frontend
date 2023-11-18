import React from "react";
import Home from "./Home";
import Pricing from "./sections/Pricing";
const PricingPage = () => {
  return (
    <Home isDarkNav={true}>
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "230px",
        }}
      >
        <Pricing />
      </div>
    </Home>
  );
};

export default PricingPage;
