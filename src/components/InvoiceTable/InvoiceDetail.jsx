import React from "react";
import { Button, Table, Upload } from "antd";
import { PaperClipOutlined, SettingOutlined } from "@ant-design/icons";

const InvoiceDetail = () => {
  const columns = [
    {
      title: "Function ",
      dataIndex: "function",
      key: "function",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Person",
      dataIndex: "person",
      key: "person",
    },
    {
      title: "Extra",
      dataIndex: "extra",
      key: "extra",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const data = [
    {
      key: "1",
      function: "Wedding Sofa",
      date: "11/11/2011",
      person: "20",
      extra: "0.0",
      rate: "1200",
      amount: "23,600.00",
    },
  ];
  const invoiceData = [
    { label: "Invoice Code", value: "INV-000001" },
    { label: "Invoice Date", value: "07/08/2025" },
    { label: "Due Date", value: "Due on Receipt" },
    { label: "Event Date", value: "07/08/2025" },
    { label: "Event Name", value: "Wedding" },
  ];

  const GSTdata = [{ label: "GST Number", value: "27ABJFA7206Q1ZY" }];

  return (
    <div className="bg-white rounded-xl shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] max-w-4xl mx-auto">
      <div className="p-4 relative flex justify-between items-start min-h-[60px]">
        <div className="absolute top-0 left-0">
          <div className="w-0 h-0  border-l-[60px] border-l-[#ADD8E6] border-b-[60px] border-b-transparent">
            <span className="absolute top-[13px] left-[3px] text-[#004986] text-xs font-semibold rotate-[-45deg]">
              Draft
            </span>
          </div>
        </div>

        <div className="ml-auto">
          <Button
            icon={<SettingOutlined className="fw-xlbold" />}
            className="bg-blue-100 text-blue-900 font-bold border-[#004986]"
          >
            Customized
          </Button>
        </div>
      </div>

      <div className=" p-4">
        <h2 className="text-2xl font-bold text-black">XYZ</h2>
        <p className="text-sm text-[#585562]">Gujarat, India</p>
        <p className="text-sm text-[#585562]">shree.swapnil101@gmail.com</p>
      </div>

      <div className="p-4 border grid grid-cols-2 gap-4 mt-4 text-sm">
        <div className="border-r border-gray-200 pr-4">
          {invoiceData.map((item, index) => (
            <p key={index} className="flex flex-row items-center text-sm">
              <span className="w-28 text-gray-500">{item.label}</span>
              <span className="font-medium">: {item.value}</span>
            </p>
          ))}
        </div>

        <div>
          {GSTdata.map((item, index) => (
            <p key={index} className="flex items-center text-sm">
              <span className="w-36 text-gray-500">{item.label}</span>
              <span className="font-medium">: {item.value}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 border bg-blue-100  gap-4 border-gray-200  overflow-hidden">
        <h4 className="font-bold text-sm text-[#464E5F]">Bill To</h4>
        <h4 className="font-bold text-sm text-[#464E5F]">Ship To</h4>
      </div>
      <div className=" p-4 grid grid-cols-2  gap-4 border-gray-200  overflow-hidden">
        <div className="border-r border-gray-200">
          <p className="text-sm">
            Swapnil Ghodeswar <br /> 08, XYZ Society, Ahmedabad, India
          </p>
        </div>
        <div>
          <p className="text-sm">08, XYZ Society, Ahmedabad, India</p>
        </div>
      </div>

      <div>
        <p className="border border-gray-200 p-4 text-sm text-gray-500 h-[100px]">
          Subject :
        </p>
      </div>

      <div className="mt-6">
        <h4 className="p-4 font-bold text-[#464E5F] border-b bg-blue-100">
          Function Table
        </h4>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="[&_.ant-table-thead>tr>th]:bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 text-sm text-black">
          <p>
            <strong>Total In Words</strong> <br />
            Indian Rupee Five Lakh Fifty-Five Thousand Five Hundred Fifty Only
          </p>
          <p className="mt-3">
            <strong>Notes</strong> <br />
            Thanks for your business.
          </p>
          {/* <p className="mt-3 flex justify-between">
                <strong>Payment Options</strong> <br />
                <img
                src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg"
                alt="PayPal"
                className="mt-1 h-10 w-[80px]"
                />
            </p> */}
          <p className="mt-3 text-xs text-[#585562]">
            Terms & Conditions <br />
            Your company's Terms and Conditions will be displayed here. You can
            add it in the Invoice Preferences page under Settings.
          </p>
        </div>
        <div className=" flex flex-col justify-between p-4 border border-gray-200  p-3 text-sm  ">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-[#464E5F]">Sub Total</span>
              <span className="text-[#292929]">₹ 23,600.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#464E5F]">CGST 9%</span>
              <span className="text-[#292929]">₹ 1800</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#464E5F]">SGST 9%</span>
              <span className="text-[#292929]">₹ 1800</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#464E5F]">IGST 9%</span>
              <span className="text-[#292929]">₹ 1800</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#464E5F]">Discount</span>
              <span className="text-[#292929]">₹ 1800</span>
            </div>
            <div className="flex justify-between mt-1 font-bold text-[#004986]">
              <span>Total</span>
              <span>₹ 23,600.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
