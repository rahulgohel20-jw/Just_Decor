import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { underConstruction } from "@/underConstruction";
import { Link } from "react-router-dom";
import { DeleteEventMaster } from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import Swal from "sweetalert2";
const EventViewModal = ({
  isModalOpen,
  setIsModalOpen,
  eventData,
  onEventsUpdated,
}) => {
  // FullCalendar event extra props
  const eventDataAll = eventData?.event?._def?.extendedProps || {};
  const safeEventId =
    eventDataAll?.eventid ?? eventDataAll?.id ?? eventData?.event?.id ?? null;

  const [isMenuReport, setIsMenuReport] = useState(false);
  const [menuReportEventId, setMenuReportEventId] = useState(null);

  const handleModalClose = () => setIsModalOpen(false);

  const openMenuReport = (eventId) => {
    if (!eventId) {
      errorMsgPopup("Event ID missing.");
      return;
    }
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  };

  const DeleteEvent = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const eventId = safeEventId;
        if (!eventId) {
          errorMsgPopup("Event ID missing.");
          return;
        }
        DeleteEventMaster(eventId)
          .then((response) => {
            if (response && (response.success || response.status === 200)) {
              setIsModalOpen(false);
              onEventsUpdated?.();
              Swal.fire({
                title: "Removed!",
                text: "Event has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((error) => {
            error?.data?.msg && errorMsgPopup(error.data.msg);
            console.error("Error deleting event:", error);
          });
      }
    });
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="View Event Details"
        width={800}
        footer={[
          <div className="flex items-center justify-end" key="footer-buttons">
            <button
              className="btn btn-light"
              onClick={handleModalClose}
              title="Close"
            >
              Close
            </button>
          </div>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <div className="flex flex-col gap-3 lg:gap-4 grow">
            <div className="flex flex-col">
              <p className="text-gray-700">Name:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventData?.event?._def?.title}
              </h4>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-700">Address:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventDataAll?.address}
              </h4>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:gap-4 grow">
            <div className="flex flex-col">
              <p className="text-gray-700">Date:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventData?.event?.start?.toLocaleDateString?.("en-CA")}
              </h4>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-700">Mobile:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventDataAll?.mobile}
              </h4>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 grow">
            <button
              className="btn btn-sm btn-success justify-center w-full"
              title="Copy Order"
              onClick={underConstruction}
            >
              <i className="ki-filled ki-copy me-1"></i> Copy Order
            </button>

            <Link to={`/edit-event/${safeEventId}`}>
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Edit Event"
              >
                <i className="ki-filled ki-notepad-edit me-1"></i> Edit Event
              </button>
            </Link>

            <button
              className="btn btn-sm btn-danger justify-center w-full"
              title="Delete"
              onClick={DeleteEvent}
            >
              <i className="ki-filled ki-trash me-1"></i> Delete
            </button>
          </div>
        </div>

        <hr className="mt-5 mb-4" />

        <div className="flex items-center justify-center gap-2 grow">
          <button
            className="btn btn-sm px-5 rounded-full bg-gray-400 text-white"
            title="Inquiry"
          >
            <i className="ki-filled ki-check me-1"></i> Inquiry
          </button>
          <button
            className="btn btn-sm px-5 rounded-full bg-warning text-white"
            title="Pending"
          >
            Pending
          </button>
          <button
            className="btn btn-sm px-5 rounded-full bg-success text-white"
            title="Completed"
          >
            Completed
          </button>
        </div>

        <hr className="mt-4 mb-5" />

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
            <Link to={`/menu-preparation/${safeEventId}`}>
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Menu Preparation"
              >
                Menu Preparation
              </button>
            </Link>

            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Menu Allocation"
              onClick={underConstruction}
            >
              Menu Allocation
            </button>

            <Link to="/raw-material-allocation">
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Raw Material Allocation"
              >
                Raw Material Allocation
              </button>
            </Link>

            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Labour/Other Management"
              onClick={underConstruction}
            >
              Labour/Other Management
            </button>

            {/* OPEN MENU REPORT MODAL */}
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Menu Report"
              onClick={() => openMenuReport(safeEventId)}
            >
              Menu Report
            </button>

            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Dish Costing"
              onClick={underConstruction}
            >
              Dish Costing
            </button>

            <Link to={`/quotation/${safeEventId}`}>
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Quotation"
              >
                Quotation
              </button>
            </Link>

            <Link to="/add-invoice">
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Invoice"
              >
                Invoice
              </button>
            </Link>

            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Proforma Invoice"
              onClick={underConstruction}
            >
              Proforma Invoice
            </button>
          </div>
        </div>

        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={menuReportEventId}
        />
      </CustomModal>
    )
  );
};

export default EventViewModal;
