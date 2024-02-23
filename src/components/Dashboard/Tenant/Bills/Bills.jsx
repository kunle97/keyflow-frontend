import React, { useEffect, useState } from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import UITable from "../../UIComponents/UITable/UITable";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
import { useNavigate } from "react-router";
import { uiGreen, uiRed } from "../../../../constants";
import { getTenantInvoices } from "../../../../api/tenants";
import UIButton from "../../UIComponents/UIButton";
import  useScreen  from "../../../../hooks/useScreen";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
const Bills = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const { isMobile } = useScreen();
  const navigate = useNavigate();
  const handleRowClick = (row) => {
    navigate(`/dashboard/tenant/bills/${row.id}`);
  };

  const columns = [
    {
      label: "Type",
      name: "metadata",
      options: {
        customBodyRender: (value) => {
          return removeUnderscoresAndCapitalize(value.type);
        },
      },
    },
    {
      label: "Amount Due",
      name: "amount_remaining",
      options: {
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
        customBodyRender: (value) => {
          return new Date(value * 1000).toLocaleDateString();
        },
      },
    },
  ];
  const options = {
    isSelectable: false,
  };
  useEffect(() => {
    getTenantInvoices()
      .then((res) => {
        //Reverse the array so the most recent invoices are shown first
        setInvoices(res.invoices.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, []);

  return isLoadingPage ? (
    <UIProgressPrompt
      title="Loading Bills"
      message="Please wait while we load your bills"
    />
  ) : (
    <div className="container-fluid">
      {isMobile ? (
        <UITableMobile
          showCreate={false}
          title="Bills"
          data={invoices}
          createInfo={(row) =>
            `${removeUnderscoresAndCapitalize(row.metadata.type)}`
          }
          createSubtitle={(row) =>
            `$${String(row.amount_due/100).toLocaleString("en-US")}`
          }
          createTitle={(row) => {
            return (
              <span
                style={{
                  color: row.paid ? uiGreen : uiRed,
                }}
              >
                {row.paid ? "Paid" : "Due " + new Date(row.due_date * 1000).toLocaleDateString()}
              </span>
            );
          }}
          onRowClick={handleRowClick}
          orderingFields={[
            { field: "created_at", label: "Date Created (Ascending)" },
            { field: "-created_at", label: "Date Created (Descending)" },
            { field: "type", label: "Transaction Type (Ascending)" },
            { field: "-type", label: "Transaction Type (Descending)" },
            { field: "amount", label: "Amount (Ascending)" },
            { field: "-amount", label: "Amount (Descending)" },
          ]}
        />
      ) : (
        <UITable
          columns={columns}
          options={options}
          title="Bills"
          showCreate={false}
          data={invoices}
          menuOptions={[
            {
              name: "Details",
              onClick: (row) => {
                navigate(`/dashboard/tenant/bills/${row.id}`);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default Bills;
