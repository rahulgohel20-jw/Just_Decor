import { useEffect, useState } from "react";
import { Button, Dropdown, Menu, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { GetInvoiceByUserId } from "@/services/apiServices"; // adjust path

export default function InvoiceList({ userId, onSelectInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await GetInvoiceByUserId(userId);
      console.log("Fetched invoices:", response?.data?.data?.["Event Invoice Details"]);
      if (response?.data?.data?.["Event Invoice Details"]) {
        setInvoices(response?.data?.data?.["Event Invoice Details"]);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchInvoices();
  }, [userId]);

  const menu = (
    <Menu>
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-xs h-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
          <option>All Invoice</option>
          <option>Draft</option>
          <option>Save/Send</option>
          <option>Paid</option>
        </select>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button className="rounded-lg border font-bold shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] border-[#ADD8E6] text-[##004986]">
            <MoreOutlined />
          </Button>
        </Dropdown>
      </div>

      {/* Invoice Items */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => onSelectInvoice(inv)}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">
                    {inv.billingname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {inv.invoiceCode || "No Code"} - {inv.createdAt} -{" "}
                    {inv.event?.venue}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                ₹ {inv.grandTotal || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
