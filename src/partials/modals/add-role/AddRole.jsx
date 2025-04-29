import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";

const permissions = [
  "Dashboard",
  "Pipeline",
  "Contacts",
  "Company",
  "Follow-up",
  "Products",
  "Team",
  "Settings",
];

const AddRole = ({ isModalOpen, setIsModalOpen }) => {
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("pages");
//   const [selectedFeature, setSelectedFeature] = useState("basic");

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
          <button key="save" className="btn btn-primary" title="Save Contact">
            Save Company
          </button>,
        ]}
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Define Role Input */}
          <div>
            <label className="form-label">Define Role</label>
            <input
              type="text"
              className="input form-control-solid"
              placeholder="Define Role"
            />
          </div>
          <div>
          <button
                className="btn btn-sm bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handleAddRole}
                title="Add Role"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Lead Access */}
          <div className=" relative">
            <label className="form-label block mb-1">Lead Access</label>
            <div className="relative">
              <select
                className="input form-control-solid w-full appearance-none pr-10"
                defaultValue="all"
              >
                <option value="all">All Leads</option>
                <option value="assigned">Assigned Leads</option>
                <option value="created">Leads</option>
              </select>
              <i className="ki-filled ki-down absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
            </div>
          </div>
          <hr />
          {/* Tabs */}
          <div className="flex border-b ">
            <button
              onClick={() => setActiveTab("pages")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "pages"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              Pages
            </button>
            <button
              onClick={() => setActiveTab("features")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "features"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              Features
            </button>
          </div>
          {/* Pages Table */}
          {activeTab === "pages" && (
            <div className="max-h-60 overflow-y-auto border rounded-md">
              <table className="w-full table-auto text-sm text-left text-gray-700">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Pages</th>
                    <th className="px-4 py-2">View</th>
                    <th className="px-4 py-2">Edit</th>
                    <th className="px-4 py-2">Delete</th>
                    <th className="px-4 py-2">Add</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((page) => (
                    <tr key={page} className="border-t">
                      <td className="px-4 py-2">{page}</td>
                      {["view", "edit", "delete", "add"].map((action) => (
                        <td key={action} className="px-4 py-2 text-center">
                          <input type="checkbox" className="form-checkbox" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Features Table */}
          {activeTab === "features" && (
            <div className="space-y-4 text-sm">
              <div className="max-h-60 overflow-y-auto border rounded-md">
                <table className="w-full table-auto text-left text-gray-700">
                  <thead>
                    <tr className="bg-white-500 text-gray">
                      <th className="px-4 py-2">Features</th>
                      <th className="px-4 py-2 text-center">
                        Enable / Disable
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Send Whatsapp",
                      "Bulk Upload",
                      "Pipeline Template",
                      "Send Quotation To Client",
                      "All Quotation Page Access",
                      "Quotation Setting Page Access",
                    ].map((feature) => (
                      <tr key={feature} className="border-t">
                        <td className="px-4 py-2">{feature}</td>
                        <td className="px-4 py-2 text-center">
                          <input type="checkbox" className="form-checkbox" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        
      </CustomModal>
    )
  );
};

export default AddRole;
