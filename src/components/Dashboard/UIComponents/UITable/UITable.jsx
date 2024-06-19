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
import {
  authenticatedInstance,
  authenticatedMediaInstance,
} from "../../../../api/api";
import { useNavigate } from "react-router";
import { MultiSelectDropdown } from "../MultiSelectDropdown";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import UIButton from "../UIButton";
import UIPrompt from "../UIPrompt";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AlertModal from "../Modals/AlertModal";
import UIDialog from "../Modals/UIDialog";
import UIDropzone from "../Modals/UploadDialog/UIDropzone";
import {
  isValidFileExtension,
  isValidFileName,
} from "../../../../helpers/utils";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ProgressModal from "../Modals/ProgressModal";
const UITable = (props) => {
  const navigate = useNavigate();
  const [maxTableCellWidth, setMaxTableCellWidth] = useState("200px");
  const [results, setResults] = useState([]);
  const [files, setFiles] = useState([]); //Create a files state to hold the files to be uploaded
  const [isDrfFilterBackend, setIsDrfFilterBackend] = useState(false); //THis will be used to tell if the DRFfilterbackend is being used
  //Pagination Variables for when  no DRF Filter Backend is available
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFileUploadAlert, setShowFileUploadAlert] = useState(false); //Create a state to hold the value of the alert modal
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [isUploading, setIsUploading] = useState(false); //Create a state to hold the value of the upload progress

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
  const [endpointParams, setEndpointParams] = useState({});
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
    setEndpointParams({
      limit: limit,
      search: query,
      ordering: orderby,
      ...props.additionalParams,
    });
    try {
      const fetchData = async () => {
        const response = await authenticatedInstance.get(endpoint, {
          params: {
            search: query,
            ...props.additionalParams,
          },
        });
        console.log("response", response.data)
        console.log("additional params", props.additionalParams)
        return response.data;
      };

      const data = props.data || (await fetchData());

      setResults(data.results || data);
      setFilteredData(data.results || data);
      setIsDrfFilterBackend(!!data.results);
      setNextPageEndPoint(data.next || null);
      setPreviousPageEndPoint(data.previous || null);
      setCount(data.count || null);
      setIsLoading(false);

      if (props.options.isSelectable) {
        const newChecked = [...props.checked];
        const currentIds = data.results
          ? data.results.map((item) => item.id)
          : data.map((item) => item.id);
        currentIds.forEach((id) => {
          if (!newChecked.find((item) => item.id === id)) {
            newChecked.push({ id, selected: false });
          }
        });
        props.setChecked(newChecked);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertTitle("Error");
      setAlertMessage("An error occurred while fetching the data");
      setShowAlert(true);
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
      if (query === "") {
        setFilteredData(results); // Reset to the original results
        setSearchTerm(""); // Clear the search term
      } else {
        setSearchTerm(query);
        // Function to get nested property value
        const getNestedValue = (obj, path) => {
          return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };
        // Filter the data based on the search term
        const filtered = results.filter((item) =>
          props.searchFields.some((field) => {
            const value = getNestedValue(item, field);
            if (typeof value === 'string') {
              return value.toLowerCase().includes(query.toLowerCase());
            } else if (typeof value === 'number') {
              return value.toString().includes(query.toLowerCase());
            }
            return false;
          })
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
    console.log(props.checked);
    //Add support for a function that will be called when a row is selected
    if (props.options.onRowSelect) {
      console.log("Row selected");
      props.options.onRowSelect();
    }
    console.log("Checked rows", props.checked);
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

  const onDrop = (acceptedFiles) => {
    let validFiles = true;

    acceptedFiles.forEach((file) => {
      if (!isValidFileName(file.name)) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setShowFileUploadAlert(true);
        validFiles = false;
        setShowUploadDialog(false);
        return;
      } else if (!isValidFileExtension(file.name, props.acceptedFileTypes)) {
        setResponseTitle("File Upload Error");
        setResponseMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            props.acceptedFileTypes.join(", ")
        );
        setShowFileUploadAlert(true);
        setShowUploadDialog(false);
        validFiles = false;
        return;
      }
    });

    if (!validFiles) {
      return;
    }

    // Process valid files
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    console.log("updatedFiles", updatedFiles);
    setFiles(updatedFiles);
    setResponseMessage(null);
    setResponseTitle(null);
  };

  const handleUpload = () => {
    setIsUploading(true); //Set isUploading to true to show the progress bar
    //Create a function to handle the file upload from the  files array
    const formData = new FormData(); //Create a new FormData object
    files.forEach((file) => {
      formData.append("file", file); //Append each file to the FormData object
    });
    authenticatedMediaInstance
      .post(props.fileUploadEndpoint, formData)
      .then((res) => {
        console.log("res", res);
        setResponseTitle("File Upload Success");
        setResponseMessage("File(s) uploaded successfully");
        setShowFileUploadAlert(true);
        setShowUploadDialog(false);
        setFiles([]); //Clear the files array
      })
      .catch((err) => {
        console.log("err", err);
        setResponseTitle("File Upload Error");
        if (err.response.data.error_type === "duplicate_name_error") {
          setResponseMessage(err.response.data.message);
        } else {
          setResponseMessage(
            "There was an error uploading your file(s). Please ensure that you file has the correct column headers and try again."
          );
        }
        setShowFileUploadAlert(true);
        setShowUploadDialog(false);
        setFiles([]); //Clear the files array
      })
      .finally(() => {
        setIsUploading(false); //Set isUploading to false to hide the progress bar
      });
  };

  useEffect(() => {
    refresh(currentPageEndPoint);
  }, [props.data,searchTerm]);

  return (
    <div style={{ width: "100%", overflowX: "auto", padding: "0 15px" }}>
      {props.showUpload && (
        <>
          <ProgressModal open={isUploading} title="Uploading Files" />
          <AlertModal
            title={responseTitle}
            message={responseMessage}
            open={showFileUploadAlert}
            onClick={() => setShowFileUploadAlert(false)}
            btnText="OK"
          />
          <UIDialog
            open={showUploadDialog}
            onClose={() => setShowUploadDialog(false)}
            maxWidth="lg"
            style={{ width: "700px", zIndex: 991 }}
          >
            <UIDropzone
              onDrop={onDrop}
              acceptedFileTypes={props.acceptedFileTypes}
              files={files}
              setFiles={setFiles}
            />
            {props.uploadHelpText && (
              <div style={{ margin: "10px" }}>
                <HelpOutlineIcon
                  style={{ color: uiGreen, marginRight: "5px" }}
                />
                <span style={{ color: uiGrey2, fontSize: "10pt" }}>
                  {props.uploadHelpText}
                </span>
              </div>
            )}
            {files.length > 0 && (
              <UIButton
                onClick={props.handleUpload ? props.handleUpload : handleUpload}
                btnText="Upload File"
                style={{ width: "100%" }}
              />
            )}
          </UIDialog>
        </>
      )}
      <AlertModal
        title={alertTitle}
        message={alertMessage}
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
        }}
      />
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
            {props.showUpload && (
              <>
                <ButtonBase
                  data-testid="ui-table-mobile-create-button"
                  style={{ color: uiGreen, float: "right" }}
                  onClick={() => {
                    setShowUploadDialog(true);
                  }}
                >
                  {props.uploadButtonText ? props.uploadButtonText : "Upload"}
                  <IconButton style={{ color: uiGreen }}>
                    <FileUploadIcon />
                  </IconButton>
                </ButtonBase>
              </>
            )}{" "}
            {props.showCreate && (
              <span className="ui-table-create-button">
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
              </span>
            )}
            <input
              className="ui-table-search-input"
              style={{
                background: "#efefef",
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
              className="form-select ui-table-result-limit-select"
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
                      <th
                        style={{
                          maxWidth: maxTableCellWidth,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Checkbox
                          checked={
                            //Check if all the rows are selected
                            props.checked.every((element) => element.selected)
                          }
                          indeterminate={
                            //Check if some of the rows are selected
                            props.checked.some((element) => element.selected) &&
                            !props.checked.every((element) => element.selected)
                          }
                          onChange={handleSelectAll}
                          sx={{
                            color: uiGreen,
                            "&.Mui-checked": {
                              color: uiGreen,
                            },
                            "&.MuiCheckbox-indeterminate": {
                              color: uiGreen,
                            },
                          }}
                        />
                      </th>
                    )}
                    {props.columns.map((column) => {
                      return (
                        <th
                          style={{
                            maxWidth:  maxTableCellWidth,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <ButtonBase
                            onClick={() => {
                              handleTableHeaderClick(
                                column.options?.orderingField
                                  ? column.options.orderingField
                                  : column.name
                              );
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
                              boxShadow: !props.hideShadow
                                ? "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23) !important"
                                : "none",
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
                                    <td
                                      style={{
                                        maxWidth:  maxTableCellWidth,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {column.options.customBodyRender(
                                        row[column.name]
                                      )}
                                    </td>
                                  );
                                }
                              }
                              return (
                                <td
                                  style={{
                                    maxWidth:  maxTableCellWidth,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row[column.name]}
                                </td>
                              );
                            })}
                            <td>
                              <div className="ui-table-more-button">
                                <IconButton
                                  id="ui-table-more-button"
                                  onClick={(event) =>
                                    handleMenuClick(event, index)
                                  }
                                >
                                  <MoreVert />
                                </IconButton>
                              </div>
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
                                    <td
                                      style={{
                                        maxWidth:  maxTableCellWidth,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {column.options.customBodyRender(
                                        row[column.name]
                                      )}
                                    </td>
                                  );
                                }
                              }
                              return (
                                <td
                                  style={{
                                    maxWidth:  maxTableCellWidth,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row[column.name]}
                                </td>
                              );
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
