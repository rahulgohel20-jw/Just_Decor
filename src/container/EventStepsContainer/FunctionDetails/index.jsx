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
      <td className="p-3 cursor-grab" {...attributes} {...listeners}>
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
    GetAllFunctionsByUserId()
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
    <div className="rounded-md border border-[#C3C3C3] bg-white">
      {/* Header */}
      <div className="p-3 flex justify-end items-center">
        <button
          className="btn-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={handleAddFunction}
        >
          Add Function <Plus size={16} />
        </button>
      </div>

      {/* General function errors */}
      {errors.eventFunction && typeof errors.eventFunction === "string" && (
        <div className="mx-3 mb-2 text-red-500 text-sm">
          {errors.eventFunction}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-[#C3C3C3] border-t">
          <thead className="text-black font-bold border-b border-[#C3C3C3]">
            <tr>
              <th className="p-3 w-10"></th>
              <th className="p-3">
                <div className="flex items-center gap-2">
                  Function Type
                  <span className="text-red-500">*</span>
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
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Person</th>
              <th className="p-3">Rate</th>
              <th className="p-3">
                Function Venue
                <span className="text-red-500">*</span>
              </th>
              <th className="p-3 text-center">Actions</th>
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
                    <td className="p-2">
                      <div className="flex flex-col">
                        <FunctionTypeDropdown
                          value={func.functionId}
                          onChange={(value) =>
                            handleFunctionSelect(index, value)
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
                      </div>
                    </td>

                    {/* Start Date */}
                    <td className="p-3 w-40">
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
                    </td>

                    {/* End Date */}
                    <td className="p-3 w-40">
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
                    <td className="p-3 w-24">
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
                    <td className="p-3 w-24">
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
                    <td className="p-3 w-40">
                      <div className="flex flex-col">
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
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center w-28">
                      <div className="flex justify-center items-center gap-2">
                        <button type="button" title="Location">
                          <MapPin size={18} className="text-primary" />
                        </button>
                        <button
                          type="button"
                          title="Notes"
                          onClick={() => {
                            setSelectedFunctionIndex(index);
                            setShowNoteModal(true);
                          }}
                        >
                          <StickyNote size={18} className="text-primary" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFunction(index)}
                          title="Remove"
                          disabled={formData.eventFunction.length === 1}
                          className={
                            formData.eventFunction.length === 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </SortableRow>
                ))}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>
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
