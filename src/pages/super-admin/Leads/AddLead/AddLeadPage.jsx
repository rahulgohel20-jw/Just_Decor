import React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/container";
import { FormattedMessage, useIntl } from "react-intl";
import FollowUpModal from "../../../../partials/modals/add-followup-lead/FollowUpModal";
import { Select, Input, Button } from "antd";
import  { Fragment } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { AddLead } from "@/services/apiServices"; // your API function
import Swal from "sweetalert2";


export default function AddLeadPage() {

 const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
 const [leadData, setLeadData] = useState({
   leadCode: "LJW250030",
   leadType: "",
   leadStatus: "",
   leadSource: "",
   leadRemark: "",
   leadAssign: "",
   productType: "",
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
   followUpDetails: [], // Array of followups
 });



const handleSaveLead = async () => {
  try {
    const response = await AddLead(leadData);
    if (response.success) {
      Swal.fire("Success", "Lead added successfully!", "success");
      // Optionally reset form
      setLeadData({
        leadCode: "",
        leadType: "",
        leadStatus: "",
        leadSource: "",
        leadRemark: "",
        leadAssign: "",
        productType: "",
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
    } else {
      Swal.fire("Error", response.msg || "Something went wrong!", "error");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Server error!", "error");
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
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 ">
                <h1 className="text-lg font-medium text-gray-800">
                  Manage and track your catering leads.
                </h1>
              </div>

              <div className="p-6 space-y-6 max-w-7xl">
                {/* Lead Information */}
                <Card className="shadow-sm rounded-lg border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-base font-semibold text-gray-900">
                        Lead Information
                      </h2>
                      <button className="text-gray-400 hover:text-gray-600">
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lead Code
                        </label>
                        <Input
                          placeholder="Lead Code"
                          value={leadData.leadCode}
                          onChange={(e) =>
                            setLeadData({
                              ...leadData,
                              leadCode: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lead Type
                        </label>
                        <Select
                          placeholder="-- Select Lead Type --"
                          value={leadData.leadType}
                          onChange={(value) =>
                            setLeadData({ ...leadData, leadType: value })
                          }
                        >
                          <Select.Option value="type1">Type 1</Select.Option>
                          <Select.Option value="type2">Type 2</Select.Option>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lead Status
                        </label>
                        <Select
                          placeholder="-- Select Lead Status --"
                          className="w-full"
                        />
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
                          value={leadData.leadAssign}
                          onChange={(value) =>
                            setLeadData({ ...leadData, leadAssign: value })
                          }
                        >
                          <Select.Option value="employee1">
                            Employee 1
                          </Select.Option>
                          <Select.Option value="employee2">
                            Employee 2
                          </Select.Option>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Type
                        </label>
                        <Select
                          placeholder="-- Select Product Type --"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="shadow-sm rounded-lg border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-base font-semibold text-gray-900">
                        Client Information
                      </h2>
                      <button className="text-gray-400 hover:text-gray-600">
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salutation
                        </label>
                        <Select
                          placeholder="-- Select Salutation --"
                          className="w-full"
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
                        />{" "}
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
                        />{" "}
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
                          City
                        </label>
                        <Select
                          placeholder="-- Select City --"
                          value={leadData.city}
                          onChange={(value) =>
                            setLeadData({ ...leadData, city: value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <Select
                          placeholder="-- Select State --"
                          value={leadData.state}
                          onChange={(value) =>
                            setLeadData({ ...leadData, state: value })
                          }
                        />
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
                      <button className="text-gray-400 hover:text-gray-600">
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
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                    <Input.TextArea
                      rows={4}
                      placeholder="Your message..."
                      className="w-full"
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
                      <div className="relative flex-1 max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          🔍
                        </span>
                        <Input
                          placeholder="Search Follow Up"
                          className="pl-10"
                        />
                      </div>

                      <Select defaultValue="assigned" className="w-40">
                        <Select.Option value="assigned">
                          Assigned to
                        </Select.Option>
                      </Select>

                      <Select defaultValue="today" className="w-32">
                        <Select.Option value="today">Today</Select.Option>
                      </Select>

                      {/* Buttons pushed to right end */}
                      <div className="flex gap-3 ml-auto">
                        <button className="text-gray-500 hover:text-gray-700 p-2">
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() => setIsFollowUpOpen(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 text-sm font-medium"
                        >
                          + Add Follow Up
                        </button>
                      </div>
                    </div>

                    {/* Follow Up Items */}
                    <div className="space-y-4">
                      {/* Follow Up Item 1 - Open */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason"
                            alt="Jason Tatum"
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  Jason Tatum
                                </h3>
                              </div>
                              <div className="text-right ml-4">
                                <div className="flex items-center gap-1 text-base font-medium">
                                  <span className="text-gray-500 text-sm">
                                    Type:
                                  </span>
                                  <span className="text-gray-900 text-sm">
                                    Call
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 text-sm font-medium mt-0.5">
                                  <span className="text-gray-500">
                                    Reminder:
                                  </span>
                                  <span className="text-gray-900">
                                    2023-10-01 05:45 PM
                                  </span>
                                </div>
                              </div>
                              <Select
                                placeholder="-- Select Lead Type --"
                                className="w-[200px] placeholder-black text-black"
                              >
                                <Option value="type1">open</Option>
                                <Option value="type2">close</Option>
                                <Option value="type3">Type 3</Option>
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
                                <span className="text-sm">Jason Tatum</span>
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
                                  jasontatum21@gmail.com
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
                                <span className="text-sm">9087076588</span>
                              </div>
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

                                <button className="text-yellow-500 hover:text-yellow-600 p-1.5 rounded hover:bg-yellow-50">
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50">
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
                    </div>
                  </CardContent>
                </Card>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pb-6">
                  <button className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
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
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Container>
          <FollowUpModal
            isOpen={isFollowUpOpen}
            onClose={() => setIsFollowUpOpen(false)}
            onSave={() => {
              console.log("Saved");
              setIsFollowUpOpen(false);
            }}
          />
        </Fragment>
      );
}
