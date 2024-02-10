import React, { useEffect, useState } from "react";
import { getTenantLeaseCancellationRequests } from "../../../../../api/lease_cancellation_requests";
import { useNavigate } from "react-router";
import UITable from "../../../UIComponents/UITable/UITable";
import UITableMobile from "../../../UIComponents/UITable/UITableMobile";

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
      console.log("TCRRR", res);
      setData(res.data);
    });
  }, []);
  return (
    <div className="container-fluid">
      {/* <UITable
        data={data}
        columns={columns}
        title={"Lease Cancellation Requests"}
        options={options}
      /> */}
      <UITableMobile
        data={data}
        tableTitle={"Lease Cancellation Requests"}
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
        loadingTitle="Lease Cancellation Requests"
        loadingMessage="Please wait while we fetch your lease cancellation requests."
      />
    </div>
  );
};

export default TenantLeaseCancellationRequests;
