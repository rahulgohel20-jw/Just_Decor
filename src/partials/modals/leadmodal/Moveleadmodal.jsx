import { useState, useEffect } from "react";
import { DatePicker as AntDatePicker } from "antd";
import dayjs from "dayjs";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import FollowupRemindersModal from "./Followupremindersmodal ";

const MoveLeadModal = ({
  isOpen,
  onClose,
  onConfirm,
  lead,
  fromColumn,
  toColumn,
  managers = [],
}) => {
  /* ── state ───────────────────────────────────────── */
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [remarks, setRemarks] = useState("");

  // Follow-up section
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpType, setFollowUpType] = useState("Call");
  const [followUpDate, setFollowUpDate] = useState(null);
  const [followUpReminders, setFollowUpReminders] = useState([]);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);

  // Attachment
  const [attachedFile, setAttachedFile] = useState(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSelectedAssignee("");
      setRemarks("");
      setFollowUpOpen(false);
      setFollowUpType("Call");
      setFollowUpDate(null);
      setFollowUpReminders([]);
      setAttachedFile(null);
    }
  }, [isOpen]);

  /* ── helpers ─────────────────────────────────────── */
  const FOLLOW_UP_TYPES = ["Call", "WhatsApp", "Email"];

  const stagePillColor = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("hot")) return "#2563EB";
    if (n.includes("cold")) return "#7C3AED";
    if (n.includes("new") || n.includes("inquiry")) return "#F97316";
    if (n.includes("won") || n.includes("confirm")) return "#16A34A";
    if (n.includes("cancel") || n.includes("lost")) return "#DC2626";
    if (n.includes("pending")) return "#D97706";
    if (n.includes("open")) return "#0891B2";
    if (n.includes("close")) return "#6B7280";
    return "#64748B";
  };

  const handleConfirm = () => {
    onConfirm?.({
      leadId: lead?.leadId,
      toStatus: toColumn?.id,
      assignedTo: selectedAssignee,
      remarks,
      followUp: followUpOpen
        ? {
            type: followUpType,
            date: followUpDate,
            reminders: followUpReminders,
          }
        : null,
      attachment: attachedFile,
    });
  };

  /* ── render ──────────────────────────────────────── */
  return (
    <>
      <CustomModal
        open={isOpen}
        onClose={onClose}
        title="Move Lead"
        width={520}
        footer={
          <div
            className="flex items-center justify-between w-full"
            key="footer-buttons"
          >
            {/* Left: attachment + voice */}
            <div className="flex items-center gap-2">
              <label
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                title="Attach file"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                />
              </label>
              {attachedFile && (
                <span className="text-xs text-gray-500 truncate max-w-[110px]">
                  {attachedFile.name}
                </span>
              )}
              <button
                type="button"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Voice note"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
            </div>

            {/* Right: CTA */}
            <button
              key="confirm"
              type="button"
              onClick={handleConfirm}
              className="btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
              style={{ backgroundColor: "#22C55E" }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              Move Lead
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-y-4">
          {/* Lead meta + stage pills */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Title : </span>
              {lead?.title || lead?.clientName || "—"}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-semibold text-gray-700">Pipeline : </span>
              Sales Pipeline
            </p>
            <div className="flex items-center justify-center gap-8 mt-3">
              <span
                className="px-4 py-1.5 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: stagePillColor(fromColumn?.name) }}
              >
                {fromColumn?.name || "—"}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <span
                className="px-4 py-1.5 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: stagePillColor(toColumn?.name) }}
              >
                {toColumn?.name || "—"}
              </span>
            </div>
          </div>

          {/* Assignee */}
          <div className="flex flex-col">
            <label className="form-label mb-1">Assign To</label>
            <select
              className="select pe-7.5"
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
            >
              <option value="">Select assignee…</option>
              {managers.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div className="flex flex-col">
            <label className="form-label mb-1">Remarks</label>
            <textarea
              rows={3}
              className="textarea h-full"
              placeholder="Add a remark…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* ── Follow-up accordion ── */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Accordion trigger */}
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              onClick={() => setFollowUpOpen((v) => !v)}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.62 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 8 8l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Add Next Followup
              </span>
              <i
                className={`ki-filled ki-down text-gray-400 transition-transform duration-200 ${followUpOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Accordion body */}
            {followUpOpen && (
              <div className="bg-white flex flex-col border-t border-gray-100">
                {/* ── Follow-up Type row (Image 2 style) ── */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Follow-up Type
                  </span>
                  <div className="flex items-center gap-2">
                    {FOLLOW_UP_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFollowUpType(type)}
                        className={`btn btn-sm rounded-full px-4 py-1.5 text-sm font-medium transition-all flex items-center gap-1 ${
                          followUpType === type
                            ? "text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        style={
                          followUpType === type
                            ? { backgroundColor: "#22C55E" }
                            : {}
                        }
                      >
                        {followUpType === type && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Followup Date row (Image 2 style) ── */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <AntDatePicker
                    className="input flex-1"
                    style={{ width: "100%" }}
                    value={followUpDate ? dayjs(followUpDate) : null}
                    onChange={(date) =>
                      setFollowUpDate(date ? date.toISOString() : null)
                    }
                    getPopupContainer={() => document.body}
                    placeholder="Followup Date"
                    bordered={false}
                  />
                </div>

                {/* ── Add Followup Reminders row (Image 2 style) ── */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  onClick={() => setIsRemindersModalOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    {/* Clock icon */}
                    <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        Add Followup Reminders
                      </span>
                      {followUpReminders.length > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          {followUpReminders.length} reminder
                          {followUpReminders.length > 1 ? "s" : ""} set
                        </span>
                      )}
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </CustomModal>

      {/* Reminders sub-modal */}
      <FollowupRemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        onSave={(reminders) => {
          setFollowUpReminders(reminders);
          setIsRemindersModalOpen(false);
        }}
      />
    </>
  );
};

export default MoveLeadModal;
