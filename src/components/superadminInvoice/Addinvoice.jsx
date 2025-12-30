import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import {
  DatePicker,
  Input,
  Tooltip,
  Button,
  Table,
  Empty,
  message,
  Select,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import InvoiceFooter from "@/components/InvoiceTable/InvoiceFooter";
import dayjs from "dayjs";
import {
  SuperAdminAddInvoice,
  getAllByRoleId,
  GetAllMemberByUserId,
} from "../../services/apiServices";

const { TextArea } = Input;

const Addinvoice = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Editing states
  const [editingBilling, setEditingBilling] = useState(false);
  const [editingShipping, setEditingShipping] = useState(false);
  const [editingBillingName, setEditingBillingName] = useState(false);
  const [editingGST, setEditingGST] = useState(false);
  const [editingPartyName, setEditingPartyName] = useState(false);
  const [editingPlanName, setEditingPlanName] = useState(false);
  const [partyId, setPartyId] = useState(null);

  // Form data states
  const [partyName, setPartyName] = useState("");
  const [partyList, setPartyList] = useState([]);
  const [loadingParties, setLoadingParties] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planStartDate, setPlanStartDate] = useState("");
  const [planEndDate, setPlanEndDate] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingName, setBillingName] = useState("");
  const [gstNumber, setGSTNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Footer data state
  const [footerData, setFooterData] = useState({
    notes: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
    discount: 0,
    roundOff: 0,
    subTotal: 0,
    totalAmount: 0,
    cgstAmnt: 0,
    sgstAmnt: 0,
    igstAmnt: 0,
    grandTotal: 0,
  });

  // Temporary edit states
  const [tempBillingAddress, setTempBillingAddress] = useState(billingAddress);
  const [tempShippingAddress, setTempShippingAddress] =
    useState(shippingAddress);
  const [tempBillingName, setTempBillingName] = useState(billingName);
  const [tempGSTNumber, setTempGSTNumber] = useState(gstNumber);
  const [tempPartyName, setTempPartyName] = useState(partyName);
  const [tempPlanName, setTempPlanName] = useState(planName);

  // Fetch parties on component mount
  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      setLoadingParties(true);

      // Example: if you have logged-in user ID
      const userId = 2;
      const response = await getAllByRoleId(userId);

      const userDetails = response?.data?.data?.["User Details"];

      if (Array.isArray(userDetails)) {
        const formattedParties = userDetails.map((member) => ({
          value: member.id || member._id,
          label:
            member.name ||
            member.partyName ||
            member.companyName ||
            `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
            "Unknown",
          planName: member.userPlan?.planName || "",
          planStartDate: member.userPlan?.planStartDate || "",
          planEndDate: member.userPlan?.planEndDate || "",
          email: member.email,
        }));

        setPartyList(formattedParties);
      } else {
        setPartyList([]);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
      message.error("Failed to load parties");
      setPartyList([]);
    } finally {
      setLoadingParties(false);
    }
  };

  // Fetch party details by ID
  const fetchPartyDetails = async (partyId) => {
    try {
      setLoading(true);
      const response = await GetAllMemberByUserId(partyId);

      if (response?.data?.success) {
        const userDetails = response.data.data?.["User Details"];

        if (Array.isArray(userDetails) && userDetails.length > 0) {
          const partyData = userDetails[0]; // Get first user from array

          // Set party name
          const fullName =
            `${partyData.firstName || ""} ${partyData.lastName || ""}`.trim();
          if (fullName) {
            setPartyName(fullName);
          }

          // Set billing and shipping addresses from userBasicDetails
          if (partyData.userBasicDetails?.address) {
            setBillingAddress(partyData.userBasicDetails.address);
            setTempBillingAddress(partyData.userBasicDetails.address);
            setShippingAddress(partyData.userBasicDetails.address);
            setTempShippingAddress(partyData.userBasicDetails.address);
          }

          // Set billing name (company name or full name)
          const billingNameValue =
            partyData.userBasicDetails?.companyName || fullName;
          if (billingNameValue) {
            setBillingName(billingNameValue);
            setTempBillingName(billingNameValue);
          }

          // Set GST number (if you have it in your API response - add field name if available)
          // Currently not in the response, so leaving empty

          // Set plan information if available
          if (partyData.userPlan) {
            const userPlan = partyData.userPlan;
            const plan = userPlan.plan;

            if (plan?.name) {
              setPlanName(plan.name);
              setTempPlanName(plan.name);
            }

            if (userPlan.startDate) {
              // Parse date like "10/11/2025 04:58 pm"
              const startDateParsed = dayjs(
                userPlan.startDate,
                "DD/MM/YYYY hh:mm a"
              );
              setPlanStartDate(startDateParsed.format("DD/MM/YYYY"));
            }

            if (userPlan.endDate) {
              // Parse date like "10/12/2025 04:58 pm"
              const endDateParsed = dayjs(
                userPlan.endDate,
                "DD/MM/YYYY hh:mm a"
              );
              setPlanEndDate(endDateParsed.format("DD/MM/YYYY"));
            }

            // Update table data with plan info
            setData([
              {
                key: Date.now(),
                planName: plan?.name || "N/A",
                startDate: userPlan.startDate
                  ? dayjs(userPlan.startDate, "DD/MM/YYYY hh:mm a").format(
                      "DD/MM/YYYY"
                    )
                  : "",
                endDate: userPlan.endDate
                  ? dayjs(userPlan.endDate, "DD/MM/YYYY hh:mm a").format(
                      "DD/MM/YYYY"
                    )
                  : "",
                amount: plan?.price?.toString() || "0",
              },
            ]);
          }

          message.success("Party details loaded successfully");
        } else {
          message.error("No user details found");
        }
      } else {
        message.error("Failed to load party details - Invalid response");
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
      console.error("Error response:", error?.response);
      message.error("Failed to load party details");
    } finally {
      setLoading(false);
    }
  };

  // Handle footer data changes
  const handleFooterDataChange = (data) => {
    setFooterData(data);
  };

  // Calculate totals
  const calculateTotals = () => {
    return {
      subTotal: footerData.subTotal,
      cgstAmount: footerData.cgstAmnt,
      sgstAmount: footerData.sgstAmnt,
      igstAmount: footerData.igstAmnt,
      grandTotal: footerData.grandTotal,
    };
  };

  const columns = [
    {
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) =>
            handleCellChange(record.key, "planName", e.target.value)
          }
        />
      ),
    },
    {
      title: "Plan Start date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text, "DD/MM/YYYY") : null}
          format="DD/MM/YYYY"
          onChange={(date) =>
            handleCellChange(
              record.key,
              "startDate",
              date ? date.format("DD/MM/YYYY") : ""
            )
          }
          className="w-full"
        />
      ),
    },
    {
      title: "Plan End date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text, "DD/MM/YYYY") : null}
          format="DD/MM/YYYY"
          onChange={(date) =>
            handleCellChange(
              record.key,
              "endDate",
              date ? date.format("DD/MM/YYYY") : ""
            )
          }
          className="w-full"
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) =>
            handleCellChange(record.key, "amount", e.target.value)
          }
          prefix="₹"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleCellChange = (key, field, value) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAdd = () => {
    const newRow = {
      key: Date.now(),
      planName: "Elite",
      startDate: "",
      endDate: "",
      amount: "0",
    };
    setData((prev) => [...prev, newRow]);
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
  };

  const handleEditPartyName = () => {
    setTempPartyName(partyName);
    setEditingPartyName(true);
  };

  const handleSavePartyName = () => {
    setPartyName(tempPartyName);
    setEditingPartyName(false);
  };

  const handleCancelPartyName = () => {
    setTempPartyName(partyName);
    setEditingPartyName(false);
  };

  const handleEditPlanName = () => {
    setTempPlanName(planName);
    setEditingPlanName(true);
  };

  const handleSavePlanName = () => {
    setPlanName(tempPlanName);
    setEditingPlanName(false);
  };

  const handleCancelPlanName = () => {
    setTempPlanName(planName);
    setEditingPlanName(false);
  };

  const handleEditBilling = () => {
    setTempBillingAddress(billingAddress);
    setEditingBilling(true);
  };

  const handleSaveBilling = () => {
    setBillingAddress(tempBillingAddress);
    setEditingBilling(false);
  };

  const handleCancelBilling = () => {
    setTempBillingAddress(billingAddress);
    setEditingBilling(false);
  };

  const handleEditShipping = () => {
    setTempShippingAddress(shippingAddress);
    setEditingShipping(true);
  };

  const handleSaveShipping = () => {
    setShippingAddress(tempShippingAddress);
    setEditingShipping(false);
  };

  const handleCancelShipping = () => {
    setTempShippingAddress(shippingAddress);
    setEditingShipping(false);
  };

  const handleEditBillingName = () => {
    setTempBillingName(billingName);
    setEditingBillingName(true);
  };

  const handleSaveBillingName = () => {
    setBillingName(tempBillingName);
    setEditingBillingName(false);
  };

  const handleCancelBillingName = () => {
    setTempBillingName(billingName);
    setEditingBillingName(false);
  };

  // GST Number handlers
  const handleEditGST = () => {
    setTempGSTNumber(gstNumber);
    setEditingGST(true);
  };

  const handleSaveGST = () => {
    setGSTNumber(tempGSTNumber);
    setEditingGST(false);
  };

  const handleCancelGST = () => {
    setTempGSTNumber(gstNumber);
    setEditingGST(false);
  };

  const handleSubmit = async () => {
    try {
      if (!partyName || !planName || !dueDate) {
        message.error("Please fill in all required fields");
        return;
      }

      if (data.length === 0) {
        message.error("Please add at least one plan item");
        return;
      }

      setLoading(true);

      const totals = calculateTotals();

      const planInformation = data.map((item) => ({
        planName: item.planName,
        planStartDate: item.startDate || "",
        planEndDate: item.endDate || "",
        amount:
          typeof item.amount === "string"
            ? parseFloat(item.amount.replace(/[₹,]/g, "")) || 0
            : parseFloat(item.amount) || 0,
      }));

      const payload = {
        billingAddress,
        billingName,
        cgstAmount: totals.cgstAmount,
        cgstPercentage: footerData.cgst,
        discount: footerData.discount,
        dueDate: dueDate ? dueDate.format("DD-MM-YYYY") : "",
        grandTotal: totals.grandTotal,
        gstNumber,
        igstAmount: totals.igstAmount,
        igstPercentage: footerData.igst,
        notes: footerData.notes || notes,
        partyName,
        planEndDate: planEndDate
          ? dayjs(planEndDate, "DD-MM-YYYY").format("DD-MM-YYYY")
          : "",
        planInformation: data.map((item) => ({
          planName: item.planName,
          planStartDate: item.startDate
            ? dayjs(item.startDate, "DD-MM-YYYY").format("DD-MM-YYYY")
            : "",
          planEndDate: item.endDate
            ? dayjs(item.endDate, "DD-MM-YYYY").format("DD-MM-YYYY")
            : "",
          amount:
            typeof item.amount === "string"
              ? parseFloat(item.amount.replace(/[₹,]/g, "")) || 0
              : parseFloat(item.amount) || 0,
        })),
        planName,
        planStartDate: planStartDate
          ? dayjs(planStartDate, "DD-MM-YYYY").format("DD-MM-YYYY")
          : "",
        roundOff: footerData.roundOff,
        sgstAmount: totals.sgstAmount,
        sgstPercentage: footerData.sgst,
        shippingAddress,
        subTotal: totals.subTotal,
      };

      const response = await SuperAdminAddInvoice(payload);

      if (response?.data?.success) {
        message.success("✅ Invoice created successfully!");
        setData([]);
      } else {
        throw new Error(response?.data?.message || "Failed to create invoice");
      }
    } catch (error) {
      console.error("❌ Error creating invoice:", error);
      message.error(
        error?.response?.data?.message || "Failed to create invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Invoice" }]} />
        </div>

        <div className="flex flex-col bg-gray-100 rounded mb-7">
          <div className="flex flex-col bg-white rounded">
            {/* Header Section */}
            <div className="card min-w-full bg-no-repeat bg-[length:500px] user-access-bg mb-5">
              <div className="flex flex-wrap items-center justify-between p-4 gap-3">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-lg font-semibold text-gray-900">
                      Party Name:
                    </p>
                    <Select
                      value={partyName}
                      onChange={(value, option) => {
                        setPartyId(value);
                        setPartyName(option?.label);

                        // Fetch full party details from API
                        fetchPartyDetails(value);
                      }}
                      options={partyList}
                      className="w-64"
                      placeholder="Select party"
                      showSearch
                      loading={loadingParties}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent={
                        loadingParties ? "Loading..." : "No parties found"
                      }
                    />
                  </div>
                  <div className="flex items-center gap-7">
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-user text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Plan name:</span>
                        <div className="flex items-center gap-2">
                          {editingPlanName ? (
                            <>
                              <Input
                                value={tempPlanName}
                                onChange={(e) =>
                                  setTempPlanName(e.target.value)
                                }
                                className="w-32"
                                size="small"
                              />
                              <SaveOutlined
                                className="text-green-600 cursor-pointer hover:text-green-700"
                                onClick={handleSavePlanName}
                              />
                              <CloseOutlined
                                className="text-red-600 cursor-pointer hover:text-red-700"
                                onClick={handleCancelPlanName}
                              />
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-medium text-gray-900">
                                {planName}
                              </span>
                              <EditOutlined
                                className="text-blue-600 cursor-pointer hover:text-blue-700 text-xs"
                                onClick={handleEditPlanName}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Plan Start Date:</span>
                        <DatePicker
                          value={
                            planStartDate
                              ? dayjs(planStartDate, "DD/MM/YYYY")
                              : null
                          }
                          format="DD/MM/YYYY"
                          onChange={(date) =>
                            setPlanStartDate(
                              date ? date.format("DD/MM/YYYY") : ""
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Plan End Date:</span>
                        <DatePicker
                          value={
                            planEndDate
                              ? dayjs(planEndDate, "DD/MM/YYYY")
                              : null
                          }
                          format="DD/MM/YYYY"
                          onChange={(date) =>
                            setPlanEndDate(
                              date ? date.format("DD/MM/YYYY") : ""
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Due Date:</span>
                        <DatePicker
                          value={dueDate}
                          format="DD/MM/YYYY"
                          onChange={(date) => setDueDate(date)}
                          className="input w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-end gap-2">
                  <button className="btn btn-primary p-4 rounded-lg">
                    <i className="ki-filled ki-printer"></i> Print
                  </button>
                  <button className="btn btn-primary p-4 rounded-lg">
                    <i className="ki-filled ki-exit-right-corner"></i> Share
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Section */}
            <div className="flex flex-col border rounded-xl mb-5">
              <div className="grid md:grid-cols-2 rounded">
                {/* Billing Address */}
                <div className="border-r p-4 rounded">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Billing Address
                    {!editingBilling ? (
                      <Tooltip title="Edit">
                        <EditOutlined
                          className="text-blue-600 ms-2 cursor-pointer hover:text-blue-700"
                          onClick={handleEditBilling}
                        />
                      </Tooltip>
                    ) : (
                      <span className="ms-2">
                        <Tooltip title="Save">
                          <SaveOutlined
                            className="text-green-600 cursor-pointer hover:text-green-700 mr-2"
                            onClick={handleSaveBilling}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 cursor-pointer hover:text-red-700"
                            onClick={handleCancelBilling}
                          />
                        </Tooltip>
                      </span>
                    )}
                  </h4>
                  {editingBilling ? (
                    <TextArea
                      value={tempBillingAddress}
                      onChange={(e) => setTempBillingAddress(e.target.value)}
                      rows={3}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {billingAddress}
                    </p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Shipping Address
                    {!editingShipping ? (
                      <Tooltip title="Edit">
                        <EditOutlined
                          className="text-blue-600 ms-2 cursor-pointer hover:text-blue-700"
                          onClick={handleEditShipping}
                        />
                      </Tooltip>
                    ) : (
                      <span className="ms-2">
                        <Tooltip title="Save">
                          <SaveOutlined
                            className="text-green-600 cursor-pointer hover:text-green-700 mr-2"
                            onClick={handleSaveShipping}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 cursor-pointer hover:text-red-700"
                            onClick={handleCancelShipping}
                          />
                        </Tooltip>
                      </span>
                    )}
                  </h4>
                  {editingShipping ? (
                    <TextArea
                      value={tempShippingAddress}
                      onChange={(e) => setTempShippingAddress(e.target.value)}
                      rows={3}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {shippingAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* GST Section */}
              <div className="grid md:grid-cols-2 border-t">
                <div className="border-r p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      Billing Name:
                    </span>
                    {editingBillingName ? (
                      <>
                        <Input
                          value={tempBillingName}
                          onChange={(e) => setTempBillingName(e.target.value)}
                          className="flex-1"
                        />
                        <Tooltip title="Save">
                          <SaveOutlined
                            className="text-green-600 cursor-pointer hover:text-green-700"
                            onClick={handleSaveBillingName}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 cursor-pointer hover:text-red-700"
                            onClick={handleCancelBillingName}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-700">{billingName}</span>
                        <Tooltip title="Edit">
                          <EditOutlined
                            className="text-blue-600 cursor-pointer hover:text-blue-700"
                            onClick={handleEditBillingName}
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      GST Number:
                    </span>
                    {editingGST ? (
                      <>
                        <Input
                          value={tempGSTNumber}
                          onChange={(e) => setTempGSTNumber(e.target.value)}
                          className="flex-1"
                        />
                        <Tooltip title="Save">
                          <SaveOutlined
                            className="text-green-600 cursor-pointer hover:text-green-700"
                            onClick={handleSaveGST}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 cursor-pointer hover:text-red-700"
                            onClick={handleCancelGST}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-700">{gstNumber}</span>
                        <Tooltip title="Edit">
                          <EditOutlined
                            className="text-blue-600 cursor-pointer hover:text-blue-700"
                            onClick={handleEditGST}
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Information Table */}
            <div className="p-4 mb-1 border rounded-xl">
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                Plan Information
              </h4>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                locale={{
                  emptyText: (
                    <div className="py-6">
                      <Empty description="No data" />
                    </div>
                  ),
                }}
                bordered
              />
              <div className="mt-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add New Row
                </Button>
              </div>
            </div>

            {/* Footer Section */}
            <InvoiceFooter
              rows={data}
              footerData={footerData}
              onFooterDataChange={handleFooterDataChange}
              onSave={handleSubmit}
              isNewInvoice={true}
            />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Addinvoice;
