import React from "react";
import { IconButton, Stack } from "@mui/material";
import { uiGreen, uiGrey2 } from "../../../../../constants";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SearchResultCard = (props) => {
  const navigate = useNavigate();
  return (
    <div
      className={`col-md-${props.gridSize} my-3`}
      onClick={props.onClick}
      style={{ pointer: "cursor" }}
    >
      <div
        onClick={() => {
          navigate(props.to);
          props.handleClose();
        }}
        to={props.to}
      >
        <div className="card">
          <div className="card-body">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <div>
                      <div
                        style={{
                          background: uiGreen,
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        {props.icon}
                      </div>
                    </div>
                    <div>
                      <h5 style={{ margin: 0 }} >{props.title}</h5>
                      <span
                        style={{
                          // color: uiGrey2,
                          overflow: "ellipse",
                          maxWidth: "100%",
                          margin: 0,
                        }}
                        className="text-muted"
                      >
                        {props.subtitle}
                      </span>
                    </div>
                  </Stack>
                </Stack>
                {props.description && (
                  <div className="py-2 text-black">
                    <span>{props.description}</span>
                  </div>
                )}
              </div>
              <IconButton onClick={props.onClick}>
                <ArrowForwardIcon sx={{ color: uiGreen }} />
              </IconButton>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
