import { useEffect, useState } from "react";
import { Input, Tooltip } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import FunctionTypeDropdown from "@/components/dropdowns/FunctionTypeDropdown";
import AddFunctionType from "@/partials/modals/add-function-type/AddFunctionType";
import AddNotes from "@/partials/modals/add-notes/AddNotes";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GetAllFunctionsByUserId,
  deleteFunction,
  GetVenueType,
} from "@/services/apiServices";
import { FormattedMessage } from "react-intl";
import Swal from "sweetalert2";
import { useLanguage } from "@/i18n";

const SortableRow = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "default",
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td
        className="p-2 sm:p-3 border-b border-gray-200 cursor-grab"
        {...attributes}
        {...listeners}
      >
        <span
          className="text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          ⠿
        </span>
      </td>
      {children}
    </tr>
  );
};

const FunctionsDetails = ({
  formData,
  setFormData,
  eventStartDateTime,
  eventEndDateTime,
  errors = {},
}) => {
  const { isRTL, locale } = useLanguage();
  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState(null);
  const [venueList, setVenueList] = useState([]);
  const [selectedVenueName, setSelectedVenueName] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLang(storedLang);
    console.log("[FunctionsDetails] Language changed:", storedLang);
  }, [isRTL, locale]);

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

  const getLocalizedVenueName = (venue) => {
    if (!venue) return "";
    return getLocalizedField(venue, "name");
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const Id = localStorage.getItem("userId");
        const res = await GetVenueType(Id);
        const venueArray = res?.data?.data?.["Venue Details"] || [];

        setVenueList(venueArray);

        if (formData.venueId) {
          const selectedVenue = venueArray.find(
            (v) => v.id === formData.venueId,
          );
          if (selectedVenue) {
            const venueName = getLocalizedVenueName(selectedVenue);
            setSelectedVenueName(venueName);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, [formData.venueId, lang]); // ✅ Added lang dependency

  useEffect(() => {
    if (selectedVenueName && formData?.eventFunction?.length > 0) {
      const needsUpdate = formData.eventFunction.some(
        (func) => !func.function_venue || func.function_venue === "",
      );

      if (needsUpdate) {
        setFormData((prev) => ({
          ...prev,
          eventFunction: prev.eventFunction.map((func) =>
            !func.function_venue || func.function_venue === ""
              ? { ...func, function_venue: selectedVenueName }
              : func,
          ),
        }));
      }
    }
  }, [selectedVenueName]);

  const createEmptyRow = () => {
    const newRow = {
      eventFuncId: 0,
      functionId: null,
      functionStartDateTime: null,
      functionEndDateTime: null,
      pax: "",
      rate: "",
      function_venue: selectedVenueName,
      notesEnglish: "",
      notesGujarati: "",
      notesHindi: "",
      sortorder: (formData?.eventFunction?.length || 0) + 1,
      id: Date.now() + Math.random(),
    };

    return newRow;
  };

  const extractDateOnly = (dateTimeString) => {
    if (!dateTimeString) return null;
    return dateTimeString.split(" ")[0];
  };

  const getDuplicateIndices = () => {
    const functions = formData?.eventFunction || [];
    const duplicates = new Set();
    const seen = new Map();

    functions.forEach((func, index) => {
      if (!func.functionId || !func.functionStartDateTime) return;

      const dateOnly = extractDateOnly(func.functionStartDateTime);
      const key = `${func.functionId}-${dateOnly}`;

      if (seen.has(key)) {
        duplicates.add(seen.get(key));
        duplicates.add(index);
      } else {
        seen.set(key, index);
      }
    });

    return duplicates;
  };

  const duplicateIndices = getDuplicateIndices();

  const getFunctionFieldError = (index, field) => {
    return (
      errors[`eventFunction[${index}].${field}`] ||
      errors[`eventFunction.${index}.${field}`]
    );
  };

  const FetchFunction = (autoSelectLatest = false) => {
    const Id = localStorage.getItem("userId");

    GetAllFunctionsByUserId(Id)
      .then((res) => {
        const data = res?.data?.data?.["Function Details"] || [];

        const functionOptions = data.map((item) => ({
          label: getLocalizedField(item, "name"),
          value: item.id,
          functionstartTime: item.startTime,
          functionendTime: item.endTime,
        }));

        setOptions(functionOptions);

        if (!autoSelectLatest || functionOptions.length === 0) return;

        const latestFunction = functionOptions[functionOptions.length - 1];

        setFormData((prev) => {
          const updated = [...prev.eventFunction];

          let targetIndex = activeRowIndex;

          if (targetIndex === null || !updated[targetIndex]) {
            updated.push(createEmptyRow());
            targetIndex = updated.length - 1;
          }

          const row = updated[targetIndex];

          const eventStartDate = dayjs(
            eventStartDateTime,
            "DD/MM/YYYY hh:mm A",
          );
          const eventEndDate = dayjs(eventEndDateTime, "DD/MM/YYYY hh:mm A");

          const startTime = dayjs(latestFunction.functionstartTime, "HH:mm");
          const endTime = dayjs(latestFunction.functionendTime, "HH:mm");

          const baseStartDate = row.functionStartDateTime
            ? dayjs(row.functionStartDateTime, "DD/MM/YYYY hh:mm A")
            : eventStartDate;

          const baseEndDate = row.functionEndDateTime
            ? dayjs(row.functionEndDateTime, "DD/MM/YYYY hh:mm A")
            : eventEndDate;

          updated[targetIndex] = {
            ...row,
            functionId: latestFunction.value,
            functionStartDateTime: baseStartDate
              .hour(startTime.hour())
              .minute(startTime.minute())
              .format("DD/MM/YYYY hh:mm A"),
            functionEndDateTime: baseEndDate
              .hour(endTime.hour())
              .minute(endTime.minute())
              .format("DD/MM/YYYY hh:mm A"),
          };

          return {
            ...prev,
            eventFunction: updated,
          };
        });
      })
      .catch((err) => console.error("Error fetching functions:", err));
  };

  useEffect(() => {
    FetchFunction();
    setFormData((prev) => {
      if (!prev.eventFunction || prev.eventFunction.length === 0) {
        return { ...prev, eventFunction: [createEmptyRow()] };
      }
      return prev;
    });
  }, [selectedVenueName, lang]); // ✅ Added lang dependency

  const handleAddClick = () => setShowFunctionModal(true);

  const handleSaveNotes = (notes) => {
    if (selectedFunctionIndex === null) return;
    const updatedArray = [...formData.eventFunction];
    updatedArray[selectedFunctionIndex].notesEnglish = notes.notesEnglish;
    updatedArray[selectedFunctionIndex].notesGujarati = notes.notesGujarati;
    updatedArray[selectedFunctionIndex].notesHindi = notes.notesHindi;
    setFormData({ ...formData, eventFunction: updatedArray });
    setShowNoteModal(false);
    setSelectedFunctionIndex(null);
  };

  const handleAddFunction = () => {
    const newFunction = createEmptyRow();

    setFormData({
      ...formData,
      eventFunction: [...(formData.eventFunction || []), newFunction],
    });
  };

  const handleRemoveFunction = async (index) => {
    const functionToRemove = formData.eventFunction[index];
    const hasEventFuncId =
      functionToRemove.eventFuncId && functionToRemove.eventFuncId !== 0;

    if (hasEventFuncId) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this function?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#005BA8",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        background: "#f5faff",
        color: "#003f73",
        customClass: {
          popup: "rounded-2xl shadow-xl",
          title: "text-2xl font-bold",
          confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
          cancelButton: "px-6 py-2 text-white font-semibold rounded-lg",
        },
      });

      if (!result.isConfirmed) return;

      try {
        const response = await deleteFunction(functionToRemove.eventFuncId);
        if (
          response?.data?.msg?.toLowerCase().includes("success") ||
          response?.data?.status === 200 ||
          response?.status === 200
        ) {
          setFormData((prev) => {
            const updated = prev.eventFunction.filter((_, i) => i !== index);
            return {
              ...prev,
              eventFunction: updated.length > 0 ? updated : [createEmptyRow()],
            };
          });
          Swal.fire({
            title: "Deleted!",
            text: "Function deleted successfully.",
            icon: "success",
            confirmButtonColor: "#005BA8",
            background: "#f5faff",
            color: "#003f73",
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: "rounded-2xl shadow-xl" },
          });
        } else {
          Swal.fire({
            title: "Delete Failed!",
            text: response?.data?.msg || "Failed to delete.",
            icon: "error",
            confirmButtonColor: "#005BA8",
            background: "#f5faff",
            color: "#003f73",
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });
        }
      } catch (err) {
        console.error("Error deleting function:", err);
        let errorMessage = "An error occurred.";
        if (err.code === "ERR_NETWORK") errorMessage = "Network error.";
        else if (err.response)
          errorMessage =
            err.response?.data?.msg || `Server error: ${err.response.status}`;
        else if (err.message) errorMessage = err.message;
        Swal.fire({
          title: "Delete Failed!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#005BA8",
          background: "#f5faff",
          color: "#003f73",
          customClass: {
            popup: "rounded-2xl shadow-xl",
            title: "text-2xl font-bold",
            confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
          },
        });
      }
    } else {
      setFormData((prev) => {
        const updated = prev.eventFunction.filter((_, i) => i !== index);
        return {
          ...prev,
          eventFunction: updated.length > 0 ? updated : [createEmptyRow()],
        };
      });
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedArray = [...formData.eventFunction];
    updatedArray[index][field] = value;

    const functionsWithSortOrder = updatedArray.map((func, idx) => ({
      ...func,
      sortorder: idx + 1,
    }));

    setFormData({ ...formData, eventFunction: functionsWithSortOrder });
  };

  const sortFunctionsByDateTime = (functions) => {
    const sorted = [...functions].sort((a, b) => {
      if (!a.functionStartDateTime) return 1;
      if (!b.functionStartDateTime) return -1;
      return (
        dayjs(a.functionStartDateTime, "DD/MM/YYYY hh:mm A").valueOf() -
        dayjs(b.functionStartDateTime, "DD/MM/YYYY hh:mm A").valueOf()
      );
    });

    return sorted.map((func, index) => ({
      ...func,
      sortorder: index + 1,
    }));
  };

  const handleFunctionSelect = (index, functionId) => {
    const selected = options.find((opt) => opt.value === functionId);
    const updatedArray = [...formData.eventFunction];
    if (!selected) return;

    const currentRow = updatedArray[index];

    const eventStartDate = dayjs(eventStartDateTime, "DD/MM/YYYY hh:mm A");
    const eventEndDate = dayjs(eventEndDateTime, "DD/MM/YYYY hh:mm A");
    const startTime = dayjs(selected.functionstartTime, "HH:mm");
    const endTime = dayjs(selected.functionendTime, "HH:mm");

    const baseStartDate = currentRow.functionStartDateTime
      ? dayjs(currentRow.functionStartDateTime, "DD/MM/YYYY hh:mm A")
      : eventStartDate;

    const baseEndDate = currentRow.functionEndDateTime
      ? dayjs(currentRow.functionEndDateTime, "DD/MM/YYYY hh:mm A")
      : eventEndDate;

    updatedArray[index].functionStartDateTime = baseStartDate
      .hour(startTime.hour())
      .minute(startTime.minute())
      .format("DD/MM/YYYY hh:mm A");

    updatedArray[index].functionEndDateTime = baseEndDate
      .hour(endTime.hour())
      .minute(endTime.minute())
      .format("DD/MM/YYYY hh:mm A");

    updatedArray[index].functionId = functionId;

    setFormData({
      ...formData,
      eventFunction: updatedArray,
    });
  };

  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formData.eventFunction.findIndex(
      (f) => f.id === active.id,
    );
    const newIndex = formData.eventFunction.findIndex((f) => f.id === over.id);

    const reorderedFunctions = arrayMove(
      formData.eventFunction,
      oldIndex,
      newIndex,
    );

    const functionsWithSortOrder = reorderedFunctions.map((func, index) => ({
      ...func,
      sortorder: index + 1,
    }));

    setFormData({
      ...formData,
      eventFunction: functionsWithSortOrder,
    });
  };

  const hasDuplicateError =
    errors.eventFunction &&
    typeof errors.eventFunction === "string" &&
    errors.eventFunction.toLowerCase().includes("duplicate");

  // Helper to parse date string to Date object
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const parsed = dayjs(dateStr, "DD/MM/YYYY hh:mm A", true);
      return parsed.isValid() ? parsed.toDate() : null;
    } catch (error) {
      return null;
    }
  };

  // ✅ Handler for when a new function type is added
  const handleFunctionTypeAdded = () => {
    FetchFunction(true); // Auto-select the newly added function
  };

  // Add this component before the return statement in FunctionsDetails
  const MobileFunctionCard = ({
    func,
    index,
    isDuplicate,
    duplicateIndices,
    options,
    handleFunctionSelect,
    setActiveRowIndex,
    getFunctionFieldError,
    parseDate,
    handleInputChange,
    setSelectedFunctionIndex,
    setShowNoteModal,
    handleRemoveFunction,
    formData,
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: func.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`m-2 sm:m-3 p-3 sm:p-4 border rounded-lg ${
          isDuplicate ? "bg-red-50 border-red-300" : "bg-white border-gray-200"
        }`}
      >
        {/* Card Header with Drag Handle */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span
              {...attributes}
              {...listeners}
              className="cursor-grab text-gray-400 hover:text-gray-600 text-lg"
            >
              ⠿
            </span>
            <span className="text-sm font-semibold text-gray-700">
              <FormattedMessage
                id="USER.DASHBOARD.FUNCTION"
                defaultMessage="Function"
              />{" "}
              #{index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip title="Add Notes">
              <button
                className="btn btn-xs btn-icon btn-clear btn-success"
                onClick={() => {
                  setSelectedFunctionIndex(index);
                  setShowNoteModal(true);
                }}
              >
                <i className="ki-filled ki-add-files text-sm"></i>
              </button>
            </Tooltip>
            <Tooltip title="Remove">
              <button
                onClick={() => handleRemoveFunction(index)}
                disabled={formData.eventFunction.length === 1}
                className={
                  formData.eventFunction.length === 1
                    ? "btn btn-xs btn-icon btn-clear btn-danger opacity-50 cursor-not-allowed"
                    : "btn btn-xs btn-icon btn-clear btn-danger"
                }
              >
                <i className="ki-filled ki-trash text-sm"></i>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Function Type */}
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            <FormattedMessage
              id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_FUNCTION_TYPE"
              defaultMessage="Functions"
            />
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <FunctionTypeDropdown
            value={func.functionId || undefined}
            onChange={(value) => handleFunctionSelect(index, value)}
            onFocus={() => setActiveRowIndex(index)}
            options={options}
            placeholder="Select Function"
            className="w-full"
            style={{
              borderColor:
                isDuplicate || getFunctionFieldError(index, "functionId")
                  ? "#ef4444"
                  : undefined,
            }}
          />
          {getFunctionFieldError(index, "functionId") && (
            <span className="text-red-500 text-xs mt-1 block">
              {getFunctionFieldError(index, "functionId")}
            </span>
          )}
          {isDuplicate && duplicateIndices.has(index) && (
            <span className="text-red-500 text-xs mt-1 block">
              ⚠️ Duplicate function on same date
            </span>
          )}
        </div>

        {/* Date Times - Two Column Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_START_DATE"
                defaultMessage="Start Date"
              />
            </label>
            <DatePicker
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs"
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={30}
              dateFormat="dd/MM/yyyy hh:mm aa"
              selected={parseDate(func.functionStartDateTime)}
              onChange={(date) => {
                if (date) {
                  handleInputChange(
                    index,
                    "functionStartDateTime",
                    dayjs(date).format("DD/MM/YYYY hh:mm A"),
                  );
                } else {
                  handleInputChange(index, "functionStartDateTime", null);
                }
              }}
              placeholderText="Start date"
            />
            {getFunctionFieldError(index, "functionStartDateTime") && (
              <div className="text-red-500 text-xs mt-1">
                {getFunctionFieldError(index, "functionStartDateTime")}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_END_DATE"
                defaultMessage="End Date"
              />
            </label>
            <DatePicker
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs"
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={30}
              dateFormat="dd/MM/yyyy hh:mm aa"
              selected={parseDate(func.functionEndDateTime)}
              onChange={(date) => {
                if (date) {
                  handleInputChange(
                    index,
                    "functionEndDateTime",
                    dayjs(date).format("DD/MM/YYYY hh:mm A"),
                  );
                } else {
                  handleInputChange(index, "functionEndDateTime", null);
                }
              }}
              placeholderText="End date"
            />
            {getFunctionFieldError(index, "functionEndDateTime") && (
              <div className="text-red-500 text-xs mt-1">
                {getFunctionFieldError(index, "functionEndDateTime")}
              </div>
            )}
          </div>
        </div>

        {/* Person, Rate, Venue - Three Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_PERSON"
                defaultMessage="Person"
              />
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <Input
              className="w-full text-xs"
              value={func.pax}
              type="text"
              placeholder="Person"
              onChange={(e) => handleInputChange(index, "pax", e.target.value)}
            />
            {getFunctionFieldError(index, "pax") && (
              <div className="text-red-500 text-xs mt-1">
                {getFunctionFieldError(index, "pax")}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_RATE"
                defaultMessage="Rate"
              />
            </label>
            <Input
              className="w-full text-xs"
              value={func.rate}
              type="text"
              placeholder="Rate"
              onChange={(e) => handleInputChange(index, "rate", e.target.value)}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_VENUE"
                defaultMessage="Venue"
              />
            </label>
            <Input
              className="w-full text-xs"
              value={func.function_venue}
              type="text"
              placeholder="Venue"
              onChange={(e) =>
                handleInputChange(index, "function_venue", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <div className="p-2 sm:p-3 flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          <FormattedMessage
            id="USER.DASHBOARD.FUNCTIONS_LIST"
            defaultMessage="Functions List"
          />
        </h3>
        <Tooltip
          title={
            <FormattedMessage
              id="USER.DASHBOARD.ADD_FUNCTION"
              defaultMessage="Add Function"
            />
          }
        >
          <button
            className="btn btn-primary btn-sm text-xs sm:text-sm"
            onClick={handleAddFunction}
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />{" "}
            <span className="hidden sm:inline">
              <FormattedMessage
                id="USER.DASHBOARD.CREATE_NEW_FUNCTION"
                defaultMessage="Create New Function"
              />
            </span>
            <span className="sm:hidden">
              <FormattedMessage id="COMMON.ADD" defaultMessage="Add" />
            </span>
          </button>
        </Tooltip>
      </div>

      {errors.eventFunction && typeof errors.eventFunction === "string" && (
        <div className="mx-2 sm:mx-3 mb-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs sm:text-sm">
          <strong>⚠️ {errors.eventFunction}</strong>
        </div>
      )}

      {/* Desktop Table View - Hidden on Mobile/Tablet */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-sm text-left border-gray-200 border-t">
            <thead className="text-black font-bold border-b border-gray-200 bg-gray-100">
              <tr>
                <th className="text-sm font-semibold text-gray-900 p-3 w-12"></th>
                <th className="text-sm font-semibold text-gray-900 p-2 sm:p-3 min-w-[150px] sm:w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center">
                      <FormattedMessage
                        id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_FUNCTION_TYPE"
                        defaultMessage="Functions"
                      />
                      <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                        *
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddClick}
                      title="Add Function Type"
                      className="btn btn-primary flex items-center justify-center rounded-full p-0 w-6 h-6"
                    >
                      <i className="ki-filled ki-plus"></i>
                    </button>
                  </div>
                </th>
                <th className="text-sm font-semibold text-gray-900 p-2 sm:p-3 min-w-[180px] sm:w-[200px]">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_START_DATE"
                    defaultMessage="Start Date"
                  />
                </th>
                <th className="text-sm font-semibold text-gray-900 p-2 sm:p-3 min-w-[180px] sm:w-[200px]">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_END_DATE"
                    defaultMessage="End Date"
                  />
                </th>
                <th className="text-sm font-semibold text-gray-900 p-2 sm:p-3 min-w-[100px]">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_PERSON"
                    defaultMessage="Person"
                  />
                  <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                    *
                  </span>
                </th>
                <th className="text-sm font-semibold text-gray-900 p-2 sm:p-3 min-w-[100px]">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_RATE"
                    defaultMessage="Rate"
                  />
                </th>
                <th className="text-sm font-semibold text-gray-900 p-2 sm:p-3 min-w-[150px]">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_VENUE"
                    defaultMessage=" Venue"
                  />
                </th>
                <th className="text-sm font-semibold text-gray-900 p-2 sm:p-3 text-center min-w-[120px]">
                  <FormattedMessage
                    id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_ACTIONS"
                    defaultMessage="Actions"
                  />
                </th>
              </tr>
            </thead>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.eventFunction?.map((f) => f.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {formData?.eventFunction?.map((func, index) => {
                    const isDuplicate =
                      duplicateIndices.has(index) || hasDuplicateError;

                    return (
                      <SortableRow key={func.id || index} id={func.id || index}>
                        <td
                          className={`p-2 sm:p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} `}
                        >
                          <FunctionTypeDropdown
                            value={func.functionId || undefined}
                            onChange={(value) =>
                              handleFunctionSelect(index, value)
                            }
                            onFocus={() => setActiveRowIndex(index)}
                            options={options}
                            placeholder="Select Function"
                            style={{
                              borderColor:
                                isDuplicate ||
                                getFunctionFieldError(index, "functionId")
                                  ? "#ef4444"
                                  : undefined,
                              width: "100%",
                            }}
                          />
                          {getFunctionFieldError(index, "functionId") && (
                            <span className="text-red-500 text-xs mt-1 block">
                              {getFunctionFieldError(index, "functionId")}
                            </span>
                          )}
                          {isDuplicate && duplicateIndices.has(index) && (
                            <span className="text-red-500 text-xs mt-1 block">
                              ⚠️ Duplicate function on same date
                            </span>
                          )}
                        </td>
                        <td
                          className={`p-2 sm:p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} `}
                        >
                          <DatePicker
                            className="w-full border border-gray-500 rounded px px-2 py-1"
                            showTimeSelect
                            timeFormat="hh:mm aa"
                            timeIntervals={30}
                            dateFormat="dd/MM/yyyy hh:mm aa"
                            selected={parseDate(func.functionStartDateTime)}
                            onChange={(date) => {
                              if (date) {
                                handleInputChange(
                                  index,
                                  "functionStartDateTime",
                                  dayjs(date).format("DD/MM/YYYY hh:mm A"),
                                );
                              } else {
                                handleInputChange(
                                  index,
                                  "functionStartDateTime",
                                  null,
                                );
                              }
                            }}
                            placeholderText="Select start date"
                            style={{
                              borderColor:
                                isDuplicate ||
                                getFunctionFieldError(
                                  index,
                                  "functionStartDateTime",
                                )
                                  ? "#ef4444"
                                  : undefined,
                            }}
                          />
                        </td>
                        <td
                          className={`p-2 sm:p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"}`}
                        >
                          <DatePicker
                            className="w-full border border-gray-500 rounded px px-2 py-1"
                            showTimeSelect
                            timeFormat="hh:mm aa"
                            timeIntervals={30}
                            dateFormat="dd/MM/yyyy hh:mm aa"
                            selected={parseDate(func.functionEndDateTime)}
                            onChange={(date) => {
                              if (date) {
                                handleInputChange(
                                  index,
                                  "functionEndDateTime",
                                  dayjs(date).format("DD/MM/YYYY hh:mm A"),
                                );
                              } else {
                                handleInputChange(
                                  index,
                                  "functionEndDateTime",
                                  null,
                                );
                              }
                            }}
                            placeholderText="Select end date"
                            style={{
                              borderColor: getFunctionFieldError(
                                index,
                                "functionEndDateTime",
                              )
                                ? "#ef4444"
                                : undefined,
                            }}
                          />
                          {getFunctionFieldError(
                            index,
                            "functionStartDateTime",
                          ) && (
                            <div className="text-red-500 text-xs mt-1">
                              {getFunctionFieldError(
                                index,
                                "functionStartDateTime",
                              )}
                            </div>
                          )}
                          {getFunctionFieldError(
                            index,
                            "functionEndDateTime",
                          ) && (
                            <div className="text-red-500 text-xs mt-1">
                              {getFunctionFieldError(
                                index,
                                "functionEndDateTime",
                              )}
                            </div>
                          )}
                        </td>
                        <td
                          className={`p-2 sm:p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"}`}
                        >
                          <Input
                            className="w-full text-center"
                            value={func.pax}
                            type="text"
                            onChange={(e) =>
                              handleInputChange(index, "pax", e.target.value)
                            }
                            required
                          />
                          {getFunctionFieldError(index, "pax") && (
                            <div className="text-red-500 text-xs mt-1">
                              {getFunctionFieldError(index, "pax")}
                            </div>
                          )}
                        </td>
                        <td
                          className={`p-2 sm:p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} `}
                        >
                          <Input
                            className="w-full text-center"
                            value={func.rate}
                            type="text"
                            placeholder="Rate"
                            onChange={(e) =>
                              handleInputChange(index, "rate", e.target.value)
                            }
                          />
                        </td>
                        <td
                          className={`p-2 sm:p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} `}
                        >
                          <Input
                            className="w-full"
                            value={func.function_venue}
                            type="text"
                            placeholder="Function Venue"
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "function_venue",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td
                          className={`p-2 sm:p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"}`}
                        >
                          <div className="flex justify-center items-center gap-1 sm:gap-2">
                            <Tooltip title="Add Notes">
                              <button
                                className="btn btn-sm btn-icon btn-clear btn-success"
                                onClick={() => {
                                  setSelectedFunctionIndex(index);
                                  setShowNoteModal(true);
                                }}
                              >
                                <i className="ki-filled ki-add-files"></i>
                              </button>
                            </Tooltip>
                            <Tooltip title="Remove">
                              <button
                                onClick={() => handleRemoveFunction(index)}
                                disabled={formData.eventFunction.length === 1}
                                className={
                                  formData.eventFunction.length === 1
                                    ? "btn btn-sm btn-icon btn-clear btn-danger opacity-50 cursor-not-allowed"
                                    : "btn btn-sm btn-icon btn-clear btn-danger"
                                }
                              >
                                <i className="ki-filled ki-trash"></i>
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </SortableRow>
                    );
                  })}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View - Hidden on Desktop */}
      <div className="lg:hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={formData.eventFunction?.map((f) => f.id) || []}
            strategy={verticalListSortingStrategy}
          >
            {formData?.eventFunction?.map((func, index) => {
              const isDuplicate =
                duplicateIndices.has(index) || hasDuplicateError;

              return (
                <MobileFunctionCard
                  key={func.id || index}
                  func={func}
                  index={index}
                  isDuplicate={isDuplicate}
                  duplicateIndices={duplicateIndices}
                  options={options}
                  handleFunctionSelect={handleFunctionSelect}
                  setActiveRowIndex={setActiveRowIndex}
                  getFunctionFieldError={getFunctionFieldError}
                  parseDate={parseDate}
                  handleInputChange={handleInputChange}
                  setSelectedFunctionIndex={setSelectedFunctionIndex}
                  setShowNoteModal={setShowNoteModal}
                  handleRemoveFunction={handleRemoveFunction}
                  formData={formData}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      <div className="p-2 sm:p-3 flex justify-center border-t border-gray-200">
        <Tooltip title="Add Function">
          <button
            className="btn btn-primary btn-sm text-xs sm:text-sm w-full sm:w-auto"
            onClick={handleAddFunction}
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />{" "}
            <FormattedMessage
              id="USER.DASHBOARD.CREATE_NEW"
              defaultMessage="Create New"
            />
          </button>
        </Tooltip>
      </div>
      <AddFunctionType
        isOpen={showFunctionModal}
        onClose={() => setShowFunctionModal(false)}
        onSuccess={() => FetchFunction(true)}
        refreshData={() => FetchFunction(true)}
      />
      <AddNotes
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        initialNotes={
          selectedFunctionIndex !== null
            ? {
                notesEnglish:
                  formData.eventFunction[selectedFunctionIndex]?.notesEnglish ||
                  "",
                notesGujarati:
                  formData.eventFunction[selectedFunctionIndex]
                    ?.notesGujarati || "",
                notesHindi:
                  formData.eventFunction[selectedFunctionIndex]?.notesHindi ||
                  "",
              }
            : { notesEnglish: "", notesGujarati: "", notesHindi: "" }
        }
        onSave={handleSaveNotes}
      />
    </div>
  );
};

export default FunctionsDetails;
