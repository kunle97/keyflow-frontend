import React, { Fragment, useEffect, useState } from "react";
import { uiGreen } from "../../../../../../constants";
import { Box, CircularProgress } from "@mui/material";
import SearchResultCard from "../SearchResultCard";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import { checkIfTenantMatchesMaintenanceRequest } from "../../../../../../helpers/utils";
import ResultsHeader from "./Pagination/ResultsHeader";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import { useGlobalSearch } from "../../../../../../hooks/useGlobalSearch";
import UIPrompt from "../../../UIPrompt";
const AllMaintenanceRequestResults = (props) => {
  // First instance of useSearch hook with its own endpoint
  const [tenants, setTenants] = useState(props.tenants);

  const {
    searchQuery,
    searchResults,
    search,
    isLoading,
    changeEndpoint,
    changeSearchLimit,
    setSearchQuery,
    searchLimit,
    nextPageEndPoint,
    previousPageEndPoint,
    nextPage,
    previousPage,
    resultCount,
  } = useGlobalSearch();

  useEffect(() => {
    setSearchQuery(props.searchValue);
    changeEndpoint(`/maintenance-requests/`);
    changeSearchLimit(10);
    search();
  }, [searchQuery, tenants, props.searchValue]);

  return (
    <div>
      <div id="maintenance-requests" style={{ overflow: "hidden" }}>
        <div className="row">
          {isLoading ? (
            <Box sx={{ display: "flex" }}>
              <Box m={"55px auto"}>
                <CircularProgress sx={{ color: uiGreen }} />
              </Box>
            </Box>
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
                    searchLimit={searchLimit}
                    changeSearchLimit={changeSearchLimit}
                  />
                  {searchResults.map((maintenance_request) => {
                    //Retrieve the tenant information for the maintenance request
                    let tenant = tenants
                      ? tenants.filter((tenant) =>
                          checkIfTenantMatchesMaintenanceRequest(
                            tenant,
                            maintenance_request
                          )
                        )[0]
                      : null;
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
                        to={`/dashboard/landlord/maintenance-requests/${maintenance_request.id}/`}
                        gridSize={12}
                        key={maintenance_request.id}
                        handleClose={props.handleClose}
                        title={
                          tenant
                            ? `Maintenanace Request from 
                          ${tenant.first_name} 
                          ${tenant.last_name}
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
