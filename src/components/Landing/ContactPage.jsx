import React from "react";
import Home from "./Home";
import Contact from "./sections/Contact";
export const ContactPage = () => {
  return (
    <>
      <Home isDarkNav={true}>
        <Contact />
      </Home>
    </>
  );
};
