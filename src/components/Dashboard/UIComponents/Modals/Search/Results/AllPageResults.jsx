import React, { useState } from "react";
import { filterDashboardPages } from "../../../../../../helpers/utils";
import { routes } from "../../../../../../routes";
import { Button } from "@mui/material";
import SearchResultCard from "../SearchResultCard";

const AllPageResults = (props) => {
  const [dashboardPages, setDashboardPages] = useState(routes);
  return (
    <div>
      <div id="pages" style={{ overflow: "hidden" }}>
        <h2>
          Pages (
          {
            dashboardPages.filter(
              (page) =>
                page.isSearchable &&
                page.label
                  .toLowerCase()
                  .includes(props.searchValue.toLowerCase())
            ).length
          }
          )
        </h2>
        <div className="row">
          {filterDashboardPages(dashboardPages, props.searchValue).map(
            (page) => (
              <SearchResultCard
                to={page.link}
                handleClose={props.handleClose}
                gridSize={4}
                key={page.name}
                title={page.label}
                subtitle={page.description}
                icon={page.muiIcon}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPageResults;
