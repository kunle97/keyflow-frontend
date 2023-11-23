import React from "react";
import Home from "./Home";
import Features from "./sections/Features";

const FeaturesPage = () => {
  return (
    <Home isDarkNav={true}>
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "230px",
        }}
      >
        <Features />
      </div>
    </Home>
  );
};

export default FeaturesPage;
