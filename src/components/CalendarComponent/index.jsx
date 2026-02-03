import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import useStyles from "./style";
import { useIntl } from "react-intl";
import { useLanguage } from "@/i18n";
import { useEffect, useState, useRef } from "react";

const CalendarComponent = ({ data, openEvent, handleDateClick }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { isRTL } = useLanguage();
  const calendarRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentView, setCurrentView] = useState("dayGridMonth");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive toolbar configuration
  const getHeaderToolbar = () => {
    if (windowWidth < 768) {
      return {
        left: "",
        center: "title",
        right: "prev,next",
      };
    }
    return {
      left: "dayGridMonth,dayGridWeek,timeGridDay,listWeek",
      center: "title",
      right: "prev,next today",
    };
  };

  const getContentHeight = () => {
    return windowWidth < 768 ? "auto" : 650;
  };

  // Custom view buttons for mobile
  const ViewSwitcher = () => {
    if (windowWidth >= 768) return null;

    const viewButtons = [
      {
        view: "dayGridMonth",
        label: intl.formatMessage({
          id: "USER.DASHBOARD.DASHBOARD_CALENDAR_MONTH",
          defaultMessage: "Month",
        }),
      },
      {
        view: "dayGridWeek",
        label: intl.formatMessage({
          id: "USER.DASHBOARD.DASHBOARD_CALENDAR_WEEK",
          defaultMessage: "Week",
        }),
      },
      {
        view: "timeGridDay",
        label: intl.formatMessage({
          id: "USER.DASHBOARD.DASHBOARD_CALENDAR_DAY",
          defaultMessage: "Day",
        }),
      },
      {
        view: "listWeek",
        label: intl.formatMessage({
          id: "USER.DASHBOARD.DASHBOARD_CALENDAR_LIST",
          defaultMessage: "List",
        }),
      },
    ];

    return (
      <div className="flex gap-2 mb-3 px-1">
        {viewButtons.map(({ view, label }) => (
          <button
            key={view}
            onClick={() => {
              if (calendarRef.current) {
                calendarRef.current.getApi().changeView(view);
                setCurrentView(view);
              }
            }}
            className={`flex-1 py-2.5 px-2 text-xs font-medium rounded-md transition-all ${
              currentView === view
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

  // Custom Today button for mobile
  const TodayButton = () => {
    if (windowWidth >= 768) return null;

    return (
      <button
        onClick={() => {
          if (calendarRef.current) {
            calendarRef.current.getApi().today();
          }
        }}
        className="w-full py-2.5 text-sm font-medium text-primary bg-white border border-primary rounded-md mb-3 hover:bg-primary hover:text-white transition-all"
      >
        {intl.formatMessage({
          id: "USER.DASHBOARD.DASHBOARD_CALENDAR_TODAY",
          defaultMessage: "Today",
        })}
      </button>
    );
  };

  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>
      {/* Mobile View Switcher */}
      <ViewSwitcher />

      {/* Mobile Today Button */}
      <TodayButton />

      <FullCalendar
        ref={calendarRef}
        events={data}
        eventClick={(e) => openEvent(e)}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        buttonText={{
          today: intl.formatMessage({
            id: "USER.DASHBOARD.DASHBOARD_CALENDAR_TODAY",
            defaultMessage: "Today",
          }),
          month: intl.formatMessage({
            id: "USER.DASHBOARD.DASHBOARD_CALENDAR_MONTH",
            defaultMessage: "Month",
          }),
          week: intl.formatMessage({
            id: "USER.DASHBOARD.DASHBOARD_CALENDAR_WEEK",
            defaultMessage: "Week",
          }),
          day: intl.formatMessage({
            id: "USER.DASHBOARD.DASHBOARD_CALENDAR_DAY",
            defaultMessage: "Day",
          }),
          list: intl.formatMessage({
            id: "USER.DASHBOARD.DASHBOARD_CALENDAR_LIST",
            defaultMessage: "List",
          }),
        }}
        headerToolbar={getHeaderToolbar()}
        contentHeight={getContentHeight()}
        aspectRatio={windowWidth < 768 ? 1.2 : 1.8}
        dayMaxEvents={windowWidth < 768 ? 2 : true}
        eventMaxStack={windowWidth < 768 ? 2 : 3}
        dateClick={handleDateClick}
        viewDidMount={(info) => {
          setCurrentView(info.view.type);
        }}
        eventDidMount={(info) => {
          const { event, el } = info;

          const company = event.extendedProps.company;
          const contact = event.extendedProps.contact;
          const email = event.extendedProps.email;

          const time = event.extendedProps.time || "";
          const address = event.extendedProps.address || "";
          const events = event.extendedProps.event || "";
          const mobile = event.extendedProps.mobile || "";

          const tooltipContent =
            company || email || contact
              ? `
                <div class="p-1">
                  <p class="mb-1"><strong>${event.title}</strong></p>
                  <p class="mb-1"><i class="me-1 ki-filled ki-briefcase text-success"></i>
                    <span>${company || "No Company"}</span></p>
                  <p class="mb-1"><i class="me-1 ki-filled ki-call text-success"></i>
                    <span>${contact || "N/A"}</span></p>
                  <p class="mb-1"><i class="me-1 ki-filled ki-message text-success"></i>
                    <span>${email || "N/A"}</span></p>
                </div>
              `
              : `
                <div class="p-1">
                  <p class="mb-1"><strong>${event.title}</strong></p>
                  <p class="mb-1"><i class="me-1 ki-filled ki-calendar-tick text-success"></i><span>${events}</span></p>
                  <p class="mb-1"><i class="me-1 ki-filled ki-call text-success"></i><span>${mobile}</span></p>
                  <p class="mb-1"><i class="me-1 ki-filled ki-time text-success"></i><span>${time}</span></p>
                  <p class="mb-1"><i class="me-1 ki-filled ki-geolocation text-success"></i><span>${address}</span></p>
                </div>
              `;

          tippy(el, {
            content: tooltipContent,
            allowHTML: true,
            theme: "light",
          });
        }}
      />
    </div>
  );
};

export default CalendarComponent;
