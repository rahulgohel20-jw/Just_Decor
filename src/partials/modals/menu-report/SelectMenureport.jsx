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
  // ✅ triggers the next modal (MenuReport)
}) {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // All 3 cards configuration
  const cards = [
    {
      key: "menuAllocation",
      label: (
        <FormattedMessage
          id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_MENU_ALLOCATION"
          defaultMessage="Exclusive Report "
        />
      ),
      icon: "/media/eventviewicon/menuallocation.png",
    },
    {
      key: "rawMaterial",
      label: (
        <FormattedMessage
          id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_RAW_MATERIAL_ALLOCATION"
          defaultMessage="Simple Report"
        />
      ),
      icon: "/media/eventviewicon/rawmaterial.png",
    },
    {
      key: "menuReport",
      label: (
        <FormattedMessage
          id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_MENU_REPORT"
          defaultMessage="Menu Report"
        />
      ),
      icon: "/media/eventviewicon/menureport.png",
    },
  ];

  return (
    <CustomModal
      open={isSelectMenureport}
      onClose={() => setIsSelectMenuReport(false)}
      footer={null}
      title={
        <FormattedMessage
          id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_TITLE"
          defaultMessage=" Select Report"
        />
      }
      width={1100}
    >
      {/* Main Layout */}
      <div className="p-2 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar */}

        <div className="col-span-1 flex flex-col gap-6 mb-1">
          <div className="bg-white p-4 rounded-xl shadow">
            {/* Event Name */}
            <p className="text-gray-600">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_NAME"
                defaultMessage="Party Details"
              />
            </p>
            <h3 className="font-semibold text-base mb-2">
              {eventData?.party?.nameEnglish || "-"}
            </h3>

            {/* Mobile */}
            <p className="text-gray-600">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_MOBILE"
                defaultMessage=" Event Name "
              />
            </p>
            <h3 className="font-semibold text-base mb-2">
              {eventData?.eventType?.nameEnglish || "-"}
            </h3>

            <p className="text-gray-600">
              <FormattedMessage
                id="USER.Event.report."
                defaultMessage=" Function "
              />
            </p>
            <h3 className="font-semibold text-base mb-2">
              {eventData?.eventType?.nameEnglish}
            </h3>

            {/* Date */}
            <p className="text-gray-600">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_DATE"
                defaultMessage="Date"
              />
            </p>
            <h3 className="font-semibold text-base mb-2">
              {eventData?.eventStartDateTime || "-"}
            </h3>

            {/* Venue */}
            <p className="text-gray-600">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_VENUE"
                defaultMessage="Venue"
              />
            </p>
            <h3 className="font-semibold text-base mb-2">
              {eventData?.venue || "-"}
            </h3>
          </div>
        </div>

        {/* Right Grid Section */}
        <div className="col-span-3 grid grid-cols-3 gap-4">
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
                } else {
                  // Optional: handle other card clicks here later
                  console.log("Clicked:", item.key);
                }
              }}
              className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:bg-gray-50 transition"
            >
              <img
                src={toAbsoluteUrl(item.icon)}
                alt="icon"
                className="w-10 h-10 mb-2"
              />
              <p className="font-medium text-gray-800 text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </CustomModal>
  );
}
