import { useState } from "react";
import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import ManagerDropdown from "@/components/dropdowns/ManagerDropdown";
import EventStatusDropdown from "@/components/dropdowns/EventStatusDropdown";
import SpeechToText from "@/components/form-inputs/SpeechToText";
import useStyles from "./style";
import AddMember from "@/partials/modals/add-member/AddMember";
import AddEventType from "@/partials/modals/add-event-type/AddEventType";

const EventBasicInfoStep = ({
  formData,
  setFormData,
  onInputChange,
  errors,
}) => {
  const classes = useStyles();

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
              value={
                formData.Inquiry_date ? dayjs(formData.Inquiry_date) : null
              }
              onChange={(date) =>
                setFormData({ ...formData, Inquiry_date: date })
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
            <label className="form-label">Event Date</label>
            <DatePicker
              className="input"
              value={formData.event_date ? dayjs(formData.event_date) : null}
              onChange={(date) =>
                setFormData({ ...formData, event_date: date })
              }
            />
            {errors.event_date && (
              <span className="text-red-500">{errors.event_date}</span>
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
