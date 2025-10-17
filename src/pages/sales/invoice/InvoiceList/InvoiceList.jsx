import React, { useState } from "react";
import InvoiceList from "@/components/InvoiceTable/InvoiceList";
import InvoiceDetail from "@/components/InvoiceTable/InvoiceDetail";
import { Button, Dropdown, Menu } from "antd";
import {
  ShareAltOutlined,
  SendOutlined,
  PrinterOutlined,
  DollarCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";

export default function InvoiceViewPage() {
  // ✅ Step 1: Keep track of the selected invoice
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Menu for options (you can expand this later)
  const menu = (
    <Menu
      items={[
        { key: "1", label: "Delete" },
        { key: "2", label: "Save" },
      ]}
    />
  );

  return (
    <div className="p-4 flex">
      {/* ✅ Step 2: Pass a callback to InvoiceList */}
      <InvoiceList
        userId={1} // replace with logged-in user ID dynamically later
        onSelectInvoice={setSelectedInvoice}
      />

      <div className="p-4 flex flex-col gap-4 items-center w-full">
        {/* ✅ Step 3: Header shows selected invoice code dynamically */}
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-lg font-bold text-primary">
            {selectedInvoice?.invoiceCode
              ? `INV – ${selectedInvoice.invoiceCode}`
              : "Select an Invoice"}
          </span>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center w-full gap-2 ps-4">
          <Button
            icon={<ShareAltOutlined className="text-[#00447A]" />}
            className="rounded-lg border font-bold shadow-[4px_4px_17px_2px_rgba(0,0,0,0.15)] text-[#00447A] w-[110px]"
          >
            Share
          </Button>

          <Button
            icon={<SendOutlined className="text-[#8B5300]" />}
            className="rounded-lg border font-bold shadow-[4px_4px_17px_2px_rgba(0,0,0,0.15)] text-[#8B5300] w-[110px]"
          >
            Send
          </Button>

          <Button
            icon={<PrinterOutlined className="text-[#5D006D]" />}
            className="rounded-lg border font-bold shadow-[4px_4px_17px_2px_rgba(0,0,0,0.15)] text-[#5D006D] w-[110px]"
          >
            Print
          </Button>

          <Button
            icon={<DollarCircleOutlined className="text-[#00534B]" />}
            className="rounded-lg border font-bold shadow-[4px_4px_17px_2px_rgba(0,0,0,0.15)] text-[#00534B] w-[170px]"
          >
            Record Payment
          </Button>
        </div>

        <div className="border border-dashed mb-4 border-[#0000001A] w-full mt-4"></div>

        {/* ✅ Step 4: Show details of selected invoice */}
        <div className="w-full">
          <InvoiceDetail invoice={selectedInvoice} />
        </div>
      </div>
    </div>
  );
}
