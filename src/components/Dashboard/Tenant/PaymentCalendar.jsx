import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getTenantInvoices } from "../../../api/tenants";
import { removeUnderscoresAndCapitalize } from "../../../helpers/utils";
import AlertModal from "../UIComponents/Modals/AlertModal";
const PaymentCalendar = (props) => {
  const [dueDates, setDueDates] = useState([{ title: "", start: new Date() }]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  useEffect(() => {
    getTenantInvoices()
      .then((res) => {
        const due_dates = res.invoices.map((invoice) => {
          if (!invoice.paid) {
            let date = new Date(invoice.due_date * 1000);
            return {
              title:
                removeUnderscoresAndCapitalize(invoice.metadata.type) + " Due",
              start: date,
            };
          } else if (invoice.paid) {
            let date = new Date(invoice.status_transitions.paid_at * 1000);
            return {
              title:
                removeUnderscoresAndCapitalize(invoice.metadata.type) + " Paid",
              start: date,
            };
          } else {
            return { title: "", start: new Date() };
          }
        });

        setDueDates(due_dates);
      })
      .catch((error) => {
        console.error("Error fetching invoices", error);
        setAlertTitle("Error!");
        setAlertMessage(
          "There was an error fetching invoices. Please try again."
        );
        setShowAlert(true);
      });
  }, []);
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <p>{eventInfo.event.title}</p>
        <br />
        <p>{eventInfo.timeText}</p>
      </>
    );
  };
  return (
    <div data-testid={props.dataTestId ? props.dataTestId : "payment-calendar"}>
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={dueDates}
        eventContent={renderEventContent}
      />
    </div>
  );
};

export default PaymentCalendar;
