import { useState, useEffect } from "react";
import { EditEventType, Addeventtype } from "@/services/apiServices";
import InputToTextLang from "@/components/form-inputs/InputToTextLang"
const AddEventType = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  selectedEvent,
}) => {
  if (!isModalOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (selectedEvent) {
      console.log(selectedEvent);

      setFormData({
        nameEnglish: selectedEvent.event_type || "",
        nameGujarati: selectedEvent.nameGujarati || "",
        nameHindi: selectedEvent.nameHindi || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) {
      alert("User data not found");
      return;
    }

    if (selectedEvent) {
      const payload = { ...formData, userId: userData.id };

      EditEventType(selectedEvent.eventid, payload)
        .then(() => {
          refreshData();
          setIsModalOpen();
        })
        .catch((error) => {
          console.error("Error editing meal:", error);
        });
    } else {
      const payload = { ...formData, userId: userData.id };
      Addeventtype(payload)
        .then(() => {
          refreshData();
          setIsModalOpen();
        })
        .catch((error) => {
          console.error("Error adding meal:", error);
        });
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedEvent ? "Edit Event" : "New Event"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>
        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Name fields */}
          <InputToTextLang
            label="Name (English)"
            name="nameEnglish"
            value={formData.nameEnglish}
            onChange={handleChange}
            lang={'en-US'}
            required
          />
          <InputToTextLang
            label="Name (ગુજરાતી)"
            name="nameGujarati"
            value={formData.nameGujarati}
            onChange={handleChange}
            required
            lng={'gu-US'}
          />
          <InputToTextLang
            label="Name (हिंदी)"
            name="nameHindi"
            value={formData.nameHindi}
            onChange={handleChange}
            required
            lng={'hi'}
          />
        </div>
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            onClick={handleSubmit}
          >
            {selectedEvent ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventType;
