import { Button, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const eventData = [
 {
    id: 1,
    name: "Swapnil",
    Event: "Wedding",
    EventNo: "INV - 001",
    date: "07/08/2025",
    Venue: "Vrundavan Banquets",
    amount: "₹ 20,000",
  },
  {
    id: 2,
    name: "Priya Sharma",
    Event: "Engagement",
    EventNo: "INV - 002",
    date: "15/09/2025",
    Venue: "The Grand Palace",
    amount: "₹ 35,000",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    Event: "Corporate Party",
    EventNo: "INV - 003",
    date: "28/09/2025",
    Venue: "Hotel Royal Orchid",
    amount: "₹ 50,000",
  },
  {
    id: 4,
    name: "Sneha Patil",
    Event: "Birthday Celebration",
    EventNo: "INV - 004",
    date: "05/10/2025",
    Venue: "Blue Moon Lounge",
    amount: "₹ 18,000",
  },
  {
    id: 5,
    name: "Arjun Verma",
    Event: "Reception",
    EventNo: "INV - 005",
    date: "12/10/2025",
    Venue: "The Orchid Garden",
    amount: "₹ 45,000",
  },
];

export default function QuotationList() {
  const menu = (
    <Menu>
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white  rounded-2xl p-4 w-full max-w-xs h-auto  ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
          <option>All Quotations</option>
          <option>Draft</option>
          <option>Save/Send</option>
          <option>Paid</option>
        </select>
        <Dropdown overlay={menu} trigger={["click"]}>
           <Button className="rounded-lg border font-bold  shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] border-[#ADD8E6] text-[##004986]">
              <MoreOutlined />
            </Button>
        </Dropdown>
      </div>

      {/* Invoice Items */}
      <div className="grid gap-4">
  {eventData.map((inv) => (
    <div
      key={inv.id}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer p-5"
    >
      <div className="flex justify-between items-center mb-2 gap-4">
        <span className="text-xs font-semibold bg-[#005BA8]/10 text-[#005BA8] px-3 py-1 rounded-full uppercase tracking-wide">
          {inv.Event}
        </span>
        <p className="text-md font-bold text-[#005BA8]">{inv.amount}</p>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="font-semibold text-gray-900 text-base">{inv.name}</p>
          <span className="text-sm text-gray-500">{inv.date}</span>
          <p className="text-xs text-gray-500 mt-1">
            {inv.EventNo} • {inv.Venue}
          </p>
        </div>

        
      </div>
    </div>
  ))}
</div>




    </div>
  );
}
