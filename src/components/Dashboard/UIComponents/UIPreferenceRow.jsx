import { ListItem, ListItemText, Stack, Typography } from "@mui/material";
import React from "react";
import UISwitch from "./UISwitch";

const UIPreferenceRow = (props) => {
  const inputStyle = {
    maxWidth: "100px",
  };
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
            data-testId={
              props.dataTestId
                ? props.dataTestId + "-label"
                : "preference-row-label"
            }
            primary={
              <Typography sx={{ color: "black" }}>{props.title}</Typography>
            }
            secondary={<React.Fragment>{props.description}</React.Fragment>}
          />
          {props.type === "switch" && (
            <UISwitch
              onChange={props.onChange}
              value={props.value}
              data-testId={
                props.dataTestId
                  ? props.dataTestId + "-switch"
                  : "preference-row-switch"
              }
            />
          )}
          {props.type === "number" && (
            <input
              data-testId={
                props.dataTestId
                  ? props.dataTestId + "-input"
                  : "preference-row-input"
              }
              className="form-control"
              type="number"
              onChange={props.onChange}
              style={inputStyle}
              defaultValue={props.value}
              min="0"
            />
          )}
          {props.type === "text" && (
            <input
              data-testId={
                props.dataTestId
                  ? props.dataTestId + "-input"
                  : "preference-row-input"
              }
              className="form-control"
              type="text"
              onChange={props.onChange}
              style={inputStyle}
              defaultValue={props.value}
            />
          )}
          {props.type === "select" && (
            <select
              data-testId={
                props.dataTestId
                  ? props.dataTestId + "-input"
                  : "preference-row-input"
              }
              className="form-select"
              type="select"
              onChange={props.onChange}
              style={inputStyle}
              defaultValue={props.value}
            >
              {props.selectOptions.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          )}
        </Stack>
      </ListItem>
    </div>
  );
};

export default UIPreferenceRow;
