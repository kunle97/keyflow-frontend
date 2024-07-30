import React, { useEffect, useState } from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import UITable from "../../UIComponents/UITable/UITable";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import { useNavigate } from "react-router";
import { uiGreen, uiGrey2, uiRed } from "../../../../constants";
import {
  getTenantDashboardData,
  getTenantInvoices,
} from "../../../../api/tenants";
import useScreen from "../../../../hooks/useScreen";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIPrompt from "../../UIComponents/UIPrompt";
import PaymentsIcon from "@mui/icons-material/Payments";
import UIButton from "../../UIComponents/UIButton";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import { createBillingPortalSession } from "../../../../api/payment_methods";
import { Stack } from "@mui/material";
import UISwitch from "../../UIComponents/UISwitch";
const Bills = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const [invoices, setInvoices] = useState([]);
  const [nextInvoice, setNextInvoice] = useState({});
  const [showAllInvoices, setShowAllInvoices] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [leaseAgreement, setLeaseAgreement] = useState({});
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".tenant-bills-page",
      content:
        "This is a list of all your bills. Any time you have a new bill, it will show up here. All of your rent payments in your lease will be listed here.",
      disableBeacon: true,
      placement: "center",
    },
    {
      target: ".tenant-bills-table-container",
      content: "Click on a bill to view more details about it.",
    },
    {
      target: ".ui-table-search-input",
      content: "Use the search bar to search for a  bill",
    },
    {
      target: ".ui-table-result-limit-select",
      content: "Use this to change the number of results per page.",
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content:
        "Click here to view more options for this bill like details or payment options",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
  };
  const handleRowClick = (row) => {
    navigate(`/dashboard/tenant/bills/${row.id}`);
  };
  const columns = [
    {
      label: "Type",
      name: "metadata",
      options: {
        customBodyRender: (value) => {
          return removeUnderscoresAndCapitalize(value?.type);
        },
      },
    },
    {
      label: "Amount Due",
      name: "amount_remaining",
      options: {
        orderingField: "amount_remaining",
        customBodyRender: (value) => {
          const amountDue = `$${String(value / 100).toLocaleString("en-US")}`;

          return (
            <span
              style={{
                color: uiRed,
              }}
            >
              {amountDue}
            </span>
          );
        },
      },
    },
    {
      label: "Amount Paid",
      name: "amount_paid",
      options: {
        orderingField: "amount_paid",
        customBodyRender: (value) => {
          const amountPaid = `$${String(value / 100).toLocaleString("en-US")}`;
          return (
            <span
              style={{
                color: uiGreen,
              }}
            >
              {amountPaid}
            </span>
          );
        },
      },
    },
    {
      label: "Date Due",
      name: "due_date",
      options: {
        orderingField: "due_date",
        customBodyRender: (value) => {
          return new Date(value * 1000).toLocaleDateString();
        },
      },
    },
  ];
  const options = {
    isSelectable: false,
  };

  const manageBillingOnClick = () => {
    setIsRedirecting(true);
    setProgressMessage("Redirecting to billing portal...");
    createBillingPortalSession()
      .then((res) => {
        window.location.href = res.url;
      })
      .catch((error) => {
        setIsRedirecting(false);
      })
      .finally(() => {});
  };
  //Create a function to get the invoice that is due in the nearest period
  const getNearestDueInvoice = (invoices) => {
    let nearestDueInvoice = null;
    let nearestDueDate = null;
    for (let i = 0; i < invoices.length; i++) {
      if (nearestDueDate === null) {
        nearestDueDate = invoices[i].due_date;
        nearestDueInvoice = invoices[i];
      } else {
        if (invoices[i].due_date < nearestDueDate) {
          nearestDueDate = invoices[i].due_date;
          nearestDueInvoice = invoices[i];
        }
      }
    }
    return nearestDueInvoice;
  };

  useEffect(() => {
    setIsLoadingPage(true);
    getTenantDashboardData()
      .then((res) => {
        setLeaseAgreement(res.lease_agreement);
        //Check if auto pay is enabled
        if (res.lease_agreement.auto_pay_is_enabled === false) {
          getTenantInvoices()
            .then((res) => {
              //Reverse the array so the most recent invoices are shown first
              setInvoices(res.invoices.reverse());
              setNextInvoice(getNearestDueInvoice(res.invoices));
            })
            .catch((err) => {
              setAlertTitle("Error");
              setAlertMessage("There was an error loading your bills");
              setShowAlert(true);
            });
        }
      })
      .catch((err) => {
        setAlertTitle("Error");
        setAlertMessage("There was an error loading your bills");
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, []);

  return (
    <>
      <AlertModal
        title={alertTitle}
        message={alertMessage}
        open={showAlert}
        onClick={() => {
          setShowAlert(false);
        }}
      />
      <ProgressModal open={isRedirecting} title={progressMessage} />
      {isLoadingPage ? (
        <UIProgressPrompt
          title="Loading Bills"
          message="Please wait while we load your bills"
        />
      ) : (
        <div className="container-fluid tenant-bills-page">
          <Joyride
            run={runTour}
            index={tourIndex}
            steps={tourSteps}
            callback={handleJoyrideCallback}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            styles={{
              options: {
                primaryColor: uiGreen,
              },
            }}
            locale={{
              back: "Back",
              close: "Close",
              last: "Finish",
              next: "Next",
              skip: "Skip",
            }}
          />{" "}
          <span className="text-black">
            Show Next Invoice  Only
            <UISwitch
              value={!showAllInvoices}
              onChange={() => setShowAllInvoices(!showAllInvoices)}
            />{" "}
          </span>
          {leaseAgreement?.auto_pay_is_enabled ? (
            <UIPrompt
              icon={
                <PaymentsIcon
                  sx={{
                    color: uiGreen,
                    fontSize: "3rem",
                  }}
                />
              }
              title="Auto Pay Enabled"
              message="Your auto pay is enabled. Your bills will be paid automatically."
              body={
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <UIButton
                    btnText="Manage Billing"
                    onClick={manageBillingOnClick}
                    style={{
                      backgroundColor: uiGrey2,
                    }}
                  />
                  <UIButton
                    btnText="Back to Dashboard"
                    onClick={() => {
                      navigate("/dashboard/tenant");
                    }}
                  />
                </Stack>
              }
            />
          ) : (
            <>
              {isMobile ? (
                <UITableMobile
                  showCreate={false}
                  tableTitle="Bills"
                  data={showAllInvoices ? invoices : [nextInvoice]}
                  createInfo={(row) =>
                    `${removeUnderscoresAndCapitalize(row.metadata.type)}`
                  }
                  createSubtitle={(row) =>
                    `$${String(row.amount_due / 100).toLocaleString("en-US")}`
                  }
                  createTitle={(row) => {
                    return (
                      <span
                        style={{
                          color: row.paid ? uiGreen : uiRed,
                        }}
                      >
                        {row.paid
                          ? "Paid"
                          : "Due " +
                            new Date(row.due_date * 1000).toLocaleDateString()}
                      </span>
                    );
                  }}
                  onRowClick={handleRowClick}
                  orderingFields={[
                    { field: "created_at", label: "Date Created (Ascending)" },
                    {
                      field: "-created_at",
                      label: "Date Created (Descending)",
                    },
                    { field: "type", label: "Transaction Type (Ascending)" },
                    { field: "-type", label: "Transaction Type (Descending)" },
                    { field: "amount", label: "Amount (Ascending)" },
                    { field: "-amount", label: "Amount (Descending)" },
                  ]}
                  searchFields={[
                    "metadata.type",
                    "metadata.description",
                    "amount_due",
                  ]}
                />
              ) : (
                <div className="tenant-bills-table-container">
                  <UITable
                    columns={columns}
                    options={options}
                    title="Bills"
                    showCreate={false}
                    data={showAllInvoices ? invoices : [nextInvoice]}
                    menuOptions={[
                      {
                        name: "Details",
                        onClick: (row) => {
                          navigate(`/dashboard/tenant/bills/${row.id}`);
                        },
                      },
                    ]}
                    searchFields={[
                      "metadata.type",
                      "metadata.description",
                      "amount_due",
                    ]}
                  />
                </div>
              )}
            </>
          )}
          <UIHelpButton onClick={handleClickStart} />
        </div>
      )}
    </>
  );
};

export default Bills;
