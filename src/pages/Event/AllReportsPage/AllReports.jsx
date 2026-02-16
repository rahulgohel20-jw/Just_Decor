import { Fragment, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import {
  GetEventMasterById,
  GetAllCustomThemeByUserIdAndModuleId,
} from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "@/components/container";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MenuReport from "../../../partials/modals/menu-report/MenuReport";
import CounterNameplate from "../../../partials/modals/counter-nameplate/CounterNameplate";
import MainStandyMenuReport from "../../../partials/modals/menu-report/MainStandyMenuReport";
import NamePlateReport from "../../../partials/modals/menu-report/NamePlateReport";
import CrockeryCutleryReportModal from "../../../partials/modals/menu-report/CrockeryCutleryReportModal";

export default function AllReports() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const activeLang = localStorage.getItem("lang") || "en";
  const userId = localStorage.getItem("userId");
  const lang = localStorage.getItem("lang");

  const [eventData, setEventData] = useState(null);
  const [reportSections, setReportSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isCrockeryModalOpen, setIsCrockeryModalOpen] = useState(false);

  // Modal and report generation states
  const [isMenuReportOpen, setIsMenuReportOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState(-1);
  const [mappingId, setMappingId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [eventName, setEventName] = useState("");
  const [partyNumber, setPartyNumber] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [isNamePlateTheme, setIsNamePlateTheme] = useState(false);
  const [openNamePlate, setOpenNamePlate] = useState(false);
  const [openNamePlateTest, setOpenNamePlateTest] = useState(false);
  const [isCounterNameplateOpen, setIsCounterNameplateOpen] = useState(false);

  const currentlang = useMemo(() => {
    switch (lang) {
      case "en":
        return 0;
      case "hi":
        return 1;
      case "gu":
        return 2;
      default:
        return 0;
    }
  }, [lang]);

  const selectedEventFunction = useMemo(() => {
    if (selectedFunctionId === -1) return null;

    return eventData?.eventFunctions?.find(
      (item) => item.id === selectedFunctionId,
    );
  }, [eventData, selectedFunctionId]);

  /* -----------------------------
     Language Helpers
  ------------------------------*/
  const getLangValue = (obj, baseKey) => {
    if (!obj) return "";
    if (activeLang === "hi")
      return obj[`${baseKey}Hindi`] || obj[`${baseKey}English`];
    if (activeLang === "gu")
      return obj[`${baseKey}Gujarati`] || obj[`${baseKey}English`];
    return obj[`${baseKey}English`];
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
    const fetchAllTemplatesByUserId = async () => {
      try {
        setLoading(true);

        const res = await GetAllCustomThemeByUserIdAndModuleId(userId, "");
        console.log(res);

        if (
          res?.data?.success &&
          res?.data?.data &&
          Array.isArray(res.data.data)
        ) {
          const allTemplates = res.data.data;

          const moduleGroups = {
            menu: [],
            allocation: [],
            raw: [],
            labour: [],
            costing: [],
            profitloss: [],
            menuForHM: [],
            generalFixTheme: [],
            crockertCutleryTheme: [],
            dishcounting: [],
          };

          allTemplates.forEach((item) => {
            const moduleName = item.templateModuleMaster?.nameEnglish;

            const template = {
              id: item.id,
              name: item.templateMaster.name,
              description: item.templateMaster.description || "",
              headingFontColor: item.templateMaster.headingFontColor,
              contentFontColor: item.templateMaster.contentFontColor,
              frontPage: item.templateMaster.frontPage,
              secondFrontPage: item.templateMaster.secondFrontPage,
              watermark: item.templateMaster.watermark,
              lastMainPage: item.templateMaster.lastMainPage,
              dummyPdf: item.templateMaster.dummyPdf,
              isNamePlate: item.templateMaster.isNamePlate,
              namePlateBg: item.templateMaster.namePlateBg,
              mappingId: item.templateMappingResponseDto?.id || item.id,
              namePlateType:
                item.templateMappingResponseDto?.namePlateType || "",
              moduleId: item.templateModuleMaster.id,
              moduleName: moduleName,
              moduleNameHindi: item.templateModuleMaster.nameHindi,
              moduleNameGujarati: item.templateModuleMaster.nameGujarati,
            };

            const addToModuleGroup = (group) => {
              const existingModule = group.find(
                (m) => m.id === item.templateModuleMaster.id,
              );
              if (existingModule) {
                existingModule.templates.push(template);
              } else {
                group.push({
                  id: item.templateModuleMaster.id,
                  name: getLangValue(item.templateModuleMaster, "name"),
                  nameEnglish: moduleName,
                  moduleId: item.templateModuleMaster.id,
                  templates: [template],
                  templatesLoaded: true,
                });
              }
            };

            if (["Exclusive Theme", "Back Office Theme"].includes(moduleName)) {
              addToModuleGroup(moduleGroups.menu);
            } else if (
              [
                "Menu Allocation Theme",
                "Chef Agency Theme",
                "Outside Agency Theme",
                "Name Plate Theme",
              ].includes(moduleName)
            ) {
              addToModuleGroup(moduleGroups.allocation);
            } else if (moduleName === "Raw Material Theme") {
              addToModuleGroup(moduleGroups.raw);
            } else if (moduleName === "Labour Agency Theme") {
              addToModuleGroup(moduleGroups.labour);
            } else if (moduleName === "Menu For HM") {
              addToModuleGroup(moduleGroups.menuForHM);
            } else if (moduleName === "Costing Report Theme") {
              addToModuleGroup(moduleGroups.costing);
            } else if (moduleName === "Profit And Loss") {
              addToModuleGroup(moduleGroups.profitloss);
            } else if (moduleName === "General Fix Theme") {
              addToModuleGroup(moduleGroups.generalFixTheme);
            } else if (moduleName === "Crockert Cutlery Theme") {
              addToModuleGroup(moduleGroups.crockertCutleryTheme);
            } else if (moduleName === "Dish counting") {
              addToModuleGroup(moduleGroups.dishcounting);
            }
          });

          // Create report sections structure
          const sections = [];

          if (moduleGroups.menu.length > 0) {
            sections.push({
              id: "menu-planning",
              name: "Menu Planning Reports",
              modules: moduleGroups.menu,
            });
          }

          if (moduleGroups.allocation.length > 0) {
            sections.push({
              id: "menu-allocation",
              name: "Menu Allocation Reports",
              modules: moduleGroups.allocation,
            });
          }

          if (moduleGroups.raw.length > 0) {
            sections.push({
              id: "raw-material",
              name: "Raw Material Reports",
              modules: moduleGroups.raw,
            });
          }

          if (moduleGroups.labour.length > 0) {
            sections.push({
              id: "labour-agency",
              name: "Labour Agency Reports",
              modules: moduleGroups.labour,
            });
          }
          if (moduleGroups.costing.length > 0) {
            sections.push({
              id: "costing",
              name: "Costing Reports",
              modules: moduleGroups.costing,
            });
          }
          if (moduleGroups.dishcounting.length > 0) {
            sections.push({
              id: "dishcounting",
              name: "Dish Counting",
              modules: moduleGroups.dishcounting,
            });
          }

          if (moduleGroups.profitloss.length > 0) {
            sections.push({
              id: "profitloss",
              name: "Profitloss Reports",
              modules: moduleGroups.profitloss,
            });
          }

          if (moduleGroups.generalFixTheme.length > 0) {
            sections.push({
              id: "generalFixTheme",
              name: "General Fix Theme",
              modules: moduleGroups.generalFixTheme,
            });
          }
          if (moduleGroups.crockertCutleryTheme.length > 0) {
            sections.push({
              id: "crockertCutleryTheme",
              name: "Crockert Cutlery Theme",
              modules: moduleGroups.crockertCutleryTheme,
            });
          }
          if (moduleGroups.menuForHM.length > 0) {
            sections.push({
              id: "menu-hm",
              name: "Menu For HM Reports",
              modules: moduleGroups.menuForHM,
            });
          }

          setReportSections(sections);

          // Auto-expand first section by default
          if (sections.length > 0) {
            setExpandedSection(sections[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAllTemplatesByUserId();
    }
  }, [eventId, activeLang, userId]);

  /* -----------------------------
     Handlers
  ------------------------------*/
  const toggleSection = (sectionId) => {
    const newExpandedSection = expandedSection === sectionId ? null : sectionId;
    setExpandedSection(newExpandedSection);
  };

  const handleGenerateReport = (section, module, template) => {
    console.log("=== HANDLE GENERATE REPORT CALLED ===");
    console.log("Template details:", {
      name: template.name,
      isNamePlate: template.isNamePlate,
      namePlateType: template.namePlateType,
      isNamePlateTheme: module.nameEnglish === "Name Plate Theme",
      templateId: template.id,
    });

    setSelectedCard(template.id);
    setSelectedTemplateId(template.id);
    setSelectedTemplateName(template.name);
    setMappingId(template.mappingId);
    setSelectedModuleId(template.moduleId);

    const isNamePlateModule = module.nameEnglish === "Name Plate Theme";
    setIsNamePlateTheme(isNamePlateModule);

    // ✅ Crockery Cutlery — checked FIRST before any nameplate logic
    if (section.id === "crockertCutleryTheme") {
      console.log(
        "✅ MATCHED: Crockery Cutlery Theme - Opening CrockeryCutleryReportModal",
      );
      setIsCrockeryModalOpen(true);
      return;
    }

    // Counter Name Plate
    if (
      isNamePlateModule &&
      template.isNamePlate &&
      template.namePlateType === "Counter Name Plate"
    ) {
      console.log("✅ MATCHED: Counter Name Plate - Opening CounterNameplate");
      setIsCounterNameplateOpen(true);
      return;
    }

    // 🔄 BACKEND WORKAROUND: Backend sends "Table Menu" but it's actually Main Standy data
    // So when backend says "Table Menu" → Open NamePlateReport
    if (
      isNamePlateModule &&
      template.isNamePlate &&
      template.namePlateType === "Table Menu"
    ) {
      console.log(
        "✅ MATCHED: Table Menu (Backend) - Opening NamePlateReport (Frontend Workaround)",
      );
      setOpenNamePlate(true);
      return;
    }

    // 🔄 BACKEND WORKAROUND: Backend sends "Main Standy" but it's actually Table Menu data
    // So when backend says "Main Standy" → Open MainStandyMenuReport
    if (
      isNamePlateModule &&
      template.isNamePlate &&
      template.namePlateType === "Main Standy"
    ) {
      console.log(
        "✅ MATCHED: Main Standy (Backend) - Opening MainStandyMenuReport (Frontend Workaround)",
      );
      setOpenNamePlateTest(true);
      return;
    }

    // Default: Normal menu report
    console.log("⚠️ NO MATCH - Opening default MenuReport");
    setIsMenuReportOpen(true);
  };

  /* -----------------------------
     Render
  ------------------------------*/
  return (
    <Fragment>
      <Container>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <i className="ki-filled ki-left text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            <FormattedMessage
              id="REPORTS.SELECT_REPORT_TYPE"
              defaultMessage="Select Report Type"
            />
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full" />
          </div>
        ) : (
          <>
            {/* Event Info */}
            {eventData && (
              <div className="bg-gray-200 rounded-2xl p-6 mb-6 border border-gray-400">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <InfoItem
                    icon={toAbsoluteUrl("/media/icons/partyname.png")}
                    label={intl.formatMessage({
                      id: "EVENT_MENU_ALLOCATION.PARTY_NAME",
                      defaultMessage: "Party Name",
                    })}
                    value={getLangValue(eventData.party, "name") || "-"}
                  />
                  <InfoItem
                    icon={toAbsoluteUrl("/media/icons/eventname.png")}
                    label={intl.formatMessage({
                      id: "EVENT_MENU_ALLOCATION.EVENT_NAME",
                      defaultMessage: "Event Name",
                    })}
                    value={getLangValue(eventData.eventType, "name") || "-"}
                  />
                  <InfoItem
                    icon={toAbsoluteUrl("/media/icons/funtionname.png")}
                    label={intl.formatMessage({
                      id: "COMMON.FUNCTION",
                      defaultMessage: "Function",
                    })}
                    value={
                      selectedEventFunction
                        ? getLangValue(selectedEventFunction.function, "name")
                        : activeLang === "hi"
                          ? "सभी फंक्शन"
                          : activeLang === "gu"
                            ? "બધા ફંક્શન"
                            : "All Functions"
                    }
                  />
                  <InfoItem
                    icon={toAbsoluteUrl("/media/icons/date&time.png")}
                    label={intl.formatMessage({
                      id: "TABLE.EVENT_DATE_TIME",
                      defaultMessage: "Event Date & Time",
                    })}
                    value={eventData.eventStartDateTime || "-"}
                  />
                  <InfoItem
                    icon={toAbsoluteUrl("/media/icons/venue.png")}
                    label={intl.formatMessage({
                      id: "TABLE.VENUE",
                      defaultMessage: "Venue",
                    })}
                    value={getLangValue(eventData.venue, "name") || "-"}
                  />
                </div>
              </div>
            )}

            {/* Function Selector */}
            {eventData && (
              <div className="mb-6 max-w-sm">
                <label className="block text-sm font-semibold mb-2">
                  <FormattedMessage
                    id="COMMON.SELECT_FUNCTION"
                    defaultMessage="Select Function"
                  />
                </label>

                <select
                  className="w-full border rounded-lg px-4 py-2"
                  value={selectedFunctionId}
                  onChange={(e) =>
                    setSelectedFunctionId(Number(e.target.value))
                  }
                >
                  <option value={-1}>
                    {activeLang === "hi"
                      ? "सभी फंक्शन"
                      : activeLang === "gu"
                        ? "બધા ફંક્શન"
                        : "All Functions"}
                  </option>

                  {eventData?.eventFunctions?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getLangValue(item.function, "name")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Report Sections */}
            {reportSections.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No reports available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportSections.map((section) => {
                  const isExpanded = expandedSection === section.id;

                  return (
                    <div
                      key={section.id}
                      className="bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Section Header */}
                      <div
                        onClick={() => toggleSection(section.id)}
                        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors rounded-t-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ki-filled ki-document text-white text-lg"></i>
                          </div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {section.name}
                          </h3>
                        </div>
                        <i
                          className={`ki-filled text-xl text-gray-600 transition-transform duration-300 ${
                            isExpanded ? "ki-up" : "ki-down"
                          }`}
                        />
                      </div>

                      {/* Section Content - All modules' templates combined */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                          {section.modules.map((module) => {
                            return (
                              <div key={module.id} className="mb-6 last:mb-0">
                                {/* Module Name as Subheading */}
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <h4 className="font-semibold text-md text-gray-700">
                                    {module.name}
                                  </h4>
                                </div>

                                {/* Templates for this module */}
                                {module.templates.length === 0 ? (
                                  <div className="text-center py-4 text-gray-400 text-sm">
                                    No templates available
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {module.templates.map((template) => {
                                      const isActive =
                                        selectedCard === template.id;

                                      return (
                                        <div
                                          key={template.id}
                                          className={`
                                            flex items-center gap-6 bg-white rounded-xl  
                                            border-2 ${isActive ? "border-[#005BA8]" : "border-gray-200"}
                                            shadow-sm hover:shadow-md transition-all duration-300 p-4
                                          `}
                                        >
                                          {/* Image (Left) */}
                                          <div className="w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
                                            <img
                                              src={toAbsoluteUrl(
                                                "/media/icons/reportcard.png",
                                              )}
                                              alt={template.name || "Template"}
                                              className="w-10 h-10 object-contain"
                                            />
                                          </div>

                                          {/* Content (Middle) */}
                                          <div className="flex-1">
                                            <h4
                                              className={`text-base font-bold ${
                                                isActive
                                                  ? "text-[#005BA8]"
                                                  : "text-gray-800"
                                              }`}
                                            >
                                              {template.name}
                                            </h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                              {template.description}
                                            </p>
                                          </div>

                                          {/* Action (Right) */}
                                          <div className="flex-shrink-0">
                                            <button
                                              className="btn btn-primary px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleGenerateReport(
                                                  section,
                                                  module,
                                                  template,
                                                );
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
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Container>

      <CrockeryCutleryReportModal
        isModalOpen={isCrockeryModalOpen}
        setIsModalOpen={setIsCrockeryModalOpen}
        eventId={eventId}
        eventFunctionId={selectedFunctionId}
        moduleId={selectedModuleId}
        mappingId={mappingId}
        selectedTemplateId={selectedTemplateId}
        eventName={eventName}
        selectedTemplateName={selectedTemplateName}
        PartyNumber={partyNumber}
      />
      {/* Modals */}
      <MenuReport
        isModalOpen={isMenuReportOpen}
        setIsModalOpen={setIsMenuReportOpen}
        eventId={eventId}
        eventFunctionId={selectedFunctionId}
        moduleId={selectedModuleId}
        mappingId={mappingId}
        selectedTemplateId={selectedTemplateId}
        eventName={eventName}
        selectedTemplateName={selectedTemplateName}
        PartyNumber={partyNumber}
        isNamePlateTheme={isNamePlateTheme}
      />

      <CounterNameplate
        isModalOpen={isCounterNameplateOpen}
        setIsModalOpen={setIsCounterNameplateOpen}
        eventId={eventId}
        eventFunctionId={selectedFunctionId}
        currentlang={currentlang}
        adminTemplatemoduleId={selectedModuleId}
        selectedTemplateId={selectedTemplateId}
      />

      {openNamePlateTest && (
        <MainStandyMenuReport
          isModalOpen={openNamePlateTest}
          setIsModalOpen={setOpenNamePlateTest}
          eventId={eventId}
          eventFunctionId={selectedFunctionId}
          selectedTemplateId={selectedTemplateId}
        />
      )}

      {openNamePlate && (
        <CustomModal
          open={openNamePlate}
          onClose={() => setOpenNamePlate(false)}
          width={900}
          footer={null}
        >
          <NamePlateReport
            onClose={() => setOpenNamePlate(false)}
            eventId={eventId}
            eventFunctionId={selectedFunctionId}
            selectedTemplateId={selectedTemplateId}
          />
        </CustomModal>
      )}
    </Fragment>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 min-w-[120px]">
    {icon && <img src={icon} alt={label} className="w-5 h-5 object-contain" />}
    <div className="flex flex-col">
      <span className="text-black font-bold text-base">{label}</span>
      <span className="text-sm font-semibold text-gray-600">{value}</span>
    </div>
  </div>
);
