import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
import { MenuReportData } from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";

// PDF Viewer
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const MenuReport = ({
  isModalOpen,
  setIsModalOpen,
  eventId,
  eventFunctionId,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [options, setOptions] = useState({
    categorySlogan: false,
    categoryInstruction: false,
    categoryImage: false,
    itemSlogan: false,
    itemInstruction: false,
  });

  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const intl = useIntl();
  const pdfPlugin = defaultLayoutPlugin();

  const toggleAll = (checked) => {
    setOptions({
      categorySlogan: checked,
      categoryInstruction: checked,
      categoryImage: checked,
      itemSlogan: checked,
      itemInstruction: checked,
    });
  };

  const toggleOne = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClose = () => {
    setPdfUrl(null);
    setIsModalOpen(false);
  };

  const handleWhatsAppShare = () => {
    if (!pdfUrl) return;
    const url = encodeURIComponent(pdfUrl);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  };

  const handleReport = async () => {
    if (!eventId) {
      errorMsgPopup("Event ID missing");
      return;
    }

    const b = (v) => (v ? 1 : 0);

    const lang =
      selectedLanguage === "english" ? 0 : selectedLanguage === "hindi" ? 1 : 2;

    setLoading(true);
    try {
      const { data } = await MenuReportData(
        eventFunctionId,
        eventId,
        b(options.categoryImage),
        b(options.categoryInstruction),
        b(options.categorySlogan),
        b(options.itemInstruction),
        b(options.itemSlogan),
        lang
      );

      if (data?.success && data?.filePath) {
        successMsgPopup(data?.msg || "Report generated");
        setPdfUrl(data.filePath);
      } else {
        errorMsgPopup(data?.msg || "Failed to generate report");
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.msg;
      errorMsgPopup(apiMsg || err?.message || "Failed to generate report");
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
        itemInstruction: false,
      });
      setPdfUrl(null);
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
      width="90vw"
      footer={
        pdfUrl
          ? [
              <div key="pdf-footer" className="flex justify-between w-full">
                <button
                  onClick={handleWhatsAppShare}
                  className="px-4 py-2 rounded bg-green-600 text-white"
                >
                  WhatsApp Share
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded bg-gray-500 text-white"
                >
                  Close
                </button>
              </div>,
            ]
          : [
              <div key="footer" className="flex justify-end gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
                  disabled={loading}
                >
                  <FormattedMessage
                    id="COMMON.CANCEL"
                    defaultMessage="Cancel"
                  />
                </button>
                <button
                  onClick={handleReport}
                  className="px-6 py-2 rounded-md bg-red-600 text-white disabled:opacity-60"
                  disabled={loading}
                >
                  {loading
                    ? intl.formatMessage({
                        id: "COMMON.REPORTING",
                        defaultMessage: "Reporting...",
                      })
                    : intl.formatMessage({
                        id: "COMMON.REPORT",
                        defaultMessage: "Report",
                      })}
                </button>
              </div>,
            ]
      }
    >
      {!pdfUrl && (
        <>
          {/* Language select */}
          <div className="flex justify-center items-center gap-6 mb-4">
            {["english", "gujarati", "hindi"].map((lang) => (
              <label
                key={lang}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <input
                  type="radio"
                  name="language"
                  checked={selectedLanguage === lang}
                  onChange={() => setSelectedLanguage(lang)}
                />
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={
                  options.categorySlogan &&
                  options.categoryInstruction &&
                  options.categoryImage &&
                  options.itemSlogan &&
                  options.itemInstruction
                }
                onChange={(e) => toggleAll(e.target.checked)}
              />
              <span>Check All</span>
            </label>

            {Object.keys(options).map((key) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => toggleOne(key)}
                />
                <span>{key}</span>
              </label>
            ))}
          </div>
        </>
      )}

      {pdfUrl && (
        <div style={{ height: "80vh" }} className="mt-2 border rounded shadow">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[pdfPlugin]} />
          </Worker>
        </div>
      )}
    </CustomModal>
  );
};

export default MenuReport;
