import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import Addpipeline from "./Addpipeline";

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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const initialPipelines = [
  {
    id: "1",
    name: "Sales Pipeline",
    date: "Apr 14, 2025",
    createdBy: "Manan Gandhi",
  },
  {
    id: "2",
    name: "Social media",
    date: "Jun 10, 2025",
    createdBy: "Manan Gandhi",
  },
  {
    id: "3",
    name: "My pipeline",
    date: "Jun 23, 2025",
    createdBy: "Manan Gandhi",
  },
  {
    id: "4",
    name: "My pipeline",
    date: "Jun 23, 2025",
    createdBy: "Manan Gandhi",
  },
  {
    id: "5",
    name: "My pipeline",
    date: "Jun 23, 2025",
    createdBy: "Manan Gandhi",
  },
  {
    id: "6",
    name: "My pipeline",
    date: "Jun 23, 2025",
    createdBy: "Manan Gandhi",
  },
];

const SortableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col sm:flex-row sm:items-center 
                 justify-between bg-[#EFF6FF] rounded-lg 
                 px-5 py-4 gap-4 shadow-sm"
    >
      {/* Left Content */}
      <div>
        <h4 className="font-semibold text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-500 mt-1">
          Created At: {item.date} | Created by: {item.createdBy}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex gap-3 items-center">
        <button
          className="px-2 py-1 text-xl font-medium 
                     text-primary 
                     rounded-lg"
        >
          <i className="ki-filled ki-eye"></i>
        </button>
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab px-3 py-2 border rounded-lg 
                     bg-white hover:bg-gray-100"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

const Pipeline = () => {
  const [ismodalopen, setIsModalOpen] = useState(false);
  const [pipelines, setPipelines] = useState(initialPipelines);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPipelines((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Fragment>
      <Container>
        <h2 className="text-2xl font-semibold mb-6 text-black">
          Create Pipeline
        </h2>

        {/* Search + Create */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search Pipeline"
            className="w-full sm:w-72 px-4 py-2 border rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Pipeline
          </button>
        </div>

        {/* Drag & Drop List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pipelines.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {pipelines.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Addpipeline
          isModalOpen={ismodalopen}
          setIsModalOpen={setIsModalOpen}
        />
      </Container>
    </Fragment>
  );
};

export default Pipeline;
