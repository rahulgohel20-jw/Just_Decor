import { useEffect, useState } from "react";
import { Input, DatePicker } from "antd";
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
    opacity: isDragging ? 0.5 : 1,
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
  start_event_date,
  end_event_date,
}) => {
  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [options, setOptions] = useState([]);

  const createEmptyRow = () => ({
    eventFuncId: 0,
    functionId: 0,
    functionStartDateTime: null,
    functionEndDateTime: null,
    person: "",
    rate: "",
    function_venue: "",
  });
  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

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
    if (!formData.function_array || formData.function_array.length === 0) {
      setFormData({ ...formData, function_array: [createEmptyRow()] });
    }
  }, []);

  // add new row
  const handleAddFunction = () => {
    setFormData({
      ...formData,
      function_array: [...(formData.function_array || []), createEmptyRow()],
    });
  };

  // remove row
  const handleRemoveFunction = (index) => {
    const updated = formData.function_array.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      function_array: updated.length > 0 ? updated : [createEmptyRow()],
    });
  };

  // input change handler
  const handleInputChange = (index, field, value) => {
    const updatedArray = [...formData.function_array];
    updatedArray[index][field] = value;
    setFormData({ ...formData, function_array: updatedArray });
  };

  // when user selects function type from dropdown
  const handleFunctionSelect = (index, functionId) => {
    const selected = options.find((opt) => opt.value === functionId);
    const updatedArray = [...formData.function_array];

    if (selected) {
      const eventStartDate = dayjs(start_event_date, "DD/MM/YYYY");
      const eventEndDate = dayjs(end_event_date, "DD/MM/YYYY");

      const startTime = dayjs(selected.functionstartTime, "HH:mm");
      const endTime = dayjs(selected.functionendTime, "HH:mm");

      updatedArray[index].functionId = functionId;

      updatedArray[index].functionStartDateTime = eventStartDate
        .hour(startTime.hour())
        .minute(startTime.minute())
        .format("YYYY-MM-DD HH:mm");

      updatedArray[index].functionEndDateTime = eventEndDate
        .hour(endTime.hour())
        .minute(endTime.minute())
        .format("YYYY-MM-DD HH:mm");
    }

    setFormData({ ...formData, function_array: updatedArray });
  };

  // drag & drop
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = formData.function_array.findIndex(
        (f) => f.id === active.id
      );
      const newIndex = formData.function_array.findIndex(
        (f) => f.id === over.id
      );
      const reordered = arrayMove(formData.function_array, oldIndex, newIndex);
      setFormData({ ...formData, function_array: reordered });
    }
  };

  return (
    <div className="rounded-md border border-[#C3C3C3] bg-white">
      {/* Header */}
      <div className="p-3 flex justify-between items-center">
        <Input
          placeholder="Quick Search"
          className="w-1/3"
          allowClear
          prefix={<Search size={16} className="text-gray-700" />}
        />
        <button
          className="btn-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={handleAddFunction}
        >
          Add Function <Plus size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-[#C3C3C3] border-t">
          <thead className="text-black font-bold border-b border-[#C3C3C3]">
            <tr>
              <th className="p-3 w-10"></th>
              <th className="p-3">Function Type</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Person</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Function Venue</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formData.function_array.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                {formData?.function_array?.map((func, index) => (
                  <SortableRow key={func.id} id={func.id}>
                    {/* Function Type */}
                    <td className="p-2">
                      <FunctionTypeDropdown
                        value={func.function_type}
                        onChange={(value) => handleFunctionSelect(index, value)}
                        options={options}
                      />
                    </td>

                    {/* Start Date */}
                    <td className="p-3 w-40">
                      <DatePicker
                        style={{ width: "175px" }}
                        showTime={{ format: "hh:mm A" }}
                        format="DD/MM/YYYY hh:mm A"
                        value={
                          func.functionStartDateTime
                            ? dayjs(func.functionStartDateTime)
                            : null
                        }
                        disabledDate={(current) => {
                          const eventStart = dayjs(
                            start_event_date,
                            "DD/MM/YYYY"
                          );
                          const eventEnd = dayjs(end_event_date, "DD/MM/YYYY");
                          return (
                            current &&
                            (current < eventStart.startOf("day") ||
                              current > eventEnd.endOf("day"))
                          );
                        }}
                        onChange={(date) =>
                          handleInputChange(
                            index,
                            "functionStartDateTime",
                            date ? dayjs(date).format("YYYY-MM-DD HH:mm") : null
                          )
                        }
                      />
                    </td>

                    {/* End Date */}
                    <td className="p-3 w-40">
                      <DatePicker
                        style={{ width: "175px" }}
                        showTime={{ format: "hh:mm A" }}
                        format="DD/MM/YYYY hh:mm A"
                        value={
                          func.functionEndDateTime
                            ? dayjs(func.functionEndDateTime)
                            : null
                        }
                        disabledDate={(current) => {
                          const eventStart = dayjs(
                            start_event_date,
                            "DD/MM/YYYY"
                          );
                          const eventEnd = dayjs(end_event_date, "DD/MM/YYYY");
                          return (
                            current &&
                            (current < eventStart.startOf("day") ||
                              current > eventEnd.endOf("day"))
                          );
                        }}
                        onChange={(date) =>
                          handleInputChange(
                            index,
                            "functionEndDateTime",
                            date ? dayjs(date).format("YYYY-MM-DD HH:mm") : null
                          )
                        }
                      />
                    </td>

                    {/* Person */}
                    <td className="p-3 w-24">
                      <Input
                        className="w-full text-center"
                        value={func.person}
                        type="number"
                        onChange={(e) =>
                          handleInputChange(index, "person", e.target.value)
                        }
                      />
                    </td>

                    {/* Rate */}
                    <td className="p-3 w-24">
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

                    {/* Venue */}
                    <td className="p-3 w-40">
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

                    {/* Actions */}
                    <td className="p-3 text-center w-28">
                      <div className="flex justify-center items-center gap-2">
                        <button type="button" title="Location">
                          <MapPin size={18} className="text-primary" />
                        </button>
                        <button
                          type="button"
                          title="Notes"
                          onClick={() => setShowNoteModal(true)}
                        >
                          <StickyNote size={18} className="text-primary" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFunction(index)}
                          title="Remove"
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
      />
      <AddNotes
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
      />
    </div>
  );
};

export default FunctionsDetails;
