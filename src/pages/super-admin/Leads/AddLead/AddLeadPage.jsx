import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/container";
import { FormattedMessage } from "react-intl";
import FollowUpModal from "../../../../partials/modals/add-followup-lead/FollowUpModal";
import { Select, Input } from "antd";
import { Fragment } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import { EyeIcon } from "lucide-react";

import dayjs from "dayjs";
const { Option } = Select;

import {
  AddLead,
  fetchStatesByCountry,
  fetchCitiesByState,
  GetLeadCode,
  Fetchmanager,
  GetAllPlans,
  UpdateleadbyID,
  GetFilteredFollowUps,
} from "@/services/apiServices";
import Swal from "sweetalert2";

export default function AddLeadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.leadData;
  const isEditMode = !!editData;

  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [managers, setManagers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [viewingFollowUp, setViewingFollowUp] = useState(null);
  const [selectedCreatedAt, setSelectedCreatedAt] = useState("");
  const [selectedGetLead, setSelectedGetLead] = useState("");

  const [customRangeCreatedAt, setCustomRangeCreatedAt] = useState({
    start: "",
    end: "",
  });
  const [customRangeGetLead, setCustomRangeGetLead] = useState({
    start: "",
    end: "",
  });

  const [totalLeads, setTotalLeads] = useState(0);

  const [leadData, setLeadData] = useState({
    id: 0,
    leadCode: "",
    leadType: "",
    leadStatus: "",
    leadSource: "",
    leadRemark: "",
    leadAssign: "",
    leadAssignName: "",
    selectPrefix: "",
    clientName: "",
    emailId: "",
    contactNumber: "",
    address: "",
    pinCode: "",
    city: "",
    cityName: "",
    state: "",
    stateName: "",
    overallRemark: "",
    plan: "",
    planName: "",
    followUpDetails: [],
  });

  const getDisplayNames = () => {
    const stateName =
      leadData.stateName ||
      states.find((s) => s.id === leadData.state)?.name ||
      "";
    const cityName =
      leadData.cityName ||
      cities.find((c) => c.id === leadData.city)?.name ||
      "";
    const managerName =
      leadData.leadAssignName ||
      managers.find((m) => m.value === leadData.leadAssign)?.label ||
      "";
    const planName =
      leadData.planName ||
      plans.find((p) => p.value === leadData.plan)?.label ||
      "";

    return { stateName, cityName, managerName, planName };
  };

  const fetchCreatedAtData = async (value) => {
    try {
      let start = null;
      let end = null;

      if (value === "1") {
        start = dayjs().format("DD/MM/YYYY");
      } else if (value === "2") {
        start = dayjs().format("DD/MM/YYYY");
        end = dayjs().add(1, "month").format("DD/MM/YYYY");
      } else if (value === "4") {
        start = dayjs().subtract(1, "month").format("DD/MM/YYYY");
        end = dayjs().format("DD/MM/YYYY");
      } else if (value === "3") {
        start = dayjs(customRangeCreatedAt.start).format("DD/MM/YYYY");
        end = dayjs(customRangeCreatedAt.end).format("DD/MM/YYYY");
      }

      const payload = {
        startDate: start,
        endDate: end,
        isCreated: false, // ✅ followUpDate filter
        leadId: leadData.id || null, // optional
      };

      const res = await GetFilteredFollowUps(payload);

      setFollowUps(res?.data?.data || []);
      setTotalLeads(res?.data?.data?.length || 0);
    } catch (err) {
      console.error(err);
      setFollowUps([]);
      setTotalLeads(0);
    }
  };

  const fetchGetLeadData = async (value) => {
    try {
      let start = null;
      let end = null;

      if (value === "1") {
        // Today
        start = dayjs().format("DD/MM/YYYY");
        end = dayjs().format("DD/MM/YYYY");
      } else if (value === "2") {
        // Next 1 Month
        start = dayjs().format("DD/MM/YYYY");
        end = dayjs().add(1, "month").format("DD/MM/YYYY");
      } else if (value === "4") {
        // ✅ Last Month (FIX)
        start = dayjs().subtract(1, "month").format("DD/MM/YYYY");
        end = dayjs().format("DD/MM/YYYY");
      } else if (value === "3") {
        // Custom
        start = dayjs(customRangeGetLead.start).format("DD/MM/YYYY");
        end = dayjs(customRangeGetLead.end).format("DD/MM/YYYY");
      }

      const payload = {
        startDate: start,
        endDate: end,
        isCreated: true, // 🔥 lead.createdAt
        leadId: leadData.id || null,
      };

      const res = await GetFilteredFollowUps(payload);

      setFollowUps(res?.data?.data || []);
      setTotalLeads(res?.data?.data?.length || 0);
    } catch (err) {
      console.error("Get Lead error:", err);
      setFollowUps([]);
      setTotalLeads(0);
    }
  };

  useEffect(() => {
    if (isEditMode && editData && managers.length > 0) {
      setLeadData((prev) => ({
        ...prev,
        leadAssign: editData.leadAssignId || editData.leadAssign || undefined,
      }));
    }
  }, [managers, isEditMode, editData]);

  useEffect(() => {
    if (isEditMode && editData && plans.length > 0) {
      setLeadData((prev) => ({
        ...prev,
        plan: editData.planId || editData.productType || undefined,
      }));
    }
  }, [plans, isEditMode, editData]);

  useEffect(() => {
    if (isEditMode && editData) {
      const stateIdToUse = editData.stateId || editData.state;
      if (stateIdToUse) {
        handleStateChange(stateIdToUse);
      }
    }
  }, [isEditMode, editData]);

  useEffect(() => {
    if (isEditMode && editData && cities.length > 0) {
      setLeadData((prev) => ({
        ...prev,
        city: editData.cityId || editData.city || undefined,
      }));
    }
  }, [cities, isEditMode, editData]);

  useEffect(() => {
    if (isEditMode && editData) {
      setLeadData({
        id: editData.id || 0,
        leadCode: editData.leadCode || "",
        leadType: editData.leadType || "",
        leadStatus: editData.leadStatus || "",
        leadSource: editData.leadSource || "",
        leadRemark: editData.leadRemark || "",
        leadAssign: editData.leadAssignId || editData.leadAssign || 0,
        leadAssignName: editData.leadAssignName || "",
        selectPrefix: editData.selectPrefix || "",
        clientName: editData.clientName || "",
        emailId: editData.emailId || "",
        contactNumber: editData.contactNumber || "",
        address: editData.address || "",
        pinCode: editData.pinCode || "",
        city: editData.cityId || editData.city || 0,
        cityName: editData.cityName || "",
        state: editData.stateId || editData.state || 0,
        stateName: editData.stateName || "",
        plan: editData.planId || editData.productType || 0,
        planName: editData.planName || "",
        overallRemark: editData.overallRemark || "",
        followUpDetails: editData.followUpDetails || [],
      });

      if (editData.followUpDetails && editData.followUpDetails.length > 0) {
        const normalized = editData.followUpDetails.map((fu) => ({
          id: fu.id || 0,
          followUpType: fu.followUpType || fu.followType || "",
          followUpStatus: fu.followUpStatus || "Open",
          followUpDate: fu.followUpDate || "",
          clientRemarks: fu.clientRemarks || "",
          employeeRemarks: fu.employeeRemarks || "",
        }));

        setFollowUps(normalized);
      }
    } else {
      const loadLeadCode = async () => {
        try {
          const res = await GetLeadCode();
          if (res?.data?.data) {
            const leadCode = String(res.data.data).trim();
            setLeadData((prev) => ({ ...prev, leadCode }));
          }
        } catch (error) {
          console.error("Failed to fetch Lead Code:", error);
        }
      };
      loadLeadCode();
    }
  }, [isEditMode, editData]);

  useEffect(() => {
    fetchPlans();
    FetchManager();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await GetAllPlans();
      const planArray = res?.data?.data?.["Plan Details"] || [];
      const planList = planArray.map((plan) => ({
        label: plan.name,
        value: plan.id,
      }));
      setPlans(planList);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  };

  useEffect(() => {
    const loadStates = async () => {
      try {
        const stateRes = await fetchStatesByCountry(1);
        const stateArray = stateRes?.data?.data?.["state Details"];
        if (Array.isArray(stateArray)) {
          setStates(stateArray);
        } else {
          setStates([]);
        }
      } catch (err) {
        console.error("Failed to load states:", err);
        setStates([]);
      }
    };
    loadStates();
  }, []);

  const handleStateChange = async (stateId) => {
    const numericStateId = Number(stateId);
    setLeadData((prev) => ({ ...prev, state: numericStateId }));

    try {
      const cityRes = await fetchCitiesByState(numericStateId);
      const cityArray = cityRes?.data?.data?.["City Details"] || [];

      if (Array.isArray(cityArray)) {
        setCities(cityArray);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error("Failed to load cities:", err);
      setCities([]);
    }
  };

  const handleDelete = (index) => {
    setFollowUps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveFollowUp = (followUp) => {
    const normalized = {
      id: followUp.id || 0,
      followUpType: followUp.followType || followUp.followUpType || "",
      followUpStatus: followUp.followUpStatus || "Open",
      followUpDate: followUp.followupDate || followUp.followUpDate || "",
      clientRemarks: followUp.clientRemarks || "",
      employeeRemarks: followUp.employeeRemarks || "",
    };

    setFollowUps((prev) => [...prev, normalized]);
  };

  const handleSaveLead = async () => {
    try {
      const finalLeadId = isEditMode ? Number(leadData.id) : 0;

      const payload = {
        address: leadData.address || "",
        cityId: leadData.city ? Number(leadData.city) : 0,
        clientName: leadData.clientName || "",
        contactNumber: leadData.contactNumber || "",
        emailId: leadData.emailId || "",
        leadAssignId: leadData.leadAssign ? Number(leadData.leadAssign) : 0,
        leadCode: leadData.leadCode || "",
        leadRemark: leadData.leadRemark || "",
        leadSource: leadData.leadSource || "",
        leadStatus: leadData.leadStatus || "",
        leadType: leadData.leadType || "",
        overallRemark: leadData.overallRemark || "",
        pinCode: leadData.pinCode || "",
        planId: leadData.plan ? Number(leadData.plan) : 0,
        selectPrefix: leadData.selectPrefix || "",
        stateId: leadData.state ? Number(leadData.state) : 0,

        followUpDetails: followUps.map((fu) => ({
          id: fu.id ? Number(fu.id) : 0,
          leadId: finalLeadId,
          followUpType: fu.followUpType || fu.followType || "",
          followUpStatus: fu.followUpStatus || "Open",
          followUpDate: fu.followUpDate || fu.followupDate || "",
          clientRemarks: fu.clientRemarks || "",
          employeeRemarks: fu.employeeRemarks || "",
        })),
      };

      let response;
      if (isEditMode) {
        response = await UpdateleadbyID(finalLeadId, payload);
        const apiData = response?.data || response;
        const isSuccess = apiData?.success === true;

        if (isSuccess) {
          const successMsg = apiData?.msg || "Lead updated successfully!";
          Swal.fire("Success", successMsg, "success");
          navigate("/super-leads");
        } else {
          const errorMsg = apiData?.msg || "Failed to update lead!";
          Swal.fire("Error", errorMsg, "error");
        }
      } else {
        response = await AddLead(payload);
        const apiData = response?.data || response;
        const isSuccess = apiData?.success === true;

        if (isSuccess) {
          const successMsg = apiData?.msg || "Lead added successfully!";
          Swal.fire("Success", successMsg, "success");
          navigate("/super-leads");
        } else {
          const errorMsg = apiData?.msg || "Something went wrong!";
          Swal.fire("Error", errorMsg, "error");
        }
      }
    } catch (error) {
      console.error("❌ SERVER ERROR:", error);
      Swal.fire("Error", "Server error!", "error");
    }
  };

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
                    defaultMessage={isEditMode ? "Edit Lead" : "Add Lead"}
                  />
                ),
              },
            ]}
          />
        </div>
        <div className="min-h-screen bg-gray-50">
          <div className="p-6 space-y-6 max-w-7xl">
            {/* Lead Information */}
            <Card className="shadow-sm rounded-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-gray-900">
                    Lead Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Code
                    </label>
                    <Input
                      placeholder="Lead Code"
                      value={leadData.leadCode}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Type
                    </label>
                    <Select
                      placeholder="-- Select Lead Type --"
                      value={leadData.leadType || undefined}
                      onChange={(value) =>
                        setLeadData({ ...leadData, leadType: value })
                      }
                      className="w-full"
                    >
                      <Select.Option value="Hot">Hot</Select.Option>
                      <Select.Option value="Cold">Cold</Select.Option>
                      <Select.Option value="Inquire">Inquire</Select.Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Status
                    </label>
                    <Select
                      placeholder="-- Select Lead Status --"
                      value={leadData.leadStatus || undefined}
                      onChange={(value) =>
                        setLeadData({ ...leadData, leadStatus: value })
                      }
                      className="w-full"
                    >
                      <Select.Option value="Pending">Pending</Select.Option>
                      <Select.Option value="Confirmed">Confirmed</Select.Option>
                      <Select.Option value="Cancel">Cancel</Select.Option>
                      <Select.Option value="Open">Open</Select.Option>
                      <Select.Option value="Closed">Closed</Select.Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Source
                    </label>
                    <Input
                      placeholder="e.g. Website, Referral"
                      value={leadData.leadSource}
                      onChange={(e) =>
                        setLeadData({
                          ...leadData,
                          leadSource: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Remarks
                    </label>
                    <Input
                      placeholder="Initial notes..."
                      value={leadData.leadRemark}
                      onChange={(e) =>
                        setLeadData({
                          ...leadData,
                          leadRemark: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Assign
                    </label>
                    <Select
                      placeholder="-- Assign Employee --"
                      value={leadData.leadAssign || undefined}
                      onChange={(value) =>
                        setLeadData({ ...leadData, leadAssign: value })
                      }
                      className="w-full"
                      options={managers}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type
                    </label>
                    <Select
                      placeholder="-- Select Product Type --"
                      className="w-full"
                      value={leadData.plan || undefined}
                      onChange={(value) =>
                        setLeadData({ ...leadData, plan: value })
                      }
                      options={plans}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Client Information */}
            <Card className="shadow-sm rounded-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-gray-900">
                    Client Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salutation
                    </label>
                    <Select
                      placeholder="-- Select Salutation --"
                      className="w-full"
                      value={leadData.selectPrefix || undefined}
                      onChange={(value) =>
                        setLeadData({ ...leadData, selectPrefix: value })
                      }
                      options={[
                        { label: "Mr", value: "Mr" },
                        { label: "Ms", value: "Ms" },
                        { label: "Miss", value: "Miss" },
                        { label: "Mrs", value: "Mrs" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name
                    </label>
                    <Input
                      placeholder="Enter Guest Name"
                      value={leadData.clientName}
                      onChange={(e) =>
                        setLeadData({
                          ...leadData,
                          clientName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email ID
                    </label>
                    <Input
                      placeholder="Enter Email"
                      value={leadData.emailId}
                      onChange={(e) =>
                        setLeadData({
                          ...leadData,
                          emailId: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <Input
                      placeholder="Enter Contact Number"
                      value={leadData.contactNumber}
                      onChange={(e) =>
                        setLeadData({
                          ...leadData,
                          contactNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <Input
                      placeholder="Enter Address"
                      value={leadData.address}
                      onChange={(e) =>
                        setLeadData({
                          ...leadData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pin Code
                    </label>
                    <Input
                      placeholder="Enter Pin Code"
                      value={leadData.pinCode}
                      onChange={(e) =>
                        setLeadData({
                          ...leadData,
                          pinCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <Select
                      placeholder="-- Select State --"
                      value={leadData.state || undefined}
                      onChange={handleStateChange}
                      className="w-full"
                    >
                      {states.map((state) => (
                        <Select.Option key={state.id} value={state.id}>
                          {state.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Select
                      placeholder="-- Select City --"
                      value={leadData.city || undefined}
                      onChange={(value) =>
                        setLeadData({ ...leadData, city: value })
                      }
                      className="w-full"
                    >
                      {cities.map((city) => (
                        <Select.Option key={city.id} value={city.id}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Overall Remarks */}
            <Card className="shadow-sm rounded-lg border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-gray-900">
                    Overall Remarks
                  </h2>
                </div>
                <Input.TextArea
                  rows={4}
                  placeholder="Your message..."
                  className="w-full"
                  value={leadData.overallRemark}
                  onChange={(e) =>
                    setLeadData({
                      ...leadData,
                      overallRemark: e.target.value,
                    })
                  }
                />
              </CardContent>
            </Card>
            {/* Follow Up Section */}
            <Card className="shadow-sm rounded-lg border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-6">
                  Follow Up
                </h2>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3 items-center mb-6">
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

                  {/* ✅ CREATED AT FILTER (isCreated: false, filters by followUpDate) */}
                  <div className="filItems relative">
                    <select
                      className="select pe-7.5"
                      value={selectedCreatedAt}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedCreatedAt(value);
                        // setSelectedGetLead(""); // Reset other filter
                        if (value && value !== "3") {
                          fetchCreatedAtData(value);
                        }
                      }}
                    >
                      <option value="">Created At</option>
                      <option value="1">Today</option>
                      <option value="2">Next 1 Month</option>
                      <option value="4">Last Month</option>
                      <option value="3">Custom Date</option>
                    </select>
                  </div>

                  {/* Custom Date Range for Created At */}
                  {selectedCreatedAt === "3" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="input"
                        value={customRangeCreatedAt.start}
                        onChange={(e) =>
                          setCustomRangeCreatedAt((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="date"
                        className="input"
                        value={customRangeCreatedAt.end}
                        onChange={(e) =>
                          setCustomRangeCreatedAt((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn btn-primary"
                        disabled={
                          !customRangeCreatedAt.start ||
                          !customRangeCreatedAt.end
                        }
                        onClick={() => fetchCreatedAtData("3")}
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {/* ✅ GET LEAD FILTER (isCreated: true) */}
                  <div className="filItems relative">
                    <select
                      className="select pe-7.5"
                      value={selectedGetLead}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedGetLead(value);
                        // setSelectedCreatedAt(""); // Reset other filter
                        if (value && value !== "3") {
                          fetchGetLeadData(value);
                        }
                      }}
                    >
                      <option value="">Get Lead</option>
                      <option value="1">Today</option>
                      <option value="2">Next 1 Month</option>
                      <option value="4">Last Month</option>
                      <option value="3">Custom Date</option>
                    </select>
                  </div>

                  {/* Custom Date Range for Get Lead */}
                  {selectedGetLead === "3" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="input"
                        value={customRangeGetLead.start}
                        onChange={(e) =>
                          setCustomRangeGetLead((prev) => ({
                            ...prev,
                            start: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="date"
                        className="input"
                        value={customRangeGetLead.end}
                        onChange={(e) =>
                          setCustomRangeGetLead((prev) => ({
                            ...prev,
                            end: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn btn-primary"
                        disabled={
                          !customRangeGetLead.start || !customRangeGetLead.end
                        }
                        onClick={() => fetchGetLeadData("3")}
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {/* Total Leads Count */}
                  {totalLeads > 0 && (
                    <span className="text-gray-600 text-sm font-medium">
                      Total: {totalLeads}
                    </span>
                  )}

                  {/* Buttons pushed to right end */}
                  <div className="flex gap-3 ml-auto">
                    <button
                      onClick={() => setIsFollowUpOpen(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 text-sm font-medium"
                    >
                      + Add Follow Up
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {followUps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-sm">
                      <img
                        src={toAbsoluteUrl("/media/illustrations/nofound.jpg")}
                        alt="No Follow-Up"
                        className="w-48 h-48 mb-4"
                      />
                      <span>No Follow-Up Found</span>
                    </div>
                  ) : (
                    followUps.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                              {leadData.clientName?.charAt(0)?.toUpperCase()}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {leadData.clientName}
                                </h3>
                              </div>

                              <div className="text-right ml-4">
                                <div className="flex items-center gap-1 text-base font-medium">
                                  <span className="text-gray-500 text-sm">
                                    Type:
                                  </span>
                                  <span className="text-gray-900 text-sm">
                                    {item.followUpType || "N/A"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 text-sm font-medium mt-0.5">
                                  <span className="text-gray-500">
                                    Reminder:
                                  </span>
                                  <span className="text-gray-900">
                                    {item.followUpDate || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <Select
                                value={item.followUpStatus}
                                className="w-[120px]"
                                optionLabelProp="label" // ✅ ensures selected value shows colored label
                                onChange={(value) => {
                                  setFollowUps((prev) =>
                                    prev.map((fu, i) =>
                                      i === index
                                        ? { ...fu, followUpStatus: value }
                                        : fu,
                                    ),
                                  );
                                }}
                              >
                                <Option
                                  value="Open"
                                  label={
                                    <span className="px-2 py-1 rounded text-white bg-green-500">
                                      Open
                                    </span>
                                  }
                                >
                                  <span className="px-2 py-1 rounded text-white bg-green-500">
                                    Open
                                  </span>
                                </Option>

                                <Option
                                  value="Closed"
                                  label={
                                    <span className="px-2 py-1 rounded text-white bg-red-500">
                                      Closed
                                    </span>
                                  }
                                >
                                  <span className="px-2 py-1 rounded text-white bg-red-500">
                                    Closed
                                  </span>
                                </Option>

                                <Option
                                  value="Pending"
                                  label={
                                    <span className="px-2 py-1 rounded text-white bg-yellow-500">
                                      Pending
                                    </span>
                                  }
                                >
                                  <span className="px-2 py-1 rounded text-white bg-yellow-500">
                                    Pending
                                  </span>
                                </Option>
                              </Select>
                            </div>

                            <hr className="my-3 border-gray-300" />

                            <div className="flex items-center gap-6 text-xs text-gray-600 flex-wrap">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                <span className="text-sm">
                                  {leadData.clientName}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-sm">
                                  {item.emailId ||
                                    leadData.emailId ||
                                    "No Email"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <span className="text-sm">
                                  {item.contactNumber ||
                                    leadData.contactNumber ||
                                    "No Contact"}
                                </span>
                              </div>

                              <div className="ml-auto flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setViewingFollowUp(item); // the specific follow-up
                                    setIsFollowUpOpen(true);
                                  }}
                                >
                                  <EyeIcon /> {/* your eye button */}
                                </button>

                                <button
                                  onClick={() => handleDelete(index)}
                                  className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pb-6">
              <button
                onClick={() => navigate("/super-leads")}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLead}
                className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </Container>
      <FollowUpModal
        isOpen={isFollowUpOpen}
        onClose={(val) => {
          setIsFollowUpOpen(val);
          setViewingFollowUp(null);
        }}
        onSave={handleSaveFollowUp}
        clientName={leadData.clientName}
        viewOnlyFollowUp={viewingFollowUp}
      />
    </Fragment>
  );
}
