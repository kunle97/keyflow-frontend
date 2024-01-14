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
import { authenticatedInstance } from "../../../../../../api/api";
import AlertModal from "../../AlertModal";
const AllUnitResults = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(`/units/`);
  const [resultCount, setResultCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchResults, setSearchResults] = useState([]);
  const [nextPageEndPoint, setNextPageEndPoint] = useState(null);
  const [previousPageEndPoint, setPreviousPageEndPoint] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const nextPage = () => {
    setEndpoint(nextPageEndPoint);
  };

  const previousPage = () => {
    setEndpoint(previousPageEndPoint);
  };

  const search = () => {
    setIsLoading(true);
    authenticatedInstance
      .get(endpoint, {
        params: {
          search: props.searchValue,
          limit: limit,
        },
      })
      .then((response) => {
        setSearchResults(response.data.results);
        setResultCount(response.data.count);
        setNextPageEndPoint(response.data.next);
        setPreviousPageEndPoint(response.data.previous);
      })
      .catch((error) => {
        console.log(error);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occured retrieving properties: " + error.message
        );
        setOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    search();
  }, [props.searchValue, endpoint, limit]);

  return (
    <div>
      <AlertModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        title={alertTitle}
        message={alertMessage}
      />
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
                    searchLimit={limit}
                    changeSearchLimit={setLimit}
                  />
                  {searchResults.map((unit, index) => {
                    return (
                      <SearchResultCard
                        dataTestId={`unit-search-result-${index}`}
                        to={`/dashboard/landlord/units/${unit.id}/${unit.rental_property}`}
                        gridSize={4}
                        key={unit.id}
                        handleClose={props.handleClose}
                        title={unit.name}
                        subtitle={
                          <>
                            <span className="text-muted">
                              {unit.rental_property_name}
                            </span>
                            <br />
                            <span className="text-muted">
                              {unit.is_occupied ? "Occupied" : "Vacant"}
                            </span>
                          </>
                        }
                        icon={
                          <WeekendOutlinedIcon
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

export default AllUnitResults;
