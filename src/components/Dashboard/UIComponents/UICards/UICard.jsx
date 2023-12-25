import React from "react";
import { Stack } from "@mui/joy";
const UICard = ({
  info,
  title,
  children,
  cardStyle,
  infoStyle,
  titleStyle,
  dropDownOptions,
  onDropdownChange,
}) => {
  return (
    <div
      className="card"
      style={{ margin: "10px 0", overflow: "hidden", ...cardStyle }}
    >
      <div className="card-body">
        <Stack
          direction="row"
          spacing={2}
          justifyContent={"space-between"}
          sx={{ marginBottom: "15px" }}
        >
          {(info || title) && (
            <div
              style={{
                lineHeight: ".75",
              }}
            >
              <h5 className="card-title" style={{ ...infoStyle }}>
                <b>{info}</b>
              </h5>
              <p className="card-text text-muted" style={{ ...titleStyle }}>
                {title}
              </p>
            </div>
          )}
          {dropDownOptions && (
            <Stack>
              <select
                className="text-muted"
                style={{ border: "none", outline: "none" }}
                aria-label="Default select example"
                onChange={onDropdownChange}
              >
                {dropDownOptions.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
              <p></p>
            </Stack>
          )}
        </Stack>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default UICard;
