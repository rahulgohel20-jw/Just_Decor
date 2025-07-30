import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import useStyles from "./style";
const CalendarComponent = ({ data, openEvent }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>
      <FullCalendar
        events={data}
        eventClick={(info) => {
          openEvent && openEvent(info); // call your function here
        }}
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
      />
    </div>
  );
};

export default CalendarComponent;
