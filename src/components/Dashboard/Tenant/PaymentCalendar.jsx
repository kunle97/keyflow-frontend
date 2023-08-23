import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const PaymentCalendar = () => {
  const events = [{ title: "Meeting", start: new Date() }];

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };
  return (
    <div className="card" style={{ color: "white" }}>
      <div className="card-header" style={{ backgroundColor: "#2e2e2e" }}>
        Payment Schedule
      </div>
      <div className="card-body">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={false}
          events={events}
          eventContent={renderEventContent}
        />
      </div>
    </div>
  );
};

export default PaymentCalendar;
