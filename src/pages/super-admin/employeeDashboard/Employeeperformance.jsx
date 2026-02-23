import { useState, useMemo } from "react";
import { Input, Button, Select, Checkbox, Tag } from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  CheckCircle,
  Clock,
  Hourglass,
  AlarmClock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const { Option } = Select;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const MEMBERS = [
  {
    id: 1,
    name: "Member One",
    role: "member",
    under: false,
    total: 13,
    completed: 12,
    inProgress: 0,
    pending: 1,
    late: 0,
    overdue: 1,
    onTime: 92,
    efficiency: -6,
    quality: 92,
  },
  {
    id: 2,
    name: "Gagan",
    role: "member",
    under: true,
    total: 79,
    completed: 6,
    inProgress: 7,
    pending: 63,
    late: 6,
    overdue: 70,
    onTime: 33,
    efficiency: -89,
    quality: 33,
  },
  {
    id: 3,
    name: "Member Two",
    role: "member",
    under: false,
    total: 7,
    completed: 6,
    inProgress: 0,
    pending: 0,
    late: 1,
    overdue: 1,
    onTime: 83,
    efficiency: -14,
    quality: 83,
  },
  {
    id: 4,
    name: "Member Six",
    role: "member",
    under: true,
    total: 5,
    completed: 4,
    inProgress: 0,
    pending: 1,
    late: 2,
    overdue: 1,
    onTime: 50,
    efficiency: -20,
    quality: 50,
  },
  {
    id: 5,
    name: "Member Four",
    role: "member",
    under: true,
    total: 5,
    completed: 3,
    inProgress: 0,
    pending: 0,
    late: 0,
    overdue: 2,
    onTime: 100,
    efficiency: -40,
    quality: 100,
  },
  {
    id: 6,
    name: "Member 7",
    role: "member",
    under: true,
    total: 3,
    completed: 3,
    inProgress: 0,
    pending: 0,
    late: 0,
    overdue: 0,
    onTime: 0,
    efficiency: 0,
    quality: 0,
  },
  {
    id: 7,
    name: "Member Five",
    role: "member",
    under: true,
    total: 5,
    completed: 3,
    inProgress: 0,
    pending: 2,
    late: 2,
    overdue: 2,
    onTime: 33,
    efficiency: -40,
    quality: 33,
  },
  {
    id: 8,
    name: "Member Three",
    role: "member",
    under: false,
    total: 3,
    completed: 3,
    inProgress: 0,
    pending: 0,
    late: 0,
    overdue: 0,
    onTime: 100,
    efficiency: 0,
    quality: 100,
  },
  {
    id: 9,
    name: "Vikas",
    role: "member",
    under: true,
    total: 22,
    completed: 1,
    inProgress: 2,
    pending: 18,
    late: 1,
    overdue: 21,
    onTime: 0,
    efficiency: -95,
    quality: 0,
  },
  {
    id: 10,
    name: "Param",
    role: "member",
    under: false,
    total: 1,
    completed: 1,
    inProgress: 0,
    pending: 0,
    late: 0,
    overdue: 0,
    onTime: 100,
    efficiency: 0,
    quality: 100,
  },
  {
    id: 11,
    name: "Ananya S.",
    role: "member",
    under: false,
    total: 9,
    completed: 8,
    inProgress: 1,
    pending: 0,
    late: 0,
    overdue: 0,
    onTime: 88,
    efficiency: 5,
    quality: 91,
  },
  {
    id: 12,
    name: "Rohan K.",
    role: "member",
    under: false,
    total: 6,
    completed: 5,
    inProgress: 1,
    pending: 0,
    late: 0,
    overdue: 0,
    onTime: 95,
    efficiency: -3,
    quality: 87,
  },
];

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-500",
  "bg-red-500",
  "bg-cyan-600",
  "bg-purple-600",
  "bg-green-600",
  "bg-orange-500",
  "bg-blue-600",
  "bg-teal-600",
  "bg-pink-600",
];

const TABS = ["Individual Performance", "Team Overview", "Workload"];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const qualityInfo = (q) => {
  if (q >= 80)
    return { label: "Excellent", color: "text-green-600", bar: "bg-green-500" };
  if (q >= 50)
    return { label: "Good", color: "text-amber-600", bar: "bg-amber-500" };
  return {
    label: "Needs Improvement",
    color: "text-red-500",
    bar: "bg-red-500",
  };
};

const onTimeInfo = (v) => {
  if (v >= 80) return "bg-green-500";
  if (v >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const effColor = (v) => {
  if (v >= -20) return "text-green-600";
  if (v >= -40) return "text-amber-600";
  return "text-red-500";
};

const effBar = (v) => {
  if (v >= -20) return "bg-green-500";
  if (v >= -40) return "bg-amber-500";
  return "bg-red-500";
};

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
const ProgressBar = ({ value, colorClass }) => (
  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
    <div
      className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
      style={{ width: `${Math.min(Math.abs(value), 100)}%` }}
    />
  </div>
);

/* ─────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────── */
const Avatar = ({ name, idx }) => (
  <div
    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
  >
    {getInitials(name)}
  </div>
);

/* ─────────────────────────────────────────────
   STAT MINI CARD (top summary)
───────────────────────────────────────────── */
const StatCard = ({ label, count, icon, iconBg }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}
    >
      {icon}
    </div>
    <p className="text-gray-500 text-sm">{label}</p>
    <h2 className="text-2xl font-bold text-gray-800">{count}</h2>
  </div>
);

/* ─────────────────────────────────────────────
   MEMBER CARD
───────────────────────────────────────────── */
const MemberCard = ({ member, idx }) => {
  const qi = qualityInfo(member.quality);
  const effSign = member.efficiency > 0 ? "+" : "";

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition p-5 ${member.under ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}
    >
      {/* ── Top Row ── */}
      <div className="flex items-start justify-between mb-4 ">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} idx={idx} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-800">
                {member.name}
              </span>
              {member.under && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-red-200">
                  <AlertTriangle className="w-3 h-3" /> Underperforming
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">
              {member.role}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800 leading-none">
            {member.total}
          </div>
          <div className="text-xs text-gray-900 mt-0.5">Total Tasks</div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-4 gap-4">
        {/* Tasks Breakdown */}
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Tasks
          </p>
          <div className="space-y-1">
            {[
              ["Hot", member.completed, "text-gray-700"],
              ["Cold", member.inProgress, "text-gray-700"],
              [
                "Won",
                member.pending,
                member.pending > 5
                  ? "text-amber-600 font-bold"
                  : "text-gray-700",
              ],
              [
                "Lost",
                member.late,
                member.late > 0 ? "text-amber-600 font-bold" : "text-gray-700",
              ],
              [
                "client Dmeo",
                member.overdue,
                member.overdue > 0 ? "text-red-500 font-bold" : "text-gray-700",
              ],
            ].map(([label, val, cls]) => (
              <div
                key={label}
                className="flex justify-between items-center text-xs text-gray-500"
              >
                <span>{label}:</span>
                <span className={`font-mono ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* On-Time Delivery */}
        <div>
          <p className="text-xs font-semibold text-black uppercase tracking-wide mb-2">
            On-Time Delivery
          </p>
          <div className="text-xl font-bold text-gray-800 font-mono">
            {member.onTime}%
          </div>
          <ProgressBar
            value={member.onTime}
            colorClass={onTimeInfo(member.onTime)}
          />
          <p className="text-xs text-gray-800 mt-1.5">Target: 80%+</p>
        </div>

        {/* Task Efficiency */}
        <div>
          <p className="text-xs font-semibold text-black uppercase tracking-wide mb-2">
            Task Efficiency
          </p>
          <div
            className={`text-xl font-bold font-mono flex items-center gap-1 ${effColor(member.efficiency)}`}
          >
            {member.efficiency > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : member.efficiency < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            {effSign}
            {member.efficiency}%
          </div>
          <ProgressBar
            value={Math.abs(member.efficiency)}
            colorClass={effBar(member.efficiency)}
          />
          <p className="text-xs text-gray-900 mt-1.5">Target: -20%+</p>
        </div>

        {/* Quality Score */}
        <div>
          <p className="text-xs font-semibold text-black uppercase tracking-wide mb-2">
            Quality Score
          </p>
          <div className="text-xl font-bold text-gray-800 font-mono">
            {member.quality}
            <span className="text-sm text-gray-400 font-normal">/100</span>
          </div>
          <ProgressBar value={member.quality} colorClass={qi.bar} />
          <p className={`text-xs font-semibold mt-1.5 ${qi.color}`}>
            {qi.label}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function EmployeePerformance() {
  const [search, setSearch] = useState("");
  const [underOnly, setUnderOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("Individual Performance");
  const [timePeriod, setTimePeriod] = useState("All Time");
  const [sortBy, setSortBy] = useState("Completed Tasks");
  const [showCount, setShowCount] = useState(10);
  const [page, setPage] = useState(1);

  /* ── Totals for summary cards ── */
  const totalOverdue = MEMBERS.reduce((s, m) => s + m.overdue, 0);
  const totalPending = MEMBERS.reduce((s, m) => s + m.pending, 0);
  const totalInProgress = MEMBERS.reduce((s, m) => s + m.inProgress, 0);
  const totalCompleted = MEMBERS.reduce((s, m) => s + m.completed, 0);
  const totalUnder = MEMBERS.filter((m) => m.under).length;

  /* ── Filtered + sorted list ── */
  const filtered = useMemo(() => {
    let list = [...MEMBERS];
    if (search)
      list = list.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()),
      );
    if (underOnly) list = list.filter((m) => m.under);
    if (sortBy === "Quality Score") list.sort((a, b) => b.quality - a.quality);
    else if (sortBy === "On-Time Delivery")
      list.sort((a, b) => b.onTime - a.onTime);
    else if (sortBy === "Task Efficiency")
      list.sort((a, b) => b.efficiency - a.efficiency);
    else list.sort((a, b) => b.completed - a.completed);
    return list;
  }, [search, underOnly, sortBy]);

  const totalPages = Math.ceil(filtered.length / showCount);
  const paginated = filtered.slice((page - 1) * showCount, page * showCount);

  return (
    <div className="p-6 space-y-6  min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between px-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800"> Performance</h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitor Employee productivity and quality metrics
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}

      {/* ── Main Panel ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters Row */}
        <div className="flex flex-wrap items-end gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1.5">
              Time Period
            </p>
            <Select
              value={timePeriod}
              onChange={(v) => setTimePeriod(v)}
              style={{ width: 250 }}
            >
              <Option value="All Time">All Time</Option>
              <Option value="This Month">This Month</Option>
              <Option value="Last 30 Days">Last 30 Days</Option>
              <Option value="This Quarter">This Quarter</Option>
            </Select>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1.5">
              Sort By
            </p>
            <Select
              value={sortBy}
              onChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
              style={{ width: 250 }}
            >
              <Option value="Completed Tasks">Completed Tasks</Option>
              <Option value="Quality Score">Quality Score</Option>
              <Option value="On-Time Delivery">On-Time Delivery</Option>
              <Option value="Task Efficiency">Task Efficiency</Option>
            </Select>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1.5">
              select Pipeline
            </p>
            <Select
              value={sortBy}
              onChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
              style={{ width: 250 }}
            >
              <Option value="Completed Tasks">Sales</Option>
            </Select>
          </div>
          <div className=" flex items-center gap-2">
            <Checkbox
              checked={underOnly}
              onChange={(e) => {
                setUnderOnly(e.target.checked);
                setPage(1);
              }}
            >
              <span className="text-sm text-gray-600">
                Show underperformers only
              </span>
            </Checkbox>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <Input
            placeholder="Search team members..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-72"
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <Select
                value={showCount}
                onChange={(v) => {
                  setShowCount(v);
                  setPage(1);
                }}
                style={{ width: 70 }}
              >
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {filtered.length} members
            </span>
            <Button icon={<FilterOutlined />}>Filter</Button>
          </div>
        </div>

        {/* Member Cards */}
        {activeTab === "Individual Performance" && (
          <div className="space-y-3">
            {paginated.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                No members found.
              </div>
            ) : (
              paginated.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  idx={MEMBERS.findIndex((x) => x.id === m.id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "Team Overview" && (
          <div className="py-16 text-center text-gray-400 text-sm">
            Team Overview coming soon.
          </div>
        )}

        {activeTab === "Workload" && (
          <div className="py-16 text-center text-gray-400 text-sm">
            Workload view coming soon.
          </div>
        )}

        {/* Pagination */}
        {activeTab === "Individual Performance" && filtered.length > 0 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 flex-wrap gap-3">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * showCount + 1} to{" "}
              {Math.min(page * showCount, filtered.length)} of {filtered.length}{" "}
              members
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="small"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${
                      page === p
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {p}
                </button>
              ))}
              <Button
                size="small"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
