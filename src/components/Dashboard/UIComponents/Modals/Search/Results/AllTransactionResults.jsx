import React from "react";
import { useSearch } from "../../../../../../contexts/SearchContext";
import { Box, CircularProgress } from "@mui/material";
import { Fragment } from "react";
import ResultsHeader from "./Pagination/ResultsHeader";
import SearchResultCard from "../SearchResultCard";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { uiGreen } from "../../../../../../constants";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import { useEffect } from "react";
const AllTransactionResults = (props) => {
  const {
    searchQuery,
    searchResults,
    searchResultsBatch,
    search,
    setSearchQuery,
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
    changeEndpoint(`/transactions/`);
    changeSearchLimit(6);
    setSearchQuery(props.searchValue);
    search();
  }, [searchQuery, props.searchValue]);
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
                  <h3>No Results</h3>
                </div>
              ) : (
                <Fragment>
                  <ResultsHeader
                    title="Transactions"
                    resultCount={resultCount}
                    refresh={search}
                    searchLimit={searchLimit}
                    changeSearchLimit={changeSearchLimit}
                  />
                  {searchResults.map((transaction) => {
                    return (
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