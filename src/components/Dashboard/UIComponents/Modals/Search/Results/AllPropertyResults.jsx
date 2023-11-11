import React, { Fragment } from "react";
import SearchResultCard from "../SearchResultCard";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import { useEffect } from "react";
import {
  Box,
  CircularProgress,
} from "@mui/material";
import { uiGreen } from "../../../../../../constants";
import { useSearch } from "../../../../../../contexts/SearchContext";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import ResultsHeader from "./Pagination/ResultsHeader";
import UIPrompt from "../../../UIPrompt";
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
                  <UIPrompt
                    title="No Results"
                    message="No properties found. Try adjusting your search filters."
                    icon={
                      <HomeWorkOutlinedIcon 
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
