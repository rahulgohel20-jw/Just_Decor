import { useEffect, useMemo, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
import { MenuReportData } from "@/services/apiServices";

const MenuReport = ({ isModalOpen, setIsModalOpen, eventId }) => {
  if (!isModalOpen) return null;

  const [options, setOptions] = useState({
    categorySlogan: false,
    categoryInstruction: false,
    categoryImage: false,
    itemSlogan: false,
  });
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const allChecked = useMemo(
    () =>
      options.categorySlogan &&
      options.categoryInstruction &&
      options.categoryImage &&
      options.itemSlogan,
    [options]
  );

  const toggleAll = (checked) => {
    setOptions({
      categorySlogan: checked,
      categoryInstruction: checked,
      categoryImage: checked,
      itemSlogan: checked,
    });
  };
  const toggleOne = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClose = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

  const handleReport = async () => {
    if (!eventId) {
      errorMsgPopup("Event ID missing");
      return;
    }

    const b = (v) => (v ? 1 : 0);
    const catImg = b(options.categoryImage);
    const catIns = b(options.categoryInstruction);
    const catSlogan = b(options.categorySlogan);
    const itemSlogan = b(options.itemSlogan);

    setLoading(true);
    try {
      const { data } = await MenuReportData(
        eventId,
        catImg,
        catIns,
        catSlogan,
        itemSlogan
      );

      if (data?.success && data?.filePath) {
        successMsgPopup(data?.msg || "Report generated");
        setPdfUrl(data.filePath);
      } else {
        // 👇 override error message if it matches
        if (data?.msg === "Failed to get Event Menu Report") {
          errorMsgPopup("Menu preparation is not done");
        } else {
          errorMsgPopup(data?.msg || "Failed to generate report");
        }
      }
    } catch (err) {
      console.error("MenuReport error:", err);

      const apiMsg = err?.response?.data?.msg;
      if (apiMsg === "Failed to get Event Menu Report") {
        errorMsgPopup("Menu preparation is not done");
      } else {
        errorMsgPopup(apiMsg || err?.message || "Failed to generate report");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setOptions({
        categorySlogan: false,
        categoryInstruction: false,
        categoryImage: false,
        itemSlogan: false,
      });
      setPdfUrl(null);
    }
  }, [isModalOpen]);

  return (
    <CustomModal
      open={isModalOpen}
      title="Menu Report"
      onClose={handleClose}
      width={pdfUrl ? "80%" : "40%"} // wider modal when showing PDF
      footer={
        pdfUrl
          ? [
              <button
                key="close"
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
              >
                Close
              </button>,
            ]
          : [
              <div key="footer" className="flex flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  className="px-6 py-2 rounded-md bg-red-600 text-white disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Reporting..." : "Report"}
                </button>
              </div>,
            ]
      }
    >
      {!pdfUrl ? (
        <div className="flex flex-col gap-3">
          {/* Check All */}
          <label className="flex items-center gap-3 p-3 border rounded-lg">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={(e) => toggleAll(e.target.checked)}
            />
            <span className="font-medium">Check All</span>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg">
            <input
              type="checkbox"
              checked={options.categorySlogan}
              onChange={() => toggleOne("categorySlogan")}
            />
            <span>Add Category Slogan</span>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg">
            <input
              type="checkbox"
              checked={options.categoryInstruction}
              onChange={() => toggleOne("categoryInstruction")}
            />
            <span>Add Category Instruction</span>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg">
            <input
              type="checkbox"
              checked={options.categoryImage}
              onChange={() => toggleOne("categoryImage")}
            />
            <span>Add Category Image</span>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg">
            <input
              type="checkbox"
              checked={options.itemSlogan}
              onChange={() => toggleOne("itemSlogan")}
            />
            <span>Add Item Slogan</span>
          </label>
        </div>
      ) : (
        <div className="w-full h-[80vh]">
          <iframe
            src={pdfUrl}
            title="Menu Report PDF"
            className="w-full h-[1200px] border-0 rounded-md"
          />
        </div>
      )}
    </CustomModal>
  );
};

export default MenuReport;
