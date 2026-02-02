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

  let Id = localStorage.getItem("userId");
  const { isRTL, locale } = useLanguage();

  // if your useLanguage exposes locale

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
  }, [isRTL]);

  const getLocalizedText = (obj, field) => {
    if (!obj) return "";

    switch (lang) {
      case "hi":
        return obj[`${field}Hindi`] || obj[`${field}English`] || "";
      case "gu":
        return obj[`${field}Gujarati`] || obj[`${field}English`] || "";
      default:
        return obj[`${field}English`] || "";
    }
  };

  const getStatusColor = (statusCode, isRMenu) => {
    if (statusCode === 2) {
      return "rgba(191, 34, 37, 1)";
    }

    if (isRMenu === true && statusCode === 1) {
      return "#E75480";
    }

    switch (statusCode) {
      case 0:
        return "info";
      case 1:
        return "rgba(40, 167, 69, 1)";
      default:
        return "#6b7280";
    }
  };

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
        "0",
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

  const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    FetchEventdetails();
  }, [lang]);

  const FetchEventdetails = () => {
    GetEventMaster(Id)
      .then((res) => {
        const eventdata = res?.data?.data?.["Event Details"] || [];
        console.log(eventdata);

        setData(
          eventdata
            .map((item, index) => {
              try {
                const { date: startDate, time12 } = splitDateTime(
                  item.eventStartDateTime,
                );

                const { date: endDate } = splitDateTime(
                  item.eventEndDateTime || item.eventStartDateTime,
                );

                const color = getStatusColor(item.status, item.isRMenu);

                return {
                  eventid: item.id,
                  eventTypeId: item.eventType?.id || null,

                  title:
                    (item.prefix || "") +
                    getLocalizedText(item.party, "name") +
                    " - " +
                    getLocalizedText(item.eventType, "name"),

                  start: startDate,
                  end: addOneDay(endDate),
                  time: time12,

                  mobile: item.party?.mobileno || "N/A",
                  statusCode: item.status,
                  isRMenu: item?.isRMenu,

                  address: getLocalizedText(item.venue, "name"),
                  event: getLocalizedText(item.eventType, "name"),

                  color: color,
                  allDay: true,
                };
              } catch (error) {
                console.error(
                  `Error processing event item ${index}:`,
                  item,
                  error,
                );
                return null;
              }
            })
            .filter((item) => item !== null),
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
        {/* Status Legend - Improved Mobile Layout */}
        <div className="calendar-status-legend mb-4">
          {/* Mobile: 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#17a2b8" }}
              ></span>
              <span className="text-xs font-medium text-gray-700">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_INQUIRY",
                  defaultMessage: "Inquiry",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="w-3 h-3 rounded-full bg-[#E75480]"></span>
              <span className="text-xs font-medium text-gray-700">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CONFIRM_WITHOUT_MENU",
                  defaultMessage: "Remaining Menu",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "rgba(40, 167, 69, 1)" }}
              ></span>
              <span className="text-xs font-medium text-gray-700">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_COMPLETED",
                  defaultMessage: "Confirm",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "rgba(191, 34, 37, 1)" }}
              ></span>
              <span className="text-xs font-medium text-gray-700">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CANCEL",
                  defaultMessage: "Cancel",
                })}
              </span>
            </div>
          </div>

          {/* Desktop: Horizontal Pills with Create Button */}
          <div className="hidden md:flex md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium bg-info rounded-lg px-4 py-2 text-white">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_INQUIRY",
                  defaultMessage: "Inquiry",
                })}
              </span>
              <span className="text-sm font-medium bg-[#E75480] rounded-lg px-4 py-2 text-white">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CONFIRM_WITHOUT_MENU",
                  defaultMessage: "Remaining Menu",
                })}
              </span>
              <span className="text-sm font-medium bg-success rounded-lg px-4 py-2 text-white">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_COMPLETED",
                  defaultMessage: "Confirm",
                })}
              </span>
              <span className="text-sm font-medium bg-danger rounded-lg px-4 py-2 text-white">
                {intl.formatMessage({
                  id: "USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CANCEL",
                  defaultMessage: "Cancel",
                })}
              </span>
            </div>

            <button
              className="btn btn-primary text-sm py-2.5 px-6 flex items-center gap-2 rounded-lg"
              onClick={() => navigate("/add-event")}
            >
              <i className="ki-filled ki-plus text-lg"></i>
              <span>
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_ADD_EVENT_BUTTON_SHORT"
                  defaultMessage="Add Event"
                />
              </span>
            </button>
          </div>
        </div>

        {/* Create Event Button - Mobile Full Width */}
        <div className="md:hidden mb-4">
          <button
            className="btn btn-primary w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg text-base font-semibold"
            onClick={() => navigate("/add-event")}
          >
            <i className="ki-filled ki-plus text-xl"></i>
            <span>
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_ADD_EVENT_BUTTON"
                defaultMessage="Create New Event"
              />
            </span>
          </button>
        </div>

        {/* Calendar Component - Clean Container */}
        <div className="calendar-container bg-white rounded-lg shadow-sm  md:p-4">
          <CalendarComponent
            data={data}
            openEvent={openEvent}
            handleDateClick={handleDateClick}
            lang={lang}
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
