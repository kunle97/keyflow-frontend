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
import { authenticatedInstance } from "../../../../../../api/api";
import AlertModal from "../../AlertModal";
import UIProgressPrompt from "../../../UIProgressPrompt";
const AllRentalApplicationResults = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(`/rental-applications/`);
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
        onClick={() => {
          setOpen(false);
        }}
      />
      <div id="rental-applications" style={{ overflow: "hidden" }}>
        <div className="row">
          {isLoading ? (
            <UIProgressPrompt
              title="Loading"
              message="Please wait while we retrieve your rental applications."
            />
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
                    searchLimit={limit}
                    changeSearchLimit={setLimit}
                  />
                  {searchResults &&
                    searchResults.map((rental_application, index) => {
                      return (
                        <SearchResultCard
                          dataTestId={`rental-application-search-result-${index}`}
                          to={`/dashboard/owner/rental-applications/${rental_application.id}`}
                          key={rental_application.id}
                          handleClose={props.handleClose}
                          title={`${rental_application.first_name} ${rental_application.last_name}`}
                          gridSize={4}
                          subtitle={rental_application.email}
                          description={
                            rental_application.is_approved ? (
                              <span style={{ color: uiGreen }}>Approved</span>
                            ) : (
                              <span className="text-warning">Pending</span>
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
