import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/container";
import { FormattedMessage, useIntl } from "react-intl";
import FollowUpModal from "../../../../partials/modals/add-followup-lead/FollowUpModal";
import { Select, Input, Button } from "antd";
import { Fragment } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
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
  const location = useLocation(); // ADDED THIS
  const navigate = useNavigate(); // ADDED THIS
  const editData = location.state?.leadData;
  const isEditMode = !!editData;

  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [managers, setManagers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [totalLeads, setTotalLeads] = useState(0);

  const [leadData, setLeadData] = useState({
    id: 0,
    leadCode: "",
    leadType: "",
    leadStatus: "",
    leadSource: "",
    leadRemark: "",
    leadAssign: "",
    selectPrefix: "",
    clientName: "",
    emailId: "",
    contactNumber: "",
    address: "",
    pinCode: "",
    city: "",
    state: "",
    overallRemark: "",
    plan: "",
    followUpDetails: [],
  });

  const fetchRenewalData = async (value) => {
    try {
      let start = "";
      let end = "";

      if (value === "1") {
        const today = dayjs();
        start = today.format("DD/MM/YYYY");
        end = today.format("DD/MM/YYYY");
      } else if (value === "2") {
        const today = dayjs();
        start = today.format("DD/MM/YYYY");
        end = today.add(1, "month").format("DD/MM/YYYY");
      } else if (value === "3") {
        start = dayjs(customRange.start).format("DD/MM/YYYY");
        end = dayjs(customRange.end).format("DD/MM/YYYY");
      } else {
        start = null;
        end = null;
      }

      // Only include leadId if it exists
      const payload = {
        startDate: start,
        endDate: end,
        isCreated: true,
      };
      if (leadData.id && leadData.id > 0) {
        payload.leadId = leadData.id;
      }

      const res = await GetFilteredFollowUps(payload);

      if (res?.data?.data) {
        setFollowUps(res.data.data);
        setTotalLeads(res.data.data.length);
      } else {
        setFollowUps([]);
        setTotalLeads(0);
      }
    } catch (err) {
      console.error("Failed to fetch follow-ups:", err);
      setFollowUps([]);
      setTotalLeads(0);
    }
  };

  useEffect(() => {
    if (isEditMode && editData) {
      console.log("Edit Mode - Received Data:", editData);

      setLeadData({
        id: editData.id || 0,
        leadCode: editData.leadCode || "",
        leadType: editData.leadType || "",
        leadStatus: editData.leadStatus || "",
        leadSource: editData.leadSource || "",
        leadRemark: editData.leadRemark || "",

        // FIXED KEYS
        leadAssign: editData.leadAssignId || 0,
        selectPrefix: editData.selectPrefix || "",
        clientName: editData.clientName || "",
        emailId: editData.emailId || "",
        contactNumber: editData.contactNumber || "",
        address: editData.address || "",
        pinCode: editData.pinCode || "",

        // FIXED KEYS from backend
        city: editData.cityId || 0,
        state: editData.stateId || 0,
        plan: editData.planId || 0,

        overallRemark: editData.overallRemark || "",
        followUpDetails: editData.followUpDetails || [],
      });

      // Load cities for the selected state
      if (editData.state) {
        handleStateChange(editData.state);
      }

      // Set follow-ups if they exist
      if (editData.followUpDetails && editData.followUpDetails.length > 0) {
        const normalized = editData.followUpDetails.map((item) => ({
          id: item.id,
          followUpType: item.followUpType || item.followType || "",
          followUpDate: item.followUpDate || item.followupDate || "",
          clientRemarks: item.clientRemarks || "",
          employeeRemarks: item.employeeRemarks || "",
        }));

        console.log("NORMALIZED SAVED FOLLOW-UPS:", normalized);
        setFollowUps(normalized);
      }
    } else {
      // ADD MODE: Load new lead code
      const loadLeadCode = async () => {
        try {
          const res = await GetLeadCode();
          console.log("Lead Code from backend:", res);

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
    console.log("RAW NEW FOLLOW-UP FROM MODAL:", followUp);

    const normalized = {
      id: followUp.id || 0,
      followUpType: followUp.followType || followUp.followUpType || "",
      followUpDate: followUp.followupDate || followUp.followUpDate || "",
      clientRemarks: followUp.clientRemarks || "",
      employeeRemarks: followUp.employeeRemarks || "",
    };

    console.log("NORMALIZED FOLLOW-UP:", normalized);

    setFollowUps((prev) => [...prev, normalized]);
  };

  const handleSaveLead = async () => {
    try {
      console.log("🔥 Saving Lead — Current leadData:", leadData);
      console.log("🔥 followUps:", followUps);

      // IMPORTANT FIX — ensure leadData.id exists
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

        // 🟩 FIXED FOLLOW UP PAYLOAD
        followUpDetails: followUps.map((fu) => ({
          id: fu.id ? Number(fu.id) : 0,

          // FIXED — Backend requires this EXACT key
          leadId: finalLeadId,

          followUpType: fu.followUpType || fu.followType || "",

          followUpDate: fu.followUpDate || fu.followupDate || "",
          clientRemarks: fu.clientRemarks || "",
          employeeRemarks: fu.employeeRemarks || "",
        })),
      };

      console.log("📦 FINAL PAYLOAD SENT TO API:", payload);

      let response;
      if (isEditMode) {
        // -------- UPDATE API --------
        response = await UpdateleadbyID(finalLeadId, payload);

        if (response?.success || response?.status === "success") {
          Swal.fire("Success", "Lead updated successfully!", "success");
          navigate("/super-leads");
        } else {
          Swal.fire("Error", response.msg || "Failed to update lead!", "error");
        }
      } else {
        // -------- ADD API --------
        response = await AddLead(payload);

        if (response?.success || response?.status === "success") {
          Swal.fire("Success", "Lead added successfully!", "success");
          navigate("/super-leads");
        } else {
          Swal.fire("Error", response.msg || "Something went wrong!", "error");
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
                    <div className="text-center py-6 text-gray-500 text-sm">
                      No Follow-Up Found
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
                            {/* HEADER */}
                            <div className="flex items-start justify-between mb-3">
                              {/* LEFT SIDE */}
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {leadData.clientName}
                                </h3>
                              </div>

                              {/* FOLLOW-UP TYPE + DATE */}
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
                                placeholder="-- Select Lead  Status --"
                                className="w-[200px] placeholder-black text-black"
                              >
                                <Option value="type1">open</Option>
                                <Option value="type2">close</Option>
                                <Option value="type3"> Pending</Option>
                              </Select>
                            </div>

                            <hr className="my-3 border-gray-300" />

                            {/* BOTTOM DETAILS */}
                            <div className="flex items-center gap-6 text-xs text-gray-600 flex-wrap">
                              {/* Name */}
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

                              {/* Email */}
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

                              {/* Phone */}
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

                              {/* DELETE & MORE */}
                              <div className="ml-auto flex items-center gap-2">
                                <button className="text-blue-500 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50">
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
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                  </svg>
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
        onClose={setIsFollowUpOpen}
        onSave={handleSaveFollowUp}
        clientName={leadData.clientName}
      />
    </Fragment>
  );
}
