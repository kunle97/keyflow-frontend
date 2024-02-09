import React, { useEffect, useState } from "react";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import PropertyTypes from "./sections/PropertyTypes";
import Pricing from "./sections/Pricing";
import CallToAction from "./sections/CallToAction/CallToAction";
import Blog from "./sections/Blog";
import Testimonials from "./sections/Testimonials";
import Home from "./Home";
import BaseFeatures from "./sections/BaseFeatures";
import { ContactPage } from "@mui/icons-material";
import Contact from "./sections/Contact";

const LandingPage = () => {
  return (
    <Home>
      <Hero />
      <BaseFeatures />
      <Features />
      <PropertyTypes />
      <Pricing />
      {/* <Testimonials /> */}
      <CallToAction />
      {/* <Contact /> */}
      <Blog />
    </Home>
  );
};

export default LandingPage;
