import React, { useState } from "react";
import { CloseOutlined, SaveOutlined, SendOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Select, Radio, Input } from "antd";

const { TextArea } = Input;

const InvoiceFooter = () => {
  const [taxType, setTaxType] = useState("TDS");

  return (
    <div className="space-y-4 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1 text-[#464E5F]">
            Customers Notes<span className="text-red-500">*</span>
          </label>
          <TextArea
            placeholder="Thanks for your Business..."
            autoSize={{ minRows: 7 }}
            className="border rounded-lg border-[#004986]"
          />
        </div>

        <div className=" shadow-[2px_2px_2px_2px_rgba(0,0,0,0.25)] border rounded-lg p-4">
          <label className="block font-semibold mb-2">Total Amount</label>
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-10 mb-2">
              <Radio.Group
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
              >
                <Radio value="TDS">TDS</Radio>
                <Radio value="TCS">TCS</Radio>
              </Radio.Group>
              <Select
                placeholder="Select Tax"
                className="w-32"
                options={[
                  { value: "gst5", label: "GST 5%" },
                  { value: "gst12", label: "GST 12%" },
                ]}
              />
            </div>
            <span className="font-semibold">0.0</span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span>Adjustment Amount</span>
              <Input className="w-28 text-right" defaultValue="0.0" />
            </div>
            <span className="font-semibold">0.0</span>
          </div>

          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total Amount</span>
            <span>0.0</span>
          </div>
        </div>
      </div>

      <div className="p-4 mt-5 flex items-center justify-between gap-8 w-fit shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] rounded-lg bg-white">
        <div className="w-full">
          <label className="block font-semibold mb-1">
            Terms & Conditions<span className="text-red-500">*</span>
          </label>
          <div className="border rounded-lg p-3 whitespace-pre-line w-[400px] text-sm border-[#004986]">
            HDFC BANK
            {"\n"}AC NO. :- 50200013422306
            {"\n"}BRANCH :- DARPAN SIX ROAD
            {"\n"}IFSC CODE :- HDFC0001678
            {"\n"}AC NAME :- SHREE INFOTECH
          </div>
        </div>

        <div className="flex flex-col gap-12 w-full">
          <div>
            <label className="block font-semibold mb-1">
              Attach File(s) to Invoice
            </label>
            <Button
              icon={<UploadOutlined />}
              className="mb-1 border-[#004986] text-[#004986]"
            >
              Upload File
            </Button>
            <p className="text-xs   text-[#004986]">
              you can upload maximum 10mb file
            </p>
          </div>

          

<div className="flex gap-8">
  {/* Save as Draft */}
  

  {/* Save & Send */}
  

  {/* Cancel */}
  <Button
    icon={<CloseOutlined />}
    className="border border-danger text-danger font-semibold rounded-lg 
                hover:!text-[#EF4444] hover:!border-[#DC2626] 
               flex items-center gap-2 shadow-md"
  >
    Cancel
  </Button>
  <Button
    icon={<SendOutlined />}
    className="bg-[#2563EB] text-white font-semibold rounded-lg 
               hover:!bg-[#1E40AF] flex items-center gap-2 shadow-md"
  >
    Save & Send
  </Button>
  <Button
    icon={<SaveOutlined />}
    className="bg-[#003366] text-white font-semibold rounded-lg 
               hover:!bg-[#2563EB] flex items-center gap-2 shadow-md"
  >
    Save as Draft
  </Button>
</div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
