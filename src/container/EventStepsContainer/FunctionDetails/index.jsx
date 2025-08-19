import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { MapPin, StickyNote, Trash2, Plus, Search } from "lucide-react";
import FunctionTypeDropdown from "@/components/dropdowns/FunctionTypeDropdown";
import useStyles from "./style";
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

const Functionsdeatils = ({ formData, setFormData }) => {
  const classes = useStyles();
  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const createEmptyRow = () => ({
    id: Date.now().toString(),
    function_type: "",
    start_date: null,
    end_date: null,
    person: "",
    rate: "",
    venue: "",
  });

  useEffect(() => {
    if (!formData.function_array || formData.function_array.length === 0) {
      setFormData({
        ...formData,
        function_array: [createEmptyRow()],
      });
    }
  }, []);

  const handleAddClick = () => {
    setShowFunctionModal(true);
  };

  const handleNoteClick = () => {
    setShowNoteModal(true);
  };

  const handleAddFunction = () => {
    setFormData({
      ...formData,
      function_array: [...(formData.function_array || []), createEmptyRow()],
    });
  };

  const handleRemoveFunction = (index) => {
    const updated = formData.function_array.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      function_array: updated.length > 0 ? updated : [createEmptyRow()],
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedArray = [...formData.function_array];
    updatedArray[index][field] = value;
    setFormData({
      ...formData,
      function_array: updatedArray,
    });
  };

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

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-[#C3C3C3] border-t">
          <thead className="text-black font-bold border-b border-[#C3C3C3]">
            <tr>
              <th className="p-3 w-10"></th>
              <div className="flex items-center">
                <th className="p-3">Function Type</th>
                <button
                  type="button"
                  onClick={handleAddClick}
                  title="Add"
                  className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-6 h-6"
                >
                  <i className="ki-filled ki-plus"></i>
                </button>
              </div>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Person</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Venue</th>
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
                    <td className="p-2">
                      <FunctionTypeDropdown
                        value={func.function_type}
                        onChange={(value) =>
                          handleInputChange(index, "function_type", value)
                        }
                      />
                    </td>
                    <td className="p-3 w-40">
                      <DatePicker
                        className="w-full"
                        value={func.start_date}
                        onChange={(date) =>
                          handleInputChange(index, "start_date", date)
                        }
                      />
                    </td>
                    <td className="p-3 w-40">
                      <DatePicker
                        className="w-full"
                        value={func.end_date}
                        onChange={(date) =>
                          handleInputChange(index, "end_date", date)
                        }
                      />
                    </td>
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
                    <td className="p-3 w-40">
                      <Input
                        className="w-full"
                        value={func.function_venue}
                        type="text"
                        placeholder="Venue"
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "venue",
                            e.target.function_venue
                          )
                        }
                      />
                    </td>
                    <td className="p-3 text-center w-28">
                      <div className="flex justify-center items-center gap-2">
                        <button type="button" title="Location">
                          <MapPin size={18} className="text-primary" />
                        </button>
                        <button
                          type="button"
                          title="Notes"
                          onClick={handleNoteClick}
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

export default Functionsdeatils;
