import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Button, Row, Col, Select } from "antd";
import { Link } from "react-router-dom";

const EventViewModal = ({ isModalOpen, setIsModalOpen, eventData }) => {
  let eventDataAll = eventData?.event?._def?.extendedProps;
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="View Event Details"
        width={720}
        footer={[
          <div
            className="flex items-center justify-between"
            key={"footer-buttons"}
          >
            <button key="cancel" className="btn btn-danger" title="Delete">
              Delete
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div class="flex flex-col gap-3 lg:gap-4 grow">
            <div class="flex flex-col">
              <p className="text-gray-700">Title:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventData?.event?._def?.title}
              </h4>
            </div>
            <div class="flex flex-col">
              <p className="text-gray-700">Address:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventDataAll?.address}
              </h4>
            </div>
          </div>
          <div class="flex flex-col gap-3 lg:gap-4 grow">
            <div class="flex flex-col">
              <p className="text-gray-700">Date:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventData.event.start.toLocaleDateString("en-CA")}
              </h4>
            </div>
            <div class="flex flex-col">
              <p className="text-gray-700">Mobile:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventDataAll?.mobile}
              </h4>
            </div>
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex items-center justify-center gap-2 grow">
          <label className="form-label w-auto">Status:</label>
          <button
            className="badge badge-outline badge-info rounded-full badge-lg"
            title="Inquiry"
          >
            Inquiry
          </button>
          <button
            className="badge badge-outline badge-success rounded-full badge-lg"
            title="Completed"
          >
            Completed
          </button>
          <button
            className="badge badge-outline badge-warning rounded-full badge-lg"
            title="Pending"
          >
            Pending
          </button>
          {/* <label className="form-label">Status</label>
          <select className="select pe-7.5" placeholder="User Role">
            <option value="1">Inquiry </option>
            <option value="2">Completed</option>
            <option value="3">Pending</option>
          </select> */}
        </div>
        <hr className="my-5" />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Menu Preparation"
            >
              Menu Preparation
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Menu Allocation"
            >
              Menu Allocation
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Raw Material Allocation"
            >
              Raw Material Allocation
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Labour/Other Management"
            >
              Labour/Other Management
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Order Booking Reports"
            >
              Order Booking Reports
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Dish Costing"
            >
              Dish Costing
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Quotation"
            >
              Quotation
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Invoice"
            >
              Invoice
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Proforma Invoice"
            >
              Proforma Invoice
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Edit"
            >
              <i className="ki-filled ki-notepad-edit"></i> Edit
            </button>
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Copy Order"
            >
              <i className="ki-filled ki-copy"></i> Copy Order
            </button>
            {/* <Link to="/menu-preparation">
            <Button type="primary">Menu Preparation</Button>
          </Link>
          <Link to="/menu-allocation">
            <Button type="primary">Menu Allocation</Button>
          </Link>
          <Link to="/raw-material-allocation">
            <Button type="primary">Raw Material Allocation</Button>
          </Link>
          <Link to="/labour-and-other-management">
            <Button type="primary">Labour/Other Management</Button>
          </Link>
          <Link to="/order-booking-reports">
            <Button type="primary">Order Booking Reports</Button>
          </Link>
          <Link to="/dish-costing">
            <Button type="primary">Dish Costing</Button>
          </Link>
          <Link to="/quotation">
            <Button type="primary">Quotation</Button>
          </Link>
          <Link to="/event-invoice">
            <Button type="primary">Invoice</Button>
          </Link>
          <Link to="/proforma-invoice">
            <Button type="primary">Proforma Invoice</Button>
          </Link>
          <Link to="/add-event">
            <Button type="primary">Edit</Button>
          </Link>
          <Link to="">
            <Button type="primary">Copy Order</Button>
          </Link>
          <Link to="">
            <Button type="danger" className="btn-danger">
              Delete
            </Button>
          </Link> */}
          </div>
        </div>
      </CustomModal>
    )
  );
};
export default EventViewModal;
