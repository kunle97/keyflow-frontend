import React from "react";
import Switch from "@mui/material/Switch";
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  customSwitch: {
    "& .MuiSwitch-thumb": {
      backgroundColor: "#3aaf5c !important",
    },
    "& .Mui-checked": {
      color: "#3aaf5c !important",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#3aaf5c !important",
      opacity: 1, // Default opacity
    },
    "& .Mui-disabled .MuiSwitch-thumb": {
      backgroundColor: "#ccc", // Color when disabled
    },
  },
});
const UISwitch = withStyles(styles)(({ classes, ...props }) => (
  <Switch {...props} classes={{ root: classes.customSwitch }} />
));

export default UISwitch;
