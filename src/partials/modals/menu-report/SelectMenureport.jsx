import React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, Link, useParams } from "react-router-dom";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";
import {
  GetEventMasterById,
  GettemplatebyuserId,
  GetAllCustomThemeByUserIdAndModuleId,
} from "@/services/apiServices";
import { useMemo } from "react";

import MenuReport from "./MenuReport";

export default function SelectMenureport({
  eventId,
  isSelectMenureport,
  setIsSelectMenuReport,
  onConfirm,
  activeFunctionName,
  setEventFunctionId,
  disabled = false,
}) {
  const navigate = useNavigate();

  const params = useParams();
  const finalEventId = eventId || params.eventId;

  const [selectedCard, setSelectedCard] = useState(null);

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [isMenuReportOpen, setIsMenuReportOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [mappingId, setmappingId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [eventName, setEventName] = useState("");
  const [PartyNumber, setPartyNumber] = useState("");

  // Get userId from your auth context or storage
  const userId = localStorage.getItem("userId");

  const selectedEventFunction = useMemo(() => {
    return eventData?.eventFunctions?.find(
      (item) => item.id === setEventFunctionId
    );
  }, [eventData, setEventFunctionId]);

  // Fetch template modules for tabs
  useEffect(() => {
    const fetchTemplateModules = async () => {
      try {
        const res = await GettemplatebyuserId();

        if (res?.data?.success && res?.data?.data) {
          const modules = res.data.data
            .filter((module) => module.isActive && !module.isDelete)
            .map((module) => ({
              key: module.id,
              label: module.nameEnglish,
              moduleId: module.id,
              img: "/media/icons/simple.png",
            }));

          setTabs(modules);

          // Set first tab as active by default
          if (modules.length > 0) {
            setActiveTab(modules[0].key);
          }
        }
      } catch (error) {
        console.error("Error fetching template modules:", error);
      }
    };

    fetchTemplateModules();
  }, [isSelectMenureport, finalEventId]);

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

  const handleGenerateReport = (template) => {
    setSelectedCard(template.id);
    setSelectedTemplateId(template.id);

    setmappingId(template.mappingId);
    setSelectedModuleId(activeTab);

    setSelectedFunctionId(setEventFunctionId);

    // ✅ OPEN MenuReport modal
    setIsMenuReportOpen(true);
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
              Select Report Type
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
                label="Party Name"
                value={eventData?.party?.nameEnglish || "-"}
              />

              <InfoItem
                icon={toAbsoluteUrl("/media/icons/eventname.png")}
                label="Event Name"
                value={eventData?.eventType?.nameEnglish || "-"}
              />
              <InfoItem
                icon={toAbsoluteUrl("/media/icons/funtionname.png")}
                label="Function"
                value={selectedEventFunction?.function?.nameEnglish || "-"}
              />
              <InfoItem
                icon={toAbsoluteUrl("/media/icons/date&time.png")}
                label="Date & Time"
                value={eventData?.eventStartDateTime || "-"}
              />
              <InfoItem
                icon={toAbsoluteUrl("/media/icons/venue.png")}
                label="Venue"
                value={eventData?.venue?.nameEnglish || "-"}
              />
            </div>
          </div>

          {/* Dynamic Tabs */}
          <div className="flex gap-10 border-b border-gray-200 mb-6">
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
                  <span>{tab.label}</span>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => {
                const isActive = selectedCard === template.id;
                return (
                  <div
                    key={template.id}
                    className={`
          relative bg-white rounded-2xl
          border-2 ${isActive ? "border-[#005BA8]" : "border-gray-200"}
          shadow-md hover:shadow-lg transition-all duration-300
        `}
                  >
                    <div className="p-6 flex flex-col items-left">
                      {/* Icon or Preview */}
                      <div className="w-16 h-16 flex items-center justify-center mb-4">
                        {template.frontPage ? (
                          <img
                            src={template.frontPage}
                            alt={template.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            src={toAbsoluteUrl("/media/icons/selectmenu.png")}
                            className="w-15 h-15"
                            alt="Template icon"
                          />
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-lg font-bold mb-2 ${isActive ? "text-[#005BA8]" : "text-gray-800"}`}
                      >
                        {template.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-700 text-left">
                        {template.description}
                      </p>

                      {/* Centered Button */}
                      <div className="flex justify-center mt-6">
                        <button
                          className="btn btn-primary px-6 py-2 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateReport(template);
                          }}
                        >
                          Generate Report
                        </button>
                      </div>
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
