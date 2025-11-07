import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

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
      <DataGridColumnHeader title="Customer Name" column={column} />
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataGridColumnHeader title="Plan" column={column} />
    ),
  },

  {
    accessorKey: "Amount",
    header: ({ column }) => (
      <DataGridColumnHeader title="Total Paid" column={column} />
    ),
  },
{
  accessorKey: "Date",
  header: ({ column }) => (
    <DataGridColumnHeader title="Date" column={column} />
  ),
},

 
];

export const defaultData = [
  {
    Invoice: "0001",
    CustomerName: "John",
    plan: "E-lite",
    Amount: 5000,       // Add this if you want Total Paid
    Date: "23/02/2025", // Ensure date format is correct
  },
  {
    Invoice: "0002",
    CustomerName: "Alice",
    plan: "Premium",
    Amount: 7500,
    Date: "05/11/2025",
  },
];
