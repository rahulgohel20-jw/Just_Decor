import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useState } from "react";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyle from "./style";
import AddSupplier from "../add-supplier/AddSupplier";
const AddRawMaterial = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    rawCategoryId: "",
    supplierRate: "",
    priority: "",
    generalFixAccess: false,
  });
  const classes = useStyle();
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData] = useState(defaultData);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      generalFixAccess: !prev.generalFixAccess,
    }));
  };

  const handleSave = () => {
    console.log("Saving Raw Material:", formData);
    onClose(false);
  };

  return (
    isOpen && (
      <CustomModal
        open={isOpen}
        onClose={() => onClose(false)}
        title={"New Raw Material"}
        footer={[
          <div className="flex justify-between " key="footer-buttons">
            <button className="btn btn-light" onClick={() => onClose(false)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-4 max-h-[450px] overflow-auto scrollable-y">
          {/* Names */}
          <div className="grid grid-cols-3 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Name (English)</label>
              <input
                type="text"
                name="nameEnglish"
                value={formData.nameEnglish}
                onChange={handleChange}
                placeholder="Enter English Name"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Name (ગુજરાતી)</label>
              <input
                type="text"
                name="nameGujarati"
                value={formData.nameGujarati}
                onChange={handleChange}
                placeholder="Enter Gujarati Name"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Name (हिंदी)</label>
              <input
                type="text"
                name="nameHindi"
                value={formData.nameHindi}
                onChange={handleChange}
                placeholder="Enter Hindi Name"
                className="input"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="form-label">Raw Material Category</label>
            <select
              className="select"
              name="rawCategoryId"
              value={formData.rawCategoryId}
              onChange={handleChange}
            >
              <option value="">Select Raw Material Category</option>
              <option value="1">Vegetables</option>
              <option value="2">Spices</option>
              <option value="3">Grains</option>
            </select>
          </div>

          {/* Supplier Rate & Priority */}
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Supplier Rate</label>
              <input
                type="tel"
                name="supplierRate"
                value={formData.supplierRate}
                onChange={handleChange}
                placeholder="Enter Supplier Rate"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Priority</label>
              <input
                type="tel"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                placeholder="Enter Priority"
                className="input"
              />
            </div>
          </div>

          {/* General Fix */}
          <div className="flex items-center gap-2 mt-2">
            <label className="form-label">General Fix Raw Material</label>
            <label className="switch switch-lg">
              <input
                type="checkbox"
                checked={formData.generalFixAccess}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>

          {/* Extra Fields & Table (only when toggle true) */}
          {formData.generalFixAccess && (
            <div className="flex flex-col gap-y-4 mt-4">
              {/* Extra input */}
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">Weight Per 100 Person</label>
                  <input
                    type="tel"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Enter Weight"
                    className="input"
                  />
                </div>
              </div>

              {/* Table inside modal */}
            </div>
          )}
          <div>
            <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
              <div
                className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
              >
                <div className="filItems relative">
                  <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                  <input
                    className="input pl-8"
                    placeholder="Search Supplier"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsSupplierModalOpen(true)}
                  title="Add Supplier"
                >
                  <i className="ki-filled ki-plus"></i> Add Supplier
                </button>
              </div>
            </div>
            <TableComponent
              columns={columns(
                () => {},
                () => {},
                () => {}
              )}
              data={tableData}
              paginationSize={5}
            />
          </div>
          <div></div>
          <div>
            <AddSupplier
              isOpen={isSupplierModalOpen}
              onClose={setIsSupplierModalOpen}
            />
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default AddRawMaterial;
