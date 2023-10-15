import React, { useState } from "react";
import { filterTenants } from "../../../../../../helpers/utils";
import { useEffect } from "react";
import { getLandlordTenants } from "../../../../../../api/api";
import SearchResultCard from "../SearchResultCard";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
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
  return (
    <>
      <div id="tenants" style={{ overflow: "hidden" }}>
        <h2>Tenants ({filterTenants(tenants, props.searchValue).length})</h2>
        <div className="row">
          {filterTenants(tenants, props.searchValue)
            .map((tenant) => (
              <SearchResultCard
                to={`/dashboard/landlord/tenants/${tenant.id}`}
                key={tenant.id}
                gridSize={4}
                handleClose={props.handleClose}
                title={`${tenant.first_name} ${tenant.last_name}`}
                subtitle={`${tenant.email}`}
                icon={
                  <PeopleAltOutlinedIcon
                    style={{ width: "30px", height: "30px" }}
                  />
                }
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default AllTenantResults;
