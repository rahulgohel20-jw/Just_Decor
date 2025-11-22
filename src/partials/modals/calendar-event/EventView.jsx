import { useState, useEffect } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Link } from "react-router-dom";
import {
  DeleteEventMaster,
  StatusChange,
  TranslateHindi,
  TranslateGujarati,
} from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import { FormattedMessage } from "react-intl";
import { useLanguage } from "@/i18n";

const EventViewModal = ({
  isModalOpen,
  setIsModalOpen,
  eventData,
  onEventsUpdated,
}) => {
  const navigate = useNavigate();

  const eventDataAll = eventData?.event?._def?.extendedProps || {};
  const eventTypeId = eventDataAll?.eventTypeId ?? null;

  const safeEventId =
    eventDataAll?.eventid ?? eventDataAll?.id ?? eventData?.event?.id ?? null;
  const [statusId, setStatusId] = useState(eventDataAll?.statusCode ?? "0");

  const [isMenuReport, setIsMenuReport] = useState(false);
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [translatedTitle, setTranslatedTitle] = useState("");

  useEffect(() => {
    const translateText = async (text) => {
      if (!text) {
        return "";
      }

      // Parse the language config JSON
      const i18nConfig = localStorage.getItem("i18nConfig");
      let selectedLang = "en";

      if (i18nConfig) {
        try {
          const parsedConfig = JSON.parse(i18nConfig);
          selectedLang = parsedConfig.code || "en";
        } catch (e) {
          selectedLang = "en";
        }
      }

      if (selectedLang === "en") {
        return text;
      }

      try {
        switch (selectedLang) {
          case "hi":
            const resHindi = await TranslateHindi({ text });

            const translatedText =
              resHindi?.data?.text ||
              resHindi?.data?.translatedText ||
              resHindi?.translatedText ||
              resHindi?.data?.translated_text ||
              resHindi?.translated_text ||
              text;

            return translatedText;

          case "gu":
            const resGujarati = await TranslateGujarati({ text });

            const translatedTextGu =
              resGujarati?.data?.text || // Same structure as Hindi API
              resGujarati?.data?.translatedText ||
              resGujarati?.translatedText ||
              resGujarati?.data?.translated_text ||
              resGujarati?.translated_text ||
              text;

            return translatedTextGu;

          default:
            return text;
        }
      } catch (error) {
        return text;
      }
    };

    const doTranslate = async () => {
      const title = eventData?.event?._def?.title || "";

      if (!title) {
        console.log("⚠️ No title found, setting empty string");
        setTranslatedTitle("");
        return;
      }

      const result = await translateText(title);

      setTranslatedTitle(result);
    };

    const shouldTranslate = isModalOpen && eventData?.event?._def?.title;

    if (shouldTranslate) {
      doTranslate();
    } else {
      console.log("❌ Conditions not met, translation skipped");
    }
  }, [eventData, isModalOpen]);

  const handleModalClose = () => setIsModalOpen(false);

  const openMenuReport = (eventId) => {
    if (!eventId) {
      errorMsgPopup("Event ID missing.");
      return;
    }
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  };

  const handleStatusChange = () => {
    if (!safeEventId) {
      errorMsgPopup("Event ID missing.");
      return;
    }

    Swal.fire({
      title: "Confirm Status Change",
      text: "Are you sure you want to change the status?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        StatusChange(safeEventId, statusId)
          .then((res) => {
            successMsgPopup("Status changed successfully!");
            onEventsUpdated?.();
          })
          .catch((error) => {
            console.error("Error changing status:", error);
            errorMsgPopup(error?.data?.msg || "Failed to change status");
          });
      }
    });
  };

  const DeleteEvent = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const eventId = safeEventId;
        if (!eventId) {
          errorMsgPopup("Event ID missing.");
          return;
        }
        DeleteEventMaster(eventId)
          .then((response) => {
            if (
              response &&
              (response.success || response.data.success === true)
            ) {
              setIsModalOpen(false);
              onEventsUpdated?.();
              Swal.fire({
                title: "Removed!",
                text: "Event has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((error) => {
            error?.data?.msg && errorMsgPopup(error.data.msg);
            console.error("Error deleting event:", error);
          });
      }
    });
  };

  const { isRTL } = useLanguage();

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title={
          <FormattedMessage
            id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_TITLE"
            defaultMessage="Event View"
          />
        }
        width={1100}
      >
        <div className="p-2 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 flex flex-col gap-6 mb-1">
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-600">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_NAME"
                  defaultMessage="Event Details"
                />
              </p>
              <h3 className="font-semibold text-base mb-2">
                {translatedTitle ||
                  eventData?.event?._def?.title ||
                  "Loading..."}
              </h3>
              <p className="text-xs text-gray-400"></p>

              <p className="text-gray-600">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_MOBILE"
                  defaultMessage="Mobile No."
                />
              </p>
              <h3 className="font-semibold text-base mb-2">
                {eventDataAll?.mobile}
              </h3>

              <p className="text-gray-600">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_DATE"
                  defaultMessage="Date"
                />
              </p>
              <h3 className="font-semibold text-base mb-2">
                {eventData?.event?.start?.toLocaleDateString?.("en-CA")}
              </h3>

              <p className="text-gray-600">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_VENUE"
                  defaultMessage="Venue"
                />
              </p>
              <h3 className="font-semibold text-base mb-2">
                {translatedTitle ||
                  eventData?.event?._def?.address ||
                  "Loading..."}
              </h3>
            </div>

            <div className="bg-white p-4 rounded-xl shadow ">
              <h2 className="mb-2 text-gray-600">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_STATUS"
                  defaultMessage="Status"
                />
              </h2>
              <select
                className="w-full border rounded px-2 py-1 mb-3"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
              >
                <option value="0">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_INQUIRY"
                    defaultMessage="Inquiry"
                  />
                </option>
                <option value="1">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CONFIRM"
                    defaultMessage="Confirm"
                  />
                </option>
                <option value="2">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_FILTER_CANCEL"
                    defaultMessage="Cancel"
                  />
                </option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={handleStatusChange}
                >
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_SAVE_BUTTON"
                    defaultMessage="Save"
                  />
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => setStatusId(eventDataAll?.statusId ?? "0")}
                >
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_CANCEL_BUTTON"
                    defaultMessage="Cancel"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-3 grid grid-cols-3 gap-4">
            {[
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_MENU_PREPARATION"
                    defaultMessage="Menu Preparation"
                  />
                ),
                icon: "/media/eventviewicon/menuprep.png",
                onClick: () => navigate(`/menu-preparation/${safeEventId}`),
              },
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_MENU_ALLOCATION"
                    defaultMessage="Menu Allocation"
                  />
                ),
                icon: "/media/eventviewicon/menuallocation.png",
                onClick: () => navigate(`/menu-allocation/${safeEventId}`),
              },
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_RAW_MATERIAL_ALLOCATION"
                    defaultMessage="Raw Material Allocation"
                  />
                ),
                icon: "/media/eventviewicon/rawmaterial.png",
                onClick: () =>
                  navigate("/raw-material-allocation", {
                    state: {
                      eventId: safeEventId,
                      eventTypeId: eventTypeId,
                    },
                  }),
              },
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_LABOUR_OTHER_MANAGEMENT"
                    defaultMessage="Labour / Other Management"
                  />
                ),
                icon: "/media/eventviewicon/labour.png",
                onClick: () =>
                  navigate(`/labour-and-other-management/${safeEventId}`),
              },
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_DISH_COSTING"
                    defaultMessage="Dish Costing"
                  />
                ),
                icon: "/media/eventviewicon/dishcost.png",
                onClick: () => navigate(`/dish-costing/${safeEventId}`),
              },
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_MENU_REPORT"
                    defaultMessage="Menu Report"
                  />
                ),
                icon: "/media/eventviewicon/menureport.png",
                onClick: () => openMenuReport(safeEventId),
              },
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_QUOTATION"
                    defaultMessage="Quotation"
                  />
                ),
                icon: "/media/eventviewicon/quotation.png",
                onClick: () => navigate(`/quotation/${safeEventId}`),
              },
              {
                label: (
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_INVOICE"
                    defaultMessage="Invoice"
                  />
                ),
                icon: "/media/eventviewicon/invoice.png",
                onClick: () =>
                  navigate("/add-invoice", {
                    state: {
                      eventId: safeEventId,
                      eventTypeId: eventTypeId,
                    },
                  }),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={item.onClick}
                className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
              >
                <div className="text-blue-600 text-3xl mb-2">
                  <img
                    src={toAbsoluteUrl(item.icon)}
                    alt={item.label}
                    className="w-10 h-10"
                  />
                </div>
                <p className="font-medium text-gray-800 text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-6 mt-3">
          <Link to={`/edit-event/${safeEventId}`}>
            <button className="bg-primary text-white w-[300px] h-12 rounded-md font-medium">
              <i className="ki-filled ki-notepad-edit me-1"></i>
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_EDIT_EVENT_BUTTON"
                defaultMessage="Edit Event"
              />
            </button>
          </Link>
          <button
            className="bg-success text-white w-[300px] h-12 rounded-md font-medium"
            onClick={() => navigate(`/edit-event/${safeEventId}/copy`)}
          >
            <i className="ki-filled ki-copy me-1"></i>{" "}
            <FormattedMessage
              id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_COPY_EVENT_BUTTON"
              defaultMessage="Copy Event"
            />
          </button>
          <button
            className="bg-danger text-white w-[300px] h-12 rounded-md font-medium"
            onClick={DeleteEvent}
          >
            <i className="ki-filled ki-trash me-1"></i>{" "}
            <FormattedMessage
              id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_DELETE_EVENT_BUTTON"
              defaultMessage="Delete Event"
            />
          </button>
        </div>

        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={menuReportEventId}
        />
      </CustomModal>
    )
  );
};

export default EventViewModal;
