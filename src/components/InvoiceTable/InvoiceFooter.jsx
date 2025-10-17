import React, { useState, useEffect } from "react";
import {
  CloseOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Select, Radio, Input } from "antd";
import { Download } from "lucide-react";

const { TextArea } = Input;

const InvoiceFooter = ({ invoiceData, rows, onSave }) => {
  const [notes, setNotes] = useState("");
  const [gst, setGst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate subtotal from rows
 useEffect(() => {
  console.log("Rows in InvoiceFooter:", rows);
  if (rows && rows.length > 0) {
    const calculatedSubTotal = rows.reduce((sum, row) => {
      const person = Number(row.person) || 0;
      const rate = Number(row.rate) || 0;
      const extra = Number(row.extra) || 0;
      const amount = row.amount
        ? Number(row.amount)
        : person * rate + extra;
      return sum + amount;
    }, 0);
    setSubTotal(calculatedSubTotal);
  } else {
    setSubTotal(0);
  }
}, [rows]);


  // Calculate total amount when values change
  useEffect(() => {
    const gstAmount = (subTotal * Number(gst)) / 100;
    const sgstAmount = (subTotal * Number(sgst)) / 100;
    const total = subTotal + gstAmount + sgstAmount + Number(roundOff);
    setTotalAmount(total);
  }, [subTotal, gst, sgst, roundOff]);

  // Initialize data from invoiceData prop
  useEffect(() => {
    if (invoiceData) {
      setNotes(invoiceData.notes || "Thanks for your Business...");
      setGst(invoiceData.gst || 0);
      setSgst(invoiceData.sgst || 0);
      setRoundOff(invoiceData.roundOff || 0);
    }
  }, [invoiceData]);

  const handleGstChange = (e) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    setGst(isNaN(numValue) ? 0 : numValue);
  };

  const handleSgstChange = (e) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    setSgst(isNaN(numValue) ? 0 : numValue);
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
            Notes
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
            Summary
          </h4>
          <div className="border rounded-lg min-w-full p-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-900">Subtotal</span>
              <span className="font-semibold">₹{subTotal.toFixed(2)}</span>
            </div>
            
            {/* GST */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">GST (%)</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={gst}
                  onChange={handleGstChange}
                  min={0}
                  max={100}
                  step="0.01"
                />
              </div>
              <span className="font-semibold">
                ₹{((subTotal * gst) / 100).toFixed(2)}
              </span>
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
              <span className="font-semibold">
                ₹{((subTotal * sgst) / 100).toFixed(2)}
              </span>
            </div>
            
            {/* Round Off */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">Round Off</span>
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
            
            {/* Total */}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span className="text-base text-primary">Total Amount</span>
              <span className="text-base text-primary">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-3 mb-5">
        <div className="min-w-full">
          <div className="p-3 border rounded-lg whitespace-pre-line text-sm">
            <h4 className="text-base font-semibold leading-none text-gray-900 mb-2">
              Terms & Conditions
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
              Attach File(s) to Invoice
            </h4>
            <Button
              icon={<UploadOutlined />}
              className="mb-1 border-gray-300 text-primary"
            >
              Upload File
            </Button>
            <p className="text-xs text-gray-500">
              You can upload maximum 10mb file
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button className="btn btn-light" title="Cancel">
          Cancel
        </button>
        <button className="btn btn-primary" title="Save & Send"  onClick={onSave}>
          <i className="ki-outline ki-paper-plane"></i>
          Save & Send
        </button>
        <button className="btn btn-success" title="Save as Draft">
          <i className="ki-outline ki-printer"></i> Save as Draft
        </button>
      </div>
    </>
  );
};

export default InvoiceFooter;