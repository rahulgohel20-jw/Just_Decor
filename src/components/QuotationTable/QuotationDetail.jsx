import React from "react";
import { Button, Table, Upload } from "antd";
import { PaperClipOutlined, SettingOutlined } from "@ant-design/icons";

const QuotationDetail = () => {
  const columns = [
    { title: "Function Name", dataIndex: "function", key: "function" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Discount", dataIndex: "discount", key: "discount" },
    { title: "Tax", dataIndex: "tax", key: "tax" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  const data = [
    {
      key: "1",
      function: "Dinner",
      quantity: "1.0",
      rate: "20,000.0",
      discount: "0.0",
      tax: "18%",
      amount: "23,600.00",
    },
  ];

  const invoiceData = [
    { label: "#", value: "INV-000001" },
    { label: "Invoice Date", value: "07/08/2025" },
    { label: "Terms", value: "Due on Receipt" },
    { label: "Due Date", value: "07/08/2025" },
    { label: "P.O.#", value: "Sofa" },
  ];

  const GSTdata = [
    { label: "GST Number", value: "27ABJFA7206Q1ZY" },
    { label: "GST Treatment", value: "Registered Business - Regular" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-5xl mx-auto border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-[#005BA8]">Quotation</h2>
          <p className="text-gray-500 text-sm">XYZ • Gujarat, India</p>
          <p className="text-gray-500 text-sm">shree.swapnil101@gmail.com</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* <div className="relative">
            <div className="absolute -top-4 -left-4 w-0 h-0 border-l-[60px] border-l-[#B0D5F2] border-b-[60px] border-b-transparent">
              <span className="absolute top-[13px] left-[3px] text-[#005BA8] text-xs font-semibold rotate-[-45deg]">
                Draft
              </span>
            </div>
          </div> */}
          <Button
            icon={<SettingOutlined />}
            className="font-semibold border-[#005BA8] text-[#005BA8] hover:bg-[#005BA8] hover:text-white transition-all"
          >
            Customize
          </Button>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-6 grid grid-cols-2 gap-8 text-sm border-b border-gray-100">
        <div className="border-r border-gray-200 pr-6">
          {invoiceData.map((item, index) => (
            <p key={index} className="flex justify-between mb-1">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </p>
          ))}
        </div>

        <div>
          {GSTdata.map((item, index) => (
            <p key={index} className="flex justify-between mb-1">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </p>
          ))}

          <div className="mt-5 flex justify-between items-center">
            <span className="text-gray-500">Attach File(s)</span>
            <Upload>
              <Button
                icon={<PaperClipOutlined />}
                className="border-[#005BA8] text-[#005BA8] hover:bg-[#005BA8] hover:text-white rounded-md transition-all"
              >
                View File
              </Button>
            </Upload>
          </div>
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="grid grid-cols-2 text-sm">
        <div className="bg-[#EAF4FB] p-3 font-semibold text-[#005BA8] border-r border-gray-200">
          Bill To
        </div>
        <div className="bg-[#EAF4FB] p-3 font-semibold text-[#005BA8]">
          Ship To
        </div>
      </div>

      <div className="grid grid-cols-2 text-sm border-b border-gray-100">
        <div className="p-4 border-r border-gray-200">
          Swapnil Ghodeswar <br /> 08, XYZ Society, Ahmedabad, India
        </div>
        <div className="p-4">08, XYZ Society, Ahmedabad, India</div>
      </div>

      {/* Subject */}
      <div className="p-4 text-sm text-gray-600 border-b border-gray-100 min-h-[100px]">
        <strong>Subject:</strong>
      </div>

      {/* Items Table */}
      <div className="mt-6">
        <h4 className="p-4 font-semibold text-[#005BA8] bg-[#EAF4FB] border-b border-gray-200">
          Item Details
        </h4>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="!border-0 [&_.ant-table-thead>tr>th]:bg-[#F8FAFC] [&_.ant-table-thead>tr>th]:text-[#005BA8]"
        />
      </div>

      {/* Footer / Totals */}
      <div className="grid grid-cols-2">
        {/* Left Side */}
        <div className="p-6 text-sm text-gray-700">
          <p>
            <strong>Total in Words:</strong> <br />
            Indian Rupee Twenty-Three Thousand Six Hundred Only
          </p>
          <p className="mt-4">
            <strong>Notes:</strong> <br />
            Thanks for your business.
          </p>
          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            <strong>Terms & Conditions:</strong> <br />
            Your company’s Terms and Conditions will appear here. You can edit
            them in the Invoice Preferences under Settings.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-between p-6 border-l border-gray-100 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Sub Total</span>
              <span>₹ 23,600.00</span>
            </div>
            <div className="flex justify-between font-bold text-[#005BA8] text-base">
              <span>Total</span>
              <span>₹ 23,600.00</span>
            </div>
            <div className="border-t mt-4 border-gray-200"></div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            Authorized Signature
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
