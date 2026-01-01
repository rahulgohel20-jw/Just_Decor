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
  eventName,
  PartyNumber,
}) => {
  const intl = useIntl();
  console.log(eventId);

  // Configure plugin with default scale of 1 (100%)
  const pdfPlugin = defaultLayoutPlugin({
    toolbarPlugin: {
      zoomPlugin: {
        enableShortcuts: true,
      },
    },
  });

  const userId = localStorage.getItem("userId");
  const [visibleOptions, setVisibleOptions] = useState([]);
  const [reportType, setReportType] = useState(null);

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
    console.log("EventId in MenuReport:", eventId);
    const fetchConfig = async () => {
      try {
        const res = await GetReportConfiguration(mappingId, moduleId);
        console.log(res);

        const config = res?.data?.data?.[0];
        if (!config) return;
        setReportType(config.type);
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
          isWithQty: config.isWithQty === 1,
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
            isWithQty: config.isWithQty,
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

  const handleReport = async () => {
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
      isItemImage: options.categoryImage,
      isItemInstruction: options.itemInstruction,
      isItemSlogan: options.itemSlogan,
      isCompanyDetails: options.companyDetails,
      isCompanyLogo: options.companyLogo,
      isPartyDetails: options.partyDetails,
      isWithQty: options.isWithQty,
    };

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

  const handleWhatsAppShare = (pdfUrl) => {
    const name = eventName || " there";
    const mobile = PartyNumber || "";

    if (!mobile) {
      alert("Mobile number not available");
      return;
    }

    const message = `Hi ${name},\nHope you're doing well!\nPlease find attached the PDF as requested. Let me know if you have any questions or need any adjustments.\n\nThanks!\n${pdfUrl}`;

    // Direct link for WhatsApp Web
    const url = `https://web.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(message)}`;

    // Open WhatsApp Web in new tab
    window.open(url, "_blank");
  };

  return (
    <CustomModal
      open={isModalOpen}
      title="Menu Report"
      onClose={handleClose}
      width={900}
      footer={
        pdfUrl ? (
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Close
            </button>
            <button
              onClick={() => handleWhatsAppShare(pdfUrl)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Share on WhatsApp
            </button>
          </div>
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
            <Viewer fileUrl={pdfUrl} plugins={[pdfPlugin]} defaultScale={1.0} />
          </Worker>
        </div>
      )}
    </CustomModal>
  );
};

export default MenuReport;
