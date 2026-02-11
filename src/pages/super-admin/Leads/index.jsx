import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constact";
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import dayjs from "dayjs";
import ViewLeadDetailModal from "../../../partials/modals/view-lead-detail/ViewLeadDetailModal";
import FollowUpModal from "../../../partials/modals/follow-up-modal/FollowUpModal";
import {
  GetAllleadmaster,
  DeleteLeadbyID,
  GetLeadByID,
} from "@/services/apiServices";
import useStyle from "./style";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";

const SuperLeads = () => {
  const classes = useStyle();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedcontactType, setSelectedcontactType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [totalLeads, setTotalLeads] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  // ✅ ADD: Follow-up modal state
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    cold: 0,
    inquire: 0,
    assigned: 0,
  });

  const intl = useIntl();

  let Id = localStorage.getItem("userId");
  const lang = localStorage.getItem("lang") || "en";

  const getNameByLang = (cust) => {
    switch (lang) {
      case "hi":
        return cust.nameHindi || cust.nameEnglish || "-";
      case "gu":
        return cust.nameGujarati || cust.nameEnglish || "-";
      default:
        return cust.nameEnglish || "-";
    }
  };

  const filteredData = tableData.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.clientName?.toLowerCase().includes(search) ||
      item.leadCode?.toLowerCase().includes(search) ||
      item.leadType?.toLowerCase().includes(search) ||
      item.contactNumber?.toLowerCase().includes(search)
    );
  });

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

  // ✅ ADD: Handle Follow Up
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
        console.error("No lead data returned from API");
        Swal.fire("Error", "Failed to fetch lead details", "error");
        return;
      }

      const fullLeadData = dataArray[0];

      // Set the lead data for the follow-up modal
      setSelectedLeadForFollowUp({
        leadId: fullLeadData.id,
        clientName: fullLeadData.clientName,
        leadCode: fullLeadData.leadCode,
        contactNumber: fullLeadData.contactNumber,
        emailId: fullLeadData.emailId,
      });

      setIsFollowUpOpen(true);
    } catch (error) {
      console.error("Error fetching lead for follow-up:", error);
      Swal.close();
      Swal.fire("Error", "Failed to load lead data", "error");
    }
  };

  // ✅ ADD: Handle Save Follow Up
  const handleSaveFollowUp = (followUpData) => {
    console.log("Follow-up saved:", followUpData);
    // You can add API call here to save the follow-up
    Swal.fire("Success", "Follow-up added successfully!", "success");
    setIsFollowUpOpen(false);
  };

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
        console.error("No lead data returned from API");
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

  useEffect(() => {
    fetchLeads();
  }, []);

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
            fetchLeads();
          })
          .catch((err) => {
            console.error("Error deleting lead:", err);
            Swal.fire("Error!", "Failed to delete lead.", "error");
          });
      }
    });
  };

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
      } else {
        console.warn("No lead data found, opening modal empty");
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
      <Container>
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

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          ></div>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* ... existing stats cards ... */}
        </div>

        {/* FILTER ROW */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-5">
          {/* ... existing filter code ... */}
        </div>

        {/* Selected rows indicator */}
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-700">
              {selectedRows.length} lead(s) selected
              <button
                onClick={() => setSelectedRows([])}
                className="ml-3 text-blue-600 underline"
              >
                Clear selection
              </button>
            </p>
          </div>
        )}

        {/* View Lead Modal */}
        {isViewModalOpen && (
          <ViewLeadDetailModal
            open={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            data={selectedLead}
          />
        )}

        {/* ✅ ADD: Follow Up Modal */}
        {isFollowUpOpen && selectedLeadForFollowUp && (
          <FollowUpModal
            isOpen={isFollowUpOpen}
            onClose={() => {
              setIsFollowUpOpen(false);
              setSelectedLeadForFollowUp(null);
            }}
            onSave={handleSaveFollowUp}
            clientName={selectedLeadForFollowUp.clientName}
            leadData={selectedLeadForFollowUp}
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
              handleFollowUp, // ✅ ADD: Pass follow-up handler
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
