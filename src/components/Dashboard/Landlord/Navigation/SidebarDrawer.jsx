import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  authUser,
  landlordMenuItems,
  tenantMenuItems,
  staffMenuItems,
  uiGreen,
  uiGrey2,
} from "../../../../constants";
import { Link } from "react-router-dom";

export default function SidebarDrawer(props) {
  let menuItems = [];
  // authUser.account_type === "owner" ? landlordMenuItems : tenantMenuItems;
  if (authUser.account_type === "owner") {
    menuItems = landlordMenuItems;
  } else if (authUser.account_type === "staff") {
    menuItems = staffMenuItems;
  } else if (authUser.account_type === "tenant") {
    menuItems = tenantMenuItems;
  }

  const [openSubMenu, setOpenSubMenu] = React.useState(null);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    props.onClose(open);
  };
  const handleMenuItemClick = () => {
    // Close drawer when a regular menu item is clicked
    props.onClose(false);
  };

  const handleSubMenuClick = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
    // event.stopPropagation();
  };

  const renderSubMenu = (subMenuItems) => (
    <List>
      {subMenuItems.map((subItem, subIndex) => (
        <ListItem key={subIndex} disablePadding>
          <Link
            to={subItem.link}
            style={{ width: "100%", textDecoration: "none" }}
          >
            <ListItemButton onClick={() => props.onClose(false)}>
              <ListItemText
                secondary={subItem.label}
                sx={{ fontSize: "5pt", color: "black", marginLeft: "15px" }}
              />
            </ListItemButton>
          </Link>
        </ListItem>
      ))}
    </List>
  );

  const list = (
    <Box
      sx={{
        width: 250,
      }}
      role="presentation"
      // onClick={toggleDrawer(false)}
      // onKeyDown={toggleDrawer(false)}
    >
      <Box>
        <img
          src="/assets/img/key-flow-logo-black-transparent.png"
          style={{ width: "175px", textAlign: "center", margin: "25px" }}
          alt="logo"
        />
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <>
            {!item.hidden && (
              <div key={index}>
                {item.subMenuItems ? (
                  <div>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleSubMenuClick(index)}>
                        <ListItemIcon>{item.muiIcon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                        {openSubMenu === index ? (
                          <ExpandMoreIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {openSubMenu === index && renderSubMenu(item.subMenuItems)}
                  </div>
                ) : (
                  <ListItem disablePadding>
                    <Link
                      to={item.link}
                      style={{ width: "100%", textDecoration: "none" }}
                    >
                      <ListItemButton onClick={handleMenuItemClick}>
                        <ListItemIcon sx={{ color: uiGreen }}>
                          {item.muiIcon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          sx={{ color: "black" }}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                )}
              </div>
            )}{" "}
          </>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer anchor={"left"} open={props.open} onClose={toggleDrawer(false)}>
      {list}
    </Drawer>
  );
}
