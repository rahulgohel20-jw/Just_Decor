import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import {
  GetEventMasterById,
  GettemplatebyuserId,
  GetAllCustomThemeByUserIdAndModuleId,
} from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "@/components/container";
import MenuReport from "../../../partials/modals/menu-report/MenuReport";

export default function AdminModuleReport() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const activeLang = localStorage.getItem("lang") || "en";
  const userId = localStorage.getItem("userId");

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [modules, setModules] = useState([]);
  const [moduleTemplates, setModuleTemplates] = useState({});
  const [templatesLoading, setTemplatesLoading] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agencyType, setAgencyType] = useState("");

  const [isMenuReportOpen, setIsMenuReportOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedMappingId, setSelectedMappingId] = useState(null);
  const [selectedTemplateIdForReport, setSelectedTemplateIdForReport] =
    useState(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [eventName, setEventName] = useState("");
  const [partyNumber, setPartyNumber] = useState("");
  const [selectedTemplateIsDate, setSelectedTemplateIsDate] = useState(0);

  const getLangValue = (obj, baseKey) => {
    if (!obj) return "";
    if (activeLang === "hi")
      return obj[`${baseKey}Hindi`] || obj[`${baseKey}English`];
    if (activeLang === "gu")
      return obj[`${baseKey}Gujarati`] || obj[`${baseKey}English`];
    return obj[`${baseKey}English`];
  };

  const formatDateToDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);
        const event = res?.data?.data?.["Event Details"]?.[0] || null;
        setEventData(event);

        if (event) {
          setEventName(event?.party?.nameEnglish || "");
          setPartyNumber(event?.party?.mobileno || "");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const res = await GettemplatebyuserId();

        if (res?.data?.success && res?.data?.data) {
          const filteredModules = res.data.data.filter(
            (module) =>
              module.isActive &&
              !module.isDelete &&
              [
                "Chef Agency Theme",
                "Labour Agency Theme",
                "Outside Agency Theme",
              ].includes(module.nameEnglish),
          );

          const formattedModules = filteredModules.map((module) => ({
            id: module.id,
            name: getLangValue(module, "name"),
            nameEnglish: module.nameEnglish,
            icon: getModuleIcon(module.nameEnglish),
          }));

          setModules(formattedModules);

          // Fetch templates for all modules immediately
          formattedModules.forEach((module) => {
            fetchTemplatesForModule(module.id);
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [activeLang]);

  /* -----------------------------
     Get Module Icon
  ------------------------------*/
  const getModuleIcon = (moduleName) => {
    switch (moduleName) {
      case "Chef Agency Theme":
        return "ki-chef-hat";
      case "Labour Agency Theme":
        return "ki-people";
      case "Outside Agency Theme":
        return "ki-shop";
      default:
        return "ki-document";
    }
  };

  /* -----------------------------
     Fetch Templates for a Module
  ------------------------------*/
  const fetchTemplatesForModule = async (moduleId) => {
    if (moduleTemplates[moduleId]) return; // Already loaded

    try {
      setTemplatesLoading((prev) => ({ ...prev, [moduleId]: true }));

      const res = await GetAllCustomThemeByUserIdAndModuleId(userId, moduleId);

      let templates = [];

      if (
        res?.data?.success &&
        res?.data?.data &&
        Array.isArray(res.data.data)
      ) {
        templates = res.data.data.map((item) => ({
          id: item.id,
          name: item.templateMaster.name,
          description: item.templateMaster.description,
          mappingId: item.templateMappingResponseDto?.id || item.id,
          isDate: item.templateMappingResponseDto?.isDate || 0,
        }));
      }

      setModuleTemplates((prev) => ({
        ...prev,
        [moduleId]: templates,
      }));
    } catch (error) {
      console.error("Error fetching templates:", error);
      setModuleTemplates((prev) => ({
        ...prev,
        [moduleId]: [],
      }));
    } finally {
      setTemplatesLoading((prev) => ({ ...prev, [moduleId]: false }));
    }
  };

  /* -----------------------------
     Handlers
  ------------------------------*/
  const handleGenerateReport = (moduleId, template) => {
    setSelectedCard(template.id);
    setSelectedModuleId(moduleId);
    setSelectedMappingId(template.mappingId);
    setSelectedTemplateIdForReport(template.id);
    setSelectedTemplateName(template.name);
    setSelectedTemplateIsDate(template.isDate || 0);

    const selectedModule = modules.find((m) => m.id === moduleId);

    if (selectedModule?.nameEnglish === "Chef Agency Theme") {
      setAgencyType("chef");
    } else if (selectedModule?.nameEnglish === "Labour Agency Theme") {
      setAgencyType("labour");
    } else if (selectedModule?.nameEnglish === "Outside Agency Theme") {
      setAgencyType("outside");
    } else {
      setAgencyType("");
    }

    setIsMenuReportOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
          >
            <i className="ki-filled ki-left" />
          </button>
          <i className="ki-filled ki-calendar-tick text-primary text-lg" />
          <h1 className="text-2xl font-bold">
            <FormattedMessage
              id="REPORTS.ADMIN_MODULE_REPORT"
              defaultMessage="Date Wise Report"
            />
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full" />
          </div>
        ) : (
          <>
            {/* Event Info */}
            {eventData && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Party Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ki-filled ki-profile-circle text-primary text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900">
                        Party Name
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {getLangValue(eventData.party, "name") || "Demo"}
                      </div>
                    </div>
                  </div>

                  {/* Event Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ki-filled ki-calendar text-primary text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900">
                        Event Name
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {getLangValue(eventData.eventType, "name") || "Demo"}
                      </div>
                    </div>
                  </div>

                  {/* Function */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ki-filled ki-document text-primary text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900">
                        Function
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        All Function
                      </div>
                    </div>
                  </div>

                  {/* Event Date & Time */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ki-filled ki-calendar-tick text-primary text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900">
                        Event Date & Time
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {eventData.eventStartDateTime || "03/01/2026 08:00 AM"}
                      </div>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ki-filled ki-geolocation text-primary text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900">
                        Venue
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {getLangValue(eventData.venue, "name") || "Home"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Filters */}
            <div className="bg-white border rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">Filter by Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    disabled={!startDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="DD/MM/YYYY"
                  />
                  {!startDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Please select start date first
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Module Sections - Always Visible */}
            {modules.length > 0 ? (
              modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white border rounded-xl mb-4 p-6"
                >
                  {/* Module Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <i
                      className={`ki-filled ${module.icon} text-primary text-xl`}
                    />
                    <h3 className="font-bold text-lg">{module.name}</h3>
                  </div>

                  {/* Module Content - Templates Always Visible */}
                  <div className="space-y-3">
                    {templatesLoading[module.id] ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
                      </div>
                    ) : moduleTemplates[module.id]?.filter(
                        (template) => template.isDate === 1,
                      ).length > 0 ? (
                      moduleTemplates[module.id]
                        .filter((template) => template.isDate === 1)
                        .map((template) => (
                          <div
                            key={template.id}
                            className={`border shadow-lg p-4 rounded-lg flex flex-col sm:flex-row gap-3 justify-between items-center ${
                              selectedCard === template.id
                                ? "border-primary bg-blue-50"
                                : "border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <i className="ki-filled ki-calendar-tick text-primary text-lg" />
                              <div>
                                <h4 className="font-semibold text-primary">
                                  {template.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary rounded-3xl px-6 py-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateReport(module.id, template);
                              }}
                            >
                              Generate Report
                            </button>
                          </div>
                        ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No templates available for this module
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border rounded-xl p-12 text-center">
                <i className="ki-filled ki-information-2 text-gray-400 text-4xl mb-4" />
                <p className="text-gray-500 text-lg">No modules available</p>
              </div>
            )}
          </>
        )}
      </Container>

      {/* MenuReport Modal */}
      <MenuReport
        isModalOpen={isMenuReportOpen}
        setIsModalOpen={setIsMenuReportOpen}
        eventId={-1}
        eventFunctionId={-1}
        moduleId={selectedModuleId}
        mappingId={selectedMappingId}
        selectedTemplateId={selectedTemplateIdForReport}
        eventName={eventName}
        PartyNumber={partyNumber}
        selectedTemplateName={selectedTemplateName}
        isNamePlateTheme={false}
        startDate={startDate}
        endDate={endDate}
        isAdminModuleReport={false}
        agencyType={agencyType}
      />
    </Fragment>
  );
}
