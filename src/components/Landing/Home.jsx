import React from "react";
import LandingPageNavbar from "./LandingPageNavbar";
import Footer from "./sections/Footer";
const Home = ({ children, isDarkNav }) => {
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ background: "white", minHeight: "100vh" }}>
        <LandingPageNavbar isDarkNav={isDarkNav} />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
