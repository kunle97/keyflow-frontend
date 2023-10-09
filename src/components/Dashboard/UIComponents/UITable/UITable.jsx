import {
  Box,
  ButtonBase,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { ArrowBackOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";
import { uiGreen, uiGrey2 } from "../../../../constants";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { authenticatedInstance } from "../../../../api/api";
import { useNavigate } from "react-router";
import { MultiSelectDropdown } from "../MultiSelectDropdown";
import UIButton from "../UIButton";
import { set } from "react-hook-form";
import { el } from "@faker-js/faker";
const UITable = (props) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isDrfFilterBackend, setIsDrfFilterBackend] = useState(false); //THis will be used to tell if the DRFfilterbackend is being used
  //Pagination Variables for when  no DRF Filter Backend is available
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //DRF Filter Backend Variables
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState(null);
  const [nextPageEndPoint, setNextPageEndPoint] = useState("/");
  const [previousPageEndPoint, setPreviousPageEndPoint] = useState("/");
  const [orderby, setOrderBy] = useState("-created_at");
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const initialSelectedOptions = props.filters
    ? props.filters.map(() => [])
    : [];
  const [selectedOptionsArray, setSelectedOptionsArray] = useState(
    initialSelectedOptions
  );
  let currentPageEndPoint = `${props.endpoint}?limit=${limit}${
    query ? `&search=${query}` : ""
  }${orderby ? `&ordering=${orderby}` : ""}`;

  const refresh = async (endpoint) => {
    setIsLoading(true);
    await authenticatedInstance
      .get(endpoint, {
        params: {
          search: query,
          ordering: orderby,
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
        } else {
          setIsDrfFilterBackend(false);
          setResults(res.data);
          setFilteredData(res.data);
          setNextPageEndPoint(null);
          setPreviousPageEndPoint(null);
          setCount(null);
          setLimit(null);
          setIsLoading(false);
        }
      });
  };

  // Sort the data based on the current sorting column and order
  const sortedData = [...filteredData].sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];

    // Implement custom comparison logic here if needed
    if (columnA < columnB) {
      return sortOrder === "asc" ? -1 : 1;
    } else if (columnA > columnB) {
      return sortOrder === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  });

  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = async () => {
    if (isDrfFilterBackend) {
      currentPageEndPoint = nextPageEndPoint;
      refresh(currentPageEndPoint);
    } else {
      if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const previousPage = async () => {
    if (isDrfFilterBackend) {
      currentPageEndPoint = previousPageEndPoint;
      refresh(currentPageEndPoint);
    } else {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const changeSearchLimit = async (limit) => {
    if (isDrfFilterBackend) {
      setLimit(limit);
      currentPageEndPoint = `${props.endpoint}?limit=${limit}${
        query ? `&search=${query}` : ""
      }`;
      refresh(currentPageEndPoint);
    } else {
      const newValue = parseInt(limit);
      setItemsPerPage(newValue);
      setCurrentPage(1); // Reset to the first page when changing items per page
    }
  };

  const handleTableHeaderClick = async (name) => {
    if (isDrfFilterBackend) {
      if (orderby === name) {
        setOrderBy(`-${name}`);
      } else {
        setOrderBy(name);
      }
      currentPageEndPoint = `${props.endpoint}?limit=${limit}${
        query ? `&search=${query}` : ""
      }${orderby ? `&ordering=${orderby}` : ""}`;
      refresh(currentPageEndPoint);
    } else {
      if (sortColumn === name) {
        // Toggle the sort order if the same column is clicked again
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        // Set the new sorting column and default to ascending order
        setSortColumn(name);
        setSortOrder("asc");
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = e.target.value;
    if (isDrfFilterBackend) {
      setQuery(query);
      if (query === "") {
        setQuery(null);
        currentPageEndPoint = `${props.endpoint}?limit=${limit}`;
      } else {
        currentPageEndPoint = `${props.endpoint}?limit=${limit}&search=${query}`;
      }
      refresh(currentPageEndPoint);
    } else {
      //Search threough the results and filter them based on the search term that matches the search fields
      if (query === "") {
        setFilteredData(results);
      } else {
        setSearchTerm(query);
        // Filter the data based on the search term
        const filtered = results.filter((item) =>
          props.searchFields.some((field) =>
            item[field].toLowerCase().includes(query.toLowerCase())
          )
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page when searching
      }
    }
  };

  //Handles the selection change for the filter dropdowns
  const handleSelectionChange = (newSelectedOptions, index) => {
    if (isDrfFilterBackend) {
      const updatedSelectedOptionsArray = [...selectedOptionsArray];
      updatedSelectedOptionsArray[index] = newSelectedOptions;
      setSelectedOptionsArray(updatedSelectedOptionsArray);
      //Loop through the selected options array and add the selected options to the endpoint
      selectedOptionsArray.map((selectedOptions, index) => {
        //check if there are any selected options
        if (selectedOptionsArray.length === 0) {
          currentPageEndPoint = `${props.endpoint}?limit=${limit}`;
        } else {
          if (selectedOptions.length > 0) {
            currentPageEndPoint = `${currentPageEndPoint}&${
              props.filters[index].param
            }=${selectedOptions.join(",")}`;
          }
        }
      });
      //Refresh the table
      refresh(currentPageEndPoint);
    }
  };

  useEffect(() => {
    refresh(currentPageEndPoint);
  }, []);

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        {props.filters &&
          props.filters.map((filter, index) => {
            return (
              <MultiSelectDropdown
                options={filter.values}
                selectedOptions={selectedOptionsArray[index]}
                onChange={(newSelectedOptions) =>
                  handleSelectionChange(newSelectedOptions, index)
                }
                label={filter.label}
              />
            );
          })}
      </Stack>
      <div id="header" className="my-3">
        {" "}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <h2>
              {props.title} ({isDrfFilterBackend ? count : results.length})
            </h2>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            {" "}
            {props.showCreate && (
              <ButtonBase
                style={{ color: uiGreen }}
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
            <input
              style={{
                background: uiGrey2,
                color: "white",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                padding: "10px",
              }}
              placeholder="Search"
              onChange={handleSearch}
            />
            <span style={{ fontSize: "15pt !important", color: "white" }}>
              Show
            </span>
            <select
              className="form-select "
              value={limit}
              onChange={(e) => {
                changeSearchLimit(e.target.value);
              }}
              style={{
                width: "55px",
                background: uiGrey2,
                color: "white",
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
            <span style={{ fontSize: "15pt !important", color: "white" }}>
              Results
            </span>{" "}
          </Stack>
        </Stack>
      </div>

      <>
        {isLoading ? (
          <Box sx={{ display: "flex" }}>
            <Box m={"55px auto"}>
              <CircularProgress sx={{ color: uiGreen }} />
            </Box>
          </Box>
        ) : (
          <>
            {results.length === 0 ? (
              <h2>No results found</h2>
            ) : (
              <table id="ui-table" className="table">
                {/* Table Header  */}
                <tr>
                  {props.columns.map((column) => {
                    return (
                      <th>
                        <ButtonBase
                          onClick={() => {
                            handleTableHeaderClick(column.name);
                          }}
                        >
                          {column.label}
                        </ButtonBase>
                      </th>
                    );
                  })}
                  <th></th>
                </tr>
                {/* TableRows */}

                <>
                  {isDrfFilterBackend ? (
                    <>
                      {" "}
                      {results.map((row) => {
                        return (
                          <tr>
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
                            <td>
                              <UIButton
                                onClick={() => {
                                  navigate(`${props.detailURL}${row.id}`);
                                }}
                                btnText="View"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {currentItems.map((row) => {
                        return (
                          <tr>
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
                            <td>
                              <UIButton
                                onClick={() => {
                                  navigate(`${props.detailURL}${row.id}`);
                                }}
                                btnText="View"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </>
              </table>
            )}
          </>
        )}
      </>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {(previousPageEndPoint || currentPage > 1) && (
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
          {(nextPageEndPoint ||
            currentPage < Math.ceil(filteredData.length / itemsPerPage)) && (
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
  );
};

export default UITable;
