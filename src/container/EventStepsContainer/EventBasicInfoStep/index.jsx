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
            <label className="form-label">Inquiry Date </label>
            <DatePicker
              className="input"
              format="DD/MM/YYYY"
              value={
                formData.Inquiry_date
                  ? dayjs(formData.Inquiry_date, "DD/MM/YYYY")
                  : null
              }
              onChange={(date) =>
                setFormData({
                  ...formData,
                  Inquiry_date: date ? date.format("DD/MM/YYYY") : "",
                })
              }
            />
            {errors.Inquiry_date && (
              <span className="text-red-500">{errors.Inquiry_date}</span>
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
                formData.start_event_date
                  ? dayjs(formData.start_event_date, "DD/MM/YYYY hh:mm A")
                  : null
              }
              onChange={(date) =>
                setFormData({
                  ...formData,
                  start_event_date: date
                    ? date.format("DD/MM/YYYY hh:mm A")
                    : "",
                })
              }
            />
            {errors.event_date && (
              <span className="text-red-500">{errors.start_event_date}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="form-label">End Event Date</label>
            <DatePicker
              className="input"
              showTime={{ use12Hours: true, format: "hh:mm A" }}
              format="DD/MM/YYYY hh:mm A"
              value={
                formData.end_event_date
                  ? dayjs(formData.end_event_date, "DD/MM/YYYY hh:mm A")
                  : null
              }
              onChange={(date) =>
                setFormData({
                  ...formData,
                  end_event_date: date ? date.format("DD/MM/YYYY hh:mm A") : "",
                })
              }
            />
            {errors.event_date && (
              <span className="text-red-500">{errors.end_event_date}</span>
            )}
          </div>
          <div className="select__grp flex flex-col">
            <label className="form-label">Venue</label>
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
            <label className="form-label">Event Type</label>
            <div className="sg__inner flex items-center gap-1 relative">
              <UserDropdown
                value={formData.event_type}
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
            {errors.event_type && (
              <span className="text-red-500">{errors.event_type}</span>
            )}
          </div>
          {/* Manager */}
          <div className="select__grp flex flex-col">
            <label className="form-label">Manager</label>
            <div className="sg__inner flex items-center gap-1 relative">
              <ManagerDropdown
                value={formData.manger_name}
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
            {errors.manger_name && (
              <span className="text-red-500">{errors.manger_name}</span>
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
