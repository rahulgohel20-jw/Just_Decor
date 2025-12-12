import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constact";
import { useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import dayjs from "dayjs";
import ViewLeadDetailModal from "../../../partials/modals/view-lead-detail/ViewLeadDetailModal";
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

      console.log("=== API RESPONSE ===", response);

      const dataArray = response?.data?.data;
      if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
        console.error("No lead data returned from API");
        Swal.fire("Error", "Failed to fetch lead details", "error");
        return;
      }

      const fullLeadData = dataArray[0];
      console.log("=== FULL LEAD DATA ===", fullLeadData);

      const mappedFollowUps = (fullLeadData.followUpDetails || []).map(
        (fu) => ({
          id: fu.id,
          followUpType: fu.followUpType,
          followUpDate: fu.followUpDate,
          // clientRemarks: fu.clientRemarks || "",
          // employeeRemarks: fu.employeeRemarks || "",
          // emailId: fullLeadData.emailId || "",
          // contactNumber: fullLeadData.contactNumber || "",
        })
      );

      const mappedData = {
        id: fullLeadData.id, // ✅ required for update
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

      console.log("=== MAPPED DATA TO NAVIGATE ===", mappedData);

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
            leadAssign: item.leadAssignId,
            productType: item.productType,
            clientName: item.clientName,
            contactNumber: item.contactNumber,
            city: item.cityId,
            createdAt: item.createdAt?.split("T")[0],
          }));

          setTableData(formatted);

          // ---- SET STATS ----
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
            fetchLeads(); // refresh table
          })
          .catch((err) => {
            console.error("Error deleting lead:", err);
            Swal.fire("Error!", "Failed to delete lead.", "error");
          });
      }
    });
  };

  // Fetch full lead details for viewing
  const handleViewLead = async (lead) => {
    try {
      // Show loading
      Swal.fire({
        title: "Loading...",
        text: "Fetching lead details",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Fetch lead details
      const response = await GetLeadByID(lead.leadId);
      Swal.close();

      const dataArray = response?.data?.data;
      let fullLeadData = {};

      if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
        fullLeadData = dataArray[0];
      } else {
        console.warn("No lead data found, opening modal empty");
      }

      // Set modal data (empty if nothing found)
      setSelectedLead(fullLeadData);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching lead for view:", error);
      Swal.close();
      // open modal even if fetch fails
      setSelectedLead({});
      setIsViewModalOpen(true);
    }
  };

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

        {/* Search + Add */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          ></div>
        </div>
        {/* --- TOP STATS CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            {/* Left Text */}
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Leads</p>
              <p className="text-3xl font-semibold mt-1">{stats.total}</p>
            </div>

            {/* Right Icon */}
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead1.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            {/* Left Text */}
            <div>
              <p className="text-gray-600 text-sm font-medium">Hot Leads</p>
              <p className="text-3xl font-semibold mt-1">{stats.hot}</p>
            </div>

            {/* Right Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead2.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            {/* Left Text */}
            <div>
              <p className="text-gray-600 text-sm font-medium">
                {" "}
                Pending Leads
              </p>
              <p className="text-3xl font-semibold mt-1">{stats.cold}</p>
            </div>

            {/* Right Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#FEF9C3] flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead3.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border flex items-start justify-between">
            {/* Left Text */}
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Assigned Leads
              </p>
              <p className="text-3xl font-semibold mt-1">{stats.assigned}</p>
            </div>

            {/* Right Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
              <img
                src={toAbsoluteUrl("/media/icons/lead4.png")}
                alt="icon"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>
        </div>
        {/* --- FILTER ROW --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="filItems relative">
                <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                <input
                  className="input pl-8"
                  placeholder="Search invoice"
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <div className="filItems relative">
                <select
                  className="select pe-7.5"
                  value={selectedMonth}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedMonth(value);
                    fetchRenewalData(value); // call fetch for all options
                  }}
                >
                  <option value="">Get Lead</option>
                  <option value="1">Today</option> {/* ✅ Added */}
                  <option value="2">Next 1 Month</option>
                  <option value="3">Custom Date</option>
                </select>

                {totalLeads > 0 && (
                  <span className="text-gray-600 text-sm">
                    Total: {totalLeads}
                  </span>
                )}
              </div>
              {selectedMonth === "3" && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="input"
                    value={customRange.start}
                    onChange={(e) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="date"
                    className="input"
                    value={customRange.end}
                    onChange={(e) =>
                      setCustomRange((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="btn btn-primary"
                    disabled={!customRange.start || !customRange.end}
                    onClick={() => fetchRenewalData("3")}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/super-leads/addlead")}
              className="bg-primary text-white px-4 py-2 rounded-md shadow flex items-center gap-2"
            >
              <i className="ki-filled ki-plus"></i> Create Lead
            </button>
          </div>
        </div>
        {isViewModalOpen && (
          <ViewLeadDetailModal
            open={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            data={selectedLead}
          />
        )}

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <TableComponent
            columns={columns(
              handleEditLead,
              handleDeleteLead,
              null,
              handleViewLead
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
