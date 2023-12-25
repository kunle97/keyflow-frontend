import { Tab, Tabs } from "@mui/material";
import styled from "styled-components";
import { uiGreen, uiGrey2 } from "../../../constants";
const StyledTabs = styled((props) => (
  <Tabs
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
    fontSize: "14pt",
    color:`${uiGrey2} !important`,
    "&.Mui-selected": {
      color: "#fff",
    },
    "&.Mui-focusVisible": {
      backgroundColor: uiGreen,
    },
  })
);

const UITabs = (props) => {
  return (
    <div style={{...props.style}} >
      <StyledTabs
        value={props.value}
        onChange={props.handleChange}
        aria-label={props.ariaLabel}
        variant={props.variant}
        scrollButtons={props.scrollButtons}
      >
        {props.tabs.map((tab) => (
          <StyledTab label={tab.label} value={tab.value} icon={tab.icon} />
        ))}
      </StyledTabs>
    </div>
  );
};

export default UITabs;
