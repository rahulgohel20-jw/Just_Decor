import { useEffect, useState } from "react";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import NamePlateReport from "./NamePlateReport";
import {
  AddExclusiveReport,
  GetReportConfiguration,
  GetAgenciesForReportFilter,
  GetSelectedItemsForReportFilter,
  GetAllRawMaterialAllocationCategory,
} from "@/services/apiServices";
import { successMsgPopup, errorMsgPopup } from "../../../underConstruction";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { Select } from "antd";
import { TeamOutlined, AppstoreOutlined } from "@ant-design/icons";

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
  startDate: adminStartDate,
  endDate: adminEndDate,
  agencyType,
  isAdminModuleReport = false,
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
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [isDateStatus, setisDateStatus] = useState();
  const [agencies, setAgencies] = useState([]);
  const [category, setCategory] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  useEffect(() => {
    if (!pdfUrl) return;

    const originalPrint = window.print;

    window.print = async () => {
      window.print = originalPrint;

      try {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error("Failed to fetch PDF");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const iframe = document.createElement("iframe");
        iframe.style.cssText =
          "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
        iframe.src = blobUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          setTimeout(() => {
            try {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            } catch {
              window.open(blobUrl, "_blank");
            }
            setTimeout(() => {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(blobUrl);
              // Re-hook for next print click
              window.print = interceptedPrint;
            }, 3000);
          }, 800);
        };
      } catch {
        window.open(pdfUrl, "_blank");
        window.print = interceptedPrint;
      }
    };

    const interceptedPrint = window.print;

    return () => {
      window.print = originalPrint;
    };
  }, [pdfUrl]);
  useEffect(() => {
    if (!isModalOpen || !mappingId) return;

    const fetchConfig = async () => {
      try {
        const res = await GetReportConfiguration(mappingId, moduleId);
        const config = res?.data?.data?.[0];
        if (!config) return;

        setReportType(config.type);
        if (config.isRawMaterialCat === 1) {
          setisDropdownStatus(1);
          setShowCategoryDropdown(true);
          setShowAgencyDropdown(false);
          setShowItemDropdown(false);
        }

        if (isAdminModuleReport || agencyType == null) {
          setisDropdownStatus(0);
          setShowAgencyDropdown(false);
          setShowItemDropdown(false);
          setShowCategoryDropdown(false);
        } else if (config.isAgency === 1 && config.isItem === 1) {
          setisDropdownStatus(1);
          setShowAgencyDropdown(true);
          setShowItemDropdown(true);
          setShowCategoryDropdown(false);
        } else if (config.isAgency === 1) {
          setisDropdownStatus(1);
          setShowAgencyDropdown(true);
          setShowCategoryDropdown(false);
        } else if (config.isItem === 1) {
          setisDropdownStatus(1);
          setShowItemDropdown(true);
          setShowCategoryDropdown(false);
        }

        if (config.isDate === 1) setisDateStatus(1);

        setOptions({
          categorySlogan: config.isCategorySlogan === 0,
          categoryInstruction: config.isCategoryInstruction === 1,
          categoryImage: config.isCategoryImage === 0,
          itemSlogan: config.isItemSlogan === 0,
          itemInstruction: config.isItemInstruction === 1,
          CompanyInfo: config.isCompanyDetails === 1,
          companyLogo: config.isCompanyLogo === 1,
          itemImage: config.isItemImage === 0,
          isCombo: config.isCombo === 0,
          partyDetails: config.isPartyDetails === 1,
          isWithQty: config.isWithQty === 1,
          size1: { label: config.size1, enabled: Boolean(config.size1 === 1) },
          size2: { label: config.size2, enabled: Boolean(config.size2 === 0) },
          isWithPrice: config.isWithPrice === 0,
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
            isCombo: config.isCombo,
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
  }, [isModalOpen, mappingId, moduleId, isAdminModuleReport, agencyType]);

  useEffect(() => {
    if (!isModalOpen || isDropdownStatus !== 1 || isAdminModuleReport) return;

    const fetchAgencies = async () => {
      setLoadingFilters(true);
      try {
        const agencyRes = await GetAgenciesForReportFilter(
          eventFunctionId,
          eventId,
          agencyType,
        );
        if (agencyRes?.data?.success && agencyRes?.data?.data) {
          const agencyList = agencyRes.data.data;
          setAgencies(agencyList);
          setSelectedAgency(agencyList.map((a) => a.id));
        } else {
          setAgencies([]);
          setSelectedAgency([]);
        }
      } catch (err) {
        errorMsgPopup("Failed to load agencies");
        setAgencies([]);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchAgencies();
  }, [
    isModalOpen,
    isDropdownStatus,
    eventFunctionId,
    eventId,
    agencyType,
    isAdminModuleReport,
  ]);

  useEffect(() => {
    if (!isModalOpen || isDropdownStatus !== 1 || isAdminModuleReport) return;

    const fetchcategory = async () => {
      setLoadingFilters(true);
      try {
        const categoryres = await GetAllRawMaterialAllocationCategory(eventId);
        if (categoryres?.data?.success && categoryres?.data?.data) {
          const categoryList =
            categoryres.data.data["Raw Material Category Details"];
          setCategory(categoryList);
          setSelectedCategory(categoryList.map((a) => a.id));
        } else {
          setCategory([]);
          setSelectedCategory([]);
        }
      } catch (err) {
        errorMsgPopup("Failed to load agencies");
        setCategory([]);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchcategory();
  }, [isModalOpen, isDropdownStatus, eventId, isAdminModuleReport]);

  useEffect(() => {
    if (
      !isModalOpen ||
      isDropdownStatus !== 1 ||
      selectedAgency.length === 0 ||
      isAdminModuleReport
    ) {
      setItems([]);
      setSelectedItems([]);
      return;
    }

    const fetchItemsByAgency = async () => {
      setLoadingFilters(true);
      try {
        const itemsRes = await GetSelectedItemsForReportFilter(
          eventFunctionId,
          eventId,
          selectedAgency,
        );
        if (itemsRes?.data?.success && itemsRes?.data?.data) {
          setItems(itemsRes.data.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        errorMsgPopup("Failed to load items");
        setItems([]);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchItemsByAgency();
  }, [
    isModalOpen,
    isDropdownStatus,
    eventFunctionId,
    eventId,
    selectedAgency,
    isAdminModuleReport,
  ]);

  const formatAdminDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const toggleAll = (checked) => {
    setOptions((prev) => {
      const updated = { ...prev };
      visibleOptions.forEach((key) => {
        if (key !== "size1" && key !== "size2") updated[key] = checked;
      });
      return updated;
    });
  };

  const toggleOne = (key) => {
    setOptions((prev) => {
      if (key === "size1")
        return {
          ...prev,
          size1: { ...prev.size1, enabled: true },
          size2: { ...prev.size2, enabled: false },
        };
      if (key === "size2")
        return {
          ...prev,
          size1: { ...prev.size1, enabled: false },
          size2: { ...prev.size2, enabled: true },
        };
      return { ...prev, [key]: !prev[key] };
    });
  };

  const isCheckAll =
    visibleOptions.length > 0 && visibleOptions.every((key) => options[key]);

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
      isCombo: options.isCombo,
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
      rawMaterialCatIds: selectedCategory,
      ...(adminStartDate && { startDate: formatAdminDate(adminStartDate) }),
      ...(adminEndDate && { endDate: formatAdminDate(adminEndDate) }),
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
    setSelectedAgency([]);
    setSelectedItems([]);
    setStartDate(null);
    setEndDate(null);
  };

  const handleWhatsAppShare = () => {
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`}
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
              onClick={handleWhatsAppShare}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Share on WhatsApp
            </button>
          </div>
        ) : (
          <button
            onClick={handleReport}
            disabled={loading}
            className={`px-6 py-2 text-white rounded transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#005BA8] hover:bg-[#004a8d]"}`}
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
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Select Language
            </label>
            <div className="flex border rounded-lg overflow-hidden shadow-sm">
              {["english", "hindi", "gujarati"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex-1 py-2.5 font-medium transition ${selectedLanguage === lang ? "bg-[#005BA8] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {!isAdminModuleReport &&
            (isDateStatus === 1 ||
              showAgencyDropdown ||
              showItemDropdown ||
              showCategoryDropdown) && (
              <div className="p-5 rounded-xl border-2">
                <div className="grid grid-cols-2 gap-4">
                  {showAgencyDropdown && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          <TeamOutlined className="mr-1" />
                          Agency
                        </label>
                        <Select
                          mode="multiple"
                          value={selectedAgency}
                          onChange={setSelectedAgency}
                          placeholder="Select agencies..."
                          className="w-full"
                          size="large"
                          loading={loadingFilters}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={agencies.map((a) => ({
                            value: a.id,
                            label: a.nameEnglish,
                          }))}
                          maxTagCount="responsive"
                          allowClear
                        />
                      </div>
                      {showItemDropdown && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            <AppstoreOutlined className="mr-1" />
                            Items
                          </label>
                          <Select
                            mode="multiple"
                            value={selectedItems}
                            onChange={setSelectedItems}
                            placeholder="Select items..."
                            className="w-full"
                            size="large"
                            loading={loadingFilters}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={items.map((i) => ({
                              value: i.id,
                              label: i.nameEnglish,
                            }))}
                            maxTagCount="responsive"
                            allowClear
                            disabled={selectedAgency.length === 0}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {showCategoryDropdown && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        <AppstoreOutlined className="mr-1" />
                        Category
                      </label>
                      <Select
                        mode="multiple"
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        placeholder="Select items..."
                        className="w-full"
                        size="large"
                        loading={loadingFilters}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={category.map((i) => ({
                          value: i.id,
                          label: i.nameEnglish,
                        }))}
                        maxTagCount="responsive"
                        allowClear
                        disabled={setSelectedCategory.length === 0}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

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
