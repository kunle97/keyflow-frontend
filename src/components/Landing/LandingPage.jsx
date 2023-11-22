import React, { useEffect, useState } from "react";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import PropertyTypes from "./sections/PropertyTypes";
import Pricing from "./sections/Pricing";
import CallToAction from "./sections/CallToAction";
import Blog from "./sections/Blog";
import Testimonials from "./sections/Testimonials";
import Home from "./Home";

const LandingPage = () => {

  return (
    <Home>
      <Hero />
      <Features />
      <PropertyTypes />
      <Pricing />
      {/* <Testimonials /> */}
      {/* <Blog /> */}
      <CallToAction />
    </Home>
  );
};

export default LandingPage;
