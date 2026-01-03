import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import useStyles from "./style";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { useLanguage } from "@/i18n";

const CalendarComponent = ({ data, openEvent, handleDateClick }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { isRTL } = useLanguage();

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const translateTextDynamic = async (
    text,
    selectedLang,
    TranslateHindi,
    TranslateGujarati
  ) => {
    if (!text) return "";
    if (selectedLang === "en") return text;

    try {
      const res =
        selectedLang === "hi"
          ? await TranslateHindi({ text })
          : await TranslateGujarati({ text });

      return (
        res?.data?.text ||
        res?.data?.translatedText ||
        res?.translatedText ||
        text
      );
    } catch {
      return text;
    }
  };

  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>
      <FullCalendar
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
        headerToolbar={{
          left: "dayGridMonth,dayGridWeek,timeGridDay,listWeek",
          center: "title",
          right: "prev,next today",
        }}
        dateClick={handleDateClick}
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
