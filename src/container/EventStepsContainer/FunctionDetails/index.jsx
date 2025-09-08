import { useEffect, useState } from "react";
import { Input, DatePicker, Tooltip } from "antd";
import dayjs from "dayjs";
import { MapPin, StickyNote, Trash2, Plus, Search } from "lucide-react";
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
import { GetAllFunctionsByUserId } from "@/services/apiServices";

// Row for drag & drop
const SortableRow = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
  errors = {}, // Add errors prop
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

  const getFunctionFieldError = (index, field) => {
    return (
      errors[`eventFunction[${index}].${field}`] ||
      errors[`eventFunction.${index}.${field}`]
    );
  };

  // fetch function types from API
  const FetchFunction = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    GetAllFunctionsByUserId(userData.id)
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
        return {
          ...prev,
          eventFunction: [createEmptyRow()],
        };
      }
      return prev; // keep API data intact
    });
    console.log("eventFunction rows:", formData.eventFunction);
  }, [formData.eventFunction]);

  const handleAddClick = () => {
    setShowFunctionModal(true);
  };

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

  // add new row
  const handleAddFunction = () => {
    setFormData({
      ...formData,
      eventFunction: [...(formData.eventFunction || []), createEmptyRow()],
    });
  };

  // remove row
  const handleRemoveFunction = (index) => {
    const updated = formData.eventFunction.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      eventFunction: updated.length > 0 ? updated : [createEmptyRow()],
    });
  };

  // input change handler
  const handleInputChange = (index, field, value) => {
    const updatedArray = [...formData.eventFunction];
    updatedArray[index][field] = value;
    setFormData({ ...formData, eventFunction: updatedArray });
  };

  // when user selects function type from dropdown
  const handleFunctionSelect = (index, functionId) => {
    const selected = options.find((opt) => opt.value === functionId);
    const updatedArray = [...formData.eventFunction];

    if (selected) {
      const eventStartDate = dayjs(eventStartDateTime, "DD/MM/YYYY");
      const eventEndDate = dayjs(eventEndDateTime, "DD/MM/YYYY");

      const startTime = dayjs(selected.functionstartTime, "HH:mm");
      const endTime = dayjs(selected.functionendTime, "HH:mm");

      updatedArray[index].functionId = functionId;

      updatedArray[index].functionStartDateTime = eventStartDate
        .hour(startTime.hour())
        .minute(startTime.minute())
        .format("DD/MM/YYYY hh:mm A");

      updatedArray[index].functionEndDateTime = eventEndDate
        .hour(endTime.hour())
        .minute(endTime.minute())
        .format("DD/MM/YYYY hh:mm A");
    }

    setFormData({ ...formData, eventFunction: updatedArray });
  };

  // drag & drop
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = formData.eventFunction.findIndex(
        (f) => f.id === active.id
      );
      const newIndex = formData.eventFunction.findIndex(
        (f) => f.id === over.id
      );
      const reordered = arrayMove(formData.eventFunction, oldIndex, newIndex);
      setFormData({ ...formData, eventFunction: reordered });
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      {/* Header */}
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
      {/* General function errors */}
      {errors.eventFunction && typeof errors.eventFunction === "string" && (
        <div className="mx-3 mb-2 text-red-500 text-sm">
          {errors.eventFunction}
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-gray-200 border-t">
          <thead className="text-black font-bold border-b border-gray-200 bg-gray-100">
            <tr>
              <th className="text-sm font-semibold text-gray-900 p-3 w-10"></th>
              <th className="text-sm font-semibold text-gray-900 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center">
                    Function Type
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
                Start Date
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-40">
                End Date
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-24">
                Person
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-24">
                Rate
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 w-40">
                Function Venue
                <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                  *
                </span>
              </th>
              <th className="text-sm font-semibold text-gray-900 p-3 text-center w-40">
                Actions
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
                {formData?.eventFunction?.map((func, index) => (
                  <SortableRow key={func.id || index} id={func.id || index}>
                    {/* Function Type */}
                    <td className="p-3 border-b border-gray-200">
                      <FunctionTypeDropdown
                        value={func.functionId}
                        onChange={(value) => handleFunctionSelect(index, value)}
                        options={options}
                        className={
                          getFunctionFieldError(index, "functionId")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {/* {getFunctionFieldError(index, "functionId") && (
                          <span className="text-red-500 text-xs mt-1">
                            {getFunctionFieldError(index, "functionId")}
                          </span>
                        )} */}
                    </td>
                    {/* Start Date */}
                    <td className="p-3 border-b border-gray-200 w-40">
                      <DatePicker
                        style={{
                          width: "175px",
                          borderColor: getFunctionFieldError(
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
                        options={options}
                        className={
                          getFunctionFieldError(index, "functionId")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {getFunctionFieldError(index, "functionId") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFunctionFieldError(index, "functionId")}
                        </span>
                      )}
                    </td>
                    {/* End Date */}
                    <td className="p-3 border-b border-gray-200 w-40">
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
                      {getFunctionFieldError(index, "functionEndDateTime") && (
                        <div className="text-red-500 text-xs mt-1">
                          {getFunctionFieldError(index, "functionEndDateTime")}
                        </div>
                      )}
                    </td>

                    {/* Person */}
                    <td className="p-3 border-b border-gray-200 w-24">
                      <Input
                        className={`w-full text-center ${getFunctionFieldError(index, "pax") ? "border-red-500" : ""}`}
                        value={func.pax}
                        type="number"
                        onChange={(e) =>
                          handleInputChange(index, "pax", e.target.value)
                        }
                      />
                      {getFunctionFieldError(index, "pax") && (
                        <div className="text-red-500 text-xs mt-1">
                          {getFunctionFieldError(index, "pax")}
                        </div>
                      )}
                    </td>

                    {/* Rate */}
                    <td className="p-3 border-b border-gray-200 w-24">
                      <Input
                        className={`w-full text-center ${getFunctionFieldError(index, "rate") ? "border-red-500" : ""}`}
                        value={func.rate}
                        type="number"
                        placeholder="Rate"
                        onChange={(e) =>
                          handleInputChange(index, "rate", e.target.value)
                        }
                      />
                      {getFunctionFieldError(index, "rate") && (
                        <div className="text-red-500 text-xs mt-1">
                          {getFunctionFieldError(index, "rate")}
                        </div>
                      )}
                    </td>

                    {/* Venue - REQUIRED FIELD */}
                    <td className="p-3 border-b border-gray-200 w-40">
                      <Input
                        className={`w-full ${getFunctionFieldError(index, "function_venue") ? "border-red-500" : ""}`}
                        value={func.function_venue}
                        type="text"
                        placeholder="Function Venue *"
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "function_venue",
                            e.target.value
                          )
                        }
                      />
                      {getFunctionFieldError(index, "function_venue") && (
                        <span className="text-red-500 text-xs mt-1">
                          {getFunctionFieldError(index, "function_venue")}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 border-b border-gray-200 w-40">
                      <div className="text-center">
                        <Tooltip title="Delete item">
                          <button className="btn btn-sm btn-icon btn-clear btn-primary">
                            <i class="ki-filled ki-geolocation"></i>
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
                            <i class="ki-filled ki-add-files"></i>
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
                            <i class="ki-filled ki-trash"></i>
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </SortableRow>
                ))}
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
      {/* Modals */}
      <AddFunctionType
        isOpen={showFunctionModal}
        onClose={() => setShowFunctionModal(false)}
        onSuccess={FetchFunction} // Refresh function list after adding
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
