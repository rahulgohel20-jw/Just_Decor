import { useState } from "react";
import { Input } from "@/components/ui/input";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";

const ClientDetailsStep = ({
  formData,
  setFormData,
  onInputChange, // This uses (e, key) format
  handleInputChange, // This uses ({target: {value, name}}) format
  errors,
}) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors && errors[name]) {
      console.log(`Clearing error for ${name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-normal text-black mb-1 block">
          1. Client's Name
        </label>
        <div className="flex space-x-2">
          <select
            name="title"
            className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none"
            value={formData.title || "Mr."}
            onChange={handleChange}
          >
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
          </select>
          <div className="input">
            <i className="ki-filled ki-user text-[rgba(0, 91, 168, 1)]"></i>
            <Input
              name="customername"
              placeholder="Alex Roy"
              value={formData.customername || ""}
              onChange={handleChange}
              className="!border-none !shadow-none focus:!outline-none focus:!ring-0"
              bordered={false}
            />
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(true)}
              title="Add"
              className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-3 w-8 h-8"
            >
              <i className="ki-filled ki-plus"></i>
            </button>
          </div>
        </div>
        {errors.customername && (
          <span className="text-red-500 ml-[80px]">{errors.customername}</span>
        )}
      </div>

      <div>
        <label className="text-sm font-normal text-black mb-1 block">
          Address
        </label>
        <div className="input">
          <i className="ki-filled ki-geolocation text-[rgba(0, 91, 168, 1)]"></i>
          <Input
            name="customeraddress"
            placeholder="Enter Order Address"
            value={formData.customeraddress || ""}
            onChange={handleChange}
            className="!border-none !shadow-none focus:!outline-none focus:!ring-0"
            bordered={false}
          />
        </div>
        {errors.customeraddress && (
          <span className="text-red-500">{errors.customeraddress}</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-x-32">
        <div className="w-1/2">
          <label className="text-sm font-normal text-black mb-1 block">
            Mobile Number
          </label>
          <div className="input">
            <i className="ki-filled ki-phone text-[rgba(0, 91, 168, 1)]"></i>
            <Input
              name="customermobile"
              placeholder="Enter Mobile Number"
              value={formData.customermobile || ""}
              onChange={handleChange}
              className="!border-none !shadow-none focus:!outline-none focus:!ring-0"
              bordered={false}
            />
          </div>
          {errors.customermobile && (
            <span className="text-red-500">{errors.customermobile}</span>
          )}
        </div>

        <div className="flex items-center gap-10 mt-2 md:mt-6">
          <span className="text-sm font-normal text-black">
            <i className="ki-filled ki-flag text-lg -left-2 text-[rgba(0, 91, 168, 1)]"></i>
            High Priority:
          </span>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="highPriority"
              value="true"
              checked={formData.highPriority === true}
              onChange={() => setFormData({ ...formData, highPriority: true })}
            />
            Yes
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="highPriority"
              value="false"
              checked={formData.highPriority === false}
              onChange={() => setFormData({ ...formData, highPriority: false })}
            />
            No
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm font-normal text-black mb-1 block">
          Reference:
        </label>
        <div className="input">
          <i className="ki-filled ki-instagram text-[rgba(0, 91, 168, 1)]"></i>
          <Input
            name="customerreference"
            placeholder="Reference"
            value={formData.customerreference || ""}
            onChange={handleChange}
            className="!border-none !shadow-none focus:!outline-none focus:!ring-0"
            bordered={false}
          />
        </div>
      </div>

      <AddCustomer
        isModalOpen={isMemberModalOpen}
        setIsModalOpen={setIsMemberModalOpen}
      />
    </div>
  );
};

export default ClientDetailsStep;
