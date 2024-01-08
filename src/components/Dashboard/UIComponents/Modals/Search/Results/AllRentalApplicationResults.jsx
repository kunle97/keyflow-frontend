import React, { useState } from "react";
import ResultsHeader from "./Pagination/ResultsHeader";
import { Box, CircularProgress } from "@mui/material";
import { Fragment } from "react";
import SearchResultCard from "../SearchResultCard";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import { authUser, uiGreen } from "../../../../../../constants";
import { useSearch } from "../../../../../../contexts/SearchContext";
import { useEffect } from "react";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import UIPrompt from "../../../UIPrompt";
const AllRentalApplicationResults = (props) => {
  const batchEndpoints = [
    {
      name: "properties",
      endpoint: `/users/${authUser.id}/properties/`,
      limit: 10,
      query: null,
    },
    {
      name: "units",
      endpoint: `/users/${authUser.id}/units/`,
      limit: 10,
      query: null,
    },
  ];
  const [allProperties, setAllProperties] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const {
    searchQuery,
    searchResults,
    search,
    searchResultsBatch,
    isLoading,
    changeEndpoint,
    changeSearchLimit,
    setSearchQuery,
    nextPageEndPoint,
    previousPageEndPoint,
    nextPage,
    previousPage,
    resultCount,
    searchLimit,
    changeEndpointBatch,
  } = useSearch();

  useEffect(() => {
    setSearchQuery(props.searchValue);
    changeEndpoint(`/rental-applications/`);
    changeSearchLimit(6);
    search();
  }, [searchQuery, props.searchValue]);

  useEffect(() => {
    console.log("searchResultsBatch", searchResultsBatch);
  }, []);

  return (
    <div>
      <div id="rental-applications" style={{ overflow: "hidden" }}>
        <div className="row">
          {isLoading ? (
            <Box sx={{ display: "flex" }}>
              <Box sx={{ margin: "55px auto" }}>
                <CircularProgress sx={{ color: uiGreen }} />
              </Box>
            </Box>
          ) : (
            <Fragment>
              {resultCount === 0 ? (
                <div className="col-12">
                  <UIPrompt
                    title="No Results"
                    message="No rental applications found. Try adjusting your search filters."
                    icon={
                      <ReceiptLongOutlinedIcon
                        style={{
                          width: "50px",
                          height: "50px",
                          color: uiGreen,
                        }}
                      />
                    }
                  />
                </div>
              ) : (
                <Fragment>
                  <ResultsHeader
                    title="Rental Applications"
                    resultCount={resultCount}
                    refresh={search}
                    searchLimit={searchLimit}
                    changeSearchLimit={changeSearchLimit}
                  />
                  {searchResults &&
                    searchResults.map((rental_application) => {
                      //Retrive unit information for the rental application
                      // const unit = allUnits.filter(
                      //   (unit) => unit.id === rental_application.unit
                      // )[0];
                      // const property = allProperties.filter(
                      //   (property) => property.id === unit.rental_property
                      // )[0];
                      // let property_name = property.name;
                      // let unit_name = unit.name;

                      return (
                        <SearchResultCard
                          to={`/dashboard/landlord/rental-applications/${rental_application.id}`}
                          key={rental_application.id}
                          handleClose={props.handleClose}
                          title={`${rental_application.first_name} ${rental_application.last_name}`}
                          gridSize={4}
                          subtitle={
                            rental_application.email
                            // <>
                            //   For Unit {unit_name} at {property_name} |{" "}
                            //   {rental_application.is_approved ? (
                            //     <span style={{ color: uiGreen }}>Approved</span>
                            //   ) : (
                            //     ""
                            //   )}{" "}
                            // </>
                          }
                          description={
                            rental_application.is_approved ? (
                              <span style={{ color: uiGreen }}>Approved</span>
                            ) : (
                              ""
                            )
                          }
                          icon={
                            <ReceiptLongOutlinedIcon
                              style={{ width: "30px", height: "30px" }}
                            />
                          }
                        />
                      );
                    })}
                  <ResultsPageControl
                    previousPageEndPoint={previousPageEndPoint}
                    nextPageEndPoint={nextPageEndPoint}
                    previousPageClick={previousPage}
                    nextPageClick={nextPage}
                  />
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRentalApplicationResults;
