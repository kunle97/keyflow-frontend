import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { Box, Button, Input } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@material-ui/core";
import { authUser, uiGreen } from "../../../../../constants";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DescriptionIcon from "@mui/icons-material/Description";
import WeekendIcon from "@mui/icons-material/Weekend";
import HandymanIcon from "@mui/icons-material/Handyman";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaidIcon from "@mui/icons-material/Paid";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SearchResultCard from "./SearchResultCard";
import { useCallback } from "react";
import { authenticatedInstance } from "../../../../../api/api";
import { getProperties } from "../../../../../api/properties";
import { routes } from "../../../../../routes";
import {
  filterDashboardPages,
  filterTenants,
  checkIfUnitMatchesProperty,
  checkIfTenantMatchesMaintenanceRequest,
} from "../../../../../helpers/utils";
import AllPageResults from "./Results/AllPageResults";
import AllProprertyResults from "./Results/AllPropertyResults";
import AllTenantResults from "./Results/AllTenantResults";
import AllTransactionResults from "./Results/AllTransactionResults";
import AllMaintenanceRequesResults from "./Results/AllMaintenanceRequestResults";
import AllUnitResults from "./Results/AllUnitResults";
import AllRentalApplicationResults from "./Results/AllRentalApplicationResults";
import UITabs from "../../UITabs";
import UIPrompt from "../../UIPrompt";
import useScreen from "../../../../../hooks/useScreen";
import AlertModal from "../AlertModal";
import UIProgressPrompt from "../../UIProgressPrompt";
const SearchDialog = (props) => {
  //Create a useCallback version of the Transition component
  const Transition = useCallback(
    React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    }),
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const { isMobile } = useScreen();
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [allProperties, setAllProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [searchValue, setSearchValue] = useState(
    props.query ? props.query : null
  );
  const [tabPage, setTabPage] = useState(0);
  const [properties, setProperties] = useState([]);
  const [propertyResultCount, setPropertyResultCount] = useState(0);
  const [units, setUnits] = useState([]);
  const [unitResultCount, setUnitResultCount] = useState(0);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [maintenanceRequestResultCount, setMaintenanceRequestResultCount] =
    useState(0);
  const [rentalApplications, setRentalApplications] = useState([]);
  const [rentalApplicationResultCount, setRentalApplicationResultCount] =
    useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionResultCount, setTransactionResultCount] = useState(0);
  const [searchResultLimit, setSearchResultLimit] = useState(6);

  const pages = [
    {
      name: "all",
      label: "All",
      icon: <SearchIcon />,
      dataTestId: "all-search-tab",
    },
    {
      name: "pages",
      label: "Pages",
      icon: <DescriptionIcon />,
      dataTestId: "pages-search-tab",
    },
    {
      name: "properties",
      label: "Properties",
      icon: <HomeWorkIcon />,
      dataTestId: "properties-search-tab",
    },
    {
      name: "units",
      label: "Units",
      icon: <WeekendIcon />,
      dataTestId: "units-search-tab",
    },
    {
      name: "maintenance",
      label: "Requests",
      icon: <HandymanIcon />,
      dataTestId: "maintenance-request-search-tab",
    },
    {
      name: "rental",
      label: " Applications",
      icon: <ReceiptLongIcon />,
      dataTestId: "rental-application-search-tab",
    },
    {
      name: "transactions",
      label: "Transactions",
      icon: <PaidIcon />,
      dataTestId: "transactions-search-tab",
    },
    {
      name: "tenants",
      label: "Tenants",
      icon: <PeopleAltIcon />,
      dataTestId: "tenants-search-tab",
    },
  ];

  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };

  const handleClearClick = () => {
    setSearchValue("");
  };
  const handleSearchChange = (event) => {
    setIsSearching(true);
    if (event.target.value === "") {
      setProperties([]);
    }
    try {
      authenticatedInstance
        .get(`/owners/${authUser.owner_id}/tenants/`)
        .then((res) => {
          setTenants(res.data);
        });
      getProperties().then((res) => {
        setAllProperties(res.data);
      });
      setSearchValue(event.target.value);
      //Search for the properties using the GEt request funtion on the authenticated instance using the endpoint /properties/?search=
      authenticatedInstance
        .get(
          `/properties/?search=${event.target.value}&limit=${searchResultLimit}`
        )
        .then(
          (res) => {
            if (res.data.results) {
              setProperties(res.data.results);
              setPropertyResultCount(res.data.count);
            } else {
              setProperties(res.data);
            }
          },
          (err) => {
            console.error(err);
          }
        );
      //Search for units using the get request function on the authenticated instance using the endpoint /units/?search=
      authenticatedInstance
        .get(`/units/?search=${event.target.value}&limit=${searchResultLimit}`)
        .then(
          (res) => {
            if (res.data.results) {
              setUnits(res.data.results);
              setUnitResultCount(res.data.count);
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
        .get(
          `/maintenance-requests/?search=${event.target.value}&limit=${searchResultLimit}`
        )
        .then((res) => {
          if (res.data.results) {
            setMaintenanceRequests(res.data.results);
            setMaintenanceRequestResultCount(res.data.count);
          } else {
            setMaintenanceRequests(res.data);
          }
        });
      // //Search for rental applications using the get request function on the authenticated instance using the endpoint /rental/?search=
      authenticatedInstance
        .get(
          `/rental-applications/?search=${event.target.value}&limit=${searchResultLimit}`
        )
        .then((res) => {
          if (res.data.results) {
            setRentalApplications(res.data.results);
            setRentalApplicationResultCount(res.data.count);
          } else {
            setRentalApplications(res.data);
          }
        });
      // //Search for transactions using the get request function on the authenticated instance using the endpoint /transactions/?search=
      authenticatedInstance
        .get(
          `/transactions/?search=${event.target.value}&limit=${searchResultLimit}`
        )
        .then((res) => {
          if (res.data.results) {
            setTransactions(res.data.results);
            setTransactionResultCount(res.data.count);
          } else {
            setTransactions(res.data);
          }
        });
    } catch (err) {

      setShowAlert(true);
      setAlertTitle("Error");
      setAlertMessage("An error occurred while searching");
    } finally {
      setIsSearching(false);
    }
  };
  // Group routes by category
  const groupedRoutes = routes.reduce((acc, item) => {
    if (item.isSearchable && !item.subMenuItems) {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
    }
    return acc;
  }, {});

  return (
    <div>
      <AlertModal
        title={alertTitle}
        message={alertMessage}
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
        }}
      />
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "#f4f7f8",
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
            data-testId="close-search-dialog"
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
            data-testId="search-dialog-input"
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
                <CloseIcon sx={{ color: uiGreen }} />
              </IconButton>
            }
            id="input-with-icon-textfield"
            placeholder="Looking For Something?"
            sx={{
              p: 2,
              "&.Mui-focused .MuiIconButton-root": { color: uiGreen },
              color: "black",
              //have the place holder font size be smaller on mobile
              fontSize: isMobile ? "15pt" : "30pt",
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
            <UITabs
              value={tabPage}
              handleChange={handleChangeTabPage}
              tabs={pages}
              scrollButtons="false"
              ariaLabel="scrollable auto tabs example"
            />
          </Box>
          {isSearching ? (
            <>
              <UIProgressPrompt
                title="One Moment Please"
                message="Searching for your results..."
              />
            </>
          ) : (
            <>
              {!searchValue ? (
                <div>
                  {/* <h2 className="mt-4 text-black">Quick Links</h2> */}
                  <div className="row">
                    {Object.entries(groupedRoutes).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="mt-4 text-black">{category}</h3>
                        <div className="row">
                          {items.map((item) => (
                            <SearchResultCard
                              to={item.path}
                              handleClose={props.handleClose}
                              gridSize={4}
                              key={item.path}
                              title={item.label}
                              subtitle={item.description}
                              icon={item.muiIcon}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="container">
                  <div className="row">
                    {tabPage === 0 &&
                      properties.length === 0 &&
                      units.length === 0 &&
                      maintenanceRequests.length === 0 &&
                      rentalApplications.length === 0 &&
                      transactions.length === 0 &&
                      filterTenants(tenants, searchValue).length === 0 && (
                        <>
                          <UIPrompt
                            title="No Results"
                            message="No results found. Try adjusting your search filters."
                            icon={
                              <SearchIcon
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  color: uiGreen,
                                }}
                              />
                            }
                          />
                        </>
                      )}
                    {filterDashboardPages(routes, searchValue).length >
                      0 &&
                      tabPage === 0 && (
                        <div id="pages" style={{ overflow: "hidden" }}>
                          <h2 className="text-black">
                            Pages (
                            {
                              routes.filter(
                                (page) =>
                                  page.isSearchable &&
                                  page.label
                                    .toLowerCase()
                                    .includes(searchValue.toLowerCase())
                              ).length
                            }
                            )
                          </h2>
                          <div className="row">
                            {filterDashboardPages(routes, searchValue)
                              .splice(0, searchResultLimit)
                              .map((page) => (
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
                            onClick={() => {
                              setTabPage(1);
                            }}
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
                    {properties.length > 0 && tabPage === 0 && (
                      <div id="properties" style={{ overflow: "hidden" }}>
                        <h2 className="text-black">
                          Properties ({propertyResultCount})
                        </h2>
                        <div className="row">
                          {properties.map((property) => (
                            <SearchResultCard
                              to={`/dashboard/owner/properties/${property.id}`}
                              handleClose={props.handleClose}
                              gridSize={4}
                              key={property.id}
                              title={property.name}
                              description={`${property.street}, ${property.city}, ${property.state} ${property.zip_code}`}
                              icon={
                                <HomeWorkIcon
                                  style={{ width: "30px", height: "30px" }}
                                />
                              }
                            />
                          ))}
                        </div>
                        <Button
                          onClick={() => {
                            setTabPage(2);
                          }}
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
                    {units.length > 0 && tabPage === 0 && (
                      <div id="units" style={{ overflow: "hidden" }}>
                        <h2 className="text-black">
                          Units ({unitResultCount})
                        </h2>
                        <div className="row">
                          {units.map((unit) => (
                            <SearchResultCard
                              to={`/dashboard/owner/units/${unit.id}/${unit.rental_property}`}
                              gridSize={4}
                              key={unit.id}
                              handleClose={props.handleClose}
                              title={unit.name}
                              subtitle={
                                <>
                                  {allProperties.map((property) => {
                                    if (
                                      checkIfUnitMatchesProperty(unit, property)
                                    ) {
                                      return property.name;
                                    }
                                  })}
                                </>
                              }
                              icon={
                                <WeekendIcon
                                  style={{ width: "30px", height: "30px" }}
                                />
                              }
                            />
                          ))}
                        </div>
                        <Button
                          onClick={() => {
                            setTabPage(3);
                          }}
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
                    {maintenanceRequests.length > 0 && tabPage === 0 && (
                      <div id="maintenance" style={{ overflow: "hidden" }}>
                        <h2 className="text-black">
                          Maintenance Requests ({maintenanceRequestResultCount})
                        </h2>
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
                                to={`/dashboard/owner/maintenance-requests/${maintenance_request.id}`}
                                key={maintenance_request.id}
                                gridSize={6}
                                handleClose={props.handleClose}
                                title={`Maintenanace Request from ${maintenance_request.tenant.user.first_name} ${maintenance_request.tenant.user.last_name}`}
                                subtitle={`${maintenance_request.description}`}
                                icon={
                                  <HandymanIcon
                                    style={{ width: "30px", height: "30px" }}
                                  />
                                }
                              />
                            );
                          })}
                        </div>
                        <Button
                          onClick={() => {
                            setTabPage(4);
                          }}
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
                    {rentalApplications.length > 0 && tabPage === 0 && (
                      <div id="rental" style={{ overflow: "hidden" }}>
                        <h2 className="text-black">
                          Rental Applications ({rentalApplicationResultCount})
                        </h2>
                        <div className="row">
                          {rentalApplications.map((rental_application) => {
                            //Retrive unit information for the rental application
                            // const unit = allUnits.filter(
                            //   (unit) => unit.id === rental_application.unit
                            // )[0];
                            let unit_name = rental_application.unit.name;
                            let property_name =
                              rental_application.unit.rental_property_name;

                            return (
                              <SearchResultCard
                                to={`/dashboard/owner/rental-applications/${rental_application.id}`}
                                key={rental_application.id}
                                handleClose={props.handleClose}
                                title={`${rental_application.first_name} ${rental_application.last_name}`}
                                gridSize={4}
                                subtitle={
                                  <>
                                    For Unit {unit_name} at {property_name} |{" "}
                                    {rental_application.is_approved ? (
                                      <span style={{ color: uiGreen }}>
                                        Approved
                                      </span>
                                    ) : (
                                      ""
                                    )}{" "}
                                  </>
                                }
                                icon={
                                  <ReceiptLongIcon
                                    style={{ width: "30px", height: "30px" }}
                                  />
                                }
                              />
                            );
                          })}
                        </div>
                        <Button
                          onClick={() => {
                            setTabPage(5);
                          }}
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
                    {transactions.length > 0 && tabPage === 0 && (
                      <div id="transactions" style={{ overflow: "hidden" }}>
                        <h2 className="text-black">
                          Transactions ({transactionResultCount})
                        </h2>
                        <div className="row">
                          {transactions.map((transaction) => (
                            <SearchResultCard
                              to={`/dashboard/owner/transactions/${transaction.id}`}
                              key={transaction.id}
                              handleClose={props.handleClose}
                              gridSize={12}
                              title={
                                <>
                                  <span style={{ color: uiGreen }}>
                                    ${transaction.amount}
                                  </span>
                                </>
                              }
                              subtitle={`${
                                new Date(
                                  transaction.timestamp
                                ).toLocaleDateString() +
                                " " +
                                new Date(
                                  transaction.timestamp
                                ).toLocaleTimeString()
                              }`}
                              description={transaction.description}
                              icon={
                                <PaidIcon
                                  style={{ width: "30px", height: "30px" }}
                                />
                              }
                            />
                          ))}
                        </div>
                        <Button
                          onClick={() => {
                            setTabPage(6);
                          }}
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
                    {filterTenants(tenants, searchValue).length > 0 &&
                      tabPage === 0 && (
                        <div id="tenants" style={{ overflow: "hidden" }}>
                          <h2 className="text-black">
                            Tenants (
                            {filterTenants(tenants, searchValue).length})
                          </h2>
                          <div className="row">
                            {filterTenants(tenants, searchValue)
                              .splice(0, searchResultLimit)
                              .map((tenant) => (
                                <SearchResultCard
                                  to={`/dashboard/owner/tenants/${tenant.id}`}
                                  key={tenant.id}
                                  gridSize={4}
                                  handleClose={props.handleClose}
                                  title={`${tenant.user.first_name} ${tenant.user.last_name}`}
                                  subtitle={`${tenant.user.email}`}
                                  icon={
                                    <PeopleAltIcon
                                      style={{ width: "30px", height: "30px" }}
                                    />
                                  }
                                />
                              ))}
                          </div>
                          <Button
                            onClick={() => {
                              setTabPage(7);
                            }}
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
                    <div id="see-all-results-pages">
                      {tabPage === 1 && (
                        <AllPageResults
                          searchValue={searchValue}
                          handleClose={props.handleClose}
                        />
                      )}
                      {tabPage === 2 && (
                        <AllProprertyResults
                          searchValue={searchValue}
                          setSearchValue={setSearchValue}
                          handleClose={props.handleClose}
                        />
                      )}
                      {tabPage === 3 && (
                        <AllUnitResults
                          searchValue={searchValue}
                          handleClose={props.handleClose}
                        />
                      )}
                      {tabPage === 4 && (
                        <AllMaintenanceRequesResults
                          searchValue={searchValue}
                          tenants={tenants}
                          handleClose={props.handleClose}
                        />
                      )}
                      {tabPage === 5 && (
                        <AllRentalApplicationResults
                          searchValue={searchValue}
                          handleClose={props.handleClose}
                        />
                      )}
                      {tabPage === 6 && (
                        <AllTransactionResults
                          searchValue={searchValue}
                          handleClose={props.handleClose}
                        />
                      )}
                      {tabPage === 7 && (
                        <AllTenantResults
                          searchValue={searchValue}
                          handleClose={props.handleClose}
                        />
                      )}
                    </div>
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
