import React, { Fragment, useState } from "react";
import SearchResultCard from "../SearchResultCard";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { uiGreen } from "../../../../../../constants";
import { useSearch } from "../../../../../../contexts/SearchContext";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import ResultsHeader from "./Pagination/ResultsHeader";
import UIPrompt from "../../../UIPrompt";
import { authenticatedInstance } from "../../../../../../api/api";
import AlertModal from "../../AlertModal";
import UIProgressPrompt from "../../../UIProgressPrompt";
const AllPropertyResults = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(`/properties/`);
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
  }, [props.searchValue, endpoint]);
  return (
    <div>
      <AlertModal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        title={alertTitle}
        message={alertMessage}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div id="properties" style={{ overflow: "hidden" }}>
        <div className="row">
          {isLoading ? (
            <UIProgressPrompt
              title="Loading Properties"
              message="Please wait while we retrieve your properties."
            />
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
                    searchLimit={limit}
                    changeSearchLimit={setLimit}
                  />
                  {searchResults.map((property, index) => (
                    <SearchResultCard
                      dataTestId={`property-search-result-${index}`}
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
