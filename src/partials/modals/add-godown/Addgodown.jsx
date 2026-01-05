import { useState, useEffect } from "react";
import {
  AddorUpdategodown,
  Translateapi,
  GetGodownbyid,
} from "@/services/apiServices";
import InputToTextLang from "@/components/form-inputs/InputToTextLang";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";

const Addgodown = ({
  isModalOpen,
  setIsModalOpen,
  refreshData = () => {},
  selectedEvent,
}) => {
  if (!isModalOpen) return null;
  const [debounceTimer, setDebounceTimer] = useState(null);
  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    addressEnglish: "",
    addressGujarati: "",
    addressHindi: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Name is required"),
  });

  const triggerTranslate = (text, type = "name") => {
    if (!text?.trim()) return;

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      Translateapi(text)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            ...(type === "name" && {
              nameGujarati: res.data.gujarati || "",
              nameHindi: res.data.hindi || "",
            }),
            ...(type === "address" && {
              addressGujarati: res.data.gujarati || "",
              addressHindi: res.data.hindi || "",
            }),
          }));
        })
        .catch((err) => console.error("Translation error:", err));
    }, 500);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    if (!selectedEvent?.id) {
      setFormData(initialFormState);
      return;
    }

    GetGodownbyid(selectedEvent.id)
      .then((res) => {
        const data = res?.data?.data;
        if (!data) return;

        setFormData({
          nameEnglish: data.nameEnglish || "",
          nameGujarati: data.nameGujarati || "",
          nameHindi: data.nameHindi || "",
          addressEnglish: data.addressEnglish || "",
          addressGujarati: data.addressGujarati || "",
          addressHindi: data.addressHindi || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching godown by id:", error);
        Swal.fire("Error", "Failed to load godown data", "error");
      });

    setErrors({});
  }, [selectedEvent]);

  useEffect(() => {
    if (formData.nameEnglish) {
      triggerTranslate(formData.nameEnglish);
    }
  }, [formData.nameEnglish]);
  useEffect(() => {
    if (formData.addressEnglish) {
      triggerTranslate(formData.addressEnglish, "address");
    }
  }, [formData.addressEnglish]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      const payload = {
        id: selectedEvent?.id || 0, // 🔥 0 = ADD, >0 = UPDATE
        nameEnglish: formData.nameEnglish,
        nameGujarati: formData.nameGujarati,
        nameHindi: formData.nameHindi,
        addressEnglish: formData.addressEnglish,
        addressGujarati: formData.addressGujarati,
        addressHindi: formData.addressHindi,
        userId,
      };

      const res = await AddorUpdategodown(payload);

      if (res?.data?.success === false) {
        Swal.fire("Error", res.data.msg || "Something went wrong", "error");
        return;
      }

      Swal.fire(
        "Success",
        selectedEvent
          ? "Godown updated successfully!"
          : "Godown added successfully!",
        "success"
      );

      refreshData();
      setIsModalOpen(false);
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((validationError) => {
          formErrors[validationError.path] = validationError.message;
        });
        setErrors(formErrors);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#F2F7FB] rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedEvent ? (
              <FormattedMessage
                id="USER.MASTER.EDIT_EVENT_TYPE"
                defaultMessage="Edit Event"
              />
            ) : (
              <FormattedMessage
                id="USER.MASTER.ADD_EVENT_TYPE"
                defaultMessage="Create New Godown"
              />
            )}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* English */}
          <div>
            <InputToTextLang
              label={
                <FormattedMessage
                  id="COMMON.NAME_ENGLISH"
                  defaultMessage="Name (English)"
                />
              }
              name="nameEnglish"
              value={formData.nameEnglish}
              onChange={handleChange}
              lang={"en-US"}
              required
            />
            {errors.nameEnglish && (
              <p className="text-red-500 text-sm mt-1">{errors.nameEnglish}</p>
            )}
          </div>

          {/* Gujarati */}
          <InputToTextLang
            label={
              <FormattedMessage
                id="COMMON.NAME_GUJARATI"
                defaultMessage="Name (ગુજરાતી)"
              />
            }
            name="nameGujarati"
            value={formData.nameGujarati}
            onChange={handleChange}
            lng={"gu-US"}
          />

          {/* Hindi */}
          <InputToTextLang
            label={
              <FormattedMessage
                id="COMMON.NAME_HINDI"
                defaultMessage="Name (हिंदी)"
              />
            }
            name="nameHindi"
            value={formData.nameHindi}
            onChange={handleChange}
            lng={"hi"}
          />
          {/* Address English */}
          {/* Address English - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FormattedMessage
                id="COMMON.ADDRESS_ENGLISH"
                defaultMessage="Address (English)"
              />
            </label>
            <textarea
              name="addressEnglish"
              value={formData.addressEnglish}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter address"
            />
          </div>

          {/* Address Gujarati - Left */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FormattedMessage
                id="COMMON.ADDRESS_GUJARATI"
                defaultMessage="Address (ગુજરાતી)"
              />
            </label>
            <textarea
              name="addressGujarati"
              value={formData.addressGujarati}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Address (ગુજરાતી)"
            />
          </div>

          {/* Address Hindi - Right */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FormattedMessage
                id="COMMON.ADDRESS_HINDI"
                defaultMessage="Address (हिंदी)"
              />
            </label>
            <textarea
              name="addressHindi"
              value={formData.addressHindi}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Address (हिंदी)"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>
          <button
            type="button"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            onClick={handleSubmit}
          >
            {selectedEvent ? (
              <FormattedMessage id="COMMON.UPDATE" defaultMessage="Update" />
            ) : (
              <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addgodown;
