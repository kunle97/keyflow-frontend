import React, { useEffect, useState } from "react";
import UITableMobileCard from "../UICards/UITableMobileCard";
import {
  uiGrey2,
  uiGreen,
  defaultWhiteInputStyle,
  globalMaxFileSize,
} from "../../../../constants";
import {
  ButtonBase,
  Checkbox,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import useScreen from "../../../../hooks/useScreen";
import {
  authenticatedInstance,
  authenticatedMediaInstance,
} from "../../../../api/api";
import UIProgressPrompt from "../UIProgressPrompt";
import UIPrompt from "../UIPrompt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import UIDialog from "../Modals/UIDialog";
import UIDropzone from "../Modals/UploadDialog/UIDropzone";
import AlertModal from "../Modals/AlertModal";
import UIButton from "../UIButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  isValidFileExtension,
  isValidFileName,
} from "../../../../helpers/utils";
import ProgressModal from "../Modals/ProgressModal";
const UITableMobile = (props) => {
  const navigate = useNavigate();
  const { isMobile, screenWidth, breakpoints } = useScreen();
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
      // Search through the results and filter them based on the search term that matches the search fields
      if (query === "") {
        setFilteredData(results);
      } else {
        setSearchTerm(query);
        // Function to get nested property value
        const getNestedValue = (obj, path) => {
          return path.split(".").reduce((acc, part) => acc && acc[part], obj);
        };
        // Filter the data based on the search term
        const filtered = results.filter((item) =>
          props.searchFields.some((field) => {
            const value = getNestedValue(item, field);
            if (typeof value === "string") {
              return value.toLowerCase().includes(query.toLowerCase());
            } else if (typeof value === "number") {
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

    //Add support for a function that will be called when a row is selected
    if (props.options.onRowSelect) {

      props.options.onRowSelect();
    }

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
      //Check if file is valid size
      if (file.size > globalMaxFileSize) {
        setResponseTitle("File Upload Error");
        setResponseMessage("File size is too large. Max file size is 3MB");
        setShowFileUploadAlert(true);
        props.onClose();
        validFiles = false;
        return;
      }
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

        setResponseTitle("File Upload Success");
        setResponseMessage("File(s) uploaded successfully");
        setShowFileUploadAlert(true);
        setShowUploadDialog(false);
        setFiles([]); //Clear the files array
      })
      .catch((err) => {

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
  }, [props.data]);
  return (
    <div>
      <>
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
                  onClick={handleUpload}
                  btnText="Upload File"
                  style={{ width: "100%" }}
                />
              )}
            </UIDialog>
          </>
        )}
        <div style={{ width: "100%", overflow: "auto" }}>
          <Stack
            direction="row"
            justifyContent={`space-between`}
            alignItems="center"
          >
            <h4 data-testId="ui-table-mobile-title">
              {props.tableTitle} ({count || currentItems.length})
            </h4>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              alignItems="center"
              style={{ padding: "10px" }}
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
              )}

              {props.showCreate && (
                <ButtonBase
                  data-testid="ui-table-mobile-create-button"
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
                {!isMobile && (
                  <input
                    style={{
                      ...defaultWhiteInputStyle,
                      width: "220px",
                      border: "none",
                      outline: "none",
                      marginBottom: "10px",
                    }}
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                  />
                )}
                {screenWidth > breakpoints.md && (
                  <span style={{ color: "black" }}>Show</span>
                )}
                <select
                  className="limit-select"
                  style={{
                    maxWidth: isMobile ? "75px" : "150px",
                    borderRadius: "5px",
                    border: "none",
                    padding: "5px 10px",
                    backaground: "white",
                    fontSize: isMobile ? "10pt" : "12pt",
                  }}
                  onChange={(e) => {
                    changeSearchLimit(e.target.value);
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
                    handleTableHeaderClick(e.target.value);
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
        {isMobile && (
          <input
            style={{
              ...defaultWhiteInputStyle,
              width: "100%",
              border: "none",
              outline: "none",
              marginBottom: "10px",
            }}
            type="text"
            placeholder="Search"
            onChange={handleSearch}
          />
        )}
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
            {isDrfFilterBackend ? (
              <>
                <div>
                  {results.map((row, index) => {
                    return (
                      <UITableMobileCard
                        dataTestId={
                          props.createTestRowIdentifier
                            ? `${props.createTestRowIdentifier(row)}-${index}`
                            : `${props.testRowIdentifier}-${index}`
                        }
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
                        checkbox={
                          props.options && props.options.isSelectable ? (
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
                                zIndex: 999,
                                color: uiGreen,
                                "&.Mui-checked": {
                                  color: uiGreen,
                                },
                              }}
                            />
                          ) : null
                        }
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
                        currentPage <
                          Math.ceil(filteredData.length / itemsPerPage)) && (
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
              </>
            ) : (
              <>
                {currentItems.length > 0 &&
                  currentItems.map((row, index) => {
                    return (
                      <UITableMobileCard
                        dataTestId={
                          props.createTestRowIdentifier
                            ? `${props.createTestRowIdentifier(row)}-${index}`
                            : `${props.testRowIdentifier}-${index}`
                        }
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
              </>
            )}
            {results.length === 0 && currentItems.length === 0 && (
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
