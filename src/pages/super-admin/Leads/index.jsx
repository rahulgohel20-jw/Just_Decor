import {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constact";
import { useNavigate, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import Leaddetailview from "../../../partials/modals/leadmodal/Leaddetailview";
import FollowUp from "../../../partials/modals/follow-up-modal/Followup";
import AssignLeadModal from "../../../partials/modals/follow-up-modal/Assignleadmodal";
import Moveleadmodal from "../../../partials/modals/leadmodal/Moveleadmodal";
import {
  DeleteLeadbyID,
  GetLeadByID,
  UpdateleadbyID,
  Fetchmanager,
  assignMultipleLeadToMember,
  GETstagesleaddatabypipeline,
  GETallpipeline,
  MoveLeadToStage,
  Getstagesbypipeline,
  Getstageleaddatabypipelineidandstage,
} from "@/services/apiServices";
import useStyle from "./style";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";
import { DragAndDrop } from "@/components/drag-and-drop/DragAndDrop";
import { Badge } from "@/components/ui/badge";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatFollowUpDateForAPI = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(dateStr)) {
    const [datePart] = dateStr.split(" ");
    const [y, m, d] = datePart.split("-");
    return `${d}/${m}/${y} 12:00 AM`;
  }
  if (/\d{2}\/\d{2}\/\d{4}\s+\d/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y} 12:00 AM`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return `${dateStr} 12:00 AM`;
  return dateStr;
};

// ✅ Single shared userId resolver — no more duplicates
const getStoredUserId = () => {
  const direct =
    localStorage.getItem("mainId") ||
    localStorage.getItem("id") ||
    localStorage.getItem("user_id") ||
    localStorage.getItem("empId") ||
    localStorage.getItem("memberId");
  if (direct) return direct;
  for (const key of [
    "user",
    "userData",
    "authUser",
    "userInfo",
    "auth",
    "profile",
  ]) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "{}");
      const id =
        parsed?.id || parsed?.userId || parsed?.user_id || parsed?.empId;
      if (id) return String(id);
    } catch {}
  }
  return null;
};

const EMPTY_STATS = {
  total: 0,
  hot: 0,
  cold: 0,
  inquire: 0,
  assigned: 0,
  hotAmount: 0,
  lostAmount: 0,
  wonCount: 0,
  wonAmount: 0,
  lostCount: 0,
  totalAmount: 0,
  openAmount: 0,
  coldAmount: 0,
};

// ─── Component ───────────────────────────────────────────────────────────────

const SuperLeads = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const location = useLocation();

  // ── View ──
  const [viewMode, setViewMode] = useState(0);
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  // ── Data ──
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [stats, setStats] = useState(EMPTY_STATS);

  // ── Pipeline / Stage ──
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState("");
  const [activePipeline, setActivePipeline] = useState(null);
  const [pipelineData, setPipelineData] = useState(null);
  const [noPipelines, setNoPipelines] = useState(false);
  const [stages, setStages] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [isStagesLoading, setIsStagesLoading] = useState(false);
  const [filteredByStage, setFilteredByStage] = useState(null);
  const [selectedAssignId, setSelectedAssignId] = useState("");
  const [managers, setManagers] = useState([]);

  // ── Modals ──
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");
  const [assignCloseDate, setAssignCloseDate] = useState("");
  const [assignDescription, setAssignDescription] = useState("");
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [moveLeadPayload, setMoveLeadPayload] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerLead, setDrawerLead] = useState(null);
  const [drawerFollowUps, setDrawerFollowUps] = useState([]);

  // ── Board ──
  const [boardColumns, setBoardColumns] = useState([]);
  const [dndActive, setDndActive] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // ── Refs ──
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const originalBoardColumnsRef = useRef([]);
  // ✅ Cache: pipelineId → { leadsRes, stagesRes } to avoid refetching same pipeline
  const pipelineCache = useRef({});

  // ─── Derived / memoized ────────────────────────────────────────────────────

  const filteredData = useMemo(() => {
    const search = searchText.toLowerCase();
    const base = filteredByStage ?? tableData;
    if (!search) return base;
    return base.filter(
      (item) =>
        item.clientName?.toLowerCase().includes(search) ||
        item.leadCode?.toLowerCase().includes(search) ||
        item.leadType?.toLowerCase().includes(search) ||
        item.contactNumber?.toLowerCase().includes(search),
    );
  }, [searchText, filteredByStage, tableData]);

  // ─── Pipeline helpers ─────────────────────────────────────────────────────

  const buildBoardFromPipeline = useCallback(
    (
      data,
      stageIdToTypeMap = {},
      stageNameToMetaMap = {},
      pipelineName = "",
    ) => {
      const mapLeads = (leads, stageName) =>
        leads.map((lead) => ({
          ...lead,
          id: String(lead.leadId),
          leadId: lead.leadId,
          title: lead.clientName,
          subtitle: lead.leadCode,
          assignedTo: lead.leadAssignName,
          amount: lead.estimateAmount || 0,
          city: lead.city || "-",
          cityName: lead.city || "-",
          pipelineId: lead.pipelineId,
          createdAt: lead.leadCreatedAt || null,
          updatedAt: lead.leadUpdatedAt || null,
          closeDate: lead.leadFollowUpDate || "NA",
          stage: lead.stage || stageName,
          pipelineName: lead.pipelineName || pipelineName || "-",
        }));

      const buildColumns = (leadMap, tag, fallbackType) =>
        Object.entries(leadMap).map(([stageName, leads]) => {
          const meta = stageNameToMetaMap[stageName?.toLowerCase().trim()];
          const stageId = meta?.stageId ?? leads[0]?.stageId ?? null;
          const stageType =
            meta?.stageType ??
            stageIdToTypeMap[leads[0]?.stageId] ??
            fallbackType;
          return {
            id: `${tag}_${stageName}`,
            name: stageName,
            tag,
            stageId,
            stageType,
            children: mapLeads(leads, stageName),
          };
        });

      const openColumns = buildColumns(
        data?.open_lead || {},
        "open",
        "open_stage",
      );
      const closeColumns = buildColumns(
        data?.close_lead || {},
        "close",
        "close_stage",
      );
      const finalColumns = [...openColumns, ...closeColumns];

      originalBoardColumnsRef.current = finalColumns;
      setBoardColumns(finalColumns);

      const allLeads = [
        ...Object.values(data?.open_lead || {}).flat(),
        ...Object.values(data?.close_lead || {}).flat(),
      ].map((lead, index) => ({
        ...lead,
        sr_no: index + 1,
        leadAssign: lead.leadAssignName || "-",
        productType: lead.planName || "-",
        cityName: lead.city || lead.cityName || "-",
        createdAt: lead.createdAt?.split("T")[0],
        stage: lead.stage || "-",
      }));

      setTableData(allLeads);
    },
    [],
  );

  // ✅ Fetch pipeline leads — uses cache to avoid duplicate API calls
  const fetchPipelineLeads = useCallback(
    async (pipelineId, pipelineNameParam = "") => {
      const userId = getStoredUserId();
      if (!userId) return;

      try {
        setIsLoadingLeads(true);

        let leadsRes, stagesRes;

        // ✅ Use cache if available
        if (pipelineCache.current[pipelineId]) {
          ({ leadsRes, stagesRes } = pipelineCache.current[pipelineId]);
        } else {
          // ✅ Parallel fetch — single Promise.all, not two sequential calls
          [leadsRes, stagesRes] = await Promise.all([
            GETstagesleaddatabypipeline(pipelineId, userId),
            Getstagesbypipeline(pipelineId, userId),
          ]);
          pipelineCache.current[pipelineId] = { leadsRes, stagesRes };
        }

        const data = leadsRes?.data?.data;
        setStats({
          total: Number(data?.total_lead_count || 0),
          hot: Number(data?.hot_lead_count || 0),
          cold: Number(data?.cold_lead_count || 0),
          inquire: Number(data?.open_lead_count || 0),
          wonCount: Number(data?.won_lead_count || 0),
          lostCount: Number(data?.lost_lead_count || 0),
          hotAmount: data?.hot_lead_amount || "0",
          lostAmount: data?.lost_lead_amount || "0",
          wonAmount: data?.won_lead_amount || "0",
          totalAmount: data?.total_amount || "0",
          openAmount: data?.oprn_lead_amount || "0",
          coldAmount: data?.cold_lead_amount || "0",
        });

        const stagesData = stagesRes?.data?.data;
        const stageIdToTypeMap = {};
        const stageNameToMetaMap = {};

        Object.entries(stagesData || {}).forEach(([, stageList]) => {
          stageList.forEach((stage) => {
            stageIdToTypeMap[stage.stageId] = stage.stageType;
            stageNameToMetaMap[stage.stageName?.toLowerCase().trim()] = {
              stageId: stage.stageId,
              stageType: stage.stageType,
            };
          });
        });

        setPipelineData(data);
        buildBoardFromPipeline(
          data,
          stageIdToTypeMap,
          stageNameToMetaMap,
          pipelineNameParam,
        );
      } catch (err) {
        console.error("Failed to fetch pipeline leads:", err);
      } finally {
        setIsLoadingLeads(false);
      }
    },
    [buildBoardFromPipeline],
  );

  // ✅ Invalidate cache after mutations (move, assign, delete, follow-up)
  const invalidateAndRefetch = useCallback(
    (pipelineId, pipelineName = "") => {
      delete pipelineCache.current[pipelineId];
      fetchPipelineLeads(pipelineId, pipelineName);
    },
    [fetchPipelineLeads],
  );

  // ✅ Fetch stages — merged into fetchPipelineLeads to avoid an extra standalone call
  const fetchStagesForPipeline = useCallback(async (pipelineId) => {
    const userId = getStoredUserId();
    if (!userId) return;
    try {
      setIsStagesLoading(true);
      setSelectedStageId("");

      // ✅ Reuse cached stagesRes if already fetched for this pipeline
      let stagesRes;
      if (pipelineCache.current[pipelineId]?.stagesRes) {
        stagesRes = pipelineCache.current[pipelineId].stagesRes;
      } else {
        stagesRes = await Getstagesbypipeline(pipelineId, userId);
      }

      const allStages = [];
      Object.entries(stagesRes?.data?.data || {}).forEach(
        ([groupKey, stageList]) => {
          stageList.forEach((stage) => {
            allStages.push({
              id: stage.stageId,
              name: stage.stageName,
              type: stage.stageType,
              group: groupKey,
            });
          });
        },
      );
      setStages(allStages);
    } catch (err) {
      console.error("Failed to fetch stages:", err);
      setStages([]);
    } finally {
      setIsStagesLoading(false);
    }
  }, []);

  // ─── Initialisation — single useEffect replaces two ──────────────────────

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // ✅ Fetch pipelines + managers in parallel
        const [pipelineRes, managerRes] = await Promise.all([
          GETallpipeline(),
          Fetchmanager(1),
        ]);

        if (cancelled) return;

        // Managers
        const managerList = (managerRes?.data?.data?.userDetails || []).map(
          (m) => ({
            value: m.id,
            label: m.firstName || "-",
          }),
        );
        setManagers(managerList);

        // Pipelines
        const list = pipelineRes?.data?.data || [];
        setPipelines(list);

        if (list.length === 0) {
          setNoPipelines(true);
          setIsLoadingLeads(false);
          return;
        }
        setNoPipelines(false);

        const startPipeline = location.state?.pipelineId
          ? list.find((p) => p.id === location.state.pipelineId)
          : list.find((p) => p.id === 1) || list[0];

        if (startPipeline) {
          setActivePipeline({ id: startPipeline.id, name: startPipeline.name });
          setSelectedPipelineId(String(startPipeline.id));
          // ✅ One combined fetch instead of separate fetchPipelineLeads + fetchStagesForPipeline
          await fetchPipelineLeads(startPipeline.id, startPipeline.name);
          // Stages are already cached after fetchPipelineLeads, reuse them
          await fetchStagesForPipeline(startPipeline.id);
        }
      } catch (err) {
        console.error("Init failed:", err);
        setNoPipelines(true);
        setIsLoadingLeads(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Pipeline change ─────────────────────────────────────────────────────

  const handlePipelineChange = useCallback(
    (e) => {
      const pipelineId = Number(e.target.value);
      setSelectedPipelineId(String(pipelineId));
      const found = pipelines.find((p) => p.id === pipelineId);
      if (!found) return;
      setActivePipeline({ id: found.id, name: found.name });
      // ✅ Single call — previously called fetchPipelineLeads twice
      fetchPipelineLeads(found.id, found.name);
      fetchStagesForPipeline(found.id);
    },
    [pipelines, fetchPipelineLeads, fetchStagesForPipeline],
  );

  // ─── Filter helpers ───────────────────────────────────────────────────────
  const handleStageChange = useCallback(
    async (e) => {
      const stageName = e.target.value; // dynamic string e.g. "Negotiation", "Qualified", "hot"
      setSelectedStageId(stageName);
      setSelectedAssignId("");

      // ── Reset ──
      if (!stageName) {
        setFilteredByStage(null);
        const cols = originalBoardColumnsRef.current;
        setBoardColumns(cols);
        setTableData(
          cols
            .flatMap((col) => col.children)
            .map((l, i) => ({
              ...l,
              sr_no: i + 1,
              leadAssign: l.leadAssignName || "-",
              productType: l.planName || "-",
              cityName: l.city || l.cityName || "-",
              stage: l.stage || "-",
            })),
        );
        return;
      }

      try {
        setIsFilterLoading(true);
        const userId = getStoredUserId();

        const response = await Getstageleaddatabypipelineidandstage(
          selectedPipelineId,
          stageName, // ✅ dynamic stage name from stages API
          userId,
        );

        const data = response?.data?.data;

        // ── Flatten all leads from API response ──
        const allLeads = [
          ...Object.values(data?.open_lead || {}).flat(),
          ...Object.values(data?.close_lead || {}).flat(),
        ].map((lead, i) => ({
          ...lead,
          id: String(lead.leadId),
          leadId: lead.leadId,
          sr_no: i + 1,
          title: lead.clientName,
          subtitle: lead.leadCode,
          assignedTo: lead.leadAssignName,
          amount: lead.estimateAmount || 0,
          city: lead.city || "-",
          cityName: lead.city || "-",
          stage: lead.stage || "-",
          leadAssign: lead.leadAssignName || "-",
          productType: lead.planName || "-",
          pipelineName: lead.pipelineName || activePipeline?.name || "-",
        }));

        const leadIdSet = new Set(allLeads.map((l) => l.leadId));

        // ── Update board: keep only columns/leads that match API response ──
        const filteredCols = originalBoardColumnsRef.current.map((col) => ({
          ...col,
          children: col.children.filter((l) => leadIdSet.has(l.leadId)),
        }));

        setBoardColumns(filteredCols);
        setFilteredByStage(allLeads);
        setTableData(allLeads);
      } catch (err) {
        console.error("Failed to fetch stage leads:", err);
        Swal.fire("Error", "Failed to load stage leads.", "error");
      } finally {
        setIsFilterLoading(false);
      }
    },
    [selectedPipelineId, activePipeline],
  );

  const handleMemberChange = useCallback((e) => {
    const assignId = e.target.value;
    setSelectedAssignId(assignId);
    setSelectedStageId("");

    const cols = originalBoardColumnsRef.current;

    if (!assignId) {
      setBoardColumns(cols);
      setTableData(
        cols
          .flatMap((c) => c.children)
          .map((l, i) => ({
            ...l,
            sr_no: i + 1,
            leadAssign: l.leadAssignName || "-",
            productType: l.planName || "-",
            cityName: l.city || l.cityName || "-",
            stage: l.stage || "-",
          })),
      );
      setFilteredByStage(null);
      return;
    }

    const filteredColumns = cols.map((col) => ({
      ...col,
      children: col.children.filter(
        (l) => String(l.leadAssignId) === String(assignId),
      ),
    }));
    setBoardColumns(filteredColumns);

    const filteredLeads = cols
      .flatMap((c) => c.children)
      .filter((l) => String(l.leadAssignId) === String(assignId))
      .map((l, i) => ({
        ...l,
        sr_no: i + 1,
        leadAssign: l.leadAssignName || "-",
        productType: l.planName || "-",
        cityName: l.city || l.cityName || "-",
        stage: l.stage || "-",
      }));
    setTableData(filteredLeads);
    setFilteredByStage(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStageId("");
    setSelectedAssignId("");
    setFilteredByStage(null);
    setSearchText("");
    const cols = originalBoardColumnsRef.current;
    if (cols.length > 0) {
      setBoardColumns(cols);
      setTableData(
        cols
          .flatMap((c) => c.children)
          .map((l, i) => ({
            ...l,
            sr_no: i + 1,
            leadAssign: l.leadAssignName || "-",
            productType: l.planName || "-",
            cityName: l.city || l.cityName || "-",
            stage: l.stage || "-",
          })),
      );
    } else if (activePipeline?.id) {
      invalidateAndRefetch(activePipeline.id, activePipeline.name);
    }
  }, [activePipeline, invalidateAndRefetch]);

  // ─── Board drag-scroll ────────────────────────────────────────────────────

  const onPointerDown = (e) => {
    isDragging.current = true;
    if (dndActive) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("cursor-grabbing");
  };
  const onPointerMove = (e) => {
    if (!isDragging.current || dndActive) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    scrollRef.current.scrollLeft =
      scrollStart.current - (clientX - startX.current);
  };
  const onPointerUp = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  // ─── Lead actions ─────────────────────────────────────────────────────────

  const handleOpenDrawer = useCallback(async (lead) => {
    try {
      const response = await GetLeadByID(lead.leadId);
      const fullLeadData = response?.data?.data?.[0] || lead;
      setDrawerLead({
        ...fullLeadData,
        leadId: fullLeadData.id,
        title: fullLeadData.clientName,
        subtitle: fullLeadData.leadCode,
        assignedTo: fullLeadData.leadAssignName || "-",
        city: fullLeadData.cityName || "-",
        closeDate: fullLeadData.leadFollowUpDate || "NA",
        pipelineName: fullLeadData.pipelineName || "-",
        openStageName: fullLeadData.openStageName || "-",
        createdAt: fullLeadData.createdAt || "N/A",
        updatedAt: fullLeadData.createdAt || "N/A",
        amount: fullLeadData.estimateAmount || 0,
        estimateAmount: fullLeadData.estimateAmount || 0,
      });
      setDrawerFollowUps(
        (fullLeadData.followUpDetails || []).map((fu) => ({
          id: fu.id,
          followUpType: fu.followUpType || "Call",
          followUpStatus: fu.followUpStatus || "Open",
          followUpDate: fu.followUpDate || "",
          clientRemarks: fu.clientRemarks || "",
          employeeRemarks: fu.employeeRemarks || "",
          createdAt: fu.createdAt || "",
          leadId: fu.leadId,
          memberId: fu.memberId,
          memberName: fu.memberName || "",
        })),
      );
      setIsDrawerOpen(true);
    } catch {
      setDrawerLead(lead);
      setDrawerFollowUps([]);
      setIsDrawerOpen(true);
    }
  }, []);

  const handleLeadDropped = useCallback(
    ({ lead, fromColumn, toColumn, pendingColumns }) => {
      const resolve = (col) =>
        boardColumns.find(
          (c) =>
            c.name?.toLowerCase().trim() === col.name?.toLowerCase().trim(),
        ) || col;
      setMoveLeadPayload({
        lead,
        fromColumn: resolve(fromColumn),
        toColumn: resolve(toColumn),
        pendingColumns,
      });
      setIsMoveModalOpen(true);
    },
    [boardColumns],
  );

  const handleConfirmMove = useCallback(
    async (formPayload) => {
      const lead = moveLeadPayload.lead;
      const toColumn = formPayload.toColumn?.stageId
        ? formPayload.toColumn
        : moveLeadPayload.toColumn;

      if (moveLeadPayload.pendingColumns?.length)
        setBoardColumns(moveLeadPayload.pendingColumns);

      const leadId = Number(lead.leadId);
      const stageId = Number(toColumn.stageId || lead.stageId);
      const stageType =
        toColumn.stageType ||
        (toColumn.tag === "open" ? "open_stage" : "close_stage");
      const assignId = formPayload.assignedTo
        ? Number(formPayload.assignedTo)
        : null;

      const requestDto = formPayload.followUp?.date
        ? {
            clientRemarks: formPayload.remarks || "",
            employeeRemarks: "",
            followUpDate: formatFollowUpDateForAPI(formPayload.followUp.date),
            followUpStatus: "Open",
            followUpType: formPayload.followUp.type || "Call",
            id: 0,
            leadId,
            memberId: formPayload.assignedTo
              ? Number(formPayload.assignedTo)
              : 0,
          }
        : {
            clientRemarks: "",
            employeeRemarks: "",
            followUpDate: "",
            followUpStatus: "",
            followUpType: "",
            id: 0,
            leadId: 0,
            memberId: 0,
          };

      try {
        await MoveLeadToStage(
          leadId,
          stageId,
          stageType,
          assignId,
          formPayload.remarks || "",
          requestDto,
        );
        if (activePipeline?.id)
          invalidateAndRefetch(activePipeline.id, activePipeline.name);
      } catch (err) {
        console.error("Move lead failed:", err);
        Swal.fire("Error", "Failed to move lead. Please try again.", "error");
      }
      setIsMoveModalOpen(false);
      setMoveLeadPayload(null);
    },
    [moveLeadPayload, activePipeline, invalidateAndRefetch],
  );

  const handleCancelMove = () => {
    setIsMoveModalOpen(false);
    setMoveLeadPayload(null);
  };

  const handleFollowUp = useCallback(async (lead) => {
    try {
      Swal.fire({
        title: "Loading...",
        text: "Fetching lead details",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const response = await GetLeadByID(lead.leadId);
      Swal.close();
      const fullLeadData = response?.data?.data?.[0];
      if (!fullLeadData) {
        Swal.fire("Error", "Failed to fetch lead details", "error");
        return;
      }
      setSelectedLeadForFollowUp({
        leadId: fullLeadData.id,
        clientName: fullLeadData.clientName,
        leadCode: fullLeadData.leadCode,
        contactNumber: fullLeadData.contactNumber,
        emailId: fullLeadData.emailId,
        leadAssignId: fullLeadData.leadAssignId,
        followUps: fullLeadData.followUpDetails || [],
      });
      setIsFollowUpOpen(true);
    } catch {
      Swal.close();
      Swal.fire("Error", "Failed to load lead data", "error");
    }
  }, []);

  const refreshFollowUps = useCallback(async () => {
    if (!selectedLeadForFollowUp?.leadId) return;
    try {
      const response = await GetLeadByID(selectedLeadForFollowUp.leadId);
      const fullLeadData = response?.data?.data?.[0];
      if (fullLeadData) {
        setSelectedLeadForFollowUp((prev) => ({
          ...prev,
          followUps: fullLeadData.followUpDetails || [],
        }));
      }
    } catch (error) {
      console.error("Error refreshing follow-ups:", error);
    }
  }, [selectedLeadForFollowUp?.leadId]);

  const handleSaveFollowUp = useCallback(
    async (followUpData) => {
      try {
        const response = await GetLeadByID(selectedLeadForFollowUp.leadId);
        const fullLeadData = response?.data?.data?.[0];
        if (!fullLeadData) {
          Swal.fire("Error", "Failed to fetch lead details", "error");
          return;
        }

        const newFollowUp = {
          id: 0,
          leadId: selectedLeadForFollowUp.leadId,
          followUpType:
            followUpData.followUpType || followUpData.followType || "Call",
          followUpStatus: followUpData.followUpStatus || "Open",
          followUpDate: formatFollowUpDateForAPI(
            followUpData.followupDate || followUpData.followUpDate,
          ),
          clientRemarks:
            followUpData.clientRemarks || followUpData.description || "",
          employeeRemarks: followUpData.employeeRemarks || "",
          memberId: followUpData.memberId || followUpData.managerId || 0,
        };

        const existingFollowUps = (fullLeadData.followUpDetails || []).map(
          (fu) => ({
            id: fu.id ? Number(fu.id) : 0,
            leadId: selectedLeadForFollowUp.leadId,
            followUpType: fu.followUpType || "",
            followUpStatus: fu.followUpStatus || "Open",
            followUpDate: fu.followUpDate || "",
            clientRemarks: fu.clientRemarks || "",
            employeeRemarks: fu.employeeRemarks || "",
            memberId: fu.memberId || 0,
          }),
        );

        const payload = {
          address: fullLeadData.address || "",
          cityId: fullLeadData.cityId ? Number(fullLeadData.cityId) : 0,
          clientName: fullLeadData.clientName || "",
          contactNumber: fullLeadData.contactNumber || "",
          emailId: fullLeadData.emailId || "",
          leadAssignId: fullLeadData.leadAssignId
            ? Number(fullLeadData.leadAssignId)
            : 0,
          leadCode: fullLeadData.leadCode || "",
          leadRemark: fullLeadData.leadRemark || "",
          leadSource: fullLeadData.leadSource || "",
          leadStatus: fullLeadData.leadStatus || "",
          leadType: fullLeadData.leadType || "",
          overallRemark: fullLeadData.overallRemark || "",
          pinCode: fullLeadData.pinCode || "",
          planId: fullLeadData.planId ? Number(fullLeadData.planId) : 0,
          selectPrefix: fullLeadData.selectPrefix || "",
          stateId: fullLeadData.stateId ? Number(fullLeadData.stateId) : 0,
          pipelineId: fullLeadData.pipelineId
            ? Number(fullLeadData.pipelineId)
            : 0,
          openStageId: fullLeadData.openStageId
            ? Number(fullLeadData.openStageId)
            : 0,
          openStageName: fullLeadData.openStageName || "",
          closeStageId: fullLeadData.closeStageId
            ? Number(fullLeadData.closeStageId)
            : 0,
          closeStageName: fullLeadData.closeStageName || "",
          leadTitle: fullLeadData.leadTitle || "",
          leadFollowUpDate: formatFollowUpDateForAPI(
            fullLeadData.leadFollowUpDate || "",
          ).split(" ")[0],
          followUpDetails: [...existingFollowUps, newFollowUp],
        };

        const updateResponse = await UpdateleadbyID(
          selectedLeadForFollowUp.leadId,
          payload,
        );
        const apiData = updateResponse?.data || updateResponse;

        if (apiData?.success === true) {
          Swal.fire("Success", "Follow-up added successfully!", "success");
          await refreshFollowUps();
          if (activePipeline?.id)
            invalidateAndRefetch(activePipeline.id, activePipeline.name);
        } else {
          Swal.fire(
            "Error",
            apiData?.msg || "Failed to add follow-up",
            "error",
          );
        }
      } catch (error) {
        console.error("Error saving follow-up:", error);
        Swal.fire("Error", "Failed to save follow-up", "error");
      }
    },
    [
      selectedLeadForFollowUp,
      refreshFollowUps,
      activePipeline,
      invalidateAndRefetch,
    ],
  );

  const handleEditLead = useCallback(
    async (lead) => {
      try {
        Swal.fire({
          title: "Loading...",
          text: "Fetching lead details",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        const response = await GetLeadByID(lead.leadId);
        Swal.close();
        const fullLeadData = response?.data?.data?.[0];
        if (!fullLeadData) {
          Swal.fire("Error", "Failed to fetch lead details", "error");
          return;
        }

        navigate("/super-leads/addlead", {
          state: {
            leadData: {
              id: fullLeadData.id,
              leadId: fullLeadData.id,
              leadCode: fullLeadData.leadCode,
              leadType: fullLeadData.leadType,
              leadStatus: fullLeadData.leadStatus,
              leadSource: fullLeadData.leadSource,
              leadRemark: fullLeadData.leadRemark,
              leadAssign: fullLeadData.leadAssignId,
              selectPrefix: fullLeadData.selectPrefix,
              clientName: fullLeadData.clientName,
              emailId: fullLeadData.emailId,
              contactNumber: fullLeadData.contactNumber,
              address: fullLeadData.address,
              pinCode: fullLeadData.pinCode,
              city: fullLeadData.cityId,
              state: fullLeadData.stateId,
              overallRemark: fullLeadData.overallRemark,
              productType: fullLeadData.planId,
              pipelineId: fullLeadData.pipelineId,
              pipelineName: fullLeadData.pipelineName,
              openStageId: fullLeadData.openStageId,
              openStageName: fullLeadData.openStageName,
              closeStageId: fullLeadData.closeStageId,
              leadTitle: fullLeadData.leadTitle || "",
              leadFollowUpDate: fullLeadData.leadFollowUpDate || "",
              estimateAmount: String(fullLeadData.estimateAmount ?? ""),
              followUpDetails: (fullLeadData.followUpDetails || []).map(
                (fu) => ({
                  id: fu.id,
                  followUpType: fu.followUpType || "",
                  followUpStatus: fu.followUpStatus || "Open",
                  followUpDate: fu.followUpDate || "",
                  clientRemarks: fu.clientRemarks || "",
                  employeeRemarks: fu.employeeRemarks || "",
                  memberId: fu.memberId || 0,
                  createdAt: fu.createdAt || null,
                }),
              ),
            },
          },
        });
      } catch (error) {
        Swal.close();
        Swal.fire("Error", "Failed to load lead data", "error");
      }
    },
    [navigate],
  );

  const handleDeleteLead = useCallback(
    (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          DeleteLeadbyID(id)
            .then(() => {
              Swal.fire("Deleted!", "Lead has been deleted.", "success");
              if (activePipeline?.id)
                invalidateAndRefetch(activePipeline.id, activePipeline.name);
            })
            .catch(() =>
              Swal.fire("Error!", "Failed to delete lead.", "error"),
            );
        }
      });
    },
    [activePipeline, invalidateAndRefetch],
  );

  const handleViewLead = useCallback(async (lead) => {
    try {
      Swal.fire({
        title: "Loading...",
        text: "Fetching lead details",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const response = await GetLeadByID(lead.leadId);
      Swal.close();
      setSelectedLead(response?.data?.data?.[0] || {});
      setIsViewModalOpen(true);
    } catch {
      Swal.close();
      setSelectedLead({});
      setIsViewModalOpen(true);
    }
  }, []);

  // ─── Assign ───────────────────────────────────────────────────────────────

  const handleAssignLead = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Leads Selected",
        text: "Please select at least one lead to assign.",
      });
      return;
    }
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedManager) {
      Swal.fire({
        icon: "warning",
        title: "No Manager Selected",
        text: "Please select a manager.",
      });
      return;
    }
    if (!assignCloseDate) {
      Swal.fire({
        icon: "warning",
        title: "Close Date Required",
        text: "Please select a close date.",
      });
      return;
    }
    if (!assignDescription) {
      Swal.fire({
        icon: "warning",
        title: "Description Required",
        text: "Please enter a description.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Assigning...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const response = await assignMultipleLeadToMember(
        selectedRows,
        Number(selectedManager),
        assignCloseDate,
        assignDescription,
      );
      Swal.close();
      const apiData = response?.data || response;

      if (apiData?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `${selectedRows.length} lead(s) assigned successfully.`,
        });
        setIsAssignModalOpen(false);
        setSelectedManager("");
        setSelectedRows([]);
        setAssignCloseDate("");
        setAssignDescription("");
        if (activePipeline?.id)
          invalidateAndRefetch(activePipeline.id, activePipeline.name);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: apiData?.msg || apiData?.message || "Failed to assign leads",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to assign leads.",
      });
    }
  };

  // ─── Row selection ────────────────────────────────────────────────────────

  const handleSelectRow = (leadId, isChecked) =>
    setSelectedRows((prev) =>
      isChecked ? [...prev, leadId] : prev.filter((id) => id !== leadId),
    );

  const handleSelectAll = (isChecked) =>
    setSelectedRows(isChecked ? filteredData.map((r) => r.leadId) : []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Fragment>
      <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="USER.MASTER.CONTACT_TYPE_MASTER"
                    defaultMessage="Leads"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* TOPCARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total New Inquire Leads",
              value: stats.total,
              bg: "bg-blue-100",
              icon: "/media/icons/lead1.png",
            },
            {
              label: "Hot Leads",
              value: stats.hot,
              bg: "bg-[#FEE2E2]",
              icon: "/media/icons/lead2.png",
            },
            {
              label: "Won Leads",
              value: stats.wonCount,
              bg: "bg-[#FEF9C3]",
              icon: "/media/icons/lead3.png",
            },
            {
              label: "Lost Leads",
              value: stats.lostCount,
              bg: "bg-[#F3E8FF]",
              icon: "/media/icons/lead4.png",
            },
          ].map(({ label, value, bg, icon }) => (
            <div
              key={label}
              className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between"
            >
              <div>
                <p className="text-gray-600 text-sm font-medium">{label}</p>
                <p className="text-3xl font-semibold mt-1">{value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
              >
                <img
                  src={toAbsoluteUrl(icon)}
                  alt="icon"
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* FILTER ROW */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                <input
                  className="input pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Search leads..."
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <select
                value={selectedPipelineId}
                onChange={handlePipelineChange}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                {pipelines.length === 0 ? (
                  <option value="">Loading pipelines...</option>
                ) : (
                  pipelines.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name || p.pipelineName || "Unnamed Pipeline"}
                    </option>
                  ))
                )}
              </select>

              {/* In JSX — change value from s.id to s.name */}
              <select
                value={selectedStageId}
                onChange={handleStageChange}
                className="px-2 py-1 border border-gray-300 rounded-md"
                disabled={isStagesLoading || isFilterLoading}
              >
                <option value="">
                  {isStagesLoading ? "Loading stages..." : "All Stages"}
                </option>
                {stages.map((s) => (
                  <option key={s.id} value={s.name}>
                    {" "}
                    {/* ✅ value = name string, key = id */}
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedAssignId}
                onChange={handleMemberChange}
                className="px-2 py-1 border border-gray-300 rounded-md"
                disabled={isFilterLoading}
              >
                <option value="">All Members</option>
                {managers.map((m) => (
                  <option key={m.value} value={String(m.value)}>
                    {m.label}
                  </option>
                ))}
              </select>

              {(selectedStageId || selectedAssignId || searchText) && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                  title="Clear all filters"
                >
                  <i className="ki-filled ki-cross-circle text-lg"></i>
                  <span className="text-sm">Clear</span>
                </button>
              )}

              {isFilterLoading && (
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 items-center">
              <div className="btn-tabs flex gap-1 bg-gray-100 rounded-md p-1">
                <button
                  className={`btn btn-icon ${viewMode === 0 ? "active bg-white shadow-sm" : ""}`}
                  onClick={() => setViewMode(0)}
                  title="Board View"
                >
                  <i className="ki-outline ki-element-11"></i>
                </button>
                <button
                  className={`btn btn-icon ${viewMode === 1 ? "active bg-white shadow-sm" : ""}`}
                  onClick={() => setViewMode(1)}
                  title="List View"
                >
                  <i className="ki-outline ki-row-horizontal"></i>
                </button>
              </div>

              {selectedRows.length > 0 && viewMode === 1 && (
                <button
                  onClick={handleAssignLead}
                  className="bg-green-600 text-white px-4 py-2 rounded-md shadow flex items-center gap-2 hover:bg-green-700 transition"
                >
                  <i className="ki-filled ki-user-tick"></i> Assign Lead (
                  {selectedRows.length})
                </button>
              )}

              <button
                onClick={() => navigate("/super-leads/addlead")}
                className="bg-primary text-white px-4 py-2 rounded-md shadow flex items-center gap-2 hover:bg-primary-dark transition"
              >
                <i className="ki-filled ki-plus"></i> Create Lead
              </button>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        {viewMode === 0 && (
          <div className="flex flex-wrap justify-center items-end gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  cls: "badge-info",
                  icon: "ki-chart-line-up",
                  label: "Cold",
                  amount: stats.coldAmount,
                },
                {
                  cls: "bg-yellow-100 text-black",
                  icon: "ki-chart-line-up",
                  label: "Hot",
                  amount: stats.hotAmount,
                },
                {
                  cls: "badge-success",
                  icon: "ki-chart-line-up",
                  label: "Won",
                  amount: stats.wonAmount,
                },
                {
                  cls: "badge-danger",
                  icon: "ki-chart-line-up",
                  label: "Lost",
                  amount: stats.lostAmount,
                },
              ].map(({ cls, icon, label, count, amount }) => (
                <Badge
                  key={label}
                  className={`badge badge-outline ${cls} text-xs`}
                >
                  <span className="flex items-center">
                    <i className={`ki-filled ki-${icon} text-sm me-2`}></i>
                    <span className="flex flex-col">
                      <span>
                        {label} Amount
                        <strong>{count}</strong>
                      </span>
                      <span>
                        <strong>
                          ₹{Number(amount).toLocaleString("en-IN")}/-
                        </strong>
                      </span>
                    </span>
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full">
          {noPipelines ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M17.5 14v6M14.5 17h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Pipelines Found
              </h3>
              <p className="text-gray-500 text-sm text-center max-w-sm mb-6">
                You don't have any pipelines set up yet. Create a pipeline to
                start organizing and tracking your leads efficiently.
              </p>
              <button
                onClick={() => navigate("/pipeline")}
                className="bg-primary text-white px-6 py-2.5 rounded-lg shadow flex items-center gap-2 hover:bg-primary-dark transition font-medium"
              >
                <i className="ki-filled ki-plus text-base"></i> Add Pipeline
              </button>
            </div>
          ) : viewMode === 0 ? (
            <div
              className="flex-1 flex flex-nowrap space-x-4 cursor-grab overflow-x-auto flex-shrink-0"
              ref={scrollRef}
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
            >
              {isLoadingLeads ? (
                <div className="w-full flex justify-center items-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading leads...</p>
                  </div>
                </div>
              ) : (
                <DragAndDrop
                  columns={boardColumns}
                  setColumns={setBoardColumns}
                  setDndActive={setDndActive}
                  onLeadDropped={handleLeadDropped}
                  onEditLead={handleEditLead}
                  onDeleteLead={handleDeleteLead}
                  onFollowUp={handleFollowUp}
                  onViewLead={handleOpenDrawer}
                />
              )}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <TableComponent
                columns={columns(
                  handleEditLead,
                  handleDeleteLead,
                  null,
                  handleViewLead,
                  handleFollowUp,
                  selectedRows,
                  handleSelectRow,
                  handleSelectAll,
                  filteredData.length,
                  navigate,
                )}
                data={filteredData}
                paginationSize={10}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        {isDrawerOpen && drawerLead && (
          <Leaddetailview
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false);
              setDrawerLead(null);
            }}
            lead={drawerLead}
            followUps={drawerFollowUps}
            onNewFollowUp={() => {
              setIsDrawerOpen(false);
              handleFollowUp(drawerLead);
            }}
            onEdit={() => {
              setIsDrawerOpen(false);
              handleEditLead(drawerLead);
            }}
            onDelete={() => {
              setIsDrawerOpen(false);
              handleDeleteLead(drawerLead.id || drawerLead.leadId);
            }}
          />
        )}

        {isMoveModalOpen && moveLeadPayload && (
          <Moveleadmodal
            isOpen={isMoveModalOpen}
            onClose={handleCancelMove}
            onConfirm={handleConfirmMove}
            lead={moveLeadPayload.lead}
            fromColumn={moveLeadPayload.fromColumn}
            toColumn={moveLeadPayload.toColumn}
            managers={managers}
            boardColumns={boardColumns}
          />
        )}

        {isFollowUpOpen && selectedLeadForFollowUp && (
          <FollowUp
            isOpen={isFollowUpOpen}
            onClose={() => {
              setIsFollowUpOpen(false);
              setSelectedLeadForFollowUp(null);
            }}
            onSave={handleSaveFollowUp}
            clientName={selectedLeadForFollowUp.clientName}
            leadData={selectedLeadForFollowUp}
            existingFollowUps={selectedLeadForFollowUp.followUps}
            onRefresh={refreshFollowUps}
          />
        )}

        {isAssignModalOpen && (
          <AssignLeadModal
            isOpen={isAssignModalOpen}
            onClose={() => {
              setIsAssignModalOpen(false);
              setSelectedManager("");
              setAssignCloseDate("");
              setAssignDescription("");
            }}
            managers={managers}
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
            closeDate={assignCloseDate}
            setCloseDate={setAssignCloseDate}
            description={assignDescription}
            setDescription={setAssignDescription}
            onSave={handleSaveAssignment}
            selectedCount={selectedRows.length}
          />
        )}
      </div>
    </Fragment>
  );
};

export default SuperLeads;
