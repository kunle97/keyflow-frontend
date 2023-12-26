import React, { useState, useEffect } from "react";
import { getTenantLeaseRenewalRequests } from "../../../../../api/lease_renewal_requests";
import UITable from "../../../UIComponents/UITable/UITable";
import { useNavigate } from "react-router";
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
    <div>
      <UITable
        title="Lease Renewal Requests"
        columns={columns}
        data={data}
        options={options}
      />
    </div>
  );
};

export default TenantLeaseRenewalRequests;
