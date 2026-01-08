import { DatePicker } from "antd";
import { Crown, Sparkles } from "lucide-react";
import MealTypeDropdown from "@/components/dropdowns/MealTypeDropdown";
import { useEffect, useState } from "react";
import ManagerDropdown from "@/components/dropdowns/ManagerDropdown";
import AddMember from "@/partials/modals/add-member/AddMember";
import AddMeal from "@/partials/modals/add-meal/AddMeal";
import useStyles from "./style";
import { GetMealType, Fetchmanager } from "@/services/apiServices";
import { FormattedMessage } from "react-intl";
import dayjs from "dayjs";
import { useLanguage } from "@/i18n";

const OtherInfoStep = ({ formData, setFormData, onInputChange, errors }) => {
  const classes = useStyles();
  const { isRTL, locale } = useLanguage();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [manager, setManager] = useState([]);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // ✅ Get language from localStorage
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const dateFormat = "DD/MM/YYYY";
  let Id = localStorage.getItem("userId");

  // ✅ Update lang state when language changes
  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
    console.log("[OtherInfoStep] Language changed:", storedLang);
  }, [isRTL, locale]);

  // ✅ Simplified function to get localized field based on localStorage lang
  const getLocalizedField = (item, fieldName) => {
    if (!item) return "";

    switch (lang) {
      case "hi":
        return item[`${fieldName}Hindi`] || item[`${fieldName}English`] || "";
      case "gu":
        return (
          item[`${fieldName}Gujarati`] || item[`${fieldName}English`] || ""
        );
      default:
        return item[`${fieldName}English`] || "";
    }
  };

  const handleAddClick = () => {
    setShowCustomerModal(true);
  };

  const handleInputChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleMealTypeChange = (value) => {
    setFormData({ ...formData, mealTypeId: value });
  };
  const handleMangerNameChange = (value) => {
    setFormData({ ...formData, managerId: value });
  };
  const handleGroomBirthDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format(dateFormat) : "";
    setFormData({ ...formData, groomBirthDate: formattedDate });
  };

  const handleBrideBirthDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format(dateFormat) : "";
    setFormData({ ...formData, brideBirthDate: formattedDate });
  };

  const handleCommunityChange = (e) => {
    const { name, value } = e.target;

    // Count digits only
    const digitCount = (value.match(/\d/g) || []).length;

    // Allow max 10 digits only
    if (digitCount > 10) return;

    setFormData({ ...formData, [name]: value });
  };

  // ✅ Modified FetchMealtype with language support and auto-select
  const FetchMealtype = (autoSelectLatest = false) => {
    GetMealType(Id)
      .then((res) => {
        const mealdata = res?.data?.data?.["MealType Details"] || [];

        // ✅ Map meal options with localized names
        const mealOptions = mealdata.map((item) => {
          const localizedName = getLocalizedField(item, "name");

          return {
            label: localizedName,
            value: item.id,
            nameEnglish: item.nameEnglish,
            nameHindi: item.nameHindi,
            nameGujarati: item.nameGujarati,
          };
        });

        console.log("Fetched Meal Types with lang:", lang, mealOptions);
        setOptions(mealOptions);

        if (autoSelectLatest && mealOptions.length > 0) {
          const latestMeal = mealOptions[mealOptions.length - 1];
          setFormData((prev) => ({
            ...prev,
            mealTypeId: latestMeal.value,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ✅ Modified FetchManager with auto-select support
  const FetchManager = (autoSelectLatest = false) => {
    Fetchmanager(Id).then((res) => {
      const managerList = res.data.data["userDetails"].map((man, index) => ({
        sr_no: index + 1,
        value: man.id,
        label: man.firstName || "-",
        nameEnglish: man.nameEnglish,
        nameHindi: man.nameHindi,
        nameGujarati: man.nameGujarati,
      }));

      console.log("Fetched Managers:", managerList);
      setManager(managerList);

      if (autoSelectLatest && managerList.length > 0) {
        const latestManager = managerList[managerList.length - 1];
        setFormData((prev) => ({
          ...prev,
          managerId: latestManager.value,
        }));
      }
    });
  };

  // ✅ Fetch data on mount and when language changes
  useEffect(() => {
    FetchMealtype();
    FetchManager();
  }, [lang]); // Added lang dependency

  // ✅ Handler for when a new meal type is added
  const handleMealTypeAdded = () => {
    FetchMealtype(true); // Auto-select the newly added meal type
  };

  // ✅ Handler for when a new manager is added
  const handleManagerAdded = () => {
    FetchManager(true); // Auto-select the newly added manager
  };

  return (
    <>
      <div className={`flex flex-col gap-3 lg:gap-4 ${classes.customStyle}`}>
        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Sparkles className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_MEAL_AND_NOTES"
                  defaultMessage="Food Prefrence"
                />
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="sg__inner flex flex-col w-full gap-1">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_MEAL_AND_NOTES_MEAL_TYPE"
                    defaultMessage="Prefrence"
                  />
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
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_MEAL_AND_NOTES_MEAL_NOTES"
                    defaultMessage="Notes"
                  />
                </label>
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
              </div>
            </div>
          </div>
        </div>

        <div className="card w-full">
          <div className="p-4">
            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-primary" />
              <p className="text-base font-medium text-gray-900 flex items-center gap-1">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_SERVICE_AND_REMARK"
                  defaultMessage="Sales Executive"
                />
                <span className="text-red-500 font-semibold">*</span>
              </p>
            </div>

            {/* Manager Dropdown Section */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-[330px]">
                  <ManagerDropdown
                    value={formData.managerId || ""}
                    name="managerId"
                    onChange={handleMangerNameChange}
                    options={manager}
                    className="w-full"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(true)}
                  title="Add Manager"
                  className="btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                >
                  <i className="ki-filled ki-plus"></i>
                </button>
              </div>

              {errors.managerId && (
                <span className="text-red-600 font-normal text-sm">
                  {errors.managerId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Sparkles className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_SERVICE_AND_REMARK"
                  defaultMessage="Service/Remark"
                />
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="sg__inner flex flex-col w-full gap-1">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_SERVICE"
                    defaultMessage="Service"
                  />
                </label>
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
              </div>

              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_THEME"
                    defaultMessage="Theme"
                  />
                </label>
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
              </div>

              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_OTHER_INFO_REMARK"
                    defaultMessage="Remark"
                  />
                </label>
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
              </div>
            </div>
          </div>
        </div>

        <div className="card min-w-full">
          <div className="flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Crown className="text-primary" />
              <p className="text-base font-medium text-gray-900">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_GROOM_INFORMATION"
                  defaultMessage="Groom Information"
                />
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_GROOM_NAME"
                    defaultMessage="Groom Name"
                  />
                </label>
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
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_GROOM_INSTAGRAM_LINK"
                    defaultMessage="Instagram Link"
                  />
                </label>
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
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_GROOM_BIRTH_DATE"
                    defaultMessage="Birth Date"
                  />
                </label>
                <DatePicker
                  className="input"
                  placeholder="Groom Birth Date"
                  format={dateFormat}
                  value={
                    formData.groomBirthDate
                      ? dayjs(formData.groomBirthDate, dateFormat)
                      : null
                  }
                  onChange={handleGroomBirthDateChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_GROOM_COMMUNITY"
                    defaultMessage="Community"
                  />
                </label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="groom_community"
                    placeholder="Groom Community"
                    value={formData.groom_community || ""}
                    onChange={handleCommunityChange}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_GROOM_PHONE_NUMBER"
                    defaultMessage="Phone Number"
                  />
                </label>
                <div className="input">
                  <i className="ki-filled ki-phone"></i>
                  <input
                    className="h-full"
                    type="tel"
                    name="groomMobileno"
                    maxLength={10}
                    minLength={10}
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
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_BRAID_INFORMATION"
                  defaultMessage="Bride Information"
                />
              </p>
            </div>
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_BRAID_NAME"
                    defaultMessage="Bride Name"
                  />
                </label>
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
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_BRAID_INSTAGRAM_LINK"
                    defaultMessage="Instagram Link"
                  />
                </label>
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
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_BRAID_BIRTH_DATE"
                    defaultMessage="Birth Date"
                  />
                </label>
                <DatePicker
                  className="input"
                  placeholder="Bride Birth Date"
                  format={dateFormat}
                  value={
                    formData.brideBirthDate
                      ? dayjs(formData.brideBirthDate, dateFormat)
                      : null
                  }
                  onChange={handleBrideBirthDateChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_BRAID_COMMUNITY"
                    defaultMessage="Community"
                  />
                </label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="bride_community"
                    placeholder="Bride Community"
                    value={formData.bride_community || ""}
                    onChange={handleCommunityChange}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_BRAID_PHONE_NUMBER"
                    defaultMessage="Phone Number"
                  />
                </label>
                <div className="input">
                  <i className="ki-filled ki-phone"></i>
                  <input
                    className="h-full"
                    type="tel"
                    maxLength={10}
                    minLength={10}
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
          refreshData={handleMealTypeAdded}
        />
        <AddMember
          isModalOpen={isMemberModalOpen}
          setIsModalOpen={setIsMemberModalOpen}
          refreshData={handleManagerAdded}
        />
      </div>
    </>
  );
};

export default OtherInfoStep;
