import React, { useState, useEffect } from "react";
import { getTenantLeaseRenewalRequests } from "../../../../../api/lease_renewal_requests";
import UITable from "../../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router";
import UITableMobile from "../../../UIComponents/UITable/UITableMobile";
const TenantLeaseRenewalRequests = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const columns = [
    {
      name: "rental_unit",
      label: "Unit",
      options: {
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    {
      name: "rental_property",
      label: "Property",
      options: {
        customBodyRender: (value) => {
          return <span>{value.name}</span>;
        },
      },
    },
    { name: "status", label: "Status" },
    {
      name: "request_date",
      label: "Date Requested",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
    {
      name: "created_at",
      label: "Date Submitted",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/tenant/lease-renewal-requests/${rowData}/`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
    //CREate a function to handle the row delete
  };
  useEffect(() => {
    getTenantLeaseRenewalRequests().then((res) => {
      setData(res.data);
      console.log(res);
    });
  }, []);
  return (
    <div className="container-fluid">
      {/* <UITable
        title="Lease Renewal Requests"
        columns={columns}
        data={data}
        options={options}
      /> */}
      <UITableMobile
        // endpoint={"/lease-renewal-requests/"}
        data={data}
        tableTitle={"Lease Renewal Requests"}
        createInfo={(row) =>
          `${row.tenant.user.first_name} ${row.tenant.user.last_name}`
        }
        createTitle={(row) =>
          `Unit ${row.rental_unit.name} | ${row.rental_property.name}`
        }
        createSubtitle={(row) => `${row.status}`}
        orderingFields={[
          { field: "created_at", label: "Date Created (Ascending)" },
          { field: "-created_at", label: "Date Created (Descending)" },
          { field: "status", label: "Status (Ascending)" },
          { field: "-status", label: "Status (Descending)" },
        ]}
        onRowClick={handleRowClick}
        loadingTitle="Lease renewal Requests"
        loadingMessage="Please wait while we fetch your lease renewal requests."
      />
    </div>
  );
};

export default TenantLeaseRenewalRequests;
