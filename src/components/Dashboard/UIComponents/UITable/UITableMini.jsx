import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { authenticatedInstance } from "../../../../api/api";
import { CircularProgress, Box, ButtonBase } from "@mui/material";
import { uiGreen } from "../../../../constants";
import UIButton from "../UIButton";
import UIPrompt from "../UIPrompt";

const UITableMini = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isDrfFilterBackend, setIsDrfFilterBackend] = useState(false);
  const [currentPageEndPoint, setCurrentPageEndPoint] = useState(
    props.endpoint
  );
  const [nextPageEndPoint, setNextPageEndPoint] = useState(null);
  const [previousPageEndPoint, setPreviousPageEndPoint] = useState(null);
  const [count, setCount] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filteredData, setFilteredData] = useState([]);

  const [results, setResults] = useState([]);

  const refresh = async (endpoint) => {
    setIsLoading(true);
    if (props.data) {
      setResults(props.data);
      setFilteredData(props.data);
      setIsDrfFilterBackend(false);
      setIsLoading(false);
    } else {
      await authenticatedInstance
        .get(endpoint, {
          params: {
            search: query,
            limit: props.options.limit ? props.options.limit : limit,
            ordering: props.options.sortOrder.desc
              ? "-" + props.options.sortOrder.name
              : props.options.sortOrder.name,
          },
        })
        .then((res) => {
          if (res.data.results) {
            setIsDrfFilterBackend(true);
            setResults(res.data.results);
            setNextPageEndPoint(res.data.next);
            setPreviousPageEndPoint(res.data.previous);
            setCount(res.data.count);
            setIsLoading(false);
            if (props.options.isSelectable) {
              let newChecked = [];
              //loop through the first set of results and set the selected property to false for each row. After
              res.data.results.map((result) => {
                newChecked.push({
                  id: result.id,
                  selected: false,
                });
              });
              while (!nextPageEndPoint === null) {
                const remaining_res = authenticatedInstance
                  .get(nextPageEndPoint)
                  .then((r_res) => {
                    r_res.data.results.map((result) => {
                      newChecked.push({
                        id: result.id,
                        selected: false,
                      });
                    });
                    setNextPageEndPoint(r_res.data.next);
                  });
              }
              setNextPageEndPoint(res.data.next);
              props.setChecked(newChecked);
            }
          } else {
            setIsDrfFilterBackend(false);
            setResults(res.data);
            setFilteredData(res.data);
            setNextPageEndPoint(null);
            setPreviousPageEndPoint(null);
            setCount(null);
            setLimit(null);
            setIsLoading(false);
            if (props.options.isSelectable) {
              let newChecked = [];
              res.data.map((result) => {
                newChecked.push({
                  id: result.id,
                  selected: false,
                });
              });
              props.setChecked(newChecked);
            }
          }
        });
    }
  };

  useEffect(() => {
    refresh(currentPageEndPoint);
  }, [props.data]);

  return (
    <>
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <Box m={"55px auto"}>
            <CircularProgress sx={{ color: uiGreen }} />
          </Box>
        </Box>
      ) : (
        <div>
          <h5>{props.title}</h5>
          {results.length === 0 ? (
            <div>
              <UIPrompt
                title="Uh Oh!"
                message="Looks like there are no results to display.  This data will be populated once you get started."
                hideBoxShadow={true}
              />
            </div>
          ) : (
            <table id="ui-table-mini" style={{ width: "100%" }}>
              <thead>
                <tr>
                  {props.columns.map((column) => {
                    return (
                      <th>
                        <ButtonBase>
                          <span
                            style={{
                              borderBottom: "2px solid " + uiGreen,
                              margin: "0 5px",
                            }}
                          >
                            {column.label}
                          </span>
                        </ButtonBase>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {isDrfFilterBackend ? (
                  <>
                    {" "}
                    {results.map((row, index) => {
                      return (
                        <tr style={{ borderBottom: "1px solid #ccc" }}>
                          {props.columns.map((column) => {
                            //Check if column has an option property with a function in it called customBodyRender
                            if (column.options) {
                              if (column.options.customBodyRender) {
                                return (
                                  <td>
                                    {column.options.customBodyRender(
                                      row[column.name]
                                    )}
                                  </td>
                                );
                              }
                            }
                            return <td>{row[column.name]}</td>;
                          })}
                          {props.showViewButton && (
                            <td>
                              <UIButton
                                onClick={() => {
                                  props.options.onRowClick(row.id);
                                }}
                                btnText="View"
                              />
                            </td>
                          )}
                          {/* {props.options.actionEnabled && (
                            <td>
                              <UIButton btnText={props.options.actionText} />
                            </td>
                          )} */}
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {results.map((row) => {
                      return (
                        <tr style={{ borderBottom: "1px solid #ccc" }}>
                          {props.columns.map((column) => {
                            //Check if column has an option property with a function in it called customBodyRender
                            if (column.options) {
                              if (column.options.customBodyRender) {
                                return (
                                  <td>
                                    {column.options.customBodyRender(
                                      row[column.name]
                                    )}
                                  </td>
                                );
                              }
                            }
                            return <td>{row[column.name]}</td>;
                          })}

                          {props.showViewButton && (
                            <td>
                              <UIButton
                                variant="text"
                                onClick={() => {
                                  // navigate(`${props.detailURL}${row.id}`);
                                  props.options.onRowClick(row.id);
                                }}
                                btnText={
                                  !props.viewButtonText
                                    ? "View"
                                    : props.viewButtonText
                                }
                              />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default UITableMini;