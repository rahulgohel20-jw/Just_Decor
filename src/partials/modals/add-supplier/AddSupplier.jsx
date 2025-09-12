import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useState } from "react";
import { TableComponent } from "@/components/table/TableComponent";
import useStyle from "./style";

const AddSupplier = ({ isOpen, onClose }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, generalFixAccess: !prev.generalFixAccess }));
  };

  const handleSave = () => {
    console.log("Saving Supplier:", formData);
    onClose(false);
  };

  return (
    isOpen && (
      <CustomModal
        open={isOpen}
        onClose={() => onClose(false)}
        title={"New Supplier"}
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
          {/* Supplier */}
          <div className="flex flex-col">
            <label className="form-label">Supplier</label>
            <select
              className="select"
              name="rawCategoryId"
              value={formData.rawCategoryId}
              onChange={handleChange}
            >
              <option value="">Supplier</option>
              <option value="1">Manoj</option>
              <option value="2">Kirtan</option>
              <option value="3">Jaimin</option>
            </select>
          </div>

          
        </div>
      </CustomModal>
    )
  );
};

export default AddSupplier;
