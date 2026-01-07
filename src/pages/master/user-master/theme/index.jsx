import { useState, useEffect } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import {
  GettemplatebyuserId,
  GetAllThemeByModuleId,
  AssignThemeAdmin,
} from "@/services/apiServices";
import { EyeIcon } from "lucide-react";
import Swal from "sweetalert2";

const AssignTheme = ({ isModalOpen, setIsModalOpen, userId }) => {
  const [activeTab, setActiveTab] = useState("theme");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedNameplate, setSelectedNameplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [nameplates, setNameplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  // Preview states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [previewPage, setPreviewPage] = useState("frontPage");

  useEffect(() => {
    if (isModalOpen && userId) {
      fetchCategories();
    }
  }, [isModalOpen, userId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchThemesByCategory();
    }
  }, [selectedCategory, activeTab]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await GettemplatebyuserId(userId);

      if (response?.data?.data) {
        const fetchedCategories = response.data.data.map((item) => ({
          id: item.id || item._id,
          label: item.nameEnglish || item.title || item.category,
        }));

        setCategories(fetchedCategories);

        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  let isNameplate = activeTab === "nameplate";

  const fetchThemesByCategory = async () => {
    try {
      setLoadingItems(true);

      const response = await GetAllThemeByModuleId(
        isNameplate,
        selectedCategory
      );

      if (response?.data) {
        const items = response.data.data || response.data;

        const mappedItems = items.map((item) => ({
          id: item.id || item._id, // templateMasterId
          title: item.name || item.nameEnglish,
          frontPage: item.frontPage || "",
          secondFrontPage: item.secondFrontPage || "",
          watermark: item.watermark || "",
          lastMainPage: item.lastMainPage || "",
          templateMappingId: item?.templateMappingResponseDto?.id || 0,
          templateModuleMasterId: item?.templateModuleMaster?.id || 0,
        }));

        isNameplate ? setNameplates(mappedItems) : setThemes(mappedItems);
      }
    } catch (error) {
      console.error("Error fetching themes:", error);
      isNameplate ? setNameplates([]) : setThemes([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTheme(null);
    setSelectedNameplate(null);
  };

  const currentItems = activeTab === "theme" ? themes : nameplates;
  const selectedItem =
    activeTab === "theme" ? selectedTheme : selectedNameplate;
  const setSelectedItem =
    activeTab === "theme" ? setSelectedTheme : setSelectedNameplate;

  const handleSave = async () => {
    if (!selectedItem) return;

    const selectedData = currentItems.find((item) => item.id === selectedItem);

    if (!selectedData) return;

    const payload = {
      templateMasterId: selectedData.id || 0,
      templateModuleMasterId: selectedData.templateModuleMasterId || 0,
      userId: userId,
    };

    try {
      setAssignLoading(true);

      const res = await AssignThemeAdmin(payload);

      if (res.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Assigned Successfully",
          text: `${
            activeTab === "theme" ? "Theme" : "Nameplate"
          } assigned to user successfully.`,
          confirmButtonColor: "#3085d6",
        });

        setIsModalOpen(false);
        setSelectedTheme(null);
        setSelectedNameplate(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Assignment Failed",
          text: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("AssignThemeAdmin failed:", error);

      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <CustomModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Select Exclusive Design"
          width={900}
          footer={null}
        >
          {/* Tabs */}
          <div className="flex border-b mb-4">
            {["theme", "nameplate"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === tab ? "bg-primary text-white" : "text-gray-600"
                }`}
              >
                {tab === "theme" ? "Themes" : "Nameplates"}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {activeTab === "theme" && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mb-4 w-64 px-3 py-2 border rounded"
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          )}

          {/* Grid */}
          <div className="max-h-[55vh] overflow-y-auto">
            {loadingItems ? (
              <div className="h-60 flex items-center justify-center">
                Loading...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setSelectedItem(selectedItem === item.id ? null : item.id)
                    }
                    className={`relative border rounded-lg overflow-hidden cursor-pointer transition
                      ${
                        selectedItem === item.id
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-200"
                      }
                    `}
                  >
                    {/* Eye */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                        setPreviewPage("frontPage");
                        setPreviewOpen(true);
                      }}
                      className="absolute top-2 left-2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                    >
                      <EyeIcon className="text-primary w-4 h-4" />
                    </button>

                    {/* Selected ✔ */}
                    {selectedItem === item.id && (
                      <div className="absolute top-2 right-2 z-10 bg-success text-white rounded-full w-7 h-7 flex items-center justify-center shadow">
                        ✔
                      </div>
                    )}

                    <img
                      src={item.frontPage}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />

                    <div className="p-2 text-center text-sm font-medium bg-white">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!selectedItem || assignLoading}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-60"
            >
              {assignLoading
                ? "Assigning..."
                : `Assign ${activeTab === "theme" ? "Theme" : "Nameplate"}`}
            </button>
          </div>
        </CustomModal>
      )}

      {/* PREVIEW MODAL */}
      {previewOpen && previewItem && (
        <CustomModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={`${previewItem.title} Preview`}
          width={900}
          footer={null}
        >
          <div className="flex gap-2 mb-4 flex-wrap">
            {["frontPage", "secondFrontPage", "watermark", "lastMainPage"].map(
              (page) =>
                previewItem[page] && (
                  <button
                    key={page}
                    onClick={() => setPreviewPage(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      previewPage === page ? "bg-primary text-white" : "border"
                    }`}
                  >
                    {page.replace(/([A-Z])/g, " $1")}
                  </button>
                )
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded flex justify-center">
            <img
              src={previewItem[previewPage]}
              alt="Preview"
              className="max-h-[70vh] bg-white shadow object-contain"
            />
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default AssignTheme;
