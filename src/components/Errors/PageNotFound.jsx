import React from "react";
import { uiGreen, uiGrey2 } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const PageNotFound = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };
  return (
    <div class="container-fluid">
      <div class="text-center mt-5">
        <Link to={"/"}>
          <img
            src="/assets/img/key-flow-logo-black-transparent.png"
            style={{ width: "250px", display: "block", margin: "10px auto" }}
          />
        </Link>
        <div class="error mx-auto" data-text="404">
          <p class="m-0" style={{ color: uiGrey2 }}>
            404
          </p>
        </div>
        <p class="text-black mb-5 lead">Page Not Found</p>
        <p class="text-black mb-0">
          It looks like you found a glitch in the matrix...
        </p>
        <Button onClick={handleClick} style={{ color: uiGreen }}>
          ← Back
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
