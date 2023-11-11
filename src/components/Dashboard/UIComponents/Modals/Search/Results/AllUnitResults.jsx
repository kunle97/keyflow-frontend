import React, { Fragment, useEffect, useState } from "react";
import { uiGreen } from "../../../../../../constants";
import { Box, CircularProgress } from "@mui/material";
import { getProperties } from "../../../../../../api/properties";
import SearchResultCard from "../SearchResultCard";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import { checkIfUnitMatchesProperty } from "../../../../../../helpers/utils";
import { useSearch } from "../../../../../../contexts/SearchContext";
import ResultsHeader from "./Pagination/ResultsHeader";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import UIPrompt from "../../../UIPrompt";
const AllUnitResults = (props) => {
  const [allProperties, setAllProperties] = useState([]);
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
    changeEndpoint(`/units/`);
    changeSearchLimit(9);
    search();
    getProperties().then((res) => {
      setAllProperties(res.data);
    });
  }, [searchQuery, props.searchValue]);

  return (
    <div>
      <div id="units" style={{ overflow: "hidden" }}>
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
                    message="No units found. Try adjusting your search filters."
                    icon={
                      <WeekendOutlinedIcon
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
                    title="Units"
                    resultCount={resultCount}
                    refresh={search}
                    searchLimit={searchLimit}
                    changeSearchLimit={changeSearchLimit}
                  />
                  {searchResults.map((unit) => (
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

export default AllUnitResults;
