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

const AssignTheme = ({ isModalOpen, setIsModalOpen, userId }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleSave = () => {
    if (!selectedTheme) return;
    console.log("Assign Theme:", selectedTheme, "to user:", userId);
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Exculusive Theme"
        width={900}
        footer={null}
      >
        {/* Theme Grid */}
        <div className="max-h-[65vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative cursor-pointer rounded-lg border overflow-hidden group
                  ${
                    selectedTheme === theme.id
                      ? "border-blue-600 ring-2 ring-blue-500"
                      : "border-gray-200"
                  }
                `}
              >
                {/* Image */}
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Choose Template
                  </span>
                </div>

                {/* Title */}
                <div className="p-2 text-center text-sm font-medium bg-white">
                  {theme.title}
                </div>

                {/* Selected Badge */}
                {selectedTheme === theme.id && (
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
            disabled={!selectedTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Assign Theme
          </button>
        </div>
      </CustomModal>
    )
  );
};

export default AssignTheme;
