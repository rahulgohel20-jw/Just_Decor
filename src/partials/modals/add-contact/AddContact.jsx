import { useState } from "react";
import PhoneNumber from "@/components/form-inputs/PhoneNumber/PhoneNumber";

import { CustomModal } from "@/components/custom-modal/CustomModal";
import DatePicker from "@/components/form-inputs/DatePicker/DatePicker";

const AddContact = ({ isModalOpen, setIsModalOpen }) => {
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateOfAnniversary, setDateOfAnniversary] = useState(null);
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
                <label className="form-label ">Select Role</label>
                <select
                  className="input form-select-solid w-full"
                  data-control="select2"
                  data-placeholder="Company name"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <label className="form-label ">Email</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="form-label ">First Name</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="form-label ">Last Name</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter last name"
                />
              </div>
              <PhoneNumber />
              <div></div>
              <div>
                <label className="form-label">Date of Birth</label>
                <DatePicker date={dateOfBirth} setDate={setDateOfBirth} />
              </div>
              <div>
                <label className="form-label">Date of Anniversary</label>
                <DatePicker
                  date={dateOfAnniversary}
                  setDate={setDateOfAnniversary}
                />
              </div>
            </div>
          </div>
        );
      case "tab_2":
        return (
          <div id="tab_2" className="tab-content">
            <div className="grid grid-cols-2 gap-6">
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
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Pincode"
                />
              </div>
              <div>
                <label className="form-label ">Address</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Address"
                />
              </div>
            </div>
          </div>
        );
      case "tab_3":
        return (
          <div id="tab_3" className="tab-content">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label ">Linkedin</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter valid URL starting with https://"
                />
              </div>
              <div>
                <label className="form-label ">Twitter</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter valid URL starting with https://"
                />
              </div>
              <div>
                <label className="form-label ">Youtube</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter valid URL starting with https://"
                />
              </div>
              <div>
                <label className="form-label ">Facebook</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter valid URL starting with https://"
                />
              </div>
              <div>
                <label className="form-label ">Instagram</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter valid URL starting with https://"
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
        title="Add Contact"
        footer={[
          <button
            key="cancel"
            className="btn btn-sm btn-secondary"
            onClick={handleModalClose}
          >
            Cancel
          </button>,
          <button key="save" className="btn btn-sm btn-primary">
            Save Contact
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
            Contact Details
          </a>
          <a
            className={`btn btn-clear w-full flex justify-center ${
              activeTab === "tab_2" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab_2")}
          >
            Address Details
          </a>
          <a
            className={`btn btn-clear w-full flex justify-center ${
              activeTab === "tab_3" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab_3")}
          >
            Social Profile
          </a>
        </div>
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddContact;
