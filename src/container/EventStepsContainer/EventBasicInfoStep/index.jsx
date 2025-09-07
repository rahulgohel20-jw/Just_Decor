import { useEffect, useState } from "react";
import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import ManagerDropdown from "@/components/dropdowns/ManagerDropdown";
import EventStatusDropdown from "@/components/dropdowns/EventStatusDropdown";
import SpeechToText from "@/components/form-inputs/SpeechToText";
import useStyles from "./style";
import AddMember from "@/partials/modals/add-member/AddMember";
import AddEventType from "@/partials/modals/add-event-type/AddEventType";
import { GetEventType, Fetchmanager } from "@/services/apiServices";

const EventBasicInfoStep = ({
  formData,
  setFormData,
  onInputChange,
  errors,
}) => {
  const classes = useStyles();
  const [eventTypes, setEventTypes] = useState([]);
  const [manager, setManager] = useState([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;

  useEffect(() => {
    Fetcheventtype();
    FetchManager();
  }, []);

  const Fetcheventtype = () => {
    GetEventType(Id)
      .then((res) => {
        const eventtype = res.data.data["EventTypes Details"].map(
          (event, index) => ({
            sr_no: index + 1,
            value: event.id,
            label: event.nameEnglish || "-",
          })
        );
        setEventTypes(eventtype);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const FetchManager = () => {
    Fetchmanager(Id).then((res) => {
      const manager = res.data.data["userDetails"].map((man, index) => ({
        sr_no: index + 1,
        value: man.id,
        label: man.firstName || "-",
      }));
      setManager(manager);
    });
  };

  // Helper function to handle form data changes
  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Form>
      <div className={`flex flex-col gap-y-2 gap-x-4 ${classes.basicInfo}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-5">
          {/* Inquiry Date */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              Inquiry Date
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <DatePicker
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
            <label className="form-label">Status</label>
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
              Event Type
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
                onClick={() => setIsEventTypeModalOpen(true)}
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
              Start Event Date
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <DatePicker
              className="input"
              showTime={{ use12Hours: true, format: "hh:mm A" }}
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
          <div className="flex flex-col">
            <label className="form-label">
              End Event Date
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <DatePicker
              className="input"
              showTime={{ use12Hours: true, format: "hh:mm A" }}
              format="DD/MM/YYYY hh:mm A"
              value={
                formData.eventEndDateTime
                  ? dayjs(formData.eventEndDateTime, "DD/MM/YYYY hh:mm A")
                  : null
              }
              onChange={(date) =>
                handleFormDataChange(
                  "eventEndDateTime",
                  date ? date.format("DD/MM/YYYY hh:mm A") : ""
                )
              }
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
            />
            {errors.eventEndDateTime && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.eventEndDateTime}
              </span>
            )}
          </div>

          {/* Venue */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              Venue
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <SpeechToText
              type="text"
              name="venue"
              placeholder="Venue"
              value={formData.venue}
              onChange={onInputChange}
            />
            {errors.venue && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.venue}
              </span>
            )}
          </div>

          
          {/* Manager */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              Manager
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <div className="sg__inner flex items-center gap-1 relative">
              <ManagerDropdown
                value={formData.managerId}
                onChange={onInputChange}
                options={manager}
                name="managerId"
              />
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(true)}
                title="Add Manager"
                className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>
            {errors.managerId && (
              <span className="text-red-600 font-normal text-sm mt-0.50">
                {errors.managerId}
              </span>
            )}
          </div>
        </div>

        {/* Modals */}
        <AddMember
          isModalOpen={isMemberModalOpen}
          setIsModalOpen={setIsMemberModalOpen}
          onSuccess={FetchManager}
        />
        <AddEventType
          isModalOpen={isEventTypeModalOpen}
          setIsModalOpen={setIsEventTypeModalOpen}
          onSuccess={Fetcheventtype}
        />
      </div>
    </Form>
  );
};

export default EventBasicInfoStep;
