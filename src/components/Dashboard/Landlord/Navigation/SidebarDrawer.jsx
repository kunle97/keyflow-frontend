import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import { landlordMenuItems, uiGrey1 } from "../../../../constants";
import { Link } from "react-router-dom";

export default function SidebarDrawer(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
        background: uiGrey1,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box>
        <img
          src="/assets/img/key-flow-logo-white-transparent.png"
          style={{ width: "175px", textAlign: "center", margin: "25px" }}
        />
      </Box>
      <List>
        {landlordMenuItems.map((item, index) => {
          return (
            <ListItem key={index} disablePadding>
              <Link
                to={item.link}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <i className={item.icon} />
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ color: "white" }} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
        {/* <ListItem disablePadding>
          <Link
            to={"/dashboard/"}
            style={{ width: "100%", textDecoration: "none" }}
          >
            <ListItemButton>
              <ListItemIcon>
                <DashboardOutlinedIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} sx={{ color: "white" }} />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Link
            to={"/dashboard/properties"}
            style={{ width: "100%", textDecoration: "none" }}
          >
            <ListItemButton>
              <ListItemIcon>
                <MapsHomeWorkOutlinedIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary={"Properties"} sx={{ color: "white" }} />
            </ListItemButton>
          </Link>
        </ListItem> */}
        {/* {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="buttonx">
      {["left", "left", "left", "left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            sx={{ marginTop: "150px" }}
            onClick={toggleDrawer(anchor, true)}
          >
            {anchor}
          </Button>
          <Drawer
            anchor={"left"}
            open={props.open}
            onClose={toggleDrawer(anchor, false)}
            // sx={{ "& .MuiDrawer-paper": { backgroundColor: uiGrey1 } }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
