import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { uiGreen, uiGrey2 } from "../../../../constants";
import { Button, Modal } from "@mui/material";

const LeaseTemplateSelector = (props) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  return (
    <Modal open={props.open}>
      <div className="card" style={modalStyle}>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            maxHeight: 500,
            overflow: "auto",
            bgcolor: uiGrey2,
            color: "white",
          }}
        >
          {props.data.map((leaseTemplate) => {
            return (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="12 Month Lease @ $1500.00/month"
                    secondary={
                      <React.Fragment>
                        <h6 style={{ fontSize: "10pt" }}>
                          Security Deposit: ${leaseTemplate.security_deposit}.
                          Late Fee: ${leaseTemplate.late_fee}
                        </h6>
                        <div style={{ overflow: "auto" }}>
                          <div style={{ color: "white", float: "left" }}>
                            <p className="m-0">Gas Included</p>
                            <p className="m-0">Electric Included</p>
                            <p className="m-0">Water Not Included</p>
                          </div>
                          <Button
                            onClick={props.onSelect(leaseTemplate.id)}
                            sx={{
                              background: uiGreen,
                              color: "white",
                              textTransform: "none",
                              float: "right",
                              marginTop: "10px",
                            }}
                            variant="container"
                            className="ui-btn"
                          >
                            Select
                          </Button>
                        </div>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            );
          })}
          <ListItem alignItems="flex-start">
            <ListItemText
              primary="12 Month Lease @ $1500.00/month"
              secondary={
                <React.Fragment>
                  <h6 style={{ fontSize: "10pt" }}>
                    Security Deposit: $Late Fee: $
                  </h6>
                  <div style={{ overflow: "auto" }}>
                    <div style={{ color: "white", float: "left" }}>
                      <p className="m-0">Gas Included</p>
                      <p className="m-0">Electric Included</p>
                      <p className="m-0">Water Not Included</p>
                    </div>
                    <Button
                      sx={{
                        background: uiGreen,
                        color: "white",
                        textTransform: "none",
                        float: "right",
                        marginTop: "10px",
                      }}
                      variant="container"
                      className="ui-btn"
                    >
                      Select
                    </Button>
                  </div>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </div>
    </Modal>
  );
};

export default LeaseTemplateSelector;
