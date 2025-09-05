import { useState, useEffect } from "react";
import { message } from "antd";
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

  // Dropdown state
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [kitchenAreas, setKitchenAreas] = useState([]);


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
          console.log("Category Response:", catRes);
          console.log("SubCategory Response:", subRes);
          console.log("Kitchen Area Response:", kitchenRes);

          const catData = catRes?.data?.data?.["Menu Category Details"] || [];
          const subData = subRes?.data?.data?.["Menu Sub Category Details"] || [];
          const kitchenData = kitchenRes?.data?.data?.["KitchenAreas Details"] || [];

          setCategories(catData);
          setSubCategories(subData);
          console.log("Sub Category:", subData);
          setKitchenAreas(kitchenData);
        })
        .catch((err) => console.error("Error loading dropdown data:", err));
    }
  }, [isModalOpen]);


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
console.log(" slogan" , selectedMenuItem.slogan);
    console.log("📝 Selected Menu Item:", selectedMenuItem);
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
console.log("🚨 SUBMITTING PAYLOAD:");
Object.entries(payload).forEach(([key, val]) =>
  console.log(`${key}:`, val, `(${typeof val})`)
);

  // ✅ EDIT MODE
  if (selectedMenuItem) {
  //    console.log("🧠 selectedMenuItem.id =", selectedMenuItem?.id, `(${typeof selectedMenuItem?.id})`);
  // console.log("📦 Final Payload:", payload);

    UpdateMenuItem(selectedMenuItem.id, payload)
      .then((res) => {
        // console.log("✅ Menu item updated:", res);
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
    // ✅ ADD MODE
    AddMenuItems(payload)
      .then((res) => {
       console.log("🧾 Full AddMenuItems Response:", res);
  message.success("✅ Menu item added successfully!");
        const newMenuItemId = res?.data?.moduleId;
        console.log("🆔 New Menu Item ID:", newMenuItemId);

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

  console.log("📦 Uploading file with FormData:", {
    moduleId: uploadRequest.ModuleId,
    moduleName: uploadRequest.ModuleName,
    fileType: uploadRequest.FileType,
    fileName: formData.file.name,
  });

uploadFile(request)
  .then((res) => {
    message.success("Image uploaded successfully!");
    refreshData();
    setIsModalOpen(false);
  })

    .catch((error) => {
      console.error("❌ Error uploading image:", error);
      error?.response?.data?.msg && errorMsgPopup(error.response.data.msg);
    });
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
            options={categories.filter(cat => cat.isActive)} // ✅ only active
            optionLabel="nameEnglish"   // ✅ matches API
          />
          {/* Sub Category */}
          <DropdownField
            label="Menu Item Sub Category"
            name="menuSubItemCategory"
            value={formData.menuSubItemCategory}
            onChange={handleChange}
            options={subCategories.filter(sub => sub.isActive)} // ✅ only active
            optionLabel="nameEnglish"
          />

          {/* Kitchen Area */}
         <DropdownField
  label="Kitchen Area"
  name="kitchenArea"
  value={formData.kitchenArea}
  onChange={handleChange}
  options={kitchenAreas.filter(area => area.isActive)}
  optionLabel="nameEnglish"
/>


          {/* File upload */}
          <div className="relative col-span-2">
            <label className="block text-gray-600 mb-1">{"Image"}</label>
            <input
              type="file"
              name={"file"}
              accept="image/*"
             onChange={(e) => {
              const file = e.target.files[0];
              setFormData((prev) => ({
                ...prev,
                file: file,
              }));
            }}
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder={"image"}
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


