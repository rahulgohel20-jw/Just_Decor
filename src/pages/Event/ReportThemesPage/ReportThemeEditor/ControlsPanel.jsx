import { useState } from "react";

export default function ControlPanel({ design, setDesign }) {
  const [activeTab, setActiveTab] = useState("heading");

  const updateTypography = (section, key, value) => {
    setDesign((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [`${section}${key}`]: value, // e.g., headingSize, bodyWeight
      },
    }));
  };

  const updateColor = (key, value) => {
    setDesign((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const updateImageSetting = (key, value) => {
    setDesign((prev) => ({
      ...prev,
      imageSettings: { ...prev.imageSettings, [key]: value },
    }));
  };

  const typographyTabs = ["heading", "subHeading", "body"];

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* TYPOGRAPHY BOX */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-[#E6EFFF] px-4 py-2 border-b flex items-center gap-2">
       <span className="text-blue-600">
  <img src={`${import.meta.env.BASE_URL}images/typoicon.png`} alt="icon" className="inline-block w-5 h-5" />
</span>

          <h3 className="font-semibold text-gray-800 text-sm">Typography</h3>
        </div>

        <div className="p-2 bg-[#FAFDFF]">
          {/* Tabs */}
      <div className="flex justify-center border-b mb-4 bg-[#FAFDFF]">
  {typographyTabs.map((tab) => (
    <button
      key={tab}
      className={`px-4 py-2 text-sm font-semibold capitalize transition-all ${
        activeTab === tab
          ? "border-b-2 border-blue-500 text-blue-800"
          : "text-gray-500 hover:text-blue-500"
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {tab === "subHeading" ? "Sub-Heading" : tab}
    </button>
  ))}
</div>


          {/* Inner Gray Box */}
          <div className=" rounded-md p-3 space-y-4">
            {/* Font Family + Font Weight */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Font Family</label>
                 <select
                  value={design.typography[`${activeTab}Weight`] || "normal"}
                  onChange={(e) =>
                    updateTypography(activeTab, "Weight", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-1 text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="Popping">Popping</option>
                  <option value="600">Semi-Bold</option>
                  <option value="300">Light</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
                <select
                  value={design.typography[`${activeTab}Weight`] || "normal"}
                  onChange={(e) =>
                    updateTypography(activeTab, "Weight", e.target.value)
                  }
                  className="w-full border rounded-lg px-2 py-1 text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="600">Semi-Bold</option>
                  <option value="300">Light</option>
                </select>
              </div>
            </div>

            {/* Font Size + Line Height */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Font Size</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={design.typography[`${activeTab}Size`] || ""}
                    onChange={(e) =>
                      updateTypography(activeTab, "Size", +e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                  <span className="ml-1 text-xs text-gray-500">px</span>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Line Height</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={design.typography[`${activeTab}LineHeight`] || ""}
                    onChange={(e) =>
                      updateTypography(activeTab, "LineHeight", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                  <span className="ml-1 text-xs text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Text Alignment</label>
              <div className="flex gap-2">
                {["left", "center", "right"].map((align) => (
                  <button
                    key={align}
                    className={`flex-1 border rounded py-1 text-sm ${
                      design.typography.textAlign === align
                        ? "bg-blue-100 border-blue-500 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={() =>
                      setDesign((prev) => ({
                        ...prev,
                        typography: { ...prev.typography, textAlign: align },
                      }))
                    }
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COLORS BOX */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-4 py-2 border-b flex items-center gap-2">
          <span className="text-blue-600">🎨</span>
          <h3 className="font-semibold text-gray-800 text-sm">Colors</h3>
        </div>

        <div className="p-4 space-y-3">
          {Object.entries(design.colors).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm capitalize text-gray-700">
                {key === "background" ? "Background Color" : `${key} Text Color`}
              </span>
              <input
                type="color"
                value={value}
                onChange={(e) => updateColor(key, e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* IMAGES BOX */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-blue-50 px-4 py-2 border-b flex items-center gap-2">
          <span className="text-blue-600">🖼️</span>
          <h3 className="font-semibold text-gray-800 text-sm">Images Setting</h3>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Image Radius ({design.imageSettings.radius}px)
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={design.imageSettings.radius}
              onChange={(e) =>
                updateImageSetting("radius", +e.target.value)
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Image Size ({design.imageSettings.size}%)
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={design.imageSettings.size}
              onChange={(e) =>
                updateImageSetting("size", +e.target.value)
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
