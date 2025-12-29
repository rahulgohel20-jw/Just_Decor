import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
import {
  AddExclusiveReport,
  GetReportConfiguration,
} from "@/services/apiServices";
import { useIntl } from "react-intl";

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
  selectedTemplateId,
}) => {
  const intl = useIntl();
  const pdfPlugin = defaultLayoutPlugin();

  const userId = localStorage.getItem("userId");
  const [visibleOptions, setVisibleOptions] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [options, setOptions] = useState({
    categorySlogan: false,
    categoryInstruction: false,
    categoryImage: false,
    itemSlogan: false,
    itemInstruction: false,
    companyDetails: true,
    companyLogo: true,
    itemImage: true,
    partyDetails: true,
  });

  /* ---------------- FETCH CONFIG ---------------- */
  useEffect(() => {
    if (!isModalOpen || !mappingId) return;

    const fetchConfig = async () => {
      try {
        const res = await GetReportConfiguration(mappingId, moduleId);
        console.log(res);

        const config = res?.data?.data?.[0];
        if (!config) return;

        setOptions({
          categorySlogan: config.isCategorySlogan === 1,
          categoryInstruction: config.isCategoryInstruction === 1,
          categoryImage: config.isCategoryImage === 1,
          itemSlogan: config.isItemSlogan === 1,
          itemInstruction: config.isItemInstruction === 1,
          companyDetails: config.isCompanyDetails === 1,
          companyLogo: config.isCompanyLogo === 1,
          itemImage: config.isItemImage === 1,
          partyDetails: config.isPartyDetails === 1,
        });

        setVisibleOptions(
          Object.entries({
            categorySlogan: config.isCategorySlogan,
            categoryInstruction: config.isCategoryInstruction,
            categoryImage: config.isCategoryImage,
            itemSlogan: config.isItemSlogan,
            itemInstruction: config.isItemInstruction,
            companyDetails: config.isCompanyDetails,
            companyLogo: config.isCompanyLogo,
            itemImage: config.isItemImage,
            partyDetails: config.isPartyDetails,
          })
            .filter(([_, value]) => value === 1)
            .map(([key]) => key)
        );
      } catch (err) {
        console.error("Config fetch error", err);
      }
    };

    fetchConfig();
  }, [isModalOpen, mappingId]);

  const toggleAll = (checked) => {
    setOptions((prev) => {
      const updated = { ...prev };
      visibleOptions.forEach((key) => {
        updated[key] = checked;
      });
      return updated;
    });
  };

  const Toggle = ({ checked, onChange, disabled }) => (
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

  const isCheckAll =
    visibleOptions.length > 0 && visibleOptions.every((key) => options[key]);

  /* ---------------- REPORT API ---------------- */
  const handleReport = async () => {
    const payload = {
      eventId,
      eventFunctionId: eventFunctionId ?? 0,
      adminTemplateModuleId: selectedTemplateId ?? 0,

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
      isItemImage: options.categoryImage,
      isItemInstruction: options.itemInstruction,
      isItemSlogan: options.itemSlogan,
      isCompanyDetails: options.companyDetails,
      iscompanyLogo: options.companyLogo,
      isPartyDetails: options.partyDetails,
    };

    console.log("📦 FINAL PAYLOAD:", payload);

    if (!payload.eventId || !payload.adminTemplateModuleId) {
      errorMsgPopup("Missing required data");
      return;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else {
        formData.append(key, String(value));
      }
    });

    console.log("📤 FormData:");
    for (let p of formData.entries()) console.log(p[0], p[1]);

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
    setIsModalOpen(false);
  };
  const toggleOne = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ---------------- UI ---------------- */
  return (
    <CustomModal
      open={isModalOpen}
      title="Menu Report"
      onClose={handleClose}
      width={900}
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
            className={`px-6 py-2 text-white rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#005BA8] hover:bg-[#004a8f]"
            }`}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        )
      }
    >
      {!pdfUrl ? (
        <>
          {/* LANGUAGE */}
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

          {/* CHECK ALL */}
          <div className="flex justify-between border-b pb-3 mb-3">
            <span className="font-semibold">Check All</span>
            <Toggle
              checked={isCheckAll}
              onChange={() => toggleAll(!isCheckAll)}
            />
          </div>

          {/* OPTIONS */}
          <div className="space-y-2">
            <div className="space-y-2">
              {visibleOptions.map((key) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <Toggle
                    checked={options[key]}
                    onChange={() => toggleOne(key)}
                  />
                </div>
              ))}
            </div>
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
