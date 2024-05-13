import React, { useState } from "react";
import { filterTenants } from "../../../../../../helpers/utils";
import { useEffect } from "react";
import { getLandlordTenants } from "../../../../../../api/landlords";
import SearchResultCard from "../SearchResultCard";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import UIPrompt from "../../../UIPrompt";
import { uiGreen } from "../../../../../../constants";
import { authenticatedInstance } from "../../../../../../api/api";
import ResultsPageControl from "./Pagination/ResultsPageControl";
import AlertModal from "../../AlertModal";
import ResultsHeader from "./Pagination/ResultsHeader";
import UIProgressPrompt from "../../../UIProgressPrompt";
const AllTenantResults = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState(`/tenants/`);
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
    <React.Fragment>
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
      {isLoading ? (
        <UIProgressPrompt
          title="Loading"
          message="Please wait while we retrieve your tenants."
        />
      ) : (
        <>
          {searchResults.length === 0 ? (
            <UIPrompt
              title="No Results"
              message="No tenants found. Try adjusting your search filters."
              icon={
                <PeopleAltOutlinedIcon
                  style={{ width: "50px", height: "50px", color: uiGreen }}
                />
              }
            />
          ) : (
            <div id="tenants" style={{ overflow: "hidden" }}>
              <div className="row">
                <ResultsHeader
                  title="Tenants"
                  resultCount={resultCount}
                  refresh={search}
                  searchLimit={limit}
                  changeSearchLimit={setLimit}
                />
                {searchResults.map((tenant,index) => (
                  <SearchResultCard
                    dataTestId={`tenant-search-result-${index}`}
                    to={`/dashboard/landlord/tenants/${tenant.id}`}
                    key={tenant.id}
                    gridSize={4}
                    handleClose={props.handleClose}
                    title={`${tenant.user.first_name} ${tenant.user.last_name}`}
                    subtitle={`${tenant.user.email}`}
                    icon={
                      <PeopleAltOutlinedIcon
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
              </div>
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default AllTenantResults;
