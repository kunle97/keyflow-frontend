import React, { useState } from "react";
import { useSearch } from "../../../../../../contexts/SearchContext";
import { Box, CircularProgress } from "@mui/material";
import { Fragment } from "react";
import ResultsHeader from "./Pagination/ResultsHeader";
import SearchResultCard from "../SearchResultCard";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { uiGreen } from "../../../../../../constants";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import { useEffect } from "react";
import UIPrompt from "../../../UIPrompt";
import { authenticatedInstance } from "../../../../../../api/api";
import AlertModal from "../../AlertModal";
import UIProgressPrompt from "../../../UIProgressPrompt";
const AllTransactionResults = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(`/transactions/`);
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
              title="Loading Transactions"
              message="Please wait while we retrieve your transactions."
            />
          ) : (
            <Fragment>
              {resultCount === 0 ? (
                <div className="col-12">
                  <UIPrompt
                    title="No Results"
                    message="No transactions found. Try adjusting your search filters."
                    icon={
                      <PaidOutlinedIcon
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
                    title="Transactions"
                    resultCount={resultCount}
                    refresh={search}
                    searchLimit={limit}
                    changeSearchLimit={setLimit}
                  />
                  {searchResults.map((transaction, index) => {
                    return (
                      <SearchResultCard
                        dataTestId={`transaction-search-result-${index}`}
                        to={`/dashboard/landlord/transactions/${transaction.id}`}
                        key={transaction.id}
                        handleClose={props.handleClose}
                        gridSize={12}
                        title={
                          <>
                            <span style={{ color: uiGreen }}>
                              ${parseFloat(transaction.amount)}
                            </span>
                          </>
                        }
                        subtitle={`${
                          new Date(transaction.timestamp).toLocaleDateString(
                            "en-US"
                          ) +
                          " " +
                          new Date(transaction.timestamp).toLocaleTimeString(
                            "en-US"
                          )
                        }`}
                        description={transaction.description}
                        icon={
                          <PaidOutlinedIcon
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

export default AllTransactionResults;
