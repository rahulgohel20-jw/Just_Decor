import { DataGridColumnHeader } from "@/components";

export const getColumns = () => [
  {
    accessorKey: "sr_no",
    header: ({ column }) => (
      <DataGridColumnHeader title="SR_NO" column={column} />
    ),
  },
  {
    accessorKey: "plan_name",
    header: ({ column }) => (
      <DataGridColumnHeader title="Plan Name" column={column} />
    ),
  },
  {
    accessorKey: "billingCycle",
    header: ({ column }) => (
      <DataGridColumnHeader title="Billing Cycle" column={column} />
    ),
  },
  {
    accessorKey: "isPopular",
    header: ({ column }) => (
      <DataGridColumnHeader title="Is Popular" column={column} />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataGridColumnHeader title="Price" column={column} />
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <button className="btn btn-sm btn-icon btn-clear" title="View">
            <i className="ki-filled ki-eye text-success"></i>
          </button>

          <button className="btn btn-sm btn-icon btn-clear" title="Edit">
            <i className="ki-filled ki-notepad-edit text-primary"></i>
          </button>

          <button
            className="btn btn-sm btn-icon btn-clear"
            title="Menu Preparation"
          >
            <i className="ki-filled ki-trash text-danger"></i>
          </button>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
];

export const defaultData = [
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
  {
    sr_no: 1,
    plan_name: "Elite",
    billingCycle: "Monthly",
    isPopular: "yes",
    price: "35000",
  },
];
