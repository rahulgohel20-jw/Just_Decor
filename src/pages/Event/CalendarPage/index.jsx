import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import CalendarComponent from "@/components/CalendarComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import EventViewModal from "@/partials/modals/calendar-event/EventView";
import { useNavigate } from "react-router-dom";
import { GetEventMaster } from "@/services/apiServices";

const CalendarPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState(false);
  const [data, setData] = useState([]);

  const openEvent = (data) => {
    setEventModalData(data);
    setIsModalOpen(true);
  };

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;

  const getStatusColor = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "#6366f1";
      case 1:
        return "rgba(40, 167, 69, 1)";
      case 2:
        return "rgba(191, 34, 37, 1)";
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

  useEffect(() => {
    FetchEventdetails();
  }, []);

  const FetchEventdetails = () => {
    GetEventMaster(Id)
      .then((res) => {
        const eventdata = res?.data?.data?.["Event Details"] || [];
        console.log("Event data loaded:", eventdata.length, "events");

        setData(
          eventdata
            .map((item, index) => {
              try {
                console.log(item.eventStartDateTime);
                const { date, time12 } = splitDateTime(item.eventStartDateTime);
                const color = getStatusColor(item.status);
                return {
                  title: item.party?.nameEnglish || "Unknown",
                  date: date,
                  time: time12,
                  mobile: item.party?.mobileno || "N/A",
                  statusCode: item.status,
                  address: item.address || "N/A",
                  event: item.eventType?.nameEnglish || "Event",
                  color: color,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate > today) {
      navigate("/add-event", {
        state: {
          event_date: clickedDate,
        },
      });
    }
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
        </div>

        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1">
            <span className="filItems text-xs font-medium text-gray-900 bg-info rounded px-3 py-1 text-white">
              Inquiry
            </span>
            <span className="filItems text-xs font-medium text-gray-900 bg-indigo-400 rounded px-3 py-1 text-white">
              Confirm
            </span>
            <span className="filItems text-xs font-medium text-gray-900 bg-warning rounded px-3 py-1 text-white">
              Confirm Without Menu
            </span>
            <span className="filItems text-xs font-medium text-gray-900 bg-success rounded px-3 py-1 text-white">
              Completed
            </span>
            <span className="filItems text-xs font-medium text-gray-900 bg-danger rounded px-3 py-1 text-white">
              Cancel
            </span>
          </div>
          <button
            className="btn btn-primary"
            title="Add Event"
            onClick={() => {
              navigate("/add-event");
            }}
          >
            <i className="ki-filled ki-plus"></i> Add Event
          </button>
        </div>

        <CalendarComponent
          data={data}
          openEvent={openEvent}
          handleDateClick={handleDateClick}
        />
      </Container>

      {/* Event Modal */}
      {isModalOpen && (
        <EventViewModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          eventData={eventModalData}
        />
      )}
    </Fragment>
  );
};

export default CalendarPage;
