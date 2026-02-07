import { useState, useEffect } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";
import Swal from "sweetalert2";
import { OutsideContactName } from "@/services/apiServices";

export default function AllocateRowInHouse({ onAllocate, selectedCount }) {
  const userid = localStorage.getItem("userId");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [pax, setPax] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const partyMasters = await OutsideContactName(7, userid);
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
      const vendor = vendors.find(
        (v) => String(v.id) === String(selectedVendor),
      );

      if (vendor) {
        allocationData.partyId = vendor.id;
        allocationData.partyName = vendor.nameEnglish || "";
        allocationData.number = vendor.mobileno || "";
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
      <div className="grid grid-cols-4 gap-4">
        <BaseSelect
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          disabled={loading}
        >
          <option value="">
            {loading ? "Loading vendors..." : "Select Vendor (Optional)"}
          </option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.nameEnglish || ""}
            </option>
          ))}
        </BaseSelect>

        <BaseInput
          placeholder="Enter pax (Optional)"
          value={pax}
          onChange={(e) => setPax(e.target.value)}
          type="number"
          min="0"
        />

        <button className="btn-primary" onClick={handleAllocate}>
          Allocate
        </button>
      </div>
    </div>
  );
}
