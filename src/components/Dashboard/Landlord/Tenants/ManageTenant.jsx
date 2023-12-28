import React, { useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import { useParams } from "react-router-dom";
import TitleCard from "../../UIComponents/TitleCard";
import { dateDiffForHumans, uiGreen, uiRed } from "../../../../constants";
import { useEffect } from "react";
import { getLandlordTenant, getTenantUnit } from "../../../../api/landlords";
import { faker } from "@faker-js/faker";
import { useNavigate } from "react-router-dom";
import UITable from "../../UIComponents/UITable/UITable";
import UITabs from "../../UIComponents/UITabs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  getNextPaymentDate,
  getPaymentDates,
} from "../../../../api/manage_subscriptions";
import { retrieveFilesBySubfolder } from "../../../../api/file_uploads";
import UICard from "../../UIComponents/UICards/UICard";
import BackButton from "../../UIComponents/BackButton";
import { getProperty } from "../../../../api/properties";
import { getLeaseAgreementsByTenant } from "../../../../api/lease_agreements";
import { getTransactionsByTenant } from "../../../../api/transactions";
import { getMaintenanceRequestsByTenant } from "../../../../api/maintenance_requests";

const ManageTenant = () => {
  const { tenant_id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [unit, setUnit] = useState({});
  const [property, setProperty] = useState({});
  const [lease, setLease] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [tabPage, setTabPage] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState(null); //TODO: get next payment date from db and set here
  const [dueDates, setDueDates] = useState([{ title: "", start: new Date() }]);
  const [tenantProfilePicture, setTenantProfilePicture] = useState(null);
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
    { name: "overview", label: "Overview" },
    { name: "rent_calendar", label: "Rent Calendar" },
    { name: "transactions", label: "Transactions" },
    {
      name: "maintenance_requests",
      label: "Maintenance Requests",
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
    if (!tenant) {
      getLandlordTenant(tenant_id).then((tenant_res) => {
        console.log("tenant_res", tenant_res);
        setTenant(tenant_res.data);
        getNextPaymentDate(tenant_res.data.user.id).then((res) => {
          setNextPaymentDate(res.data.next_payment_date);
        });
        getPaymentDates(tenant_res.data.user.id).then((res) => {
          if (res.status === 200) {
            const payment_dates = res.data.payment_dates;
            const due_dates = payment_dates.map((date) => {
              return { title: "Rent Due", start: new Date(date.payment_date) };
            });
            setDueDates(due_dates);
          }
        });
        getTenantUnit(tenant_res.data.id).then((unit_res) => {
          setUnit(unit_res.data);
          getProperty(unit_res.data.rental_property).then((property_res) => {
            setProperty(property_res.data);
          });
          getLeaseAgreementsByTenant(tenant_res.data.user.id).then((res) => {
            setLease(res.data[0]);
          });
          getTransactionsByTenant(tenant_res.data.id).then((res) => {
            setTransactions(res.data);
          });
          getMaintenanceRequestsByTenant(tenant_res.data.id).then((res) => {
            setMaintenanceRequests(res.data);
          });
        });

        retrieveFilesBySubfolder(
          "user_profile_picture",
          tenant_res.data.user.id
        ).then((res) => {
          if (res.data[0]) {
            console.log("Tenant profile picture", res.data[0]);
            setTenantProfilePicture(res.data[0]);
          }
        });
      });
    }
  }, [tenant]);
  return (
    <>
      {tenant && (
        <div className="container">
          <BackButton to="/dashboard/landlord/tenants" />
          <UITabs
            value={tabPage}
            handleChange={handleChangeTabPage}
            tabs={sections}
            variant="fullWidth"
            scrollButtons="auto"
            ariaLabel=""
            style={{ marginBottom: "20px" }}
          />
          {tabPage === 0 && (
            <div className="row mb-3">
              <div className="col-sm-12 col-md-12 col-lg-4">
                <div className="card mb-3">
                  <div className="card-body text-center shadow">
                    <div
                      style={{
                        borderRadius: "50%",
                        overflow: "hidden",
                        width: "200px",
                        height: "200px",
                        margin: "15px auto",
                      }}
                    >
                      <img
                        style={{ height: "100%" }}
                        src={
                          tenantProfilePicture
                            ? tenantProfilePicture.file
                            : "/assets/img/avatars/default-user-profile-picture.png"
                        }
                      />
                    </div>
                    <h4
                      className="text-black tenant-info-heading"
                      style={{ width: "100%" }}
                    >
                      <center>
                        <p>
                          {tenant.user.first_name} {tenant.user.last_name}
                        </p>
                      </center>
                    </h4>
                    <span className="text-muted">{tenant.user.username}</span>
                    <div className="mb-3">
                      <a href={`mailto:${tenant.user.email}`}>
                        <UIButton sx={{ margin: "0 10px" }} btnText="Email" />
                      </a>
                      {/* <UIButton sx={{ margin: "0 10px" }} btnText="Text" /> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 mb-4">
                        <UICard
                          cardStyle={{ background: "white", color: uiGreen }}
                          infoStyle={{ color: uiGreen, fontSize: "16pt" }}
                          titleStyle={{ color: uiGreen, fontSize: "12pt" }}
                          info={`$${faker.finance
                            .amount({ min: 1000, max: 10000 })
                            .toString()
                            .toLocaleString()}`}
                          title={"Total Payments"}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 mb-4">
                        <UICard
                          cardStyle={{ background: "white", color: uiRed }}
                          infoStyle={{ color: uiRed, fontSize: "16pt" }}
                          titleStyle={{ color: uiRed, fontSize: "12pt" }}
                          info={`$${faker.finance
                            .amount({ min: 13000, max: 40000 })
                            .toString()
                            .toLocaleString()}`}
                          title={"Remaining Payments"}
                        />
                      </div>
                    </div>

                    <div className="card shadow mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>
                              <strong>Property</strong>
                            </h6>
                            <p className="text-black">{property.name}</p>
                          </div>
                          <div className="col-md-6">
                            <h6>
                              <strong>Unit</strong>
                            </h6>
                            <p className="text-black">{unit.name}</p>
                          </div>
                          <div className="col-md-6">
                            <h6>
                              <strong>Lease Start Date</strong>
                            </h6>
                            <p className="text-black">
                              {lease
                                ? new Date(
                                    lease.start_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <h6>
                              <strong>Lease End Date</strong>
                            </h6>
                            <p className="text-black">
                              {lease
                                ? new Date(lease.end_date).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <h6>
                              <strong>Next Payment Date</strong>
                            </h6>
                            <p className="text-black">
                              {nextPaymentDate
                                ? new Date(nextPaymentDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <h6>
                              <strong>Time Left</strong>
                            </h6>
                            <p className="text-black">
                              {lease
                                ? `Lease ends ${dateDiffForHumans(
                                    new Date(lease.end_date)
                                  )}`
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {tabPage === 1 && (
            <>
              <div className="card">
                <div className="card-body">
                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    events={dueDates}
                    // eventContent={renderEventContent}
                  />
                </div>
              </div>
            </>
          )}
          {tabPage === 2 && (
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
          {tabPage === 3 && (
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
      )}
    </>
  );
};

export default ManageTenant;
