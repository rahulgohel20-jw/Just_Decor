import { useState, useEffect } from "react";
import { toAbsoluteUrl } from "@/utils";
import FollowUpModal from "../../../partials/modals/add-followup-lead/FollowUpModal";

const Leaddetailview = ({
  isOpen,
  onClose,
  lead = {},
  followUps = [],
  onNewFollowUp,
  onSaveFollowUp,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, lead?.id]);

  if (!isOpen) return null;

  /* ── helpers ─────────────────────────────────────── */
  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const stagePillColor = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("hot")) return { bg: "#EFF6FF", text: "#2563EB" };
    if (n.includes("cold")) return { bg: "#F5F3FF", text: "#7C3AED" };
    if (n.includes("new") || n.includes("inquiry"))
      return { bg: "#FFF7ED", text: "#EA580C" };
    if (n.includes("won") || n.includes("confirm"))
      return { bg: "#F0FDF4", text: "#16A34A" };
    if (n.includes("cancel") || n.includes("lost"))
      return { bg: "#FEF2F2", text: "#DC2626" };
    if (n.includes("follow")) return { bg: "#EFF6FF", text: "#2563EB" };
    return { bg: "#F0FDF4", text: "#22C55E" };
  };

  const followUpColor = (type = "") => {
    if (type === "Call") return { bg: "#EFF6FF", text: "#2563EB", icon: "📞" };
    if (type === "WhatsApp")
      return { bg: "#F0FDF4", text: "#16A34A", icon: "💬" };
    if (type === "Email") return { bg: "#FFF7ED", text: "#EA580C", icon: "✉️" };
    return { bg: "#F9FAFB", text: "#6B7280", icon: "📋" };
  };

  /* ── tabs config ─────────────────────────────────── */
  const TABS = [
    { key: "details", label: "Lead Details", icon: null },
    {
      key: "followup",
      label: "Follow-Up",
      count: followUps.length,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path
            d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  /* ── InfoRow ─────────────────────────────────────── */
  const InfoRow = ({ label, children }) => (
    <div className="flex items-start py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400 w-32 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 flex-1">{children}</span>
    </div>
  );

  /* ── Tab: Lead Details ───────────────────────────── */
  const LeadDetailsTab = () => {
    const [note, setNote] = useState(
      lead.leadRemark || lead.overallRemark || "",
    );
    const [noteFile, setNoteFile] = useState(null);
    const [isSavingNote, setIsSavingNote] = useState(false);

    const handleSaveNote = async () => {
      setIsSavingNote(true);
      try {
        // await UpdateleadbyID(lead.id, { ...lead, leadRemark: note });
        console.log("Note saved:", note, noteFile);
      } finally {
        setIsSavingNote(false);
      }
    };

    return (
      <div className="flex flex-col gap-0 overflow-y-auto flex-1 px-4 py-3">
        {/* Lead header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
            {lead.leadCode || "L-000"}
          </span>
          <span className="text-base font-semibold text-gray-800">
            {lead.clientName || "—"}
          </span>
        </div>

        {/* Pipeline info */}
        <div className="rounded-xl px-4 py-3 mb-4">
          <InfoRow label="Pipeline">
            <span
              className="inline-flex px-3 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
            >
              sales Pipeline
            </span>
          </InfoRow>
          <InfoRow label="Stage">
            <div className="relative inline-block">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1 pr-7 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                defaultValue={lead.leadStatus || ""}
              >
                <option>New Inquiry</option>
                <option>Cold Lead</option>
                <option>Hot Lead</option>
                <option>Proposal sent</option>
                <option>Client Demo</option>
                <option>Follow up</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </InfoRow>
          <InfoRow label="Assigned To">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                {(lead.leadAssignName ||
                  lead.leadAssign ||
                  "M")[0]?.toUpperCase()}
              </span>
              {lead.leadAssignName || lead.leadAssign || "—"}
            </span>
          </InfoRow>
          <InfoRow label="Amount">{lead.amount ?? 0}</InfoRow>
          <InfoRow label="Source">{lead.leadSource || "—"}</InfoRow>
          <InfoRow label="Closing at">{lead.closeDate || "NA"}</InfoRow>
        </div>

        {/* Contact Details section */}
        <p className="text-sm font-semibold mb-2" style={{ color: "#22C55E" }}>
          Contact Details
        </p>
        <div className="rounded-xl px-4 py-3 mb-4">
          <InfoRow label="Name">{lead.clientName || "—"}</InfoRow>
          <InfoRow label="Email">{lead.emailId || "Email"}</InfoRow>
          <InfoRow label="Contact No">{lead.contactNumber || "—"}</InfoRow>
          <InfoRow label="Created at">{formatDate(lead.createdAt)}</InfoRow>
          <InfoRow label="Updated at">{formatDate(lead.updatedAt)}</InfoRow>
        </div>

        {/* Notes section */}
        <p className="text-sm font-semibold mb-2" style={{ color: "#22C55E" }}>
          Notes
        </p>
        <hr className="border-gray-100 mb-3" />

        {/* Notes textarea */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 mb-3">
          <textarea
            rows={4}
            className="w-full bg-transparent px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none rounded-xl"
            placeholder="Add Notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Voice + Attach icons */}
        <div className="flex items-center gap-3 mb-4 px-1">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            title="Voice note"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <label
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
            title="Attach file"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="10" x2="12" y2="17" />
              <polyline points="9 13 12 10 15 13" />
            </svg>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setNoteFile(e.target.files?.[0] || null)}
            />
          </label>
          {noteFile && (
            <span className="text-xs text-gray-500 truncate max-w-[140px]">
              {noteFile.name}
            </span>
          )}
        </div>

        {/* Save button */}
        <div className="mb-2">
          <button
            type="button"
            onClick={handleSaveNote}
            disabled={isSavingNote}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.97] disabled:opacity-60"
            style={{ backgroundColor: "#22C55E" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {isSavingNote ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  };

  /* ── Tab: Follow-Up ──────────────────────────────── */
  const FollowUpTab = () => (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* New Follow-up button */}
      <div className="px-4 pt-3 pb-2">
        <button
          onClick={() => setIsFollowUpModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EA580C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="12" y1="15" x2="12" y2="19" />
            <line x1="10" y1="17" x2="14" y2="17" />
          </svg>
          New Follow-up
        </button>
      </div>

      {/* Follow-up list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {followUps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <polyline points="9 15 11 17 15 13" strokeWidth="1.5" />
            </svg>
            <p className="text-lg font-semibold text-gray-700">
              No Follow-up Here
            </p>
            <p className="text-sm text-gray-400 text-center max-w-[220px]">
              It seems that you don't have any follow-up in this list
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-1">
            {followUps.map((fu, i) => {
              const colors = followUpColor(fu.followUpType);
              return (
                <div
                  key={fu.id || i}
                  className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {colors.icon} {fu.followUpType || "Follow-up"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {fu.followUpDate
                        ? new Date(fu.followUpDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </span>
                  </div>
                  {fu.clientRemarks && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {fu.clientRemarks}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor:
                          fu.followUpStatus === "Open" ? "#EFF6FF" : "#F0FDF4",
                        color:
                          fu.followUpStatus === "Open" ? "#2563EB" : "#16A34A",
                      }}
                    >
                      {fu.followUpStatus || "Open"}
                    </span>
                    {fu.employeeRemarks && (
                      <span className="text-xs text-gray-400 italic truncate max-w-[140px]">
                        {fu.employeeRemarks}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  /* ── render ──────────────────────────────────────── */
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1040] bg-black/30" onClick={onClose} />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 h-full z-[1050] bg-white flex flex-col shadow-2xl"
        style={{ width: 520 }}
      >
        {/* ── Top bar ────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className="flex items-center gap-2 flex-1 mx-3">
            <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
              {lead.leadCode || "L-000"}
            </span>
            <span className="text-sm font-semibold text-gray-800 truncate">
              {lead.clientName || "Lead Detail"}
            </span>
          </div>

          <div className="relative">
            <button
              className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-500"
              title="More options"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {isMenuOpen && (
              <>
                {/* Click outside to close */}
                <div
                  className="fixed inset-0 z-[1060]"
                  onClick={() => setIsMenuOpen(false)}
                />

                <div className="absolute right-0 top-10 z-[1070] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-56">
                  {[
                    {
                      label: "Edit Lead",
                      icon: (
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      ),
                      icon2: (
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      ),
                      action: () => {
                        onEdit?.();
                        setIsMenuOpen(false);
                      },
                      red: false,
                    },
                    {
                      label: "Move To",
                      svgPath:
                        "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
                      action: () => setIsMenuOpen(false),
                      red: false,
                    },
                    {
                      label: "Add Follow-up",
                      svgPath:
                        "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM12 14v4M10 16h4",
                      action: () => {
                        setIsFollowUpModalOpen(true);
                        setIsMenuOpen(false);
                      },
                      red: false,
                    },
                    {
                      label: "Send Whatsapp",
                      svgPath:
                        "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
                      action: () => setIsMenuOpen(false),
                      red: false,
                    },
                    {
                      label: "Send Email",
                      svgPath:
                        "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
                      action: () => setIsMenuOpen(false),
                      red: false,
                    },

                    {
                      label: "Delete",
                      svgPath:
                        "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
                      action: () => {
                        onDelete?.();
                        setIsMenuOpen(false);
                      },
                      red: true,
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${item.red ? "text-red-500" : "text-gray-700"}`}
                    >
                      <span>{item.label}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={item.svgPath} />
                      </svg>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────── */}
        <div className="flex border-b border-gray-100 flex-shrink-0 bg-white">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all relative ${
                  isActive
                    ? "text-gray-800"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.icon && (
                  <span
                    style={{
                      color: isActive
                        ? tab.key === "followup"
                          ? "#EA580C"
                          : "#22C55E"
                        : "currentColor",
                    }}
                  >
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-xs ${isActive ? "text-gray-500" : "text-gray-400"}`}
                  >
                    [{tab.count}]
                  </span>
                )}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: "#22C55E" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {activeTab === "details" && <LeadDetailsTab />}
          {activeTab === "followup" && <FollowUpTab />}
        </div>
      </div>

      {/* ── Follow-Up Modal ────────────────────── */}
      {isFollowUpModalOpen && (
        <FollowUpModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          onSave={(followUpData) => {
            onSaveFollowUp?.(followUpData);
            setIsFollowUpModalOpen(false);
          }}
          clientName={lead.clientName}
          leadData={{
            leadId: lead.id || lead.leadId,
            clientName: lead.clientName,
            leadCode: lead.leadCode,
            contactNumber: lead.contactNumber,
            emailId: lead.emailId,
            leadAssignId: lead.leadAssignId,
            followUps: followUps,
          }}
          existingFollowUps={followUps}
          zIndex={1100}
        />
      )}
    </>
  );
};

export default Leaddetailview;
