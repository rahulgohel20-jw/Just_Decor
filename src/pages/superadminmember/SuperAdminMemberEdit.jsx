import { Fragment, useState, useEffect } from "react";
import { Input, Select, DatePicker, Button, message, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddMember from "@/partials/modals/add-member/AddMember";

import {
  UpdateMemberById,
  GetALLMemberDetailsByID,
  fetchCountries,
  fetchStatesByCountry,
  fetchCitiesByState,
  GetAllPlans,
  Fetchmanager,
} from "@/services/apiServices";

const SuperAdminMemberEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Dropdown options state
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [managers, setManagers] = useState([]);

  // Selected dropdown values for cascading
  const DEFAULT_COUNTRY_ID = 1;
  const [selectedState, setSelectedState] = useState(null);

  // Member Details State
  const [memberDetails, setMemberDetails] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    address: "",
    cityId: "",
    memberType: "",
    planId: "",
    preFix: "",
    reportingManagerId: "",
  });

  // Down Payment State
  const [downPayments, setDownPayments] = useState([
    {
      paymentType: "",
      amount: "",
      payid: "",
      transactionDate: "",
      paidAmount: "",
      remarks: "",
      docPath: null,
    },
  ]);

  // KYC State
  const [kycDetails, setKycDetails] = useState([
    { kycType: "", kycNo: "", docPath: null },
  ]);

  const [callFile, setCallFile] = useState(null);

  // Fetch all dropdown data on mount
  useEffect(() => {
    loadStatesForDefaultCountry();
    loadPlans();
    loadManagers();
  }, []);

  // Fetch user data
  useEffect(() => {
    if (id) {
      console.log("Component mounted with ID:", id, "Type:", typeof id);
      fetchUserData();
    } else {
      console.error("No ID provided in URL params");
    }
  }, [id]);

  // Load States for default country
  const loadStatesForDefaultCountry = async () => {
    try {
      const response = await fetchStatesByCountry(DEFAULT_COUNTRY_ID);
      if (response.data.success) {
        const stateOptions = response?.data?.data?.["state Details"].map(
          (state) => ({
            label: state.name,
            value: state.id,
          })
        );
        setStates(stateOptions);
      }
    } catch (err) {
      console.error("Error loading states:", err);
    }
  };

  // Load Cities based on state
  const loadCities = async (stateId) => {
    try {
      const response = await fetchCitiesByState(stateId);
      if (response.data.success) {
        const cityOptions = response?.data?.data?.["City Details"].map(
          (city) => ({
            label: city.name,
            value: city.id,
          })
        );
        setCities(cityOptions);
      }
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  };

  // Load Plans
  const loadPlans = async () => {
    try {
      const response = await GetAllPlans();
      if (response.data.success) {
        const planOptions = response?.data?.data?.["Plan Details"].map(
          (plan) => ({
            label: plan.name,
            value: plan.id,
          })
        );
        setPlans(planOptions);
      }
    } catch (err) {
      console.error("Error loading plans:", err);
    }
  };

  // Load Managers
  const loadManagers = async () => {
    try {
      const clientUserId = 1;
      const response = await Fetchmanager(clientUserId);
      if (response.data.success) {
        const managerOptions = response?.data?.data?.["userDetails"].map(
          (manager) => ({
            label: `${manager.firstName} ${manager.lastName}`,
            value: manager.id,
          })
        );
        setManagers(managerOptions);
      }
    } catch (err) {
      console.error("Error loading managers:", err);
    }
  };

  // Handle State Change
  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setMemberDetails((prev) => ({ ...prev, cityId: "" }));
    setCities([]);
    if (stateId) {
      loadCities(stateId);
    }
  };

  // Handle City Change
  const handleCityChange = (cityId) => {
    setMemberDetails((prev) => ({ ...prev, cityId }));
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await GetALLMemberDetailsByID(id);

      if (response.data.success) {
        const users =
          response.data.data?.["User Details"] || response.data.data || [];
        const user = users.find((u) => u.id === parseInt(id));

        if (user) {
          // SET STATE AND LOAD CITIES FIRST
          if (user.stateId) {
            setSelectedState(user.stateId);
            await loadCities(user.stateId);
          }

          setMemberDetails({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            contactNo: user.contactNo || "",
            address: user.address || "",
            cityId: user.cityId || "",

            memberType: user.memberType || "",
            planId: user.userPlan?.plan?.id || "",
            preFix: user.preFix || "Mr.",
            reportingManagerId: user.reportingManagerId || "",
          });

          // PREFILL PLAN
          if (user.userPlan?.plan) {
            setPlans((prev) => {
              const exists = prev.some(
                (p) => p.value === user.userPlan.plan.id
              );
              if (!exists) {
                return [
                  ...prev,
                  {
                    label: user.userPlan.plan.name,
                    value: user.userPlan.plan.id,
                  },
                ];
              }
              return prev;
            });
          }

          // PREFILL KYC DOCUMENTS
          if (user.userDocument && user.userDocument.length > 0) {
            setKycDetails(
              user.userDocument.map((doc) => ({
                id: doc.id,
                kycType: doc.kycType || "",
                kycNo: doc.kycNo || "",
                docPath: null,
              }))
            );
          }

          // PREFILL DOWN PAYMENTS
          if (user.downPayment && user.downPayment.length > 0) {
            setDownPayments(
              user.downPayment.map((dp) => ({
                id: dp.id,
                paymentType: dp.paymentType || "",
                amount: dp.amount || "",
                paidAmount: dp.paidAmount || "",
                payid: dp.payid || "",
                transactionDate: dp.transactionDateTime
                  ? dp.transactionDateTime
                      .split(" ")[0]
                      .split("/")
                      .reverse()
                      .join("-")
                  : "",
                remarks: dp.remarks || "",
                docPath: null,
              }))
            );
          }
        } else {
          message.error("User not found");
          navigate(-1);
        }
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberChange = (field, value) => {
    setMemberDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addDownPayment = () => {
    setDownPayments([
      ...downPayments,
      {
        paymentType: "",
        amount: "",
        payid: "",
        transactionDate: "",
        remarks: "",
        docPath: null,
      },
    ]);
  };

  const removeDownPayment = (index) => {
    if (downPayments.length === 1)
      return message.warning("At least one entry is required!");
    setDownPayments(downPayments.filter((_, i) => i !== index));
  };

  const handleDownPaymentChange = (index, field, value) => {
    const updated = [...downPayments];
    updated[index][field] = value;
    setDownPayments(updated);
  };

  const handleDownPaymentFile = (index, file) => {
    const updated = [...downPayments];
    updated[index].docPath = file;
    setDownPayments(updated);
  };

  // Helper function to convert date from yyyy-MM-dd to dd/MM/yyyy
  const convertDateFormat = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Helper function to convert date from dd/MM/yyyy to yyyy-MM-dd (for loading data)
  const convertDateForInput = (dateString) => {
    if (!dateString) return "";
    // Check if already in yyyy-MM-dd format
    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
      return dateString;
    }
    // Convert from dd/MM/yyyy to yyyy-MM-dd
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleKycChange = (index, field, value) => {
    const updated = [...kycDetails];
    updated[index][field] = value;
    setKycDetails(updated);
  };

  const handleKycFile = (index, file) => {
    const updated = [...kycDetails];
    updated[index].docPath = file;
    setKycDetails(updated);
  };

  const addKyc = () => {
    setKycDetails([...kycDetails, { kycType: "", kycNo: "", docPath: null }]);
  };

  const removeKyc = (index) => {
    if (kycDetails.length === 1)
      return message.warning("At least one entry is required!");
    setKycDetails(kycDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!memberDetails.firstName || !memberDetails.lastName) {
      message.error("First name and last name are required!");
      return;
    }
    if (!memberDetails.cityId) {
      message.error("Please select a city!");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      // Add userId as required by API
      formData.append("userId", id);

      // Add member details (only non-empty values)
      formData.append("firstName", memberDetails.firstName);
      formData.append("lastName", memberDetails.lastName);

      if (memberDetails.contactNo) {
        formData.append("contactNo", memberDetails.contactNo);
      }
      if (memberDetails.address) {
        formData.append("address", memberDetails.address);
      }

      formData.append("cityId", memberDetails.cityId);

      if (memberDetails.memberType) {
        formData.append("memberType", memberDetails.memberType);
      }
      if (memberDetails.planId) {
        formData.append("planId", memberDetails.planId);
      }
      if (memberDetails.preFix) {
        formData.append("preFix", memberDetails.preFix);
      }
      if (memberDetails.reportingManagerId) {
        formData.append("reportingManagerId", memberDetails.reportingManagerId);
      }

      // Add down payments - only send entries with ID (existing) or complete new data
      const validDownPayments = downPayments.filter((payment) => {
        // Keep if it has an ID (existing record)
        if (payment.id) return true;
        // Keep if it has at least payment type AND amount (new record)
        return payment.paymentType && payment.amount;
      });

      validDownPayments.forEach((payment, index) => {
        // CRITICAL: Always send id field - use 0 for new records
        formData.append(`userDownPayments[${index}].id`, payment.id || 0);
        formData.append(
          `userDownPayments[${index}].paymentType`,
          payment.paymentType || ""
        );
        formData.append(
          `userDownPayments[${index}].amount`,
          payment.amount || ""
        );
        formData.append(
          `userDownPayments[${index}].paidAmount`,
          payment.paidAmount || ""
        );
        formData.append(
          `userDownPayments[${index}].payid`,
          payment.payid || ""
        );
        // Convert date format from yyyy-MM-dd to dd/MM/yyyy
        formData.append(
          `userDownPayments[${index}].transactionDate`,
          convertDateFormat(payment.transactionDate)
        );
        formData.append(
          `userDownPayments[${index}].remarks`,
          payment.remarks || ""
        );

        if (payment.docPath) {
          formData.append(
            `userDownPayments[${index}].docPath`,
            payment.docPath
          );
        }
      });

      // Add KYC details - only send entries with ID (existing) or complete new data
      const validKycDetails = kycDetails.filter((kyc) => {
        // Keep if it has an ID (existing record)
        if (kyc.id) return true;
        // Keep if it has at least kyc type AND kyc number (new record)
        return kyc.kycType && kyc.kycNo;
      });

      validKycDetails.forEach((kyc, index) => {
        // CRITICAL: Always send id field - use 0 for new records
        formData.append(`userDocuments[${index}].id`, kyc.id || 0);
        formData.append(`userDocuments[${index}].kycType`, kyc.kycType || "");
        formData.append(`userDocuments[${index}].kycNo`, kyc.kycNo || "");

        if (kyc.docPath) {
          formData.append(`userDocuments[${index}].docPath`, kyc.docPath);
        }
      });

      // Add call file - always include field to prevent null pointer exception
      if (callFile) {
        formData.append("callFile", callFile);
      } else {
        // Send empty blob to satisfy backend requirement
        formData.append("callFile", new Blob(), "");
      }

      console.log("Submitting FormData:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await UpdateMemberById(id, formData);

      console.log("API Response:", response);

      // Check for success in different possible response structures
      const isSuccess =
        response?.data?.success ||
        response?.success ||
        response?.status === 200;

      if (isSuccess) {
        message.success(response?.data?.msg || "Member updated successfully!");
        navigate(-1);
      } else {
        message.error(
          response?.data?.msg || response?.msg || "Failed to update member"
        );
      }
    } catch (err) {
      console.error("Update Error:", err);

      // Check if error response indicates success (some APIs return 200 with error structure)
      if (err?.response?.data?.success) {
        message.success(
          err.response.data.msg || "Member updated successfully!"
        );
        navigate(-1);
      } else {
        message.error(
          "Error updating member: " + (err.response?.data?.msg || err.message)
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" tip="Loading user data..." />
        </div>
      </Container>
    );
  }

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Member Edit" }]} />
        </div>

        <div className="bg-white shadow rounded-md p-4 space-y-6">
          {/* Member Details */}
          <section className="border rounded-md">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              Member Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Prefix
                </label>
                <Select
                  placeholder="Select Prefix"
                  value={memberDetails.preFix}
                  onChange={(v) => handleMemberChange("preFix", v)}
                  options={[
                    { label: "Mr.", value: "Mr." },
                    { label: "Mrs.", value: "Mrs." },
                    { label: "Ms.", value: "Ms." },
                  ]}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <Input
                  placeholder="Enter first name"
                  value={memberDetails.firstName}
                  onChange={(e) =>
                    handleMemberChange("firstName", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <Input
                  placeholder="Enter last name"
                  value={memberDetails.lastName}
                  onChange={(e) =>
                    handleMemberChange("lastName", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <Input
                  placeholder="Enter contact number"
                  value={memberDetails.contactNo}
                  onChange={(e) =>
                    handleMemberChange("contactNo", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  placeholder="Enter address"
                  value={memberDetails.address}
                  onChange={(e) =>
                    handleMemberChange("address", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  State
                </label>
                <Select
                  placeholder="Select State"
                  value={selectedState}
                  onChange={handleStateChange}
                  options={states}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  City *
                </label>
                <Select
                  placeholder="Select City"
                  value={memberDetails.cityId}
                  onChange={handleCityChange}
                  options={cities}
                  disabled={!selectedState}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Member Type
                </label>
                <Input
                  placeholder="Enter member type"
                  value={memberDetails.memberType}
                  onChange={(e) =>
                    handleMemberChange("memberType", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Plan
                </label>
                <Select
                  placeholder="Select Plan"
                  value={memberDetails.planId}
                  onChange={(v) => handleMemberChange("planId", v)}
                  options={plans}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Reporting Manager
                  </label>
                  <Select
                    placeholder="Select Reporting Manager"
                    value={memberDetails.reportingManagerId}
                    onChange={(v) =>
                      handleMemberChange("reportingManagerId", v)
                    }
                    options={managers}
                    showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    className="w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(true)}
                  className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition"
                >
                  <PlusOutlined className="text-xs" />
                </button>
              </div>
            </div>
          </section>

          {/* Down Payment Details */}
          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-3 py-2 font-semibold text-gray-700 border-b">
              <span>Down Payment Details</span>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                className="bg-primary hover:bg-blue-500"
                size="small"
                onClick={addDownPayment}
              >
                Add New
              </Button>
            </div>

            <div className="p-3 space-y-3">
              {downPayments.map((row, index) => (
                <div key={index} className="flex flex-wrap gap-2 items-end">
                  {/* Payment Type */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Payment Type
                    </label>
                    <Select
                      value={row.paymentType}
                      onChange={(v) =>
                        handleDownPaymentChange(index, "paymentType", v)
                      }
                      options={[
                        { label: "Cash", value: "cash" },
                        { label: "Cheque", value: "cheque" },
                        { label: "Online", value: "online" },
                        { label: "Other", value: "other" },
                      ]}
                      placeholder="Select type"
                      className="w-full text-xs"
                    />
                  </div>

                  {/* Amount (small width) */}
                  <div className="w-20">
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Amount
                    </label>
                    <Input
                      value={row.amount}
                      type="number"
                      disabled
                      className="text-xs"
                    />
                  </div>

                  {/* Paid Amount */}
                  <div className="flex-1 min-w-[80px]">
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Paid Amount
                    </label>
                    <Input
                      value={row.paidAmount}
                      onChange={(e) =>
                        handleDownPaymentChange(
                          index,
                          "paidAmount",
                          e.target.value
                        )
                      }
                      placeholder="Enter amount"
                      type="number"
                      className="text-xs"
                    />
                  </div>

                  {/* Payment ID */}
                  <div className="flex-1 min-w-[100px]">
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Payment ID
                    </label>
                    <Input
                      value={row.payid}
                      onChange={(e) =>
                        handleDownPaymentChange(index, "payid", e.target.value)
                      }
                      placeholder="Enter ID"
                      className="text-xs"
                    />
                  </div>

                  {/* Transaction Date */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Transaction Date
                    </label>
                    <Input
                      type="date"
                      value={row.transactionDate}
                      onChange={(e) =>
                        handleDownPaymentChange(
                          index,
                          "transactionDate",
                          e.target.value
                        )
                      }
                      className="text-xs"
                    />
                  </div>

                  {/* Remarks */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Remarks
                    </label>
                    <Input
                      placeholder="Remarks"
                      value={row.remarks}
                      onChange={(e) =>
                        handleDownPaymentChange(
                          index,
                          "remarks",
                          e.target.value
                        )
                      }
                      className="text-xs"
                    />
                  </div>

                  {/* Upload + Delete inline */}
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="flex-1">
                      <label className="block mb-1 text-xs font-medium text-gray-700">
                        Upload
                      </label>
                      <Input
                        type="file"
                        onChange={(e) =>
                          handleDownPaymentFile(index, e.target.files[0])
                        }
                        className="text-xs"
                      />
                    </div>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeDownPayment(index)}
                      size="small"
                      className="mt-6"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* KYC Information */}
          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span>KYC Information</span>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                className="bg-primary p-4 hover:bg-blue-500"
                size="small"
                onClick={addKyc}
              >
                Add New
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {kycDetails.map((kyc, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      KYC Type
                    </label>
                    <Select
                      placeholder="Select KYC Type"
                      value={kyc.kycType}
                      onChange={(v) => handleKycChange(index, "kycType", v)}
                      options={[
                        { label: "Aadhar", value: "aadhar" },
                        { label: "PAN", value: "pan" },
                        { label: "Passport", value: "passport" },
                        { label: "Voter ID", value: "voter_id" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      KYC Document Number
                    </label>
                    <Input
                      placeholder="Enter document number"
                      value={kyc.kycNo}
                      onChange={(e) =>
                        handleKycChange(index, "kycNo", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Upload Document
                    </label>
                    <Input
                      type="file"
                      onChange={(e) => handleKycFile(index, e.target.files[0])}
                    />
                  </div>

                  <div>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeKyc(index)}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Import Call File (Optional)
              </label>
              <Input
                type="file"
                onChange={(e) => setCallFile(e.target.files[0])}
              />
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="primary"
              className="bg-primary"
              onClick={handleSubmit}
              loading={submitting}
            >
              Update
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </div>
        <AddMember
          isModalOpen={isMemberModalOpen}
          setIsModalOpen={setIsMemberModalOpen}
          refreshData={fetchUserData} // refresh after adding a manager
          selectedMember={null} // optional, if adding new member
        />
      </Container>
    </Fragment>
  );
};

export default SuperAdminMemberEdit;
