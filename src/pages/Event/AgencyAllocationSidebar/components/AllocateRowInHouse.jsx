import { useState, useEffect } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";
import { OutsideContactName } from "@/services/apiServices";

export default function AllocateRowInHouse({ onAllocate }) {
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
    if (!selectedVendor) {
      alert("Please select a vendor");
      return;
    }

    if (!pax || pax <= 0) {
      alert("Please enter a valid pax value");
      return;
    }

    // Get selected vendor details
    const vendor = vendors.find((v) => String(v.id) === String(selectedVendor));

    if (!vendor) {
      alert("Selected vendor not found");
      return;
    }

    const vendorNumber = vendor.mobileno || "";

    // Call the parent function to allocate
    const success = onAllocate({
      partyId: vendor.id,
      partyName: vendor.nameEnglish || "",
      number: vendorNumber,
      pax: pax,
    });

    // Reset fields if successful
    if (success) {
      setSelectedVendor("");
      setPax("");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b">
      <BaseSelect
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
        disabled={loading}
      >
        <option value="">
          {loading ? "Loading vendors..." : "Select Vendor"}
        </option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.nameEnglish || ""}
          </option>
        ))}
      </BaseSelect>

      <BaseInput
        placeholder="Enter pax"
        value={pax}
        onChange={(e) => setPax(e.target.value)}
        type="number"
        min="0"
      />

      <button className="btn-primary" onClick={handleAllocate}>
        Allocate
      </button>
    </div>
  );
}
