import { useState } from "react";
import PhoneNumber from "@/components/form-inputs/PhoneNumber/PhoneNumber";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { KeenIcon } from "@/components";
import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddContact = ({ isModalOpen, setIsModalOpen }) => {
  const [date, setDate] = useState(new Date(1984, 0, 20));

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <CustomModal
      open={isModalOpen}
      onClose={handleModalClose}
      title="Add Contact"
    >
      {/* contact details */}
      <div>
        <h4 className="mb-3">Contact Details</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="form-label ">Select Role</label>
            <select
              className="input form-select-solid w-full"
              data-control="select2"
              data-placeholder="Company name"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="form-label ">Email</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="form-label ">First Name</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="form-label ">Last Name</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter last name"
            />
          </div>
          <PhoneNumber />
          <div></div>
          <div>
            <label className="form-label">Date of Birth</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    "input data-[state=open]:border-primary",
                    !date && "text-muted-foreground"
                  )}
                >
                  <KeenIcon icon="calendar" className="-ms-0.5" />
                  {date ? format(date, "LLL dd, y") : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single" // Single date selection
                  defaultMonth={date}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="form-label">Date of Anniversary</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={cn(
                    "input data-[state=open]:border-primary",
                    !date && "text-muted-foreground"
                  )}
                >
                  <KeenIcon icon="calendar" className="-ms-0.5" />
                  {date ? format(date, "LLL dd, y") : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="single" // Single date selection
                  defaultMonth={date}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* address details */}
      <div>
        <h4 className="mb-3">Address Details</h4>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="form-label ">State</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="State"
            />
          </div>
          <div>
            <label className="form-label ">City</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="City"
            />
          </div>
          <div>
            <label className="form-label ">Pincode</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Pincode"
            />
          </div>

          <div>
            <label className="form-label ">Address</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Address"
            />
          </div>
        </div>
      </div>
      {/* Social Profile */}
      <div>
        <h4 className="mb-3">Social Profile</h4>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="form-label ">Linkedin</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter valid URL starting with https://"
            />
          </div>
          <div>
            <label className="form-label ">Twitter</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter valid URL starting with https://"
            />
          </div>
          <div>
            <label className="form-label ">Youtube</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter valid URL starting with https://"
            />
          </div>

          <div>
            <label className="form-label ">Facebook</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter valid URL starting with https://"
            />
          </div>
          <div>
            <label className="form-label ">Instagram</label>
            <input
              type="text"
              className="input form-control-solid w-full"
              placeholder="Enter valid URL starting with https://"
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
export default AddContact;
