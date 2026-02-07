import { useEffect, useState } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";
import Swal from "sweetalert2";
import { OutsideContactName } from "@/services/apiServices";

export default function AllocateRowOutside({
  onAllocate,
  vendorRefreshTrigger = 0,
  selectedCount,
}) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [pax, setPax] = useState("");
  const userid = localStorage.getItem("userId");

  useEffect(() => {
    fetchdata();
  }, [vendorRefreshTrigger]);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const partyMasters = await OutsideContactName(6, userid);
      const data = partyMasters.data.data["Party Details"] || [];
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = () => {
    // Check if at least one field is filled
    if (!selectedVendor && (!pax || pax <= 0)) {
      Swal.fire({
        title: "Missing Information",
        text: "Please fill at least one field (Vendor or Pax)",
        icon: "warning",
      });
      return;
    }

    // Check if items are selected
    if (!selectedCount || selectedCount === 0) {
      Swal.fire({
        title: "No Items Selected",
        text: "Please select at least one item to allocate",
        icon: "warning",
      });
      return;
    }

    // Prepare allocation data (only include filled fields)
    const allocationData = {};

    if (selectedVendor) {
      const selectedVendorData = vendors.find(
        (v) => String(v.id) === String(selectedVendor),
      );

      if (selectedVendorData) {
        allocationData.partyId = selectedVendor;
        allocationData.partyName = selectedVendorData.nameEnglish || "";
      }
    }

    if (pax && pax > 0) {
      allocationData.pax = pax;
    }

    const success = onAllocate(allocationData);

    if (success) {
      Swal.fire({
        title: "Allocated",
        text: "Allocation applied successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset form
      setSelectedVendor("");
      setPax("");
    }
  };

  return (
    <div className="px-6 py-4 border-b bg-gray-50">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium text-gray-700">
          Bulk Allocate {selectedCount > 0 && `(${selectedCount} selected)`}
        </span>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <BaseSelect
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          disabled={loading}
        >
          <option value="">{loading ? "Loading..." : "Select Vendor "}</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.nameEnglish}
            </option>
          ))}
        </BaseSelect>

        <BaseInput
          type="number"
          placeholder="Enter pax "
          value={pax}
          onChange={(e) => setPax(e.target.value)}
          min="0"
        />

        <button className="btn-primary" onClick={handleAllocate}>
          Allocate
        </button>
      </div>
    </div>
  );
}
