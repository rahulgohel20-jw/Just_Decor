import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete, onPrint) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr No." />,
    meta: { headerClassName: "w-[4%]", cellClassName: "w-[4%]" },
  },
  {
    accessorKey: "pocode",
    header: <FormattedMessage id="PURCHASE.PO_CODE" defaultMessage="PO Code." />,
    meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
  },
  {
    accessorKey: "podate",
    header: <FormattedMessage id="PURCHASE.VOUCHER_DATE" defaultMessage="Voucher Date" />,
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "stockTypeName",           
    header: <FormattedMessage id="PURCHASE.TYPE" defaultMessage="Type" />,
    meta: { headerClassName: "w-[15%]", cellClassName: "w-[15%]" },
  },
  {
    accessorKey: "partyName",        
    header: <FormattedMessage id="PURCHASE.EVENTS" defaultMessage="Events" />,
    meta: { headerClassName: "w-[20%]", cellClassName: "w-[20%]" },
  },
  {
    accessorKey: "remarks",         
    header: <FormattedMessage id="PURCHASE.REMARK" defaultMessage="Remark" />,
    meta: { headerClassName: "w-[16%]", cellClassName: "w-[16%]" },
  },
  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Tooltip title="Edit">
          <button
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onEdit(row.original)}
          >
            <i className="ki-filled ki-notepad-edit text-primary"></i>
          </button>
        </Tooltip>
        <Tooltip title="Delete">
          <button
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onDelete(row.original.id)}
          >
            <i className="ki-filled ki-trash text-danger"></i>
          </button>
        </Tooltip>
        <Tooltip title="Print">
          <button
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onPrint && onPrint(row.original)}
          >
            <i className="ki-filled ki-printer text-green-700"></i>
          </button>
        </Tooltip>
      </div>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
];

// ✅ defaultData keys now match column accessorKeys exactly
export const defaultData = [
  { sr_no: 1, purchaseid: 1, voucher_no: 6,  voucher_date: "01.12.2024", type: "Purchase Order",  events: "Annual Catering 2024",   remark: "CHALLAN" },
  { sr_no: 2, purchaseid: 2, voucher_no: 10, voucher_date: "02.12.2024", type: "Store Request",   events: "Wedding Reception",       remark: "KASHIMIRA" },
  { sr_no: 3, purchaseid: 3, voucher_no: 1,  voucher_date: "03.12.2024", type: "Purchase Order",  events: "Corporate Lunch",         remark: "KASHIMIRA" },
  { sr_no: 4, purchaseid: 4, voucher_no: 3,  voucher_date: "03.12.2024", type: "Store Request",   events: "Birthday Banquet",        remark: "KASHIMIRA" },
  { sr_no: 5, purchaseid: 5, voucher_no: 5,  voucher_date: "03.12.2024", type: "Purchase Order",  events: "Festival Dinner",         remark: "" },
  { sr_no: 6, purchaseid: 6, voucher_no: 7,  voucher_date: "03.12.2024", type: "Store Transfer",  events: "Conference Catering",     remark: "KASHIMIRA CHALLAN" },
  { sr_no: 7, purchaseid: 7, voucher_no: 36, voucher_date: "03.12.2024", type: "Store Request",   events: "Sports Day Event",        remark: "KASHIMIRA" },
];