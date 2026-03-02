import { useState, useEffect } from "react";
import {
  BankOutlined,
  SaveOutlined,
  UserOutlined,
  NumberOutlined,
  HomeOutlined,
  QrcodeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Input, Button, message, Spin } from "antd";
import {
  AddorUpdatebankdetails,
  GetbankdetailsbyuserId,
} from "@/services/apiServices";

export default function BankDetail() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [bankDetailsId, setBankDetailsId] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNo: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    upiId: "",
  });

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        message.error("User ID not found");
        return;
      }

      // Fetch bank details from API
      const response = await GetbankdetailsbyuserId(userId);

      if (response?.data?.success && response?.data?.data) {
        const data = response.data.data;
        setBankDetails({
          accountHolderName: data.accountHolderName || "",
          accountNo: data.accountNo || "",
          bankName: data.bankName || "",
          branchName: data.branchName || "",
          ifscCode: data.ifscCode || "",
          upiId: data.upiId || "",
        });
        setBankDetailsId(data.id);
        setHasExistingData(true);
        setIsEditing(false); // Disable editing when data exists
      } else {
        // No existing data, enable editing
        setHasExistingData(false);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      // Don't show error if it's just that no bank details exist yet
      if (error?.response?.status !== 404) {
        message.error("Failed to fetch bank details");
      }
      // No existing data, enable editing
      setHasExistingData(false);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBankDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    fetchBankDetails();
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!bankDetails.accountHolderName.trim()) {
        message.error("Please enter account holder name");
        return;
      }
      if (!bankDetails.accountNo.trim()) {
        message.error("Please enter account number");
        return;
      }
      if (!bankDetails.bankName.trim()) {
        message.error("Please enter bank name");
        return;
      }
      if (!bankDetails.branchName.trim()) {
        message.error("Please enter branch name");
        return;
      }
      if (!bankDetails.ifscCode.trim()) {
        message.error("Please enter IFSC code");
        return;
      }

      // IFSC code format validation (11 characters)
      if (bankDetails.ifscCode.length !== 11) {
        message.error("IFSC code must be 11 characters");
        return;
      }

      setSaving(true);
      const userId = localStorage.getItem("userId");

      // Prepare data for API
      const payload = {
        userId: userId,
        id: bankDetailsId || -1, // Use existing id if available, otherwise -1 for new record
        accountHolderName: bankDetails.accountHolderName.trim(),
        accountNo: bankDetails.accountNo.trim(),
        bankName: bankDetails.bankName.trim(),
        branchName: bankDetails.branchName.trim(),
        ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
        upiId: bankDetails.upiId.trim() || null,
        isPrimary: true,
      };

      // Call API to add or update bank details
      const response = await AddorUpdatebankdetails(userId, payload);

      if (response?.data?.success) {
        message.success(
          hasExistingData
            ? "Bank details updated successfully"
            : "Bank details saved successfully",
        );
        // Refetch to get updated data and disable editing
        fetchBankDetails();
      } else {
        message.error(response?.data?.message || "Failed to save bank details");
      }
    } catch (error) {
      console.error("Error saving bank details:", error);
      message.error(
        error?.response?.data?.message || "Failed to save bank details",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Form section */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="max-w-2xl">
            {/* Account Holder Name */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <UserOutlined className="text-[#28375F]" />
                Account Holder Name
                <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="Enter account holder name"
                value={bankDetails.accountHolderName}
                onChange={(e) =>
                  handleInputChange("accountHolderName", e.target.value)
                }
                className="rounded-md"
                disabled={!isEditing}
              />
            </div>

            {/* Account Number */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <NumberOutlined className="text-[#28375F]" />
                Account Number
                <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="Enter account number"
                value={bankDetails.accountNo}
                onChange={(e) => handleInputChange("accountNo", e.target.value)}
                maxLength={18}
                className="rounded-md"
                disabled={!isEditing}
              />
            </div>

            {/* Bank Name */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BankOutlined className="text-[#28375F]" />
                Bank Name
                <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="Enter bank name"
                value={bankDetails.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className="rounded-md"
                disabled={!isEditing}
              />
            </div>

            {/* Branch Name */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <HomeOutlined className="text-[#28375F]" />
                Branch Name
                <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="Enter branch name"
                value={bankDetails.branchName}
                onChange={(e) =>
                  handleInputChange("branchName", e.target.value)
                }
                className="rounded-md"
                disabled={!isEditing}
              />
            </div>

            {/* IFSC Code */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <NumberOutlined className="text-[#28375F]" />
                IFSC Code
                <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                value={bankDetails.ifscCode}
                onChange={(e) =>
                  handleInputChange("ifscCode", e.target.value.toUpperCase())
                }
                maxLength={11}
                className="rounded-md"
                disabled={!isEditing}
              />
            </div>

            {/* UPI ID */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <QrcodeOutlined className="text-[#28375F]" />
                UPI ID
                <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="Enter UPI ID (e.g., username@paytm)"
                value={bankDetails.upiId}
                onChange={(e) => handleInputChange("upiId", e.target.value)}
                className="rounded-md"
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {hasExistingData && !isEditing ? (
                // Show Edit button when data exists and not editing
                <Button
                  type="default"
                  size="large"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  className="rounded-md px-8"
                >
                  Edit
                </Button>
              ) : (
                // Show Cancel and Save/Update buttons when editing
                <>
                  {hasExistingData && (
                    <Button
                      size="large"
                      onClick={handleCancel}
                      className="rounded-md px-6"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={saving}
                    className="bg-[#28375F] hover:bg-[#1f2a4a] rounded-md px-8"
                  >
                    {hasExistingData ? "Update" : "Save"} Bank Details
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
