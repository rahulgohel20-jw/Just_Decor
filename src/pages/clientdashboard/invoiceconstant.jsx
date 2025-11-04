import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Paid: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300'
    },
    
    
    Overdue: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300'
    },
    Unpaid: {
      bgColor: 'bg-yelow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-red-300'
    }
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      {status}
    </span>
  );
};

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
    accessorKey: "Amount",
    header: ({ column }) => (
      <DataGridColumnHeader title="Total Paid" column={column} />
    ),
  },
  {
    accessorKey: "BalanceDue",
    header: ({ column }) => (
      <DataGridColumnHeader title="Balance Due" column={column} />
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

export const defaultinvoiceData = [
  {
    Invoice: "INV-0001",
    CustomerName: "John Doe",
    Eventname: "Wedding Ceremony",
    eventDate: "2023-10-15",
    Amount: "₹ 1,00,000.00",
    BalanceDue: "₹ 20,000.00",
    status: "Paid",
  },
  {
    Invoice: "INV-0002",
    CustomerName: "Jane Smith",
    Eventname: "Birthday Party",
    eventDate: "2023-10-20",
    Amount: "₹ 50,000.00",
    BalanceDue: "₹ 0.00",
    status: "Unpaid",
  },
  {
    Invoice: "INV-0003",
    CustomerName: "Bob Johnson",
    Eventname: "Corporate Event",
    eventDate: "2023-10-25",
    Amount: "₹ 0.00",
    BalanceDue: "₹ 2,50,000.00",
    status: "Overdue",
  },
  
];