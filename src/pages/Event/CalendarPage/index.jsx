import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import CalendarComponent from "@/components/CalendarComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import EventViewModal from "@/partials/modals/calendar-event/EventView";
import { useNavigate } from "react-router-dom";
import { GetEventMaster } from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";
import { useLanguage } from "@/i18n";

const CalendarPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState(false);
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);

  const openEvent = (data) => {
    setEventModalData(data);
    setIsModalOpen(true);
  };

  const { isRTL } = useLanguage();

  let Id = localStorage.getItem("userId");

  const getStatusColor = (statusCode, isRMenu) => {
    console.log(isRMenu);

    if (isRMenu === true && statusCode !== 0) {
      return "#E75480";
    } else {
      switch (statusCode) {
        case 0:
          return "info";
        case 1:
          return "rgba(40, 167, 69, 1)";
        case 2:
          return "rgba(191, 34, 37, 1)";
        default:
          return "#6b7280";
      }
    }
  };

  // helper: parse "15/09/2025 10:09 AM" into ISO date + time
  const splitDateTime = (dateTimeString) => {
    if (!dateTimeString) {
      const today = new Date();
      return {
        date: today.toISOString().split("T")[0],
        time24: "00:00",
        time12: "12:00 am",
      };
    }

    try {
      const [datePart, timePart, ampm] = dateTimeString.trim().split(" ");
      const [day, month, year] = datePart.split("/");

      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      let [hours, minutes] = timePart.split(":");
      hours = parseInt(hours, 10);

      let hours24 = hours;
      if (ampm.toLowerCase() === "pm" && hours !== 12) {
        hours24 += 12;
      }
      if (ampm.toLowerCase() === "am" && hours === 12) {
        hours24 = 0;
      }

      const formattedTime24 = `${String(hours24).padStart(2, "0")}:${minutes}`;
      const formattedTime12 = `${timePart} ${ampm}`;

      return {
        date: formattedDate,
        time24: formattedTime24,
        time12: formattedTime12,
      };
    } catch (error) {
      console.warn("Invalid datetime:", dateTimeString, error);
      const today = new Date();
      return {
        date: today.toISOString().split("T")[0],
        time24: "00:00",
        time12: "12:00 am",
      };
    }
  };

  // helper: add +1 day to make FullCalendar end date inclusive
  const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    FetchEventdetails();
  }, []);

  const FetchEventdetails = () => {
    GetEventMaster(Id)
      .then((res) => {
        const eventdata = res?.data?.data?.["Event Details"] || [];

        setData(
          eventdata
            .map((item, index) => {
              try {
                const { date: startDate, time12 } = splitDateTime(
                  item.eventStartDateTime
                );
                const { date: endDate } = splitDateTime(
                  item.eventEndDateTime || item.eventStartDateTime
                );

                const color = getStatusColor(item.status, item.isRMenu);
                console.log("Event Item:", item);
                return {
                  eventid: item.id,
                  eventTypeId: item.eventType?.id || null,
                  title:
                    (item.prefix || "") +
                    (item.party?.nameEnglish || "") +
                    " - " +
                    (item.eventType?.nameEnglish || ""),
                  start: startDate,
                  end: addOneDay(endDate),
                  time: time12,
                  mobile: item.party?.mobileno || "N/A",
                  statusCode: item.status,
                  isRMenu: item?.isRMenu,
                  address: item.address || "N/A",
                  event: item.eventType?.nameEnglish || "Event",
                  color: color,
                  allDay: true,
                };
              } catch (error) {
                console.error(
                  `Error processing event item ${index}:`,
                  item,
                  error
                );
                return null;
              }
            })
            .filter((item) => item !== null)
        );
        setEvents(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    navigate("/add-event", {
      state: {
        event_date: clickedDate,
      },
    });
  };

  return (
    <Fragment>
      <Container>
        {/* Filters - Fully Responsive */}
        <div className="filters flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="filItems text-xs sm:text-sm font-medium bg-info rounded px-2 sm:px-3 py-1 text-white whitespace-nowrap">
              {intl.formatMessage({
                id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_INQUIRY",
                defaultMessage: "Inquiry",
              })}
            </span>

            <span className="filItems text-xs sm:text-sm font-medium bg-[#E75480] rounded px-2 sm:px-3 py-1 text-white whitespace-nowrap">
              {intl.formatMessage({
                id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CONFIRM_WITHOUT_MENU",
                defaultMessage: "Remaining Menu",
              })}
            </span>

            <span className="filItems text-xs sm:text-sm font-medium bg-success rounded px-2 sm:px-3 py-1 text-white whitespace-nowrap">
              {intl.formatMessage({
                id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_COMPLETED",
                defaultMessage: "Confirm",
              })}
            </span>

            <span className="filItems text-xs sm:text-sm font-medium bg-danger rounded px-2 sm:px-3 py-1 text-white whitespace-nowrap">
              {intl.formatMessage({
                id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CANCEL",
                defaultMessage: "Cancel",
              })}
            </span>
          </div>

          {/* Add Event Button - Full width on mobile */}
          <button
            className="btn btn-primary w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5 px-4 flex items-center justify-center gap-2 whitespace-nowrap"
            title="Add Event"
            onClick={() => {
              navigate("/add-event");
            }}
          >
            <i className="ki-filled ki-plus text-base sm:text-lg"></i>
            <span className=" inline xs:hidden">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_ADD_EVENT_BUTTON"
                defaultMessage="Create New Event"
              />
            </span>
            <span className="hidden xs:inline">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_ADD_EVENT_BUTTON_SHORT"
                defaultMessage="Add Event"
              />
            </span>
          </button>
        </div>

        {/* Calendar Component - Responsive Container */}
        <div className="calendar-wrapper w-full overflow-x-auto">
          <CalendarComponent
            data={data}
            openEvent={openEvent}
            handleDateClick={handleDateClick}
          />
        </div>
      </Container>

      {/* Event Modal */}
      {isModalOpen && (
        <EventViewModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          eventData={eventModalData}
          onEventsUpdated={FetchEventdetails}
        />
      )}
    </Fragment>
  );
};

export default CalendarPage;
