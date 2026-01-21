import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";
import { GetRawmaterialItemByRecipe } from "@/services/apiServices";

const ShowMenuItems = ({ isOpen, onClose, item }) => {
  const [rawMaterials, setRawMaterials] = useState([]);

  console.log("ShowMenuItems rendered for item:", item);

  useEffect(() => {
    const menuItemId = item?.menuItemId; // this is correct
    if (menuItemId) {
      fetchRawMaterials(menuItemId);
    } else {
      setRawMaterials([]);
    }
  }, [item]);

  const fetchRawMaterials = async (menuItemId) => {
    try {
      const userId = localStorage.getItem("userId") || 1;
      const isSync = false;

      const response = await GetRawmaterialItemByRecipe(
        menuItemId,
        userId,
        isSync,
      );

      console.log("API Response:", response);

      const rawMaterialsArray =
        response?.data?.data?.menuItemRawMaterials || [];

      if (rawMaterialsArray.length > 0) {
        setRawMaterials(rawMaterialsArray);
        console.log("Raw materials set:", rawMaterialsArray);
      } else {
        setRawMaterials([]);
        console.warn("No raw materials found in response");
      }
    } catch (error) {
      console.error("Error fetching raw materials:", error);
      setRawMaterials([]);
    }
  };

  const handleModalClose = () => {
    console.log("Closing modal for item:", item?.menuItemName);
    onClose();
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={handleModalClose}
      title="Item Details"
      width={700}
      footer={[]}
    >
      <div className="w-full px-4 py-5">
        {/* Image Section */}
        <div className="relative mx-auto w-full max-w-[560px] rounded-xl overflow-hidden shadow-md bg-gray-100">
          <img
            src={
              item?.imagePath &&
              typeof item.imagePath === "string" &&
              item.imagePath.trim() !== "" &&
              item.imagePath !== "null" &&
              item.imagePath !== "undefined" &&
              !item.imagePath.toLowerCase().includes("/null") &&
              /\.(jpg|jpeg|png|webp|gif)$/i.test(item.imagePath)
                ? item.imagePath
                : toAbsoluteUrl("/media/menu/noImage.jpg")
            }
            alt={item?.menuItemName}
            className="w-full h-[260px] object-cover"
          />

          {/* Overlay label */}
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            Menu Item
          </span>
        </div>

        {/* Content Section */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {item?.menuItemName}
          </h2>

          {item?.itemSlogan && (
            <p className="mt-2 text-gray-600 text-sm sm:text-base italic">
              “{item.itemSlogan}”
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Raw Materials */}
        {rawMaterials.length > 0 && (
          <div className="max-w-[560px] mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Raw Materials Used
            </h3>

            <div className="flex flex-wrap gap-2">
              {rawMaterials.map((rm) => (
                <span
                  key={rm.id}
                  className="px-3 py-1 rounded-full text-sm bg-blue-50 text-[#005BA8] border border-[#005BA8]"
                >
                  {rm.rawMaterial?.nameEnglish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {rawMaterials.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-6">
            No raw materials available for this item.
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default ShowMenuItems;
