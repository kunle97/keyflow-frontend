// SearchContext.js
import React, { createContext, useContext, useState } from "react";
import { authenticatedInstance } from "../api/api";
import { set } from "react-hook-form";
import { useCallback } from "react";
import { useEffect } from "react";

const SearchContext = createContext();

export function GlobalSearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchLimit, setSearchLimit] = useState("10");
  const [searchResults, setSearchResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [endpoint, setEndpoint] = useState("/properties/"); // Set a default endpoint\
  const [nextPageEndPoint, setNextPageEndPoint] = useState(null);
  const [previousPageEndPoint, setPreviousPageEndPoint] = useState(null);
  let currentPageEndPoint = `${endpoint}?limit=${searchLimit}${
    searchQuery ? `&search=${searchQuery}` : ""
  }`;
  const [batchSearchHistory, setBatchSearchHistory] = useState([]); //TODO implement batch search history [ {endpoint: ""} ]
  const [endpointBatch, setEndpointBatch] = useState([
    // { endpoint: "/", name: "", limit: "10", query: "" },
  ]);
  const [searchResultsBatch, setSearchResultsBatch] = useState([
    // {
    //   endpoint: "",
    //   results: {},
    //   nextPageEndPoint: null,
    //   previousPageEndPoint: null,
    //   resultCount: 0,
    // },
  ]);

  const searchBatch = async () => {
    const results = await Promise.all(
      endpointBatch.map((endpoint) => {
        let url = "";
        if (endpoint.query) {
          url = `${endpoint.endpoint}?&limit=${endpoint.limit}`;
        } else {
          url = `${endpoint.endpoint}?search=${endpoint.query}&limit=${endpoint.limit}`;
        }
        authenticatedInstance.get(url).then((res) => {
          if (res.data.results) {
            // setSearchResultsBatch((searchResultsBatch) => [
            //   ...searchResultsBatch,
            //   {
            //     endpoint: endpoint.endpoint,
            //     results: res.data.results,
            //     nextPageEndPoint: res.data.next,
            //     previousPageEndPoint: res.data.previous,
            //     resultCount: res.data.count,
            //   },
            // ]);
            let result = {
              endpoint: endpoint.endpoint,
              results: res.data.results,
              nextPageEndPoint: res.data.next,
              previousPageEndPoint: res.data.previous,
              resultCount: res.data.count,
            };
            console.log("result from bach", result);
            return result;
          } else {
            // setSearchResultsBatch((searchResultsBatch) => [
            //   ...searchResultsBatch,
            //   {
            //     endpoint: endpoint.endpoint,
            //     results: res.data,
            //   },
            // ]);
            let result = {
              endpoint: endpoint.endpoint,
              results: res.data,
            };
            return result;
          }
        });
      })
    );
    console.log("SearchCOntext.js searchbatch results", results);
    setSearchResultsBatch(results);
  };
  // Define a function to add a new search configuration
  const addBatchEndpoint = (newEndpoint) => {
    //newEndpoint object: { endpoint: "/", name: "", limit: "10", query: "" },
    // Create a copy of the current initialSearches array
    const updatedEndpoints = [...endpointBatch];

    // Add the newSearch configuration to the array
    updatedEndpoints.push(newEndpoint);

    // Update the initialSearches array in the context
    setEndpointBatch(updatedEndpoints);
    searchBatch();
  };

  const changeEndpointBatch = async (newEndpointBatch) => {
    setEndpointBatch(newEndpointBatch);
    searchBatch();
  };

  const search = async () => {
    setIsLoading(true);
    try {
      authenticatedInstance.get(currentPageEndPoint).then((res) => {
        if (res.data.results) {
          setSearchResults(res.data.results);
          setNextPageEndPoint(res.data.next);
          setPreviousPageEndPoint(res.data.previous);
          setResultCount(res.data.count);
        } else {
          setSearchResults(res.data);
        }
      });
      setIsLoading(false);
      // Make API call here using the 'endpoint' state
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = async () => {
    currentPageEndPoint = nextPageEndPoint;
    search();
  };

  const previousPage = async () => {
    currentPageEndPoint = previousPageEndPoint;
    search();
  };

  const changeEndpoint = async (newEndpoint) => {
    setEndpoint(newEndpoint);
    currentPageEndPoint = `${newEndpoint}?search=${searchQuery}&limit=${searchLimit}`;
    search();
  };

  const changeSearchLimit = async (newLimit) => {
    setSearchLimit(newLimit);
    currentPageEndPoint = `${endpoint}?search=${searchQuery}&limit=${newLimit}`;
    search();
  };

  const changeSearchQuery = async (newQuery) => {
    setSearchQuery(newQuery);
    currentPageEndPoint = `${endpoint}?search=${newQuery}&limit=${searchLimit}`;
    search();
  };

  useEffect(() => {
    
  }, [isLoading]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        searchResultsBatch,
        isLoading,
        search,
        searchBatch,
        endpoint,
        changeEndpoint,
        searchLimit,
        setSearchLimit,
        changeSearchLimit,
        changeEndpointBatch,
        currentPageEndPoint,
        nextPageEndPoint,
        previousPageEndPoint,
        nextPage,
        previousPage,
        resultCount,
        changeSearchQuery,
        addBatchEndpoint,
        setSearchResultsBatch,
        endpointBatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
