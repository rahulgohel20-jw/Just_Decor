import { useState, useEffect } from "react";
import { 
  AddMenuItems, 
  GetMenuCategoryByUserId, 
  GetAllSubCategory, 
  GetAllKitchenAreaById 
} from "@/services/apiServices";

const AddMenuItem = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  selectedMenuItem,
}) => {
  if (!isModalOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    menuSlogan: "",
    price: "",
    sequence: "",
    file: "",
    priority: "",
    menuItemCategory: "",
    menuSubItemCategory: "",
    kitchenArea: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Dropdown state
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [kitchenAreas, setKitchenAreas] = useState([]);

  // Load dropdown data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) return;

      Promise.all([
        GetMenuCategoryByUserId(userData.id),
        GetAllSubCategory({ userId: userData.id }),
        GetAllKitchenAreaById(userData.id),
      ])
        .then(([catRes, subRes, kitchenRes]) => {
          setCategories(catRes?.data || []);
          setSubCategories(subRes?.data || []);
          setKitchenAreas(kitchenRes?.data || []);
        })
        .catch((err) => console.error("Error loading dropdown data:", err));
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedMenuItem) {
      setFormData({
        ...initialFormState,
        nameEnglish: selectedMenuItem.nameEnglish || "",
        nameGujarati: selectedMenuItem.nameGujarati || "",
        nameHindi: selectedMenuItem.nameHindi || "",
        menuSlogan: selectedMenuItem.menuSlogan || "",
        price: selectedMenuItem.price || "",
        priority: selectedMenuItem.priority || "",
        menuItemCategory: selectedMenuItem.menuItemCategory || "",
        menuSubItemCategory: selectedMenuItem.menuSubItemCategory || "",
        kitchenArea: selectedMenuItem.kitchenArea || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedMenuItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) {
      alert("User data not found");
      return;
    }

    const payload = { ...formData, userId: userData.id };

    if (selectedMenuItem) {
      console.log("Update menu item:", payload);
      // TODO: call update API
    } else {
      AddMenuItems(payload)
        .then(() => {
          refreshData();
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Error saving menu item:", err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedMenuItem ? "Edit Menu Item" : "New Menu Item"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputWithIcon
            label="Name (English)"
            name="nameEnglish"
            value={formData.nameEnglish}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            label="Name (ગુજરાતી)"
            name="nameGujarati"
            value={formData.nameGujarati}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            label="Name (हिंदी)"
            name="nameHindi"
            value={formData.nameHindi}
            onChange={handleChange}
            required
          />

          {/* Slogan */}
          <div className="relative col-span-2">
            <label className="block text-gray-600 mb-1">Slogan</label>
            <textarea
              name="menuSlogan"
              value={formData.menuSlogan}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="Menu Slogan"
            />
          </div>

          {/* Price */}
          <div className="relative">
            <label className="block text-gray-600 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="Price"
            />
          </div>

          {/* Priority */}
          <div className="relative">
            <label className="block text-gray-600 mb-1">Priority</label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="Priority"
            />
          </div>

          {/* Category */}
         <DropdownField
  label="Menu Item Category"
  name="menuItemCategory"
  value={formData.menuItemCategory}
  onChange={handleChange}
  options={categories}
  optionLabel="nameEnglish"   // ✅ matches API
/>
          {/* Sub Category */}
          <DropdownField
            label="Menu Item Sub Category"
            name="menuSubItemCategory"
            value={formData.menuSubItemCategory}
            onChange={handleChange}
            options={subCategories}
            optionLabel="subcategory"
          />

          {/* Kitchen Area */}
          <DropdownField
            label="Kitchen Area"
            name="kitchenArea"
            value={formData.kitchenArea}
            onChange={handleChange}
            options={kitchenAreas}
            optionLabel="kitchenArea"
          />

          {/* File upload */}
          <div className="relative col-span-2">
            <label className="block text-gray-600 mb-1">Document</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            onClick={handleSubmit}
          >
            {selectedMenuItem ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputWithIcon = ({ label, name, value, onChange, required }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
      required={required}
    />
  </div>
);

const DropdownField = ({ label, name, value, onChange, options, optionLabel }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">{label}</label>
    <select
      className="border border-gray-300 rounded-lg p-2 w-full"
      name={name}
      value={value}
      onChange={onChange}
      required
    >
      <option value="">Select {label}</option>
      {options.map((item) => (
        <option key={item.id} value={item.id}>
          {item[optionLabel]}
        </option>
      ))}
    </select>
  </div>
);

export default AddMenuItem;
