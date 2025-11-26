import React from "react";
import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Confirmed: {
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-300",
    },
    Inquiry: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-gray-300",
    },

    Cancelled: {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-300",
    },
  };

  const config = statusConfig[status] || statusConfig.Inquiry;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {status}
    </span>
  );
};

export const columns = [
  {
    accessorKey: "Invoice",
    header: ({ column }) => (
      <DataGridColumnHeader title="Sr No#" column={column} />
    ),
  },
  {
    accessorKey: "CustomerName",
    header: ({ column }) => (
      <DataGridColumnHeader title="Client Name" column={column} />
    ),
  },
  {
    accessorKey: "Eventname",
    header: ({ column }) => (
      <DataGridColumnHeader title="Event Name" column={column} />
    ),
  },
  {
    accessorKey: "eventDate",
    header: ({ column }) => (
      <DataGridColumnHeader title="Event Date & Time" column={column} />
    ),
  },
  {
    accessorKey: "Venue",
    header: ({ column }) => (
      <DataGridColumnHeader title="Venue" column={column} />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} />
    ),
    cell: ({ row }) => {
      const status = row.original?.status;
      return <StatusBadge status={status} />;
    },
  },
];

export const defaultData = [];
