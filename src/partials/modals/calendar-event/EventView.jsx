import { CustomModal } from "@/components/custom-modal/CustomModal";
import { underConstruction } from "@/underConstruction";
import { Link } from "react-router-dom";
import { UpdateEventMaster, DeleteEventMaster } from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";

const EventViewModal = ({
  isModalOpen,
  setIsModalOpen,
  eventData,
  onEventsUpdated,
}) => {
  let eventDataAll = eventData?.event?._def?.extendedProps;

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const DeleteEvent = () => {
    let eventId = eventDataAll.eventid;
    DeleteEventMaster(eventId)
      .then((response) => {
        setIsModalOpen(false);
        onEventsUpdated();
        response.data?.msg && successMsgPopup(response.data.msg);
      })
      .catch((error) => {
        error.data?.msg && errorMsgPopup(error.data.msg);
        console.error("Error deleting event:", error);
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
                {eventData.event.start.toLocaleDateString("en-CA")}
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
            <Link to="">
              <button
                className="btn btn-sm btn-success justify-center w-full"
                title="Copy Order"
                onClick={underConstruction}
              >
                <i className="ki-filled ki-copy me-1"></i> Copy Order
              </button>
            </Link>
            <Link to={`/edit-event/${eventDataAll?.eventid}`}>
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Edit Event"
              >
                <i className="ki-filled ki-notepad-edit me-1"></i> Edit Event
              </button>
            </Link>
            <button
              key="cancel"
              className="btn btn-sm btn-danger justify-center w-full"
              title="Delete"
              onClick={DeleteEvent}
            >
              <i className="ki-filled ki-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
        <hr className="mt-5 mb-4" />
        <div className="flex items-center justify-center gap-2 grow">
          <button
            className="btn btn-sm px-5 rounded-full bg-gray-400 text-white transition-colors duration-200 flex items-center space-x-2"
            title="Inquiry"
          >
            <i className="ki-filled ki-check me-1"></i> Inquiry
          </button>
          <button
            className="btn btn-sm px-5 rounded-full bg-warning text-white transition-colors duration-200 flex items-center space-x-2"
            title="Pending"
          >
            Pending
          </button>
          <button
            className="btn btn-sm px-5 rounded-full bg-success text-white transition-colors duration-200 flex items-center space-x-2"
            title="Completed"
          >
            Completed
          </button>
        </div>
        <hr className="mt-4 mb-5" />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
            <Link to={`/menu-preparation/${eventDataAll?.eventid}`}>
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Menu Preparation"
              >
                Menu Preparation
              </button>
            </Link>
            {/* <Link to="/menu-allocation"> */}
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Menu Allocation"
              onClick={underConstruction}
            >
              Menu Allocation
            </button>
            {/* </Link> */}
            <Link to="/raw-material-allocation">
              <button
                className="btn btn-sm btn-primary justify-center w-full"
                title="Raw Material Allocation"
                // onClick={underConstruction}
              >
                Raw Material Allocation
              </button>
            </Link>
            {/* <Link to="/labour-and-other-management"> */}
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Labour/Other Management"
              onClick={underConstruction}
            >
              Labour/Other Management
            </button>
            {/* </Link> */}
            {/* <Link to="/order-booking-reports"> */}
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Order Booking Reports"
              onClick={underConstruction}
            >
              Order Booking Reports
            </button>
            {/* </Link> */}
            {/* <Link to="/dish-costing"> */}
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Dish Costing"
              onClick={underConstruction}
            >
              Dish Costing
            </button>
            {/* </Link> */}
            <Link to="/quotation">
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
            {/* <Link to="/proforma-invoice"> */}
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Proforma Invoice"
              onClick={underConstruction}
            >
              Proforma Invoice
            </button>
            {/* </Link> */}
          </div>
        </div>
      </CustomModal>
    )
  );
};
export default EventViewModal;
