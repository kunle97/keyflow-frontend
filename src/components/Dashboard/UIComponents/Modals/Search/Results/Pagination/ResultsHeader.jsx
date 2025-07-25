import React from "react";
import { uiGreen } from "../../../../../../../constants";
import { ButtonBase, IconButton, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
const ResultsHeader = (props) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <h2>
        {props.title} ({props.resultCount})
      </h2>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <ButtonBase style={{ color: uiGreen }} onClick={props.refresh}>
          Refresh
          <IconButton style={{ color: uiGreen }}>
            <RefreshIcon />
          </IconButton>
        </ButtonBase>
        <span style={{ fontSize: "15pt !important", color: "black" }}>
          Show
        </span>
        <select
          className="form-select "
          onChange={(e) => props.changeSearchLimit(e.target.value)}
          value={props.searchLimit}
          style={{
            width: "55px",
            background: "white",
            color: "black",
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important",
          }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span style={{ fontSize: "15pt !important", color: "black" }}>
          Results
        </span>
      </Stack>
    </Stack>
  );
};

export default ResultsHeader;
