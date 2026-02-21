import { Fragment, useEffect, useState, useRef } from "react";
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
  GetAllleadmaster,
  DeleteLeadbyID,
  GetLeadByID,
  UpdateleadbyID,
  Fetchmanager,
  assignMultipleLeadToMember,
  getLeadsByLeadStatus,
  getleadbyleattype,
  GETstagesleaddatabypipeline,
  GETallpipeline,
  MoveLeadToStage,
  Getstagesbypipeline,
} from "@/services/apiServices";
import useStyle from "./style";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";
import { DragAndDrop } from "@/components/drag-and-drop/DragAndDrop";
import { Badge } from "@/components/ui/badge";

const formatFollowUpDateForAPI = (dateStr) => {
  if (!dateStr) return "";

  // ✅ ADD THIS - Handle "YYYY-MM-DD HH:mm:ss" → "DD/MM/YYYY 12:00 AM"
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(dateStr)) {
    const [datePart] = dateStr.split(" ");
    const [y, m, d] = datePart.split("-");
    return `${d}/${m}/${y} 12:00 AM`;
  }

  // existing cases below unchanged ↓
  if (/\d{2}\/\d{2}\/\d{4}\s+\d/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y} 12:00 AM`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return `${dateStr} 12:00 AM`;
  }
  return dateStr;
};
const SuperLeads = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const scrollRef = useRef(null);

  // View Toggle State
  const [viewMode, setViewMode] = useState(0); // 0 = Board, 1 = List

  // State management
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [totalLeads, setTotalLeads] = useState(0);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [moveLeadPayload, setMoveLeadPayload] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerLead, setDrawerLead] = useState(null);
  const [drawerFollowUps, setDrawerFollowUps] = useState([]);
  const [activePipeline, setActivePipeline] = useState(null); // { id, name }
  const [pipelineData, setPipelineData] = useState(null);
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState("");
  const [assignCloseDate, setAssignCloseDate] = useState("");
  const [assignDescription, setAssignDescription] = useState("");
  // Add this state near the top with other states
  const [noPipelines, setNoPipelines] = useState(false);

  // Filter states
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("");
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [isStagesLoading, setIsStagesLoading] = useState(false);
  const [filteredByStage, setFilteredByStage] = useState(null);
  const [selectedAssignId, setSelectedAssignId] = useState("");

  // Board view states - Initialize with empty structure
  const [boardColumns, setBoardColumns] = useState([
    { id: "pending", name: "Pending", children: [] },
    { id: "open", name: "Open", children: [] },
    { id: "confirmed", name: "Confirmed", children: [] },
    { id: "cancel", name: "Cancelled", children: [] },
    { id: "closed", name: "Closed", children: [] },
  ]);
  const [dndActive, setDndActive] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  const LEAD_STATUS_OPTIONS = [{ label: "All Stages", value: "" }];

  // Lead Type Options
  const LEAD_TYPE_OPTIONS = [{ label: "select piplene", value: "" }];

  // Stats
  const [stats, setStats] = useState({
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
    coldAmount:0,
  });
  const lang = localStorage.getItem("lang") || "en";

  const fetchStagesForPipeline = async (pipelineId) => {
    try {
      setIsStagesLoading(true);
      setSelectedStageId(""); // reset stage on pipeline change

      const getStoredUserId = () => {
        const direct =
          localStorage.getItem("mainId") ||
          localStorage.getItem("id") ||
          localStorage.getItem("user_id") ||
          localStorage.getItem("empId") ||
          localStorage.getItem("memberId");
        if (direct) return direct;
        const keys = [
          "user",
          "userData",
          "authUser",
          "userInfo",
          "auth",
          "profile",
        ];
        for (const key of keys) {
          try {
            const parsed = JSON.parse(localStorage.getItem(key) || "{}");
            const id =
              parsed?.id || parsed?.userId || parsed?.user_id || parsed?.empId;
            if (id) return String(id);
          } catch {}
        }
        return null;
      };

      const userId = getStoredUserId();
      if (!userId) return;

      const stagesRes = await Getstagesbypipeline(pipelineId, userId);
      const stagesData = stagesRes?.data?.data || {};

      // Flatten all stages from open/close groups into one list
      const allStages = [];
      Object.entries(stagesData).forEach(([groupKey, stageList]) => {
        stageList.forEach((stage) => {
          allStages.push({
            id: stage.stageId,
            name: stage.stageName,
            type: stage.stageType,
            group: groupKey,
          });
        });
      });

      setStages(allStages);
    } catch (err) {
      console.error("Failed to fetch stages:", err);
      setStages([]);
    } finally {
      setIsStagesLoading(false);
    }
  };
  useEffect(() => {
    if (location.state?.pipelineId) {
      setActivePipeline({
        id: location.state.pipelineId,
        name: location.state.pipelineName,
      });
      fetchPipelineLeads(location.state.pipelineId);
    }
  }, []);

  // pipelineleaddata
  const fetchPipelineLeads = async (pipelineId, pipelineNameParam = "") => {
    try {
      setIsLoadingLeads(true);

      const getStoredUserId = () => {
        const direct =
          localStorage.getItem("mainId") ||
          localStorage.getItem("id") ||
          localStorage.getItem("user_id") ||
          localStorage.getItem("empId") ||
          localStorage.getItem("memberId");
        if (direct) return direct;

        const keys = [
          "user",
          "userData",
          "authUser",
          "userInfo",
          "auth",
          "profile",
        ];
        for (const key of keys) {
          try {
            const parsed = JSON.parse(localStorage.getItem(key) || "{}");
            const id =
              parsed?.id || parsed?.userId || parsed?.user_id || parsed?.empId;
            if (id) return String(id);
          } catch {}
        }
        return null;
      };

      const userId = getStoredUserId();
      if (!userId) {
        console.error("❌ userId not found.");
        setIsLoadingLeads(false);
        return;
      }

      const [leadsRes, stagesRes] = await Promise.all([
        GETstagesleaddatabypipeline(pipelineId, userId),
        Getstagesbypipeline(pipelineId, userId),
      ]);

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
        coldAmount: data?.cold_lead_amount || "0"
      });
      const stagesData = stagesRes?.data?.data;

      // 1. stageId → stageType  (for leads that already have a stageId)
      // 2. stageName → { stageId, stageType }  (for matching columns by name, including empty ones)
      const stageIdToTypeMap = {};
      const stageNameToMetaMap = {};

      Object.entries(stagesData || {}).forEach(([groupKey, stages]) => {
        stages.forEach((stage) => {
          stageIdToTypeMap[stage.stageId] = stage.stageType;
          // stageName is the key used in open_lead / close_lead objects
          const normalizedName = stage.stageName?.toLowerCase().trim();
          stageNameToMetaMap[normalizedName] = {
            stageId: stage.stageId,
            stageType: stage.stageType,
          };
        });
      });

      console.log("✅ stageNameToMetaMap:", stageNameToMetaMap);

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
  };

  const buildBoardFromPipeline = (
    data,
    stageIdToTypeMap = {},
    stageNameToMetaMap = {},
    pipelineName = "",
  ) => {
    const openLead = data?.open_lead || {};
    const closeLead = data?.close_lead || {};

    const openColumns = Object.entries(openLead).map(([stageName, leads]) => {
      // ✅ First try to get stageId/stageType from the stageNameToMetaMap (reliable, works even with 0 leads)
      const metaFromName = stageNameToMetaMap[stageName?.toLowerCase().trim()];
      const stageId = metaFromName?.stageId ?? leads[0]?.stageId ?? null;
      const stageType =
        metaFromName?.stageType ??
        stageIdToTypeMap[leads[0]?.stageId] ??
        "open_stage";

      console.log(
        `✅ Open stage "${stageName}" → stageId: ${stageId}, stageType: ${stageType}`,
      );

      return {
        id: `open_${stageName}`,
        name: stageName,
        tag: "open",
        stageId,
        stageType,
        children: leads.map((lead) => ({
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
          createdAt: lead.leadCreatedAt || null, // was createdAt (null in API)
          updatedAt: lead.leadUpdatedAt || null, // was updatedAt (null in API)
          closeDate: lead.leadFollowUpDate || "NA",
          stage: lead.stage || stageName,
          pipelineName: lead.pipelineName || pipelineName || "-",
        })),
      };
    });

    const closeColumns = Object.entries(closeLead).map(([stageName, leads]) => {
      // ✅ Same fix for close stages
      const metaFromName = stageNameToMetaMap[stageName?.toLowerCase().trim()];
      const stageId = metaFromName?.stageId ?? leads[0]?.stageId ?? null;
      const stageType =
        metaFromName?.stageType ??
        stageIdToTypeMap[leads[0]?.stageId] ??
        "close_stage";

      console.log(
        `✅ Close stage "${stageName}" → stageId: ${stageId}, stageType: ${stageType}`,
      );

      return {
        id: `close_${stageName}`,
        name: stageName,
        tag: "close",
        stageId,
        stageType,
        children: leads.map((lead) => ({
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
        })),
      };
    });

    setBoardColumns([...openColumns, ...closeColumns]);

    const finalColumns = [...openColumns, ...closeColumns];
    originalBoardColumnsRef.current = finalColumns; // ✅ save backup
    setBoardColumns(finalColumns);

    const allLeads = [
      ...Object.values(openLead).flat(),
      ...Object.values(closeLead).flat(),
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
  };

  const handleOpenDrawer = async (lead) => {
    try {
      const response = await GetLeadByID(lead.leadId);
      const fullLeadData = response?.data?.data?.[0] || lead;

      const mappedLead = {
        ...fullLeadData,
        leadId: fullLeadData.id,
        title: fullLeadData.clientName,
        subtitle: fullLeadData.leadCode,
        assignedTo: fullLeadData.leadAssignName || "-",
        city: fullLeadData.cityName || "-",
        closeDate: fullLeadData.leadFollowUpDate || "NA",
        pipelineName: fullLeadData.pipelineName || "-",
        openStageName: fullLeadData.openStageName || "-", // ✅
        createdAt: fullLeadData.createdAt || "N/A",
        updatedAt: fullLeadData.createdAt || "N/A",
        amount: fullLeadData.estimateAmount || 0,
        estimateAmount: fullLeadData.estimateAmount || 0,
      };

      // ✅ Map followUpDetails correctly from API
      const mappedFollowUps = (fullLeadData.followUpDetails || []).map(
        (fu) => ({
          id: fu.id,
          followUpType: fu.followUpType || "Call",
          followUpStatus: fu.followUpStatus || "Open",
          followUpDate: fu.followUpDate || "", // "24/02/2026 12:00 AM"
          clientRemarks: fu.clientRemarks || "",
          employeeRemarks: fu.employeeRemarks || "",
          createdAt: fu.createdAt || "", // "19/02/2026 12:16 PM"
          leadId: fu.leadId,
          memberId: fu.memberId,
          memberName: fu.memberName || "", // ✅ "Digvijay Shree"
        }),
      );

      setDrawerLead(mappedLead);
      setDrawerFollowUps(mappedFollowUps); // ✅ properly mapped
      setIsDrawerOpen(true);
    } catch {
      setDrawerLead(lead);
      setDrawerFollowUps([]);
      setIsDrawerOpen(true);
    }
  };

  const handleLeadDropped = ({
    lead,
    fromColumn,
    toColumn,
    pendingColumns,
  }) => {
    // ✅ Look up correct column from boardColumns state using name match
    const correctFromColumn =
      boardColumns.find(
        (col) =>
          col.name?.toLowerCase().trim() ===
          fromColumn.name?.toLowerCase().trim(),
      ) || fromColumn;

    const correctToColumn =
      boardColumns.find(
        (col) =>
          col.name?.toLowerCase().trim() ===
          toColumn.name?.toLowerCase().trim(),
      ) || toColumn;

    console.log(
      "FROM resolved:",
      correctFromColumn.name,
      correctFromColumn.stageId,
      correctFromColumn.stageType,
    );
    console.log(
      "TO resolved:",
      correctToColumn.name,
      correctToColumn.stageId,
      correctToColumn.stageType,
    );

    setMoveLeadPayload({
      lead,
      fromColumn: correctFromColumn,
      toColumn: correctToColumn,
      pendingColumns,
    });
    setIsMoveModalOpen(true);
  };

  // ✅ Fix - remove the redundant toColumn.tag
  const handleConfirmMove = async (formPayload) => {
    const lead = moveLeadPayload.lead;

    // ✅ Use formPayload.toColumn (resolved in modal) for manual move
    // For DnD, use moveLeadPayload.toColumn
    const toColumn = formPayload.toColumn?.stageId
      ? formPayload.toColumn // ✅ manual move — already resolved with stageId
      : moveLeadPayload.toColumn; // ✅ DnD — already has stageId from boardColumns

    // ✅ Only apply pendingColumns for DnD (manual move has no pendingColumns)
    if (moveLeadPayload.pendingColumns?.length) {
      setBoardColumns(moveLeadPayload.pendingColumns);
    }

    const leadId = Number(lead.leadId);
    const stageId = Number(toColumn.stageId || lead.stageId);
    const stageType =
      toColumn.stageType ||
      (toColumn.tag === "open" ? "open_stage" : "close_stage");

    const assignId = formPayload.assignedTo
      ? Number(formPayload.assignedTo)
      : null;
    const remark = formPayload.remarks || "";

    const requestDto = formPayload.followUp?.date
      ? {
          clientRemarks: formPayload.remarks || "",
          employeeRemarks: "",
          followUpDate: formatFollowUpDateForAPI(formPayload.followUp.date),
          followUpStatus: "Open",
          followUpType: formPayload.followUp.type || "Call",
          id: 0,
          leadId: leadId,
          memberId: formPayload.assignedTo ? Number(formPayload.assignedTo) : 0,
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
        remark,
        requestDto,
      );
      if (activePipeline?.id) {
        fetchPipelineLeads(activePipeline.id, activePipeline.name);
      }
    } catch (err) {
      console.error("Move lead failed:", err);
      Swal.fire("Error", "Failed to move lead. Please try again.", "error");
    }

    setIsMoveModalOpen(false);
    setMoveLeadPayload(null);
  };
  const handleCancelMove = () => {
    setIsMoveModalOpen(false);
    setMoveLeadPayload(null);
    // Columns are NOT updated → drop is effectively cancelled
  };
  // Filter data based on search only
  const filteredData = (filteredByStage ?? tableData).filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.clientName?.toLowerCase().includes(search) ||
      item.leadCode?.toLowerCase().includes(search) ||
      item.leadType?.toLowerCase().includes(search) ||
      item.contactNumber?.toLowerCase().includes(search)
    );
  });

  // Scroll functions for board view
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  // Drag scroll functionality
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const originalBoardColumnsRef = useRef([]);

  const onPointerDown = (e) => {
    isDragging.current = true;
    if (dndActive) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("cursor-grabbing");
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    if (dndActive) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = clientX - startX.current;
    scrollRef.current.scrollLeft = scrollStart.current - dx;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove("cursor-grabbing");
    }
  };

  // Transform table data to board columns
  const transformToBoardData = (data) => {
    const statusGroups = {
      Pending: { id: "pending", name: "Pending", children: [] },
      Open: { id: "open", name: "Open", children: [] },
      confirmed: { id: "confirmed", name: "Confirmed", children: [] },
      Cancel: { id: "cancel", name: "Cancelled", children: [] },
      Closed: { id: "closed", name: "Closed", children: [] },
    };

    data.forEach((lead) => {
      const status = lead.leadStatus || "Open";
      if (statusGroups[status]) {
        statusGroups[status].children.push({
          id: `lead_${lead.leadId}`,
          leadId: lead.leadId,
          title: lead.clientName,
          subtitle: lead.leadCode,
          description: lead.productType,
          type: lead.leadType,
          contact: lead.contactNumber,
          city: lead.cityName,
          cityName: lead.cityName,
          assignedTo: lead.leadAssign,
          leadAssign: lead.leadAssign,
          leadAssignName: lead.leadAssignName,
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
          amount: lead.amount || 0,
          closeDate: lead.closeDate || "NA",
          followUpDetails: lead.followUpDetails || [],
          leadStatus: lead.leadStatus,
          ...lead,
        });
      }
    });

    return Object.values(statusGroups);
  };

  // Fetch Managers
  // ✅ Load once on mount — available for filter dropdown AND assign modal
  useEffect(() => {
    Fetchmanager(1)
      .then((res) => {
        if (res?.data?.data?.userDetails) {
          const managerList = res.data.data.userDetails.map((man) => ({
            value: man.id,
            label: man.firstName || "-",
          }));
          setManagers(managerList);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch managers:", err);
        setManagers([]);
      });
  }, []); // ← empty array, runs once

  // Handle Lead Status Filter Change
  const handleLeadStatusChange = async (e) => {
    const selectedStatus = e.target.value;
    setSelectedLeadStatus(selectedStatus);

    if (!selectedStatus) {
      fetchLeads();
      return;
    }

    try {
      setIsFilterLoading(true);
      const response = await getLeadsByLeadStatus(selectedStatus);
      const apiData = response?.data?.data || response?.data;

      if (apiData && Array.isArray(apiData)) {
        const formatted = apiData.map((item, index) => ({
          ...item,
          sr_no: index + 1,
          leadId: item.id,
          leadAssign: item.leadAssignName || "-",
          productType: item.planName || "-",
          cityName: item.cityName || "-",
          createdAt: item.createdAt?.split("T")[0],
        }));

        setTableData(formatted);
        setBoardColumns(transformToBoardData(formatted));
      } else {
        setTableData([]);
        setBoardColumns([
          { id: "pending", name: "Pending", children: [] },
          { id: "open", name: "Open", children: [] },
          { id: "confirmed", name: "Confirmed", children: [] },
          { id: "cancel", name: "Cancelled", children: [] },
          { id: "closed", name: "Closed", children: [] },
        ]);
      }
    } catch (error) {
      console.error("Error fetching leads by status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch leads by status. Please try again.",
      });
    } finally {
      setIsFilterLoading(false);
    }
  };

  // Handle Lead Type Filter Change
  const handleLeadTypeChange = async (e) => {
    const selectedType = e.target.value;
    setSelectedLeadType(selectedType);

    if (!selectedType) {
      fetchLeads();
      return;
    }

    try {
      setIsFilterLoading(true);
      const response = await getleadbyleattype(selectedType);
      const apiData = response?.data?.data || response?.data;

      if (apiData && Array.isArray(apiData)) {
        const formatted = apiData.map((item, index) => ({
          sr_no: index + 1,
          leadId: item.id,
          leadCode: item.leadCode,
          leadType: item.leadType,
          leadStatus: item.leadStatus,
          leadSource: item.leadSource,
          leadAssign: item.leadAssignName || "-",
          productType: item.planName || "-",
          clientName: item.clientName,
          contactNumber: item.contactNumber,
          cityId: item.cityId,
          cityName: item.cityName || "-",
          createdAt: item.createdAt?.split("T")[0],
        }));

        setTableData(formatted);
        setBoardColumns(transformToBoardData(formatted));
      } else {
        setTableData([]);
        setBoardColumns([
          { id: "pending", name: "Pending", children: [] },
          { id: "open", name: "Open", children: [] },
          { id: "confirmed", name: "Confirmed", children: [] },
          { id: "cancel", name: "Cancelled", children: [] },
          { id: "closed", name: "Closed", children: [] },
        ]);
      }
    } catch (error) {
      console.error("Error fetching leads by type:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch leads by type. Please try again.",
      });
    } finally {
      setIsFilterLoading(false);
    }
  };

  // Clear All Filters
  const handleClearFilters = () => {
    setSelectedLeadStatus("");
    setSelectedLeadType("");
    setSelectedStageId("");
    setSelectedAssignId("");
    setFilteredByStage(null);
    setSearchText("");

    // ✅ Restore from ref instantly, no API call
    if (originalBoardColumnsRef.current.length > 0) {
      setBoardColumns(originalBoardColumnsRef.current);
      const allLeads = originalBoardColumnsRef.current
        .flatMap((col) => col.children)
        .map((lead, index) => ({
          ...lead,
          sr_no: index + 1,
          leadAssign: lead.leadAssignName || "-",
          productType: lead.planName || "-",
          cityName: lead.city || lead.cityName || "-",
          stage: lead.stage || "-",
        }));
      setTableData(allLeads);
    } else if (activePipeline?.id) {
      fetchPipelineLeads(activePipeline.id);
    }
  };

  // Handle Assign Lead
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

  // Save Assigned Leads
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
        assignCloseDate, // ✅ new
        assignDescription, // ✅ new
      );

      Swal.close();
      const apiData = response?.data || response;

      if (apiData?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `${selectedRows.length} lead(s) assigned successfully.`,
        });

        // ✅ Reset all
        setIsAssignModalOpen(false);
        setSelectedManager("");
        setSelectedRows([]);
        setAssignCloseDate("");
        setAssignDescription("");

        if (activePipeline?.id) fetchPipelineLeads(activePipeline.id);
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

  // Refresh Follow-ups
  const refreshFollowUps = async () => {
    if (!selectedLeadForFollowUp?.leadId) {
      return;
    }

    try {
      const response = await GetLeadByID(selectedLeadForFollowUp.leadId);
      const dataArray = response?.data?.data;

      if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
        const fullLeadData = dataArray[0];
        setSelectedLeadForFollowUp({
          leadId: fullLeadData.id,
          clientName: fullLeadData.clientName,
          leadCode: fullLeadData.leadCode,
          contactNumber: fullLeadData.contactNumber,
          emailId: fullLeadData.emailId,
          leadAssignId: fullLeadData.leadAssignId,
          followUps: fullLeadData.followUpDetails || [],
        });
      }
    } catch (error) {
      console.error("Error refreshing follow-ups:", error);
    }
  };

  // Checkbox handlers
  const handleSelectRow = (leadId, isChecked) => {
    if (isChecked) {
      setSelectedRows((prev) => [...prev, leadId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== leadId));
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allLeadIds = filteredData.map((row) => row.leadId);
      setSelectedRows(allLeadIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Follow-Up Handler
  const handleFollowUp = async (lead) => {
    try {
      Swal.fire({
        title: "Loading...",
        text: "Fetching lead details",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await GetLeadByID(lead.leadId);
      Swal.close();

      const dataArray = response?.data?.data;
      if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
        Swal.fire("Error", "Failed to fetch lead details", "error");
        return;
      }

      const fullLeadData = dataArray[0];

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
    } catch (error) {
      console.error("Error fetching lead for follow-up:", error);
      Swal.close();
      Swal.fire("Error", "Failed to load lead data", "error");
    }
  };

  // Save Follow-Up Handler
  const handleSaveFollowUp = async (followUpData) => {
    try {
      const response = await GetLeadByID(selectedLeadForFollowUp.leadId);
      const dataArray = response?.data?.data;

      if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
        Swal.fire("Error", "Failed to fetch lead details", "error");
        return;
      }

      const fullLeadData = dataArray[0];

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
        memberId: followUpData.memberId || followUpData.managerId || 0, // ✅ AddFollowUpModal sends memberId
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

      const allFollowUps = [...existingFollowUps, newFollowUp];

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

        // ✅ ADD THESE — pipeline and stage fields were missing
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

        followUpDetails: allFollowUps,
      };

      const updateResponse = await UpdateleadbyID(
        selectedLeadForFollowUp.leadId,
        payload,
      );

      const apiData = updateResponse?.data || updateResponse;
      const isSuccess = apiData?.success === true;

      if (isSuccess) {
        Swal.fire("Success", "Follow-up added successfully!", "success");
        await refreshFollowUps();

        if (activePipeline?.id) {
          fetchPipelineLeads(activePipeline.id);
        }
      } else {
        const errorMsg = apiData?.msg || "Failed to add follow-up";
        Swal.fire("Error", errorMsg, "error");
      }
    } catch (error) {
      console.error("Error saving follow-up:", error);
      Swal.fire("Error", "Failed to save follow-up", "error");
    }
  };

  // Edit Lead Handler
  const handleEditLead = async (lead) => {
    try {
      Swal.fire({
        title: "Loading...",
        text: "Fetching lead details",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await GetLeadByID(lead.leadId);
      Swal.close();

      const dataArray = response?.data?.data;
      if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
        Swal.fire("Error", "Failed to fetch lead details", "error");
        return;
      }

      const fullLeadData = dataArray[0];
      const mappedFollowUps = (fullLeadData.followUpDetails || []).map(
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
      );

      const mappedData = {
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
        followUpDetails: mappedFollowUps,
        pipelineId: fullLeadData.pipelineId,
        pipelineName: fullLeadData.pipelineName,
        openStageId: fullLeadData.openStageId,
        openStageName: fullLeadData.openStageName,
        closeStageId: fullLeadData.closeStageId,
        leadTitle: fullLeadData.leadTitle || "",
        leadFollowUpDate: fullLeadData.leadFollowUpDate || "",
        // In handleEditLead (index.jsx) - ensure it's always a string:
        estimateAmount: String(fullLeadData.estimateAmount ?? ""), // ✅ handles 0 too
      };

      navigate("/super-leads/addlead", { state: { leadData: mappedData } });
    } catch (error) {
      console.error("Error fetching lead details:", error);
      Swal.close();
      Swal.fire("Error", "Failed to load lead data", "error");
    }
  };

  useEffect(() => {
    const loadPipelines = async () => {
      try {
        const res = await GETallpipeline();
        const list = res?.data?.data || [];
        setPipelines(list);

        // ✅ No pipelines found
        if (list.length === 0) {
          setNoPipelines(true);
          setIsLoadingLeads(false);
          return;
        }

        setNoPipelines(false); // ✅ reset if pipelines exist
        const startPipeline = location.state?.pipelineId
          ? list.find((p) => p.id === location.state.pipelineId)
          : list.find((p) => p.id === 1) || list[0];

        if (startPipeline) {
          setActivePipeline({ id: startPipeline.id, name: startPipeline.name });
          setSelectedPipelineId(String(startPipeline.id));
          fetchPipelineLeads(startPipeline.id, startPipeline.name);
          fetchStagesForPipeline(startPipeline.id);
        }
      } catch (err) {
        console.error("Failed to load pipelines:", err);
        setNoPipelines(true);
        setIsLoadingLeads(false);
      }
    };
    loadPipelines();
  }, []);

  const handlePipelineChange = (e) => {
    const pipelineId = Number(e.target.value);
    setSelectedPipelineId(String(pipelineId));
    const found = pipelines.find((p) => p.id === pipelineId);
    if (found) {
      setActivePipeline({ id: found.id, name: found.name });
      fetchPipelineLeads(found.id);
      fetchPipelineLeads(found.id, found.name);
      fetchStagesForPipeline(found.id);
    }
  };
  // Delete Lead Handler
  const handleDeleteLead = (id) => {
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
          .then((res) => {
            Swal.fire("Deleted!", "Lead has been deleted.", "success");

            if (selectedLeadStatus) {
              handleLeadStatusChange({ target: { value: selectedLeadStatus } });
            } else if (selectedLeadType) {
              handleLeadTypeChange({ target: { value: selectedLeadType } });
            } else if (activePipeline?.id) {
              fetchPipelineLeads(activePipeline.id);
            }
          })
          .catch((err) => {
            console.error("Error deleting lead:", err);
            Swal.fire("Error!", "Failed to delete lead.", "error");
          });
      }
    });
  };

  // View Lead Handler
  const handleViewLead = async (lead) => {
    try {
      Swal.fire({
        title: "Loading...",
        text: "Fetching lead details",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await GetLeadByID(lead.leadId);
      Swal.close();

      const dataArray = response?.data?.data;
      let fullLeadData = {};

      if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
        fullLeadData = dataArray[0];
      }

      setSelectedLead(fullLeadData);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching lead for view:", error);
      Swal.close();
      setSelectedLead({});
      setIsViewModalOpen(true);
    }
  };

  // filter
  const handleStageChange = (e) => {
    const stageId = e.target.value;
    setSelectedStageId(stageId);
    setSelectedAssignId(""); // reset member filter when stage changes

    if (!stageId) {
      setFilteredByStage(null);
      // ✅ Restore from ref — no API call
      if (originalBoardColumnsRef.current.length > 0) {
        setBoardColumns(originalBoardColumnsRef.current);
        const allLeads = originalBoardColumnsRef.current
          .flatMap((col) => col.children)
          .map((lead, index) => ({
            ...lead,
            sr_no: index + 1,
            leadAssign: lead.leadAssignName || "-",
            productType: lead.planName || "-",
            cityName: lead.city || lead.cityName || "-",
            stage: lead.stage || "-",
          }));
        setTableData(allLeads);
      }
      return;
    }

    // ✅ Filter tableData for list view
    const filtered = originalBoardColumnsRef.current
      .flatMap((col) => col.children)
      .filter((lead) => String(lead.stageId) === String(stageId));
    setFilteredByStage(filtered);

    // ✅ Filter board — show only matching stage column, empty the rest
    setBoardColumns(
      originalBoardColumnsRef.current.map((col) =>
        String(col.stageId) === String(stageId)
          ? col
          : { ...col, children: [] },
      ),
    );
  };

  const handleMemberChange = (e) => {
    const assignId = e.target.value;
    setSelectedAssignId(assignId);
    setSelectedStageId(""); // reset stage filter

    if (!assignId) {
      // ✅ Restore full board from already-fetched data
      if (originalBoardColumnsRef.current.length > 0) {
        setBoardColumns(originalBoardColumnsRef.current);
      }
      // ✅ Restore full table data
      const allLeads = originalBoardColumnsRef.current.flatMap((col) =>
        col.children.map((lead, index) => ({
          ...lead,
          sr_no: index + 1,
          leadAssign: lead.leadAssignName || "-",
          productType: lead.planName || "-",
          cityName: lead.city || lead.cityName || "-",
          stage: lead.stage || "-",
        })),
      );
      setTableData(allLeads);
      setFilteredByStage(null);
      return;
    }

    // ✅ Filter boardColumns from ref (no API call)
    const filteredColumns = originalBoardColumnsRef.current.map((col) => ({
      ...col,
      children: col.children.filter(
        (lead) => String(lead.leadAssignId) === String(assignId),
      ),
    }));
    setBoardColumns(filteredColumns);

    // ✅ Filter tableData from ref for list view
    const filteredLeads = originalBoardColumnsRef.current
      .flatMap((col) => col.children)
      .filter((lead) => String(lead.leadAssignId) === String(assignId))
      .map((lead, index) => ({
        ...lead,
        sr_no: index + 1,
        leadAssign: lead.leadAssignName || "-",
        productType: lead.planName || "-",
        cityName: lead.city || lead.cityName || "-",
        stage: lead.stage || "-",
      }));

    setTableData(filteredLeads);
    setFilteredByStage(null);
  };
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
          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total New Inquire Leads
              </p>
              <p className="text-3xl font-semibold mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead1.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Hot Leads</p>
              <p className="text-3xl font-semibold mt-1">{stats.hot}</p>
            
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead2.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Won Leads</p>
              <p className="text-3xl font-semibold mt-1">{stats.wonCount}</p>
            
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FEF9C3] flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead3.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Lost Leads</p>
              <p className="text-3xl font-semibold mt-1">{stats.lostCount}</p>
            
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead4.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>
        </div>

        {/* FILTER ROW */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left Side - Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
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
              {/* Pipeline Select */}
              <select
                value={selectedPipelineId}
                onChange={handlePipelineChange}
                className="px-2 py-2 border border-gray-300 rounded-md"
              >
                {pipelines.length === 0 ? (
                  <option value="">Loading pipelines...</option>
                ) : (
                  pipelines.map((pipeline) => (
                    <option key={pipeline.id} value={String(pipeline.id)}>
                      {pipeline.name ||
                        pipeline.pipelineName ||
                        "Unnamed Pipeline"}
                    </option>
                  ))
                )}
              </select>

              {/* Stage Select — dynamic based on selected pipeline */}
              <select
                value={selectedStageId}
                onChange={handleStageChange}
                className="px-2 py-2 border border-gray-300 rounded-md"
                disabled={isStagesLoading || stages.length === 0}
              >
                <option value="">
                  {isStagesLoading ? "Loading stages..." : "All Stages"}
                </option>
                {stages.map((stage) => (
                  <option key={stage.id} value={String(stage.id)}>
                    {stage.name}
                  </option>
                ))}
              </select>
              {/* Member / Assign Filter */}
              <select
                value={selectedAssignId}
                onChange={handleMemberChange}
                className="px-2 py-2 border border-gray-300 rounded-md"
                disabled={isFilterLoading}
              >
                <option value="">All Members</option>
                {managers.map((member) => (
                  <option key={member.value} value={String(member.value)}>
                    {member.label}
                  </option>
                ))}
              </select>
              {/* Clear Filters Button */}
              {(selectedLeadStatus ||
                selectedLeadType ||
                selectedStageId ||
                selectedAssignId ||
                searchText) && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                  title="Clear all filters"
                >
                  <i className="ki-filled ki-cross-circle text-lg"></i>
                  <span className="text-sm">Clear</span>
                </button>
              )}

              {/* Filter Loading Indicator */}
              {isFilterLoading && (
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>

            {/* Right Side - View Toggle and Action Buttons */}
            <div className="flex gap-3 items-center">
              {/* View Toggle Buttons */}
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

        {/* Status Summary Badges - Only show in Board View */}
        {viewMode === 0 && (
          <div className="flex flex-wrap justify-center items-end gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              <Badge
                className="badge badge-outline badge-info text-xs"
                title="Total Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-2"></i>
                  <span className="flex flex-col">
                    <span>
                      Cold : <strong>{stats.total}</strong>
                    </span>
                    <span>
                      Amount:{" "}
                      <strong>
                        ₹{Number(stats.coldAmount).toLocaleString("en-IN")}/-
                      </strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline bg-yellow-100 text-xs"
                title="Hot Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-black  text-sm me-2"></i>
                  <span className="flex flex-col text-black">
                    <span>
                      Hot: <strong>{stats.hot}</strong>
                    </span>
                    <span>
                      Amount:{" "}
                      <strong>
                        ₹{Number(stats.hotAmount).toLocaleString("en-IN")}/-
                      </strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-success text-xs"
                title="Won Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-2"></i>
                  <span className="flex flex-col">
                    <span>
                      Won: <strong>{stats.wonCount}</strong>
                    </span>
                    <span>
                      Amount:{" "}
                      <strong>
                        ₹{Number(stats.wonAmount).toLocaleString("en-IN")}/-
                      </strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-danger text-xs"
                title="Lost Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-2"></i>
                  <span className="flex flex-col">
                    <span>
                      Lost: <strong>{stats.lostCount}</strong>
                    </span>
                    <span>
                      Amount:{" "}
                      <strong>
                        ₹{Number(stats.lostAmount).toLocaleString("en-IN")}/-
                      </strong>
                    </span>
                  </span>
                </span>
              </Badge>
            </div>

            {/* Scroll Buttons for Board View */}
          </div>
        )}

        {/* View Content */}
        {/* View Content */}
        <div className="w-full">
          {noPipelines ? (
            // ✅ Empty state — no pipelines
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
                <i className="ki-filled ki-plus text-base"></i>
                Add Pipeline
              </button>
            </div>
          ) : viewMode === 0 ? (
            /* Board View */
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
            /* List View */
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
              handleFollowUp(drawerLead); // reuse existing follow-up handler
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

        {/* Follow Up Modal */}
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
              setAssignCloseDate(""); // ✅ reset on close
              setAssignDescription(""); // ✅ reset on close
            }}
            managers={managers}
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
            closeDate={assignCloseDate} // ✅ new
            setCloseDate={setAssignCloseDate} // ✅ new
            description={assignDescription} // ✅ new
            setDescription={setAssignDescription} // ✅ new
            onSave={handleSaveAssignment}
            selectedCount={selectedRows.length}
          />
        )}
      </div>
    </Fragment>
  );
};

export default SuperLeads;
