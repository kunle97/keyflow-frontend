import React, { useState } from "react";
import { filterDashboardPages } from "../../../../../../helpers/utils";
import { routes } from "../../../../../../routes";
import { Button } from "@mui/material";
import SearchResultCard from "../SearchResultCard";
import UIPrompt from "../../../UIPrompt";
import { uiGreen } from "../../../../../../constants";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const AllPageResults = (props) => {
  const [dashboardPages, setDashboardPages] = useState(routes);
  const filteredPages = filterDashboardPages(dashboardPages, props.searchValue);

  return (
    <React.Fragment>
      {filteredPages.length === 0 ? (
        <>
          <UIPrompt
            title="No Results"
            message="No pages found. Try adjusting your search filters."
            icon={
              <DescriptionOutlinedIcon
                style={{
                  width: "50px",
                  height: "50px",
                  color: uiGreen,
                }}
              />
            }
          />
        </>
      ) : (
        <>
          <div>
            <div id="pages" style={{ overflow: "hidden" }}>
              <h2 className="text-black" >Pages ({filteredPages.length})</h2>
              <div className="row">
                {filteredPages.map((page) => (
                  <SearchResultCard
                    to={page.link}
                    handleClose={props.handleClose}
                    gridSize={4}
                    key={page.name}
                    title={page.label}
                    subtitle={page.description}
                    icon={page.muiIcon}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default AllPageResults;
