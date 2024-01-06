import React, { useEffect, useState } from "react";
import UITableMobileCard from "../UICards/UITableMobileCard";
import {
  uiGrey2,
  uiGreen,
  defaultWhiteInputStyle,
} from "../../../../constants";
import {
  Button,
  ButtonBase,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import UIDropdown from "../UIDropdown";
import useScreen from "../../../../hooks/useScreen";
import { authenticatedInstance } from "../../../../api/api";
import UIProgressPrompt from "../UIProgressPrompt";
import UIPrompt from "../UIPrompt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
const UITableMobile = (props) => {
  const navigate = useNavigate();
  const { isMobile, screenWidth, breakpoints } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [orderingField, setOrderingField] = useState("created_at");
  const [searchField, setSearchField] = useState("");
  const [limit, setLimit] = useState(10);
  const [endpoint, setEndpoint] = useState(props.endpoint);
  const [nextEndpoint, setNextEndpoint] = useState(null);
  const [previousEndpoint, setPreviousEndpoint] = useState(null);
  const [count, setCount] = useState(0);

  const nextPage = () => {
    setEndpoint(nextEndpoint);
  };

  const previousPage = () => {
    setEndpoint(previousEndpoint);
  };

  useEffect(() => {
    setIsLoading(true);
    if (props.endpoint && endpoint) {
      authenticatedInstance
        .get(endpoint, {
          params: {
            ordering: orderingField,
            search: searchField,
            limit: limit,
          },
        })
        .then((res) => {
          if (res.data.results) {
            setResults(res.data.results);
            setCount(res.data.count);
            setNextEndpoint(res.data.next);
            setPreviousEndpoint(res.data.previous);
          } else {
            setResults(res.data);
            setCount(res.data.length);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (props.data) {
      setResults(props.data);
      setCount(props.data.length);
      setIsLoading(false);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [orderingField, searchField, limit, endpoint]);
  return (
    <div>
      <>
        <div style={{ width: "100%", overflow: "auto" }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            {screenWidth > breakpoints.md && (
              <h4>
                {props.tableTitle} ({count})
              </h4>
            )}

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              alignItems="center"
              style={{ padding: "10px" }}
            >
              {props.showCreate && (
                <ButtonBase
                  style={{ color: uiGreen, float: "right" }}
                  onClick={() => {
                    navigate(props.createURL);
                  }}
                >
                  New
                  <IconButton style={{ color: uiGreen }}>
                    <AddIcon />
                  </IconButton>
                </ButtonBase>
              )}

              <>
                {screenWidth > breakpoints.md && (
                  <span style={{ color: "black" }}>Show</span>
                )}
                <select
                  style={{
                    maxWidth: isMobile ? "75px" : "150px",
                    borderRadius: "5px",
                    border: "none",
                    padding: "5px 10px",
                    backaground: "white",
                    fontSize: isMobile ? "10pt" : "12pt",
                  }}
                  onChange={(e) => {
                    setLimit(e.target.value);
                  }}
                >
                  {isMobile && (
                    <option value="" selected disabled>
                      Show
                    </option>
                  )}
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                {screenWidth > breakpoints.md && (
                  <span style={{ color: "black" }}>Results</span>
                )}
              </>
              <>
                {screenWidth > breakpoints.md && (
                  <span style={{ color: "black" }}>Sort By</span>
                )}
                <select
                  onChange={(e) => {
                    setOrderingField(e.target.value);
                  }}
                  style={{
                    borderRadius: "5px",
                    border: "none",
                    padding: "5px 10px",
                    backaground: "white",
                    fontSize: isMobile ? "10pt" : "12pt",
                    maxWidth: isMobile ? "65px" : "150px",
                  }}
                >
                  {isMobile && (
                    <option selected disabled value="">
                      Sort By
                    </option>
                  )}
                  {props.orderingFields &&
                    props.orderingFields.map((field) => {
                      return <option value={field.field}>{field.label}</option>;
                    })}
                </select>
              </>
            </Stack>
          </Stack>
        </div>
        <input
          style={{
            ...defaultWhiteInputStyle,
            width: "100%",
            border: "none",
            outline: "none",
          }}
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearchField(e.target.value);
          }}
        />
        {isLoading ? (
          <UIProgressPrompt
            title={props.loadingTitle ? props.loadingTitle : "Loading..."}
            message={
              props.loadingMessage
                ? props.loadingMessage
                : "Please wait while we fetch your data"
            }
          />
        ) : (
          <div>
            {results.length > 0 ? (
              <div>
                {results.map((row) => {
                  return (
                    <UITableMobileCard
                      onClick={
                        props.onRowClick ? () => props.onRowClick(row) : null
                      }
                      cardStyle={{ background: "white", color: "black" }}
                      infoStyle={{ color: uiGrey2, fontSize: "13pt" }}
                      titleStyle={{
                        color: uiGrey2,
                        fontSize: "12pt",
                        marginBottom: "5px",
                        ...props.titleStyle,
                      }}
                      subtitleStyle={{
                        color: uiGrey2,
                        fontSize: "11pt",
                        color: "rgba(133, 135, 150, 0.75)",
                      }}
                      title={
                        props.titleProperty
                          ? row[props.titleProperty]
                          : props.createTitle(row)
                      }
                      info={
                        props.infoProperty
                          ? row[props.infoProperty]
                          : props.createInfo(row)
                      }
                      subtitle={
                        props.subtitleProperty
                          ? row[props.subtitleProperty]
                          : props.createSubtitle(row)
                      }
                      imageSrc={
                        props.getImage
                          ? props.getImage(row)
                          : "https://picsum.photos/200"
                      }
                      showChevron={true}
                    />
                  );
                })}
                <div>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    {previousEndpoint && (
                      <ButtonBase onClick={previousPage}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={0}
                        >
                          <IconButton style={{ color: uiGreen }}>
                            <ArrowBackOutlined />
                          </IconButton>
                          <span style={{ color: uiGreen }}>Prev</span>
                        </Stack>
                      </ButtonBase>
                    )}
                    <span></span>
                    {nextEndpoint && (
                      <ButtonBase onClick={nextPage}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={0}
                        >
                          <span style={{ color: uiGreen }}>Next</span>
                          <IconButton style={{ color: uiGreen }}>
                            <ArrowForwardIcon />
                          </IconButton>
                        </Stack>
                      </ButtonBase>
                    )}
                  </Stack>
                </div>
              </div>
            ) : (
              <UIPrompt
                title="No Results"
                message="No Results are available."
              />
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default UITableMobile;
