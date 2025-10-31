import { DataGridColumnHeader } from "@/components";

export const itemcolumns = [
  {
    accessorKey: "Invoice",
    header: ({ column }) => (
      <DataGridColumnHeader title="Sr No#" column={column} />
    ),
  },
  {
    accessorKey: "item",
    header: ({ column }) => (
      <DataGridColumnHeader title="Item" column={column} />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataGridColumnHeader title="Quantity" column={column} />
    ),
  },
  {
    accessorKey: "selling",
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} />
    ),
  },
];

export const defaultitemData = [
  {
    Invoice: "1",
    item: "John Doe",
    quantity: "200",
    selling: "High",
  },
  {
    Invoice: "2",
    item: "John Doe",
    quantity: "200",
    selling: "High",
  },
  {
    Invoice: "3",
    item: "John Doe",
    quantity: "200",
    selling: "High",
  },
  {
    Invoice: "5",
    item: "John Doe",
    quantity: "200",
    selling: "High",
  },
  {
    Invoice: "5",
    item: "John Doe",
    quantity: "200",
    selling: "High",
  },
  {
    Invoice: "6",
    item: "John Doe",
    quantity: "200",
    selling: "High",
  },
];
