import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Stack } from "@mui/joy";
import { uiGreen } from "../../../../constants";
const UIChartCard = ({
  info,
  onClick,
  title,
  imageSrc,
  subtitle,
  children,
  cardStyle,
  infoStyle,
  titleStyle,
  subtitleStyle,
  dropDownOptions,
  onDropdownChange,
  showChevron,
  chartHeaderMode,
}) => {
  return (
    <div
      className="card"
      style={{ margin: "10px 0", overflow: "hidden", ...cardStyle }}
      onClick={onClick}
    >
      <div className="card-body">
        <Stack
          direction="row"
          spacing={2}
          justifyContent={chartHeaderMode ? "space-between" : "flex-start"}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          {imageSrc && (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <img src={imageSrc} alt="profile" style={{ width: "100%" }} />
            </div>
          )}
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
          {showChevron && (
            <ChevronRightIcon sx={{ color: uiGreen, float: "right" }} />
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

export default UIChartCard;
