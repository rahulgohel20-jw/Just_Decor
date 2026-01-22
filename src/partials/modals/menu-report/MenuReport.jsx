import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import NamePlateReport from "./NamePlateReport";
import {
  AddExclusiveReport,
  GetReportConfiguration,
  GetAgenciesForReportFilter,
  GetSelectedItemsForReportFilter,
} from "@/services/apiServices";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select } from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

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
  const [isDropdownStatus, setisDropdownStatus] = useState();
  const [isDateStatus, setisDateStatus] = useState();

  // Filter states
  const [agencies, setAgencies] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedAgency, setSelectedAgency] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

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

        if (config.isDropDown === 1) {
          setisDropdownStatus(1);
        }
        if (config.isDate === 1) {
          setisDateStatus(1);
        }
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
          size1: {
            label: config.size1,
            enabled: Boolean(config.size1 === 0),
          },
          size2: {
            label: config.size2,
            enabled: Boolean(config.size2 === 0),
          },
          isWithPrice: config.isWithPrice === 1,
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
            size1: !!config.size1,
            size2: !!config.size2,
            isWithPrice: config.isWithPrice,
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

  /* ---------------- FETCH AGENCIES & ITEMS ---------------- */
  useEffect(() => {
    if (!isModalOpen || isDropdownStatus !== 1) return;

    const fetchFilters = async () => {
      setLoadingFilters(true);
      try {
        // Fetch agencies
        const agencyRes = await GetAgenciesForReportFilter(
          eventFunctionId,
          eventId,
        );
        console.log("agencies", agencyRes);

        if (agencyRes?.data?.success && agencyRes?.data?.data) {
          setAgencies(agencyRes.data.data);
        }

        // Fetch items
        const itemsRes = await GetSelectedItemsForReportFilter(
          eventFunctionId,
          eventId,
        );
        console.log("items", itemsRes);

        if (itemsRes?.data?.success && itemsRes?.data?.data) {
          setItems(itemsRes.data.data);
        }
      } catch (err) {
        console.error("Filter fetch error", err);
        errorMsgPopup("Failed to load filter options");
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [isModalOpen, isDropdownStatus, eventFunctionId, eventId]);

  const toggleAll = (checked) => {
    setOptions((prev) => {
      const updated = { ...prev };

      visibleOptions.forEach((key) => {
        if (key !== "size1" && key !== "size2") {
          updated[key] = checked;
        }
      });

      return updated;
    });
  };

  const toggleOne = (key) => {
    setOptions((prev) => {
      // Handle mutually exclusive sizes
      if (key === "size1") {
        return {
          ...prev,
          size1: {
            ...prev.size1,
            enabled: true,
          },
          size2: {
            ...prev.size2,
            enabled: false,
          },
        };
      }

      if (key === "size2") {
        return {
          ...prev,
          size1: {
            ...prev.size1,
            enabled: false,
          },
          size2: {
            ...prev.size2,
            enabled: true,
          },
        };
      }

      // Normal toggle for other options
      return { ...prev, [key]: !prev[key] };
    });
  };

  const isCheckAll =
    visibleOptions.length > 0 && visibleOptions.every((key) => options[key]);

  const formatDate = (date) => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleReport = async () => {
    if (isNamePlateTheme) {
      setShowNamePlateUI(true);
      return;
    }

    const pageSize = options.size1?.enabled
      ? options.size1.label
      : options.size2?.enabled
        ? options.size2.label
        : "";

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
      pageSize,
      isWithPrice: options.isWithPrice,
      agencyId: selectedAgency,
      itemId: selectedItems,
      ...(startDate && { startDate: formatDate(startDate) }),
      ...(endDate && { endDate: formatDate(endDate) }),
    };

    if (!payload.eventId || !payload.adminTemplateModuleId) {
      errorMsgPopup("Missing required data");
      return;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(
          key,
          value === true ? "1" : value === false ? "0" : value,
        );
      }
    });
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
    // Reset filters
    setSelectedAgency([]);
    setSelectedItems([]);
    setStartDate(null);
    setEndDate(null);
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
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Close
            </button>
            <button
              onClick={() => handleWhatsAppShare(pdfUrl)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Share on WhatsApp
            </button>
          </div>
        ) : (
          <button
            onClick={handleReport}
            disabled={loading}
            className={`px-6 py-2 text-white rounded transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#005BA8] hover:bg-[#004a8d]"
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
        <div className="space-y-6">
          {/* Language Selector */}
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Select Language
            </label>
            <div className="flex border rounded-lg overflow-hidden shadow-sm">
              {["english", "hindi", "gujarati"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex-1 py-2.5 font-medium transition ${
                    selectedLanguage === lang
                      ? "bg-[#005BA8] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Section */}
          {(isDateStatus === 1 || isDropdownStatus === 1) && (
            <div className=" p-5 rounded-xl border-2 ">
              <div className="grid grid-cols-2 gap-4">
                {/* Date Range Picker */}
                {isDateStatus === 1 && (
                  <>
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Start Date
                      </label>
                      <div className="relative">
                        <CalendarOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#005BA8] z-10" />
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          placeholderText="Select start date"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005BA8] focus:border-[#005BA8] outline-none transition shadow-sm hover:border-[#005BA8]"
                          dateFormat="dd MMM yyyy"
                          maxDate={endDate || new Date()}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        End Date
                      </label>
                      <div className="relative">
                        <CalendarOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#005BA8] z-10" />
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          placeholderText="Select end date"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005BA8] focus:border-[#005BA8] outline-none transition shadow-sm hover:border-[#005BA8]"
                          dateFormat="dd MMM yyyy"
                          minDate={startDate}
                          maxDate={new Date()}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Dropdowns */}
                {isDropdownStatus === 1 && (
                  <>
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        <TeamOutlined className="mr-1" />
                        Agency
                      </label>
                      <Select
                        mode="multiple"
                        value={selectedAgency}
                        onChange={setSelectedAgency}
                        placeholder="Select agencies..."
                        className="w-full custom-select"
                        size="large"
                        loading={loadingFilters}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={agencies.map((agency) => ({
                          value: agency.id,
                          label: agency.nameEnglish,
                        }))}
                        maxTagCount="responsive"
                        allowClear
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        <AppstoreOutlined className="mr-1" />
                        Items
                      </label>
                      <Select
                        mode="multiple"
                        value={selectedItems}
                        onChange={setSelectedItems}
                        placeholder="Select items..."
                        className="w-full custom-select"
                        size="large"
                        loading={loadingFilters}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={items.map((item) => ({
                          value: item.id,
                          label: item.nameEnglish,
                        }))}
                        maxTagCount="responsive"
                        allowClear
                        style={{
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Report Options */}
          {!isNamePlateTheme && (
            <>
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <span className="font-semibold text-gray-700">
                  Check All Options
                </span>
                <Toggle
                  checked={isCheckAll}
                  onChange={() => toggleAll(!isCheckAll)}
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {visibleOptions.map((key) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="capitalize text-gray-700">
                      {key === "size1" || key === "size2"
                        ? `Size ${options[key]?.label}`
                        : key.replace(/([A-Z])/g, " $1")}
                    </span>

                    <Toggle
                      checked={
                        key === "size1" || key === "size2"
                          ? options[key]?.enabled
                          : options[key]
                      }
                      onChange={() => toggleOne(key)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
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
