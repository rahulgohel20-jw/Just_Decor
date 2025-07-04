import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { FileUp, ClipboardList } from "lucide-react"; // use Lucide icons or your icon set

const RaiseTicket = ({ isModalOpen, setIsModalOpen, editData }) => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("tab_1");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    switch (activeTab) {
      case "tab_1":
        return (
          <div id="tab_1" className="tab-content space-y-4">
            <div className="flex flex-col">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData?.category || ""}
                onChange={handleInputChange}
                className="select w-full"
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option>Report An Issue</option>
                <option>Give Feedback</option>
                <option>Issue on Billing</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="form-label">Sub Category</label>
              <select
                name="sub_category"
                value={formData?.sub_category || ""}
                onChange={handleInputChange}
                className="select w-full"
              >
                <option value="" disabled>
                  Select Sub Category
                </option>
                <option>Leads</option>
                <option>Contact</option>
                <option>Follow Up</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="form-label">Subject</label>
              <input
                name="subject"
                value={formData?.subject || ""}
                onChange={handleInputChange}
                type="text"
                className="input"
                placeholder="Subject"
              />
            </div>

            <div className="flex flex-col">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData?.description || ""}
                onChange={handleInputChange}
                placeholder="Describe your issue"
                rows={4}
                className="input"
              ></textarea>
            </div>
          </div>
        );

      case "tab_2":
        return (
          <div id="tab_2" className="tab-content space-y-4">
            <div className="flex flex-col">
              <label className="form-label">Upload Screenshot</label>
              <div className="border border-dashed border-gray-400 p-4 rounded-lg text-center">
                <FileUp className="text-gray-500 mx-auto mb-2" size={28} />
                <p className="text-gray-600 text-sm mb-2">
                  Drag & drop your image or click below
                </p>
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
                <label htmlFor="image-upload" className="btn btn-light">
                  Browse Files
                </label>
              </div>
              {formData?.image && (
                <div className="mt-2 text-sm text-green-600">
                  File selected: {formData.image.name}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
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
              key="cancel"
              className="btn btn-secondary"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>
            <button
              key="submit"
              className="btn btn-success"
              onClick={handleSubmit}
              title="Submit"
            >
              Submit
            </button>
          </div>,
        ]}
      >
        <div className="btn-tabs btn-tabs-lg flex justify-between mb-4 w-full">
          <a
            className={`btn btn-clear w-full flex justify-center ${
              activeTab === "tab_1" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab_1")}
          >
            <ClipboardList className="mr-2" size={18} />
            Ticket Details
          </a>
          <a
            className={`btn btn-clear w-full flex justify-center ${
              activeTab === "tab_2" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab_2")}
          >
            <FileUp className="mr-2" size={18} />
            Attachments
          </a>
        </div>
        {renderTabContent()}
      </CustomModal>
    )
  );
};

export default RaiseTicket;
