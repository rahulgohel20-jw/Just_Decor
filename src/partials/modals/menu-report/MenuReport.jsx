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
  });

  console.log(eventId, moduleId);

  // Derived "Check All" (STATIC, no state)
  const isCheckAll =
    options.categorySlogan &&
    options.categoryInstruction &&
    options.categoryImage &&
    options.itemSlogan &&
    options.itemInstruction;

  const userId = 2;

  /* ---------------- FETCH CONFIG FROM BE ---------------- */
  useEffect(() => {
    if (!mappingId) return;

    const fetchConfig = async () => {
      try {
        const res = await GetReportConfiguration(mappingId);
        const config = res?.data?.data?.[0];
        if (!config) return;

        setOptions({
          categorySlogan: config.isCategorySlogan === 1,
          categoryInstruction: config.isCategoryInstruction === 1,
          categoryImage: config.isCategoryImage === 1,
          itemSlogan: config.isItemSlogan === 1,
          itemInstruction: config.isItemInstruction === 1,
        });
      } catch (err) {
        console.error("Configuration fetch error", err);
      }
    };

    fetchConfig();
  }, [mappingId]);

  /* ---------------- TOGGLES ---------------- */
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

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition
          ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );

  /* ---------------- REPORT API ---------------- */
  const handleReport = async () => {
    if (!eventId || !moduleId) {
      errorMsgPopup("Missing required data");
      return;
    }

    const lang =
      selectedLanguage === "english" ? 0 : selectedLanguage === "hindi" ? 1 : 2;

    const b = (v) => (v ? 1 : 0);

    const formData = new FormData();
    formData.append("adminTemplateModuleId", moduleId);
    formData.append("eventFunctionId", eventFunctionId || 0);
    formData.append("eventId", eventId);
    formData.append("lang", lang);
    formData.append("userId", userId);

    formData.append("isCategoryImage", b(options.categoryImage));
    formData.append("isCategoryInstruction", b(options.categoryInstruction));
    formData.append("isCategorySlogan", b(options.categorySlogan));
    formData.append("isItemImage", b(options.categoryImage));
    formData.append("isItemInstruction", b(options.itemInstruction));
    formData.append("isItemSlogan", b(options.itemSlogan));

    setLoading(true);
    console.log(formData);

    try {
      const { data } = await AddExclusiveReport(formData);
      if (data?.success && data?.filePath) {
        successMsgPopup(data.msg || "Report generated");
        setPdfUrl(data.filePath);
      } else {
        errorMsgPopup(data?.msg || "Failed to generate report");
      }
    } catch (err) {
      errorMsgPopup(err?.response?.data?.msg || "Report failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPdfUrl(null);
    setIsModalOpen(false);
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
            className="px-6 py-2 bg-[#005BA8] text-white rounded"
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
                  className={`flex-1 py-2 ${
                    selectedLanguage === lang ? "bg-[#005BA8] text-white" : ""
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* CHECK ALL */}
          <div className="flex justify-between mb-3">
            <span className="font-semibold">Check All</span>
            <Toggle
              checked={isCheckAll}
              onChange={() => toggleAll(!isCheckAll)}
            />
          </div>

          {/* OPTIONS */}
          {Object.keys(options).map((key) => (
            <div key={key} className="flex justify-between items-center py-2">
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <Toggle checked={options[key]} onChange={() => toggleOne(key)} />
            </div>
          ))}
        </>
      )}

      {pdfUrl && (
        <div style={{ height: "80vh" }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[pdfPlugin]} />
          </Worker>
        </div>
      )}
    </CustomModal>
  );
};

export default MenuReport;
