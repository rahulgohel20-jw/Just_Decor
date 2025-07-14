import { DatePicker } from "antd";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import ContactDropdown from "@/components/dropdowns/ContactDropdown";
import EventStatusDropdown from "@/components/dropdowns/EventStatusDropdown";
import EventTypeDropdown from "@/components/dropdowns/EventTypeDropdown";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import { useState } from "react";


const EventBasicInfoStep = ({ formData, setFormData, onInputChange }) => {

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleAddClick = () => {
    setShowCustomerModal(true);
  };


  // Example handler for plus buttons
  

  return (
    <div className="flex flex-col gap-y-2 gap-x-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-5">
        
        {/* Customer Name */}
        <div className="flex flex-col">
          <label className="form-label">Customer Name</label>
          <div className="relative">
            <ContactDropdown
              value={formData.customer_id}
              onChange={onInputChange}
              className="w-full border-2 border-primary rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={handleAddClick}
              className="absolute inset-y-0 right-0 flex items-center justify-center mr-2 my-1 w-8 h-8 bg-primary text-white rounded-full hover:bg-primary/90 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Manager */}
        <div className="flex flex-col">
          <label className="form-label">Manager</label>
          <div className="relative">
            <UserDropdown
              value={formData.manager_id}
              onChange={onInputChange}
              className="w-full border-2 border-primary rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => handleAddClick("Manager")}
              className="absolute inset-y-0 right-0 flex items-center justify-center mr-2 my-1 w-8 h-8 bg-primary text-white rounded-full hover:bg-primary/90 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Venue */}
        <div className="flex flex-col">
          <label className="form-label">Venue</label>
          <div className="relative">
            <input
              className="w-full border-2 border-primary rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              name="venue"
              placeholder="Venue"
              value={formData.venue}
              onChange={onInputChange}
            />
            
          </div>
        </div>

        {/* Event Type */}
        <div className="flex flex-col">
          <label className="form-label">Event Name</label>
          <EventTypeDropdown
            value={formData.event_type}
            className="w-full border-2 border-primary rounded-lg"
            onChange={onInputChange}
          />
        </div>

        {/* Enquiry Date */}
        <div className="flex flex-col">
          <label className="form-label">Enquiry Date</label>
          <DatePicker
            className="input border-2 border-primary rounded-lg"
            date={formData.meeting_date}
            setDate={(date) => setFormData({ ...formData, meeting_date: date })}
          />
        </div>

        {/* Event Date */}
        <div className="flex flex-col">
          <label className="form-label">Event Date</label>
          <DatePicker
            className="input border-2 border-primary rounded-lg"
            date={formData.event_date}
            setDate={(date) => setFormData({ ...formData, event_date: date })}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="form-label">Status</label>
          <EventStatusDropdown
            value={formData.status}
            className="w-full border-2 border-primary rounded-lg"
            onChange={onInputChange}
          />
        </div>

      </div>
      {/* Modal */}
      <AddCustomer
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
    </div>
    


  );
};



export default EventBasicInfoStep;
