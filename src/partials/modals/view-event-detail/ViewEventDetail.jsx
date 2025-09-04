import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { underConstruction } from "@/underConstruction";
import { GetEventMasterById } from "@/services/apiServices";
import dayjs from "dayjs";

const ViewEventDetail = ({ isModalOpen, setIsModalOpen, eventId }) => {
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);

  const Field = ({ label, value }) => (
    <div className="flex">
      <span className="w-48 font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-800">{value || "-"}</span>
    </div>
  );
  useEffect(() => {
    if (isModalOpen && eventId) {
      setLoading(true);
      GetEventMasterById(eventId)
        .then((res) => {
          const event = res.data.data["Event Details"][0];
          setEventData((prev) => ({
            ...event,
            inquiryDate: event.inquiryDate
              ? dayjs(event.inquiryDate, "DD/MM/YYYY").format("DD/MM/YYYY")
              : prev.inquiryDate,
          }));
        })
        .catch((err) => console.error("Error fetching event:", err))
        .finally(() => setLoading(false));
    }
  }, [isModalOpen]);

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="View Event Details"
        width={800}
        footer={[
          <div className="flex items-center justify-end" key={"footer-buttons"}>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Close"
            >
              Close
            </button>
          </div>,
        ]}
      >
        {eventData && !loading ? (
          <div className="flex flex-col gap-y-2 gap-x-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-3 gap-x-5">
              <Field label="Event No" value={eventData?.eventNo} />
              <Field label="Inquiry Date" value={eventData?.inquiryDate} />
              <Field
                label="Start Event Date"
                value={eventData?.eventStartDateTime}
              />
              <Field
                label="End Event Date"
                value={eventData?.eventEndDateTime}
              />
              <Field label="Venue" value={eventData?.venue} />
              <Field label="Address" value={eventData?.address} />
              <Field
                label="Status"
                value={eventData?.status === 1 ? "Active" : "Inactive"}
              />
              <Field label="Mobile No" value={eventData?.mobileno} />
              <Field
                label="Manager"
                value={`${eventData?.manager?.firstName} ${eventData?.manager?.lastName}`}
              />
              <Field label="Party Name" value={eventData?.party?.nameEnglish} />
              <Field
                label="Meal Type"
                value={eventData?.mealType?.nameEnglish}
              />
              <Field
                label="Event Type"
                value={eventData?.eventType?.nameEnglish}
              />
              <Field label="Created At" value={eventData?.createdAt} />
            </div>
          </div>
        ) : (
          ""
        )}

        <hr className="mt-5 mb-4" />
      </CustomModal>
    )
  );
};
export default ViewEventDetail;
