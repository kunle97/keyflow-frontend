import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { dateDiffForHumans, uiGreen, uiGrey2 } from "../../../../constants";
import { useEffect } from "react";
import { getOwnerTenant, getTenantUnit } from "../../../../api/owners";
import { useNavigate } from "react-router-dom";
import UITable from "../../UIComponents/UITable/UITable";
import UITabs from "../../UIComponents/UITabs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  getNextPaymentDate,
  getPaymentDates,
} from "../../../../api/manage_subscriptions";
import {
  cancelLeaseAgreement,
  getLeaseAgreementsByTenant,
} from "../../../../api/lease_agreements";
import { HelpOutline } from "@mui/icons-material";
import { getTransactionsByTenant } from "../../../../api/transactions";
import {
  deleteMaintenanceRequest,
  getMaintenanceRequestsByTenant,
} from "../../../../api/maintenance_requests";
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
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import {
  updateTenantAutoPayStatus,
  updateTenantAutoRenewStatus,
} from "../../../../api/tenants";
import { Chip, Stack, Tooltip } from "@mui/material";
import UISwitch from "../../UIComponents/UISwitch";
const ManageTenant = () => {
  const { tenant_id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [autoRenewalEnabled, setAutoRenewalEnabled] = useState(false);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
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
  const tabs = [
    { name: "overview", label: "Overview", dataTestId: "overview-tab" },
    {
      name: "rent_calendar",
      label: "Rent Calendar",
      dataTestId: "rent-calendar-tab",
    },
    {
      name: "transactions",
      label: "Transactions",
      dataTestId: "transactions-tab",
    },
    {
      name: "maintenance_requests",
      label: "Maintenance Requests",
      dataTestId: "maintenance-requests-tab",
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
    {
      name: "tenant",
      label: "Tenant",
      options: {
        orderingField: "tenant__user__last_name",
        isObject: true,
        customBodyRender: (value) => {
          let output = "";
          if (value) {
            output = `${value.user.first_name} ${value.user.last_name}`;
          } else {
            output = "N/A";
          }
          return <span>{output}</span>;
        },
      },
    },
    { name: "description", label: "Issue" },
    {
      name: "priority",
      label: "Priority",
      options: {
        customBodyRender: (value) => {
          if (value === 1) {
            return <Chip label="Low" color="success" />;
          } else if (value === 2) {
            return <Chip label="Moderate" color="info" />;
          } else if (value === 3) {
            return <Chip label="High" color="warning" />;
          } else if (value === 4) {
            return <Chip label="Urgent" color="error" />;
          } else if (value === 5) {
            return <Chip label="Emergency" color="error" />;
          } else {
            return <Chip label="N/A" color="default" />;
          }
        },
      },
    },
    { name: "type", label: "Type" },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "pending") {
            return <Chip label="Pending" color="warning" />;
          } else if (value === "in_progress") {
            return <Chip label="In Progress" color="info" />;
          } else if (value === "completed") {
            return <Chip label="Completed" color="success" />;
          } else {
            return <Chip label="N/A" color="default" />;
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
      sort: true,
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
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
    onRowClick: handleRowClick,
    rowHover: true,
    onRowDelete: (row) => {
      setIsLoading(true);
      deleteMaintenanceRequest(row.id)
        .then((res) => {
          if (res.status === 204) {
            setAlertTitle("Success");
            setAlertMessage("Maintenance request deleted successfully");
            setShowAlert(true);
          } else {
            setAlertTitle("Error");
            setAlertMessage(
              "An error occurred while deleting the maintenance request"
            );
            setShowAlert(true);
          }
        })
        .catch((err) => {
          setAlertTitle("Error");
          setAlertMessage(
            "An error occurred while deleting the maintenance request"
          );
          setShowAlert(true);
        });
    },
    deleteOptions: {
      confirmTitle: "Delete Maintenance Request",
      confirmMessage:
        "Are you sure you want to delete this maintenance request?",
    },
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
        if (res.status === 200) {
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
  const changeAutoPay = (event) => {
    setAutoPayEnabled(event.target.checked);
    //Use the updateLEaseAgreement function to update the lease agreement with the new auto renewal status
    updateTenantAutoPayStatus({
      auto_pay_is_enabled: event.target.checked,
      tenant_id: tenant_id,
    })
      .then((res) => {
        if (res.status === 200) {
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
          setTenant(tenant_res.data);
          setAutoRenewalEnabled(tenant_res.data.auto_renew_lease_is_enabled);
          setAutoPayEnabled(tenant_res.data.auto_pay_is_enabled);
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
              getLeaseAgreementsByTenant(tenant_res.data.id).then((res) => {
                setLease(res.data[0]);
                console.log("lease", res);
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
        });
      } catch (err) {
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
          <Stack
            direction="row"
            spacing={1}
            alignContent={"center"}
            alignItems={"center"}
            sx={{ marginBottom: "14px" }}
            data-testid="auto-pay-switch-stack"
          >
            <span className="text-black" data-testid="auto-pay-switch-label">
              Allow Auto Pay{" "}
            </span>
            <UISwitch
              value={autoPayEnabled}
              onChange={changeAutoPay}
              data-testId="auto-pay-switch"
            />
            <Tooltip
              title="Turning this on will allow this tenant to enable/disable autopay. 
            It is recommended to keep this feature turned off when they have an autopay subscription
             enabled unless they reach out and ask to turn off thier autopay subscription."
            >
              <HelpOutline
                sx={{
                  marginLeft: "5px",
                  width: "20px",
                  color: uiGrey2,
                }}
              />
            </Tooltip>
          </Stack>
          <UITabs
            value={tabPage}
            handleChange={handleChangeTabPage}
            tabs={tabs}
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
                    dataTestId="tenant-property-detail-card"
                    title="Property"
                    titleStyle={titleStyle}
                    infoStyle={infoStyle}
                    info={unit.rental_property_name}
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
                    dataTestId="tenant-unit-detail-card"
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
                    dataTestId="tenant-lease-start-detail-card"
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
                    dataTestId="tenant-lease-end-detail-card"
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
                    dataTestId="tenant-next-payment-detail-card"
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
                    dataTestId="tenant-time-left-detail-card"
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
              <div className="card" data-testid="rent-calendar">
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
              ) : (
                <UITable
                  dataTestId="transactions-table"
                  title="Transactions"
                  data={transactions}
                  searchFields={["first_name", "last_name", "email"]}
                  columns={transaction_columns}
                  options={transaction_options}
                  onRowClick={handleTransactionRowClick}
                />
              )}
            </div>
          )}
          {tabPage === 3 && (
            <div className="mb-3 container" style={{ overflow: "hidden" }}>
              {isMobile ? (
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
                    {
                      field: "-created_at",
                      label: "Date Created (Descending)",
                    },
                    { field: "status", label: "Status (Ascending)" },
                    { field: "-status", label: "Status (Descending)" },
                  ]}
                  showResultLimit={false}
                  tableTitle="Maintenance Requests"
                  loadingTitle="Maintenance Requests"
                  loadingMessage="Loading your maintenance requests..."
                />
              ) : (
                <div className="tenants-list-section">
                  <UITable
                    dataTestId="maintenance-requests-table"
                    title="Maintenance Requests"
                    data={maintenanceRequests}
                    searchFields={["first_name", "last_name", "email"]}
                    columns={maintenance_request_columns}
                    options={maintenance_request_options}
                    onRowClick={handleRowClick}
                    menuOptions={[
                      {
                        name: "View",
                        onClick: (row) => {
                          const navlink = `/dashboard/owner/maintenance-requests/${row.id}`;
                          navigate(navlink);
                        },
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ManageTenant;
