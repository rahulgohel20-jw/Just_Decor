import { useEffect, useState } from "react";
import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import VenueDropdown from "../../../components/dropdowns/VenueDropdown";
import AddVenueType from "../../../partials/modals/add-venue-type/AddVenueType";
import EventStatusDropdown from "@/components/dropdowns/EventStatusDropdown";
import SpeechToText from "@/components/form-inputs/SpeechToText";
import useStyles from "./style";
import AddEventType from "@/partials/modals/add-event-type/AddEventType";
import {
  GetEventType,
  GetVenueType,
  TranslateHindi,
  TranslateGujarati,
} from "@/services/apiServices";
import { FormattedMessage } from "react-intl";
import { useLanguage } from "@/i18n";

const EventBasicInfoStep = ({
  formData,
  setFormData,
  onInputChange,
  errors,
}) => {
  const classes = useStyles();
  const [eventTypes, setEventTypes] = useState([]);

  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [venueList, setVenueList] = useState([]);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [translatedTitle, setTranslatedTitle] = useState("");
  let Id = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    fetchVenueTypes();
    Fetcheventtype();
  }, []);

  const Fetcheventtype = async () => {
    try {
      const res = await GetEventType(Id);
      const items = res.data.data["EventTypes Details"] || [];

      const translated = await Promise.all(
        items.map(async (event, index) => ({
          sr_no: index + 1,
          value: event.id,
          label: await translateText(event.nameEnglish || "-"),
        }))
      );

      setEventTypes(translated);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVenueTypes = () => {
    GetVenueType(Id)
      .then((res) => {
        const venueArray = res?.data?.data?.["Venue Details"] || [];

        const venues = venueArray.map((item, index) => ({
          sr_no: index + 1,
          value: item.id,
          label: item.nameEnglish || "-",
        }));

        setVenueList(venues);
      })
      .catch(console.error);
  };

  // Helper function to handle form data changes
  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler specifically for dropdowns that need synthetic event
  const handleDropdownChange = (fieldName, value) => {
    const syntheticEvent = {
      target: {
        name: fieldName,
        value: value,
      },
    };
    onInputChange(syntheticEvent, fieldName);
  };

  const handleOpenEventTypeModal = () => {
    setSelectedEvent(null);
    setIsEventTypeModalOpen(true);
  };

  const { isRTL } = useLanguage();
  const getSelectedLanguage = () => {
    try {
      const config = JSON.parse(localStorage.getItem("i18nConfig"));
      return config?.locale || "en";
    } catch {
      return "en";
    }
  };

  const translateText = async (text) => {
    const lang = getSelectedLanguage();
    if (!text || lang === "en") return text;

    try {
      let res;
      if (lang === "hi") {
        res = await TranslateHindi({ text });
      } else if (lang === "gu") {
        res = await TranslateGujarati({ text });
      }

      return (
        res?.data?.translatedText ||
        res?.data?.text ||
        res?.translatedText ||
        text
      );
    } catch {
      return text;
    }
  };

  return (
    <Form>
      <div className={`flex flex-col gap-y-2 gap-x-4 ${classes.basicInfo}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-5">
          {/* Inquiry Date */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_INQUIRY_DATE"
                defaultMessage="Inquiry Date"
              />
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <DatePicker
              disabled
              className="input"
              format="DD/MM/YYYY"
              value={
                formData.inquiryDate
                  ? dayjs(formData.inquiryDate, "DD/MM/YYYY")
                  : null
              }
              onChange={(date) =>
                handleFormDataChange(
                  "inquiryDate",
                  date ? date.format("DD/MM/YYYY") : ""
                )
              }
            />
            {errors.inquiryDate && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.inquiryDate}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_STATUS_LABEL"
                defaultMessage="Status"
              />
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <EventStatusDropdown
              value={formData.status}
              className="w-full"
              onChange={onInputChange}
            />
            {errors.status && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.status}
              </span>
            )}
          </div>

          {/* Event Type */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_EVENT_TYPE_LABEL"
                defaultMessage="Event Type"
              />
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <div className="sg__inner flex items-center gap-1 relative">
              <UserDropdown
                value={formData.eventTypeId}
                onChange={onInputChange}
                options={eventTypes}
                name="eventTypeId"
              />
              <button
                type="button"
                onClick={handleOpenEventTypeModal}
                title="Add Event Type"
                className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>
            {errors.eventTypeId && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.eventTypeId}
              </span>
            )}
          </div>

          {/* Start Event Date */}
          <div className="flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_START_EVENT_DATE_LABEL"
                defaultMessage="Start Event Date"
              />
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <DatePicker
              className="input"
              showTime={{
                use12Hours: true,
                format: "hh:mm A",
                minuteStep: 30,
              }}
              format="DD/MM/YYYY hh:mm A"
              value={
                formData.eventStartDateTime
                  ? dayjs(formData.eventStartDateTime, "DD/MM/YYYY hh:mm A")
                  : null
              }
              onChange={(date) =>
                handleFormDataChange(
                  "eventStartDateTime",
                  date ? date.format("DD/MM/YYYY hh:mm A") : ""
                )
              }
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
            />
            {errors.eventStartDateTime && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.eventStartDateTime}
              </span>
            )}
          </div>

          {/* End Event Date */}
          <div className="flex flex-col ">
            <label className="form-label">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_END_EVENT_DATE_LABEL"
                defaultMessage="End Event Date"
              />
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <DatePicker
              className="input"
              showTime={{
                use12Hours: true,
                format: "hh:mm A",
                minuteStep: 30,
              }}
              format="DD/MM/YYYY hh:mm A"
              value={
                formData.eventEndDateTime
                  ? dayjs(formData.eventEndDateTime, "DD/MM/YYYY hh:mm A")
                  : formData.eventStartDateTime
                    ? dayjs(formData.eventStartDateTime, "DD/MM/YYYY hh:mm A")
                    : null
              }
              onChange={(date) =>
                handleFormDataChange(
                  "eventEndDateTime",
                  date ? date.format("DD/MM/YYYY hh:mm A") : ""
                )
              }
              disabledDate={(current) => {
                // End date cannot be before start date
                return current && formData.eventStartDateTime
                  ? current <
                      dayjs(formData.eventStartDateTime, "DD/MM/YYYY hh:mm A")
                  : current && current < dayjs().startOf("day");
              }}
            />
            {errors.eventEndDateTime && (
              <span className="text-red-600 font-normal text-sm mt-0.5">
                {errors.eventEndDateTime}
              </span>
            )}
          </div>

          {/* Venue */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_VENUE"
                defaultMessage="Venue"
              />
              <span className="mandatory text-red-500">*</span>
            </label>

            <div className="sg__inner flex items-center gap-1">
              <VenueDropdown
                value={formData.venueId}
                onChange={onInputChange}
                options={venueList}
                name="venueId"
              />

              <button
                type="button"
                onClick={() => setIsVenueModalOpen(true)}
                title="Add Venue"
                className="btn btn-primary rounded-full p-0 w-8 h-8 flex items-center justify-center"
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>

            {errors.venueId && (
              <span className="text-red-600 text-sm">{errors.venueId}</span>
            )}
          </div>

          {/* Manager */}
        </div>

        <AddEventType
          isModalOpen={isEventTypeModalOpen}
          setIsModalOpen={setIsEventTypeModalOpen}
          refreshData={Fetcheventtype}
          selectedEvent={selectedEvent}
        />
        <AddVenueType
          isModalOpen={isVenueModalOpen}
          setIsModalOpen={setIsVenueModalOpen}
          refreshData={fetchVenueTypes}
          selectedEvent={selectedVenue}
        />
      </div>
    </Form>
  );
};

export default EventBasicInfoStep;
