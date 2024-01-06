import { useState, useEffect } from "react";

const useScreen = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const breakpoints = {
    xm: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  };

  const handleScroll = () => {
    const currentPosition = window.pageYOffset;
    setScrollPosition(currentPosition);
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const isMobile = screenWidth < breakpoints.md;

  useEffect(() => {
    console.log(screenWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { scrollPosition, screenWidth, breakpoints, isMobile };
};

export default useScreen;
