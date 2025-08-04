import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { FileUp, ClipboardList } from "lucide-react";

const RaiseTicket = ({ isModalOpen, setIsModalOpen, editData }) => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("tab_1");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting ticket:", formData);
    alert("Ticket submitted!");
    handleModalClose();
  };

  const renderTabContent = () => {
    if (activeTab === "tab_1") {
      return (
        <div className="flex flex-col gap-y-3">
          <select
            name="category"
            value={formData?.category || ""}
            onChange={handleInputChange}
            required
            className="select"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option>Report An Issue</option>
            <option>Give Feedback</option>
            <option>Issue on Billing</option>
          </select>

          <select
            name="sub_category"
            value={formData?.sub_category || ""}
            onChange={handleInputChange}
            required
            className="select"
          >
            <option value="" disabled>
              Select Sub Category
            </option>
            <option>Leads</option>
            <option>Contact</option>
            <option>Follow Up</option>
            <option>Other</option>
          </select>

          <input
            name="subject"
            value={formData?.subject || ""}
            onChange={handleInputChange}
            type="text"
            className="input"
            placeholder="Subject"
            required
          />

          <textarea
            name="description"
            value={formData?.description || ""}
            onChange={handleInputChange}
            placeholder="Description"
            rows={4}
            className="textarea"
            required
          ></textarea>
        </div>
      );
    }

    if (activeTab === "tab_2") {
      return (
        <div className="flex flex-col space-y-4">
          <label className="form-label">Upload Screenshot</label>
          <div className="border border-dashed border-gray-400 p-4 rounded-lg text-center bg-gray-50">
            <FileUp className="text-gray-500 mx-auto mb-2" size={28} />
            <p className="text-gray-600 text-sm mb-2">
              Drag & drop your image or click below
            </p>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="image-upload"
              className="btn btn-light cursor-pointer"
            >
              Browse Files
            </label>
            {formData?.image && (
              <div className="mt-2 text-sm text-green-600">
                File selected: {formData.image.name}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (isModalOpen) {
      setFormData(editData || {});
    } else {
      setFormData({});
      setActiveTab("tab_1");
    }
  }, [isModalOpen, editData]);

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Raise a Ticket"
        width={540}
        footer={[
          <div className="flex justify-between" key="footer-buttons">
            <button
              className="btn btn-light"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              title="Submit"
            >
              Submit
            </button>
          </div>,
        ]}
      >
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            <button
              type="button"
              className={`w-full p-2 rounded border text-sm flex items-center justify-center gap-2 ${
                activeTab === "tab_1"
                  ? "bg-gray-200 border-gray-400"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveTab("tab_1")}
            >
              <ClipboardList size={18} />
              Ticket Details
            </button>
            <button
              type="button"
              className={`w-full p-2 rounded border text-sm flex items-center justify-center gap-2 ${
                activeTab === "tab_2"
                  ? "bg-gray-200 border-gray-400"
                  : "border-gray-300"
              }`}
              onClick={() => setActiveTab("tab_2")}
            >
              <FileUp size={18} />
              Attachments
            </button>
          </div>

          {renderTabContent()}
        </div>
      </CustomModal>
    )
  );
};

export default RaiseTicket;
