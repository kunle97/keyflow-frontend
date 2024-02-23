import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getPaymentDates } from "../../../api/manage_subscriptions";
import { authUser } from "../../../constants";
import { getTenantInvoices } from "../../../api/tenants";
import { removeUnderscoresAndCapitalize } from "../../../helpers/utils";
const PaymentCalendar = () => {
  const events = [{ title: "Meeting", start: new Date() }];
  const [dates, setDates] = useState([]);
  const [dueDates, setDueDates] = useState([{ title: "", start: new Date() }]);
  const [invoices, setInvoices] = useState([]);
  //TODO Retriueve pay dates from backend
  useEffect(() => {
    // getPaymentDates(authUser.id).then((res) => {
    //   if (res.status === 200) {
    //     const payment_dates = res.data.payment_dates;
    //     const due_dates = payment_dates.map((date) => {
    //       return { title: "Rent Due", start: new Date(date.payment_date) };
    //     });
    //     setDueDates(due_dates);
    //   }
    // });
    getTenantInvoices().then((res) => {
      setInvoices(res.invoices.data);
      console.log(res.invoices.data);
      const due_dates = res.invoices.data.map((invoice) => {
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
      console.log(due_dates);
      setDueDates(due_dates);
    });
  }, []);
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <p>
          {eventInfo.event.title}
        </p>
        <br />
        <p>{eventInfo.timeText}</p>
      </>
    );
  };
  return (
    <div>
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
