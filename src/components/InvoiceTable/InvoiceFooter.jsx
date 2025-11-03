import React, { useState, useEffect } from "react";
import {
  CloseOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Select, Radio, Input } from "antd";
import { Download } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

const { TextArea } = Input;

const InvoiceFooter = ({ invoiceData, rows, footerData, onFooterDataChange, onSave }) => {
  const [notes, setNotes] = useState("");
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cgstAmnt, setCgstAmnt] = useState(0);
  const [sgstAmnt, setSgstAmnt] = useState(0);
  const [igstAmnt, setIgstAmnt] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const intl = useIntl();

  // Calculate subtotal from rows
  useEffect(() => {
    console.log("Rows in InvoiceFooter:", rows);
    if (rows && rows.length > 0) {
      const calculatedSubTotal = rows.reduce((sum, row) => {
        const person = Number(row.person) || 0;
        const rate = Number(row.rate) || 0;
        const extra = Number(row.extra) || 0;
        const amount = row.amount ? Number(row.amount) : person * rate + extra;
        return sum + amount;
      }, 0);
      setSubTotal(calculatedSubTotal);
    } else {
      setSubTotal(0);
    }
  }, [rows]);

  // Calculate all amounts when values change
  useEffect(() => {
    const cgstAmount = (subTotal * Number(cgst)) / 100;
    const sgstAmount = (subTotal * Number(sgst)) / 100;
    const igstAmount = (subTotal * Number(igst)) / 100;
    const discountAmount = Number(discount);
    const roundOffAmount = Number(roundOff);
    
    // Total before discount and roundoff
    const beforeDiscount = subTotal + cgstAmount + sgstAmount + igstAmount;
    
    // Total amount after discount but before roundoff
    const afterDiscount = beforeDiscount - discountAmount;
    
    // Grand total after roundoff
    const finalTotal = afterDiscount + roundOffAmount;
    
    setCgstAmnt(cgstAmount);
    setSgstAmnt(sgstAmount);
    setIgstAmnt(igstAmount);
    setTotalAmount(afterDiscount);
    setGrandTotal(finalTotal);
  }, [subTotal, cgst, sgst, igst, discount, roundOff]);

  // Initialize data from footerData prop ONLY ONCE
  useEffect(() => {
    if (footerData && !notes) {
      setNotes(footerData.notes || "Thanks for your Business...");
      setCgst(footerData.cgst || 0);
      setSgst(footerData.sgst || 0);
      setIgst(footerData.igst || 0);
      setDiscount(footerData.discount || 0);
      setRoundOff(footerData.roundOff || 0);
    }
  }, []);

  // Sync local state changes back to parent
  useEffect(() => {
    if (onFooterDataChange) {
      onFooterDataChange({
        notes,
        gst: cgst + sgst + igst, // Total GST
        cgst,
        sgst,
        igst,
        discount,
        roundOff,
        subTotal,
        totalAmount,
        cgstAmnt,
        sgstAmnt,
        igstAmnt,
        grandTotal,
      });
    }
  }, [notes, cgst, sgst, igst, discount, roundOff, subTotal, totalAmount, cgstAmnt, sgstAmnt, igstAmnt, grandTotal]);

  const handleCgstChange = (e) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    setCgst(isNaN(numValue) ? 0 : numValue);
  };

  const handleSgstChange = (e) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    setSgst(isNaN(numValue) ? 0 : numValue);
  };

  const handleIgstChange = (e) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    setIgst(isNaN(numValue) ? 0 : numValue);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    setDiscount(isNaN(numValue) ? 0 : numValue);
  };

  const handleRoundOffChange = (e) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    setRoundOff(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-3 mb-5">
        <div className="min-w-full">
          <h4 className="text-base font-semibold leading-none text-gray-900 mb-2">
            <FormattedMessage id="COMMON.NOTES" defaultMessage="Notes" />

          </h4>
          <TextArea
            placeholder="Thanks for your Business..."
            autoSize={{ minRows: 9 }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="min-w-full">
          <h4 className="text-base font-semibold leading-none text-gray-900 mb-2">
            <FormattedMessage id="COMMON.SUMMARY" defaultMessage="Summary" />

          </h4>
          <div className="border rounded-lg min-w-full p-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-900"><FormattedMessage id="COMMON.SUBTOTAL" defaultMessage="Subtotal" />
</span>
              <span className="font-semibold">₹{subTotal.toFixed(2)}</span>
            </div>
            
            {/* CGST */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">CGST (%)</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={cgst}
                  onChange={handleCgstChange}
                  min={0}
                  max={100}
                  step="0.01"
                />
              </div>
              <span className="font-semibold">₹{cgstAmnt.toFixed(2)}</span>
            </div>
            
            {/* SGST */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">SGST (%)</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={sgst}
                  onChange={handleSgstChange}
                  min={0}
                  max={100}
                  step="0.01"
                />
              </div>
              <span className="font-semibold">₹{sgstAmnt.toFixed(2)}</span>
            </div>
            
            {/* IGST */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">IGST (%)</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={igst}
                  onChange={handleIgstChange}
                  min={0}
                  max={100}
                  step="0.01"
                />
              </div>
              <span className="font-semibold">₹{igstAmnt.toFixed(2)}</span>
            </div>
            
            {/* Discount */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900"><FormattedMessage id="COMMON.DISCOUNT" defaultMessage="Discount" />
</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={discount}
                  onChange={handleDiscountChange}
                  min={0}
                  step="0.01"
                />
              </div>
              <span className="font-semibold text-red-600">
                -₹{Number(discount).toFixed(2)}
              </span>
            </div>
            
            {/* Round Off */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900"><FormattedMessage id="COMMON.ROUND_OFF" defaultMessage="Round Off" />
</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={roundOff}
                  onChange={handleRoundOffChange}
                  step="0.01"
                />
              </div>
              <span className="font-semibold">₹{Number(roundOff).toFixed(2)}</span>
            </div>
            
            {/* Grand Total */}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span className="text-base text-primary"><FormattedMessage id="COMMON.GRAND_TOTAL" defaultMessage="Grand Total" />
</span>
              <span className="text-base text-primary">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-3 mb-5">
        <div className="min-w-full">
          <div className="p-3 border rounded-lg whitespace-pre-line text-sm">
            <h4 className="text-base font-semibold leading-none text-gray-900 mb-2">
              <FormattedMessage id="COMMON.TERMS_AND_CONDITIONS" defaultMessage="Terms & Conditions" />

              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </h4>
            {invoiceData?.termsAndConditions || (
              <>
                HDFC BANK
                <em className="text-sm">
                  {"\n"}AC NO. :- 50200013422306
                  {"\n"}BRANCH :- DARPAN SIX ROAD
                  {"\n"}IFSC CODE :- HDFC0001678
                  {"\n"}AC NAME :- SHREE INFOTECH
                </em>
              </>
            )}
          </div>
        </div>
        <div className="min-w-full">
          <div className="border rounded-lg min-w-full h-full p-4">
            <h4 className="text-base font-semibold leading-none text-gray-900 mb-2">
              <FormattedMessage
  id="COMMON.ATTACH_FILES_TO_INVOICE"
  defaultMessage="Attach Files to Invoice"
/>

            </h4>
            <Button
              icon={<UploadOutlined />}
              className="mb-1 border-gray-300 text-primary"
            >
              <FormattedMessage id="COMMON.UPLOAD_FILE" defaultMessage="Upload File" />

            </Button>
            <p className="text-xs text-gray-500">
              <FormattedMessage
  id="COMMON.UPLOAD_MAX_FILE_SIZE"
  defaultMessage="You can upload maximum 10mb file"
/>

            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button className="btn btn-light" title={<FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />}>
          <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
        </button>
        <button className="btn btn-primary" title={<FormattedMessage id="COMMON.SAVE_AND_SEND" defaultMessage="Save & Send" />} onClick={onSave}>
          <i className="ki-outline ki-paper-plane"></i>
          <FormattedMessage id="COMMON.SAVE_AND_SEND" defaultMessage="Save & Send" />

        </button>
        <button className="btn btn-success" title={<FormattedMessage id="COMMON.SAVE_AND_SEND" defaultMessage="Save & Send" />
  }>
          <i className="ki-outline ki-printer"></i> <FormattedMessage id="COMMON.SAVE_AND_SEND" defaultMessage="Save & Send" />

        </button>
      </div>
    </>
  );
};

export default InvoiceFooter;