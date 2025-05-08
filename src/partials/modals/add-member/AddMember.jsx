import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
const AddMember = ({ isModalOpen, setIsModalOpen }) => {

 const [taskAccess, setTaskAccess] = useState(true);
  const [leaveAccess, setLeaveAccess] = useState(true);


  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("tab_1");


  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add New Team Member"
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
            title="Add Member"
          >
            Add Member
          </button>,
        ]}
      >       
       <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label className="form-label">Country</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Country"
            />
          </div>
          <div>
            <label className="form-label">WhatsApp No</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="WhatsApp No"
            />
          </div>
        </div>
       <hr />
       <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-2">
          
          <div className="filItems">
            <label className="form-label">Role</label>
              <select className="select select-md w-full" placeholder="Select Team Member">
                <option value="Team Member">Team Member </option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
                
              </select>
            </div>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="input form-control-solid w-full"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input form-control-solid w-full"
              placeholder="Password"
            />
          </div>
          
        </div>
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-black">Task Access</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={taskAccess}
            onChange={() => setTaskAccess(!taskAccess)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-rose-500 transition duration-300"></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              taskAccess ? "translate-x-5" : ""
            }`}
          ></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-black">Leave & Attendance Access</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={leaveAccess}
            onChange={() => setLeaveAccess(!leaveAccess)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-rose-500 transition duration-300"></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              leaveAccess ? "translate-x-5" : ""
            }`}
          ></div>
        </label>
      </div>
    </div>
       
      </CustomModal>
    )
  );
};
export default AddMember;
