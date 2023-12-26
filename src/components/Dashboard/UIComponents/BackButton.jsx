import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { uiGreen } from "../../../constants";
const BackButton = ({ to, style }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    console.log("Back to ", to);
    if (to !== undefined) {
      navigate(-1);
    } else {
      navigate(to);
    }
  };
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(-1)}
      sx={{ color: uiGreen, textTransform: "none", ...style }}
    >
      Back
    </Button>
  );
};

export default BackButton;
