import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constact";
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import ViewLeadDetailModal from "../../../partials/modals/view-lead-detail/ViewLeadDetailModal";
import FollowUp from "../../../partials/modals/follow-up-modal/Followup";
import AssignLeadModal from "../../../partials/modals/follow-up-modal/Assignleadmodal";
import {
  GetAllleadmaster,
  DeleteLeadbyID,
  GetLeadByID,
  UpdateleadbyID,
  Fetchmanager,
  assignMultipleLeadToMember,
  getLeadsByLeadStatus,
  getleadbyleattype,
} from "@/services/apiServices";
import useStyle from "./style";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";

const SuperLeads = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const intl = useIntl();

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

  // ✅ Filter states
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("");
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // ✅ Lead Status Options (for getLeadsByLeadStatus API)
  const LEAD_STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "confirmed", value: "confirmed" },
    { label: "Cancel", value: "Cancel" },
    { label: "Open", value: "Open" },
    { label: "Closed", value: "Closed" },
  ];

  // ✅ Lead Type Options (for getleadbyleattype API)
  const LEAD_TYPE_OPTIONS = [
    { label: "All Types", value: "" },
    { label: "Hot", value: "Hot" },
    { label: "Cold", value: "Cold" },
    { label: "Inquire", value: "Inquire" },
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

  // ✅ Filter data based on search only (filters handled by API)
  const filteredData = tableData.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.clientName?.toLowerCase().includes(search) ||
      item.leadCode?.toLowerCase().includes(search) ||
      item.leadType?.toLowerCase().includes(search) ||
      item.contactNumber?.toLowerCase().includes(search)
    );
  });

  // ✅ Fetch Managers when modal opens
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

  // ✅ Handle Lead Status Filter Change (API: getLeadsByLeadStatus)
  const handleLeadStatusChange = async (e) => {
    const selectedStatus = e.target.value;
    setSelectedLeadStatus(selectedStatus);

    if (!selectedStatus) {
      // If "All Status" is selected, fetch all leads
      fetchLeads();
      return;
    }

    try {
      setIsFilterLoading(true);
      const response = await getLeadsByLeadStatus(selectedStatus);

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
          createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
        }));

        setTableData(formatted);
      } else {
        setTableData([]);
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

  // ✅ Handle Lead Type Filter Change (API: getleadbyleattype)
  const handleLeadTypeChange = async (e) => {
    const selectedType = e.target.value;
    setSelectedLeadType(selectedType);

    if (!selectedType) {
      // If "All Types" is selected, fetch all leads
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
      } else {
        setTableData([]);
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

  // ✅ Clear All Filters
  const handleClearFilters = () => {
    setSelectedLeadStatus("");
    setSelectedLeadType("");
    setSearchText("");
    fetchLeads();
  };

  // ✅ Handle Assign Lead
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

  // ✅ Save Assigned Leads using PUT API with Query Parameters
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
      console.log("=== ASSIGNMENT DEBUG ===");
      console.log("selectedRows:", selectedRows);
      console.log("selectedManager:", selectedManager);

      Swal.fire({
        title: "Assigning...",
        text: "Please wait while we assign the leads.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Invalid Data",
          text: "No leads selected or invalid selection.",
        });
        return;
      }

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

        // Refresh based on active filter
        if (selectedLeadStatus) {
          handleLeadStatusChange({ target: { value: selectedLeadStatus } });
        } else if (selectedLeadType) {
          handleLeadTypeChange({ target: { value: selectedLeadType } });
        } else {
          fetchLeads();
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

  // ✅ Refresh Follow-ups
  const refreshFollowUps = async () => {
    if (!selectedLeadForFollowUp?.leadId) {
      return;
    }

    try {
      const response = await GetLeadByID(selectedLeadForFollowUp.leadId);
      const dataArray = response?.data?.data;
      console.log(response, "data");

      if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
        const fullLeadData = dataArray[0];
        setSelectedLeadForFollowUp({
          leadId: fullLeadData.id,
          clientName: fullLeadData.clientName,
          leadCode: fullLeadData.leadCode,
          contactNumber: fullLeadData.contactNumber,
          emailId: fullLeadData.emailId,
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

  // ✅ Follow-Up Handler
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
        followUps: fullLeadData.followUpDetails || [],
      });

      setIsFollowUpOpen(true);
    } catch (error) {
      console.error("Error fetching lead for follow-up:", error);
      Swal.close();
      Swal.fire("Error", "Failed to load lead data", "error");
    }
  };

  // ✅ Save Follow-Up Handler
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

        // Refresh based on active filter
        if (selectedLeadStatus) {
          handleLeadStatusChange({ target: { value: selectedLeadStatus } });
        } else if (selectedLeadType) {
          handleLeadTypeChange({ target: { value: selectedLeadType } });
        } else {
          fetchLeads();
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
  const fetchLeads = () => {
    GetAllleadmaster()
      .then((res) => {
        const response = res?.data?.data;

        if (response?.["All Leads"]?.length) {
          const formatted = response["All Leads"].map((item, index) => ({
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

          setStats({
            total: response["All Leads Count"] || 0,
            hot: response["Hot"] || 0,
            cold: response["Cold"] || 0,
            inquire: response["Inquire"] || 0,
            assigned: response["Lead Assigned"] || 0,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
      });
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

            // Refresh based on active filter
            if (selectedLeadStatus) {
              handleLeadStatusChange({ target: { value: selectedLeadStatus } });
            } else if (selectedLeadType) {
              handleLeadTypeChange({ target: { value: selectedLeadType } });
            } else {
              fetchLeads();
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

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="USER.MASTER.CONTACT_TYPE_MASTER"
                    defaultMessage="Leads "
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

        {/* ✅ IMPROVED FILTER ROW WITH BOTH API FILTERS */}
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

              {/* Lead Status Filter (API: getLeadsByLeadStatus) */}
              <select
                value={selectedLeadStatus}
                onChange={handleLeadStatusChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isFilterLoading}
              >
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Lead Type Filter (API: getleadbyleattype) */}
              <select
                value={selectedLeadType}
                onChange={handleLeadTypeChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isFilterLoading}
              >
                {LEAD_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

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

            {/* Right Side - Action Buttons */}
            <div className="flex gap-3">
              {selectedRows.length > 0 && (
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

          {/* Active Filters Display */}
        </div>

        {/* View Lead Modal */}
        {isViewModalOpen && (
          <ViewLeadDetailModal
            open={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            data={selectedLead}
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

        {/* Table */}
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
            )}
            data={filteredData}
            paginationSize={10}
          />
        </div>
      </Container>
    </Fragment>
  );
};

export default SuperLeads;
