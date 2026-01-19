import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import NamePlateReport from "./NamePlateReport";
import {
  AddExclusiveReport,
  GetReportConfiguration,
} from "@/services/apiServices";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
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
  selectedTemplateId,
  eventName,
  PartyNumber,
  selectedTemplateName,
  isNamePlateTheme,
}) => {
  const pdfPlugin = defaultLayoutPlugin();
  const userId = localStorage.getItem("userId");

  const [visibleOptions, setVisibleOptions] = useState([]);
  const [reportType, setReportType] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [options, setOptions] = useState({});
  const [showNamePlateUI, setShowNamePlateUI] = useState(false);
  const SIZE_LABELS = {
    size1: "A4",
    size2: "A6",
  };

  /* ---------------- FETCH CONFIG ---------------- */
  useEffect(() => {
    if (!isModalOpen || !mappingId) return;

    const fetchConfig = async () => {
      try {
        const res = await GetReportConfiguration(mappingId, moduleId);
        const config = res?.data?.data?.[0];
        if (!config) return;

        setReportType(config.type);

        setOptions({
          categorySlogan: config.isCategorySlogan === 1,
          categoryInstruction: config.isCategoryInstruction === 1,
          categoryImage: config.isCategoryImage === 1,
          itemSlogan: config.isItemSlogan === 1,
          itemInstruction: config.isItemInstruction === 1,
          CompanyInfo: config.isCompanyDetails === 1,
          companyLogo: config.isCompanyLogo === 1,
          itemImage: config.isItemImage === 1,
          partyDetails: config.isPartyDetails === 1,
          isWithQty: config.isWithQty === 1,
          size1: config.size1 || null, // string from API
          size2: config.size2 || null, // string from API
        });

        setVisibleOptions(
          Object.entries({
            CompanyInfo: config.isCompanyDetails,
            categorySlogan: config.isCategorySlogan,
            categoryInstruction: config.isCategoryInstruction,
            categoryImage: config.isCategoryImage,
            itemSlogan: config.isItemSlogan,
            itemInstruction: config.isItemInstruction,
            companyLogo: config.isCompanyLogo,
            itemImage: config.isItemImage,
            partyDetails: config.isPartyDetails,
            isWithQty: config.isWithQty,
            size1: config.size1 ? 1 : 0,
            size2: config.size2 ? 1 : 0,
          })
            .filter(([_, value]) => value)

            .map(([key]) => key),
        );
      } catch (err) {
        console.error("Config fetch error", err);
      }
    };

    fetchConfig();
  }, [isModalOpen, mappingId, moduleId]);

  const toggleAll = (checked) => {
    setOptions((prev) => {
      const updated = { ...prev };
      visibleOptions.forEach((key) => {
        updated[key] = checked;
      });
      return updated;
    });
  };

  const toggleOne = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const isCheckAll =
    visibleOptions.length > 0 && visibleOptions.every((key) => options[key]);

  /* ---------------- HANDLE REPORT ---------------- */
  const handleReport = async () => {
    if (isNamePlateTheme) {
      setShowNamePlateUI(true); // 🔥 OPEN NamePlate UI
      return;
    }

    const payload = {
      eventId,
      eventFunctionId: eventFunctionId ?? -1,
      adminTemplateModuleId: selectedTemplateId ?? 0,
      type: reportType || null,
      userId,
      lang:
        selectedLanguage === "english"
          ? 0
          : selectedLanguage === "hindi"
            ? 1
            : 2,
      isCategoryImage: options.categoryImage,
      isCategoryInstruction: options.categoryInstruction,
      isCategorySlogan: options.categorySlogan,
      isItemImage: options.itemImage,
      isItemInstruction: options.itemInstruction,
      isItemSlogan: options.itemSlogan,
      isCompanyDetails: options.CompanyInfo,
      isCompanyLogo: options.companyLogo,
      isPartyDetails: options.partyDetails,
      isWithQty: options.isWithQty,
      size1: options.size1,
      size2: options.size2,
    };

    if (!payload.eventId || !payload.adminTemplateModuleId) {
      errorMsgPopup("Missing required data");
      return;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) =>
      formData.append(
        key,
        value === true ? "1" : value === false ? "0" : value,
      ),
    );

    setLoading(true);
    try {
      const { data } = await AddExclusiveReport(formData);
      if (data?.success && data?.report_path) {
        successMsgPopup(data?.msg || "Report generated");
        setPdfUrl(data?.report_path);
      } else {
        errorMsgPopup(data?.msg || "Failed to generate report");
      }
    } catch (err) {
      errorMsgPopup(err?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPdfUrl(null);
    setShowNamePlateUI(false);
    setIsModalOpen(false);
  };

  const handleWhatsAppShare = (pdfUrl) => {
    const name = eventName || "there";
    const mobile = PartyNumber || "";
    if (!mobile) return alert("Mobile number not available");

    const message = `Hi ${name},\nPlease find the attached PDF.\n\n${pdfUrl}`;
    window.open(
      `https://web.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <CustomModal
      open={isModalOpen}
      title={selectedTemplateName || "Report"}
      onClose={handleClose}
      width={900}
      footer={
        pdfUrl ? (
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Close
            </button>
            <button
              onClick={() => handleWhatsAppShare(pdfUrl)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Share on WhatsApp
            </button>
          </div>
        ) : (
          <button
            onClick={handleReport}
            disabled={loading}
            className={`px-6 py-2 text-white rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#005BA8]"
            }`}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        )
      }
    >
      {showNamePlateUI ? (
        <NamePlateReport onClose={() => setShowNamePlateUI(false)} />
      ) : !pdfUrl ? (
        <>
          {/* Language Selector */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Select Language</label>
            <div className="flex border rounded overflow-hidden">
              {["english", "hindi", "gujarati"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex-1 py-2 ${
                    selectedLanguage === lang
                      ? "bg-[#005BA8] text-white"
                      : "bg-white"
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Check All / Options */}
          {!isNamePlateTheme && (
            <div className="flex justify-between border-b pb-3 mb-3">
              <span className="font-semibold">Check All</span>
              <Toggle
                checked={isCheckAll}
                onChange={() => toggleAll(!isCheckAll)}
              />
            </div>
          )}

          <div className="space-y-2">
            {visibleOptions.map((key) => (
              <div key={key} className="flex justify-between items-center">
                <span className="capitalize">
                  {key === "size1" || key === "size2"
                    ? `Size ${options[key]}` // ✅ show string from API
                    : key.replace(/([A-Z])/g, " $1")}
                </span>

                {/* Show toggle only for non-size keys */}
                {key !== "size1" && key !== "size2" && (
                  <Toggle
                    checked={options[key]}
                    onChange={() => toggleOne(key)}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
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
