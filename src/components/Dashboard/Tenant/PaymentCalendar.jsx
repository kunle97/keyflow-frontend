import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getPaymentDates } from "../../../api/manage_subscriptions";
import { authUser } from "../../../constants";
const PaymentCalendar = () => {
  const events = [{ title: "Meeting", start: new Date() }];
  const [dates, setDates] = useState([]);
  const [dueDates, setDueDates] = useState([{ title: "", start: new Date() }]);
  //TODO Retriueve pay dates from backend
  useEffect(() => {
    getPaymentDates(authUser.user_id).then((res) => {
      if (res.status === 200) {
        const payment_dates = res.data.payment_dates;
        const due_dates = payment_dates.map((date) => {
          return { title: "Rent Due", start: new Date(date.payment_date) };
        });
        setDueDates(due_dates);
      }
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
