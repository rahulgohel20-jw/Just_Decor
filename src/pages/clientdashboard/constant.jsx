import React from 'react';
import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Confirmed: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300'
    },
    Inquiry: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-gray-300'
    },
    
    Cancelled: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300'
    }
  };

  const config = statusConfig[status] || statusConfig.Inquiry;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
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
      <DataGridColumnHeader title="Event Date" column={column} />
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
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const PartyId = row.original?.PartyId;
      const eventId = row.original?.EventId;
      return (
        <div className="flex items-center gap-2">
          <Tooltip title="View">
            <Link to={`/sales/invoice-list`}>
              <button
                className="btn btn-sm btn-icon btn-clear text-primary border border-[#E3E3E3]"
                title="View"
              >
                <i className="ki-filled ki-eye text-purple-700"></i>
              </button>
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

export const defaultData = [
  {
    Invoice: "0001",
    CustomerName: "John Doe",
    Eventname: "Wedding Ceremony",
    eventDate: "2023-10-15",
    status: "Confirmed",
    Venue: "Ahmedabad",
  },
  {
    Invoice: "0002",
    CustomerName: "Jane Smith",
    Eventname: "Birthday Party",
    eventDate: "2023-10-20",
    status: "Inquiry",
    Venue: "Mumbai",
  },
  {
    Invoice: "0003",
    CustomerName: "Bob Johnson",
    Eventname: "Corporate Event",
    eventDate: "2023-10-25",
    status: "Confirmed",
    Venue: "Delhi",
  },
  {
    Invoice: "0004",
    CustomerName: "Alice Williams",
    Eventname: "Anniversary",
    eventDate: "2023-10-30",
    status: "Inquiry",
    Venue: "Bangalore",
  },
  {
    Invoice: "0005",
    CustomerName: "Charlie Brown",
    Eventname: "Product Launch",
    eventDate: "2023-11-05",
    status: "Confirmed",
    Venue: "Chennai",
  },
  {
    Invoice: "0006",
    CustomerName: "David Davis",
    Eventname: "Conference",
    eventDate: "2023-11-10",
    status: "Cancelled",
    Venue: "Pune",
  },
];