import { useEffect, useState } from "react";
import { Input, DatePicker, Tooltip } from "antd";
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
} from "@/services/apiServices";
import { FormattedMessage } from "react-intl";
import Swal from "sweetalert2";

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
        className="p-3 border-b border-gray-200 cursor-grab"
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
  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState(null);

  const createEmptyRow = () => ({
    eventFuncId: 0,
    functionId: null,
    functionStartDateTime: null,
    functionEndDateTime: null,
    pax: "",
    rate: "",
    function_venue: "",
    notesEnglish: "",
    notesGujarati: "",
    notesHindi: "",
    id: Date.now() + Math.random(),
  });

  // Helper to extract date only
  const extractDateOnly = (dateTimeString) => {
    if (!dateTimeString) return null;
    return dateTimeString.split(" ")[0];
  };

  // Check which rows are duplicates for highlighting
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

  const FetchFunction = () => {
    const Id = localStorage.getItem("userId");
    GetAllFunctionsByUserId(Id)
      .then((res) => {
        const data = res?.data?.data?.["Function Details"] || [];
        setOptions(
          data.map((item) => ({
            label: item.nameEnglish,
            value: item.id,
            functionstartTime: item.startTime,
            functionendTime: item.endTime,
          }))
        );
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
  }, []);

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
    setFormData({
      ...formData,
      eventFunction: [...(formData.eventFunction || []), createEmptyRow()],
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
    setFormData({ ...formData, eventFunction: updatedArray });
  };

  const sortFunctionsByDateTime = (functions) => {
    return [...functions].sort((a, b) => {
      if (!a.functionStartDateTime) return 1;
      if (!b.functionStartDateTime) return -1;
      return (
        dayjs(a.functionStartDateTime, "DD/MM/YYYY hh:mm A").valueOf() -
        dayjs(b.functionStartDateTime, "DD/MM/YYYY hh:mm A").valueOf()
      );
    });
  };

  const handleFunctionSelect = (index, functionId) => {
    const selected = options.find((opt) => opt.value === functionId);
    const updatedArray = [...formData.eventFunction];
    if (!selected) return;

    const currentRow = updatedArray[index];
    if (!currentRow.functionStartDateTime && !currentRow.functionEndDateTime) {
      const eventStartDate = dayjs(eventStartDateTime, "DD/MM/YYYY hh:mm A");
      const eventEndDate = dayjs(eventEndDateTime, "DD/MM/YYYY hh:mm A");
      const startTime = dayjs(selected.functionstartTime, "HH:mm");
      const endTime = dayjs(selected.functionendTime, "HH:mm");

      updatedArray[index].functionStartDateTime = eventStartDate
        .hour(startTime.hour())
        .minute(startTime.minute())
        .format("DD/MM/YYYY hh:mm A");
      updatedArray[index].functionEndDateTime = eventEndDate
        .hour(endTime.hour())
        .minute(endTime.minute())
        .format("DD/MM/YYYY hh:mm A");
    }

    updatedArray[index].functionId = functionId;
    setFormData({
      ...formData,
      eventFunction: sortFunctionsByDateTime(updatedArray),
    });
  };

  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = formData.eventFunction.findIndex(
      (f) => f.id === active.id
    );
    const newIndex = formData.eventFunction.findIndex((f) => f.id === over.id);
    setFormData({
      ...formData,
      eventFunction: arrayMove(formData.eventFunction, oldIndex, newIndex),
    });
  };

  // Check if there's a general eventFunction error (from Yup duplicate validation)
  const hasDuplicateError =
    errors.eventFunction &&
    typeof errors.eventFunction === "string" &&
    errors.eventFunction.toLowerCase().includes("duplicate");

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <div className="p-3 flex justify-end items-center">
        <Tooltip title="Add Function">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddFunction}
          >
            <Plus size={16} /> Add Function
          </button>
        </Tooltip>
      </div>

      {/* Show duplicate error message */}
      {errors.eventFunction && typeof errors.eventFunction === "string" && (
        <div className="mx-3 mb-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          <strong>⚠️ {errors.eventFunction}</strong>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-gray-200 border-t">
          <thead className="text-black font-bold border-b border-gray-200 bg-gray-100">
            <tr>
              <th className="text-sm font-semibold text-gray-900 p-3 w-10"></th>
              <th className="text-sm font-semibold text-gray-900 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center">
                    <FormattedMessage
                      id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_FUNCTION_TYPE"
                      defaultMessage="Function Type"
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
              <th className="text-sm font-semibold text-gray-900 p-3 w-40">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_START_DATE"
                  defaultMessage="Start Date"
                />
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-40">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_END_DATE"
                  defaultMessage="End Date"
                />
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-24">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_PERSON"
                  defaultMessage="Person"
                />
                <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                  *
                </span>
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-24">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_RATE"
                  defaultMessage="Rate"
                />
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-40">
                <FormattedMessage
                  id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_VENUE"
                  defaultMessage="Function Venue"
                />
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 text-center w-40">
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
                        className={`p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"}`}
                      >
                        <FunctionTypeDropdown
                          value={func.functionId || undefined}
                          onChange={(value) =>
                            handleFunctionSelect(index, value)
                          }
                          options={options}
                          placeholder="Select Function"
                          style={{
                            borderColor:
                              isDuplicate ||
                              getFunctionFieldError(index, "functionId")
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
                      </td>
                      <td
                        className={`p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} w-40`}
                      >
                        <DatePicker
                          style={{
                            width: "175px",
                            borderColor:
                              isDuplicate ||
                              getFunctionFieldError(
                                index,
                                "functionStartDateTime"
                              )
                                ? "#ef4444"
                                : undefined,
                          }}
                          showTime={{ format: "hh:mm A" }}
                          format="DD/MM/YYYY hh:mm A"
                          value={
                            func.functionStartDateTime
                              ? dayjs(
                                  func.functionStartDateTime,
                                  "DD/MM/YYYY hh:mm A"
                                )
                              : null
                          }
                          onChange={(date) =>
                            handleInputChange(
                              index,
                              "functionStartDateTime",
                              date
                                ? dayjs(date).format("DD/MM/YYYY hh:mm A")
                                : null
                            )
                          }
                        />
                      </td>
                      <td
                        className={`p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} w-40`}
                      >
                        <DatePicker
                          style={{
                            width: "175px",
                            borderColor: getFunctionFieldError(
                              index,
                              "functionEndDateTime"
                            )
                              ? "#ef4444"
                              : undefined,
                          }}
                          showTime={{ format: "hh:mm A" }}
                          format="DD/MM/YYYY hh:mm A"
                          value={
                            func.functionEndDateTime
                              ? dayjs(
                                  func.functionEndDateTime,
                                  "DD/MM/YYYY hh:mm A"
                                )
                              : null
                          }
                          onChange={(date) =>
                            handleInputChange(
                              index,
                              "functionEndDateTime",
                              date
                                ? dayjs(date).format("DD/MM/YYYY hh:mm A")
                                : null
                            )
                          }
                        />
                        {getFunctionFieldError(
                          index,
                          "functionStartDateTime"
                        ) && (
                          <div className="text-red-500 text-xs mt-1">
                            {getFunctionFieldError(
                              index,
                              "functionStartDateTime"
                            )}
                          </div>
                        )}
                        {getFunctionFieldError(
                          index,
                          "functionEndDateTime"
                        ) && (
                          <div className="text-red-500 text-xs mt-1">
                            {getFunctionFieldError(
                              index,
                              "functionEndDateTime"
                            )}
                          </div>
                        )}
                      </td>
                      <td
                        className={`p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} w-24`}
                      >
                        <Input
                          className="w-full text-center"
                          value={func.pax}
                          type="number"
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
                        className={`p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} w-24`}
                      >
                        <Input
                          className="w-full text-center"
                          value={func.rate}
                          type="number"
                          placeholder="Rate"
                          onChange={(e) =>
                            handleInputChange(index, "rate", e.target.value)
                          }
                        />
                      </td>
                      <td
                        className={`p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} w-40`}
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
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td
                        className={`p-3 border-b ${isDuplicate ? "bg-red-50 border-red-200" : "border-gray-200"} w-40`}
                      >
                        <div className="text-center">
                          <Tooltip title="Map">
                            <button className="btn btn-sm btn-icon btn-clear btn-primary">
                              <i className="ki-filled ki-geolocation"></i>
                            </button>
                          </Tooltip>
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
      <div className="p-3 flex justify-center">
        <Tooltip title="Add Function">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddFunction}
          >
            <Plus size={16} /> Add Function
          </button>
        </Tooltip>
      </div>
      <AddFunctionType
        isOpen={showFunctionModal}
        onClose={() => setShowFunctionModal(false)}
        onSuccess={FetchFunction}
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
