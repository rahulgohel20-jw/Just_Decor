import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Text } from "lucide-react";
import { Button,Row, Col, Select } from "antd";
import { Link } from "react-router-dom";

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
        <div className="p-3 mb-4">
        <Row gutter={{ xs: 8, sm: 10, md: 14, lg: 18 }}>
          <Col className="gutter-row" span={4}>
            <p className="ml-4">
              <b>Title:</b>
            </p>
          </Col>
          <Col className="gutter-row" span={14}>
            <p>
              {eventData?.event?._def?.title}
            </p>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 10, md: 14, lg: 18 }} className="mt-2">
          <Col className="gutter-row" span={4}>
            <p className="ml-4">
              <b>Date:</b>
            </p>
          </Col>
          <Col className="gutter-row" span={14}>
            <p>
              {eventData.event.start.toLocaleDateString('en-CA')}
            </p>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 10, md: 14, lg: 18 }} className="mt-2">
          <Col className="gutter-row" span={4}>
            <p className="ml-4">
              <b>Address:</b>
            </p>
          </Col>
          <Col className="gutter-row" span={14}>
            <p>
              {eventDataAll?.address}
            </p>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 10, md: 14, lg: 18 }} className="mt-2">
          <Col className="gutter-row" span={4}>
            <p className="ml-4">
              <b>Mobile:</b>
            </p>
          </Col>
          <Col className="gutter-row" span={14}>
            <p>
              {eventDataAll?.mobile}
            </p>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 10, md: 14, lg: 18 }} className="mt-2">
          <Col className="gutter-row" span={4}>
            <p className="ml-4">
              <b>Status:</b>
            </p>
          </Col>
          <Col className="gutter-row" span={14}>
            
               <select className="select" placeholder="User Role">
              <option value="1">Inquiry </option>
              <option value="2">Completed</option>
              <option value="3">Pending</option>
            </select>
          </Col>
        </Row>
        </div>
        <Row gutter={[16, 16]}>
          <Col className="gutter-row" span={8}>
              <Link to="/menu-preparation">
                <Button type="primary">Menu Preparation</Button>
              </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/menu-allocation">
                <Button type="primary">Menu Allocation</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/raw-material-allocation">
               <Button type="primary">Raw Material Allocation</Button>
            </Link>
            
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/labour-and-other-management">
            <Button type="primary">Labour/Other Management</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/order-booking-reports">
            <Button type="primary">Order Booking Reports</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/dish-costing">
            <Button type="primary">Dish Costing</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/quotation">
            <Button type="primary">Quotation</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/event-invoice">
            <Button type="primary">Invoice</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/proforma-invoice">
            <Button type="primary">Proforma Invoice</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="/add-event">
            <Button type="primary">Edit</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="">
            <Button type="primary">Copy Order</Button>
            </Link>
          </Col>
          <Col className="gutter-row" span={8}>
            <Link to="">
            <Button type="danger" className="btn-danger">Delete</Button>
            </Link>
          </Col>
        </Row>
      </CustomModal>
    )
  );
};
export default EventViewModal;
