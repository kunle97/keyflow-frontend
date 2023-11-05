import React, { useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import { useParams } from "react-router-dom";
import TitleCard from "../../UIComponents/TitleCard";
import { dateDiffForHumans, uiGreen, uiRed } from "../../../../constants";
import { useEffect } from "react";
import { getLandlordTenant } from "../../../../api/landlords";
import { faker } from "@faker-js/faker";
import { useNavigate } from "react-router-dom";
import UITable from "../../UIComponents/UITable/UITable";
import UITabs, { StyledTab, StyledTabs } from "../../UIComponents/UITabs";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
const ManageTenant = () => {
  const { tenant_id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState({});
  const [unit, setUnit] = useState({});
  const [property, setProperty] = useState({});
  const [lease, setLease] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [tabPage, setTabPage] = useState(0);
  const transaction_columns = [
    { name: "amount", label: "Amount" },
    {
      name: "type",
      label: "Transaction",
      options: {
        customBodyRender: (value) => {
          if (value === "revenue") {
            return <span>Income</span>;
          } else {
            return <span>Expense</span>;
          }
        },
      },
    },
    { name: "description", label: "Description" },
    {
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  const sections = [
    { name: "transactions", label: "Transactions", icon: <PaidOutlinedIcon /> },
    {
      name: "maintenance_requests",
      label: "Maintenance Requests",
      icon: <HandymanOutlinedIcon />,
    },
  ];
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };
  const transactionHandleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/transactions/${rowData[0]}`;
    navigate(navlink);
  };
  const transaction_options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: transactionHandleRowClick,
  };

  const maintenance_request_columns = [
    { name: "description", label: "Issue" },
    { name: "type", label: "Type" },
    {
      name: "is_resolved",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === true) {
            return <span className="text-success">Resolved</span>;
          } else {
            return <span className="text-danger">Pending</span>;
          }
        },
      },
    },
    {
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const maintenanceRequestHandleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/maintenance-requests/${rowData}`;
    navigate(navlink);
  };
  const maintenance_request_options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: maintenanceRequestHandleRowClick,
  };

  useEffect(() => {
    getLandlordTenant(tenant_id).then((res) => {
      console.log(res);
      // setTenant(res.data.tenant);
      setUnit(res.data.unit);
      setProperty(res.data.property);
      setLease(res.data.lease_agreement);
      setTransactions(res.data.transactions);
      setMaintenanceRequests(res.data.maintenance_requests);
    });
  }, []);
  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-4">
          <div className="card mb-3">
            <div className="card-body text-center shadow">
              <div className="property-col-img-container">
                <img
                  className="rounded-circle h-100"
                  src={
                    process.env.REACT_APP_ENVIRONMENT !== "development"
                      ? ""
                      : faker.image.avatar()
                  }
                />
              </div>
              <h4
                className="text-white tenant-info-heading"
                style={{ width: "100%" }}
              >
                <center>
                  {tenant.first_name} {tenant.last_name}
                </center>
              </h4>
              <div className="mb-3">
                <a href={`mailto:${tenant.email}`}>
                  <UIButton sx={{ margin: "0 10px" }} btnText="Email" />
                </a>
                <UIButton sx={{ margin: "0 10px" }} btnText="Text" />
              </div>
            </div>
          </div>
          <div className="card shadow mb-3">
            <div className="card-body">
              <div>
                <h5>Property</h5>
                <p className="text-white">{property.name}</p>
              </div>
              <div>
                <h5>Unit</h5>
                <p className="text-white">{unit.name}</p>
              </div>
              <div>
                <h5>Lease Start Date</h5>
                <p className="text-white">{lease.start_date}</p>
              </div>
              <div>
                <h5>Lease End Date</h5>
                <p className="text-white">{lease.end_date}</p>
              </div>
              <div>
                <h5>Time Left</h5>
                <p className="text-white">
                  Lease ends {dateDiffForHumans(new Date(lease.end_date))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-12 col-md-6 mb-4">
                  <TitleCard
                    title="Total Payments"
                    backgroundColor={uiGreen}
                    value={`$23,432`}
                  />
                </div>
                <div className="col-sm-12 col-md-6 mb-4">
                  <TitleCard
                    title="Total Late Payments"
                    backgroundColor={uiRed}
                    value={`3`}
                  />
                </div>
              </div>
              <div className="card shadow mb-3">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="username"
                          >
                            <strong>Payment Status</strong>
                          </label>
                          <p className="text-danger">Over Due</p>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="first_name"
                          >
                            <strong>Lease Term</strong>
                          </label>
                          <p className="text-white">12 months</p>
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="email"
                          >
                            <strong>Rent Due Date</strong>
                          </label>
                          <p className="text-white">July 15th, 2023</p>
                        </div>
                        <div className="mb-3">
                          <label
                            className="form-label text-white"
                            htmlFor="last_name"
                          >
                            <strong>Document</strong>
                          </label>
                          <button
                            className="btn btn-primary ui-btn d-block"
                            type="button"
                          >
                            View Lease
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <UITabs
                value={tabPage}
                handleChange={handleChangeTabPage}
                tabs={sections}
                variant="fullWidth"
                scrollButtons="auto"
                ariaLabel=""
              />

              {tabPage === 0 && (
                <div className="mb-3" style={{ overflow: "hidden" }}>
                  <UITable
                    title="Transactions"
                    data={transactions}
                    searchFields={["first_name", "last_name", "email"]}
                    columns={transaction_columns}
                    options={transaction_options}
                  />
                </div>
              )}
              {tabPage === 1 && (
                <div className="mb-3" style={{ overflow: "hidden" }}>
                  <UITable
                    title="Maintenance Requests"
                    data={maintenanceRequests}
                    columns={maintenance_request_columns}
                    options={maintenance_request_options}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTenant;
