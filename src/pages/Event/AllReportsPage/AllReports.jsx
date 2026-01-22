import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import {
  GetEventMasterById,
  GettemplatebyuserId,
} from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "@/components/container";

export default function AllReports() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const activeLang = localStorage.getItem("lang") || "en";

  const [eventData, setEventData] = useState(null);
  const [apiTemplates, setApiTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  const [sectionFunctions, setSectionFunctions] = useState({
    "menu-planning": -1,
    "menu-allocation": -1,
    "raw-material": -1,
    "labour-agency": -1,
  });

  const [sectionReportTypes] = useState({
    "menu-planning": "custom",
    "menu-allocation": "custom",
    "raw-material": "custom",
    "labour-agency": "custom",
  });

  /* -----------------------------
     Language Helpers
  ------------------------------*/
  const getLangValue = (obj, baseKey) => {
    if (!obj) return "";
    if (activeLang === "hi") return obj[`${baseKey}Hindi`] || obj[`${baseKey}English`];
    if (activeLang === "gu") return obj[`${baseKey}Gujarati`] || obj[`${baseKey}English`];
    return obj[`${baseKey}English`];
  };

  const mapThemeToTemplate = (theme) => {
    const name =
      activeLang === "hi"
        ? theme.nameHindi || theme.nameEnglish
        : activeLang === "gu"
        ? theme.nameGujarati || theme.nameEnglish
        : theme.nameEnglish;

    return {
      id: theme.id,
      name,
      description: `${name} Report Theme`,
    };
  };

  /* -----------------------------
     Static Sections
  ------------------------------*/
  const reportSections = [
    { id: "menu-planning", name: "Menu Planning Reports" },
    { id: "menu-allocation", name: "Menu Allocation Reports" },
    { id: "raw-material", name: "Raw Material Reports" },
    { id: "labour-agency", name: "Labour Agency Reports" },
  ];

  /* -----------------------------
     Fetch Event
  ------------------------------*/
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);
        setEventData(res?.data?.data?.["Event Details"]?.[0] || null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  /* -----------------------------
     Fetch API Templates
  ------------------------------*/
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await GettemplatebyuserId();

        const templates =
          res?.data?.data
            ?.filter((t) => t.isActive && !t.isDelete)
            ?.map(mapThemeToTemplate) || [];

        setApiTemplates(templates);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [activeLang]);

  /* -----------------------------
     Handlers
  ------------------------------*/
  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleGenerateReport = (sectionId, template) => {
    setSelectedCard(template.id);

    console.log("GENERATE REPORT", {
      sectionId,
      templateId: template.id,
      eventId,
      functionId: sectionFunctions[sectionId],
    });

    // 🔥 SECOND API CALL HERE
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
            className="w-10 h-10 bg-gray-100 rounded-lg"
          >
            <i className="ki-filled ki-left" />
          </button>
          <h1 className="text-2xl font-bold">
            <FormattedMessage
              id="REPORTS.SELECT_REPORT_TYPE"
              defaultMessage="Select Report Type"
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
              <div className="bg-gray-200 rounded-xl p-6 mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <InfoItem label="Event Id" value={eventData.eventNo} />
                <InfoItem
                  label="Party"
                  value={getLangValue(eventData.party, "name")}
                />
                <InfoItem
                  label="Event"
                  value={getLangValue(eventData.eventType, "name")}
                />
                <InfoItem
                  label="Date & Time"
                  value={eventData.eventStartDateTime}
                />
                <InfoItem
                  label="Venue"
                  value={getLangValue(eventData.venue, "name")}
                />
              </div>
            )}

            {/* Sections */}
            {reportSections.map((section) => (
              <div
                key={section.id}
                className="bg-white border rounded-xl mb-4"
              >
                <div
                  onClick={() => toggleSection(section.id)}
                  className="p-6 flex justify-between cursor-pointer"
                >
                  <h3 className="font-bold">{section.name}</h3>
                  <i
                    className={`ki-filled ${
                      expandedSection === section.id
                        ? "ki-up"
                        : "ki-down"
                    }`}
                  />
                </div>

                {expandedSection === section.id && (
                  <div className="p-6 bg-gray-50 space-y-3">
                    {apiTemplates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className={`border p-4 rounded-lg flex justify-between ${
                          selectedCard === tpl.id
                            ? "border-primary"
                            : ""
                        }`}
                      >
                        <div>
                          <h4 className="font-semibold">{tpl.name}</h4>
                          <p className="text-sm text-gray-500">
                            {tpl.description}
                          </p>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleGenerateReport(section.id, tpl)
                          }
                        >
                          Generate
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </Container>
    </Fragment>
  );
}

/* -----------------------------
   Info Item
------------------------------*/
const InfoItem = ({ label, value }) => (
  <div>
    <div className="font-bold text-sm">{label}</div>
    <div className="text-sm text-gray-600">{value || "-"}</div>
  </div>
);
