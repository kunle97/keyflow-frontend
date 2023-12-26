import React, { useCallback } from "react";
import { Dialog, Slide } from "@mui/material";
import { uiGrey1 } from "../../../../constants";
const UIDialog = ({
  children,
  open,
  onClose,
  maxWidth,
  style,
  title,
  bgColor,
}) => {
  const Transition = useCallback(
    React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    }),
    []
  );
  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: bgColor ? bgColor : "white",
          boxShadow: "none",
          padding: "15px",
          color: "white",
          ...style,
        },
      }}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
    >
      <div>
        <h3>{title}</h3>
      </div>
      {children}
    </Dialog>
  );
};

export default UIDialog;
