import { useState } from "react";

import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddSales = ({ isModalOpen, setIsModalOpen }) => {
  
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
              <select className="select select-sm w-full" placeholder="Select Team Member">
                <option value="1">Henry Mark </option>
                <option value="2">Garix Fen</option>
                <option value="2">John Mep</option>
                
              </select>
            </div>
              <div className="filItems">
              <select className="select select-sm w-full" placeholder="User Role">
                <option value="1">Sales Person </option>
                <option value="2">Manager</option>
                
                
              </select>
            </div>
              <div className="filItems">
              <select className="select select-sm w-full" placeholder="Select Manager Name">
                <option value="1">Manan Gandhi </option>
                <option value="2">Ken Jark</option>
                
                
              </select>
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
        title="Add Member"
        footer={[
          
          <button
            key="add"
            className="btn btn btn-primary w-full text-center"
            title="Add Member"
          >
            + Add Member
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
            Member Details 
          </a>
          
          
        </div>
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddSales;
