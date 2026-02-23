import { useState } from "react";
import {
  Download,
  Settings2,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Select, Checkbox, Table, Tag, Progress, Tooltip } from "antd";

const { Option } = Select;

const MEMBERS = [
  {
    name: "Member Four",
    role: "Senior Exec",
    initials: "MF",
    color: "#111111",
    completed: 3,
    overdue: 12,
    onTime: 100,
    quality: 72,
    efficiency: -40,
    effBadge: "error",
    status: "success",
  },
  {
    name: "Param",
    role: "Analyst",
    initials: "P",
    color: "#2563eb",
    completed: 1,
    overdue: 8,
    onTime: 100,
    quality: 68,
    efficiency: 0,
    effBadge: "success",
    status: "success",
  },
  {
    name: "Avinash",
    role: "Operations",
    initials: "A",
    color: "#7c3aed",
    completed: 1,
    overdue: 5,
    onTime: 100,
    quality: 65,
    efficiency: 0,
    effBadge: "success",
    status: "processing",
  },
  {
    name: "Rohan",
    role: "Lead",
    initials: "R",
    color: "#ea580c",
    completed: 2,
    overdue: 3,
    onTime: 92,
    quality: 78,
    efficiency: 12,
    effBadge: "warning",
    status: "success",
  },
  {
    name: "Sneha",
    role: "Designer",
    initials: "S",
    color: "#16a34a",
    completed: 1,
    overdue: 2,
    onTime: 88,
    quality: 71,
    efficiency: 5,
    effBadge: "cyan",
    status: "warning",
  },
];

const WORKLOAD = [
  { name: "Member Four", count: 34, pct: 85, color: "#111111" },
  { name: "Param", count: 22, pct: 55, color: "#2563eb" },
  { name: "Avinash", count: 18, pct: 45, color: "#16a34a" },
  { name: "Rohan", count: 25, pct: 62, color: "#ea580c" },
  { name: "Sneha", count: 12, pct: 30, color: "#dc2626" },
  { name: "Dev", count: 8, pct: 20, color: "#6b7280" },
  { name: "Priya", count: 15, pct: 38, color: "#2563eb" },
];

const RANK_STYLES = [
  "bg-amber-100 text-amber-800",
  "bg-gray-200 text-gray-700",
  "bg-orange-100 text-orange-800",
  "bg-blue-100 text-blue-800",
  "bg-gray-100 text-gray-600",
];

const TABS = ["Individual Performance", "Team Overview", "Workload"];

const STAT_CARDS = [
  {
    label: "Completed Tasks",
    value: 47,
    color: "text-green-600",
    bg: "bg-green-50",
    icon: <CheckCircle2 size={18} className="text-green-600" />,
    desc: "Total completed by team",
  },
  {
    label: "In Progress",
    value: 9,
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: <Loader2 size={18} className="text-blue-600" />,
    desc: "Currently being worked on",
  },
  {
    label: "Pending",
    value: 88,
    color: "text-gray-800",
    bg: "bg-gray-50",
    icon: <Clock size={18} className="text-gray-500" />,
    desc: "Not yet started",
  },
  {
    label: "Overdue",
    value: 99,
    color: "text-red-600",
    bg: "bg-red-50",
    icon: <AlertCircle size={18} className="text-red-600" />,
    desc: "Requires attention",
  },
];

const TABLE_COLUMNS = [
  {
    title: "Member",
    dataIndex: "name",
    key: "name",
    render: (_, m) => (
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: m.color }}
        >
          {m.initials}
        </div>
        <div>
          <div className="font-semibold text-sm">{m.name}</div>
          <div className="text-xs text-gray-400">{m.role}</div>
        </div>
      </div>
    ),
  },
  {
    title: "Completed",
    dataIndex: "completed",
    key: "completed",
    render: (v) => <span className="font-bold text-sm">{v}</span>,
  },
  {
    title: "Overdue",
    dataIndex: "overdue",
    key: "overdue",
    render: (v) => (
      <span
        className={`font-semibold text-sm ${v > 5 ? "text-red-500" : "text-orange-500"}`}
      >
        {v}
      </span>
    ),
  },
  {
    title: "On-Time",
    dataIndex: "onTime",
    key: "onTime",
    render: (v) => (
      <div className="flex items-center gap-2 min-w-[110px]">
        <Progress
          percent={v}
          size="small"
          showInfo={false}
          strokeColor="#16a34a"
          className="w-14"
        />
        <span className="text-xs font-medium">{v}%</span>
      </div>
    ),
  },
  {
    title: "Quality",
    dataIndex: "quality",
    key: "quality",
    render: (v) => (
      <Tooltip title={`Quality: ${v}/100`}>
        <Progress
          type="circle"
          percent={v}
          size={36}
          strokeColor={v >= 75 ? "#16a34a" : v >= 60 ? "#f59e0b" : "#dc2626"}
          format={() => <span className="text-[9px] font-bold">{v}</span>}
        />
      </Tooltip>
    ),
  },
  {
    title: "Efficiency",
    dataIndex: "efficiency",
    key: "efficiency",
    render: (v, m) => (
      <Tag color={m.effBadge} className="font-mono font-semibold">
        {v > 0 ? "+" : ""}
        {v}%
      </Tag>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v) => (
      <Tag color={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Tag>
    ),
  },
];

export default function TeamPerformance() {
  const [activeTab, setActiveTab] = useState(1);
  const [showUnderperf, setShowUnderperf] = useState(false);
  const [timePeriod, setTimePeriod] = useState("All Time");
  const [sortBy, setSortBy] = useState("Completed Tasks");

  return (
    <div className="min-h-screen  text-gray-900">
      <main className="px-9 py-8">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold tracking-tight leading-none m-0">
              DashBoard
            </h1>
            <p className="text-sm text-gray-800 mt-1 mb-0">
              Monitor team productivity and quality metrics
            </p>
          </div>
          <div className="flex gap-2.5"></div>
        </div>

        {/* ── Filters ── */}
        <div className="flex items-end gap-4 mb-6 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest">
              Time Period
            </span>
            <Select
              value={timePeriod}
              onChange={setTimePeriod}
              style={{ width: 160 }}
            >
              {[
                "All Time",
                "This Month",
                "Last 30 Days",
                "This Quarter",
                "This Year",
              ].map((o) => (
                <Option key={o} value={o}>
                  {o}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest">
              Sort By
            </span>
            <Select value={sortBy} onChange={setSortBy} style={{ width: 180 }}>
              {[
                "Completed Tasks",
                "On-Time Delivery",
                "Quality Score",
                "Task Efficiency",
              ].map((o) => (
                <Option key={o} value={o}>
                  {o}
                </Option>
              ))}
            </Select>
          </div>

          <div className="mb-0.5">
            <Checkbox
              checked={showUnderperf}
              onChange={(e) => setShowUnderperf(e.target.checked)}
            >
              <span className="text-sm text-gray-500">
                Show underperformers only
              </span>
            </Checkbox>
          </div>
        </div>

        {/* ── Tabs ── */}

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-3.5 mb-5">
          {STAT_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  {card.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  {card.icon}
                </div>
              </div>
              <div
                className={`text-4xl font-bold leading-none mb-1.5 ${card.color}`}
              >
                {card.value}
              </div>
              <div className="text-xs text-gray-700">{card.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Team Averages ── */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
          <div className="text-base font-bold mb-0.5">Team Averages</div>
          <div className="text-xs text-gray-700 mb-5">
            Average performance metrics across all team members
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                label: "On-Time Delivery",
                value: "66%",
                pct: 66,
                stroke: "#111111",
                neg: false,
              },
              {
                label: "Task Efficiency",
                value: "-30%",
                pct: 100,
                stroke: "#111111",
                neg: true,
              },
              {
                label: "Quality Score",
                value: "66/100",
                pct: 66,
                stroke: "#dc2626",
                neg: false,
              },
            ].map((avg) => (
              <div key={avg.label}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-gray-900">{avg.label}</span>
                  <span
                    className={`font-bold ${avg.neg ? "text-red-500" : "text-gray-900"}`}
                  >
                    {avg.value}
                  </span>
                </div>
                <Progress
                  percent={avg.pct}
                  showInfo={false}
                  strokeColor={avg.stroke}
                  trailColor="#e8e8e8"
                />
              </div>
            ))}
          </div>

          {/* Sparkline */}
          <div className="mt-6">
            <div className="text-[10px] font-semibold text-gray-700 uppercase tracking-widest mb-2">
              Completion Trend (Last 8 Weeks)
            </div>
          </div>
        </div>

        {/* ── Bottom Grid ── */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Top Performers */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-base font-bold">Top Performers</span>
            </div>
            <div className="text-xs text-gray-700 mb-4">
              Team members with highest on-time delivery
            </div>
            <div className="space-y-0.5">
              {MEMBERS.map((m, i) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3.5 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${RANK_STYLES[i]}`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {m.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {m.completed} completed • {m.onTime}% on-time
                    </div>
                  </div>
                  <Tag
                    color={m.effBadge}
                    className="font-mono font-semibold flex-shrink-0"
                  >
                    {m.efficiency > 0 ? "+" : ""}
                    {m.efficiency}% eff
                  </Tag>
                </div>
              ))}
            </div>
          </div>

          {/* Workload Distribution */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingDown size={16} className="text-orange-500" />
              <span className="text-base font-bold">Lead Distribution</span>
            </div>
            <div className="text-xs text-gray-700 mb-5">
              Active task count per team member
            </div>
            <div className="space-y-3">
              {WORKLOAD.map((w) => (
                <div key={w.name} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium text-gray-600 flex-shrink-0">
                    {w.name}
                  </span>
                  <div className="flex-1">
                    <Progress
                      percent={w.pct}
                      showInfo={false}
                      strokeColor={w.color}
                      trailColor="#f3f4f6"
                      size="small"
                    />
                  </div>
                  <span className="w-7 text-right text-xs font-semibold text-gray-400 font-mono">
                    {w.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── All Members Table ── */}
      </main>
    </div>
  );
}
