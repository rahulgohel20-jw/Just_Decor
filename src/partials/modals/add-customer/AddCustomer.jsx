import { useRef, useState, useEffect, useCallback } from "react";
import {
  AddCustomerapi,
  GetAllContactCategory,
  EditCustomerApi,
} from "@/services/apiServices";

const AddCustomer = ({
  isModalOpen,
  setIsModalOpen,
  selectedCustomer,
  refreshData,
}) => {
  if (!isModalOpen) return null;

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef();

  // Initial form state
  const initialFormState = {
    id: "",
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    addressEnglish: "",
    addressGujarati: "",
    addressHindi: "",
    email: "",
    mobileno: "",
    altMobileno: "",
    gst: "",
    bdate: "",
    contactCategoryId: "",
    document: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const parseBirthdate = useCallback((birthdateString) => {
    if (!birthdateString || birthdateString === "-") return "";
    try {
      let dateStr = birthdateString.trim();

      // Strip time if exists
      if (dateStr.includes(",")) {
        dateStr = dateStr.split(",")[0].trim();
      }

      // dd/MM/yyyy → convert to yyyy-MM-dd
      if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      // yyyy-MM-dd → already fine
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateStr;
      }

      // Fallback: parse with Date
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const da = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${da}`;
      }

      return "";
    } catch {
      return "";
    }
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (isModalOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      console.log(selectedCustomer, "data");

      if (selectedCustomer) {
        const parsedDate = parseBirthdate(selectedCustomer.birthdate);
        console.log(parsedDate);

        setFormData({
          id: selectedCustomer.customerid || "",
          nameEnglish: selectedCustomer.customer || "",
          nameGujarati: selectedCustomer.nameGujarati || "",
          nameHindi: selectedCustomer.nameHindi || "",
          addressEnglish: selectedCustomer.address || "",
          addressGujarati: selectedCustomer.addressGujarati || "",
          addressHindi: selectedCustomer.addressHindi || "",
          email: selectedCustomer.email || "",
          mobileno: selectedCustomer.mobile || "",
          altMobileno: selectedCustomer.altMobileno || "",
          gst: selectedCustomer.gst || "",
          bdate: parsedDate,
          document: selectedCustomer.document || "",
          contactCategoryId: selectedCustomer.contactCategoryId || "",
        });
        if (selectedCustomer.image) {
          setImagePreview(`/uploads/${selectedCustomer.image}`);
        }
      } else {
        setFormData(initialFormState);
        setImagePreview(null);
      }
    }
  }, [selectedCustomer, isModalOpen, parseBirthdate]);

  const fetchCategories = async () => {
    try {
      const {
        data: { data },
      } = await GetAllContactCategory(userData.id);
      setCategories(data["Contact Category Details"] || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const CustomerAddApi = async () => {
    setIsLoading(true);
    try {
      if (!userData?.id) {
        throw new Error("User data not found");
      }
      const payload = {
        ...formData,
        userId: userData.id,
        bdate: formatDateToDDMMYYYY(formData.bdate),
      };
      if (formData.id) {
        await EditCustomerApi(formData.id, payload);
      } else {
        await AddCustomerapi(payload);
      }
      setIsModalOpen(false);
      refreshData();

      setFormData(initialFormState);
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving customer:", error);
      alert(
        `Error ${formData.id ? "updating" : "adding"} customer. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {formData.id ? "Edit Customer" : "New Customer"}
          </h2>
          <button
            onClick={handleModalClose}
            className="text-2xl text-gray-600 hover:text-gray-800"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name fields */}
            <InputWithIcon
              label="Name (English)*"
              name="nameEnglish"
              value={formData.nameEnglish}
              onChange={handleChange}
              required
            />
            <InputWithIcon
              label="Name (ગુજરાતી)"
              name="nameGujarati"
              value={formData.nameGujarati}
              onChange={handleChange}
            />
            <InputWithIcon
              label="Name (हिंदी)"
              name="nameHindi"
              value={formData.nameHindi}
              onChange={handleChange}
            />

            {/* Home Address */}
            <InputWithIcon
              label="Home Address (English)"
              name="addressEnglish"
              value={formData.addressEnglish}
              onChange={handleChange}
            />
            <InputWithIcon
              label="Home Address (ગુજરાતી)"
              name="addressGujarati"
              value={formData.addressGujarati}
              onChange={handleChange}
            />
            <InputWithIcon
              label="Home Address (हिंदी)"
              name="addressHindi"
              value={formData.addressHindi}
              onChange={handleChange}
            />

            {/* Contact Category */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-600">Contact Category*</label>
              <div className="flex items-center gap-2">
                <select
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  name="contactCategoryId"
                  value={formData.contactCategoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameEnglish}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 text-xl leading-none"
                >
                  +
                </button>
              </div>
            </div>

            <InputSimple
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputSimple
              label="Mobile Number*"
              name="mobileno"
              type="tel"
              value={formData.mobileno}
              onChange={handleChange}
              required
            />
            <InputSimple
              label="Alternative Number"
              name="altMobileno"
              type="tel"
              value={formData.altMobileno}
              onChange={handleChange}
            />
            <InputSimple
              label="GST Number"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
            />

            {/* Birth Date */}
            <div className="relative">
              <label htmlFor="birth_date" className="block text-gray-600 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                name="bdate"
                className="border border-gray-300 rounded-lg p-2 w-full pr-10 text-gray-600"
                value={formData.bdate}
                onChange={handleChange}
              />
            </div>

            {/* Document Type */}
            <div className="flex flex-col w-full">
              <label className="text-gray-600">Select Document</label>
              <select
                name="document"
                value={formData.document}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="">-- Select Document --</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="driving">Driving License</option>
              </select>
            </div>

            {/* Document Upload */}
            <div className="flex flex-col">
              <label className="text-gray-600">Upload Documents</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleIconClick}
                  className="w-full h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-2.414-2.414A2 2 0 0013.586 3H4zm5 10a3 3 0 110-6 3 3 0 010 6zm5-5a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={handleModalClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={CustomerAddApi}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : formData.id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputWithIcon = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 w-full pr-8"
      placeholder={label}
      required={required}
    />
    <span className="absolute right-2 top-9 text-blue-500 cursor-pointer">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 14a4 4 0 004-4V5a4 4 0 10-8 0v5a4 4 0 004 4zm1 2.93a7 7 0 01-5.2-2.11A1 1 0 104.8 16.8 9 9 0 0010 19a9 9 0 005.2-2.2 1 1 0 00-1.4-1.4A7 7 0 0111 16.93z" />
      </svg>
    </span>
  </div>
);

const InputSimple = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}) => (
  <div>
    <label className="block text-gray-600 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
      required={required}
    />
  </div>
);

export default AddCustomer;
