import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import useStyles from "./style";
const CalendarComponent = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>
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
    </div>
  );
};

export default CalendarComponent;
