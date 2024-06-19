import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Stack } from "@mui/joy";
import { uiGreen } from "../../../../constants";
import useScreen from "../../../../hooks/useScreen";
const UICard = ({
  info,
  onClick,
  title,
  dataTestId,
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
  checkbox,
}) => {
  const { isMobile } = useScreen();
  return (
    <div
      className="card"
      style={{ margin: "10px 0", overflow: "hidden", ...cardStyle }}
      data-testId={dataTestId}
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
            {checkbox && checkbox}
            {(info || title) && (
              <div
                style={{
                  lineHeight: "1",
                }}
                onClick={onClick}
              >
                <h5
                  className="card-title ui-table-mobile-info"
                  style={{
                    maxWidth: isMobile ? "250px" : "600px",
                    // maxHeight: "60px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    ...infoStyle,
                  }}
                >
                  <b>{info}</b>
                </h5>
                <p
                  className="card-text text-muted ui-table-mobile-title"
                  style={{
                    maxWidth: isMobile ? "250px" : "600px",
                    // maxHeight: "70px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    ...titleStyle,
                  }}
                >
                  {title}
                </p>
                {subtitle && (
                  <p
                    className="text-dark ui-table-mobile-subtitle"
                    style={{
                      maxWidth: isMobile ? "250px" : "600px",
                      // maxHeight: "80px",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      ...subtitleStyle,
                    }}
                  >
                    {subtitle}
                  </p>
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
          {showChevron && (
            <ChevronRightIcon onClick={onClick} sx={{ color: uiGreen }} />
          )}
        </Stack>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default UICard;
