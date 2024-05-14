import React, { useState, useRef } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { authUser, uiGreen, uiGrey2 } from "../../../../constants";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { logout } from "../../../../api/auth";
import AlertModal from "../../UIComponents/Modals/AlertModal";

export default function PrimarySearchAppBar({
  openMenu,
  setShowSearchDialog,
  notificationCount,
  messageCount,
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false); // Manage the open state of the Popper
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "primary-search-account-menu";
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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    handleToggle(); // Open the Popper when the profile menu is clicked
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false); // Close the Popper when the menu is closed
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    let returnURL = "/";
    //call logout api
    if (authUser && authUser.account_type === "owner") {
      returnURL = "/dashboard/owner/login";
    } else if (authUser && authUser.account_type === "tenant") {
      returnURL = "/dashboard/tenant/login";
    }
    let response = await logout();
    if (response.status === 200) {
      console.log("User was logged out successfully");
      setOpenLogoutModal(true);
    } else {
      console.error("Error logging user out");
      navigate("/");
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AlertModal
        open={openLogoutModal}
        onClose={() => setOpen(false)}
        title={"Logout Successful!"}
        message="You have been logged Out Successfully! Click the link below to  return to the home page"
        btnText="Return Home"
        to={"/"}
      />
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "white", color: uiGrey2, marginBottom: "20px" }}
      >
        <div className="">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 0 }}
              onClick={openMenu}
            >
              <MenuIcon sx={{ color: uiGreen }} />
            </IconButton>
            <Link
              to={
                authUser.account_type === "owner"
                  ? "/dashboard/owner"
                  : "/dashboard/tenant"
              }
            >
              <img
                src="/assets/img/key-flow-logo-black-transparent.png"
                style={{
                  width: "130px",
                  textAlign: "center",
                  margin: "25px 0",
                }}
                alt="logo"
              />
            </Link>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            ></Typography>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton onClick={() => setShowSearchDialog(true)}>
              <SearchIcon style={{ color: uiGreen }} />
            </IconButton>
            <Box sx={{ display: "flex" }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                onClick={() => {
                  navigate("/dashboard/messages/");
                }}
              >
                <Badge badgeContent={messageCount} color="error">
                  <MailIcon sx={{ color: uiGreen }} />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                onClick={() => {
                  navigate("/dashboard/notifications/");
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon sx={{ color: uiGreen }} />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={(event) => {
                  setAnchorEl(event.currentTarget); // Update the anchorEl when the button is clicked
                  handleToggle();
                }}
                ref={anchorRef} // Assign the ref to the IconButton
              >
                <PersonIcon sx={{ color: uiGreen }} />
              </IconButton>

              <Popper
                open={open && isMenuOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                // placement="bottom-start"
                transition
                disablePortal
                sx={{
                  zIndex: "1",
                }}
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
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem
                            onClick={() => {
                              navigate(
                                authUser.account_type === "owner"
                                  ? "/dashboard/owner/my-account"
                                  : "/dashboard/tenant/my-account"
                              );
                              handleMenuClose(); // Close the Popper after clicking a menu item
                            }}
                          >
                            My Account
                          </MenuItem>
                          <MenuItem
                            onClick={(e) => {
                              handleLogout(e);
                              handleMenuClose(); // Close the Popper after clicking a menu item
                            }}
                          >
                            Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          </Toolbar>
        </div>
      </AppBar>
    </Box>
  );
}
