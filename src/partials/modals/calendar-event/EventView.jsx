import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Text } from "lucide-react";
import { Button,Row, Col, Select } from "antd";

const EventViewModal = ({ isModalOpen, setIsModalOpen, eventData }) => {
    
  let eventDataAll = eventData?.event?._def?.extendedProps
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  
  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="View Event Details"
        width={640}
        footer={[
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Close"
            >
              Close
            </button>
        ]}
      >
         <div className="flex flex-col gap-y-2">
         <div className="flex flex-col">
          <div>
            <span><b>Title:</b> </span> {eventData?.event?._def?.title}
          </div>
          <div>
            <span><b>Date:</b> </span> 2025-07-24
          </div>
          <div>
            <span><b>Address:</b> </span> {eventDataAll?.address}
          </div>
          <div>
            <span><b>Mobile:</b> </span> {eventDataAll?.mobile}
          </div>
          <div>
            <span><b>Status:</b> </span>
            <select className="" placeholder="User Role">
              <option value="1">Inquiry </option>
              <option value="2">Completed</option>
              <option value="3">Pending</option>
            </select>
          </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col>
          <Button type="primary">Menu Preparation</Button>
        </Col>
        <Col>
          <Button type="primary">Menu Allocation</Button>
        </Col>
        <Col>
          <Button type="primary">Raw Material Allocation</Button>
        </Col>
        <Col>
          <Button type="primary">Labour/Other Management</Button>
        </Col>
        <Col>
          <Button type="primary">Order Booking Reports</Button>
        </Col>
        <Col>
          <Button type="primary">Dish Costing</Button>
        </Col>
        <Col>
          <Button type="primary">Quotation</Button>
        </Col>
        <Col>
          <Button type="primary">Invoice</Button>
        </Col>
        <Col>
          <Button type="primary">Proforma Invoice</Button>
        </Col>
        <Col>
          <Button type="primary">Edit</Button>
        </Col>
        <Col>
          <Button type="primary">Copy Order</Button>
        </Col>
      </Row>
    </div>
      </CustomModal>
    )
  );
};
export default EventViewModal;
