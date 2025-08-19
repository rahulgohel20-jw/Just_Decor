import { DatePicker } from "antd";
import { Crown, Sparkles } from "lucide-react";
import MealTypeDropdown from "@/components/dropdowns/MealTypeDropdown";
import { useState } from "react";
import AddMeal from "@/partials/modals/add-meal/AddMeal";
import useStyles from "./style";

const OtherInfoStep = ({ formData, setFormData, onInputChange, errors }) => {
  const classes = useStyles();
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleAddClick = () => {
    setShowCustomerModal(true);
  };
  const handleInputChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleMealTypeChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, meal_type: value });
  };

  return (
    <>
      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Sparkles className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                Meal Information
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="sg__inner flex flex-col w-full gap-1">
                <label className="form-label">Meal Type</label>
                <div className="relative w-full">
                  <MealTypeDropdown
                    value={formData.meal_type || ""}
                    name="meal_type"
                    onChange={handleMealTypeChange}
                    createBtn={true}
                    className="w-full pr-12"
                    setCreateModalOpen={setShowCustomerModal}
                  />
                  <button
                    type="button"
                    onClick={handleAddClick}
                    title="Add"
                    className="absolute inset-y-1 right-2 flex items-center justify-center rounded-full bg-blue-600 text-white w-8 h-8"
                  >
                    <i className="ki-filled ki-plus text-sm"></i>
                  </button>
                </div>
                {errors.meal_type && (
                  <span className="text-red-500 text-sm">
                    {errors.meal_type}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="form-label">Meal Notes</label>
                <div className="input">
                  <input
                    className="h-full"
                    type="text"
                    name="meal_notes"
                    placeholder="Meal Notes"
                    value={formData.meal_notes || ""}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.meal_notes && (
                  <span className="text-red-500 text-sm">
                    {errors.meal_notes}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Sparkles className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                Service/Remark
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="sg__inner flex flex-col w-full gap-1">
                <label className="form-label">Service</label>
                <div className="input">
                  <input
                    className="h-full"
                    type="text"
                    name="service"
                    placeholder="Service"
                    value={formData.service || ""}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.service && (
                  <span className="text-red-500 text-sm">{errors.service}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="form-label">Theme</label>
                <div className="input">
                  <input
                    className="h-full"
                    type="text"
                    name="theme"
                    placeholder="Theme"
                    value={formData.theme || ""}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.theme && (
                  <span className="text-red-500 text-sm">{errors.theme}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="form-label">Notes</label>
                <div className="input">
                  <input
                    className="h-full"
                    type="text"
                    name="servicenotes"
                    placeholder="Notes"
                    value={formData.servicenotes || ""}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.servicenotes && (
                  <span className="text-red-500 text-sm">
                    {errors.servicenotes}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Crown className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                Groom Information
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="form-label">Groom Name</label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="groom_name"
                    placeholder="Groom name"
                    value={formData.groom_name || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="form-label">Instagram Link</label>
                <div className="input">
                  <i className="ki-filled ki-instagram"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="groom_instalink"
                    placeholder="Instagram Link"
                    value={formData.groom_instalink || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="form-label">Birth Date</label>
                <DatePicker
                  className="input"
                  placeholder="Groom Birth Date"
                  value={formData.groom_birth_date}
                  onChange={(date) =>
                    handleInputChange({
                      target: { value: date, name: "groom_birth_date" },
                    })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="form-label">Community</label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="groom_community"
                    placeholder="Groom Community"
                    value={formData.groom_community || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="form-label">Phone Number</label>
                <div className="input">
                  <i className="ki-filled ki-phone"></i>
                  <input
                    className="h-full"
                    type="tel"
                    name="groom_number"
                    placeholder="Groom number"
                    value={formData.groom_number || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Sparkles className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                Bride Information
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="form-label">Bride Name</label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="bride_name"
                    placeholder="Bride name"
                    value={formData.bride_name || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="form-label">Instagram Link</label>
                <div className="input">
                  <i className="ki-filled ki-instagram"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="bride_instalink"
                    placeholder="Instagram Link"
                    value={formData.bride_instalink || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="form-label">Birth Date</label>
                <DatePicker
                  className="input"
                  placeholder="Bride Birth Date"
                  value={formData.bride_birth_date}
                  onChange={(date) =>
                    handleInputChange({
                      target: { value: date, name: "bride_birth_date" },
                    })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="form-label">Community</label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="bride_community"
                    placeholder="Bride Community"
                    value={formData.bride_community || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="form-label">Phone Number</label>
                <div className="input">
                  <i className="ki-filled ki-phone"></i>
                  <input
                    className="h-full"
                    type="tel"
                    name="bride_number"
                    placeholder="Bride number"
                    value={formData.bride_number || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddMeal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
        />
      </div>
    </>
  );
};

export default OtherInfoStep;
