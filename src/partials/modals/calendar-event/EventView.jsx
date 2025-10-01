import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { underConstruction } from "@/underConstruction";
import { Link } from "react-router-dom";
import { DeleteEventMaster } from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
const EventViewModal = ({
  isModalOpen,
  setIsModalOpen,
  eventData,
  onEventsUpdated,
}) => {
  const navigate = useNavigate();

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
        width={1100}
      >
        <div className="p-2 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 flex flex-col gap-6 mb-1">
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-600">Name</p>
              <h3 className="font-semibold text-base mb-2">
                {eventData?.event?._def?.title}
              </h3>

              <p className="text-gray-600">Mobile No.</p>
              <h3 className="font-semibold text-base mb-2">
                {eventDataAll?.mobile}
              </h3>

              <p className="text-gray-600">Date</p>
              <h3 className="font-semibold text-base mb-2">
                {eventData?.event?.start?.toLocaleDateString?.("en-CA")}
              </h3>

              <p className="text-gray-600">Venue</p>
              <h3 className="font-semibold text-base mb-2">
                {eventDataAll?.address}
              </h3>
            </div>

            <div className="bg-white p-4 rounded-xl shadow ">
              <h2 className="mb-2 text-gray-600">Status</h2>
              <select className=" w-full border rounded px-2 py-1 mb-3">
                <option>Inquiry</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
              <div className="flex justify-end gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded">
                  Save
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-3 grid grid-cols-3 gap-4">
            {[
              {
                label: "Menu Preparation",
                icon: "/media/eventviewicon/menuprep.png",
                onClick: () => navigate(`/menu-preparation/${safeEventId}`),
              },
              {
                label: "Menu Allocation",
                icon: "/media/eventviewicon/menuallocation.png",
                onClick: underConstruction,
              },
              {
                label: "Raw Material Allocation",
                icon: "/media/eventviewicon/rawmaterial.png",
                onClick: () => navigate("/raw-material-allocation"),
              },
              {
                label: "Labour / Other Management",
                icon: "/media/eventviewicon/labour.png",
                onClick: underConstruction,
              },
              {
                label: "Menu Report",
                icon: "/media/eventviewicon/menureport.png",
                onClick: () => openMenuReport(safeEventId),
              },
              {
                label: "Dish Costing",
                icon: "/media/eventviewicon/dishcost.png",
                onClick: underConstruction,
              },
              {
                label: "Quotation",
                icon: "/media/eventviewicon/quotation.png",
                onClick: () => navigate(`/quotation/${safeEventId}`),
              },
              {
                label: "Invoice",
                icon: "/media/eventviewicon/invoice.png",
                onClick: () => navigate("/add-invoice"),
              },
              {
                label: "Proforma Invoice",
                icon: "/media/eventviewicon/proforma.png",
                onClick: underConstruction,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={item.onClick}
                className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              >
                <div className="text-blue-600 text-3xl mb-2">
                  <img
                    src={toAbsoluteUrl(item.icon)}
                    alt={item.label}
                    className="w-10 h-10"
                  />
                </div>
                <p className="font-medium text-gray-800 text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-6 mt-3">
          <Link to={`/edit-event/${safeEventId}`}>
            <button className="bg-primary text-white w-[300px] h-12 rounded-md font-medium">
              <i className="ki-filled ki-notepad-edit me-1"></i>Edit Event
            </button>
          </Link>
          <button
            className="bg-success text-white w-[300px] h-12 rounded-md font-medium"
            onClick={() => navigate(`/edit-event/${safeEventId}/copy`)}
          >
            <i className="ki-filled ki-copy me-1"></i> Copy of Event
          </button>
          <button
            className="bg-danger text-white w-[300px] h-12 rounded-md font-medium"
            onClick={DeleteEvent}
          >
            <i className="ki-filled ki-trash me-1"></i> Delete
          </button>
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
