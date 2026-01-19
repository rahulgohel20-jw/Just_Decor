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
      isSync
    );

    console.log("API Response:", response);

    const rawMaterialsArray = response?.data?.data?.menuItemRawMaterials || [];

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
      title="Item details"
      width={650}
      footer={[]}
    >
      <div className="flex flex-col items-center w-full p-4 ">
        <div className="relative w-full max-w-[520px] rounded-md overflow-hidden shadow-sm flex items-center justify-center">
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
            className="w-[300px] h-[200px] object-cover"
          />
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {item?.menuItemName}
        </h2>

        <p className="mt-1 text-gray-600 text-center text-sm sm:text-base">
          {item?.itemSlogan}
        </p>

        {rawMaterials.length > 0 && (
          <div className="mt-4 w-full max-w-[520px]">
            <h3 className="text-lg font-semibold mb-2">Raw Materials:</h3>
            <ul className="list-disc list-inside">
              {rawMaterials.map((rm) => (
                <li key={rm.id}>
                  {rm.rawMaterial?.nameEnglish} - {rm.weight}{" "}
                  {rm.unit?.symbolEnglish} - ₹{rm.rate}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default ShowMenuItems;
