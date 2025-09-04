import { useEffect, useState } from "react";
import { Input, DatePicker } from "antd";
import { toAbsoluteUrl } from "@/utils/Assets";
import dayjs from "dayjs";
import { KeenIcon } from "@/components";
import {
  MapPin,
  StickyNote,
  Trash2,
  Plus,
  Search,
  GripVertical,
} from "lucide-react";
import FunctionTypeDropdown from "@/components/dropdowns/FunctionTypeDropdown";
import AddFunctionType from "@/partials/modals/add-function-type/AddFunctionType";
import AddNotes from "@/partials/modals/add-notes/AddNotes";
import { Tooltip } from "antd";
import useStyles from "./style";
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
        className="py-3 px-2 border-b border-gray-200 w-40 text-center cursor-grab"
        {...attributes}
        {...listeners}
      >
        <Tooltip title="Drag to reorder">
          <GripVertical className="text-gray-700 hover:text-primary" />
        </Tooltip>
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
  const classes = useStyles();
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
    <div className={`flex flex-col ${classes.customStyle}`}>
      {/* General function errors */}
      {errors.eventFunction && typeof errors.eventFunction === "string" && (
        <div className="mx-3 mb-2 text-red-500 text-sm">
          {errors.eventFunction}
        </div>
      )}
      {/* Table */}
      <div className="card min-w-full mb-2">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col p-4">
            <h3 className="text-lg font-semibold leading-none text-gray-900">
              Functions
            </h3>
          </div>
          <table className="w-full table-fixed border-t border-gray-200">
            <thead className="bg-gray-100 font-bold">
              <tr>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200 w-10"></th>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[185px] flex items-center gap-2">
                    <span className="flex items-center">
                      Function Type
                      <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                        *
                      </span>
                    </span>
                    <Tooltip title="Add Function Type">
                      <button
                        type="button"
                        onClick={handleAddClick}
                        className="btn btn-primary flex items-center justify-center rounded-full p-0 w-6 h-6"
                      >
                        <i className="ki-filled ki-plus text-sm"></i>
                      </button>
                    </Tooltip>
                  </div>
                </th>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200 w-40 text-start">
                  Start Date
                </th>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200 w-40 text-start">
                  End Date
                </th>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200 w-40 text-start">
                  Person
                </th>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200 w-40 text-start">
                  Rate
                </th>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200 w-40 text-start">
                  Function Venue
                  <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                    *
                  </span>
                </th>
                <th className="text-sm font-semibold text-gray-900 py-2.5 px-2 border-b border-gray-200 w-40 text-center">
                  Action
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
                      <td className="py-3 px-2 border-b border-gray-200">
                        <div className="select__grp flex flex-col">
                          <div className="sg__inner flex items-center gap-1 relative">
                            <FunctionTypeDropdown
                              className="input"
                              value={func.functionId}
                              onChange={(value) =>
                                handleFunctionSelect(index, value)
                              }
                              options={options}
                              // className={
                              //   getFunctionFieldError(index, "functionId")
                              //     ? "border-red-500"
                              //     : ""
                              // }
                            />
                            {getFunctionFieldError(index, "functionId") && (
                              <span className="text-red-500 text-xs mt-1">
                                {getFunctionFieldError(index, "functionId")}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Start Date */}
                      <td className="py-3 px-2 border-b border-gray-200 w-40">
                        <DatePicker
                          className="input "
                          // style={{
                          //   width: "175px",
                          //   borderColor: getFunctionFieldError(
                          //     index,
                          //     "functionStartDateTime"
                          //   )
                          //     ? "#ef4444"
                          //     : undefined,
                          // }}
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
                      <td className="py-3 px-2 border-b border-gray-200 w-40">
                        <DatePicker
                          className="input "
                          // style={{
                          //   width: "175px",
                          //   borderColor: getFunctionFieldError(
                          //     index,
                          //     "functionEndDateTime"
                          //   )
                          //     ? "#ef4444"
                          //     : undefined,
                          // }}
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
                      {/* Person */}
                      <td className="py-3 px-2 border-b border-gray-200 w-40">
                        <input
                          className={`input ${getFunctionFieldError(index, "pax") ? "border-red-500" : ""}`}
                          value={func.pax}
                          type="number"
                          placeholder="Person"
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
                      <td className="py-3 px-2 border-b border-gray-200 w-40">
                        <input
                          className={`input ${getFunctionFieldError(index, "rate") ? "border-red-500" : ""}`}
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
                      <td className="py-3 px-2 border-b border-gray-200 w-40">
                        <input
                          className={`input ${getFunctionFieldError(index, "function_venue") ? "border-red-500" : ""}`}
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
                      <td className="py-3 px-2 border-b border-gray-200 w-40">
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
          <div className="relative py-4">
            <div className="absolute left-0 right-0 -bottom-4 text-center">
              <Tooltip title="Add More Function">
                <button
                  className="btn btn-sm btn-success rounded-full"
                  onClick={handleAddFunction}
                >
                  <i className="ki-filled ki-plus"></i> Add Function
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
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
