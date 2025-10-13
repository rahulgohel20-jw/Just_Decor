import React, { Fragment, useMemo, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import SidebarChefModal from "../../../components/sidebarchefmodal/SidebarChefModal";
import { Input, Checkbox, Select, InputNumber, Card, Badge } from "antd";
import SidebarModal from "../../../components/SidebarModal/SidebarModal";
import CategorySidebarModal from "../CategorySidebar/CategorySidebarModal";
import WhatsappSidebarMenu from "../whatsappsidebar/WhatsappSidebarMenu";
const menuRowsSeed = [
  {
    key: "1",
    category: "HEALTH FREAKS",
    item: "CUCUMBER CELERY",
    chef: false,
    inside: true,
    outside: false,
    person: 450,
    place: "At venue",
    instructions: "",
  },
  {
    key: "2",
    category: "HEALTH FREAKS",
    item: "CUCUMBER CELERY",
    chef: false,
    inside: false,
    outside: true,
    person: 450,
    place: "At venue",
    instructions: "",
  },
  {
    key: "3",
    category: "HEALTH FREAKS",
    item: "CUCUMBER CELERY",
    chef: true,
    inside: false,
    outside: false,
    person: 450,
    place: "At venue",
    instructions: "",
  },
  {
    key: "4",
    category: "HEALTH FREAKS",
    item: "CUCUMBER CELERY",
    chef: true,
    inside: false,
    outside: false,
    person: 450,
    place: "At venue",
    instructions: "",
  },
  {
    key: "5",
    category: "HEALTH FREAKS",
    item: "CUCUMBER CELERY",
    chef: true,
    inside: false,
    outside: false,
    person: 450,
    place: "At venue",
    instructions: "",
  },
];

const groupsSeed = [
  {
    title: "Health Freaks",
    items: [
      "CUCUMBER CELERY (OUTSIDE)",
      "CARROT BEETROOT (OUTSIDE)",
      "ORANGE GUAVA PICANTE (OUT)",
      "SNOW DRAGON (OUTSIDE)",
    ],
  },
  {
    title: "Tapri",
    items: [
      "CUCUMBER CELERY (OUTSIDE)",
      "CARROT BEETROOT (OUTSIDE)",
      "ORANGE GUAVA PICANTE (OUT)",
      "SNOW DRAGON (OUTSIDE)",
    ],
  },
];

const TopTabs = ({ value, onChange }) => {
  const tabs = [
    { key: "dinner", label: "Dinner" },
    { key: "lunch", label: "Lunch" },
    { key: "hi-tea", label: "Hi-Tea" },
  ];
  return (
    <div className="flex gap-3">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={
            "min-w-[96px] rounded-md px-5 py-2 text-sm font-medium transition " +
            (value === t.key
              ? "bg-primary text-white shadow"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50")
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

const OrderSummary = ({ groups, onItemClick }) => {
  return (
    <div className="flex flex-col gap-2">
      <button className="btn btn-sm btn-primary p-6 flex justify-center text-lg">
        Show Counter
      </button>
      <Card
        className="w-full border border-gray-200 shadow-sm"
        bodyStyle={{ padding: 0 }}
        title={
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ✱
            </span>
            <span className="text-gray-800">Order Summary</span>
          </div>
        }
      >
        <div className="divide-y">
          {groups.map((g, gi) => (
            <div key={gi} className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge color="#22c55e" />
                <span className="font-medium text-gray-900">{g.title}</span>
              </div>
              <div className="mt-2 grid grid-cols-12 gap-y-2 text-sm text-gray-700 cursor-pointer">
                {g.items.map((it, ii) => (
                  <Fragment key={ii}>
                    <div
                      className="col-span-9 pl-6 hover:text-primary"
                      onClick={() => onItemClick(it, g)}
                    >
                      {it}
                    </div>
                    <div className="col-span-3 text-right tabular-nums">
                      0.00
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const TableHeader = () => (
  <div className="grid grid-cols-12 items-center gap-3 border-b border-gray-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
    <div className="col-span-3 ">Item Name</div>
    <div className="col-span-2 text-center">Chef Labour</div>
    <div className="col-span-1 text-center">Outside</div>
    <div className="col-span-1 text-center">Inside</div>
    <div className="col-span-1 text-center">Person</div>
    <div className="col-span-2 text-center">Place</div>
    <div className="col-span-2">Instructions</div>
  </div>
);

const TableRow = ({ row, onChange }) => {
  const handleCheckboxChange = (type, checked) => {
    const updated = {
      ...row,
      chef: type === "chef" ? checked : false,
      outside: type === "outside" ? checked : false,
      inside: type === "inside" ? checked : false,
    };

    onChange(updated);

    // Open respective sidebars
    if (type === "outside" && checked && row.openSidebar) {
      row.openSidebar();
    }
    if (type === "chef" && checked && row.openChefSidebar) {
      row.openChefSidebar();
    }
  };

  return (
    <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-4 py-3 text-sm">
      <div className="col-span-3 font-medium text-gray-800">{row.item}</div>

      <div className="col-span-2 flex justify-center">
        <Checkbox
          checked={row.chef}
          onChange={(e) => handleCheckboxChange("chef", e.target.checked)}
        />
      </div>

      <div className="col-span-1 flex justify-center">
        <Checkbox
          checked={row.outside}
          onChange={(e) => handleCheckboxChange("outside", e.target.checked)}
        />
      </div>

      <div className="col-span-1 flex justify-center">
        <Checkbox
          checked={row.inside}
          onChange={(e) => handleCheckboxChange("inside", e.target.checked)}
        />
      </div>

      <div className="col-span-1 flex justify-center">
        <InputNumber
          size="small"
          min={0}
          value={row.person}
          onChange={(val) => onChange({ ...row, person: Number(val || 0) })}
          className="w-30 p-1"
        />
      </div>

      <div className="col-span-2">
        <Select
          size="small"
          value={row.place}
          onChange={(val) => onChange({ ...row, place: val })}
          className="w-full"
          options={[
            { value: "At venue", label: "At venue" },
            { value: "Outside", label: "Outside" },
          ]}
        />
      </div>

      <div className="col-span-2">
        <Input
          size="small"
          placeholder=""
          value={row.instructions}
          onChange={(e) => onChange({ ...row, instructions: e.target.value })}
        />
      </div>
    </div>
  );
};

const EventMenuAllocationPage = () => {
  const [activeTab, setActiveTab] = useState("dinner");
  const [rows, setRows] = useState(menuRowsSeed);
  const [people, setPeople] = useState(450);
  const [percentage, setPercentage] = useState("");
  const [open, setOpen] = useState(false);
  const [isChefModal, setIsChefModal] = useState(false);
  const [isCategoryModal, setIsCategoryModal] = useState(false);
  const [iswhatsAppSidebar, setIsWhatsAppSidebar] = useState(false);

  const updateRow = (updated) => {
    setRows((r) => r.map((x) => (x.key === updated.key ? updated : x)));
  };

  const filtered = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        openSidebar: () => {
          setIsChefModal(false);
          setOpen(true);
        },
        openChefSidebar: () => {
          setOpen(false);
          setIsChefModal(true);
        },
      })),
    [rows]
  );

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Allocation" }]} />
        </div>

        {/* Event Details */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Id:</span>
                    <span className="text-sm font-medium text-gray-900">
                      EV001
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-user text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Party name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Vivek
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-geolocation-home text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Wedding
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Venue</span>
                    <span className="text-sm font-medium text-gray-900">
                      Ahmedabad
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Date & Time</span>
                    <span className="text-sm font-medium text-gray-900">
                      12/12/2025 10:00PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#20c964] text-white shadow hover:brightness-95"
                title="Share on WhatsApp"
                onClick={() => setIsWhatsAppSidebar(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.44.03.16 5.32.16 11.93c0 2.1.55 4.14 1.6 5.95L0 24l6.29-1.73a11.9 11.9 0 0 0 5.75 1.48h.01c6.59 0 11.86-5.28 11.89-11.88a11.87 11.87 0 0 0-3.42-8.39ZM12.05 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.73 1.03 1-3.64-.22-.37A9.25 9.25 0 0 1 2.78 11.9c0-5.11 4.16-9.28 9.29-9.3 2.48 0 4.81.97 6.56 2.72a9.26 9.26 0 0 1 2.72 6.56c-.02 5.12-4.18 9.3-9.3 9.31Zm5.32-6.93c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.15-.65.15-.2.29-.74.94-.91 1.13-.17.19-.34.21-.63.08-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.09-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.58-.48-.5-.65-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
                </svg>
              </button>

              <button className="btn btn-sm btn-primary" title="Share">
                Save
              </button>
              <button className="btn btn-sm btn-primary" title="Print">
                Sync Raw Material
              </button>
              <button className="btn btn-sm btn-primary" title="Print">
                Sync Agency
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* Top bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <TopTabs value={activeTab} onChange={setActiveTab} />
          </div>
          <div className="flex gap-6">
            <div className="w-[70%] flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm ">
              <div className="flex ">
                <div className="flex w-fit  items-center gap-3">
                  <div className="filItems relative">
                    <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                    <input
                      className="input pl-8"
                      placeholder="Search item"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex w-full items-center justify-start gap-5 md:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Person</span>
                    <span className="text-sm text-gray-600">125</span>
                  </div>
                  <Input
                    placeholder="Enter Person"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="input w-28"
                  />

                  <button className="btn btn-sm btn-primary p-4" title="Report">
                    Adjust Person
                  </button>
                  <button className="btn btn-sm btn-primary p-4" title="Report">
                    Report
                  </button>
                </div>
              </div>
              <div className="col-span-8 lg:col-span-8 xl:col-span-9">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <TableHeader />
                  <div className="divide-y">
                    {filtered.map((row) => (
                      <TableRow key={row.key} row={row} onChange={updateRow} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[30%] col-span-12 lg:col-span-4 xl:col-span-3">
              <OrderSummary
                groups={groupsSeed}
                onItemClick={(item, group) => {
                  console.log(
                    "Clicked item:",
                    item,
                    "from group:",
                    group.title
                  );
                  setIsCategoryModal(true);
                }}
              />
            </div>
          </div>
        </div>
        <SidebarModal open={open} onClose={() => setOpen(false)} />
        <SidebarChefModal
          open={isChefModal}
          onClose={() => setIsChefModal(false)}
        />
        <CategorySidebarModal
          open={isCategoryModal}
          onClose={() => setIsCategoryModal(false)}
        />
        <WhatsappSidebarMenu
          open={iswhatsAppSidebar}
          onClose={() => setIsWhatsAppSidebar(false)}
        />
      </Container>
    </Fragment>
  );
};

export default EventMenuAllocationPage;
