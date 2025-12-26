import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
import {
  AddExclusiveReport,
  GetReportConfiguration,
} from "@/services/apiServices";
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
  moduleId,
  mappingId,
}) => {
  const intl = useIntl();
  const pdfPlugin = defaultLayoutPlugin();

  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [options, setOptions] = useState({
    categorySlogan: false,
    categoryInstruction: false,
    categoryImage: false,
    itemSlogan: false,
    itemInstruction: false,
    itemImage: false,
  });

  // Track which fields are available from backend
  const [availableFields, setAvailableFields] = useState({
    categorySlogan: false,
    categoryInstruction: false,
    categoryImage: false,
    itemSlogan: false,
    itemInstruction: false,
    itemImage: false,
  });

  console.log("MenuReport Props:", {
    eventId,
    moduleId,
    mappingId,
    eventFunctionId,
  });

  const availableFieldKeys = Object.keys(availableFields).filter(
    (key) => availableFields[key]
  );
  const isCheckAll =
    availableFieldKeys.length > 0 &&
    availableFieldKeys.every((key) => options[key]);

  const userId = 2;

  useEffect(() => {
    if (!mappingId) return;

    const fetchConfig = async () => {
      try {
        const res = await GetReportConfiguration(mappingId);
        const config = res?.data?.data?.[0];
        if (!config) return;

        const isEnabled = (v) => Number(v) === 1;

        const available = {
          categorySlogan: isEnabled(config.isCategorySlogan),
          categoryInstruction: isEnabled(config.isCategoryInstruction),
          categoryImage: isEnabled(config.isCategoryImage),
          itemSlogan: isEnabled(config.isItemSlogan),
          itemInstruction: isEnabled(config.isItemInstruction),
          itemImage: isEnabled(config.isItemImage),
        };

        console.log("availability", available);

        setAvailableFields(available);
      } catch (err) {
        console.error("Configuration fetch error", err);
      }
    };

    fetchConfig();
  }, [mappingId]);

  const toggleAll = (checked) => {
    const newOptions = { ...options };
    availableFieldKeys.forEach((key) => {
      newOptions[key] = checked;
    });
    setOptions(newOptions);
  };

  const Toggle = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={!disabled ? onChange : undefined}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${checked ? "bg-blue-600" : "bg-gray-300"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );

  const toggleOne = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClose = () => {
    setPdfUrl(null);
    setIsModalOpen(false);
  };

  const handleReport = async () => {
    if (!eventId || !moduleId) {
      errorMsgPopup("Missing required data");
      return;
    }

    const b = (v) => (v ? 1 : 0);

    const lang =
      selectedLanguage === "english" ? 0 : selectedLanguage === "hindi" ? 1 : 2;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("adminTemplateModuleId", moduleId);
      formData.append("eventFunctionId", eventFunctionId || 0);
      formData.append("eventId", eventId);
      formData.append("lang", lang);
      formData.append("userId", userId);

      // Optional boolean fields (converted to 0 or 1)
      formData.append("isCategoryImage", b(options.categoryImage));
      formData.append("isCategoryInstruction", b(options.categoryInstruction));
      formData.append("isCategorySlogan", b(options.categorySlogan));
      formData.append("isItemImage", b(options.itemImage)); // Now uses itemImage
      formData.append("isItemInstruction", b(options.itemInstruction));
      formData.append("isItemSlogan", b(options.itemSlogan));

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Call the new API
      const { data } = await AddExclusiveReport(formData);

      if (data?.success === true && data?.report_path) {
        successMsgPopup(data?.msg || "Report generated successfully");
        setPdfUrl(data.report_path);
      } else {
        errorMsgPopup(data?.msg || "Failed to generate report");
      }
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err?.response);
      console.error("Error message:", err?.message);
      const apiMsg = err?.response?.data?.msg;
      errorMsgPopup(apiMsg || err?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <CustomModal
      open={isModalOpen}
      title="Menu Report"
      onClose={handleClose}
      footer={
        pdfUrl ? (
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Close
          </button>
        ) : (
          <button
            onClick={handleReport}
            disabled={loading}
            className="px-6 py-2 bg-[#005BA8] text-white rounded disabled:opacity-60"
          >
            {loading ? "Reporting..." : "Report"}
          </button>
        )
      }
    >
      {!pdfUrl && (
        <>
          {/* LANGUAGE */}
          <div className="mb-4">
            <div className="flex border rounded-lg">
              {["english", "hindi", "gujarati"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex-1 py-2 transition-all ${
                    selectedLanguage === lang
                      ? "bg-[#005BA8] text-white"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {availableFieldKeys.length > 0 && (
            <div className="flex justify-between items-center p-3 mb-3">
              <span className="font-semibold">Check All</span>
              <Toggle
                checked={isCheckAll}
                onChange={() => toggleAll(!isCheckAll)}
              />
            </div>
          )}

          {availableFieldKeys.length > 0 ? (
            availableFieldKeys.map((key) => (
              <div key={key} className="flex justify-between items-center p-3">
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <Toggle
                  checked={options[key]}
                  onChange={() => toggleOne(key)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No configuration options available
            </div>
          )}
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
