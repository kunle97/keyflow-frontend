import { Tab, Tabs } from "@mui/material";
import styled from "styled-components";
import { uiGreen, uiGrey2 } from "../../../constants";
import useScreen from "../../../hooks/useScreen";
const StyledTabs = styled((props) => (
  <Tabs
    allowScrollButtonsMobile={true}
    {...props}
    TabIndicatorProps={{
      children: <span className="MuiTabs-indicatorSpan" />,
    }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: uiGreen,
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none !important",
    fontSize: "12pt",
    color: `${uiGrey2} !important`,
    "&.Mui-selected": {
      color: "black",
    },
    "&.Mui-focusVisible": {
      backgroundColor: uiGreen,
    },
  })
);

const UITabs = (props) => {
  const { isMobile } = useScreen();
  return (
    <div style={{ ...props.style }}>
      <StyledTabs
        value={props.value}
        onChange={props.handleChange}
        aria-label={props.ariaLabel}
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons={"false"}
      >
        {props.tabs.map((tab) => (
          <StyledTab
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
            data-testId={tab.dataTestId ? tab.dataTestId : ""}
          />
        ))}
      </StyledTabs>
    </div>
  );
};

export default UITabs;
