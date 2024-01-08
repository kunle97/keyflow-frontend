import { ListItem, ListItemText, Stack, Typography } from "@mui/material";
import React from "react";
import UISwitch from "./UISwitch";

const UIPreferenceRow = (props) => {
  return (
    <div>
      <ListItem
        style={{
          borderRadius: "10px",
          background: "white",
          margin: "10px 0",
          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <ListItemText
            primary={
              <Typography sx={{ color: "black" }}>{props.title}</Typography>
            }
            secondary={<React.Fragment>{props.description}</React.Fragment>}
          />
          <UISwitch onChange={props.onChange} />
        </Stack>
      </ListItem>
    </div>
  );
};

export default UIPreferenceRow;
