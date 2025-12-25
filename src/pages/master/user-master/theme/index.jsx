import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { GetAllExeculisveTheme } from "@/services/apiServices";

const themes = [
  { id: 1, title: "Wedding Invitation", image: "/themes/theme1.jpg" },
  { id: 2, title: "Groom & Bride", image: "/themes/theme2.jpg" },
  { id: 3, title: "Classic Wedding", image: "/themes/theme3.jpg" },
  { id: 4, title: "Traditional Invite", image: "/themes/theme4.jpg" },
  { id: 5, title: "Royal Wedding", image: "/themes/theme5.jpg" },
  { id: 6, title: "Modern Invite", image: "/themes/theme6.jpg" },
];

const nameplates = [
  { id: 1, title: "Gold Nameplate", image: "/nameplates/nameplate1.jpg" },
  { id: 2, title: "Silver Nameplate", image: "/nameplates/nameplate2.jpg" },
  { id: 3, title: "Wooden Nameplate", image: "/nameplates/nameplate3.jpg" },
  { id: 4, title: "Modern Nameplate", image: "/nameplates/nameplate4.jpg" },
];

const categories = [
  { id: "all", label: "All Categories" },
  { id: "traditional", label: "Traditional" },
  { id: "modern", label: "Modern" },
  { id: "classic", label: "Classic" },
  { id: "royal", label: "Royal" },
];

const AssignTheme = ({ isModalOpen, setIsModalOpen, userId }) => {
  const [activeTab, setActiveTab] = useState("theme"); // 'theme' or 'nameplate'
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedNameplate, setSelectedNameplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSave = () => {
    if (activeTab === "theme" && !selectedTheme) return;
    if (activeTab === "nameplate" && !selectedNameplate) return;

    console.log(
      activeTab === "theme"
        ? `Assign Theme: ${selectedTheme} to user: ${userId}`
        : `Assign Nameplate: ${selectedNameplate} to user: ${userId}`
    );
    setIsModalOpen(false);
  };

  const currentItems = activeTab === "theme" ? themes : nameplates;
  const selectedItem =
    activeTab === "theme" ? selectedTheme : selectedNameplate;
  const setSelectedItem =
    activeTab === "theme" ? setSelectedTheme : setSelectedNameplate;

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Exclusive Design"
        width={900}
        footer={null}
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("theme")}
            className={`px-6 py-3 font-medium text-sm transition-colors relative
              ${
                activeTab === "theme"
                  ? "text-white bg-primary border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            Themes
          </button>
          <button
            onClick={() => setActiveTab("nameplate")}
            className={`px-6 py-3 font-medium text-sm transition-colors relative
              ${
                activeTab === "nameplate"
                  ? "text-white bg-primary border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            Nameplates
          </button>
        </div>

        {/* Dropdown Filter */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter by Theme
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content Grid */}
        <div className="max-h-[55vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`relative cursor-pointer rounded-lg border overflow-hidden group
                  ${
                    selectedItem === item.id
                      ? "border-blue-600 ring-2 ring-blue-500"
                      : "border-gray-200"
                  }
                `}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Choose {activeTab === "theme" ? "Template" : "Nameplate"}
                  </span>
                </div>

                {/* Title */}
                <div className="p-2 text-center text-sm font-medium bg-white">
                  {item.title}
                </div>

                {/* Selected Badge */}
                {selectedItem === item.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!selectedItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Assign {activeTab === "theme" ? "Theme" : "Nameplate"}
          </button>
        </div>
      </CustomModal>
    )
  );
};

export default AssignTheme;
