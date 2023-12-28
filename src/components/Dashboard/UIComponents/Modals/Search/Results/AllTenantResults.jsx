import React, { useState } from "react";
import { filterTenants } from "../../../../../../helpers/utils";
import { useEffect } from "react";
import { getLandlordTenants } from "../../../../../../api/landlords";
import SearchResultCard from "../SearchResultCard";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import UIPrompt from "../../../UIPrompt";
import { uiGreen } from "../../../../../../constants";
const AllTenantResults = (props) => {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    getLandlordTenants().then((res) => {
      if (res.data.results) {
        setTenants(res.data.tenants);
      } else if (res.data) {
        setTenants(res.data);
      }
    });
  }, []);

  const filteredTenants = filterTenants(tenants, props.searchValue);

  return (
    <React.Fragment>
      {filteredTenants.length === 0 ? (
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
          <h2>Tenants ({filteredTenants.length})</h2>
          <div className="row">
            {filteredTenants.map((tenant) => (
              <SearchResultCard
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
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default AllTenantResults;
