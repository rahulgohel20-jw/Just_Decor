import { useEffect, useMemo, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
import { MenuReportData } from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";

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

  const intl = useIntl();


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

  const handleClose = () => setIsModalOpen(false);

  // open a URL in new tab (more reliable than window.open in async handlers)
  const openInNewTab = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // fallback: fetch as blob and open
  const openAsBlob = async (url) => {
    const res = await fetch(url, { credentials: "include" }); // adjust if auth not needed
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    openInNewTab(blobUrl);
    // optionally revoke after a delay
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
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

  // open in new tab immediately
  openInNewTab(data.filePath);
}
else {
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
    }
  }, [isModalOpen]);

  return (
    <CustomModal
      open={isModalOpen}
      title={intl.formatMessage({
  id: "COMMON.MENU_REPORT",
  defaultMessage: "Menu Report",
})}

      onClose={handleClose}
      footer={[
        <div key="footer" className="flex flex-row justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
            disabled={loading}
          >
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>
          <button
            type="button"
            onClick={handleReport}
            className="px-6 py-2 rounded-md bg-red-600 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading
  ? intl.formatMessage({ id: "COMMON.REPORTING", defaultMessage: "Reporting..." })
  : intl.formatMessage({ id: "COMMON.REPORT", defaultMessage: "Report" })}

          </button>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 p-3 border rounded-lg">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          <span className="font-medium"><FormattedMessage id="COMMON.CHECK_ALL" defaultMessage="Check All" />
</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg">
          <input
            type="checkbox"
            checked={options.categorySlogan}
            onChange={() => toggleOne("categorySlogan")}
          />
          <span><FormattedMessage id="COMMON.ADD_CATEGORY_SLOGAN" defaultMessage="Add Category Slogan" />
</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg">
          <input
            type="checkbox"
            checked={options.categoryInstruction}
            onChange={() => toggleOne("categoryInstruction")}
          />
          <span><FormattedMessage id="COMMON.ADD_CATEGORY_INSTRUCTION" defaultMessage="Add Category Instruction" />
</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg">
          <input
            type="checkbox"
            checked={options.categoryImage}
            onChange={() => toggleOne("categoryImage")}
          />
          <span><FormattedMessage id="COMMON.ADD_CATEGORY_IMAGE" defaultMessage="Add Category Image" />
</span>
        </label>

        <label className="flex items-center gap-3 p-3 border rounded-lg">
          <input
            type="checkbox"
            checked={options.itemSlogan}
            onChange={() => toggleOne("itemSlogan")}
          />
          <span><FormattedMessage id="COMMON.ADD_ITEM_SLOGAN" defaultMessage="Add Item Slogan" />
</span>
        </label>
      </div>
    </CustomModal>
  );
};

export default MenuReport;
