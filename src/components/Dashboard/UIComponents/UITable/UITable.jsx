import {
  Box,
  ButtonBase,
  Checkbox,
  CircularProgress,
  ClickAwayListener,
  FormControlLabel,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBackOutlined, MoreVert } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useEffect } from "react";
import { uiGreen, uiGrey2 } from "../../../../constants";
import { useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import AddIcon from "@mui/icons-material/Add";
import { authenticatedInstance } from "../../../../api/api";
import { useNavigate } from "react-router";
import { MultiSelectDropdown } from "../MultiSelectDropdown";
import UIButton from "../UIButton";
import UIPrompt from "../UIPrompt";
import SwapVertIcon from "@mui/icons-material/SwapVert";

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
  }`;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

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
  const handleFilterSelectionChange = (newSelectedOptions, index) => {
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

  //Create  a function called setRowSelected that takes in the index of the row and a boolean value to set the row to selected or not
  const setRowSelected = (id, selected) => {
    //Create a new array from the checked array
    const newChecked = [...props.checked];
    //Update the selected value of the row at the index
    //Find the element whose property id is equal to the id of the row and set the selected property to the value of the selected parameter
    let element = newChecked.find((element) => element.id === id);
    if (element) {
      element.selected = selected;
    } else {
      //Create a new element and push it to the newChecked array
      element = {
        id: id,
        selected: selected,
      };
      newChecked.push(element);
    }
    // newChecked[index].selected = selected;
    //Set the checked array to the newChecked array
    props.setChecked(newChecked);
  };

  //Handles the select all checkbox in table header
  const handleSelectAll = (event) => {
    //Create a new array from the checked array
    const newChecked = [...props.checked];
    //Loop through the newChecked array and set all the selected properties to the value of the event.target.checked
    newChecked.map((element) => {
      element.selected = event.target.checked;
    });
    //Set the checked array to the newChecked array
    props.setChecked(newChecked);
  };
  useEffect(() => {
    refresh(currentPageEndPoint);
  }, [props.data]);

  return (
    <div style={{ width: "100%", overflowX: "auto", padding: "0 15px" }}>
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
                  handleFilterSelectionChange(newSelectedOptions, index)
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
            <h3>
              {props.title} ({isDrfFilterBackend ? count : results.length})
            </h3>
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
                background: "white",
                color: "black",
                border: "none",
                outline: "none",
                borderRadius: "5px",
                padding: "10px",
                width: "130px",
              }}
              placeholder="Search"
              onChange={handleSearch}
            />
            <span style={{ fontSize: "15pt !important", color: uiGrey2 }}>
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
                background: "white",
                color: uiGrey2,
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
            <span style={{ fontSize: "15pt !important", color: uiGrey2 }}>
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
              <>
                <UIPrompt
                  icon={
                    <SearchOffIcon
                      style={{ fontSize: "5rem", color: uiGreen }}
                    />
                  }
                  title="No results found"
                  message="Add a new entry or try adjusting your search filters."
                />
              </>
            ) : (
              <table
                // id="ui-table"
                className="styled-table "
                style={{ width: "100%", padding: "0 35px" }}
              >
                <thead>
                  {/* Table Header  */}
                  <tr>
                    {props.options.isSelectable && (
                      <th>
                        <Checkbox
                          // checked={props.checked[0] && props.checked[1]}
                          indeterminate={props.checked[0] !== props.checked[1]}
                          onChange={handleSelectAll}
                        />
                      </th>
                    )}
                    {props.columns.map((column) => {
                      return (
                        <th>
                          <ButtonBase
                            onClick={() => {
                              handleTableHeaderClick(column.name);
                            }}
                          >
                            {column.label}{" "}
                            <SwapVertIcon sx={{ color: uiGreen }} />
                          </ButtonBase>
                        </th>
                      );
                    })}
                    <th></th>
                  </tr>
                </thead>
                {/* TableRows */}
                <tbody>
                  {isDrfFilterBackend ? (
                    <>
                      {" "}
                      {results.map((row, index) => {
                        return (
                          <tr
                            style={{
                              backgroundColor: "white",
                              boxShadow:
                                "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important",
                            }}
                          >
                            {props.options.isSelectable && (
                              <td>
                                <Checkbox
                                  checked={
                                    //Retrieve the row with the same id as the row in the checked array and get the selected property
                                    props.checked.find(
                                      (element) => element.id === row.id
                                    ).selected
                                  }
                                  onChange={(e) => {
                                    setRowSelected(row.id, e.target.checked);
                                  }}
                                  sx={{
                                    color: uiGreen,
                                    "&.Mui-checked": {
                                      color: uiGreen,
                                    },
                                  }}
                                />
                              </td>
                            )}

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
                              <IconButton
                                onClick={(event) =>
                                  handleMenuClick(event, index)
                                }
                              >
                                <MoreVert />
                              </IconButton>
                              <Popper
                                open={selectedIndex === index}
                                anchorEl={anchorEl}
                                placement="bottom-start"
                                transition
                              >
                                {({ TransitionProps, placement }) => (
                                  <Grow
                                    {...TransitionProps}
                                    style={{
                                      transformOrigin:
                                        placement === "bottom-start"
                                          ? "right top"
                                          : "right top",
                                    }}
                                  >
                                    <Paper>
                                      <ClickAwayListener
                                        onClickAway={handleCloseMenu}
                                      >
                                        <MenuList>
                                          {props.menuOptions.map(
                                            (option, index) => (
                                              <MenuItem
                                                key={index}
                                                onClick={() =>
                                                  option.onClick(row)
                                                }
                                                id="menu-list-grow"
                                                onKeyDown={handleCloseMenu}
                                              >
                                                <Typography>
                                                  {option.name}
                                                </Typography>
                                              </MenuItem>
                                            )
                                          )}
                                        </MenuList>
                                      </ClickAwayListener>
                                    </Paper>
                                  </Grow>
                                )}
                              </Popper>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {currentItems.map((row, index) => {
                        return (
                          <tr
                            style={{
                              backgroundColor: "white",
                              boxShadow:
                                "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important",
                            }}
                          >
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
                            {props.menuOptions && (
                              <td>
                                <IconButton
                                  onClick={(event) =>
                                    handleMenuClick(event, index)
                                  }
                                >
                                  <MoreVert />
                                </IconButton>
                                <Popper
                                  open={selectedIndex === index}
                                  anchorEl={anchorEl}
                                  placement="bottom-start"
                                  transition
                                >
                                  {({ TransitionProps, placement }) => (
                                    <Grow
                                      {...TransitionProps}
                                      style={{
                                        transformOrigin:
                                          placement === "bottom-start"
                                            ? "right top"
                                            : "right top",
                                      }}
                                    >
                                      <Paper>
                                        <ClickAwayListener
                                          onClickAway={handleCloseMenu}
                                        >
                                          <MenuList>
                                            {props.menuOptions.map(
                                              (option, index) => (
                                                <MenuItem
                                                  key={index}
                                                  onClick={() =>
                                                    option.onClick(row)
                                                  }
                                                  id="menu-list-grow"
                                                  onKeyDown={handleCloseMenu}
                                                >
                                                  <Typography>
                                                    {option.name}
                                                  </Typography>
                                                </MenuItem>
                                              )
                                            )}
                                          </MenuList>
                                        </ClickAwayListener>
                                      </Paper>
                                    </Grow>
                                  )}
                                </Popper>
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
