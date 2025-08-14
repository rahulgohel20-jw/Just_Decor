import React, { Fragment, useState } from "react";
import { Container } from "@/components/container";
import CalendarComponent from "@/components/CalendarComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import EventViewModal from "@/partials/modals/calendar-event/EventView";
import { useNavigate } from "react-router-dom";
import { calendarData } from "./constant";
import { Link } from "lucide-react";
import { Button } from "antd";
const CalendarPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState(false);
  const openEvent = (data) => {
    setEventModalData(data);
    setIsModalOpen(true);
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
        <div className="gap-2 pb-2 mb-3">
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
          <button className="btn btn-primary" title="Add Event">
            <i class="ki-filled ki-plus"></i> Add Event
          </button>
        </div>
        <CalendarComponent
          data={calendarData}
          openEvent={openEvent}
          handleDateClick={handleDateClick}
        />
      </Container>
      {/* AddContact */}
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
