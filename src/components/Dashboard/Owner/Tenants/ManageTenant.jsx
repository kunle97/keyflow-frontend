import React, { useState } from "react";
import UIButton from "../../UIComponents/UIButton";
import { useParams } from "react-router-dom";
import TitleCard from "../../UIComponents/TitleCard";
import { dateDiffForHumans, uiGreen, uiRed } from "../../../../constants";
import { useEffect } from "react";
import { getOwnerTenant, getTenantUnit } from "../../../../api/owners";
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
import {
  cancelLeaseAgreement,
  getLeaseAgreementsByTenant,
} from "../../../../api/lease_agreements";
import { getTransactionsByTenant } from "../../../../api/transactions";
import { getMaintenanceRequestsByTenant } from "../../../../api/maintenance_requests";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import UIDetailCard from "../../UIComponents/UICards/UIDetailCard";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useScreen from "../../../../hooks/useScreen";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import LeaseRenewalDialog from "../../Tenant/LeaseAgreement/LeaseRenewal/LeaseRenewalDialog";
import LeaseCancellationDialog from "../../Tenant/LeaseAgreement/LeaseCancellation/LeaseCancellationDialog";
import { approveLeaseCancellationRequest } from "../../../../api/lease_cancellation_requests";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { updateTenantAutoRenewStatus } from "../../../../api/tenants";
import { Stack } from "@mui/material";
import UISwitch from "../../UIComponents/UISwitch";
const ManageTenant = () => {
  const { tenant_id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [progressModalTitle, setProgressModalTitle] = useState("");
  const [autoRenewalEnabled, setAutoRenewalEnabled] = useState(false);
  const [showLeaseRenewalDialog, setShowLeaseRenewalDialog] = useState(false);

  const [showLeaseCancellationDialog, setShowLeaseCancellationDialog] =
    useState(false);
  const [showLeaseRenewalForm, setShowLeaseRenewalForm] = useState(false);
  const [showLeaseCancellationForm, setShowLeaseCancellationForm] =
    useState(false);
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
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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
  const handleTransactionRowClick = (row) => {
    const navlink = `/dashboard/owner/transactions/${row.id}`;
    navigate(navlink);
  };
  const transaction_options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
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
    const navlink = `/dashboard/owner/maintenance-requests/${rowData}`;
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
  const titleStyle = {
    fontSize: isMobile ? "12pt" : "17pt",
    marginTop: "12px",
    fontWeight: "600",
  };
  const infoStyle = { fontSize: isMobile ? "12pt" : "15pt" };

  const handleCancelLeaseAgreement = () => {
    setIsLoading(true);
    cancelLeaseAgreement(lease.id)
      .then((res) => {
        if (res.status === 200) {
          setAlertTitle("Lease Agreement Cancelled");
          setAlertMessage(
            "The lease agreement has been cancelled successfully."
          );
          setShowAlert(true);
        } else {
          setAlertTitle("Error!");
          setAlertMessage(
            "There was an error cancelling the lease agreement. Please try again."
          );
          setShowAlert(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error cancelling the lease agreement. Please try again."
        );
        setShowAlert(true);
      })
      .finally(() => {
        setShowLeaseCancellationDialog(false);
        setIsLoading(false);
      });
  };

  const changeAutoRenewal = (event) => {
    setAutoRenewalEnabled(event.target.checked);
    //Use the updateLEaseAgreement function to update the lease agreement with the new auto renewal status
    updateTenantAutoRenewStatus({
      auto_renew_lease_is_enabled: event.target.checked,
      tenant_id: lease.tenant.id,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log("Checked", event.target.checked);
        } else {
          setAlertTitle("Error");
          setAlertMessage(
            "An error occurred while updating the lease agreement's auto renewal status"
          );
          setShowAlert(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while updating the lease agreement's auto renewal status"
        );
        setShowAlert(true);
      });
  };

  useEffect(() => {
    if (!tenant) {
      try {
        getOwnerTenant(tenant_id).then((tenant_res) => {
          console.log("tenant_res", tenant_res);
          setTenant(tenant_res.data);
          setAutoRenewalEnabled(tenant_res.data.auto_renew_lease_is_enabled);
          getNextPaymentDate(tenant_res.data.user.id).then((res) => {
            setNextPaymentDate(res.data.next_payment_date);
          });
          getPaymentDates(tenant_res.data.user.id).then((res) => {
            if (res.status === 200) {
              const payment_dates = res.data.payment_dates;
              const due_dates = payment_dates.map((date) => {
                return {
                  title: "Rent Due",
                  start: new Date(date.payment_date),
                };
              });
              setDueDates(due_dates);
            }
          });
          getTenantUnit(tenant_res.data.id).then((unit_res) => {
            if (unit_res.data) {
              setUnit(unit_res.data);
              getProperty(unit_res.data.rental_property).then(
                (property_res) => {
                  setProperty(property_res.data);
                }
              );
              getLeaseAgreementsByTenant(tenant_res.data.id).then((res) => {
                setLease(res.data[0]);
              });
              getTransactionsByTenant(tenant_res.data.id).then((res) => {
                setTransactions(res.data);
              });
              getMaintenanceRequestsByTenant(tenant_res.data.id).then((res) => {
                setMaintenanceRequests(res.data);
              });
            } else {
              setAlertTitle("Tenant Not Assigned to Unit");
              setAlertMessage(
                "This Tenant is not assigned to a unit. Thier lease agreement may have been cancelled. Please assign this tenant to a unit by sending them a tenant invite from an unoccupied unit."
              );
              setShowAlert(true);
            }
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
      } catch (err) {
        console.log(err);
        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error fetching tenant data. Please try again."
        );
        setShowAlert(true);
      }
    }
  }, [tenant]);
  return (
    <>
      <AlertModal
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
          navigate("/dashboard/owner/tenants");
        }}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <LeaseRenewalDialog
        isOwnerMode={true}
        open={showLeaseRenewalDialog}
        onClose={() => setShowLeaseRenewalDialog(false)}
        leaseAgreement={lease}
        setShowLeaseRenewalDialog={setShowLeaseRenewalDialog}
        showLeaseRenewalForm={showLeaseRenewalForm}
        setShowLeaseRenewalForm={setShowLeaseRenewalForm}
        setAlertModalTitle={setAlertTitle}
        setAlertModalMessage={setAlertMessage}
        setShowAlertModal={setShowAlert}
        tenant={tenant}
      />
      <LeaseCancellationDialog
        isOwnerMode={true}
        open={showLeaseCancellationDialog}
        onClose={() => setShowLeaseCancellationDialog(false)}
        leaseAgreement={lease}
        setShowLeaseCancellationFormDialog={setShowLeaseCancellationDialog}
        showLeaseCancellationForm={showLeaseCancellationForm}
        setShowLeaseCancellationForm={setShowLeaseCancellationForm}
        setAlertModalTitle={setAlertTitle}
        setAlertModalMessage={setAlertMessage}
        setShowAlertModal={setShowAlert}
        onConfirmCancelLease={handleCancelLeaseAgreement}
      />
      <ProgressModal open={isLoading} title="Cancelling Lease Agreement..." />
      {tenant && (
        <div className="container">
          <UIPageHeader
            backButtonURL="/dashboard/owner/tenants"
            backButtonPosition="top"
            title={`${tenant.user.first_name} ${tenant.user.last_name}`}
            subtitle={
              <a href={`mailto:${tenant.user.email}`} className="text-muted">
                {tenant.user.email}
              </a>
            }
            style={{ marginTop: "20px" }}
            menuItems={[
              {
                label: "Renew Tenant's Lease",
                action: () => {
                  setShowLeaseRenewalDialog(true);
                },
              },
              {
                label: "Cancel Tenant's Lease",
                action: () => {
                  setShowLeaseCancellationDialog(true);
                },
                hidden: lease ? false : true,
              },
            ]}
          />
          {/* <Stack
            direction="row"
            spacing={2}
            alignContent={"center"}
            alignItems={"center"}
            sx={{ marginBottom: "14px" }}
          >
            <span className="text-black">Enable Auto Renewal </span>
            <UISwitch value={autoRenewalEnabled} onChange={changeAutoRenewal} />
          </Stack> */}
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
            <>
              <div className="row">
                <div className="col-6 col-md-4 mb-4">
                  <UIDetailCard
                    title="Property"
                    titleStyle={titleStyle}
                    infoStyle={infoStyle}
                    info={property.name}
                    muiIcon={
                      <HomeIcon
                        style={{
                          color: uiGreen,
                          fontSize: "29pt",
                        }}
                      />
                    }
                  />
                </div>
                <div className="col-6 col-md-4 mb-4">
                  <UIDetailCard
                    title="Unit"
                    titleStyle={titleStyle}
                    infoStyle={infoStyle}
                    info={unit.name}
                    muiIcon={
                      <MeetingRoomIcon
                        style={{
                          color: uiGreen,
                          fontSize: "29pt",
                        }}
                      />
                    }
                  />
                </div>
                <div className="col-6 col-md-4 mb-4">
                  <UIDetailCard
                    title="Lease Start"
                    titleStyle={titleStyle}
                    infoStyle={infoStyle}
                    info={
                      lease
                        ? new Date(lease.start_date).toLocaleDateString()
                        : "N/A"
                    }
                    muiIcon={
                      <CalendarMonthIcon
                        style={{
                          color: uiGreen,
                          fontSize: "29pt",
                        }}
                      />
                    }
                  />
                </div>
                <div className="col-6 col-md-4 mb-4">
                  <UIDetailCard
                    title="Lease End"
                    titleStyle={titleStyle}
                    infoStyle={infoStyle}
                    info={
                      lease
                        ? new Date(lease.end_date).toLocaleDateString()
                        : "N/A"
                    }
                    muiIcon={
                      <CalendarMonthIcon
                        style={{
                          color: uiGreen,
                          fontSize: "29pt",
                        }}
                      />
                    }
                  />
                </div>
                <div className="col-6 col-md-4 mb-4">
                  <UIDetailCard
                    title="Next Payment"
                    titleStyle={titleStyle}
                    infoStyle={infoStyle}
                    info={
                      nextPaymentDate
                        ? new Date(nextPaymentDate).toLocaleDateString()
                        : "N/A"
                    }
                    muiIcon={
                      <PaymentsIcon
                        style={{
                          color: uiGreen,
                          fontSize: "29pt",
                        }}
                      />
                    }
                  />
                </div>
                <div className="col-6 col-md-4 mb-4">
                  <UIDetailCard
                    title="Time Left"
                    titleStyle={titleStyle}
                    infoStyle={infoStyle}
                    info={
                      lease
                        ? dateDiffForHumans(new Date(lease.end_date))
                        : "N/A"
                    }
                    muiIcon={
                      <AccessTimeIcon
                        style={{
                          color: uiGreen,
                          fontSize: "29pt",
                        }}
                      />
                    }
                  />
                </div>
              </div>
            </>
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
              {isMobile ? (
                <UITable
                  title="Transactions"
                  data={transactions}
                  searchFields={["first_name", "last_name", "email"]}
                  columns={transaction_columns}
                  options={transaction_options}
                />
              ) : (
                <UITableMobile
                  tableTitle="Transactions"
                  title="Transactions"
                  data={transactions}
                  createInfo={(row) =>
                    `${
                      row.type === "vendor_payment" || row.type === "expense"
                        ? "-$"
                        : "+$"
                    }${String(row.amount).toLocaleString("en-US")}`
                  }
                  createSubtitle={(row) =>
                    `${removeUnderscoresAndCapitalize(row.type)}`
                  }
                  createTitle={(row) =>
                    `${new Date(row.timestamp).toLocaleDateString()}`
                  }
                  onRowClick={handleTransactionRowClick}
                  orderingFields={[
                    { field: "timestamp", label: "Date Created (Ascending)" },
                    { field: "-timestamp", label: "Date Created (Descending)" },
                    { field: "type", label: "Transaction Type (Ascending)" },
                    { field: "-type", label: "Transaction Type (Descending)" },
                    { field: "amount", label: "Amount (Ascending)" },
                    { field: "-amount", label: "Amount (Descending)" },
                  ]}
                  searchFields={["first_name", "last_name", "email"]}
                />
              )}
            </div>
          )}
          {tabPage === 3 && (
            <div className="mb-3 container" style={{ overflow: "hidden" }}>
              <UITableMobile
                data={maintenanceRequests}
                createInfo={(row) =>
                  `${row.tenant.user["first_name"]} ${row.tenant.user["last_name"]}`
                }
                createTitle={(row) => `${row.description}`}
                createSubtitle={(row) => `${row.status.replace("_", " ")}`}
                onRowClick={(row) => {
                  const navlink = `/dashboard/owner/maintenance-requests/${row.id}`;
                  navigate(navlink);
                }}
                titleStyle={{
                  maxHeight: "17px",
                  maxWidth: "180px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                checked={[]}
                setChecked={() => {}}
                options={{
                  isSelectable: true,
                }}
                orderingFields={[
                  { field: "created_at", label: "Date Created (Ascending)" },
                  { field: "-created_at", label: "Date Created (Descending)" },
                  { field: "status", label: "Status (Ascending)" },
                  { field: "-status", label: "Status (Descending)" },
                ]}
                showResultLimit={false}
                tableTitle="Maintenance Requests"
                loadingTitle="Maintenance Requests"
                loadingMessage="Loading your maintenance requests..."
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ManageTenant;
