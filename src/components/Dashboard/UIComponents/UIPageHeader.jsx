import React, { useState, useRef } from "react";
import { Stack } from "@mui/material";
import {
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import useScreen from "../../../hooks/useScreen";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const UIPageHeader = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const { isMobile } = useScreen();
  // Dropdown
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      style={{
        zIndex: "1000000000000000000",
      }}
    >
      {" "}
      {props.headerImageSrc && (
        <div
          data-testid="media-header-container"
          style={{
            width: "100%",
            height: isMobile ? "200px" : "320px",
            //Vertical center the image
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            marginBottom: "10px",
          }}
          className="card"
        >
          <img
            data-testid="media-header-image"
            src={props.headerImageSrc}
            style={{
              width: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        alignContent={{ xs: "center", sm: "flex-start" }}
      >
        <div className="header">
          <h4
            data-testId="header-title"
            style={{ marginBottom: "0px", fontSize: "17pt" }}
          >
            {props.title}
          </h4>
          <span className="text-black" data-testId="unit-tenant">
            {props.subtitle}
          </span>
          <span>{props.subtitle2}</span>
        </div>
        {props.menuItems && (
          <>
            <IconButton
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <MoreVertIcon />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              sx={{
                zIndex: "1000000000000000000",
              }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "right top" : "right top",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        {" "}
                        {props.menuItems.map((item, index) => {
                          return (
                            <>
                              {!item.hidden && (
                                <MenuItem
                                  key={index}
                                  onClick={() => {
                                    item.action();
                                  }}
                                >
                                  {item.label}
                                </MenuItem>
                              )}
                            </>
                          );
                        })}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        )}
      </Stack>
    </div>
  );
};

export default UIPageHeader;
