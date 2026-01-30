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

const InvoiceFooter = ({
  invoiceData,
  rows,
  footerData,
  onFooterDataChange,
  onSave,
  isEdited,
  isNewInvoice,
}) => {
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

  // Calculate all amounts when values change - CORRECTED LOGIC with manual round off
  useEffect(() => {
    // Step 1: Calculate Subtotal (already done in previous useEffect)

    // Step 2: Apply Discount
    const discountAmount = Number(discount) || 0;

    // Step 3: Calculate Taxable Amount (Subtotal - Discount)
    const taxableAmount = subTotal - discountAmount;

    // Step 4: Calculate Tax Amounts on Taxable Amount (not on subtotal)
    const cgstAmount = (taxableAmount * Number(cgst)) / 100;
    const sgstAmount = (taxableAmount * Number(sgst)) / 100;
    const igstAmount = (taxableAmount * Number(igst)) / 100;

    // Step 5: Calculate Total Amount (Taxable Amount + All Taxes)
    const totalBeforeRounding =
      taxableAmount + cgstAmount + sgstAmount + igstAmount;

    // Step 6: Apply Manual Round Off
    const roundOffAmount = Number(roundOff) || 0;

    // Step 7: Calculate Grand Total (Total Amount + Round Off)
    const finalTotal = totalBeforeRounding + roundOffAmount;

    // Update all state values
    setCgstAmnt(cgstAmount);
    setSgstAmnt(sgstAmount);
    setIgstAmnt(igstAmount);
    setTotalAmount(totalBeforeRounding);
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
  }, [
    notes,
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
  ]);

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

  // Calculate taxable amount for display
  const taxableAmount = subTotal - (Number(discount) || 0);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-3 mb-5">
        <div className="min-w-full">
          <h4 className="text-base font-semibold leading-none text-gray-900 mb-2">
            <FormattedMessage id="COMMON.NOTES" defaultMessage="Notes" />
          </h4>
          <TextArea
            placeholder="Thanks for your Business..."
            autoSize={{ minRows: 18 }}
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
              <span className="text-sm text-gray-900">
                <FormattedMessage
                  id="COMMON.SUBTOTAL"
                  defaultMessage="Subtotal"
                />
              </span>
              <span className="font-semibold">₹{subTotal.toFixed(2)}</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">
                  <FormattedMessage
                    id="COMMON.DISCOUNT"
                    defaultMessage="Discount"
                  />
                </span>
                <Input
                  className="w-24 text-right"
                  type="number"
                  value={discount}
                  onChange={handleDiscountChange}
                  min={0}
                  step="0.01"
                  prefix="₹"
                />
              </div>
              <span className="font-semibold text-red-600">
                -₹{Number(discount).toFixed(2)}
              </span>
            </div>

            {/* Taxable Amount */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b bg-blue-50 px-2 py-1 rounded">
              <span className="text-sm font-semibold text-gray-900">
                <FormattedMessage
                  id="COMMON.TAXABLE_AMOUNT"
                  defaultMessage="Taxable Amount"
                />
              </span>
              <span className="font-bold text-blue-700">
                ₹{taxableAmount.toFixed(2)}
              </span>
            </div>

            {/* CGST - Calculated on taxable amount */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">CGST</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={cgst}
                  onChange={handleCgstChange}
                  min={0}
                  max={100}
                  step="0.01"
                  suffix="%"
                />
              </div>
              <span className="font-semibold text-gray-700">
                ₹{cgstAmnt.toFixed(2)}
              </span>
            </div>

            {/* SGST - Calculated on taxable amount */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">SGST</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={sgst}
                  onChange={handleSgstChange}
                  min={0}
                  max={100}
                  step="0.01"
                  suffix="%"
                />
              </div>
              <span className="font-semibold text-gray-700">
                ₹{sgstAmnt.toFixed(2)}
              </span>
            </div>

            {/* IGST - Calculated on taxable amount */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">IGST</span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={igst}
                  onChange={handleIgstChange}
                  min={0}
                  max={100}
                  step="0.01"
                  suffix="%"
                />
              </div>
              <span className="font-semibold text-gray-700">
                ₹{igstAmnt.toFixed(2)}
              </span>
            </div>

            {/* Total Amount (before round off) */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-900">
                <FormattedMessage
                  id="COMMON.TOTAL_AMOUNT"
                  defaultMessage="Total Amount"
                />
              </span>
              <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
            </div>

            {/* Round Off - Manual input, adds to grand total */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  <FormattedMessage
                    id="COMMON.ROUND_OFF"
                    defaultMessage="Round Off"
                  />
                </span>
                <Input
                  className="w-20 text-right"
                  type="number"
                  value={roundOff}
                  onChange={handleRoundOffChange}
                  step="0.01"
                  prefix="₹"
                />
              </div>
              <span
                className={`font-semibold ${roundOff >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {roundOff >= 0 ? "+" : ""}₹{Number(roundOff).toFixed(2)}
              </span>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between pt-2 font-semibold">
              <span className="text-base text-primary">
                <FormattedMessage
                  id="COMMON.GRAND_TOTAL"
                  defaultMessage="Grand Total"
                />
              </span>
              <span className="text-lg text-primary font-bold">
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
              <FormattedMessage
                id="COMMON.TERMS_AND_CONDITIONS"
                defaultMessage="Terms & Conditions"
              />

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
              <FormattedMessage
                id="COMMON.UPLOAD_FILE"
                defaultMessage="Upload File"
              />
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
        <button className="btn btn-light">
          <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
        </button>
        <button
          className="btn btn-primary"
          onClick={onSave}
          disabled={!isEdited}
        >
          <i className="ki-outline ki-paper-plane"></i>

          <FormattedMessage id="COMMON.SAVE_AND_SEND" defaultMessage="Save " />
        </button>
      </div>
    </>
  );
};

export default InvoiceFooter;
