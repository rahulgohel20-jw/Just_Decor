import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import CustomerDropdown from "@/components/dropdowns/customerDropdown";
import { GetAllCustomer } from "@/services/apiServices";
import useStyles from "./style";

import { FormattedMessage } from "react-intl";
import { useLanguage } from "@/i18n";

const ClientDetailsStep = ({
  formData,
  setFormData,
  onInputChange,
  errors,
}) => {
  const classes = useStyles();
  const languageContext = useLanguage();
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [customer, setCustomer] = useState([]);

  console.log("Language Context:", languageContext);

  useEffect(() => {
    FetchCustomerName();
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;

  // Helper function to get the correct language field
  const getLocalizedField = (item, fieldName) => {
    const currentLocale =
      languageContext?.locale || languageContext?.language || "en";

    console.log("Current Locale:", currentLocale);
    console.log("Item:", item);

    const languageMap = {
      en: "English",
      "en-US": "English",
      "en-GB": "English",
      hi: "Hindi",
      "hi-IN": "Hindi",
      gu: "Gujarati",
      "gu-IN": "Gujarati",
    };

    const suffix = languageMap[currentLocale] || "English";
    const fieldKey = `${fieldName}${suffix}`;

    console.log(`Looking for field: ${fieldKey}, Value: ${item[fieldKey]}`);

    return item[fieldKey] || item[`${fieldName}English`] || "";
  };

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

  const FetchCustomerName = (autoSelectLatest = false) => {
    GetAllCustomer(Id)
      .then((res) => {
        const partyDetails = res.data.data["Party Details"];

        const customername = partyDetails.map((customer, index) => {
          const localizedName = getLocalizedField(customer, "name");
          const localizedAddress = getLocalizedField(customer, "address");

          return {
            sr_no: index + 1,
            value: customer.id,
            label: `${localizedName} - ${customer.mobileno}`,
            mobile: customer.mobileno,
            address: localizedAddress,
            customername: localizedName,
            nameEnglish: customer.nameEnglish,
            nameHindi: customer.nameHindi,
            nameGujarati: customer.nameGujarati,
            addressEnglish: customer.addressEnglish,
            addressHindi: customer.addressHindi,
            addressGujarati: customer.addressGujarati,
          };
        });

        setCustomer(customername);

        // Auto-select the latest added customer
        if (autoSelectLatest && customername.length > 0) {
          const latestCustomer = customername[customername.length - 1];
          console.log("Auto-selecting latest customer:", latestCustomer);

          setFormData((prev) => ({
            ...prev,
            partyId: latestCustomer.value,
            customer_name: latestCustomer.customername,
            mobileno: latestCustomer.mobile || "",
            address: latestCustomer.address || "",
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handler to refresh data after adding new customer
  const handleCustomerAdded = () => {
    console.log("New customer added, refreshing and auto-selecting...");
    FetchCustomerName(true); // Pass true to auto-select latest
  };

  // Re-fetch customer data when language changes to update labels
  useEffect(() => {
    const currentLocale = languageContext?.locale || languageContext?.language;
    console.log("Language changed to:", currentLocale);
    FetchCustomerName();
  }, [languageContext?.locale, languageContext?.language]);

  return (
    <div className={`flex flex-col gap-y-2 gap-x-4 ${classes.basicInfo}`}>
      <div className=" gap-3 lg:gap-4">
        <div className="col-span-4 md:col-start-3 min-w-full space-y-3">
          <div className="select__grp flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_NAME"
                defaultMessage="Client Name"
              />
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <select
                  name="prefix"
                  className="w-20 px-3 select"
                  value={formData.prefix || "Mr."}
                  onChange={handleChange}
                >
                  <option value="Mr.">
                    <FormattedMessage
                      id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_PREFIX_MR"
                      defaultMessage="Mr."
                    />
                  </option>
                  <option value="Ms.">
                    <FormattedMessage
                      id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_PREFIX_MS"
                      defaultMessage="Ms."
                    />
                  </option>
                </select>
                <div className="sg__inner flex items-center gap-1 relative w-full">
                  <i className="ki-filled ki-user ms-2.5"></i>
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
                <span className="text-red-600 font-normal text-sm mt-0.50">
                  {errors.customer_name}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label className="text-sm font-normal text-black mb-1 block">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_ADDRESS"
                  defaultMessage="Address"
                />
              </label>
              <div className="input">
                <i className="ki-filled ki-geolocation"></i>
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
            <div className="flex flex-col w-full">
              <label className="text-sm font-normal text-black mb-1 block">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_MOBILE"
                  defaultMessage="Mobile Number"
                />
                <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                  *
                </span>
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
                <span className="text-red-600 font-normal text-sm mt-0.50">
                  {errors.mobileno}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-normal text-black mb-1 block">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_REFERENCE"
                defaultMessage="Reference"
              />
            </label>
            <div className="input">
              <i className="ki-filled ki-instagram"></i>
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
          <div className="flex items-center gap-3">
            <label className="text-sm font-normal text-black block">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_HIGH_PRIORITY"
                defaultMessage="High Priority"
              />
            </label>
            <div className="flex items-center gap-3">
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
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_YES"
                  defaultMessage="Yes"
                />
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
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_CLIENT_DETAILS_NO"
                  defaultMessage="No"
                />
              </label>
            </div>
          </div>

          <AddCustomer
            isModalOpen={isMemberModalOpen}
            setIsModalOpen={setIsMemberModalOpen}
            refreshData={handleCustomerAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsStep;
