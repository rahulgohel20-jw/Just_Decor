import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useStyles from "./style";
import { Button } from "@mui/material"; // or your preferred button component
import { Link } from "react-router-dom"; // assuming you're using React Router

const CalendarComponent = ({ data, openEvent, handleDateClick }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>

      {/* Add Event Button */}
      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <Link to="/add-event" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Add Event
          </Button>
        </Link>
      </div>

      <FullCalendar
        events={data}
        eventClick={(e) => openEvent(e)}
        plugins={[dayGridPlugin, interactionPlugin]}
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
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default CalendarComponent;
