import { useEffect, useState } from "react";
import { Form } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    fetchVenueTypes(false);
    Fetcheventtype(false);
  }, []);

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

  const Fetcheventtype = async (autoSelectLatest = false) => {
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

      // Auto-select the latest event type if flag is true
      if (autoSelectLatest && translated.length > 0) {
        const latestEventType = translated[translated.length - 1];

        setFormData((prev) => ({
          ...prev,
          eventTypeId: latestEventType.value,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVenueTypes = async (autoSelectLatest = false) => {
    try {
      const res = await GetVenueType(Id);
      const venueArray = res?.data?.data?.["Venue Details"] || [];

      const venues = venueArray.map((item, index) => ({
        sr_no: index + 1,
        value: item.id,
        label: item.nameEnglish || "-",
      }));

      setVenueList(venues);

      // Auto-select the latest venue if flag is true
      if (autoSelectLatest && venues.length > 0) {
        const latestVenue = venues[venues.length - 1];

        setFormData((prev) => ({
          ...prev,
          venueId: latestVenue.value,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  // Helper to parse date string to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const parsed = dayjs(dateStr, "DD/MM/YYYY hh:mm A", true);
      if (!parsed.isValid()) {
        // Try alternative format without time
        const altParsed = dayjs(dateStr, "DD/MM/YYYY", true);
        return altParsed.isValid() ? altParsed.toDate() : null;
      }
      return parsed.toDate();
    } catch (error) {
      console.error("Date parse error:", error);
      return null;
    }
  };

  // Helper to format Date object to string
  const formatDate = (date) => {
    if (!date) return "";
    try {
      const formatted = dayjs(date);
      return formatted.isValid() ? formatted.format("DD/MM/YYYY hh:mm A") : "";
    } catch (error) {
      console.error("Date format error:", error);
      return "";
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
              className="input w-full"
              dateFormat="dd/MM/yyyy"
              selected={parseDate(formData.inquiryDate)}
              onChange={(date) => {
                if (date && dayjs(date).isValid()) {
                  handleFormDataChange(
                    "inquiryDate",
                    dayjs(date).format("DD/MM/YYYY")
                  );
                } else {
                  handleFormDataChange("inquiryDate", "");
                }
              }}
              placeholderText="DD/MM/YYYY"
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
              className="input w-full"
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={30}
              dateFormat="dd/MM/yyyy hh:mm aa"
              selected={parseDate(formData.eventStartDateTime)}
              onChange={(date) => {
                if (date) {
                  handleFormDataChange("eventStartDateTime", formatDate(date));
                } else {
                  handleFormDataChange("eventStartDateTime", "");
                }
              }}
              minDate={new Date()}
              timeCaption="Time"
              placeholderText="DD/MM/YYYY hh:mm AM/PM"
            />
            {errors.eventStartDateTime && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.eventStartDateTime}
              </span>
            )}
          </div>

          {/* End Event Date */}
          <div className="flex flex-col">
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
              className="input w-full"
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={30}
              dateFormat="dd/MM/yyyy hh:mm aa"
              selected={
                formData.eventEndDateTime
                  ? parseDate(formData.eventEndDateTime)
                  : formData.eventStartDateTime
                    ? parseDate(formData.eventStartDateTime)
                    : null
              }
              onChange={(date) => {
                if (date) {
                  handleFormDataChange("eventEndDateTime", formatDate(date));
                } else {
                  handleFormDataChange("eventEndDateTime", "");
                }
              }}
              minDate={
                formData.eventStartDateTime
                  ? parseDate(formData.eventStartDateTime) || new Date()
                  : new Date()
              }
              timeCaption="Time"
              placeholderText="DD/MM/YYYY hh:mm AM/PM"
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
