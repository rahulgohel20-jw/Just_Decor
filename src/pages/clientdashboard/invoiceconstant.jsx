import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

// Status Badge Component

export const invoicecolumns = [
  {
    accessorKey: "Invoice",
    header: ({ column }) => (
      <DataGridColumnHeader title="Sr No#" column={column} />
    ),
  },
  {
    accessorKey: "CustomerName",
    header: ({ column }) => (
      <DataGridColumnHeader title="Customer Name" column={column} />
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
      <DataGridColumnHeader title="Event Date" column={column} />
    ),
  },

  {
    accessorKey: "BalanceDue",
    header: ({ column }) => (
      <DataGridColumnHeader title="Balance Due" column={column} />
    ),
  },
];

export const defaultinvoiceData = [];
