import React, { useState } from "react";
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
import BackButton from "./BackButton";

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
    <>
      {" "}
      {props.backButtonURL && props.backButtonPosition === "top" && (
        <BackButton to={props.backButtonURL} />
      )}
      <div
        style={{
          zIndex: "1300000 !important",
          ...props.style,
        }}
      >
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
          <Stack style={{ maxWidth: "100%" }}>
            <h4
              data-testId="page-header-title"
              style={{
                marginBottom: "0px",
                fontSize: "17pt",
                maxWidth:  isMobile ? "250px" : "670px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {props.title}
            </h4>
            <span
              className="text-black"
              data-testId="page-header-subtitle"
              style={{
                maxWidth: isMobile ? "250px" : "450px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                margin: "5px 0",
              }}
            >
              {props.subtitle}
            </span>
            <span
              className="text-black"
              dataTestId="page-header-subtitle-2"
              style={{
                maxWidth: isMobile ? "250px" : "450px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {props.subtitle2}
            </span>
          </Stack>
          {props.menuItems && (
            <>
              <IconButton
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                data-testid="ui-page-header-menu-button"
              >
                <MoreVertIcon />
              </IconButton>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                sx={{ zIndex: 1300 }} // Ensure Popper is on top
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "right top"
                          : "right top",
                    }}
                  >
                    <Paper
                      sx={{
                        borderRadius: "0px",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                        zIndex: "1300000 !important",
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                          sx={{ zIndex: "1300000 !important" }}
                        >
                          {" "}
                          {props.menuItems.map((item, index) => {
                            return (
                              <>
                                {!item.hidden && (
                                  <MenuItem
                                    data-testid={item.dataTestId ? item.dataTestId : `ui-page-header-menu-item-${index}`}
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
      {props.backButtonURL && props.backButtonPosition === "bottom" && (
        <BackButton to={props.backButtonURL} />
      )}
    </>
  );
};

export default UIPageHeader;
