import React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, Link, useParams } from "react-router-dom";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";
import { GetEventMasterById } from "@/services/apiServices";

export default function SelectMenureport({
  isSelectMenureport,
  setIsSelectMenuReport,
  onConfirm,
  activeFunctionName,
}) {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);

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
  }, [eventId]);

  const cards = [
    {
      key: "menuAllocation",
      label: "Exclusive Report",
      description: "Detailed allocation with full breakdown",
      icon: "/media/eventviewicon/menuallocation.png",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      key: "rawMaterial",
      label: "Simple Report",
      description: "Quick overview of raw materials",
      icon: "/media/eventviewicon/rawmaterial.png",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      key: "menuReport",
      label: "Menu Report",
      description: "Complete menu details and analysis",
      icon: "/media/eventviewicon/menureport.png",
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
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <InfoItem
              icon="ki-user"
              label="Party Name"
              value={eventData?.party?.nameEnglish || "-"}
            />
            <InfoItem
              icon="ki-calendar"
              label="Event Name"
              value={eventData?.eventType?.nameEnglish || "-"}
            />
            <InfoItem
              icon="ki-element-11"
              label="Function"
              value={eventData?.eventType?.nameEnglish || "-"}
            />
            <InfoItem
              icon="ki-time"
              label="Date & Time"
              value={eventData?.eventStartDateTime || "-"}
            />
            <InfoItem
              icon="ki-geolocation"
              label="Venue"
              value={eventData?.venue?.nameEnglish || "-"}
            />
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                if (
                  item.key === "menuReport" ||
                  item.key === "menuAllocation" ||
                  item.key === "rawMaterial"
                ) {
                  setIsSelectMenuReport(false);
                  if (onConfirm) onConfirm(item.key);
                }
              }}
              onMouseEnter={() => setHoveredCard(item.key)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer
                transition-all duration-300 transform
                ${hoveredCard === item.key ? "scale-105 shadow-2xl" : "hover:shadow-xl"}
              `}
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>

              <div className="p-6">
                {/* Icon Section */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`
                    w-20 h-20 ${item.iconBg} rounded-full flex items-center justify-center
                    transition-transform duration-300
                    ${hoveredCard === item.key ? "scale-110" : ""}
                  `}
                  >
                    <img
                      src={toAbsoluteUrl(item.icon)}
                      alt={item.label}
                      className="w-10 h-10"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                  {item.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 text-center mb-4">
                  {item.description}
                </p>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    className={`
                    px-6 py-2 rounded-lg font-medium text-white
                    bg-gradient-to-r ${item.color}
                    transition-all duration-300
                    ${hoveredCard === item.key ? "px-8" : ""}
                  `}
                  >
                    <span className="flex items-center gap-2">
                      Generate
                      <i className="ki-filled ki-arrow-right"></i>
                    </span>
                  </button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              {hoveredCard === item.key && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <i className="ki-filled ki-information-2 text-primary"></i>
          <span>Select a report type to view detailed information</span>
        </div>
      </div>
    </CustomModal>
  );
}

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
      <i className={`ki-filled ${icon} text-primary`}></i>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 truncate" title={value}>
        {value}
      </p>
    </div>
  </div>
);
