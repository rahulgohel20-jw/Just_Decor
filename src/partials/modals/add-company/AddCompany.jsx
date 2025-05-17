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
       <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <label className="form-label">Company Name</label>
            <div class="input">
              <i class="ki-filled ki-user"></i>
              <input
                class="h-full"
                type="text"
                placeholder="Company Name"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Tax No</label>
            <div class="input">
              <i class="ki-filled ki-cheque"></i>
              <input
                class="h-full"
                type="text"
                placeholder="Tax No"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Company Code</label>
            <div class="input">
              <i class="ki-filled ki-user"></i>
              <input
                class="h-full"
                type="text"
                placeholder="Company Code"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Website</label>
            <div class="input">
              <i class="ki-filled ki-dribbble"></i>
              <input
                class="h-full"
                type="text"
                placeholder="Enter URL"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Country</label>
            <div class="input">
              <i class="ki-filled ki-bank"></i>
              <input
                class="h-full"
                type="text"
                placeholder="Country"
              />
            </div>
          </div>
          <div>
            <label className="form-label">State</label>
            <div class="input">
              <i class="ki-filled ki-bank"></i>
              <input
                class="h-full"
                type="text"
                placeholder="State"
              />
            </div>
          </div>
          <div>
            <label className="form-label">City</label>
            <div class="input">
              <i class="ki-filled ki-pointers"></i>
              <input
                class="h-full"
                type="text"
                placeholder="City"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Pincode</label>
            <div class="input">
              <i class="ki-filled ki-geolocation"></i>
              <input
                class="h-full"
                type="tel"
                placeholder="Pincode"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Billing Address</label>
            <div class="input">
              <i class="ki-filled ki-geolocation"></i>
              <input
                class="h-full"
                type="text"
                placeholder="Billing Address"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Shipping Address</label>
            <div class="input">
              <i class="ki-filled ki-geolocation"></i>
              <input
                class="h-full"
                type="text"
                placeholder="Shipping Address"
              />
            </div>
          </div>
        </div>       
      </CustomModal>
    )
  );
};
export default AddCompany;
