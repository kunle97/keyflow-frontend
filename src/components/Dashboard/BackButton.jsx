import React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { uiGreen } from "../../constants";
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => {
        navigate(-1);
      }}
      sx={{ color: uiGreen, textTransform: "none"}}
    >
      Back
    </Button>
  );
};

export default BackButton;
