import React, { useState, Fragment } from "react";
import SearchResultCard from "../SearchResultCard";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import { useEffect } from "react";
import { authenticatedInstance } from "../../../../../../api/api";
import { set } from "react-hook-form";
import {
  Box,
  ButtonBase,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { uiGreen, uiGrey2 } from "../../../../../../constants";
import { ArrowBackOutlined, ArrowForwardOutlined } from "@mui/icons-material";
import { useSearch } from "../../../../../../contexts/SearchContext";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import ResultsHeader from "./Pagination/ResultsHeader";
const AllPropertyResults = (props) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    search,
    isLoading,
    changeEndpoint,
    changeSearchLimit,
    searchLimit,
    nextPageEndPoint,
    previousPageEndPoint,
    nextPage,
    previousPage,
    resultCount,
  } = useSearch();

  useEffect(() => {
    setSearchQuery(props.searchValue);
    changeEndpoint(`/properties/`);
    changeSearchLimit(6);
    search();
  }, [searchQuery, props.searchValue]);
  return (
    <div>
      <div id="properties" style={{ overflow: "hidden" }}>
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
                  <h3>No Results</h3>
                </div>
              ) : (
                <Fragment>
                  <ResultsHeader
                    title="Properties"
                    resultCount={resultCount}
                    refresh={search}
                    searchLimit={searchLimit}
                    changeSearchLimit={changeSearchLimit}
                  />
                  {searchResults.map((property) => (
                    <SearchResultCard
                      to={`/dashboard/landlord/properties/${property.id}`}
                      handleClose={props.handleClose}
                      gridSize={6}
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

export default AllPropertyResults;
