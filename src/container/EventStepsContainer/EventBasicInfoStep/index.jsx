import { DatePicker } from "antd";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import ContactDropdown from "@/components/dropdowns/ContactDropdown";
import EventStatusDropdown from "@/components/dropdowns/EventStatusDropdown";
import EventTypeDropdown from "@/components/dropdowns/EventTypeDropdown";

const EventBasicInfoStep = ({ formData, setFormData, onInputChange }) => {
  return (
    <div className="flex flex-col gap-y-2 gap-x-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
        <div className="flex flex-col">
          <label className="form-label">Customer</label>
          <ContactDropdown
            value={formData.customer_id}
            onChange={onInputChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label">Manager</label>
          <UserDropdown
            value={formData.manager_id}
            onChange={onInputChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label">Chef</label>
          <UserDropdown
            value={formData.chef_id}
            onChange={onInputChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label">Venue</label>
          <div className="input">
            <i className="ki-filled ki-autobrightness"></i>
            <input
              className="h-full"
              type="text"
              name="venue"
              placeholder="Venue"
              value={formData.venue}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="form-label">Party Plot Name</label>
          <div className="input">
            <i className="ki-filled ki-autobrightness"></i>
            <input
              className="h-full"
              type="text"
              name="party_plot_name"
              placeholder="Party Plot Name"
              value={formData.party_plot_name}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="form-label">Reference By</label>
          <div className="input">
            <i className="ki-filled ki-autobrightness"></i>
            <input
              className="h-full"
              type="text"
              name="reference_by"
              placeholder="Reference By"
              value={formData.reference_by}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="form-label">Location URL</label>
          <div className="input">
            <i className="ki-filled ki-autobrightness"></i>
            <input
              className="h-full"
              type="text"
              name="location_url"
              placeholder="Location URL"
              value={formData.location_url}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="form-label">Event Type</label>
          <EventTypeDropdown
            value={formData.event_type}
            onChange={onInputChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label">Meeting Date</label>
          <DatePicker
            className="input"
            date={formData.meeting_date}
            setDate={(date) => setFormData({ ...formData, meeting_date: date })}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label">Event Date</label>
          <DatePicker
            className="input"
            date={formData.event_date}
            setDate={(date) => setFormData({ ...formData, event_date: date })}
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label">Status</label>
          <EventStatusDropdown
            value={formData.status}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EventBasicInfoStep;
