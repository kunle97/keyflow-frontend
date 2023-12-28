import React, { useEffect, useState } from "react";
import { getTenantLeaseCancellationRequests } from "../../../../../api/lease_cancellation_requests";
import { useNavigate } from "react-router";
import UITable from "../../../UIComponents/UITable/UITable";

const TenantLeaseCancellationRequests = () => {
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
    const navlink = `/dashboard/tenant/lease-renewal-requests/`;
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
    getTenantLeaseCancellationRequests().then((res) => {
      console.log("TCRRR",res);
      setData(res.data);
    });
  }, []);
  return (
    <div className="container-fluid">
      <UITable
        data={data}
        columns={columns}
        title={"Lease Cancellation Requests"}
        options={options}
      />
    </div>
  );
};

export default TenantLeaseCancellationRequests;
