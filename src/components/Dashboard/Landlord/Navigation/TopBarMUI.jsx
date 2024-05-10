import * as React from "react";
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

export default function PrimarySearchAppBar({
  openMenu,
  setShowSearchDialog,
  notificationCount,
  messageCount,
}) {
  let navbarBrandLink = "";
  if (authUser.account_type === "owner") {
    navbarBrandLink = "/dashboard/landlord/";
  } else if (authUser.account_type === "tenant") {
    navbarBrandLink = "/dashboard/tenant/";
  } else if (authUser.account_type === "staff") {
    navbarBrandLink = "/dashboard/staff/";
  }
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigate("/dashboard/messages")}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon sx={{ color: uiGreen }} />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem
        onClick={() =>
          navigate(
            authUser.account_type === "owner"
              ? "/dashboard/notifications"
              : "/dashboard/tenant/notifications"
          )
        }
      >
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
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
            <Link to={navbarBrandLink}>
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
                onClick={() => {
                  navigate(
                    authUser.account_type === "owner"
                      ? "/dashboard/landlord/my-account"
                      : "/dashboard/tenant/my-account"
                  );
                }}
              >
                <PersonIcon sx={{ color: uiGreen }} />
              </IconButton>
            </Box>

            {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
              >
                <PersonIcon sx={{ color: uiGreen }} />
              </IconButton>
            </Box> */}
          </Toolbar>
        </div>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
