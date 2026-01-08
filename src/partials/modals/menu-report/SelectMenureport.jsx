import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";
import {
  GetEventMasterById,
  GettemplatebyuserId,
  GetAllCustomThemeByUserIdAndModuleId,
} from "@/services/apiServices";
import { useMemo } from "react";

import MenuReport from "./MenuReport";
import { FormattedMessage, useIntl } from "react-intl";

export default function SelectMenureport({
  eventId,
  isSelectMenureport,
  setIsSelectMenuReport,
  setEventFunctionId,
  disabled = false,
  mode,
}) {
  const params = useParams();
  const finalEventId = eventId || params.eventId;
  const [selectedCard, setSelectedCard] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isMenuReportOpen, setIsMenuReportOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState(-1);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [mappingId, setmappingId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [eventName, setEventName] = useState("");
  const [PartyNumber, setPartyNumber] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const userId = localStorage.getItem("userId");

  const intl = useIntl();

  const selectedEventFunction = useMemo(() => {
    if (selectedFunctionId === -1) return null;

    return eventData?.eventFunctions?.find(
      (item) => item.id === selectedFunctionId
    );
  }, [eventData, selectedFunctionId]);

  const activeLang = localStorage.getItem("lang") || "en";

  const getLangValue = (obj, baseKey, lang) => {
    if (!obj) return "";

    switch (lang) {
      case "hi":
        return obj[`${baseKey}Hindi`] || obj[`${baseKey}English`] || "";
      case "gu":
        return obj[`${baseKey}Gujarati`] || obj[`${baseKey}English`] || "";
      default:
        return obj[`${baseKey}English`] || "";
    }
  };

  useEffect(() => {
    const fetchTemplateModules = async () => {
      try {
        const res = await GettemplatebyuserId();

        if (res?.data?.success && res?.data?.data) {
          let modules = res.data.data.filter(
            (module) => module.isActive && !module.isDelete
          );

          if (mode === "menu") {
            modules = modules.filter((module) =>
              ["Exclusive Theme", "Back Office Theme"].includes(
                module.nameEnglish
              )
            );
          } else if (mode === "allocation") {
            modules = modules.filter(
              (module) => module.nameEnglish === "Menu Allocation Theme"
            );
          } else if (mode === "raw") {
            modules = modules.filter(
              (module) => module.nameEnglish === "Raw Material Theme"
            );
          } else if (mode === "labour") {
            modules = modules.filter(
              (module) => module.nameEnglish === "Labour Agency Theme"
            );
          }

          const formattedModules = modules.map((module) => ({
            key: module.id,
            label: getLangValue(module, "name", activeLang),
            moduleId: module.id,
            img: "/media/icons/simple.png",
          }));

          setTabs(formattedModules);

          if (formattedModules.length > 0) {
            setActiveTab(formattedModules[0].key);
          }
        }
      } catch (error) {
        console.error("Error fetching template modules:", error);
      }
    };

    fetchTemplateModules();
  }, [isSelectMenureport, finalEventId, mode]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!activeTab) return;

      setTemplates([]);

      try {
        setTemplatesLoading(true);

        const res = await GetAllCustomThemeByUserIdAndModuleId(
          userId,
          activeTab
        );

        let dynamicTemplates = [];

        if (
          res?.data?.success &&
          res?.data?.data &&
          Array.isArray(res.data.data)
        ) {
          dynamicTemplates = res.data.data.map((item) => ({
            id: item.id,
            name: item.templateMaster.name,

            description: `${item.templateMaster.name} - Custom theme template`,
            headingFontColor: item.templateMaster.headingFontColor,
            contentFontColor: item.templateMaster.contentFontColor,
            frontPage: item.templateMaster.frontPage,
            secondFrontPage: item.templateMaster.secondFrontPage,
            watermark: item.templateMaster.watermark,
            lastMainPage: item.templateMaster.lastMainPage,
            dummyPdf: item.templateMaster.dummyPdf,
            isNamePlate: item.templateMaster.isNamePlate,
            namePlateBg: item.templateMaster.namePlateBg,
            isStatic: false,
            mappingId: item.templateMappingResponseDto?.id || item.id,
          }));
        }

        setTemplates(dynamicTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, [activeTab, tabs, userId]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!finalEventId) return;
      try {
        setLoading(true);
        const res = await GetEventMasterById(finalEventId);

        if (res?.data?.data?.["Event Details"]?.length > 0) {
          const event = res.data.data["Event Details"][0];

          setEventName(event?.party?.nameEnglish || "");
          setPartyNumber(event?.party?.mobileno || "");
          setEventData(event);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isSelectMenureport && finalEventId) {
      fetchEventData();
    }
  }, [isSelectMenureport, finalEventId]);
  useEffect(() => {
    if (!eventData) return;

    if (setEventFunctionId !== undefined && setEventFunctionId !== null) {
      setSelectedFunctionId(Number(setEventFunctionId));
    } else {
      setSelectedFunctionId(-1);
    }
  }, [eventData, setEventFunctionId, isSelectMenureport]);

  const handleGenerateReport = (template) => {
    setSelectedCard(template.id);
    setSelectedTemplateId(template.id);
    setSelectedTemplateName(template.name);
    setmappingId(template.mappingId);
    setSelectedModuleId(activeTab);

    // ✅ OPEN MenuReport modal
    setIsMenuReportOpen(true);
  };
  const handleFunctionChange = (e) => {
    setSelectedFunctionId(Number(e.target.value));
  };

  return (
    <>
      <CustomModal
        open={isSelectMenureport && !disabled}
        onClose={() => setIsSelectMenuReport(false)}
        footer={null}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <i className="ki-filled ki-document text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-gray-800">
              <FormattedMessage
                id="REPORTS.SELECT_REPORT_TYPE"
                defaultMessage="Select Report Type"
              />
            </span>
          </div>
        }
        width={1100}
      >
        <div className="p-6">
          {/* Event Info Card */}
          <div className="bg-gray-200 rounded-2xl p-6 mb-6 border border-gray-400">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <InfoItem
                icon={toAbsoluteUrl("/media/icons/partyname.png")}
                label={intl.formatMessage({
                  id: "EVENT_MENU_ALLOCATION.PARTY_NAME",
                  defaultMessage: "Party Name",
                })}
                value={
                  getLangValue(eventData?.party, "name", activeLang) || "-"
                }
              />

              <InfoItem
                icon={toAbsoluteUrl("/media/icons/eventname.png")}
                label={intl.formatMessage({
                  id: "EVENT_MENU_ALLOCATION.EVENT_NAME",
                  defaultMessage: "Event Name",
                })}
                value={
                  getLangValue(eventData?.eventType, "name", activeLang) || "-"
                }
              />
              <InfoItem
                icon={toAbsoluteUrl("/media/icons/funtionname.png")}
                label={intl.formatMessage({
                  id: "COMMON.FUNCTION",
                  defaultMessage: "Function",
                })}
                value={
                  selectedEventFunction
                    ? getLangValue(
                        selectedEventFunction.function,
                        "name",
                        activeLang
                      )
                    : activeLang === "hi"
                      ? "सभी फंक्शन"
                      : activeLang === "gu"
                        ? "બધા ફંક્શન"
                        : "All Function"
                }
              />
              <InfoItem
                icon={toAbsoluteUrl("/media/icons/date&time.png")}
                label={intl.formatMessage({
                  id: "TABLE.EVENT_DATE_TIME",
                  defaultMessage: "Event Date & Time",
                })}
                value={eventData?.eventStartDateTime || "-"}
              />
              <InfoItem
                icon={toAbsoluteUrl("/media/icons/venue.png")}
                label={intl.formatMessage({
                  id: "TABLE.VENUE",
                  defaultMessage: "Venue",
                })}
                value={
                  getLangValue(eventData?.venue, "name", activeLang) || "-"
                }
              />
            </div>
          </div>

          <div className="mb-6 max-w-sm">
            <label className="block text-sm font-semibold mb-2">
              Select Function
            </label>

            <select
              className="w-full border rounded-lg px-4 py-2"
              value={selectedFunctionId}
              onChange={handleFunctionChange}
            >
              <option value={-1}>All Functions</option>

              {eventData?.eventFunctions?.map((item) => (
                <option key={item.id} value={item.id}>
                  {getLangValue(item.function, "name", activeLang)}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Tabs */}
          <div className="flex gap-10 border-b border-gray-200 mb-6 overflow-x-scroll scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`group relative pb-4 flex items-center gap-3 font-semibold text-lg transition-all
          ${isActive ? "text-gray-700 hover:text-[#005BA8]" : "text-gray-700 hover:text-[#005BA8]"}
        `}
                  style={isActive ? { color: "#005BA8" } : {}}
                >
                  {/* Icon with blue filter when active */}
                  <img
                    src={toAbsoluteUrl(tab.img)}
                    alt={tab.label}
                    className="w-6 h-6 transition-all duration-300"
                    style={{
                      filter: isActive
                        ? "invert(26%) sepia(95%) saturate(1685%) hue-rotate(192deg) brightness(93%) contrast(101%)"
                        : "invert(50%) sepia(0%) saturate(0%)",
                    }}
                  />

                  {/* Label */}
                  <span className=" max-w-[300px]">{tab.label}</span>

                  {/* Bottom underline */}
                  <span
                    className={`absolute left-0 -bottom-[1px] h-[4px] w-full transition-all duration-300
            ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
                    style={{ backgroundColor: "#005BA8" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Dynamic Template Cards */}
          {templatesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : templates.length > 0 ? (
            <div className="space-y-4">
              {templates.map((template) => {
                const isActive = selectedCard === template.id;

                return (
                  <div
                    key={template.id}
                    className={`
            flex items-center gap-6 bg-white rounded-xl  
            border-2 ${isActive ? "border-[#005BA8]" : "border-gray-200"}
            shadow-sm hover:shadow-md transition-all duration-300
          `}
                  >
                    {/* Image (Left) */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden">
                      {template.frontPage ? (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                          <img
                            src={toAbsoluteUrl("/media/icons/reportcard.png")}
                            alt={template.name || "Template"}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      ) : (
                        <img
                          src={toAbsoluteUrl("/media/icons/reportcard.png")}
                          alt="Template"
                          className="w-12 h-12 object-contain"
                        />
                      )}
                    </div>

                    {/* Content (Middle) */}
                    <div className="flex-1">
                      <h3
                        className={`text-base font-bold ${
                          isActive ? "text-[#005BA8]" : "text-gray-800"
                        }`}
                      >
                        {template.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                    </div>

                    {/* Action (Right) */}
                    <div className="flex-shrink-0 pe-3">
                      <button
                        className="btn btn-primary px-6 h-[50px] w-[200px] text-md rounded-full flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(template);
                        }}
                      >
                        <FormattedMessage
                          id="REPORTS.GENERATE_REPORT"
                          defaultMessage="Generate Report"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No templates available for this module
            </div>
          )}
        </div>
      </CustomModal>
      <MenuReport
        isModalOpen={isMenuReportOpen}
        setIsModalOpen={setIsMenuReportOpen}
        eventId={finalEventId}
        eventFunctionId={selectedFunctionId}
        moduleId={selectedModuleId || activeTab}
        mappingId={mappingId}
        selectedTemplateId={selectedTemplateId}
        eventName={eventName}
        selectedTemplateName={selectedTemplateName}
        PartyNumber={PartyNumber}
      />
    </>
  );
}

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 min-w-[120px]">
    {/* Icon */}
    {icon && <img src={icon} alt={label} className="w-5 h-5 object-contain" />}

    {/* Text */}
    <div className="flex flex-col">
      <span className=" text-black font-bold text-base">{label}</span>
      <span className="text-sm font-semibold text-gray-600">{value}</span>
    </div>
  </div>
);
