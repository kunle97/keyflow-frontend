import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import { uiGreen } from "../../../constants";
const BackButton = ({ to, style }) => {
  const navigate = useNavigate();
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
