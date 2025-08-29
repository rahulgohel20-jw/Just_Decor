import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import CustomerDropdown from "@/components/dropdowns/customerDropdown";
import { GetAllCustomer } from "@/services/apiServices";
const ClientDetailsStep = ({
  formData,
  setFormData,
  onInputChange,
  errors,
}) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [customer, setCustomer] = useState([]);
  useEffect(() => {
    FetchCustomerName();
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;

  const handleCustomerChange = (selectedId) => {
    const selectedCustomer = customer.find(
      (c) => c.value === selectedId["target"].value
    );

    if (selectedCustomer) {
      setFormData({
        ...formData,
        partyId: selectedCustomer.value,
        customer_name: selectedCustomer.customername,
        mobileno: selectedCustomer.mobile || "",
        address: selectedCustomer.address || "",
      });
    } else {
      setFormData({
        ...formData,
        partyId: "",
        customer_name: "",
        mobileno: "",
        address: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors && errors[name]) {
      console.log(`Clearing error for ${name}`);
    }
  };
  const FetchCustomerName = () => {
    GetAllCustomer(Id)
      .then((res) => {
        const customername = res.data.data["Party Details"].map(
          (customer, index) => ({
            sr_no: index + 1,
            value: customer.id,
            label: customer.nameEnglish + " - " + customer.mobileno,
            mobile: customer.mobileno,
            address: customer.addressEnglish,
            customername: customer.nameEnglish,
          })
        );
        setCustomer(customername);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-normal text-black mb-1 block">
          1. Client's Name
        </label>
        <div className="flex space-x-2">
          <select
            name="prefix"
            className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none"
            value={formData.prefix || "Mr."}
            onChange={handleChange}
          >
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
          </select>
          <div className="input">
            <i className="ki-filled ki-user text-[rgba(0, 91, 168, 1)]"></i>
            <CustomerDropdown
              value={formData.customer_name}
              onChange={handleCustomerChange}
              options={customer}
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
        {errors.customer_name && (
          <span className="text-red-500 ml-[80px]">{errors.customer_name}</span>
        )}
      </div>

      <div>
        <label className="text-sm font-normal text-black mb-1 block">
          Address
        </label>
        <div className="input">
          <i className="ki-filled ki-geolocation text-[rgba(0, 91, 168, 1)]"></i>
          <Input
            name="address"
            placeholder="Enter Order Address"
            value={formData.address || ""}
            onChange={handleChange}
            className="!border-none !shadow-none focus:!outline-none focus:!ring-0"
            bordered={false}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-x-32">
        <div className="w-1/2">
          <label className="text-sm font-normal text-black mb-1 block">
            Mobile Number
          </label>
          <div className="input">
            <i className="ki-filled ki-phone text-[rgba(0, 91, 168, 1)]"></i>
            <Input
              name="mobileno"
              placeholder="Enter Mobile Number"
              value={formData.mobileno || ""}
              onChange={handleChange}
              className="!border-none !shadow-none focus:!outline-none focus:!ring-0"
              bordered={false}
            />
          </div>
          {errors.mobileno && (
            <span className="text-red-500">{errors.mobileno}</span>
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
              name="isHighPriority"
              value="Yes"
              checked={formData.isHighPriority === "Yes"}
              onChange={() =>
                setFormData({ ...formData, isHighPriority: "Yes" })
              }
            />
            Yes
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="isHighPriority"
              value="No"
              checked={formData.isHighPriority === "No"}
              onChange={() =>
                setFormData({ ...formData, isHighPriority: "No" })
              }
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
            name="reference"
            placeholder="Reference"
            value={formData.reference || ""}
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
