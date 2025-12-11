import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";

const ShowMenuItems = ({ isOpen, onClose, item }) => {
  console.log(item);

  const handleModalClose = () => onClose();

  return (
    <CustomModal
      open={isOpen}
      onClose={handleModalClose}
      title="Items details"
      width={650}
      footer={[]}
    >
      <div className="flex flex-col items-center w-full p-4 ">
        <div className="relative w-full max-w-[520px] rounded-md overflow-hidden shadow-sm flex items-center justify-center">
          <img
            src={
              item?.imagePath &&
              typeof item?.imagePath === "string" &&
              item?.imagePath !== "null" &&
              item?.imagePath !== "undefined" &&
              item?.imagePath.trim() !== "" &&
              !item?.imagePath.endsWith("null") &&
              /\.(jpg|jpeg|png|webp|gif)$/i.test(item?.imagePath)
                ? item?.imagePath
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
      </div>
    </CustomModal>
  );
};

export default ShowMenuItems;
