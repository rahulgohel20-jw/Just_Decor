import { useState, useEffect } from "react";
import {
  EditEventType,
  Addeventtype,
  Translateapi,
} from "@/services/apiServices";
import InputToTextLang from "@/components/form-inputs/InputToTextLang";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";

const AddVenueType = ({
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
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Name is required"),
  });

  const triggerTranslate = (text) => {
    if (!text?.trim()) return;

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      Translateapi(text)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            nameGujarati: res.data.gujarati || "",
            nameHindi: res.data.hindi || "",
          }));
        })
        .catch((err) => console.error("Translation error:", err));
    }, 500);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        nameEnglish: selectedEvent.event_type || "",
        nameGujarati: selectedEvent.nameGujarati || "",
        nameHindi: selectedEvent.nameHindi || "",
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [selectedEvent]);

  useEffect(() => {
    if (formData.nameEnglish) {
      triggerTranslate(formData.nameEnglish);
    }
  }, [formData.nameEnglish]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      const payload = { ...formData, userId: userData.id };

      if (selectedEvent) {
        const res = await EditEventType(selectedEvent.eventid, payload);
        if (res?.data.success === false) {
          Swal.fire("Error", res.data.msg || "Something went wrong", "error");
          return;
        }
        Swal.fire("Success", "Event updated successfully!", "success");
      } else {
        const res = await Addeventtype(payload);
        if (res?.data.success === false) {
          Swal.fire("Error", res.data.msg || "Something went wrong", "error");
          return;
        }
        Swal.fire("Success", "Event added successfully!", "success");
      }

      refreshData();
      setIsModalOpen(false);
    } catch (err) {
      if (err.inner) {
        // Collect Yup validation errors
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
                defaultMessage="Edit Venue"
              />
            ) : (
              <FormattedMessage
                id="USER.MASTER.ADD_EVENT_TYPE"
                defaultMessage="New Venue"
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

export default AddVenueType;
