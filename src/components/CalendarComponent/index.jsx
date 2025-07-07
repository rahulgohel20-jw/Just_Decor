import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const CalendarComponent = ({ data }) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek",
      }}
      buttonText={{
        today: "Today",
        dayGridMonth: "Month",
        dayGridWeek: "Week",
      }}
      events={data}
    />
  );
};

export default CalendarComponent;
