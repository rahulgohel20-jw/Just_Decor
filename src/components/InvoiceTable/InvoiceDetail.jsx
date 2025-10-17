import React from "react";
import { Button, Table } from "antd";
import { EditOutlined, SettingOutlined } from "@ant-design/icons";

const InvoiceDetail = ({ invoice }) => {
  if (!invoice) {
    return <div className="text-center p-6 text-gray-500">Select an invoice to view details</div>;
  }

  const event = invoice.event || {};

  const columns = [
    { title: "Function", dataIndex: "function", key: "function" },
    { title: "Date & Time", dataIndex: "date", key: "date" },
    { title: "Person", dataIndex: "person", key: "person" },
    { title: "Extra", dataIndex: "extra", key: "extra" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  const data = event.eventFunctions?.map((f, idx) => ({
    key: idx,
    function: f.function.nameEnglish,
    date: `${f.function.startTime} - ${f.function.endTime}`,
    person: f.pax || "0",
    extra: f.extraCharges || "0",
    rate: "0",
    amount: "0",
  })) || [];

  const invoiceData = [
    { label: "Invoice Code", value: invoice.invoiceCode || "N/A" },
    { label: "Invoice Date", value: invoice.createdAt || "N/A" },
    { label: "Billing Name", value: invoice.billingname || "N/A" },
    { label: "Event Date", value: event.eventStartDateTime?.split("T")[0] },
    { label: "Event Name", value: event.eventType?.nameEnglish || "N/A" },
    { label: "Due Date", value: invoice.duedate || "N/A" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] max-w-4xl mx-auto">
      <div className="p-4 flex justify-between items-start">
        <div className="font-bold text-blue-900">Invoice Details</div>
        <Button icon={<EditOutlined />} className="bg-blue-100 text-blue-900 font-bold border-[#004986]">
          Edit
        </Button>
      </div>

      <div className="p-4 border grid grid-cols-2 gap-4 text-sm">
        {invoiceData.map((item, i) => (
          <p key={i} className="flex text-sm">
            <span className="w-32 text-gray-500">{item.label}</span>
            <span className="font-medium">: {item.value}</span>
          </p>
        ))}
      </div>

      <div className="mt-4">
        <h4 className="p-4 font-bold text-[#464E5F] border-b bg-blue-100">Function Table</h4>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
};

export default InvoiceDetail;
