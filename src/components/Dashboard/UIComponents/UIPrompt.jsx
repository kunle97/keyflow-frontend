import { Stack } from "@mui/material";
import React from "react";

const UIPrompt = (props) => {
  return (
    <div className="card">
      <Stack
        direction={"column"}
        alignContent={"center"}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={2}
        sx={{ padding: "5rem 0", ...props.style }}
      >
        <span>{props.icon}</span>
        <h4>{props.title}</h4>
        <p
          style={{
            textAlign: "center",
            padding: "0  10px",
          }}
        >
          {props.message}
        </p>
        <div>{props.body}</div>
      </Stack>
    </div>
  );
};

export default UIPrompt;
