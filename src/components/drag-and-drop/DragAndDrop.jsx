import React, { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { toAbsoluteUrl } from "@/utils/Assets";
import { Fragment } from "react";
import { Task } from "./Task";

const SortableItem = ({
  task,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onFollowUp,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : "none",
    transition,
    touchAction: "manipulation",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mb-2 w-full box-border max-w-[100%]"
    >
      <Task
        item={task}
        index={task.id}
        dropdown={true}
        onViewLead={onViewLead}
        onEditLead={onEditLead}
        onDeleteLead={onDeleteLead}
        onFollowUp={onFollowUp}
      />
    </div>
  );
};

const SortableColumn = ({
  column,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onFollowUp,
}) => {
  const { setNodeRef, attributes, listeners } = useSortable({ id: column.id });

  const leadCount = column.children?.length || 0;
  const totalAmount = 0;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="border rounded-lg bg-gray-100 w-64 transition-all duration-200 min-w-[450px] flex-shrink-0 flex flex-col"
      id={column.id}
      style={{ maxHeight: "calc(100vh - 150px)" }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b rounded-t-lg w-full py-2 px-3 bg-white flex-shrink-0">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-900">{column.name}</p>
          <small className="text-xs">
            {leadCount} leads{" "}
            <span className="font-semibold text-success">
              &#8377;{totalAmount}/-
            </span>
          </small>
        </div>
        <button className="btn btn-sm btn-icon btn-light btn-clear">
          <i className="ki-filled ki-dots-horizontal"></i>
        </button>
      </div>

      {/* Cards List - scrollable */}
      <div className="overflow-y-auto flex-1 scrollbar-hide p-3">
        {column.children && column.children.length > 0 ? (
          <SortableContext
            items={[column.id, ...column.children.map((task) => task.id)]}
            strategy={rectSortingStrategy}
          >
            {column.children.map((task) => (
              <SortableItem
                key={task.id}
                task={task}
                onViewLead={onViewLead}
                onEditLead={onEditLead}
                onDeleteLead={onDeleteLead}
                onFollowUp={onFollowUp}
              />
            ))}
          </SortableContext>
        ) : (
          <div className="p-4 flex flex-col items-center">
            <img
              src={toAbsoluteUrl(`/images/empty_icn.svg`)}
              className="dark:hidden max-h-[120px]"
              alt=""
            />
            <img
              src={toAbsoluteUrl(`/images/empty_icn_dark.svg`)}
              className="light:hidden max-h-[120px]"
              alt=""
            />
            <p className="text-sm text-gray-900 opacity-50 mt-3">
              No data available!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const DragAndDrop = ({
  columns,
  setColumns,
  setDndActive,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onFollowUp,
  onLeadDropped, // ← NEW: fires when a card moves to a different column
}) => {
  const [activeTask, setActiveTask] = useState(null);

  // Track which column the drag started from
  const dragSourceColumnRef = useRef(null);

  // Keep a snapshot of columns BEFORE the drag started
  // so we can revert if the modal is cancelled
  const snapshotColumnsRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  const findColumnByTaskId = (taskId) => {
    return columns.find((col) =>
      col.children?.some((task) => task.id === taskId),
    );
  };

  const findColumnById = (id) => {
    return columns.find(
      (col) => col.id === id || col.children?.some((task) => task.id === id),
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;

    // Find and store the source column before anything moves
    const sourceCol = findColumnByTaskId(active.id);
    dragSourceColumnRef.current = sourceCol ? { ...sourceCol } : null;

    // Snapshot current columns so we can revert on cancel
    snapshotColumnsRef.current = columns.map((col) => ({
      ...col,
      children: [...(col.children || [])],
    }));

    const task = columns
      .flatMap((col) => col.children || [])
      .find((task) => task.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeCol = findColumnByTaskId(active.id);
    if (!activeCol) return;

    const overCol = findColumnById(over.id);
    if (!overCol) return;

    const activeIndex = activeCol.children.findIndex((i) => i.id === active.id);
    const task = activeCol.children[activeIndex];

    // Intra-column reorder — always commit immediately (no modal needed)
    if (activeCol.id === overCol.id) {
      const overIndex = overCol.children.findIndex((i) => i.id === over.id);
      if (overIndex !== -1 && activeIndex !== overIndex) {
        const newChildren = arrayMove(
          activeCol.children,
          activeIndex,
          overIndex,
        );
        const updatedCols = columns.map((col) =>
          col.id === activeCol.id ? { ...col, children: newChildren } : col,
        );
        setColumns(updatedCols);
      }
      return;
    }

    // Inter-column drag: update columns visually while dragging
    // (will be confirmed or reverted in handleDragEnd)
    const newActiveChildren = [...activeCol.children];
    newActiveChildren.splice(activeIndex, 1);
    const newOverChildren = [...overCol.children, task];

    const updatedCols = columns.map((col) => {
      if (col.id === activeCol.id)
        return { ...col, children: newActiveChildren };
      if (col.id === overCol.id) return { ...col, children: newOverChildren };
      return col;
    });

    setColumns(updatedCols);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveTask(null);
    setDndActive(false);

    if (!over) {
      // Dropped outside — revert to snapshot
      if (snapshotColumnsRef.current) {
        setColumns(snapshotColumnsRef.current);
      }
      dragSourceColumnRef.current = null;
      snapshotColumnsRef.current = null;
      return;
    }

    const sourceColumn = dragSourceColumnRef.current;

    // Find destination column in the CURRENT (visually updated) columns
    const destColumn = findColumnById(over.id);

    // Cross-column drop detected
    if (
      sourceColumn &&
      destColumn &&
      sourceColumn.id !== destColumn.id &&
      onLeadDropped
    ) {
      // Find the dragged task
      const droppedTask = columns
        .flatMap((col) => col.children || [])
        .find((t) => t.id === active.id);

      // current columns already have the card in the new column (from handleDragOver)
      // pass them as pendingColumns so SuperLeads can commit them on confirm
      const pendingColumns = columns.map((col) => ({
        ...col,
        children: [...(col.children || [])],
      }));

      // Revert columns back to snapshot until user confirms in modal
      if (snapshotColumnsRef.current) {
        setColumns(snapshotColumnsRef.current);
      }

      // Fire the modal
      onLeadDropped({
        lead: droppedTask,
        fromColumn: { id: sourceColumn.id, name: sourceColumn.name },
        toColumn: { id: destColumn.id, name: destColumn.name },
        pendingColumns, // SuperLeads will apply this on confirm
      });
    }

    dragSourceColumnRef.current = null;
    snapshotColumnsRef.current = null;
  };

  const handleDragCancel = () => {
    // Revert to snapshot on cancel
    if (snapshotColumnsRef.current) {
      setColumns(snapshotColumnsRef.current);
    }
    setActiveTask(null);
    setDndActive(false);
    dragSourceColumnRef.current = null;
    snapshotColumnsRef.current = null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        handleDragStart(event);
        setDndActive(true);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((column) => (
          <SortableColumn
            key={column.id}
            column={column}
            onViewLead={onViewLead}
            onEditLead={onEditLead}
            onDeleteLead={onDeleteLead}
            onFollowUp={onFollowUp}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div
            className="border rounded p-2 bg-gray-100"
            style={{
              width: "90%",
              transform: "none",
              opacity: 0.9,
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            <Task item={activeTask} index={0} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
