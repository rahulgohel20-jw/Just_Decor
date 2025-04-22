import { useState } from "react";

import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddCompany = ({ isModalOpen, setIsModalOpen }) => {
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("tab_1");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div id="tab_1" className="tab-content active">
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
              <div></div>
              
              
            </div>
          </div>
        );
      case "tab_2":
        return (
          <div id="tab_2" className="tab-content">
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
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Company"
        footer={[
          <button
            key="cancel"
            className="btn btn-sm btn-secondary"
            onClick={handleModalClose}
            title="Cancel"
          >
            Cancel
          </button>,
          <button
            key="save"
            className="btn btn-sm btn-primary"
            title="Save Contact"
          >
            Save Company
          </button>,
        ]}
      >
        <div
          className="btn-tabs tabs-lg flex justify-between mb-5 w-full"
          data-tabs="true"
        >
          <a
            className={`btn btn-clear w-full flex justify-center ${
              activeTab === "tab_1" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab_1")}
          >
            Company Details
          </a>
          <a
            className={`btn btn-clear w-full flex justify-center ${
              activeTab === "tab_2" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab_2")}
          >
            Address Details
          </a>
          
        </div>
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddCompany;
