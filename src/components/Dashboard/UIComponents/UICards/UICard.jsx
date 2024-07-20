import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Stack } from "@mui/joy";
import { uiGreen } from "../../../../constants";
const UICard = ({
  info,
  onClick,
  title,
  subtitle,
  children,
  cardStyle,
  infoStyle,
  titleStyle,
  subtitleStyle,
  dropDownOptions,
  onDropdownChange,
  showChevron,
  dataTestId,
}) => {
  return (
    <div
      className="card"
      style={{ margin: "10px 0", overflow: "hidden", ...cardStyle }}
      onClick={onClick}
      data-testid={dataTestId}
    >
      <div className="card-body">
        <Stack
          direction="row"
          spacing={2}
          justifyContent={"space-between"}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Stack
            direction="row"
            spacing={2}
            justifyContent={"space-between"}
            alignItems="center"
            sx={{}}
          >
            {(info || title) && (
              <div
                style={{
                  lineHeight: "1",
                }}
              >
                <h5 className="card-title" style={{ ...infoStyle }}>
                  <b>{info}</b>
                </h5>
                <p className="card-text text-muted" style={{ ...titleStyle }}>
                  {title}
                </p>
                {subtitle && (
                  <span
                    className="text-dark"
                    style={{
                      ...subtitleStyle,
                    }}
                  >
                    {subtitle}
                  </span>
                )}
              </div>
            )}
          </Stack>
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
          {showChevron && <ChevronRightIcon sx={{ color: uiGreen }} />}
        </Stack>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default UICard;
