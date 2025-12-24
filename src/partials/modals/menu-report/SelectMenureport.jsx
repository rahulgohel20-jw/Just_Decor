import React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, Link, useParams } from "react-router-dom";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";
import { GetEventMasterById } from "@/services/apiServices";

export default function SelectMenureport({
  eventId,
  isSelectMenureport,
  setIsSelectMenuReport,
  onConfirm,
  activeFunctionName,
}) {
  const navigate = useNavigate();

  const params = useParams();
  const finalEventId = eventId || params?.eventId;
  const [selectedCard, setSelectedCard] = useState(null);

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const tabs = [
    {
      key: "exclusive",
      label: "Exclusive Reports",
      img: "/media/icons/Exclusive-Reports.png",
    },
    {
      key: "simple",
      label: "Simple Reports",
      img: "/media/icons/simple.png",
    },
    {
      key: "backoffice",
      label: "Back-Office Reports",
      img: "/media/icons/backoffice.png",
    },
  ];

  const cardsByTab = {
    exclusive: [
      {
        key: "detailedAnalysis",
        label: "Detailed Analysis",
        description: "In-depth insights into event performance.",
        icon: "/media/icons/analysis.svg",
        color: "from-blue-500 to-blue-700",
        iconBg: "bg-blue-100",
      },
    ],
    simple: [
      {
        key: "customReport",
        label: "Customizable Report",
        description: "Tailor the report to your specific needs.",
        icon: "/media/icons/report.svg",
        color: "from-indigo-500 to-indigo-700",
        iconBg: "bg-indigo-100",
      },
    ],
    backoffice: [
      {
        key: "advancedMetrics",
        label: "Advanced Metrics",
        description: "Track key performance indicators.",
        icon: "/media/icons/metrics.svg",
        color: "from-orange-500 to-orange-700",
        iconBg: "bg-orange-100",
      },
    ],
  };

  const [activeTab, setActiveTab] = useState("exclusive");

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

    fetchEventData();
  }, [finalEventId]);

  const cards = [
    {
      key: "menuAllocation",
      label: "Exclusive Report",
      description: "Detailed allocation with full breakdown",
      icon: "media/icons/menuselect1.png",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      key: "rawMaterial",
      label: "Simple Report",
      description: "Quick overview of raw materials",
      icon: "media/icons/menuselect2.png",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      key: "menuReport",
      label: "Menu Report",
      description: "Complete menu details and analysis",
      icon: "media/icons/menuselect3.png",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <CustomModal
      open={isSelectMenureport}
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
      width={1200}
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
              value={eventData?.eventType?.nameEnglish || "-"}
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

        {/* Report Cards */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cardsByTab[activeTab]?.map((item) => {
            const isActive = selectedCard === item.key;
            return (
              <div
                key={item.key}
                onClick={() => {
                  setSelectedCard(item.key);
                  onConfirm?.(item.key);
                }}
                className={`
          relative bg-white rounded-2xl cursor-pointer
          border-2 ${isActive ? "border-blue-500" : "border-gray-200"}
          shadow-md hover:shadow-lg transition-all duration-300
        `}
              >
                <div className="p-6 flex flex-col items-left">
                  {/* Icon */}
                  <div className="w-16 h-16  flex items-center justify-center mb-4">
                    <img
                      src={toAbsoluteUrl("/media/icons/selectmenu.png")}
                      className="w-15 h-15"
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-lg font-bold mb-2 ${isActive ? "text-blue-600" : "text-gray-800"}`}
                  >
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 text-left">
                    {item.description}
                  </p>
          {/* Centered Button */}
          <div className="flex justify-center mt-6">
            <button
              className="btn btn-primary px-6 py-2 rounded-lg"
              onClick={() => {
                console.log("Generate Report clicked");
                // Your click handler here
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

        {/* Help Text */}
       
      </div>
    </CustomModal>
  );
}

// Info Item Component

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
