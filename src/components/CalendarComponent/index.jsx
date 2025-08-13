import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import useStyles from "./style";
import { Button } from "@mui/material"; 
import { Link } from "react-router-dom"; 

const CalendarComponent = ({ data, openEvent, handleDateClick }) => {
  const classes = useStyles();
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>

      {/* Add Event Button */}
      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <Link to="/add-event" style={{ textDecoration: "none" }}>
                        <button
                className="btn btn-primary"
                onClick={handleModalOpen}
                title="Add Event"
              >
                <i className="ki-filled ki-plus"></i> Add Event
              </button>
        </Link>
      </div>

      <FullCalendar
        events={data}
        eventClick={(e) => openEvent(e)}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,timeGridDay,listWeek",
        }}
        buttonText={{
          today: "Today",
          dayGridMonth: "Month",
          dayGridWeek: "Week",
          timeGridDay: "Day",
          listWeek: "List",
        }}
        dateClick={handleDateClick}
        eventDidMount={(info) => {
          const { event, el } = info;
          const time = event.extendedProps.time || "";
          const address = event.extendedProps.address || "";
          const events = event.extendedProps.event || "";
          const mobile = event.extendedProps.mobile || "";

          tippy(el, {
            content: `
              <strong>${event.title}</strong><br/>
              Time: ${time}<br/>
              Address: ${address}<br/>
              Events: ${events}<br/>
              Mobile: ${mobile}
            `,
            allowHTML: true,
            theme: 'light',
          });
        }}
    />
    </div>
  );
};

export default CalendarComponent;
