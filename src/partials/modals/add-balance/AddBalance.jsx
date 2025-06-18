import { useState } from "react";

import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Input } from "@mui/base";

const AddBalance = ({ isModalOpen, setIsModalOpen }) => {
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState("tab_1");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return <div id="tab_1" className="tab-content active"></div>;

      default:
        return null;
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Balance"
        width={500}
        footer={[]}
      >        
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recharge Wallet</h2>        
      </div>
      {/* Current Balance */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Current Balance:</span>
        <span className="font-semibold text-gray-800">₹100</span>
      </div>
      {/* Recharge Amount Input */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Amount To Recharge</label>
        <input
          type="number"
          value={5000}          
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
          placeholder="Enter amount"
        />
      </div>
      {/* GST and Total */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">GST (18%)</span>
        <span className="font-semibold text-gray-800">₹12.55</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-600 font-semibold">TOTAL</span>
        <span className="font-semibold text-gray-800">₹55500</span>
      </div>
      {/* Recharge Now Button */}
      <button className="btn btn-primary w-full  text-white font-bold py-3 rounded-lg  flex justify-center items-center gap-2">
        <span>Recharge Now</span>        
      </button>   
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddBalance;
