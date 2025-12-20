import { Fragment, useState, useEffect } from "react";
import { Input, Select, DatePicker, Button, message, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import Swal from "sweetalert2";

import {
  deleteDownPayment,
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
  const [updateResponse, setUpdateResponse] = useState(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  // Dropdown options state
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [managers, setManagers] = useState([]);

  // Selected dropdown values for cascading
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userAmcs, setUserAmcs] = useState([
    {
      amcAmount: "",
      amcDate: "",
      amcRecivableAmount: "",
      amcRecivableDate: "",
      amcRemarks: "",
      amcType: "",
      status: "",
      file: null,
    },
  ]);

  const [refundDetails, setRefundDetails] = useState([
    {
      amount: "",
      refundDate: "",
      refundDetails: "",
      refundPaymentMode: "",
      refundType: "",
      remarks: "",
      file: null,
    },
  ]);
  // Member Details State
  const [memberDetails, setMemberDetails] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
    address: "",
    cityId: "",
    memberType: "",
    planId: "",
    isFile: "true",
    preFix: "",
    reportingManagerId: "",
  });

  // Down Payment State - FIXED: paidAmount instead of paidamount
  const [downPayments, setDownPayments] = useState([
    {
      paymentType: "",
      amount: "",
      paidAmount: "",
      payid: "",
      transactionDate: "",
      remarks: "",
      docPath: null,
      existingDocPath: null, // To store existing document URL
    },
  ]);

  // KYC State
  const [kycDetails, setKycDetails] = useState([
    { kycType: "", kycNo: "", docPath: null, existingDocPath: null },
  ]);

  const [callFile, setCallFile] = useState(null);

  const getDocumentUrl = (moduleName, moduleId, fileType) => {
    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://your-api-url.com";
    // Adjust this path based on your actual API structure
    // Common patterns: /uploads/${moduleName}/${moduleId}.${fileType}
    // or: /api/files/${moduleName}/${moduleId}
    return `${baseUrl}/uploads/${moduleName}/${moduleId}.${fileType}`;
  };

  const getModuleDisplayName = (moduleName) => {
    const names = {
      userDetails: "Profile Image",
      userDocument: "KYC Document",
      userDownPayment: "Payment Receipt",
    };
    return names[moduleName] || moduleName;
  };
  useEffect(() => {
    const initialize = async () => {
      await loadStatesForDefaultCountry(); // load states first
      await loadPlans();
      await loadManagers();
      if (id) await fetchUserData(); // then fetch user
    };

    initialize();
  }, [id]);

  useEffect(() => {
    if (id) {
      console.log("Component mounted with ID:", id, "Type:", typeof id);
      fetchUserData();
    } else {
      console.error("No ID provided in URL params");
    }
  }, [id]);

  const loadStatesForDefaultCountry = async () => {
    try {
      const response = await fetchStatesByCountry(1);
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
        return cityOptions;
      }
      return [];
    } catch (err) {
      console.error("Error loading cities:", err);
      return [];
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

  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setMemberDetails((prev) => ({ ...prev, cityId: "" }));
    setCities([]);
    if (stateId) {
      loadCities(stateId);
    }
  };

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
          if (user.stateId) {
            setSelectedState(user.stateId);

            const cities = await loadCities(user.stateId);

            const matchedCity = cities.find((c) => c.label === user.cityName);

            setMemberDetails((prev) => ({
              ...prev,
              cityId: matchedCity?.value || "",
            }));
          }

          setMemberDetails((prev) => ({
            ...prev,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            contactNo: user.contactNo || "",
            address: user.address || "",
            memberType: user.memberType || "",
            planId: user.userPlan?.plan?.id || "",
            isFile: user.isFile || "true",
            preFix: user.preFix || "Mr.",
            reportingManagerId: user.reportingManagerId || "",
          }));

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
                existingDocPath: doc.docPath || null, // Store existing document URL
              }))
            );
          }

          // PREFILL DOWN PAYMENTS - FIXED: using paidAmount
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
                existingDocPath: dp.docPath || null, // Store existing document URL
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

        paidAmount: "",
        transactionDate: "",
        remarks: "",
        docPath: null,
        existingDocPath: null,
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
    setKycDetails([
      ...kycDetails,
      { kycType: "", kycNo: "", docPath: null, existingDocPath: null },
    ]);
  };

  const removeKyc = (index) => {
    if (kycDetails.length === 1)
      return message.warning("At least one entry is required!");
    setKycDetails(kycDetails.filter((_, i) => i !== index));
  };

  // Helper function to view/download document
  const handleViewDocument = (docPath) => {
    if (!docPath) {
      message.warning("No document available");
      return;
    }

    // If docPath is a full URL, open it directly
    if (docPath.startsWith("http://") || docPath.startsWith("https://")) {
      window.open(docPath, "_blank");
    } else {
      // If it's a relative path, construct the full URL
      // Replace 'YOUR_BASE_URL' with your actual API base URL
      const baseUrl =
        process.env.REACT_APP_API_BASE_URL || "http://your-api-url.com";
      window.open(`${baseUrl}/${docPath}`, "_blank");
    }
  };

  const handleSubmit = async () => {
    const safeUserAmcs = Array.isArray(userAmcs) ? userAmcs : [];
    const safeRefundDetails = Array.isArray(refundDetails) ? refundDetails : [];
    // BASIC VALIDATION
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

      /* =========================
       MEMBER CORE DETAILS
    ========================= */
      formData.append("userId", id);
      formData.append("firstName", memberDetails.firstName);
      formData.append("lastName", memberDetails.lastName);
      formData.append("contactNo", memberDetails.contactNo || "");
      formData.append("address", memberDetails.address || "");
      formData.append("cityId", memberDetails.cityId);
      formData.append("memberType", memberDetails.memberType || "");
      formData.append("planId", memberDetails.planId || "");
      formData.append("preFix", memberDetails.preFix || "");
      formData.append(
        "reportingManagerId",
        memberDetails.reportingManagerId || ""
      );

      /* =========================
       FILE FLAG
    ========================= */
      const anyFileAttached =
        kycDetails.some((k) => k.docPath instanceof File) ||
        downPayments.some((d) => d.docPath instanceof File) ||
        userAmcs.some((a) => a.file instanceof File) ||
        refundDetails.some((r) => r.file instanceof File) ||
        callFile instanceof File;

      formData.append("isFile", anyFileAttached);

      /* =========================
       DOWN PAYMENTS
    ========================= */
      downPayments
        .filter((p) => p.paymentType && p.amount)
        .forEach((p, i) => {
          formData.append(`userDownPayments[${i}].id`, p.id || 0);
          formData.append(`userDownPayments[${i}].paymentType`, p.paymentType);
          formData.append(`userDownPayments[${i}].amount`, p.amount);
          formData.append(
            `userDownPayments[${i}].paidAmount`,
            p.paidAmount || 0
          );
          formData.append(`userDownPayments[${i}].payid`, p.payid || "");
          formData.append(
            `userDownPayments[${i}].transactionDate`,
            convertDateFormat(p.transactionDate)
          );
          formData.append(`userDownPayments[${i}].remarks`, p.remarks || "");

          if (p.docPath instanceof File) {
            formData.append(`userDownPayments[${i}].docPath`, p.docPath);
          }
        });

      /* =========================
       KYC DOCUMENTS
    ========================= */
      kycDetails
        .filter((k) => k.kycType && k.kycNo)
        .forEach((k, i) => {
          formData.append(`userDocuments[${i}].id`, k.id || 0);
          formData.append(`userDocuments[${i}].kycType`, k.kycType);
          formData.append(`userDocuments[${i}].kycNo`, k.kycNo);

          if (k.docPath instanceof File) {
            formData.append(`userDocuments[${i}].docPath`, k.docPath);
          }
        });

      /* =========================
       AMC DETAILS (Swagger)
    ========================= */
      userAmcs.filter((a) => a.amcAmount || a.amcDate);
      safeUserAmcs.forEach((a, i) => {
        formData.append(`userAmcs[${i}].id`, a.id || 0);
        formData.append(`userAmcs[${i}].amcAmount`, a.amcAmount || 0);
        formData.append(`userAmcs[${i}].amcDate`, convertDateFormat(a.amcDate));
        formData.append(
          `userAmcs[${i}].amcRecivableAmount`,
          a.amcRecivableAmount || 0
        );
        formData.append(
          `userAmcs[${i}].amcRecivableDate`,
          convertDateFormat(a.amcRecivableDate)
        );
        formData.append(`userAmcs[${i}].amcRemarks`, a.amcRemarks || "");
        formData.append(`userAmcs[${i}].amcType`, a.amcType || "");
        formData.append(`userAmcs[${i}].status`, a.status || "");

        if (a.file instanceof File) {
          formData.append(`userAmcs[${i}].file`, a.file);
        }
      });

      /* =========================
       REFUND DETAILS (Swagger)
    ========================= */
      refundDetails.filter((r) => r.amount || r.refundDate);
      safeRefundDetails.forEach((r, i) => {
        formData.append(`refundDetails[${i}].id`, r.id || 0);
        formData.append(`refundDetails[${i}].amount`, r.amount || 0);
        formData.append(
          `refundDetails[${i}].refundDate`,
          convertDateFormat(r.refundDate)
        );
        formData.append(
          `refundDetails[${i}].refundDetails`,
          r.refundDetails || ""
        );
        formData.append(
          `refundDetails[${i}].refundPaymentMode`,
          r.refundPaymentMode || ""
        );
        formData.append(`refundDetails[${i}].refundType`, r.refundType || "");
        formData.append(`refundDetails[${i}].remarks`, r.remarks || "");

        if (r.file instanceof File) {
          formData.append(`refundDetails[${i}].file`, r.file);
        }
      });

      /* =========================
       CALL FILE
    ========================= */
      if (callFile instanceof File) {
        formData.append("callFile", callFile);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      /* =========================
       SUBMIT
    ========================= */
      const response = await UpdateMemberById(id, formData);

      if (response?.data?.success || response?.status === 200) {
        message.success("Member updated successfully!");
        await fetchUserData();
      } else {
        message.error(response?.data?.msg || "Update failed");
      }
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.msg || "Update failed");
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

  const handleDeleteDownPayment = async (index, paymentId) => {
    if (!paymentId) {
      removeDownPayment(index);
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this down payment deletion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await deleteDownPayment(paymentId);

        if (response?.data?.success) {
          message.success("Down payment deleted successfully!");
          // Remove from state
          removeDownPayment(index);
          // Optionally refresh data to get updated list
          await fetchUserData();
        } else {
          message.error(
            response?.data?.msg || "Failed to delete down payment."
          );
        }
      }
    } catch (error) {
      console.error("Error deleting down payment:", error);
      message.error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to delete down payment."
      );
    }
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Member Edit" }]} />
        </div>

        <div className="bg-white shadow rounded-md p-4 space-y-6">
          {/* MEMBER DETAILS */}
          <section className="border rounded-md">
            <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              Member Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {/* Prefix */}
              <div>
                <label className="block mb-1 text-sm">Prefix</label>
                <Select
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

              {/* First Name */}
              <div>
                <label className="block mb-1 text-sm">First Name *</label>
                <Input
                  value={memberDetails.firstName}
                  onChange={(e) =>
                    handleMemberChange("firstName", e.target.value)
                  }
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block mb-1 text-sm">Last Name *</label>
                <Input
                  value={memberDetails.lastName}
                  onChange={(e) =>
                    handleMemberChange("lastName", e.target.value)
                  }
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block mb-1 text-sm">Contact Number</label>
                <Input
                  value={memberDetails.contactNo}
                  onChange={(e) =>
                    handleMemberChange("contactNo", e.target.value)
                  }
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2 md:col-span-2 lg:col-span-1">
                <label className="block mb-1 text-sm">Address</label>
                <Input
                  value={memberDetails.address}
                  onChange={(e) =>
                    handleMemberChange("address", e.target.value)
                  }
                />
              </div>

              {/* State */}
              <div>
                <label className="block mb-1 text-sm">State</label>
                <Select
                  value={selectedState}
                  onChange={handleStateChange}
                  options={states}
                  className="w-full"
                />
              </div>

              {/* City */}
              <div>
                <label className="block mb-1 text-sm">City *</label>
                <Select
                  value={memberDetails.cityId}
                  onChange={handleCityChange}
                  options={cities}
                  disabled={!selectedState}
                  className="w-full"
                />
              </div>

              {/* Member Type */}
              <div>
                <label className="block mb-1 text-sm">Member Type</label>
                <Input
                  value={memberDetails.memberType}
                  onChange={(e) =>
                    handleMemberChange("memberType", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Profile Type</label>
                <Input
                  value={memberDetails.memberType}
                  onChange={(e) =>
                    handleMemberChange("memberType", e.target.value)
                  }
                />
              </div>

              {/* Plan */}
              <div>
                <label className="block mb-1 text-sm">Plan</label>
                <Select
                  value={memberDetails.planId}
                  onChange={(v) => handleMemberChange("planId", v)}
                  options={plans}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span>Other Details</span>
            </div>

            <div className="flex p-4 w-full gap-3">
              <div className="w-full md:w-1/2">
                <label className="block mb-1 text-sm">Sales </label>
                <Select
                  value={memberDetails.reportingManagerId}
                  onChange={(v) => handleMemberChange("reportingManagerId", v)}
                  options={managers}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block mb-1 text-sm">Reporting Manager</label>
                <Select
                  value={memberDetails.reportingManagerId}
                  onChange={(v) => handleMemberChange("reportingManagerId", v)}
                  options={managers}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span>Remarks</span>
            </div>

            <div className="flex p-4 w-full gap-3 ">
              <div className="w-full md:w-1/2">
                <label className="block mb-1 text-sm">Manager Remarks</label>
                <textarea
                  rows={3}
                  className="textarea w-full mb-3"
                  placeholder="Add Remarks here"
                />
                <Input
                  className=""
                  type="file"
                  onChange={(e) => setCallFile(e.target.files[0])}
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="block mb-1 text-sm">Sales Remarks</label>
                <textarea
                  rows={3}
                  className="textarea w-full mb-3"
                  placeholder="Add Remarks here"
                />
                <Input
                  className=""
                  type="file"
                  onChange={(e) => setCallFile(e.target.files[0])}
                />
              </div>
            </div>
          </section>

          {/* DOWN PAYMENT DETAILS */}
          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span>Down Payment Details</span>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="small"
                onClick={addDownPayment}
              >
                Add New
              </Button>
            </div>

            {downPayments.map((row, index) => (
              <div
                key={index}
                className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {/* Payment Type */}
                <div>
                  <label className="text-sm">Payment Type</label>
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
                    className="w-full"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm">Amount</label>
                  <Input
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      handleDownPaymentChange(index, "amount", e.target.value)
                    }
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="text-sm">Paid Amount</label>
                  <Input
                    type="number"
                    value={row.paidAmount}
                    onChange={(e) =>
                      handleDownPaymentChange(
                        index,
                        "paidAmount",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* Payment ID */}
                <div>
                  <label className="text-sm">Payment ID</label>
                  <Input
                    value={row.payid}
                    onChange={(e) =>
                      handleDownPaymentChange(index, "payid", e.target.value)
                    }
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm">Transaction Date</label>
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
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="text-sm">Remarks</label>
                  <Input
                    value={row.remarks}
                    onChange={(e) =>
                      handleDownPaymentChange(index, "remarks", e.target.value)
                    }
                  />
                </div>

                {/* Upload */}
                <div className="flex flex-col">
                  <label className="text-sm">Document</label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      handleDownPaymentFile(index, e.target.files[0])
                    }
                  />
                </div>

                {/* Delete */}
                <div className="flex justify-end">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteDownPayment(index, row.id)}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* KYC SECTION */}
          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold">
              KYC Information
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="small"
                onClick={addKyc}
              >
                Add New
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {kycDetails.map((kyc, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  "
                >
                  {/* KYC TYPE */}
                  <div>
                    <label className="text-sm">KYC Type</label>
                    <Select
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

                  {/* KYC NUMBER */}
                  <div>
                    <label className="text-sm">KYC Document Number</label>
                    <Input
                      value={kyc.kycNo}
                      onChange={(e) =>
                        handleKycChange(index, "kycNo", e.target.value)
                      }
                    />
                  </div>

                  {/* FILE */}
                  <div className="flex flex-col">
                    <label className="text-sm">Upload Document</label>
                    <Input
                      type="file"
                      onChange={(e) => handleKycFile(index, e.target.files[0])}
                    />
                  </div>

                  {/* DELETE */}
                  <div className="flex justify-end">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeKyc(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span>AMC Details</span>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="small"
                onClick={addDownPayment}
              >
                Add New
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {downPayments.map((row, index) => (
                <div
                  key={index}
                  className=" rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {/* AMC Type */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      AMC Type
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
                      className="w-full"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Amount
                    </label>
                    <Input
                      type="number"
                      value={row.amount}
                      onChange={(e) =>
                        handleDownPaymentChange(index, "amount", e.target.value)
                      }
                    />
                  </div>

                  {/* AMC Date */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      AMC Date
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
                    />
                  </div>

                  {/* Receivable Amount */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Receivable Amount
                    </label>
                    <Input
                      type="number"
                      value={row.amount}
                      onChange={(e) =>
                        handleDownPaymentChange(index, "amount", e.target.value)
                      }
                    />
                  </div>

                  {/* Receivable Date */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Receivable Date
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
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Status
                    </label>
                    <Select
                      value={row.paymentType}
                      onChange={(v) =>
                        handleDownPaymentChange(index, "paymentType", v)
                      }
                      options={[
                        { label: "Pending", value: "pending" },
                        { label: "Completed", value: "completed" },
                        { label: "Cancelled", value: "cancelled" },
                      ]}
                      className="w-full"
                    />
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Remarks
                    </label>
                    <Input
                      value={row.remarks}
                      onChange={(e) =>
                        handleDownPaymentChange(
                          index,
                          "remarks",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Upload Document */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Upload Document
                    </label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleDownPaymentFile(index, e.target.files[0])
                      }
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-end mt-3">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteDownPayment(index, row.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border rounded-md">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span>Refund Details</span>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="small"
                onClick={addDownPayment}
              >
                Add New
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {downPayments.map((row, index) => (
                <div
                  key={index}
                  className=" rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {/* AMC Type */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Refund Type
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
                      className="w-full"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Amount
                    </label>
                    <Input
                      type="number"
                      value={row.amount}
                      onChange={(e) =>
                        handleDownPaymentChange(index, "amount", e.target.value)
                      }
                    />
                  </div>

                  {/* AMC Date */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Refund Date
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
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Refund Payment Mode
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
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Refund Details
                    </label>
                    <Input
                      value={row.remarks}
                      onChange={(e) =>
                        handleDownPaymentChange(
                          index,
                          "remarks",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Remarks
                    </label>
                    <Input
                      value={row.remarks}
                      onChange={(e) =>
                        handleDownPaymentChange(
                          index,
                          "remarks",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Upload Document */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Upload Document
                    </label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleDownPaymentFile(index, e.target.files[0])
                      }
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-end mt-3">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteDownPayment(index, row.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CALL FILE */}
          <section className="border rounded-md ">
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
              <span> Import Call File</span>
            </div>
            <div className="p-3">
              <Input
                className="p-3"
                type="file"
                onChange={(e) => setCallFile(e.target.files[0])}
              />
            </div>
          </section>

          {/* FOOTER BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              Update
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default SuperAdminMemberEdit;
