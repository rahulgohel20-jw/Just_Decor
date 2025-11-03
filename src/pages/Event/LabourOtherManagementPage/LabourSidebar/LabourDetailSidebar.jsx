import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { FormattedMessage, useIntl } from "react-intl";

const { Option } = Select;

const LabourDetailSidebar = ({ isOpen, onClose }) => {
  const [labourData, setLabourData] = useState({
    labourType: "Waiter",
    contact: "Pappu Bhai",
    price: 600,
    morningDate: "2025-09-08",
    morningQty: 10,
    eveningDate: "2025-09-08",
    eveningQty: 10,
    nightDate: "2025-09-08",
    nightQty: 10,
  });

  const totalQty =
    Number(labourData.morningQty || 0) +
    Number(labourData.eveningQty || 0) +
    Number(labourData.nightQty || 0);
  const totalPrice = totalQty * (labourData.price || 0);


  const intl = useIntl();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] ">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer container */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-6">
            <motion.div
              role="dialog"
              aria-modal="true"
className="pointer-events-auto w-[1100px] max-w-[95vw] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-[18px] font-semibold text-gray-800">
                  <FormattedMessage
  id="COMMON.LABOUR_OVERVIEW"
  defaultMessage="Labour Overview"
/>

                  <p className="text-gray-500 text-sm mt-3">
                 <FormattedMessage
  id="COMMON.REVIEW_MANAGE_LABOR_DETAILS"
  defaultMessage="Review and manage your labor details"
/>

                </p>
                </div>
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  <FormattedMessage id="COMMON_CLOSE" defaultMessage="Close" /> 
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                

                {/* Table */}
                {/* Table Header */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
  {/* Header Row */}
  <div className="grid grid-cols-9 text-sm font-semibold text-gray-700 border-b pb-3 mb-3">
    <div className="col-span-3">
  <FormattedMessage id="COMMON.LABOUR_DETAILS" defaultMessage="Labour Details" />
</div>
<div className="col-span-6 text-center">
  <FormattedMessage id="COMMON.SHIFT_DETAILS" defaultMessage="Shift Details" />
</div>

  </div>

  {/* Sub Header Row */}
  <div className="grid grid-cols-9 text-xs font-bold text-dark border-b pb-2 mb-3">
    
<div className="text-center">
  <FormattedMessage id="COMMON.LABOUR_TYPE" defaultMessage="Labour Type" />
</div>
<div className="text-center">
  <FormattedMessage id="COMMON.CONTACT" defaultMessage="Contact" />
</div>
<div className="text-center">
  <FormattedMessage id="COMMON.PRICE" defaultMessage="Price" />
</div>
<div className="text-center col-span-2">
  <FormattedMessage id="COMMON.MORNING" defaultMessage="Morning" />
</div>
<div className="text-center col-span-2">
  <FormattedMessage id="COMMON.EVENING" defaultMessage="Evening" />
</div>
<div className="text-center col-span-2">
  <FormattedMessage id="COMMON.NIGHT" defaultMessage="Night" />
</div>
</div>

  {/* Sub-sub header for Date / Qty */}
  <div className="grid grid-cols-9 text-[11px] text-gray-900 uppercase tracking-wide border-b pb-2 mb-3">
    
        
    <div></div>
    <div></div>
    <div></div>
    <div className="text-center">
  <FormattedMessage id="COMMON.DATE" defaultMessage="Date" />
</div>
<div className="text-center">
  <FormattedMessage id="COMMON.QTY" defaultMessage="Qty" />
</div>
<div className="text-center">
  <FormattedMessage id="COMMON.DATE" defaultMessage="Date" />
</div>
<div className="text-center">
  <FormattedMessage id="COMMON.QTY" defaultMessage="Qty" />
</div>
<div className="text-center">
  <FormattedMessage id="COMMON.DATE" defaultMessage="Date" />
</div>
<div className="text-center">
  <FormattedMessage id="COMMON.QTY" defaultMessage="Qty" />
</div>

  </div>

  {/* Data Row */}
  <div className="grid grid-cols-9 items-center gap-3 mb-3">
    <Select
      value={labourData.labourType}
      onChange={(value) =>
        setLabourData({ ...labourData, labourType: value })
      }
      className="w-full"
      size="middle"
    >
      <Option value="Waiter">
  <FormattedMessage id="COMMON.WAITER" defaultMessage="Waiter" />
</Option>
<Option value="Cook">
  <FormattedMessage id="COMMON.COOK" defaultMessage="Cook" />
</Option>

    </Select>

    <Select
      value={labourData.contact}
      onChange={(value) =>
        setLabourData({ ...labourData, contact: value })
      }
      className="w-full"
      size="middle"
    >
      <Option value="Pappu Bhai">
  <FormattedMessage id="COMMON.PAPPU_BHAI" defaultMessage="Pappu Bhai" />
</Option>
<Option value="Ramesh">
  <FormattedMessage id="COMMON.RAMESH" defaultMessage="Ramesh" />
</Option>

    </Select>

    <Input
      type="number"
      value={labourData.price}
      onChange={(e) =>
        setLabourData({ ...labourData, price: e.target.value })
      }
    />

    {/* Morning */}
    <DatePicker
      value={labourData.morningDate ? dayjs(labourData.morningDate) : null}
      onChange={(date, dateString) =>
        setLabourData({ ...labourData, morningDate: dateString })
      }
      className="w-full"
      format="MMM D, YYYY"
    />
    <Input
      type="number"
      value={labourData.morningQty}
      onChange={(e) =>
        setLabourData({ ...labourData, morningQty: e.target.value })
      }
    />

    {/* Evening */}
    <DatePicker
      value={labourData.eveningDate ? dayjs(labourData.eveningDate) : null}
      onChange={(date, dateString) =>
        setLabourData({ ...labourData, eveningDate: dateString })
      }
      className="w-full"
      format="MMM D, YYYY"
    />
    <Input
      type="number"
      value={labourData.eveningQty}
      onChange={(e) =>
        setLabourData({ ...labourData, eveningQty: e.target.value })
      }
    />

    {/* Night */}
    <DatePicker
      value={labourData.nightDate ? dayjs(labourData.nightDate) : null}
      onChange={(date, dateString) =>
        setLabourData({ ...labourData, nightDate: dateString })
      }
      className="w-full"
      format="MMM D, YYYY"
    />
    <Input
      type="number"
      value={labourData.nightQty}
      onChange={(e) =>
        setLabourData({ ...labourData, nightQty: e.target.value })
      }
    />
  </div>

  {/* Totals */}
  <div className="flex justify-end items-center gap-6 mt-6 border-t pt-4">
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-700"><FormattedMessage id="COMMON.TOTAL_QTY" defaultMessage="Total Qty." />
</span>
      <Input value={totalQty} readOnly className="w-20 text-center" />
    </div>
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-700"><FormattedMessage id="COMMON.TOTAL_PRICE" defaultMessage="Total Price" />
</span>
      <Input
        value={totalPrice.toLocaleString()}
        readOnly
        className="w-32 text-right"
      />
    </div>
  </div>
</div>

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LabourDetailSidebar;
