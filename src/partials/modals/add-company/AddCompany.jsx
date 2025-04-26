import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
const AddCompany = ({ isModalOpen, setIsModalOpen }) => {
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("tab_1");

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Company"
        footer={[
          <button
            key="cancel"
            className="btn btn-secondary"
            onClick={handleModalClose}
            title="Cancel"
          >
            Cancel
          </button>,
          <button
            key="save"
            className="btn btn-primary"
            title="Save Contact"
          >
            Save Company
          </button>,
        ]}
      >       
       <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="form-label ">Company Name</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Company Name"
            />
          </div>
          <div>
            <label className="form-label ">Tax No</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Tax No"
            />
          </div>
          <div>
            <label className="form-label ">Company Code</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Company Code"
            />
          </div>
          <div>
            <label className="form-label ">Website</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter URL"
            />
          </div>
        </div>
       <hr />
       <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="form-label ">Country</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Country"
            />
          </div>
          <div>
            <label className="form-label ">State</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="State"
            />
          </div>
          <div>
            <label className="form-label ">City</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="City"
            />
          </div>
          <div>
            <label className="form-label ">Pincode</label>
            <input
              type="tel"
              className="input form-control-solid w-full"
              placeholder="Pincode"
            />
          </div>
          <div>
            <label className="form-label ">Billing Address</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Billing Address"
            />
          </div>
          <div>
            <label className="form-label ">Shipping Address</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Shipping Address"
            />
          </div>
        </div>
       
      </CustomModal>
    )
  );
};
export default AddCompany;
