import React, { useEffect } from "react";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import PropertyTypes from "./sections/PropertyTypes";
import Pricing from "./sections/Pricing";
import CallToAction from "./sections/CallToAction/CallToAction";
import Home from "./Home";
import BaseFeatures from "./sections/BaseFeatures";
import ReactGA from "react-ga4";
const LandingPage = () => {
  ReactGA.initialize([
    {
      trackingId: "G-Z7X45HF5K6",
    },
  ]);
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, [window.location.pathname]);
  return (
    <Home>
      <Hero />
      <BaseFeatures />
      <Features />
      <PropertyTypes />
      <Pricing />
      <CallToAction />
    </Home>
  );
};

export default LandingPage;
