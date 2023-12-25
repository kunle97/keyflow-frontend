import React from "react";
import UICard from "./UICard";
import { Avatar, Stack } from "@mui/material";
import { uiGreen } from "../../../../constants";

const UIInfoCard = (props) => {
  return (
    <UICard cardStyle={props.cardStyle}>
      <Stack
        direction="row"
        spacing={2}
        alignContent={"center"}
        alignItems={"center"}
      >
        <Avatar sx={{ background: uiGreen, width: "60px", height: "60px" }}>
          {props.icon}
        </Avatar>
        <Stack direction="column">
          <p style={{ ...props.titleStyle }}>{props.title}</p>
          <h5 style={{ ...props.infoStyle }}>
            <b>{props.info}</b>
          </h5>
        </Stack>
      </Stack>
    </UICard>
  );
};

export default UIInfoCard;
