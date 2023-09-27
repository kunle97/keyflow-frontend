import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { Box, Button, Input, Tab, Tabs } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { AppBar, IconButton } from "@material-ui/core";
import { uiGreen, uiGrey1 } from "../../../../../constants";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchResultCard from "./SearchResultCard";
import { useCallback } from "react";
import {
  authenticatedInstance,
  getLandlordTenant,
  getLandlordTenants,
  getLandlordUnits,
  getProperties,
  getUnit,
  getUnits,
} from "../../../../../api/api";
import { useNavigate } from "react-router-dom";
import { landlordMenuItems } from "../../../../../constants";
import { set } from "react-hook-form";
const SearchDialog = (props) => {
  //Create a useCallback version of the Transition component
  const Transition = useCallback(
    React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    }),
    []
  );
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dashboardPages, setDashboardPages] = useState(landlordMenuItems);
  const [allProperties, setAllProperties] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [tabPage, setTabPage] = React.useState(0);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [rentalApplications, setRentalApplications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  //Create a filter function to filter the tenants based on the search value
  const filterTenants = () => {
    return tenants.filter((tenant) => {
      return (
        tenant.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        tenant.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  };
  //Create a filter function for dashboard pages based on the search value
  const filterDashboardPages = () => {
    return dashboardPages.filter((page) => {
      console.log(page);
      return page.label.toLowerCase().includes(searchValue.toLowerCase());
    });
  };
  const pages = [
    { name: "all", label: "All", icon: <SearchOutlinedIcon /> },
    { name: "pages", label: "Pages", icon: <DescriptionOutlinedIcon /> },
    { name: "properties", label: "Properties", icon: <HomeWorkOutlinedIcon /> },
    { name: "units", label: "Units", icon: <WeekendOutlinedIcon /> },
    {
      name: "maintenance",
      label: " Requests",
      icon: <HandymanOutlinedIcon />,
    },
    {
      name: "rental",
      label: " Applications",
      icon: <ReceiptLongOutlinedIcon />,
    },
    { name: "transactions", label: "Transactions", icon: <PaidOutlinedIcon /> },
    { name: "tenants", label: "Tenants", icon: <PeopleAltOutlinedIcon /> },
  ];

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
      textTransform: "none",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-selected": {
        color: "#fff",
      },
      "&.Mui-focusVisible": {
        backgroundColor: uiGreen,
      },
    })
  );
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };

  const handleClearClick = () => {
    setSearchValue("");
  };
  const handleSearchChange = (event) => {
    if (event.target.value === "") {
      setProperties([]);
    }
    setSearchValue(event.target.value);
    //Search for the properties using the GEt request funtion on the authenticated instance using the endpoint /properties/?search=
    authenticatedInstance.get(`/properties/?search=${event.target.value}`).then(
      (res) => {
        if (res.data.results) {
          setProperties(res.data.results);
        } else {
          setProperties(res.data);
        }
      },
      (err) => {
        console.error(err);
      }
    );
    //Search for units using the get request function on the authenticated instance using the endpoint /units/?search=
    authenticatedInstance.get(`/units/?search=${event.target.value}`).then(
      (res) => {
        if (res.data.results) {
          setUnits(res.data.results);
        } else {
          setUnits(res.data);
        }
      },
      (err) => {
        console.error(err);
      }
    );
    //Search for maintenance requests using the get request function on the authenticated instance using the endpoint /maintenance/?search=
    authenticatedInstance
      .get(`/maintenance-requests/?search=${event.target.value}`)
      .then((res) => {
        if (res.data.results) {
          setMaintenanceRequests(res.data.results);
        } else {
          setMaintenanceRequests(res.data);
        }
      });
    // //Search for rental applications using the get request function on the authenticated instance using the endpoint /rental/?search=
    authenticatedInstance
      .get(`/rental-applications/?search=${event.target.value}`)
      .then((res) => {
        if (res.data.results) {
          setRentalApplications(res.data.results);
        } else {
          setRentalApplications(res.data);
        }
      });
    // //Search for transactions using the get request function on the authenticated instance using the endpoint /transactions/?search=
    authenticatedInstance
      .get(`/transactions/?search=${event.target.value}`)
      .then((res) => {
        if (res.data.results) {
          setTransactions(res.data.results);
        } else {
          setTransactions(res.data);
        }
      });
  };
  //Check if each array of units matches an array of properties
  const checkIfUnitMatchesProperty = (unit, property) => {
    if (unit.rental_property === property.id) {
      return true;
    } else {
      return false;
    }
  };
  //Check if tenant matches a maintenance request
  const checkIfTenantMatchesMaintenanceRequest = (
    tenant,
    maintenance_request
  ) => {
    if (tenant.id === maintenance_request.tenant) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    getLandlordTenants().then((res) => {
      setTenants(res.data.tenants);
    });
    getLandlordUnits().then((res) => {
      setAllUnits(res.data);
    });
    getProperties().then((res) => {
      setAllProperties(res.data);
    });
  }, []);
  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: uiGrey1,
            boxShadow: "none",
          },
        }}
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <div
          style={{
            width: "100px",
            position: "absolute",
            left: "30px",
            top: "10px",
            color: uiGreen,
          }}
        >
          <IconButton
            sx={{ color: "white" }}
            edge="start"
            color="inherit"
            onClick={props.handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="container py-5">
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            endAdornment={
              <IconButton
                onClick={handleClearClick}
                sx={{
                  visibility: searchValue ? "visible" : "hidden",
                  color: "white",
                }}
              >
                <CloseIcon sx={{ color: "white" }} />
              </IconButton>
            }
            id="input-with-icon-textfield"
            placeholder="Looking For Something?"
            sx={{
              fontSize: "30pt",
              p: 2,
              "&.Mui-focused .MuiIconButton-root": { color: uiGreen },
              color: "white",
            }}
            fullWidth
            variant="standard"
          />
          <Box
            sx={{
              color: "white",
              marginTop: 2,
              marginBottom: 2,
            }}
          >
            <StyledTabs
              value={tabPage}
              onChange={handleChangeTabPage}
              variant="fullWidth"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {pages.map((page) => (
                <StyledTab
                  key={page.name}
                  label={page.label}
                  icon={page.icon}
                />
              ))}
            </StyledTabs>
          </Box>

          {!searchValue ? (
            <div>
              <h2 className="mt-4">Quick Links</h2>
              <div className="row">
                {landlordMenuItems.map((item) => {
                  if (item.isSearchable && !item.subMenuItems) {
                    return (
                      <SearchResultCard
                        to={item.link}
                        handleClose={props.handleClose}
                        gridSize={4}
                        key={item.name}
                        title={item.label}
                        subtitle={item.description}
                        icon={item.muiIcon}
                      />
                    );
                  }
                })}
              </div>
              <h2>Recently Views</h2>
            </div>
          ) : (
            <>
              {((dashboardPages.length > 0 && tabPage === 0) ||
                tabPage === 1) && (
                <div id="properties" style={{ overflow: "hidden" }}>
                  <h2>Pages ({dashboardPages.length})</h2>
                  <div className="row">
                    {filterDashboardPages().map((page) => (
                      <SearchResultCard
                        to={page.link}
                        handleClose={props.handleClose}
                        gridSize={4}
                        key={page.name}
                        title={page.label}
                        subtitle={page.description}
                        icon={page.muiIcon}
                      />
                    ))}
                  </div>
                  <Button
                    sx={{
                      color: `${uiGreen} !important`,
                      textTransform: "none",
                      fontSize: "12pt",
                      margin: "20px 0 !important",
                      float: "right !important",
                    }}
                  >
                    See All
                  </Button>
                </div>
              )}
              {((properties.length > 0 && tabPage === 0) || tabPage === 2) && (
                <div id="properties">
                  <h2>Properties ({properties.length})</h2>
                  <div className="row">
                    {properties.map((property) => (
                      <SearchResultCard
                        to={`/dashboard/landlord/properties/${property.id}`}
                        handleClose={props.handleClose}
                        gridSize={4}
                        key={property.id}
                        title={property.name}
                        description={`${property.street}, ${property.city}, ${property.state} ${property.zip_code}`}
                        icon={
                          <HomeWorkOutlinedIcon
                            style={{ width: "30px", height: "30px" }}
                          />
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
              {((units.length > 0 && tabPage === 0) || tabPage === 3) && (
                <div id="units">
                  <h2>Units ({units.length})</h2>
                  <div className="row">
                    {units.map((unit) => (
                      <SearchResultCard
                        to={`/dashboard/landlord/units/${unit.id}/${unit.rental_property}`}
                        gridSize={4}
                        key={unit.id}
                        handleClose={props.handleClose}
                        title={unit.name}
                        subtitle={
                          <>
                            {allProperties.map((property) => {
                              if (checkIfUnitMatchesProperty(unit, property)) {
                                return property.name;
                              }
                            })}
                          </>
                        }
                        icon={
                          <WeekendOutlinedIcon
                            style={{ width: "30px", height: "30px" }}
                          />
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
              {((maintenanceRequests.length > 0 && tabPage === 0) ||
                tabPage === 4) && (
                <div id="maintenance">
                  <h2>Maintenance Requests ({maintenanceRequests.length})</h2>
                  <div className="row">
                    {maintenanceRequests.map((maintenance_request) => {
                      let tenant = //Retrieve the tenant information for the maintenance request
                        tenants.filter((tenant) =>
                          checkIfTenantMatchesMaintenanceRequest(
                            tenant,
                            maintenance_request
                          )
                        )[0];
                      return (
                        <SearchResultCard
                          to={`/dashboard/landlord/maintenance-requests/${maintenance_request.id}`}
                          key={maintenance_request.id}
                          gridSize={6}
                          handleClose={props.handleClose}
                          title={`Maintenanace Request from ${tenant.first_name} ${tenant.last_name}`}
                          subtitle={`${maintenance_request.description}`}
                          icon={
                            <HandymanOutlinedIcon
                              style={{ width: "30px", height: "30px" }}
                            />
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              {((rentalApplications.length > 0 && tabPage === 0) ||
                tabPage === 5) && (
                <div id="rental">
                  <h2>Rental Applications ({rentalApplications.length})</h2>
                  <div className="row">
                    {rentalApplications.map((rental_application) => {
                      //Retrive unit information for the rental application
                      const unit = allUnits.filter(
                        (unit) => unit.id === rental_application.unit
                      )[0];
                      const property = allProperties.filter(
                        (property) => property.id === unit.rental_property
                      )[0];
                      let property_name = property.name;
                      let unit_name = unit.name;

                      return (
                        <SearchResultCard
                          to={`/dashboard/landlord/rental-applications/${rental_application.id}`}
                          key={rental_application.id}
                          handleClose={props.handleClose}
                          title={`${rental_application.first_name} ${rental_application.last_name}`}
                          gridSize={4}
                          subtitle={
                            <>
                              For Unit {unit_name} at {property_name} |{" "}
                              {rental_application.is_approved ? (
                                <span style={{ color: uiGreen }}>Approved</span>
                              ) : (
                                ""
                              )}{" "}
                            </>
                          }
                          icon={
                            <ReceiptLongOutlinedIcon
                              style={{ width: "30px", height: "30px" }}
                            />
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              {((transactions.length > 0 && tabPage === 0) ||
                tabPage === 6) && (
                <div id="transactions">
                  <h2>Transactions ({transactions.length})</h2>
                  <div className="row">
                    {transactions.map((transaction) => (
                      <SearchResultCard
                        to={`/dashboard/landlord/transactions/${transaction.id}`}
                        key={transaction.id}
                        handleClose={props.handleClose}
                        gridSize={12}
                        title={
                          <>
                            {transaction.type === "revenue" && (
                              <span style={{ color: uiGreen }}>
                                +${transaction.amount}
                              </span>
                            )}{" "}
                            {transaction.type === "expense" && (
                              <span style={{ color: "red" }}>
                                -${transaction.amount}
                              </span>
                            )}
                          </>
                        }
                        subtitle={`${
                          new Date(transaction.created_at)
                            .toISOString()
                            .split("T")[0]
                        }`}
                        description={transaction.description}
                        icon={
                          <PaidOutlinedIcon
                            style={{ width: "30px", height: "30px" }}
                          />
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
              {filterTenants().length > 0 &&
                (tabPage === 0 || tabPage === 7) && (
                  <div id="tenants">
                    <h2>Tenants ({filterTenants().length})</h2>
                    <div className="row">
                      {filterTenants().map((tenant) => (
                        <SearchResultCard
                          to={`/dashboard/landlord/tenants/${tenant.id}`}
                          key={tenant.id}
                          gridSize={4}
                          handleClose={props.handleClose}
                          title={`${tenant.first_name} ${tenant.last_name}`}
                          subtitle={`${tenant.email}`}
                          icon={
                            <PeopleAltOutlinedIcon
                              style={{ width: "30px", height: "30px" }}
                            />
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
