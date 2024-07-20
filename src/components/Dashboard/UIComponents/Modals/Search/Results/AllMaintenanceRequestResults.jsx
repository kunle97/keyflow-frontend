import React, { Fragment, useEffect, useState } from "react";
import { uiGreen } from "../../../../../../constants";
import SearchResultCard from "../SearchResultCard";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import ResultsHeader from "./Pagination/ResultsHeader";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import UIPrompt from "../../../UIPrompt";
import { authenticatedInstance } from "../../../../../../api/api";
import AlertModal from "../../AlertModal";
import UIProgressPrompt from "../../../UIProgressPrompt";
const AllMaintenanceRequestResults = (props) => {
  const [tenants, setTenants] = useState(props.tenants);
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(`/maintenance-requests/`);
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

        setAlertTitle("Error");
        setAlertMessage(
          "An error occured retrieving maintenance requests: " + error.message
        );
        setOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    search();
  }, [tenants, props.searchValue, endpoint]);

  return (
    <div>
      <AlertModal
        open={open}
        title={alertTitle}
        message={alertMessage}
        onClick={() => {
          setOpen(false);
        }}
      />

      <div id="maintenance-requests" style={{ overflow: "hidden" }}>
        <div className="row">
          {isLoading ? (
            <UIProgressPrompt
              title="Loading Maintenance Requests"
              message="Please wait while we retrieve your maintenance requests."
            />
          ) : (
            <Fragment>
              {resultCount === 0 ? (
                <div className="col-12">
                  <UIPrompt
                    title="No Results"
                    message="No maintenance requests found. Try adjusting your search filters."
                    icon={
                      <HandymanOutlinedIcon
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
                  {" "}
                  <ResultsHeader
                    title="Maintenance Requests"
                    resultCount={resultCount}
                    refresh={search}
                    searchLimit={limit}
                    changeSearchLimit={setLimit}
                  />
                  {searchResults.map((maintenance_request, index) => {

                    let status = <></>;
                    if (maintenance_request.status === "pending") {
                      status = <span className="text-warning">Pending</span>;
                    } else if (maintenance_request.status === "in_progress") {
                      status = <span className="text-info">In Progress</span>;
                    } else if (maintenance_request.status === "completed") {
                      status = <span className="text-success">Completed</span>;
                    }

                    return (
                      <SearchResultCard
                        dataTestId={`maintenance-request-search-result-${index}`}
                        to={`/dashboard/owner/maintenance-requests/${maintenance_request.id}/`}
                        gridSize={12}
                        key={maintenance_request.id}
                        handleClose={props.handleClose}
                        title={
                          maintenance_request.tenant.user
                            ? `Maintenanace Request from
                          ${maintenance_request.tenant.user.first_name}
                          ${maintenance_request.tenant.user.last_name}
                          `
                            : "Maintenanace Request"
                        }
                        subtitle={status}
                        description={
                          maintenance_request
                            ? `${maintenance_request.description}`
                            : "Click To View Details"
                        }
                        icon={
                          <HandymanOutlinedIcon
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

export default AllMaintenanceRequestResults;
