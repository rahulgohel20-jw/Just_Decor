import { useState, useEffect } from "react";
import { message } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import {
  AddMenuItems,
  GetMenuCategoryByUserIdmenuitem,
  GetAllSubCategorymenuitem,
  GetAllKitchenAreaById,
  UpdateMenuItem,
} from "@/services/apiServices";
import { uploadFile } from "../../../services/apiServices";

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
    sequence: 1,
    file: "",
    priority: "",
    menuItemCategory: "",
    menuSubItemCategory: "",
    kitchenArea: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [kitchenAreas, setKitchenAreas] = useState([]);
  const [activeTab, setActiveTab] = useState("tab_1"); // State for active tab

  // Load dropdown data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        console.error("User ID not found");
        return;
      }

      Promise.all([
        GetMenuCategoryByUserIdmenuitem(userData.id),
        GetAllSubCategorymenuitem(userData.id),
        GetAllKitchenAreaById(userData.id),
      ])
        .then(([catRes, subRes, kitchenRes]) => {
          const catData = catRes?.data?.data?.["Menu Category Details"] || [];
          const subData = subRes?.data?.data?.["Menu Sub Category Details"] || [];
          const kitchenData = kitchenRes?.data?.data?.["KitchenAreas Details"] || [];

          setCategories(catData);
          setSubCategories(subData);
          setKitchenAreas(kitchenData);
        })
        .catch((err) => console.error("Error loading dropdown data:", err));
    }
  }, [isModalOpen]);

  // Populate form data when editing
  useEffect(() => {
    if (selectedMenuItem) {
      const matchedCategory = categories.find(
        (cat) => cat.nameEnglish === selectedMenuItem.category
      );
      const matchedSubCategory = subCategories.find(
        (sub) => sub.nameEnglish === selectedMenuItem.subCategory
      );
      const matchedKitchenArea = kitchenAreas.find(
        (area) => area.nameEnglish === selectedMenuItem.kitchenArea
      );

      setFormData({
        ...initialFormState,
        nameEnglish: selectedMenuItem.name || "",
        nameGujarati: selectedMenuItem.nameGujarati || "",
        nameHindi: selectedMenuItem.nameHindi || "",
        menuSlogan: selectedMenuItem.slogan || "",
        price: selectedMenuItem.price || "",
        priority: selectedMenuItem.priority || "",
        menuItemCategory: matchedCategory?.id || "",
        menuSubItemCategory: matchedSubCategory?.id || "",
        kitchenArea: matchedKitchenArea?.id || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedMenuItem, categories, subCategories, kitchenAreas]);

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

    const safeNumber = (value) => {
      if (value === undefined || value === null || value === "" || value === "undefined") {
        return null;
      }
      const n = Number(value);
      return isNaN(n) ? null : n;
    };

    const payload = {
      nameEnglish: formData.nameEnglish,
      nameGujarati: formData.nameGujarati,
      nameHindi: formData.nameHindi,
      slogan: formData.menuSlogan,
      price: safeNumber(formData.price),
      priority: safeNumber(formData.priority),
      sequence: safeNumber(formData.sequence),
      userId: userData.id,
      menuCategoryId: safeNumber(formData.menuItemCategory),
      menuSubCategoryId: safeNumber(formData.menuSubItemCategory),
      kitchenAreaId: safeNumber(formData.kitchenArea),
    };

    if (selectedMenuItem) {
      UpdateMenuItem(selectedMenuItem.id, payload)
        .then((res) => {
          message.success("✅ Menu item updated successfully!");
          if (formData.file) {
            const uploadRequest = {
              ModuleId: selectedMenuItem.id,
              ModuleName: "MenuItem",
              FileType: "Image",
            };
            uploadImage(uploadRequest);
          } else {
            refreshData();
            setIsModalOpen(false);
          }
        })
        .catch((err) => {
          console.error("❌ Error updating menu item:", err);
        });
    } else {
      AddMenuItems(payload)
        .then((res) => {
          message.success("✅ Menu item added successfully!");
          const newMenuItemId = res?.data?.moduleId;
          if (formData.file && newMenuItemId) {
            const uploadRequest = {
              ModuleId: newMenuItemId,
              ModuleName: "MenuItem",
              FileType: "Image",
            };
            uploadImage(uploadRequest);
          } else {
            refreshData();
            setIsModalOpen(false);
          }
        })
        .catch((err) => {
          console.error("❌ Error saving menu item:", err);
        });
    }
  };

  const uploadImage = (uploadRequest) => {
    if (!formData.file) {
      console.warn("⚠️ No file found in formData.");
      refreshData();
      setIsModalOpen(false);
      return;
    }

    const request = new FormData();
    request.append("moduleId", uploadRequest.ModuleId);
    request.append("moduleName", uploadRequest.ModuleName);
    request.append("fileType", uploadRequest.FileType);
    request.append("file", formData.file);

    uploadFile(request)
      .then((res) => {
        message.success("Image uploaded successfully!");
        refreshData();
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("❌ Error uploading image:", error);
      });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div id="tab_1" className="tab-content active">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col">
              <label className="form-label">Name (English)</label>
              <input
                type="text"
                name="nameEnglish"
                value={formData.nameEnglish}
                onChange={handleChange}
                placeholder="Name (English)"
                className="input"
              />
            </div>
              <div className="flex flex-col">
              <label className="form-label">Name (Gujarati)</label>
              <input
                type="text"
                name="nameGujarati"
                value={formData.nameGujarati}
                onChange={handleChange}
                placeholder="Name (Gujarati)"
                className="input"
              />
            </div>
              <div className="flex flex-col">
              <label className="form-label">Name (Hindi)</label>
              <input
                type="text"
                name="nameHindi"
                value={formData.nameHindi}
                onChange={handleChange}
                placeholder="Name (Hindi)"
                className="input"
              />
            </div>
            
              {/* </div> */}
                <div className="flex flex-col">
              <label className="form-label">Slogan</label>
           <textarea
                type="text"
                name="menuSlogan"
                value={formData.menuSlogan}
                onChange={handleChange}
                placeholder="Menu Slogan "
                className="input"
                />
            </div>
                <div className="grid grid-cols-2 gap-x-4">
              
              <div className="flex flex-col">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input"
                  placeholder="Price"
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label">Priority</label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input"
                  placeholder="Priority"
                />
              </div>
              </div>
          <div className="grid grid-cols-3 gap-x-4">

            
              <DropdownField
                label="Menu Item Category"
                name="menuItemCategory"
                value={formData.menuItemCategory}
                onChange={handleChange}
                options={categories.filter((cat) => cat.isActive)}
                optionLabel="nameEnglish"
              />
              <DropdownField
                label="Menu Item Sub Category"
                className="form-label"
                name="menuSubItemCategory"
                value={formData.menuSubItemCategory}
                onChange={handleChange}
                options={subCategories.filter((sub) => sub.isActive)}
                optionLabel="nameEnglish"
              />
              <DropdownField
                label="Kitchen Area"
                name="kitchenArea"
                value={formData.kitchenArea}
                onChange={handleChange}
                options={kitchenAreas.filter((area) => area.isActive)}
                optionLabel="nameEnglish"
              />
              </div>
              <div className="relative col-span-2">
                <label className="block text-gray-600 mb-1">Image</label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prev) => ({
                      ...prev,
                      file: file,
                    }));
                  }}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="image"
                />
              </div>
            </div>
          </div>
        );
      case "tab_2":
        return (
          <div id="tab_2" className="tab-content">
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-1 gap-y-2">
                <div className="flex flex-col">
                  <label className="form-label">Godown</label>
                  <select
                    className="select pe-7.5"
                    data-control="select2"
                    data-placeholder="Select Godown"
                  >
                    <option value="godown1">GODOWN 1</option>
                    <option value="godown2">GODOWN 2</option>
                    <option value="godown3">GODOWN 3</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Outside Agency</label>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Chef Labour Agency</label>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          </div>
        );
      case "tab_3":
        return (
          <div id="tab_3" className="tab-content">
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">Text Field</label>
                  <div className="input">
                    <input
                      className="h-full"
                      type="text"
                      placeholder="Text Field"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Number</label>
                  <div className="input">
                    <input
                      className="h-full"
                      type="number"
                      placeholder="Number"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Drop Down</label>
                  <select
                    className="select pe-7.5"
                    data-control="select2"
                    data-placeholder="Drop Down"
                  >
                    <option value="">Drop Down</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <CustomModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={selectedMenuItem ? "Edit Menu Item" : "New Menu Item"}
      width={640}
      footer={[
        <div className="flex justify-between" key="footer-buttons">
          <button
            className="btn btn-light"
            onClick={() => setIsModalOpen(false)}
            title="Cancel"
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            title="Save"
            onClick={handleSubmit}
          >
            {selectedMenuItem ? "Update" : "Save"}
          </button>
        </div>,
      ]}
    >
      <div
        className="btn-tabs btn-tabs-lg flex justify-between mb-3 w-full"
        data-tabs="true"
      >
        <a
          className={`btn btn-clear w-full flex justify-center ${
            activeTab === "tab_1" ? "active" : ""
          }`}
          onClick={() => setActiveTab("tab_1")}
        >
          <i className="ki-filled ki-autobrightness"></i>
          Menu Item Details
        </a>
        <a
          className={`btn btn-clear w-full flex justify-center ${
            activeTab === "tab_2" ? "active" : ""
          }`}
          onClick={() => setActiveTab("tab_2")}
        >
          <i className="ki-filled ki-bookmark"></i>
          Allocation Configuration
        </a>
        <a
          className={`btn btn-clear w-full flex justify-center ${
            activeTab === "tab_3" ? "active" : ""
          }`}
          onClick={() => setActiveTab("tab_3")}
        >
          <i className="ki-filled ki-bookmark"></i>
          Custom Fields
        </a>
      </div>
      {renderTabContent()}
    </CustomModal>
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