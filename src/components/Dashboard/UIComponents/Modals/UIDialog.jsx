import React, { useCallback } from "react";
import { Dialog, Slide } from "@mui/material";
import { uiGrey1 } from "../../../../constants";
const UIDialog = ({ children, open, onClose, maxWidth,style }) => {
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
          backgroundColor: uiGrey1,
          boxShadow: "none",
          ...style,
        },
      }}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
    >
      {children}
    </Dialog>
  );
};

export default UIDialog;
