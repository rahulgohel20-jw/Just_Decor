import { useState } from "react";

import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddLink = ({ isModalOpen, setIsModalOpen }) => {
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  
  const [activeTab, setActiveTab] = useState("tab_1");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div id="tab_1" className="tab-content active">
            <div className="grid grid-cols-1 gap-6">
              <div className="filItems">
              <select className="select select-lg w-full" placeholder="Please select">
                <option value="1">Sales </option>
                <option value="2">Marketing</option>
                <option value="3">Customer Support</option>
                <option value="3">HR/Admin</option>
                <option value="3">General</option>
                <option value="3">Automation</option>

                <option value="3">Operations</option>


              </select>
            </div>
              <div>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Link Name"
            />
            </div>
              <div>
            <textarea
              rows={5}
              type="text"
              className="input form-control-solid w-full"
              placeholder="Description here"
            />
          </div>
              <div>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Url Name"
            />
          </div>
          <div>
                        <input
              type="file"
              className="input form-control-solid w-full"
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
        title="Add Link"
        footer={[
          
          <button
            key="add"
            className="btn btn btn-primary w-50 "
            title="Save Link"
          >
            Save Link
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
            Link Details 
          </a>
          
          
        </div>
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddLink;
