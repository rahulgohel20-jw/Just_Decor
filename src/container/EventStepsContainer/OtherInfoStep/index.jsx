import { DatePicker } from "antd";
import { Crown, Sparkles } from "lucide-react";
import MealTypeDropdown from "@/components/dropdowns/MealTypeDropdown";
import { useEffect, useState } from "react";
import AddMeal from "@/partials/modals/add-meal/AddMeal";
import useStyles from "./style";
import { GetMealType } from "@/services/apiServices";
const OtherInfoStep = ({ formData, setFormData, onInputChange, errors }) => {
  const classes = useStyles();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [options, setOptions] = useState([]);
  const handleAddClick = () => {
    setShowCustomerModal(true);
  };
  const handleInputChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleMealTypeChange = (value) => {
    setFormData({ ...formData, mealTypeId: value });
  };

  useEffect(() => {
    FetchMealtype();
  }, []);
  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  const FetchMealtype = () => {
    GetMealType(Id)
      .then((res) => {
        const mealdata = res?.data?.data?.["MealType Details"] || [];
        console.log(mealdata);

        setOptions(
          mealdata.map((item) => ({
            label: item.nameEnglish,
            value: item.id,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className={`flex flex-col gap-3 lg:gap-4 ${classes.customStyle}`}>
        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Sparkles className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                Meal Information
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="sg__inner  ssssssssssssss flex flex-col w-full gap-1">
                <label className="form-label">
                  Meal Typeas
                  <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                    *
                  </span>
                </label>
                <div className="select__grp flex flex-col">
                  <div className="sg__inner flex items-center gap-1 relative">
                    <MealTypeDropdown
                      value={formData.mealTypeId || ""}
                      name="mealTypeId"
                      onChange={handleMealTypeChange}
                      createBtn={true}
                      options={options}
                      className="w-full pr-14"
                      setCreateModalOpen={setShowCustomerModal}
                    />
                    <button
                      type="button"
                      onClick={handleAddClick}
                      title="Add"
                      className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                    >
                      <i className="ki-filled ki-plus text-sm"></i>
                    </button>
                  </div>
                </div>
                {errors.mealTypeId && (
                  <span className="text-red-500 text-sm">
                    {errors.mealTypeId}
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
                <label className="form-label">remark</label>
                <div className="input">
                  <input
                    className="h-full"
                    type="text"
                    name="remark"
                    placeholder="Notes"
                    value={formData.remark || ""}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.remark && (
                  <span className="text-red-500 text-sm">{errors.remark}</span>
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
                    name="groomName"
                    placeholder="Groom name"
                    value={formData.groomName || ""}
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
                    name="groomInstaLink"
                    placeholder="Instagram Link"
                    value={formData.groomInstaLink || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">Birth Date</label>
                <DatePicker
                  className="input"
                  placeholder="Groom Birth Date"
                  value={formData.groomBirthDate}
                  onChange={(date) =>
                    handleInputChange({
                      target: { value: date, name: "groomBirthDate" },
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
                    name="groomMobileno"
                    placeholder="Groom number"
                    value={formData.groomMobileno || ""}
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
                    name="brideName"
                    placeholder="Bride name"
                    value={formData.brideName || ""}
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
                    name="brideInstaLink"
                    placeholder="Instagram Link"
                    value={formData.brideInstaLink || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">Birth Date</label>
                <DatePicker
                  className="input"
                  placeholder="Bride Birth Date"
                  value={formData.brideBirthDate}
                  onChange={(date) =>
                    handleInputChange({
                      target: { value: date, name: "brideBirthDate" },
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
                    placeholder="Bride Community"
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
                    name="brideMobileno"
                    placeholder="Bride number"
                    value={formData.brideMobileno || ""}
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
