import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import { GetEventMasterById } from "@/services/apiServices";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "@/components/container";

export default function AllReports() {
  const params = useParams();
  const navigate = useNavigate();
  const finalEventId = params.eventId;

  const [selectedCard, setSelectedCard] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState("menu-planning"); // Default open
  const [sectionFunctions, setSectionFunctions] = useState({
    "menu-planning": -1,
    "menu-allocation": -1,
    "raw-material": -1,
    "labour-agency": -1,
  });
  const [sectionReportTypes, setSectionReportTypes] = useState({
    "menu-planning": "exclusive",
    "menu-allocation": "exclusive",
    "raw-material": "exclusive",
    "labour-agency": "exclusive",
  });

  const intl = useIntl();
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

  // Report types tabs
  const reportTypes = [
    { id: "exclusive", name: "Exclusive Theme", color: "#005BA8" },
    { id: "simple", name: "Simple Report", color: "#10B981" },
    { id: "detailed", name: "Detailed Report", color: "#F59E0B" },
    { id: "summary", name: "Summary Report", color: "#8B5CF6" },
    { id: "custom", name: "Custom Theme", color: "#EF4444" },
  ];

  // Report sections with multiple templates each
  const reportSections = [
    {
      id: "menu-planning",
      name: "Menu Planning Reports",
      description: "Comprehensive menu planning and preparation reports",
      icon: "/media/icons/menu-icon.png",
      templates: {
        exclusive: [
          {
            id: "menu-planning-exclusive-1",
            name: "Premium Menu Planning",
            description: "Luxury themed menu planning report",
          },
          {
            id: "menu-planning-exclusive-2",
            name: "Executive Menu Plan",
            description: "High-end menu planning documentation",
          },
        ],
        simple: [
          {
            id: "menu-planning-simple-1",
            name: "Basic Menu Plan",
            description: "Simple and clean menu planning",
          },
        ],
        detailed: [
          {
            id: "menu-planning-detailed-1",
            name: "Comprehensive Menu Analysis",
            description: "Complete menu planning with all details",
          },
          {
            id: "menu-planning-detailed-2",
            name: "Category-wise Breakdown",
            description: "Detailed category analysis",
          },
        ],
        summary: [
          {
            id: "menu-planning-summary-1",
            name: "Quick Overview",
            description: "Condensed menu planning summary",
          },
        ],
        custom: [
          {
            id: "menu-planning-custom-1",
            name: "Branded Theme Report",
            description: "Custom branded menu report",
          },
        ],
      },
    },
    {
      id: "menu-allocation",
      name: "Menu Allocation Reports",
      description: "Menu allocation and distribution tracking",
      icon: "/media/icons/allocation-icon.png",
      templates: {
        exclusive: [
          {
            id: "menu-allocation-exclusive-1",
            name: "Premium Allocation Report",
            description: "Luxury allocation documentation",
          },
        ],
        simple: [
          {
            id: "menu-allocation-simple-1",
            name: "Basic Allocation",
            description: "Simple allocation overview",
          },
        ],
        detailed: [
          {
            id: "menu-allocation-detailed-1",
            name: "Function-wise Allocation",
            description: "Detailed breakdown by function",
          },
          {
            id: "menu-allocation-detailed-2",
            name: "Venue-wise Distribution",
            description: "Complete venue allocation details",
          },
        ],
        summary: [
          {
            id: "menu-allocation-summary-1",
            name: "Allocation Overview",
            description: "Quick allocation summary",
          },
        ],
        custom: [
          {
            id: "menu-allocation-custom-1",
            name: "Custom Allocation Theme",
            description: "Branded allocation report",
          },
        ],
      },
    },
    {
      id: "raw-material",
      name: "Raw Material Distribution Reports",
      description: "Raw material tracking and distribution reports",
      icon: "/media/icons/material-icon.png",
      templates: {
        exclusive: [
          {
            id: "raw-material-exclusive-1",
            name: "Premium Material Report",
            description: "Executive material distribution",
          },
        ],
        simple: [
          {
            id: "raw-material-simple-1",
            name: "Basic Material List",
            description: "Simple material overview",
          },
        ],
        detailed: [
          {
            id: "raw-material-detailed-1",
            name: "Supplier-wise Distribution",
            description: "Complete supplier breakdown",
          },
          {
            id: "raw-material-detailed-2",
            name: "Category Analysis",
            description: "Detailed category-wise materials",
          },
          {
            id: "raw-material-detailed-3",
            name: "Cost Analysis Report",
            description: "Comprehensive cost breakdown",
          },
        ],
        summary: [
          {
            id: "raw-material-summary-1",
            name: "Material Summary",
            description: "Quick material overview",
          },
        ],
        custom: [
          {
            id: "raw-material-custom-1",
            name: "Branded Material Report",
            description: "Custom themed material report",
          },
        ],
      },
    },
    {
      id: "labour-agency",
      name: "Labour Agency Order Reports",
      description: "Labour and agency management reports",
      icon: "/media/icons/labour-icon.png",
      templates: {
        exclusive: [
          {
            id: "labour-exclusive-1",
            name: "Premium Agency Report",
            description: "Executive labour documentation",
          },
        ],
        simple: [
          {
            id: "labour-simple-1",
            name: "Basic Agency Orders",
            description: "Simple labour overview",
          },
        ],
        detailed: [
          {
            id: "labour-detailed-1",
            name: "Complete Agency Breakdown",
            description: "Detailed labour allocation",
          },
          {
            id: "labour-detailed-2",
            name: "Cost Analysis",
            description: "Labour cost breakdown",
          },
        ],
        summary: [
          {
            id: "labour-summary-1",
            name: "Agency Summary",
            description: "Quick labour overview",
          },
        ],
        custom: [
          {
            id: "labour-custom-1",
            name: "Custom Labour Theme",
            description: "Branded labour report",
          },
        ],
      },
    },
  ];

  useEffect(() => {
    const fetchEventData = async () => {
      if (!finalEventId) return;
      try {
        setLoading(true);
        const res = await GetEventMasterById(finalEventId);

        if (res?.data?.data?.["Event Details"]?.length > 0) {
          const event = res.data.data["Event Details"][0];
          setEventData(event);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (finalEventId) {
      fetchEventData();
    }
  }, [finalEventId]);

  const handleGenerateReport = (
    sectionId,
    template,
    reportType,
    functionId,
  ) => {
    setSelectedCard(template.id);

    console.log("Generating report:", {
      section: sectionId,
      template: template.id,
      reportType: reportType,
      function: functionId,
      event: finalEventId,
    });

    // Navigate or open modal based on template
    // Example: navigate(`/reports/${sectionId}/${template.id}/${finalEventId}/${functionId}`);
  };

  const handleSectionFunctionChange = (sectionId, functionId) => {
    setSectionFunctions((prev) => ({
      ...prev,
      [sectionId]: Number(functionId),
    }));
  };

  const handleReportTypeChange = (sectionId, reportTypeId) => {
    setSectionReportTypes((prev) => ({
      ...prev,
      [sectionId]: reportTypeId,
    }));
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const getSelectedFunction = (sectionId) => {
    const functionId = sectionFunctions[sectionId];
    if (functionId === -1) return null;
    return eventData?.eventFunctions?.find((item) => item.id === functionId);
  };

  return (
    <Fragment>
      <Container>
        <div className="max-w-7xl mx-auto py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
              >
                <i className="ki-filled ki-left text-gray-600"></i>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-document text-white text-xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  <FormattedMessage
                    id="REPORTS.SELECT_REPORT_TYPE"
                    defaultMessage="Select Report Type"
                  />
                </h1>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
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
                      getLangValue(eventData?.eventType, "name", activeLang) ||
                      "-"
                    }
                  />
                  <InfoItem
                    icon={toAbsoluteUrl("/media/icons/funtionname.png")}
                    label={intl.formatMessage({
                      id: "COMMON.FUNCTION",
                      defaultMessage: "Function",
                    })}
                    value={
                      eventData?.eventFunctions?.length > 0
                        ? `${eventData.eventFunctions.length} Functions`
                        : "-"
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

              {/* Report Sections */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <FormattedMessage
                    id="REPORTS.AVAILABLE_REPORTS"
                    defaultMessage="Available Reports"
                  />
                </h3>

                {reportSections.map((section) => {
                  const isExpanded = expandedSection === section.id;
                  const selectedReportType = sectionReportTypes[section.id];
                  const currentTemplates =
                    section.templates[selectedReportType] || [];

                  return (
                    <div
                      key={section.id}
                      className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden"
                    >
                      {/* Section Header */}
                      <div
                        className="flex items-center gap-6 p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleSection(section.id)}
                      >
                        {/* Icon */}
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                          <img
                            src={toAbsoluteUrl("/media/icons/reportcard.png")}
                            alt={section.name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>

                        {/* Section Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">
                            {section.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {section.description}
                          </p>
                          <p className="text-xs text-primary mt-1">
                            Multiple templates across {reportTypes.length}{" "}
                            themes
                          </p>
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div className="flex-shrink-0">
                          <i
                            className={`ki-filled text-2xl text-gray-400 transition-transform ${
                              isExpanded
                                ? "ki-up rotate-180"
                                : "ki-down rotate-0"
                            }`}
                          ></i>
                        </div>
                      </div>

                      {/* Section Content (Collapsible) */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          <div className="p-6 space-y-4">
                            {/* Function Selector */}
                            <div className="max-w-sm">
                              <label className="block text-sm font-semibold mb-2 text-gray-700">
                                <i className="ki-filled ki-calendar mr-2 text-primary"></i>
                                <FormattedMessage
                                  id="COMMON.SELECT_FUNCTION"
                                  defaultMessage="Select Function"
                                />
                              </label>
                              <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                value={sectionFunctions[section.id]}
                                onChange={(e) =>
                                  handleSectionFunctionChange(
                                    section.id,
                                    e.target.value,
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
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
                                    {getLangValue(
                                      item.function,
                                      "name",
                                      activeLang,
                                    )}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Report Type Tabs (Scrollable) */}
                            <div className="relative">
                              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {reportTypes.map((type) => {
                                  const isActive =
                                    selectedReportType === type.id;
                                  const templateCount =
                                    section.templates[type.id]?.length || 0;

                                  return (
                                    <button
                                      key={type.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReportTypeChange(
                                          section.id,
                                          type.id,
                                        );
                                      }}
                                      className={`
                                      flex-shrink-0 px-6 py-3 rounded-lg font-semibold text-sm
                                      transition-all duration-200 border-2
                                      ${
                                        isActive
                                          ? "bg-primary text-white border-primary shadow-md scale-105"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-primary/50"
                                      }
                                    `}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{type.name}</span>
                                        <span
                                          className={`
                                        px-2 py-0.5 rounded-full text-xs
                                        ${
                                          isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-600"
                                        }
                                      `}
                                        >
                                          {templateCount}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Templates List */}
                            <div className="space-y-3 mt-4">
                              {currentTemplates.length > 0 ? (
                                currentTemplates.map((template) => {
                                  const isActive = selectedCard === template.id;

                                  return (
                                    <div
                                      key={template.id}
                                      className={`
                                      flex items-center gap-4 bg-white rounded-lg p-4
                                      border-2 ${isActive ? "border-[#005BA8] shadow-md" : "border-gray-200"}
                                      hover:border-[#005BA8]/50 transition-all duration-200
                                    `}
                                    >
                                      {/* Template Info */}
                                      <div className="flex-1">
                                        <h4
                                          className={`font-semibold ${
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

                                      {/* Generate Button */}
                                      <div className="flex-shrink-0">
                                        <button
                                          className="btn btn-primary px-6 h-[44px] w-[180px] text-sm rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleGenerateReport(
                                              section.id,
                                              template,
                                              selectedReportType,
                                              sectionFunctions[section.id],
                                            );
                                          }}
                                        >
                                          <i className="ki-filled ki-file-down mr-2"></i>
                                          <FormattedMessage
                                            id="REPORTS.GENERATE"
                                            defaultMessage="Generate"
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  No templates available for this report type
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Container>
    </Fragment>
  );
}

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 min-w-[120px]">
    {icon && <img src={icon} alt={label} className="w-5 h-5 object-contain" />}
    <div className="flex flex-col">
      <span className="text-black font-bold text-base">{label}</span>
      <span className="text-sm font-semibold text-gray-600">{value}</span>
    </div>
  </div>
);
