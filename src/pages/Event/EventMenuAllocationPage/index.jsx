import React, { Fragment, useMemo, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

import {
  Input,
  Button,
  Checkbox,
  Select,
  InputNumber,
  Tabs,
  Collapse,
  Card,
  Divider,
  Badge,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

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
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50")
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

const OrderSummary = ({ groups }) => {
  return (
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
      extra={
        <Button type="primary" size="middle" className="!bg-blue-600">
          SHOW COUNTER
        </Button>
      }
    >
      <div className="divide-y">
        {groups.map((g, gi) => (
          <div key={gi} className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge color="#22c55e" />
              <span className="font-medium text-gray-900">{g.title}</span>
            </div>
            <div className="mt-2 grid grid-cols-12 gap-y-2 text-sm text-gray-700">
              {g.items.map((it, ii) => (
                <Fragment key={ii}>
                  <div className="col-span-9 pl-6">{it}</div>
                  <div className="col-span-3 text-right tabular-nums">0.00</div>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TableHeader = () => (
  <div className="grid grid-cols-12 items-center gap-3 border-b border-gray-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
    <div className="col-span-2">Category</div>
    <div className="col-span-3">Item Name</div>
    <div className="col-span-1 text-center">Chef Labour</div>
    <div className="col-span-1 text-center">Inside</div>
    <div className="col-span-1 text-center">Outside</div>
    <div className="col-span-1 text-center">Person</div>
    <div className="col-span-1 text-center">Place</div>
    <div className="col-span-2">Instructions</div>
  </div>
);

const TableRow = ({ row, onChange }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-3 border-b border-gray-100 px-4 py-3 text-sm">
      <div className="col-span-2 text-gray-600">{row.category}</div>
      <div className="col-span-3 font-medium text-gray-800">{row.item}</div>
      <div className="col-span-1 flex justify-center">
        <Checkbox
          checked={row.chef}
          onChange={(e) => onChange({ ...row, chef: e.target.checked })}
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <Checkbox
          checked={row.inside}
          onChange={(e) => onChange({ ...row, inside: e.target.checked })}
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <Checkbox
          checked={row.outside}
          onChange={(e) => onChange({ ...row, outside: e.target.checked })}
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <InputNumber
          size="small"
          min={0}
          value={row.person}
          onChange={(val) => onChange({ ...row, person: Number(val || 0) })}
          className="w-20"
        />
      </div>
      <div className="col-span-1">
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

  const updateRow = (updated) => {
    setRows((r) => r.map((x) => (x.key === updated.key ? updated : x)));
  };

  const filtered = useMemo(() => rows, [rows]);

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
              <button className="btn btn-sm btn-primary" title="Print">
                Delete
              </button>
              <button className="btn btn-sm btn-primary" title="Share">
                Save
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
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm ">
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
                    className="w-48"
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
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              <OrderSummary groups={groupsSeed} />
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default EventMenuAllocationPage;
