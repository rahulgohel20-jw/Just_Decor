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

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);

  return (
    <Form>
      <div className={`flex flex-col gap-y-2 gap-x-4 ${classes.basicInfo}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-5">
          <div className="select__grp flex flex-col">
            <label className="form-label">Inquiry Date</label>
            <DatePicker
              className="input"
              format="DD/MM/YYYY"
              value={
                formData.inquiryDate
                  ? dayjs(formData.inquiryDate, "DD/MM/YYYY")
                  : null
              }
              onChange={(date) =>
                setFormData({
                  ...formData,
                  inquiryDate: date ? date.format("DD/MM/YYYY") : "",
                })
              }
            />
            {errors.inquiryDate && (
              <span className="text-red-500">{errors.inquiryDate}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="form-label">Status</label>
            <EventStatusDropdown
              value={formData.status}
              className="w-full"
              onChange={onInputChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="form-label">Start Event Date</label>
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
                setFormData({
                  ...formData,
                  eventStartDateTime: date
                    ? date.format("DD/MM/YYYY hh:mm A")
                    : "",
                })
              }
            />
            {errors.event_date && (
              <span className="text-red-500">{errors.eventStartDateTime}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="form-label">End Event Date</label>
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
                setFormData({
                  ...formData,
                  eventEndDateTime: date
                    ? date.format("DD/MM/YYYY hh:mm A")
                    : "",
                })
              }
            />
            {errors.event_date && (
              <span className="text-red-500">{errors.eventEndDateTime}</span>
            )}
          </div>
          <div className="select__grp flex flex-col">
            <label className="form-label">
              Venue
              <span className="mandatory text-base text-red-500 font-medium">
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
              <span className="text-red-500">{errors.venue}</span>
            )}
          </div>

          {/* Event Type */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              Event Type
              <span className="mandatory text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <div className="sg__inner flex items-center gap-1 relative">
              <UserDropdown
                value={formData.eventTypeId}
                onChange={onInputChange}
                options={eventTypes}
              />
              <button
                type="button"
                onClick={() => setIsEventTypeModalOpen(true)}
                title="Add"
                className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>
            {errors.eventTypeId && (
              <span className="text-red-500">{errors.eventTypeId}</span>
            )}
          </div>
          {/* Manager */}
          <div className="select__grp flex flex-col">
            <label className="form-label">
              Manager
              <span className="mandatory text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <div className="sg__inner flex items-center gap-1 relative">
              <ManagerDropdown
                value={formData.managerId}
                onChange={onInputChange}
                options={manager}
              />
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(true)}
                title="Add"
                className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>
            {errors.managerId && (
              <span className="text-red-500">{errors.managerId}</span>
            )}
          </div>
        </div>

        {/* Modals */}
        <AddMember
          isModalOpen={isMemberModalOpen}
          setIsModalOpen={setIsMemberModalOpen}
        />
        <AddEventType
          isModalOpen={isEventTypeModalOpen}
          setIsModalOpen={setIsEventTypeModalOpen}
        />
      </div>
    </Form>
  );
};

export default EventBasicInfoStep;
