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

  // Filter states
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("");
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [isFilterLoading, setIsFilterLoading] = useState(false);

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
  const LEAD_TYPE_OPTIONS = [
    { label: "select piplene", value: "" },
    { label: "sale ", value: "sale" },
  ];

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    cold: 0,
    inquire: 0,
    assigned: 0,
  });

  const lang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    if (location.state?.pipelineId) {
      setActivePipeline({
        id: location.state.pipelineId,
        name: location.state.pipelineName,
      });
      fetchPipelineLeads(location.state.pipelineId);
    }
  }, []);

  const fetchPipelineLeads = async (pipelineId) => {
    try {
      setIsLoadingLeads(true);

      // ✅ Try all common patterns
      const getStoredUserId = () => {
        // Direct keys
        const direct =
          localStorage.getItem("userId") ||
          localStorage.getItem("id") ||
          localStorage.getItem("user_id") ||
          localStorage.getItem("empId") ||
          localStorage.getItem("memberId");
        if (direct) return direct;

        // Nested in JSON object
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
      console.log("✅ Resolved userId:", userId); // ← check this in console

      if (!userId) {
        console.error(
          "❌ userId not found. localStorage keys:",
          Object.keys(localStorage),
        );
        setIsLoadingLeads(false);
        return;
      }

      const [leadsRes, stagesRes] = await Promise.all([
        GETstagesleaddatabypipeline(pipelineId, userId),
        Getstagesbypipeline(pipelineId, userId),
      ]);

      const data = leadsRes?.data?.data;
      const stagesData = stagesRes?.data?.data;

      const stageTypeMap = {};
      Object.entries(stagesData || {}).forEach(([key, stages]) => {
        stages.forEach((stage) => {
          stageTypeMap[stage.stageId] = stage.stageType;
        });
      });

      setPipelineData(data);
      buildBoardFromPipeline(data, stageTypeMap);
    } catch (err) {
      console.error("Failed to fetch pipeline leads:", err);
    } finally {
      setIsLoadingLeads(false);
    }
  };
  const buildBoardFromPipeline = (data, stageTypeMap = {}) => {
    const openLead = data?.open_lead || {};
    const closeLead = data?.close_lead || {};

    const openColumns = Object.entries(openLead).map(([stageName, leads]) => {
      const stageId = leads[0]?.stageId ?? null;
      const stageType = stageTypeMap[stageId] ?? "open_stage"; // ← from map

      return {
        id: `open_${stageName}`,
        name: stageName,
        tag: "open",
        stageId,
        stageType, // ✅ reliable
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
        })),
      };
    });

    const closeColumns = Object.entries(closeLead).map(([stageName, leads]) => {
      const stageId = leads[0]?.stageId ?? null;
      const stageType = stageTypeMap[stageId] ?? "close_stage"; // ← from map

      return {
        id: `close_${stageName}`,
        name: stageName,
        tag: "close",
        stageId,
        stageType, // ✅ reliable
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
        })),
      };
    });

    setBoardColumns([...openColumns, ...closeColumns]);

    // flatten for list view
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
    }));

    setTableData(allLeads);
  };
  const handleOpenDrawer = async (lead) => {
    try {
      const response = await GetLeadByID(lead.leadId);
      const fullLeadData = response?.data?.data?.[0] || lead;
      setDrawerLead(fullLeadData);
      setDrawerFollowUps(fullLeadData.followUpDetails || []);
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
    console.log("🔍 Full lead object keys:", Object.keys(lead));
    console.log("🔍 Full lead object:", JSON.stringify(lead, null, 2));
    setMoveLeadPayload({ lead, fromColumn, toColumn, pendingColumns });
    setIsMoveModalOpen(true);
  };
  // ✅ Fix - remove the redundant toColumn.tag
  const handleConfirmMove = async (formPayload) => {
    setBoardColumns(moveLeadPayload.pendingColumns);

    const lead = moveLeadPayload.lead;
    const toColumn = moveLeadPayload.toColumn;

    const leadId = Number(lead.leadId);
    const stageId = Number(toColumn.stageId || lead.stageId);
    const stageType =
      toColumn.stageType ||
      (toColumn.tag === "open" ? "open_stage" : "close_stage");
    // ✅ derive from tag
    console.log("toColumn.stageType:", toColumn.stageType); // ✅ derive from tag

    const requestDto = formPayload.followUp?.date
      ? {
          clientRemarks: formPayload.remarks || "",
          employeeRemarks: "",
          followUpDate: formPayload.followUp.date,
          followUpStatus: "Open",
          followUpType: formPayload.followUp.type || "Call",
          id: 0,
          leadId: leadId,
          memberId: formPayload.assignedTo ? Number(formPayload.assignedTo) : 0,
        }
      : null; // ✅ whole object null if no followup

    try {
      await MoveLeadToStage(
        leadId,
        stageId,
        stageType, // ✅ "open_stage" or "close_stage"
        formPayload.remarks || "", // ✅ actual remarks here
        requestDto, // ✅ null or full object
      );

      if (activePipeline?.id) {
        fetchPipelineLeads(activePipeline.id);
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
  const filteredData = tableData.filter((item) => {
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
  useEffect(() => {
    const FetchManager = () => {
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
    };

    if (isAssignModalOpen) {
      FetchManager();
    }
  }, [isAssignModalOpen]);

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
    setSearchText("");

    if (activePipeline?.id) {
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
        text: "Please select a manager to assign the leads.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Assigning...",
        text: "Please wait while we assign the leads.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await assignMultipleLeadToMember(
        selectedRows,
        Number(selectedManager),
      );

      Swal.close();

      const apiData = response?.data || response;
      const isSuccess = apiData?.success === true;

      if (isSuccess) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `${selectedRows.length} lead(s) assigned successfully.`,
        });

        setIsAssignModalOpen(false);
        setSelectedManager("");
        setSelectedRows([]);

        if (selectedLeadStatus) {
          handleLeadStatusChange({ target: { value: selectedLeadStatus } });
        } else if (selectedLeadType) {
          handleLeadTypeChange({ target: { value: selectedLeadType } });
        } else if (activePipeline?.id) {
          fetchPipelineLeads(activePipeline.id);
        }
      } else {
        const errorMsg =
          apiData?.msg || apiData?.message || "Failed to assign leads";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
        });
      }
    } catch (error) {
      console.error("Error assigning leads:", error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to assign leads. Please try again.",
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
        followUpType: followUpData.followUpType || followUpData.followType,
        followUpStatus: followUpData.followUpStatus || "Open",
        followUpDate: followUpData.followupDate || followUpData.followUpDate,
        clientRemarks:
          followUpData.description || followUpData.clientRemarks || "",
        employeeRemarks: followUpData.employeeRemarks || "",
        memberId: followUpData.managerId || 0,
      };

      const existingFollowUps = (fullLeadData.followUpDetails || []).map(
        (fu) => ({
          id: fu.id ? Number(fu.id) : 0,
          leadId: selectedLeadForFollowUp.leadId,
          followUpType: fu.followUpType || fu.followType || "",
          followUpStatus: fu.followUpStatus || "Open",
          followUpDate: fu.followUpDate || fu.followupDate || "",
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

        if (selectedLeadStatus) {
          handleLeadStatusChange({ target: { value: selectedLeadStatus } });
        } else if (selectedLeadType) {
          handleLeadTypeChange({ target: { value: selectedLeadType } });
        } else if (activePipeline?.id) {
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
      };

      navigate("/super-leads/addlead", { state: { leadData: mappedData } });
    } catch (error) {
      console.error("Error fetching lead details:", error);
      Swal.close();
      Swal.fire("Error", "Failed to load lead data", "error");
    }
  };

  // Fetch Leads
  // const fetchLeads = () => {
  //   setIsLoadingLeads(true);

  //   // Check ALL localStorage keys
  //   console.log("All localStorage:", { ...localStorage });

  //   const mainId = localStorage.getItem("mainId");
  //   const userId = localStorage.getItem("userId");
  //   const id = localStorage.getItem("id");
  //   console.log("mainId:", mainId, "userId:", userId, "id:", id);

  //   GetAllleadmaster(mainId)
  //     .then((res) => {
  //       console.log("✅ API SUCCESS:", res);
  //       console.log("✅ data:", res?.data?.data);

  //       const response = res?.data?.data;
  //       if (response?.["All Leads"]?.length) {
  //         console.log("✅ Leads found:", response["All Leads"].length);
  //         const formatted = response["All Leads"].map((item, index) => ({
  //           ...item,
  //           sr_no: index + 1,
  //           leadId: item.id,
  //           leadAssign: item.leadAssignName || "-",
  //           productType: item.planName || "-",
  //           cityName: item.cityName || "-",
  //           createdAt: item.createdAt?.split("T")[0],
  //         }));
  //         console.log("✅ formatted[0]:", formatted[0]);
  //         setTableData(formatted);
  //         setBoardColumns(transformToBoardData(formatted));
  //         setStats({
  //           total: response["All Leads Count"] || 0,
  //           hot: response["Hot"] || 0,
  //           cold: response["Cold"] || 0,
  //           inquire: response["Inquire"] || 0,
  //           assigned: response["Lead Assigned"] || 0,
  //         });
  //       } else {
  //         console.log("❌ No leads in response, raw response:", response);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("❌ API ERROR:", error);
  //       console.log("❌ Error response:", error?.response?.data);
  //     })
  //     .finally(() => setIsLoadingLeads(false));
  // };
  useEffect(() => {
    const loadPipelines = async () => {
      try {
        const res = await GETallpipeline();
        const list = res?.data?.data || [];
        setPipelines(list);

        // Determine starting pipeline
        const startPipeline = location.state?.pipelineId
          ? list.find((p) => p.id === location.state.pipelineId)
          : list.find((p) => p.id === 1) || list[0];

        if (startPipeline) {
          setActivePipeline({ id: startPipeline.id, name: startPipeline.name });
          setSelectedPipelineId(String(startPipeline.id));
          fetchPipelineLeads(startPipeline.id);
        }
      } catch (err) {
        console.error("Failed to load pipelines:", err);
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

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Leads</p>
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
              <p className="text-gray-600 text-sm font-medium">Cold Leads</p>
              <p className="text-3xl font-semibold mt-1">{stats.cold}</p>
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
              <p className="text-gray-600 text-sm font-medium">Inquire Leads</p>
              <p className="text-3xl font-semibold mt-1">{stats.inquire}</p>
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
        {/* Add this just above the FILTER ROW */}
        {/* {activePipeline && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <i className="ki-filled ki-abstract-26 text-blue-600"></i>
            <span className="text-sm font-medium text-blue-800">
              Pipeline: <strong>{activePipeline.name}</strong>
            </span>
            <button
              onClick={() => {
                setActivePipeline(null);
                setPipelineData(null);
                fetchLeads(); // back to all leads
              }}
              className="ml-auto text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <i className="ki-filled ki-cross-circle"></i> Clear Pipeline
            </button>
          </div>
        )} */}
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

              {/* Lead Status Filter */}
              <select
                value={selectedLeadStatus}
                onChange={handleLeadStatusChange}
                className="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isFilterLoading}
              >
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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

              {/* Lead Type Filter */}

              {/* Clear Filters Button */}
              {(selectedLeadStatus || selectedLeadType || searchText) && (
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
          <div className="flex flex-wrap justify-between items-end gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              <Badge
                className="badge badge-outline badge-success text-xs"
                title="Total Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-2"></i>
                  <span className="flex flex-col">
                    <span>
                      Total: <strong>{stats.total}</strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;0/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-dark text-xs"
                title="Open Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-2"></i>
                  <span className="flex flex-col">
                    <span>
                      Open:{" "}
                      <strong>
                        {
                          filteredData.filter((l) => l.leadStatus === "Open")
                            .length
                        }
                      </strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;0/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-info text-xs"
                title="Confirmed Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-2"></i>
                  <span className="flex flex-col">
                    <span>
                      Confirmed:{" "}
                      <strong>
                        {
                          filteredData.filter(
                            (l) => l.leadStatus === "confirmed",
                          ).length
                        }
                      </strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;0/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-danger text-xs"
                title="Cancelled Leads"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-2"></i>
                  <span className="flex flex-col">
                    <span>
                      Cancelled:{" "}
                      <strong>
                        {
                          filteredData.filter((l) => l.leadStatus === "Cancel")
                            .length
                        }
                      </strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;0/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
            </div>

            {/* Scroll Buttons for Board View */}
          </div>
        )}

        {/* View Content */}
        <div className="w-full">
          {viewMode === 0 ? (
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
                  setColumns={setBoardColumns} // keep for internal DnD state
                  setDndActive={setDndActive}
                  onLeadDropped={handleLeadDropped} // ← NEW prop
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

        {/* Assign Lead Modal */}
        {isAssignModalOpen && (
          <AssignLeadModal
            isOpen={isAssignModalOpen}
            onClose={() => {
              setIsAssignModalOpen(false);
              setSelectedManager("");
            }}
            managers={managers}
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
            onSave={handleSaveAssignment}
            selectedCount={selectedRows.length}
          />
        )}
      </div>
    </Fragment>
  );
};

export default SuperLeads;
