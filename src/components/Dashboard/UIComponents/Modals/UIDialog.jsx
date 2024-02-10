import React, { useCallback } from "react";
import { Dialog, Slide, Stack } from "@mui/material";
import { uiGreen, uiGrey1 } from "../../../../constants";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import useScreen from "../../../../hooks/useScreen";
const UIDialog = ({
  children,
  open,
  onClose,
  maxWidth,
  style,
  title,
  bgColor,
  dataTestId,
}) => {
  const { isMobile } = useScreen();
  const Transition = useCallback(
    React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    }),
    []
  );
  return (
    <Dialog
      data-testId={dataTestId}
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          alignContent={"center"}
          sx={{ marginBottom: "5px" }}
        >
          <h3
            style={{
              fontSize: isMobile ? "12pt" : "15pt",
            }}
            data-testid="ui-dialog-title"
          >
            {title}
          </h3>
          <IconButton
            data-testid="ui-dialog-close-button"
            onClick={onClose}
            style={{ float: "right", color: uiGreen }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </div>
      {children}
    </Dialog>
  );
};

export default UIDialog;
